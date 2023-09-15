const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const authToken = authHeader.split(" ");
        const token = authToken ? authToken[1] : null;
        jwt.verify(token, process.env.JWTKEY, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid token!" });
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "Not authenticated!" });
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ message: "No access rights!" });
        }
    });
};

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("No access rights!");
        }
    });
};
module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
};
