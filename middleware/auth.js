const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    let header, token;

    if (
        !(header = req.header("Authorization")) ||
        !(token = header.replace("Bearer ", ""))
    )
        return res.status(401).send({ message: "Access denied!" });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid you are not logged in" });
    }
};

exports.authMaster007 = (req, res, next) => {
    let header, token;

    if (
        !(header = req.header("Authorization")) ||
        !(token = header.replace("Bearer ", ""))
    )
        return res.status(401).send({ message: "Access denied!" });

    try {
        const verified = jwt.verify(token, process.env.SECRET_ADMIN007);

        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({ message: "Invalid , only admin 0 allowed to acces this part" });
    }
};
