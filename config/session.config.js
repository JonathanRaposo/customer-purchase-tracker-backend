import express from 'express';
import session from 'express-session';
import mySQLStoreFactory from 'express-mysql-session';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })




const mysqlSession = mySQLStoreFactory(session);

const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    createDatabaseTable: false,


}
const MySQLStore = new mysqlSession(options);

export default (app) => {
    app.set('trust proxy', 1);

    app.use(session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MySQLStore,
        cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60 * 60 * 1000 * 2
        }
    }))
}
