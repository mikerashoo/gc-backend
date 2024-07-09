import express = require('express'); 
require('dotenv').config();

const { notFound, errorHandler, isAuthenticated } = require('../src/middlewares/authMiddleware'); 
const { isVerifiedCashier  } = require('../src/middlewares/isVerifiedCashierMiddleware'); 

import authRoutes from '../src/routes/authRoutes';
import adminRoutes from '../src/routes/adminRoutes';
import cashierRoutes from '../src/routes/cashierRoutes';
import providerRoutes from '../src/routes/providerRoutes';  
const { isVerifiedProviderAdmin } = require('../src/middlewares/provider/isVerifiedProviderAdmin'); 
 
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
app.use('/provider', isVerifiedProviderAdmin, providerRoutes);  

app.get('/test', (req, res) => {
  res.json({ message: process.env.JWT_ACCESS_SECRET });
});

app.get("/", (req, res) => res.send("Express on Vercel")); 

// Middleware to list all routes
const listRoutes = (router, parentPath = '') => {
  let routes = [];

  router.stack.forEach((middleware) => {
    if (middleware.route) {
      const routePath = parentPath + middleware.route.path;
      routes.push({
        method: Object.keys(middleware.route.methods)[0].toUpperCase(),
        path: routePath,
      });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      const nestedPath = parentPath + (middleware.regexp.source.replace(/^\\\//, '').replace(/\\\/$/, '').replace(/\\\//g, '/'));
      routes = routes.concat(listRoutes(middleware.handle, nestedPath));
    }
  });

  return routes;
};

app.get('/list-routes', (req, res) => {
  const routes = listRoutes(app._router);
  res.json(routes);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Automatically log the routes when the server starts
  const routes = listRoutes(app._router);
  // routes.forEach(route => console.log(route.method + ' ' + route.path));
});

module.exports = app;
