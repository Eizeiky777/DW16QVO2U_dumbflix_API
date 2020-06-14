const { User } = require("../models");

exports.read = async (req, res) => {
try {
    const users = await User.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    });

    res.send({ data: users });
} catch (error) {
    console.log(error);
}
};

exports.create = async (req, res) => {
try {
    const user = await User.create(req.body);

    res.send({ data: user });
} catch (error) {
    console.log(error);
}
};

exports.readOne = async (req, res) => {
try {
    const { id_user } = req.params;
    const userX = await User.findOne({
        where: {
            id: id_user
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        },
    });

    res.send({ data: userX });
} catch (error) {
    console.log(error);
}
};

// DELETE USER
exports.delete = async (req, res) => {
try {
    const { id_user } = req.params;

    const userX = await User.findOne({
        where: {
            id: id_user
        }, 
        attributes: {
            exclude: ["fullName", "email", "password", "gender",
            "phone","address", "subscribe", "createdAt", "updatedAt"]
        }
    });

    const user = await User.destroy({
        where: {
            id: id_user
        }
    });

    res.send({ data: userX });
} catch (error){
        console.log(error);
    }
};