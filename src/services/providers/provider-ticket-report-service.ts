import db from "../../lib/db";
// import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
// import { IBasicReportSchema } from "../../utils/shared/schemas/reportSchema";

// import { endOfDay, startOfDay } from "date-fns";
// import { TicketStatus } from "@prisma/client";
// import { ICommonReport } from "../../utils/shared/shared-types/reportModels";

import { PrismaClient, TicketStatus } from '@prisma/client'
import { startOfDay, endOfDay } from 'date-fns'
import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
import { IBasicReportSchema } from "../../utils/shared/schemas/reportSchema";
import { ICommonReport } from "../../utils/shared/shared-types/reportModels";
const getReports = async (
  providerId: string,
  filterData: IBasicReportSchema
): Promise<IServiceResponse<ICommonReport>> => {
  const { endAt, startAt, agentId, branchId, cashierId, superAgentId } =
    filterData;

  const startDate = startAt
    ? startOfDay(new Date(startAt + "T00:00:00"))
    : startOfDay(new Date());
  const endDate = endAt
    ? endOfDay(new Date(endAt + "T23:59:59"))
    : endOfDay(new Date());

  const commonAgentId = agentId ?? superAgentId;
  console.log("Common Agent Id", agentId);

  const  agentQuery = commonAgentId ? {
    OR: [
      {
        id: commonAgentId ? commonAgentId : {},
      },
      {
        userName: commonAgentId ? commonAgentId : {},
      },

      {
        superAgent: {
          OR: [
            {
              id: commonAgentId ? commonAgentId : {},
            },
            {
              userName: commonAgentId ? commonAgentId : {},
            },
          ],
        },
      },
    ],
  } : {}

  const commonWhere = {
    createdAt: {
      gte: startDate,
      lte: endDate,
    },
    cashierId: cashierId ?? {},
    game: {
      branch: {
        AND: [
          {
            id: branchId ?? {},
          },
          {
            providerId,
          },

          agentQuery
        ],
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
  const netCash = remainingCash - totalMoneyToBePaid;

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
 
 
export const ProviderTicketReportService = {
  reportOfBranch: getReports,
};
