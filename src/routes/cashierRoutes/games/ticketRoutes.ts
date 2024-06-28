import {  Router } from "express";       
import { validateData } from "../../../middlewares/validationMiddleware";
import { ticketPaymentSchema, ticketByIdSchema } from "../../../utils/shared/schemas/kenoSchemas";
import { searchTIcketByUniqueId, getTodaysTickets, getKenoTicketDetail, markKenoTicketAsPaid, cancelTicket } from "../../../controllers/cashier/keno/KenoTicketController";
const ticketRoutes = Router({mergeParams: true});


ticketRoutes.get('/search', searchTIcketByUniqueId );  
ticketRoutes.get('/todays', getTodaysTickets );  
ticketRoutes.get('/detail/:ticketId',  getKenoTicketDetail);  
ticketRoutes.post('/mark-paid', validateData(ticketPaymentSchema),  markKenoTicketAsPaid);  
ticketRoutes.post('/cancel', validateData(ticketByIdSchema),  cancelTicket);  
  


export default ticketRoutes;
  