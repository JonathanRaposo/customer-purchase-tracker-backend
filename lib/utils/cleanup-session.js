import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' })

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const cleanUpSession = (sessionID) => {
    const sql = `DELETE FROM sessions WHERE session_id = ?`;
    pool.query(sql, [sessionID], (error, result) => {
        if (error) {
            console.error('Error cleaning up session data: ', error)
        }
        else if (result.affectedRows > 0) {
            console.log(`Session data for session ID ${sessionID} cleaned up.`);
        } else {
            console.log('Session data not found.');
        }
    });
}

