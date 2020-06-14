const { User } = require("../models");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ////////////////////////////////////////////// LOGIN PART

exports.login = async (req, res) => {
try {
    const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);

    if (error)
    res.status(400).send({
        error: {
        message: error.details[0].message,
        },
    });

    const { email, password } = req.body;

    const userX = await User.findOne({
    where: { email },
    });

    if (!userX) return res.status(400).send({ message: "Invalid Login" });
    const validPass = await bcrypt.compare(password, userX.password);
    if (!validPass) return res.status(400).send({ message: "Invalid Login" });
    const token = jwt.sign({ id: userX.id }, process.env.SECRET_KEY);

    res.send({
    data: {
        email,
        token,
    },
    });
} catch (error) {
    console.log(error);
}
};

// ////////////////////////////////////////////// REGISTER PART

exports.register = async (req, res) => {
try {
    const schema = Joi.object({
    fullName: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    gender: Joi.string().required(),
    phone: Joi.number().min(6).required(),
    address: Joi.string().min(6).required(),
    subscribe: Joi.boolean()
    });
    const { error } = schema.validate(req.body);

    if (error)
    return res.status(400).send({
        error: {
        message: error.details[0].message,
        },
    });

    const { fullName, email, password, gender, phone, address, subscribe } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userX = await User.create({ ...req.body, password: hashedPassword });
    const token = jwt.sign({ id: userX.id }, process.env.SECRET_KEY);

    res.send({
    data: {
        email,
        token
    },
    });
} catch (error) {
    console.log(error);
}
};
