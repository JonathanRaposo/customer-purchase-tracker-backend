import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})
pool.on('connection', () => console.log('Connected'));
pool.on('error', () => console.log('Error connection to MySQL:', err));


let User = {};

User.createUser = (userData) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO?? SET?';
        pool.query(sql, ['users', userData], (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });

}
User.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM?? WHERE?? =?';
        pool.query(sql, ['users', 'email', email], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}
User.findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM?? WHERE?? =?';
        pool.query(sql, ['users', 'user_id', id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

User.findByIdAndUpdate = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE?? SET? WHERE?? =?';
        pool.query(sql, ['users', updatedData, 'user_id', id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

User.findByIdAndDelete = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM?? WHERE?? =?';
        pool.query(sql, ['users', 'user_id', id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}

export default User;

