const jwt = require("jsonwebtoken");

exports.authMaster = (req, res, next) => {
    let header, tokenAdmin;

    if (
        !(header = req.header("Authorization")) ||
        !(tokenAdmin = header.replace("Bearer ", ""))
    )
        return res.status(401).send({ message: "Access denied!" });

    try {
        const verified = jwt.verify(tokenAdmin, process.env.SECRET_ADMIN);

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid only our Admin Master could access this path" });
    }
};
