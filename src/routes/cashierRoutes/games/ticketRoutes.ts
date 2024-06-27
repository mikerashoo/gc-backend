import {  Router } from "express";       
import { validateData } from "../../../middlewares/validationMiddleware";
import { ticketPaymentSchema, ticketIdSchema } from "../../../utils/schemas/kenoSchemas";
import { searchTIcketByUniqueId, getTodaysTickets, getKenoTicketDetail, markKenoTicketAsPaid, cancelTicket } from "../../../controllers/cashier/keno/KenoTicketController";
const ticketRoutes = Router({mergeParams: true});


ticketRoutes.get('/search', searchTIcketByUniqueId );  
ticketRoutes.get('/todays', getTodaysTickets );  
ticketRoutes.get('/detail/:ticketId',  getKenoTicketDetail);  
ticketRoutes.post('/mark-paid', validateData(ticketPaymentSchema),  markKenoTicketAsPaid);  
ticketRoutes.post('/cancel', validateData(ticketIdSchema),  cancelTicket);  
  


export default ticketRoutes;
  