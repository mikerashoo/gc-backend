import { TicketStatus, UserRole } from "@prisma/client";
import db from "../../lib/db";
import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
import {
  checkDBColumnDuplicate,
  checkUserNameTaken,
} from "../../utils/api-helpers/unique-identifier-generator";
import { IUser } from "../../utils/shared/shared-types/userModels";
import {
  ISuperAgentRegisterSchema,
  IUserUpdateSchema,
} from "../../utils/shared/schemas/userSchemas";
import bcrypt = require("bcrypt");
import { ISuperAgentInfo } from "../../utils/shared/shared-types/agentModels";
import { startOfDay, endOfDay } from "date-fns";
import {
  IBasicReportSchema,
} from "../../utils/shared/schemas/reportSchema";
import {
  ICommonReport,
} from "../../utils/shared/shared-types/reportModels";

const getProviderSuperAdmins = async (
  providerId: string
): Promise<IServiceResponse<IUser[]>> => {
  const superAgents = await db.user.findMany({
    where: { agentProviderId: providerId },
  });

  return {
    data: superAgents,
  };
};

const addSuperAgent = async (
  providerId: string,
  superAgentData: ISuperAgentRegisterSchema
): Promise<IServiceResponse<IUser>> => {
  try {
    const { firstName, lastName, password, phoneNumber, userName } =
      superAgentData;

    const userNameTaken = await checkUserNameTaken(userName);
    if (userNameTaken) {
      return {
        error: "User Name is already Taken Please Use another and try again",
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const cashier = await db.user.create({
      data: {
        agentProviderId: providerId,
        firstName,
        lastName,
        password: hashedPassword,
        userName,
        phoneNumber,
        role: UserRole.SUPER_AGENT,
      },
    });

    return {
      data: cashier,
    };
  } catch (error) {
    console.log("Error while adding super agent", error);
    return {
      error: "Something went wrong",
    };
  }
};

const updateAgent = async (
  agentId: string,
  userUpdateData: IUserUpdateSchema
): Promise<IServiceResponse<IUser>> => {
  const { firstName, lastName, phoneNumber, userName } = userUpdateData;

  const userNameTaken = await checkDBColumnDuplicate("user", {
    id: { not: agentId },

    userName: {
      equals: userName.trim(),
      mode: "insensitive",
    },
  });
  if (userNameTaken) {
    return {
      error: "User Name is already Taken Please Use another and try again",
    };
  }
  const updatedUser = await db.user.update({
    where: {
      id: agentId,
    },
    data: {
      firstName,
      lastName,
      phoneNumber,
      userName,
    },
  });
  delete updatedUser.password;
  return {
    data: updatedUser,
  };
};

const getSuperAgentInfo = async (
  id: string,
  providerId: string
): Promise<IServiceResponse<ISuperAgentInfo>> => {
  const superAgent = await db.user.findFirst({
    where: {
      OR: [
        {
          id,
        },
        {
          userName: id,
        },
      ],
      agentProviderId: providerId,
    },
  });

  // Step 2: Count the number of agents
  const agentCount = await db.user.count({
    where: { id: superAgent.id },
  });

  // Step 3: Count the number of branches
  const branchCount = await db.branch.count({
    where: {
      OR: [
        { agentId: superAgent.id },
        { agent: { superAgentId: superAgent.id } },
      ],
    },
  });

  // Step 4: Combine the results into ISuperAgentInfo
  const superAgentInfo: ISuperAgentInfo = {
    ...superAgent,
    agentCount,
    branchCount,
  };
  return {
    data: superAgentInfo,
  };
};

const getReports = async (
  superAgentId: string,
  filterData: IBasicReportSchema
): Promise<IServiceResponse<ICommonReport>> => {
  const { endAt, startAt } = filterData;

  const startDate = startAt
    ? startOfDay(new Date(startAt + "T00:00:00"))
    : startOfDay(new Date());
  const endDate = endAt
    ? endOfDay(new Date(endAt + "T23:59:59"))
    : endOfDay(new Date());

  const commonWhere = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
    game: {
      branch: {
        agent: {
          OR: [{ id: superAgentId }, { superAgentId: superAgentId }],
        },
      },
    },
  };

  const [
    collectedTickets,
    toPayTickets,
    paidTickets,
    totalCount,
    cancelledCount,
    activeCount,
    winnerCount,
    paidCount,
    loserCount,
  ] = await Promise.all([
    db.ticket.aggregate({
      where: {
        status: { not: TicketStatus.CANCELLED },
        ...commonWhere,
      },
      _sum: {
        totalBetAmount: true,
      },
      _count: {
        id: true,
      },
    }),
    db.ticket.aggregate({
      where: {
        status: TicketStatus.WIN,
        ...commonWhere,
      },
      _sum: {
        winAmount: true,
      },
    }),
    db.ticketPayment.aggregate({
      where: {
        ticket: {
          status: TicketStatus.PAID,
          ...commonWhere,
        },
      },
      _sum: {
        paidAmount: true,
      },
    }),
    db.ticket.count({
      where: commonWhere,
    }),
    db.ticket.count({
      where: {
        status: TicketStatus.CANCELLED,
        ...commonWhere,
      },
    }),
    db.ticket.count({
      where: {
        status: TicketStatus.ON_PLAY,
        ...commonWhere,
      },
    }),
    db.ticket.count({
      where: {
        status: TicketStatus.WIN,
        ...commonWhere,
      },
    }),
    db.ticket.count({
      where: {
        status: TicketStatus.PAID,
        ...commonWhere,
      },
    }),
    db.ticket.count({
      where: {
        status: TicketStatus.LOSE,
        ...commonWhere,
      },
    }),
  ]);

  const totalMoneyCollected = collectedTickets._sum.totalBetAmount ?? 0;
  const totalMoneyPaid = paidTickets._sum.paidAmount ?? 0;
  const totalMoneyToBePaid = toPayTickets._sum.winAmount ?? 0;

  const remainingCash = totalMoneyCollected - totalMoneyPaid;
  const netCash = remainingCash - totalMoneyCollected;

  const report: ICommonReport = {
    ticket: {
      totalCount,
      cancelledCount,
      activeCount,
      loserCount,
      paidCount,
      winnerCount,
    },
    cash: {
      totalMoneyCollected,
      totalMoneyPaid,
      totalMoneyToBePaid,
      netCash,
      remainingCash,
    },
  };

  return {
    data: report,
  };
};

export const ProviderSuperAgentManagementService = {
  list: getProviderSuperAdmins,
  add: addSuperAgent,
  update: updateAgent,
  info: getSuperAgentInfo,
  reports: getReports,
};
