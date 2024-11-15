const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing in Authorization header" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Invalid token" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};

module.exports = auth;
