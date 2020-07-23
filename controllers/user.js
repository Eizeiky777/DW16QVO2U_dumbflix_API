const { User } = require("../models");

appError = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: 'error',
        message,
        });
    };


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
            exclude: ["createdAt","updatedAt","password"]
        },
    });

    if ( userX === null ) {
        appError(res, 400, `No data matches with your request`);
    }else{
        res.send({ data: userX });
    }

} catch (error) {
    console.log(error);
}
};

// PATCH or Update User
exports.updateOne = async (req, res) => {
    try {
        const { id_user } = req.params;
        const userX = await User.findOne({
            where: {
                id: id_user
            },
            attributes: {
                exclude: ["createdAt","updatedAt"]
            }
        });

        userX.fullName = req.body.fullName;
        userX.email = req.body.email;
        userX.password = req.body.password;
        userX.gender = req.body.gender;
        userX.phone = req.body.phone;
        userX.address = req.body.address;
        await userX.save();

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

    if ( userX === null ) {
        appError(res, 400, `No data matches with your request`);
    }else{
        res.send({ data: userX });
    }

} catch (error){
        console.log(error);
    }
};
