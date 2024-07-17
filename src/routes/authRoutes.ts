import {  Router } from "express";    
import { login, getRefreshToken,  validateRefreshToken } from "../controllers/auth/AuthenticationController"; 
const authRoutes = Router();

// Game
authRoutes.post('/login',  login);  

authRoutes.post('/validate-token',  validateRefreshToken); 
authRoutes.post('/refresh-token',  getRefreshToken); 

export default authRoutes;
 