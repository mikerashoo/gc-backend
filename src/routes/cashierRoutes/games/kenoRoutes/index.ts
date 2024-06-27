// kenoRoutes.ts
import { Router } from "express";     
import { validateData } from "../../../../middlewares/validationMiddleware";
import { createKenoTicketSchema } from "../../../../utils/schemas/kenoSchemas";
import { getKenoGameConfigurations, currentKenoGameOfBranch, previousGames, getGameDetail, addKenoTicket } from "../../../../controllers/cashier/keno/KenoGameController";

const kenoGameRoutes = Router({mergeParams: true}); 
// kenoRoutes.use(isAuthenticated, isProviderAdmin);



kenoGameRoutes.get('/configurations', getKenoGameConfigurations);

 
kenoGameRoutes.get('/current', currentKenoGameOfBranch);  
kenoGameRoutes.get('/previous', previousGames);   
kenoGameRoutes.get('/detail/:gameId', getGameDetail);  
kenoGameRoutes.post('/:gameId/add-ticket',  validateData(createKenoTicketSchema), addKenoTicket);  

// kenoGameRoutes.use('/tickets', kenoTicketRoutes);  

  
 

export default kenoGameRoutes;
