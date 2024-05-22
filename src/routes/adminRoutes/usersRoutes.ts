import {  Router } from "express";    
import { getUsers } from "../../controllers/UserController";  
const userRoutes = Router();  

// Game
userRoutes.get('/', getUsers); 

export default userRoutes;
 