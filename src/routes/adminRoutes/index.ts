import {  Router } from "express";     
import userRoutes from "./usersRoutes"; 
import providerRoutesForAdmin from "./providers";
const { isAuthenticated } = require('../../middlewares/authMiddleware');
const { isAdmin } = require('../../middlewares/adminMiddleware');
const adminRoutes = Router(); 
adminRoutes.use(isAuthenticated, isAdmin);

// Game
adminRoutes.use('/providers', providerRoutesForAdmin)
adminRoutes.use('/users', userRoutes)

export default adminRoutes;
 