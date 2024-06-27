import {  Router } from "express";    
import { login, getRefreshToken } from "../controllers/auth/AuthenticationController";
import { validateData } from "../middlewares/validationMiddleware"; 
import { cashierLoginSchema } from "../utils/schemas/userSchemas";
import { cashierLogin } from "../controllers/cashier/CashierAuthController";
const authRoutes = Router();

// Game
authRoutes.post('/login',  login); 
authRoutes.post('/cashier-login',  validateData(cashierLoginSchema), cashierLogin); 

authRoutes.post('/refresh-token',  getRefreshToken); 

export default authRoutes;
 