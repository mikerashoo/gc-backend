import { subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ICashierReport } from '../../utils/shared/shared-types/gameModels';
import { TicketStatus } from '@prisma/client';
import db from '../../lib/db';
import { ticketDetailInclude } from '../../services/keno/ticketLogics';

export const getReportForCashier = async (req: any, res: any) => {
  try {
    const branchId = req.payload.branchId;
    const cashierId = req.payload.cashierId;
    const { start, end } = req.query;

    let startDate = start ? startOfDay(new Date(start + 'T00:00:00')) : startOfDay(new Date());
    let endDate = end ? endOfDay(new Date(end + 'T23:59:59')) : endOfDay(new Date());

    let totalMoneyCollected = 0;
    let totalMoneyPaid = 0;
    let totalMoneyToBePaid = 0;
    let totalTickets = 0;
    let totalTicketsCancelled = 0;

    let ticketsCreated = await db.ticket.findMany({
      where: {
        cashierId,
        game: {
          branchId,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: ticketDetailInclude,
      orderBy: { createdAt: 'desc' },
    });

    ticketsCreated.forEach((ticket) => {
      if (ticket.status == TicketStatus.CANCELLED) {
        totalTicketsCancelled++;
      } else {
        totalMoneyCollected += ticket.totalBetAmount;
      }
      if(ticket.status == TicketStatus.WIN){
        totalMoneyToBePaid += ticket.winAmount
      }
      totalTickets++;
    });

    let ticketsPaid = await db.ticketPayment.findMany({
      where: {
        ticket: {
          status: TicketStatus.PAID,
          game: {
            branchId,
          },
          payment: {
            cashierId,
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

    console.log("Start Date selected", startDate)
    console.log("End Date selected", endDate)

    const remainingCash = totalMoneyCollected - totalMoneyPaid;

    let cashierReport: ICashierReport = {
      remainingCash,
      totalMoneyCollected,
      totalMoneyPaid,
      totalTickets,
      tickets: ticketsCreated,
      totalTicketsCancelled,
      totalMoneyToBePaid
    };
    return res.status(200).json(cashierReport);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
