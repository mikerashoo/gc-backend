import {  Router } from "express";      
import providerAdminRoutes from "./providerAdminRoutes";
import providerCrudRoutes from "./providerCrudRoutes";
const providerRoutesForAdmin = Router();  

// Game
providerRoutesForAdmin.use('/admins', providerAdminRoutes)
providerRoutesForAdmin.use('/', providerCrudRoutes)

export default providerRoutesForAdmin;
 