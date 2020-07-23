const express = require("express");
const router = express.Router();
const { auth, authMaster007 } = require("../middleware/auth");
const { authMaster } = require("../middleware/authMaster");

const multer  = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadDir = '/img/';
const uploadDirX = '/xxx/';

const storage = multer.diskStorage({
    destination: "./public" + uploadDir,
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)

        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
})

const upload = multer({storage: storage, dest: uploadDir });
const up = multer({storage: storage, dest: uploadDirX });

///////////////////////////////// Percobaan AXIOS /////////////////////
const { create: uploadX } = require("../controllers/mosh");
router.post("/mosh", [ up.array('hore') ], uploadX);

//////////////////////////////// USER BRO ////////////////////////////
const {
  read: checkUsers,
  readOne: findUser,
  delete: deleteUser,
  updateOne: updateUser,
} = require("../controllers/user");
//////////////////////////////// TRANSACTION BRO ////////////////////////////
const {
  read: checkTransaction,
  create: addTransaction,
  readOne: findTransaction,
  readMore: findTransactionMany,
  updateOne: updateTransaction,
  delete: deleteTransaction
} = require("../controllers/transaction");
//////////////////////////////// CATEGORY BRO ////////////////////////
const {
  read: checkCategories,
  create: addCategories,
  readOne: findCategories,
  updateOne: updateCategories,
  delete: deleteCategories
} = require("../controllers/category");
//////////////////////////////// FILM BRO ////////////////////////////
const {
  read: checkFilms,
  readKedua: checkFilmsX,
  readKetiga: checkFilmsY,
  create: addFilm,
  readOne: detailFilm,
  readMore: fullDetailFilm,
  updateOne: updateFilm,
  delete: deleteFilm
} = require("../controllers/film");
//////////////////////////////// EPISODE BRO /////////////////////////
const {
  read: checkEpisodes,
  create: addEpisode,
  readOne: detailEpisode,
  updateOne: updateEpisode,
  delete: deleteEpisode,
  listed: listEpisodes,
  readMore: listEpisodesDetail
} = require("../controllers/episode");

/////////////////////////////// REGISTER & LOGIN ////////////////////
const { register, login } = require("../controllers/auth");

///////////////////////////// ADMIN ////////////////////////////////
const {
  read: checkAdmins,
  create: addAdmin,
  login: loginAdmin,
  updateOne: updateAdmin,
  delete: deleteAdmin
} = require("../controllers/admin");

// Admin
router.get("/admin",authMaster007, checkAdmins);
router.post("/admin/add",authMaster007, addAdmin);
router.post("/admin/login", loginAdmin);


// Register and login
router.post("/register", register);
router.post("/login", login);

// Users
router.get("/users", checkUsers);
router.get("/users/:id_user", findUser);
router.patch("/users/edit/:id_user", authMaster007, updateUser);
router.delete("/users/delete/:id_user", authMaster007, deleteUser);

// Film
router.get("/films", checkFilms);
router.get("/films/:idCategory", checkFilmsX);
router.get("/films/public", checkFilmsY);
router.get("/films/detail/:idFilm", detailFilm);
router.get("/films/episodes", fullDetailFilm);
router.post("/films/add", authMaster007, [ upload.single('thumbnailFilm') ], addFilm);
router.patch("/films/edit/:idFilm", authMaster007, [ upload.single('thumbnailFilm') ], updateFilm);
router.delete("/films/delete/:idFilm", authMaster007, deleteFilm);

// Category
router.get("/category", checkCategories);
router.get("/category/:idCategory", findCategories);
router.post("/category/add", authMaster007, addCategories);
router.patch("/category/update/:idCategory", authMaster007, updateCategories);
router.delete("/category/delete/:idCategory", authMaster007, deleteCategories);

// Transaction
router.get("/transaction",authMaster007, checkTransaction);
router.get("/transaction/:idTransaction", auth, findTransaction);
router.get("/transaction/listedUserId/:userId", auth, findTransactionMany);
router.post("/transaction/add", auth, [upload.single('attache')] , addTransaction);
router.patch("/transaction/edit/:idTransaction", authMaster007, [ upload.single('attache') ], updateTransaction);
router.delete("/transaction/delete/:idTransaction", authMaster007, deleteTransaction);

// Episode
router.get("/episodes", auth, checkEpisodes);
router.get("/film/:idFilm/episodes", listEpisodes);
router.get("/episodes/detail/:idEpisode", auth, detailEpisode);
router.get("/film/:idFilm/episodes/:idEpisode", auth, listEpisodesDetail);
router.post("/episodes/add", authMaster007, [ upload.single('thumbnailFilm') ], addEpisode);
router.patch("/episodes/edit/:idEpisode", authMaster, [ upload.single('thumbnailFilm') ], updateEpisode);
router.delete("/episodes/delete/:idEpisode", authMaster007, deleteEpisode);


module.exports = router;
