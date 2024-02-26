import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
pool.on('connection', () => console.log('Connected'));
pool.on('error', () => console.log('Error connection to MySQL:', err));



const deleteUser = () => {
    pool.query('DELETE FROM users WHERE email = "joan@gmail.com";', (err, result) => {
        if (err) {
            console.log('Error deleting user: ', err);
            return
        }
        if (!result.length) {
            console.log('user deleted.');
        }
    });
}

deleteUser()