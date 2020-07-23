const { Episode } = require("../models");
const { Film } = require("../models");
const { Category } = require("../models");
// const { validationResult } = require('express-validator'); //form validation
// const { matchedData, sanitize } = require('express-validator/filter'); //sanitize form params
appError = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: 'error',
        message,
        });
    };


exports.read = async (req, res) => {
try {
    const episodes = await Episode.findAll({
        include: {
            model: Film,
                include: {
                    model: Category,
                    attributes: {
                        exclude: ["createdAt","updatedAt","categoryId","CategoryId"]
                    }
                },
            attributes: {
                exclude: ["createdAt","updatedAt","categoryId","CategoryId"]
            },
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "filmId","FilmId"]
        }
    });

    res.send({ data: episodes });
} catch (error) {
    console.log(error);
}
};

exports.listed = async (req, res) => {
    try {
        const { idFilm } = req.params;

        const episodes = await Episode.findAll({
            where: {
                filmId: idFilm
            },
            include: {
                model: Film,
                    include: {
                        model: Category,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                attributes: {
                    exclude: ["createdAt", "updatedAt", "CategoryId", "categoryId"]
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "FilmId", "filmId"]
            }
        });

        if (!Array.isArray(episodes) || !episodes.length) {
            appError(res, 400, `No data matches with your request`);
        }else{
            res.send({ data: episodes });
        }

    } catch (error) {
        console.log(error);
    }
    };

///////////////////////////////////////////////////////////////////////////////////////

exports.create = async (req, res) => {

    Episode.create({
        title: req.body.title,
        linkFilm: req.body.linkFilm,
        filmId: req.body.filmId,
        thumbnailFilm: req.file === undefined ? "" : req.file.filename,
    }).then(newEpisode => {
        res.json({
            "data": newEpisode
        })
    })
}

//////////////////////////////////////////////////////////////////////////////////////

// Detail Episode
exports.readOne = async (req, res) => {
try {
    const { idEpisode } = req.params;
    const userX = await Episode.findOne({
        where: {
            id: idEpisode
        },
        include: {
            model: Film,
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
        },
        attributes: {
            exclude: ["createdAt","updatedAt","CategoryId","categoryId","filmId","FilmId"]
        }
    });

    res.send({ data: userX });
} catch (error) {
    console.log(error);
}
};

// Detail Episode more detailllllllllllllllllllll
exports.readMore = async (req, res) => {
    try {

        const { idFilm, idEpisode } = req.params;

        const userX = await Episode.findOne({
            where: {
                id: idEpisode,
                filmId: idFilm
            },
            include: {
                model: Film,
                    include: {
                        model: Category,
                        attributes: {
                            exclude: ["createdAt","updatedAt","categoryId","CategoryId"]
                        }
                    },
                attributes: {
                    exclude: ["createdAt","updatedAt","categoryId","CategoryId"]
                },
            },
            attributes: {
                exclude: ["createdAt","updatedAt","CategoryId","categoryId","filmId","FilmId"]
            }
        });

        res.send({ data: userX });
    } catch (error) {
        console.log(error);
    }
    };

// PATCH / Update Episode
exports.updateOne = async (req, res) => {
    try {
        const { idEpisode } = req.params;
        const userX = await Episode.findOne({
            where: {
                id: idEpisode
            },
            include: {
                model: Film,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "CategoryId", "categoryId"]
                },
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "FilmId", "filmId"]
            }
        });

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


// DELETE Episode
exports.delete = async (req, res) => {
try {
    const { idEpisode } = req.params;

    const userX = await Episode.findOne({
        where: {
            id: idEpisode
        },
        attributes: {
            exclude: ["createdAt",
            "updatedAt","title","thumbnailFilm","linkFilm",
            "year","categoryId","description",
            "CategoryId","filmId","FilmId"]
        }
    });

    const film = await Episode.destroy({
        where: {
            id: idEpisode
        }
    });

    res.send({ data: userX });
} catch (error){
        console.log(error);
    }
};
