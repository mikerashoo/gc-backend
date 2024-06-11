import {  Router } from "express";      
import { createTicket, getGameTickets,searchTIcketByKenoGameId, getKenoTicketDetail, markKenoTicketAsPayed, getTodaysTickets } from "../../controllers/keno/KenoTicketController"; 
import { validateData } from "../../middlewares/validationMiddleware";
import { createKenoTicketSchema } from "../../utils/schemas/kenoSchemas";
const kenoTicketRoutes = Router({mergeParams: true});


kenoTicketRoutes.get('/search', searchTIcketByKenoGameId );  
kenoTicketRoutes.get('/todays', getTodaysTickets );  
kenoTicketRoutes.get('/detail/:ticketId',  getKenoTicketDetail);  
kenoTicketRoutes.post('/mark-payed/:ticketId',  markKenoTicketAsPayed);  
 
kenoTicketRoutes.post('/:gameId/',  validateData(createKenoTicketSchema), createTicket);  
kenoTicketRoutes.get('/:gameId/', getGameTickets);  


export default kenoTicketRoutes;
 