 
import express = require('express'); 
const { notFound, errorHandler, isAuthenticated } = require('../src/middlewares/authMiddleware'); 

import db from '../src/lib/db';
import authRoutes from '../src/routes/authRoutes';
import adminRoutes from '../src/routes/adminRoutes';
import cashierRoutes from '../src/routes/cashierRoutes';
import kenoRoutes from '../src/routes/kenoRoutes';
import providerRoutes from '../src/routes/providerRoutes';
 
const cors = require('cors');
const app = express();  
  
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());  
app.use('/keno', isAuthenticated, kenoRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/provider/:providerId', providerRoutes);  
app.use('/cashier', cashierRoutes);  
 

app.get("/", (req, res) => res.send("Express on Vercel"));
// app.get('/test', async (req, res) => { 
//     const users = await db.user.count();
//     res.json(users);
//   });
app.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 


module.exports = app; 