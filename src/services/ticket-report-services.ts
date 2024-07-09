import { endOfDay, startOfDay } from "date-fns";
import { ICashierReport } from "../utils/shared/shared-types/gameModels";
import db from "../lib/db";
import { ticketDetailInclude } from "./keno/ticketLogics";
import { TicketStatus } from "@prisma/client";

export const getTicketReportsForBranches = async (
  branchIds: string[],
  filterData: {
    start?: any;
    end?: any;
  }
): Promise<ICashierReport> => {
  const { start, end } = filterData;

  let startDate = start
    ? startOfDay(new Date(start + "T00:00:00"))
    : startOfDay(new Date());
  let endDate = end
    ? endOfDay(new Date(end + "T23:59:59"))
    : endOfDay(new Date());

  let totalMoneyCollected = 0;
  let totalMoneyPaid = 0;
  let totalMoneyToBePaid = 0;
  let totalTickets = 0;
  let totalTicketsCancelled = 0;

  const branches = await db.branch.findMany({
    where: {
      id: {
        in: branchIds,
      },
    },
    select: {
      cashiers: {
        select: {
          id: true,
        },
      },
    },
  });
  let cashierIds = [];
  branches.forEach((branch) => {
    cashierIds.push(...branch.cashiers.map((cs) => cs.id));
  });

  console.log("Cashier Ids to filter", cashierIds)

  let ticketsCreated = await db.ticket.findMany({
    where: {
      cashierId: {
        in: cashierIds,
      },
      createdAt: { 
        gte: start ? startDate : undefined,
        lte: end ? endDate : undefined,
      },
    },
    include: ticketDetailInclude,
    orderBy: { createdAt: "desc" },
  });

  ticketsCreated.forEach((ticket) => {
    if (ticket.status == TicketStatus.CANCELLED) {
      totalTicketsCancelled++;
    } else {
      totalMoneyCollected += ticket.totalBetAmount;
    }
    if (ticket.status == TicketStatus.WIN) {
      totalMoneyToBePaid += ticket.winAmount;
    }
    totalTickets++;
  });

  let ticketsPaid = await db.ticketPayment.findMany({
    where: {
      ticket: {
        status: TicketStatus.PAID,
        game: {
          branchId: {
            in: branchIds,
          },
        },
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  ticketsPaid.forEach((ticketPaid) => {
    totalMoneyPaid += ticketPaid.paidAmount;
  });

  console.log("Start Date selected", startDate);
  console.log("End Date selected", endDate);

  const remainingCash = totalMoneyCollected - totalMoneyPaid;

  let cashierReport: ICashierReport = {
    remainingCash,
    totalMoneyCollected,
    totalMoneyPaid,
    totalTickets,
    tickets: ticketsCreated,
    totalTicketsCancelled,
    totalMoneyToBePaid,
  };
  return cashierReport;
};
