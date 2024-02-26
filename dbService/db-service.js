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


let db = {};

db.addCustomer = (payload) => {

    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO ?? SET?`
        pool.query(sql, ['customers', payload], (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result);
        });
    });
}

db.getCustomer = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM?? WHERE?? =?`;
        pool.query(sql, ['customers', 'customer_id', id], (error, result) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(result);
        })
    })
}

db.getCustomers = (userId) => {
    return new Promise((resolve, reject) => {
        const columns = ['first_name', 'last_name', 'customer_id']
        const sql = `SELECT?? FROM?? INNER JOIN??
        ON customers.user_id = users.user_id WHERE?? =?`;
        pool.query(sql, [columns, 'customers', 'users', 'users.user_id', userId], (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);

        });
    });
}
db.customerPurchases = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT product_name,amount, order_date
                     FROM?? INNER JOIN?? 
                     ON transactions.customer_id = customers.customer_id
                     WHERE?? = ?;`;

        pool.query(sql, ['transactions', 'customers', 'customers.customer_id', id], (error, result) => {
            if (error) {
                return reject(error)
            }
            resolve(result);
        })
    })
}

db.updateCustomer = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE?? SET? WHERE?? =?`
        pool.query(sql, ['customers', updatedData, 'customer_id', id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });
}
db.deleteCustomer = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM?? WHERE?? =?';
        pool.query(sql, ['customers', 'customer_id', id], (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
    });

}

export default db;