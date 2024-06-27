 
import express = require('express'); 
require('dotenv').config();

const { notFound, errorHandler, isAuthenticated } = require('../src/middlewares/authMiddleware'); 
const { isVerifiedCashier  } = require('../src/middlewares/isVerifiedCashierMiddleware'); 

import authRoutes from '../src/routes/authRoutes';
import adminRoutes from '../src/routes/adminRoutes';
import cashierRoutes from '../src/routes/cashierRoutes';
// import kenoRoutes from '../src/routes/games/kenoRoutes';
import providerRoutes from '../src/routes/providerRoutes';  
// import gamePlayRoutes from '../src/routes/games';

 
const cors = require('cors');
const app = express();  
  
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());  
app.use('/cashier', isAuthenticated, isVerifiedCashier, cashierRoutes);   

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/provider/:providerId', providerRoutes);  
 

app.get("/", (req, res) => res.send("Express on Vercel"));
// app.get('/test', async (req, res) => { 
//     const users = await db.user.count();
//     res.json(users);
//   });
app.get('/test', (req, res) => {
  res.json({ message: process.env.JWT_ACCESS_SECRET });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 


module.exports = app; 