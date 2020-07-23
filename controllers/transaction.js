const { Film } = require("../models");
const { Category } = require("../models");
const { Transaction } = require("../models");
const { User } = require("../models");
const { validationResult } = require('express-validator'); //form validation
// const { matchedData, sanitize } = require('express-validator/filter'); //sanitize form params

appError = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: 'error',
        message,
        });
    };

exports.read = async (req, res) => {
try {
    const transactions = await Transaction.findAll({
        include: {
            model: User,
            attributes: {
                exclude: ["createdAt","updatedAt","userId"]
            },
        },
        attributes: {
            exclude: ["createdAt","updatedAt","CategoryId","userId","UserId"]
        }
    });

    res.send({ data: transactions });
} catch (error) {
    console.log(error);
}
};

exports.readMore = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.findAll({
            where: {
                userId: userId
            },
            include: {
                model: User,
                attributes: {
                    exclude: ["createdAt","updatedAt","userId"]
                },
            },
            attributes: {
                exclude: ["createdAt","updatedAt","CategoryId","userId","UserId"]
            }
        });

        if (!Array.isArray(transactions) || !transactions.length) {
            appError(res, 400, `No data matches with your request`);
        }else{
            res.send({ data: transactions });
        }

    } catch (error) {
        console.log(error);
    }
    };

///////////////////////////////////////////////////////////////////////////////////////

exports.create = async (req, res) => {


  const UserX = await User.findOne({
      where: {
          id: req.body.userId
      },
      attributes: {
          exclude: ["createdAt","updatedAt","userId","UserId"]
      }
  });

    Transaction.create({
        startDate: req.body.startDate,
        dueDate: req.body.dueDate,
        userId: req.body.userId,
        status:  req.body.status,
        attache: req.file === undefined ? "d" : req.file.filename,
    }).then(newTransaction => {
        res.send({ data:{
          "startDate": newTransaction.startDate,
          "dueDate": newTransaction.dueDate,
          "userId": UserX,
          "status":  newTransaction.status,
          "attache": newTransaction.attache
        }})
    })

    // const TransactionX = await Transaction.findOne({
    //     where: {
    //         id: req.body.userId
    //     },
    //     attributes: {
    //         exclude: ["createdAt","updatedAt","CategoryId","categoryId"]
    //     }
    // });
}

//////////////////////////////////////////////////////////////////////////////////////

// Detail Transaction
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
                exclude: ["createdAt","updatedAt","userId"]
            },
        },
        attributes: {
            exclude: ["createdAt","updatedAt","CategoryId", "userId","UserId"]
        }
    });

    res.send({ data: userX });
} catch (error) {
    console.log(error);
}
};

// PATCH / Update Transaction
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

        const userSubscribe = await User.findOne({
            where: {
                id: userX.userId
            },
            attributes: {
                exclude: ["createdAt","updatedAt","UserId","userId"]
            }
        });

        if (userX.status === 'Approved'){
            userSubscribe.subscribe = 1
        }else{
            userSubscribe.subscribe = 0
        }

        await userSubscribe.save();
        await userX.save();

        const userY = await Transaction.findOne({
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

        res.send({ data: userY });
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
