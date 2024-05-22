import {  Router } from "express";      
import { currentKenoGameOfBranch, previousGames, getGameDetail } from "../../controllers/keno/KenoGameController";
import kenoTicketRoutes from "./kenoTicketRoutes";
const kenoGameRoutes = Router({mergeParams: true});


 
kenoGameRoutes.get('/current', currentKenoGameOfBranch);  
kenoGameRoutes.get('/previous', previousGames);  
kenoGameRoutes.get('/detail/:gameId', getGameDetail);  
kenoGameRoutes.use('/tickets', kenoTicketRoutes);  


export default kenoGameRoutes; 
 