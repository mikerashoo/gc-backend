import {  Router } from "express";    
import { login, getRefreshToken } from "../controllers/auth/AuthenticationController";
import { validateData } from "../middlewares/validationMiddleware"; 
import {  userLoginSchema } from "../utils/shared/schemas/userSchemas";
import { cashierLogin } from "../controllers/cashier/CashierAuthController";
const authRoutes = Router();

// Game
authRoutes.post('/login',  login); 
authRoutes.post('/cashier-login',  validateData(userLoginSchema), cashierLogin); 

authRoutes.post('/refresh-token',  getRefreshToken); 

export default authRoutes;
 