// kenoRoutes.ts
import { Router } from "express";     
import kenoGameRoutes from "./kenoRoutes"; 
import ticketRoutes from "./ticketRoutes";
import checkGameStatusMiddleware from "../../../middlewares/checkKenoGameStatusMiddleware";

const gamePlayRoutes = Router({mergeParams: true});   
gamePlayRoutes.use('/keno', checkGameStatusMiddleware, kenoGameRoutes);
gamePlayRoutes.use('/tickets', checkGameStatusMiddleware, ticketRoutes);
 

export default gamePlayRoutes;
