import jwt from 'jsonwebtoken';

export const authenticateToken =(req ,res ,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message: "Access token missing"});
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({message: "Invalid or expired access token"});
        }
        req.user = payload; // Attach user info to request object
        next();
    });
}