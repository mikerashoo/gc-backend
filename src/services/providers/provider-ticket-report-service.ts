import db from "../../lib/db";
import { IServiceResponse } from "../../utils/api-helpers/serviceResponse";
import { IBasicReportSchema } from "../../utils/shared/schemas/reportSchema";

import { endOfDay, startOfDay } from "date-fns";
import { TicketStatus } from "@prisma/client";
import { ICommonReport } from "../../utils/shared/shared-types/reportModels";

const getCashReports = async (
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
  console.log("Common Agent Id", commonAgentId);

  const  agentQuery = commonAgentId ? {
    OR: [
      {
        id: commonAgentId ? commonAgentId : undefined,
      },
      {
        userName: commonAgentId ? commonAgentId : undefined,
      },

      {
        superAgent: {
          OR: [
            {
              id: commonAgentId ? commonAgentId : undefined,
            },
            {
              userName: commonAgentId ? commonAgentId : undefined,
            },
          ],
        },
      },
    ],
  } : undefined

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

          {agent: agentQuery}
        ],
      },
    },
  };
 
  const [
    reportData,
    paidAmount
  ] = await Promise.all([
     
  db.ticket.groupBy({
    by: ['status'],
    where: commonWhere,
    _count: {
      id: true
    },
    _sum: {
      totalBetAmount: true,
      winAmount: true
    }
  }),

  db.ticketPayment.aggregate({
    where: {
      ticket: {
        status: TicketStatus.PAID,
        ...commonWhere
      }
    },
    _sum: {
      paidAmount: true
    }
  })
  ]);
 
  const report: ICommonReport = {
    ticket: {
      totalCount: 0,
      cancelledCount: 0,
      activeCount: 0,
      paidCount: 0,
      winnerCount: 0,
      loserCount: 0
    },
    cash: {
      totalMoneyCollected: 0,
      totalMoneyPaid: paidAmount._sum.paidAmount ?? 0,
      totalMoneyToBePaid: 0,
      remainingCash: 0,
      netCash: 0
    }
  }

  reportData.forEach(data => {
    report.ticket.totalCount += data._count.id
    
    switch (data.status) {
      case TicketStatus.CANCELLED:
        report.ticket.cancelledCount = data._count.id
        break
      case TicketStatus.ON_PLAY:
        report.ticket.activeCount = data._count.id
        report.cash.totalMoneyCollected += data._sum.totalBetAmount ?? 0
        break
      case TicketStatus.PAID:
        report.ticket.paidCount = data._count.id
        report.cash.totalMoneyCollected += data._sum.totalBetAmount ?? 0
        break
      case TicketStatus.WIN:
        report.ticket.winnerCount = data._count.id
        report.cash.totalMoneyCollected += data._sum.totalBetAmount ?? 0
        report.cash.totalMoneyToBePaid += data._sum.winAmount ?? 0
        break
      case TicketStatus.LOSE:
        report.ticket.loserCount = data._count.id
        report.cash.totalMoneyCollected += data._sum.totalBetAmount ?? 0
        break
    }
  })

  report.cash.remainingCash = report.cash.totalMoneyCollected - report.cash.totalMoneyPaid
  report.cash.netCash = report.cash.remainingCash - report.cash.totalMoneyToBePaid

  return { data: report }
};
export const ProviderTicketReportService = {
  cashReport: getCashReports,
};
