// kenoRoutes.ts
import { Router } from "express";     
import { validateData } from "../../../../middlewares/validationMiddleware";
import {  kenoTicketCreateSchema } from "../../../../utils/shared/schemas/kenoSchemas";
import { getKenoGameConfigurations, currentKenoGameOfShop, previousGames, getGameDetail, addKenoTicket } from "../../../../controllers/cashier/keno/KenoGameController";

const kenoGameRoutes = Router({mergeParams: true}); 
// kenoRoutes.use(isAuthenticated, isProviderAdmin);



kenoGameRoutes.get('/configurations', getKenoGameConfigurations);

 
kenoGameRoutes.get('/current', currentKenoGameOfShop);  
kenoGameRoutes.get('/previous', previousGames);   
kenoGameRoutes.get('/detail/:gameId', getGameDetail);  
kenoGameRoutes.post('/:gameId/add-ticket',  validateData(kenoTicketCreateSchema), addKenoTicket);  

// kenoGameRoutes.use('/tickets', kenoTicketRoutes);  

  
 

export default kenoGameRoutes;
