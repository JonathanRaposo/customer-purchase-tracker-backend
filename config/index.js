
import express from 'express';
import cors from 'cors';
import logger from 'morgan';


export default (app) => {
    app.use(logger('dev'));
    app.use(cors({
        origin: '*'
        // credentials: true
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))
}