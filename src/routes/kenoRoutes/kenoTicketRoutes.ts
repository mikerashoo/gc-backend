import {  Router } from "express";      
import { createTicket, getGameTickets,searchTIcketByKenoGameId } from "../../controllers/keno/KenoTicketController"; 
import { validateData } from "../../middlewares/validationMiddleware";
import { kenoTicketSchema } from "../../utils/schemas/kenoSchemas";
const kenoTicketRoutes = Router({mergeParams: true});


kenoTicketRoutes.post('/search',searchTIcketByKenoGameId );  
 
kenoTicketRoutes.post('/:gameId/',  validateData(kenoTicketSchema), createTicket);  
kenoTicketRoutes.get('/:gameId/', getGameTickets);  


export default kenoTicketRoutes;
 