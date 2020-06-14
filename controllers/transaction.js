const { Film } = require("../models");
const { Category } = require("../models");
const { Transaction } = require("../models");
const { User } = require("../models");
const { validationResult } = require('express-validator'); //form validation
// const { matchedData, sanitize } = require('express-validator/filter'); //sanitize form params

exports.read = async (req, res) => {
try {
    const transactions = await Transaction.findAll({
        include: {
            model: User,
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"]
            },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "CategoryId", "userId", "UserId"]
        }
    });

    res.send({ data: transactions });
} catch (error) {
    console.log(error);
}
}; 

///////////////////////////////////////////////////////////////////////////////////////

exports.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    Transaction.create({
        startDate: req.body.startDate,
        dueDate: req.body.dueDate,
        userId: req.body.userId,
        status: req.body.status,
        attache: req.file === undefined ? "" : req.file.filename,
    }).then(newTransaction => {
        res.json({
            "data": newTransaction
        })
    })
}

//////////////////////////////////////////////////////////////////////////////////////

// Detail Film
exports.readOne = async (req, res) => {
try {
    const { idTransaction } = req.params;
    const userX = await Transaction.findOne({
        where: {
            id: idTransaction
        },
        include: {
            model: User,
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"]
            },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "CategoryId",  "userId", "UserId"]
        }
    });

    res.send({ data: userX });
} catch (error) {
    console.log(error);
}
};

// PATCH / Update Film
exports.updateOne = async (req, res) => {
    try {
        const { idTransaction } = req.params;
        const userX = await Transaction.findOne({
            where: {
                id: idTransaction
            },
            include: {
                model: User,
                attributes: {
                    exclude: ["createdAt","updatedAt","userId"]
                },
            }, 
            attributes: {
                exclude: ["createdAt","updatedAt","UserId","userId"]
            }
        });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        userX.startDate = req.body.startDate;
        userX.dueDate = req.body.dueDate;
        userX.userId = req.body.userId;
        userX.status = req.body.status;
        userX.attache = req.file === undefined ? "" : req.file.filename;

        await userX.save();

        
        res.send({ data: userX });
    } catch (error) {
        console.log(error);
    }
    };


// DELETE FILM
exports.delete = async (req, res) => {
try {
    const { idTransaction } = req.params;

    const userX = await Transaction.findOne({
        where: {
            id: idTransaction
        },
        attributes: {
            exclude: ["createdAt","updatedAt","attache","status","startDate","dueDate","UserId","userId"]
        }
    });
    
    const transactionX = await Transaction.destroy({
        where: {
            id: idTransaction
        }
    });

    res.send({ data: userX });
} catch (error){
        console.log(error);
    }
};