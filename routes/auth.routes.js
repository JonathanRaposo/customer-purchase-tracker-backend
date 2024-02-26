import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import User from '../dbService/user-service.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;

import { isAuthenticated } from '../middleware/jwt.js';

// SIGN UP ROUTE
router.post('/signup', async (req, res) => {
    console.log('request body: ', req.body);
    const { username, email, password } = req.body;

    const error = [];

    if (!username) error.push('Provide username.');
    if (!email) error.push('Provide Email.');
    if (!password) error.push('Provide password.');

    if (error.length > 0) {
        return res.status(400).json({ error })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Provide a valid email address.' });
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 chars and contain at least one number, one lowercase and one uppercase letter.' });
    }


    try {
        const user = await User.findByEmail(email);
        console.log('user from db: ', user)
        if (user.length > 0) {
            res.status(400).json({ message: 'User already exists.' });
            return;
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword
        }
        await User.createUser(newUser);
        const userFromDB = await User.findByEmail(email);
        if (!userFromDB.length) {
            return res.status(404).json('User not found.');

        }
        const { user_id, username: usernameFromDB, email: emailFromDB } = userFromDB[0];
        const payload = { user_id, username: usernameFromDB, email: emailFromDB };
        console.log('Payload: ', payload)
        const token = jwt.sign(
            payload,
            process.env.TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: '6h' }
        );

        res.status(201).json({ authToken: token });



    } catch (err) {
        console.log('Internal error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    console.log('request body: ', req.body);
    const { email, password } = req.body;

    const error = [];

    if (!email) error.push('Provide Email.');
    if (!password) error.push('Provide password.');

    if (error.length > 0) {
        return res.status(400).json({ error })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Provide a valid email address.' });
    }

    try {
        const foundUser = await User.findByEmail(email);

        if (!foundUser.length) {
            return res.status(401).json({ message: 'User not found.' });
        }
        const { user_id, username, password: userPassword } = foundUser[0];

        const isPasswordCorrect = bcrypt.compareSync(password, userPassword);

        if (isPasswordCorrect) {
            const payload = { user_id, username, email };

            const token = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                { algorithm: 'HS256', expiresIn: '6h' }
            )
            res.status(200).json({ authToken: token });

        }
        else {
            res.status(401).json({ message: 'Incorrect password.' })
        }

    } catch (err) {
        console.log('Error from server: ', err)
        res.status(500).json({ message: 'Internal Server Error.' })
    }
})

// TOKEN VERIFACATION POINT
router.get('/verify', isAuthenticated, (req, res) => {
    console.log('User authenticated: ', req.payload);
    res.status(200).json(req.payload);
})












export default router;
