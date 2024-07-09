import {  Router } from "express";    
import { login, getRefreshToken, cashierLogin, providerAdminLogin, validateRefreshToken } from "../controllers/auth/AuthenticationController";
import { validateData } from "../middlewares/validationMiddleware"; 
import {  userLoginSchema } from "../utils/shared/schemas/userSchemas"; 
const authRoutes = Router();

// Game
authRoutes.post('/login',  login); 
authRoutes.post('/cashier-login',  validateData(userLoginSchema), cashierLogin); 
authRoutes.post('/provider-admin-login',  validateData(userLoginSchema), providerAdminLogin); 

authRoutes.post('/validate-token',  validateRefreshToken); 
authRoutes.post('/refresh-token',  getRefreshToken); 

export default authRoutes;
 