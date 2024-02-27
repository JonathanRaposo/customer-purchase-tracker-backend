import express from 'express';
const router = express.Router();
import db from '../dbService/db-service.js'

import { isAuthenticated } from '../middleware/jwt.js';

// ADD CUSTOMER
router.post('/user/customers', isAuthenticated, async (req, res, next) => {
    const { user_id } = req.payload;
    console.log('request body: ', req.body)

    const { firstName, lastName, email } = req.body;
    const error = [];

    if (!firstName) error.push('Provide first name.');
    if (!lastName) error.push('Provide last name.');
    if (!email) error.push('Provide email.');

    if (error.length > 0) {
        return res.status(400).json({ error });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Provide a valid email address.' });
    }
    const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        user_id
    }
    try {
        await db.addCustomer(payload);
        res.status(201).json({ message: 'Customer added successfully.' })
    } catch (error) {
        console.log('Error adding customer: ', error);
        if (error.errno === 1062) {
            res.status(400).json({ message: 'Email already exist.' })
            return;
        } else {
            res.status(400).json(error)
        }

    }

})

// RETRIEVE ALL CUSTOMERS
router.get('/user/customers', isAuthenticated, async (req, res, next) => {
    const { user_id } = req.payload;
    console.log('User id: ', user_id)
    try {
        const customers = await db.getCustomers(user_id)
        res.status(200).json(customers);
    } catch (err) {
        console.error(`Error getting customers: ${err}`);
    }

});
// RETRIEVE CUSTOMER BY ID
router.get('/user/customers/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;

    try {
        const customer = await db.getCustomer(id);
        res.status(200).json(customer)
    } catch (error) {
        console.log('Error retrieving customer: ', error)
    }
});
// RETRIEVE CUSTOMER PURCHASE HISTORY
router.get('/user/customers/:id/purchases', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;

    try {
        const expenses = await db.customerPurchases(id);
        console.log('expenses: ', expenses)

        if (expenses.length === 0) {
            return res.json({ message: 'No product purchased yet.' })
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.log('Error getting customer expenses', error)
    }

});

// UPDATE  CUSTOMER BY ID
router.put('/user/customers/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const error = [];

    if (!firstName) error.push('Provide first name.');
    if (!lastName) error.push('Provide last name.');
    if (!email) error.push('Provide email.');

    if (error.length > 0) {
        return res.status(400).json({ error });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Enter a valid email format' });
    }

    const updatedData = {
        first_name: firstName,
        last_name: lastName,
        email
    }
    try {
        await db.updateCustomer(id, updatedData);
        res.status(200).json({ message: 'Customer updated.' })
    } catch (error) {
        console.log('Error updating customer:', error)
    }

})

// DELETE CUSTOMER BY ID
router.delete('/user/customers/:id', isAuthenticated, async (req, res, next) => {
    const { id } = req.params;
    console.log('params: ', id)
    try {
        await db.deleteCustomer(id);
        res.json({ message: 'Customer id # ' + id + ' removed.' })
    } catch (error) {
        console.log('Error deleting customer: ', error)
    }
})

export default router;
