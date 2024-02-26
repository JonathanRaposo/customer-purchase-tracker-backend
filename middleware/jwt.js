import jwt from 'jsonwebtoken';


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
