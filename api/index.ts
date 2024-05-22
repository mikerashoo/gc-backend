 
import express = require('express'); 
const { notFound, errorHandler, isAuthenticated } = require('../src/middlewares/authMiddleware');
import cors = require('cors');

import db from '../src/lib/db';
import authRoutes from '../src/routes/authRoutes';
import adminRoutes from '../src/routes/adminRoutes';
import cashierRoutes from '../src/routes/cashierRoutes';
import kenoRoutes from '../src/routes/kenoRoutes';
import providerRoutes from '../src/routes/providerRoutes';
 

const app = express(); 


const allowedOrigins = ['*', 'file://', 'tauri://localhost', 'http://localhost:3000', 'https://getway-games-api.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

 
app.use(express.json()); 

app.use('/keno', isAuthenticated, kenoRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/provider/:providerId', providerRoutes);  
app.use('/cashier', cashierRoutes);  
 

app.get("/", (req, res) => res.send("Express on Vercel"));
app.get('/test', async (req, res) => { 
    const users = await db.user.count();
    res.json(users);
  });


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
 


module.exports = app; 