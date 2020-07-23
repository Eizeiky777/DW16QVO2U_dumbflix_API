const { Admin } = require("../models");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.read = async (req, res) => {
try {
    const admins = await Admin.findAll();

    res.send({ data: admins });
} catch (error) {
    console.log(error);
}
};

//////////////////////////////////////////////////////////////////////////////////////////////////
exports.create = async (req, res) => {
    try {
        const schema = Joi.object({
        name: Joi.string().alphanum().min(3).required(),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
        codemasterId: Joi.string()
        });
        const { error } = schema.validate(req.body);
    
        if (error)
        return res.status(400).send({
            error: {
            message: error.details[0].message,
            },
        });
    
        const { name, email, password, codemasterId} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminX = await Admin.create({ ...req.body, password: hashedPassword });
        const tokenAdmin = jwt.sign({ id: adminX.id }, process.env.SECRET_ADMIN);
    
        res.send({
        data: {
            email,
            tokenAdmin
        },
        });
    } catch (error) {
        console.log(error);
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////////

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
    
        const adminX = await Admin.findOne({
        where: { email },
        });
    
        if (!adminX) return res.status(400).send({ message: "Invalid Login" });
        const validPass = await bcrypt.compare(password, adminX.password);
        if (!validPass) return res.status(400).send({ message: "Invalid Login" });
        const token = jwt.sign({ id: adminX.id }, process.env.SECRET_ADMIN);

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
////////////////////////////////////////////////////////////////////////////////////////////

exports.readOne = async (req, res) => {
try {
    const { id_admin } = req.params;
    const adminX = await Admin.findOne({
        where: {
            id: id_admin
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
    });

    res.send({ data: adminX });
} catch (error) {
    console.log(error);
}
};

exports.updateOne = async (req, res) => {
    try {
        const { id_admin } = req.params;
        const adminX = await Admin.findOne({
            where: {
                id: id_admin
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        });
    
        res.send({ data: adminX });
    } catch (error) {
        console.log(error);
    }
    };

// DELETE USER
exports.delete = async (req, res) => {
try {
    const { id_admin } = req.params;

    const admin = await User.destroy({
        where: {
            id: id_admin
        }
    });

    res.send({ data: admin });
} catch (error){
        console.log(error);
    }
};