const { Film } = require("../models");
const { Category } = require("../models");
const { Episode } = require("../models");
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
    const films = await Film.findAll({
        include: {
            model: Category,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "CategoryId", "categoryId"]
        }
    });

    res.send({ data: films });
} catch (error) {
    console.log(error);
}
};

exports.readKedua = async (req, res) => {
try {
    const { idCategory } = req.params;
    const films = await Film.findAll({
        where: {
          categoryId: idCategory
        },
        include: {
            model: Category,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "CategoryId", "categoryId"]
        }
    });

    res.send({ data: films });
} catch (error) {
    console.log(error);
}
};

exports.readKetiga = async (req, res) => {
try {

    res.sendFile(__dirname + "/public/img/")
} catch (error) {
    console.log(error);
}
};

exports.readMore = async (req, res) => {
    try {
        const films = await Film.findAll({
            include:[ {
                model: Category,
                    attributes: {
                        exclude: ["createdAt","updatedAt"]
                    }
                },
                {
                model: Episode,
                    attributes: {
                        exclude: ["createdAt","updatedAt"]}
                }
            ],
            attributes: {
                exclude: ["createdAt","updatedAt","CategoryId","categoryId"]
            }
        });

        res.send({ data: films });
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

    const categoryX = await Category.findOne({
        where: {
            id: req.body.categoryId
        },
        attributes: {
            exclude: ["createdAt","updatedAt","CategoryId","categoryId"]
        }
    });

    if ( categoryX === null ) {
        appError(res, 400, `No data matches with your request`);
    }else{
        Film.create({
            title: req.body.title,
            year: req.body.year,
            categoryId: req.body.categoryId,
            description: req.body.description,
            thumbnailFilm: req.file === undefined ? "" : req.file.filename
        }).then(newFilm => {
            res.send({ data: {
                "id": newFilm.id,
                "title": newFilm.title,
                "year": newFilm.year,
                "categoryId": categoryX,
                "description": newFilm.description,
                "thumbnailFilm": newFilm.thumbnailFilm
            }})
        })
    }

}

//////////////////////////////////////////////////////////////////////////////////////

// Detail Film
exports.readOne = async (req, res) => {
try {
    const { idFilm } = req.params;
    const userX = await Film.findOne({
        where: {
            id: idFilm
        },
        include: {
            model: Category,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "CategoryId", "categoryId"]
        }
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

// PATCH / Update Film
exports.updateOne = async (req, res) => {
    try {
        const { idFilm } = req.params;
        const userX = await Film.findOne({
            where: {
                id: idFilm
            },
            include: {
                model: Category,
                attributes: {
                    exclude: ["createdAt","updatedAt"]
                },
            },
            attributes: {
                exclude: ["createdAt","updatedAt","CategoryId","categoryId"]
            }
        });

        if ( userX === null ) {
            appError(res, 400, `No data matches with your request`);
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        userX.title = req.body.title;
        userX.year = req.body.year;
        userX.categoryId = req.body.categoryId;
        userX.description = req.body.description;
        userX.thumbnailFilm = req.file === undefined ? "" : req.file.filename;

        await userX.save();


        res.send({ data: userX });
    } catch (error) {
        console.log(error);
    }
};


// DELETE FILM
exports.delete = async (req, res) => {
try {
    const { idFilm } = req.params;

    const userX = await Film.findOne({
        where: {
            id: idFilm
        },
        attributes: {
            exclude: ["createdAt",
            "updatedAt", "name",
            "title","thumbnailFilm",
            "year","categoryId","description",
            "CategoryId"]
        }
    });

    const film = await Film.destroy({
        where: {
            id: idFilm
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
