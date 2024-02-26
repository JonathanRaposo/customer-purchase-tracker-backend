import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { indexRouter, customerRouter, authRouter } from './routes/index.js';

dotenv.config();
const app = express();

import configureMiddleware from './config/index.js'
configureMiddleware(app);


// Routes
app.use('/api', indexRouter);
app.use('/api', customerRouter);
app.use('/auth', authRouter)



// error handling middleware
app.use((req, res, next) => [
    res.status(404).json({ message: 'Route not found' })
])


export default app;