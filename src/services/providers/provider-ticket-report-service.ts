import db from "../../lib/db";
import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
import { ITicketReportFilterSchema } from "../../utils/shared/schemas/reportSchema"; 

import { endOfDay, startOfDay } from "date-fns";
import { ticketDetailInclude } from "../keno/ticketLogics";
import { ICashierReport } from "../../utils/shared/shared-types/gameModels";
import { ProviderBranchService } from "./branch-info-services";
import { ProviderBranchCashierService } from "./provider-cashier-services";
import { TicketStatus } from "@prisma/client";

const getReports = async (
  providerIds: string[],
  filterData: ITicketReportFilterSchema
): Promise<IServiceResponse<ICashierReport>> => {
  // Validate branches
  const { branchIds, cashierIds, endAt, gameTypes, startAt } = filterData;

  // validate branch ids
  if (branchIds && branchIds.length > 0) {
    
    const invalidBranches = await ProviderBranchService.validateBranches(
      providerIds,
      branchIds
    );
    if (invalidBranches.error) {
      return {
        error: invalidBranches.error,
      };
    }
  }

  if (cashierIds && cashierIds.length > 0) {
    const invalidBranches = await ProviderBranchCashierService.validate(
      providerIds,
      cashierIds
    );
    if (invalidBranches.error) {
      return {
        error: invalidBranches.error,
      };
    }
  }

  let startDate = startAt
    ? startOfDay(new Date(startAt + "T00:00:00"))
    : startOfDay(new Date());
  let endDate = endAt
    ? endOfDay(new Date(endAt + "T23:59:59"))
    : endOfDay(new Date());

  let tickets = await db.ticket.findMany({
    where: {
      game: {
        branchId: branchIds && branchIds.length > 0
          ? {
              in: branchIds,
            }
          : {},
        gameType: gameTypes && gameTypes.length > 0
          ? {
              in: gameTypes,
            }
          : {},
      },
      cashierId: cashierIds && cashierIds.length > 0
        ? {
            in: cashierIds,
          }
        : {},
      createdAt: {
        gte: startAt ? startDate : undefined,
        lte: endAt ? endDate : undefined,
      },
    },
    include: ticketDetailInclude,
    orderBy: { createdAt: "desc" },
  });

  let totalMoneyCollected = 0;
  let totalMoneyPaid = 0;
  let totalMoneyToBePaid = 0;
  let totalTicketsCancelled = 0;
  let remainingCash = 0;

  tickets.forEach((ticket) => {
    if (ticket.status == TicketStatus.CANCELLED) {
      totalTicketsCancelled++;
    } else {
      totalMoneyCollected += ticket.totalBetAmount;
      if (ticket.status == TicketStatus.WIN) {
        totalMoneyToBePaid += ticket.winAmount;
      } else if (ticket.status == TicketStatus.PAID) {
        totalMoneyPaid += ticket.payment.paidAmount;
      }
    }
  });

  let cashierReport: ICashierReport = {
    remainingCash,
    totalMoneyCollected,
    totalMoneyPaid,
    totalTickets: tickets.length,
    tickets,
    totalTicketsCancelled,
    totalMoneyToBePaid,
  };

  

  return {
    data: cashierReport,
  };
};
export const ProviderTicketReportService = {
  reportOfBranch: getReports,
};
