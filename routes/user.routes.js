import express from 'express';
import bcrypt from 'bcrypt';
const router = express.Router();
import User from '../dbService/user-service.js';
import db from '../dbService/db-service.js';
import { customerIdExtractor } from '../lib/utils/id-extractor.js';

const saltRounds = 10;
import { isAuthenticated } from '../middleware/jwt.js';

router.get('/users/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const userFromDB = await User.findById(id);
    if (!userFromDB.length) {
        return res.status(404).json({ message: `User with id ${id} was not found.` });
    }

    const { username, email } = userFromDB[0];

    res.status(200).json({ username, email });


});

router.put('/users/:id', isAuthenticated, async (req, res) => {
    const { username, email } = req.body;
    const { user_id } = req.payload;

    const error = [];

    if (!username) error.push('Provide username.');
    if (!email) error.push('Provide email.');

    if (error.length > 0) {
        return res.status(400).json({ error });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Enter a valid email format' });
    }

    const updatedData = {
        username,
        email
    }
    try {
        const result = await User.findByIdAndUpdate(user_id, updatedData);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Account was successfully updated.' })
        }
    } catch (error) {
        console.log('Error updating user account: ', error)

    }
});

router.put('/users/:id/password', isAuthenticated, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.params;

    const userFromDB = await User.findById(id);

    if (!userFromDB.length) {
        return res.status(404).json({ message: 'User not found.' })
    }
    const [{ password: userPassword }] = userFromDB;
    console.log('user current password: ', userPassword);

    const isPasswordCorrect = bcrypt.compareSync(currentPassword, userPassword);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Your current password doesn't match our records. Please try again." });
    }

    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(newPassword, salt)

        const result = await User.findByIdAndUpdate(id, { password: hashedPassword });
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Password was successfully updated.' })
        }

    } catch (error) {
        console.log('Error updating password: ', error);
    }

});

router.delete('/users/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const userFromDB = await User.findById(id);
    if (!userFromDB.length) {
        return res.status(404).json({ message: `User with id ${id} was not found.` })
    }
    // Delete first user's customers before deleting user since customers table has a foreign key constraint.
    const customers = await db.getCustomers(id);
    const customerIds = customerIdExtractor(customers)

    try {
        if (customerIds.length > 0) {
            console.log('IDS: ', customerIds)
            const result = await db.deleteManyCustomers(customerIds);
            console.log('result:', result)
            if (result.affectedRows > 0) {
                const result = await User.findByIdAndDelete(id);
                res.status(200).json({ message: 'Account deleted.' });
            }
        } else {
            await User.findByIdAndDelete(id);
            res.status(200).json({ message: 'Account deleted.' });
        }
    } catch (error) {
        console.log('Error deleting user: ', error)
    }

})


export default router;