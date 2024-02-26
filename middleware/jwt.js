import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

// const payload = {
//     username: 'Jonathan',
//     email: 'jonathan@gmail.com',
//     id: 2
// }
// const token = jwt.sign(
//     payload,
//     process.env.TOKEN_SECRET,
//     { algorithm: 'HS256', expiresIn: '6h' }
// )

// const request = {
//     headers: {
//         authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkpvbmF0aGFuIiwiZW1haWwiOiJqb25hdGhhbkBnbWFpbC5jb20iLCJpZCI6MiwiaWF0IjoxNzA4OTIyODM4LCJleHAiOjE3MDg5NDQ0Mzh9.ek4aksZOBu7xB2LOR2nz9NNMmVCOBeJBthBQKf1DkBs'
//     }
// }

const isAuthenticated = (req, res, next) => {
    const token = getTokenFromHeaders(req)

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    try {
        const user = jwt.verify(token, process.env.TOKEN_SECRET);
        req.payload = user;
        next();
    } catch (error) {
        console.log('JWT Error: ', error)
        return res.status(401).json({ message: 'Invalid token.' })
    }

}

function getTokenFromHeaders(req) {

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        return token;
    }
    return null;
}

export {
    isAuthenticated
}
