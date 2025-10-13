import jwt from "jsonwebtoken";
export  function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'acceso denegado' })
    }
    jwt.verify(token, process.env.JWT_SECRETO, (err, decode) => {
        if (err) {
            return res.status(403).json({ error: 'token invalido' })
        }
         req.userId = decode.id;
        next();
    })
}
