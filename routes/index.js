const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
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
  delete: deleteUser
} = require("../controllers/user");
//////////////////////////////// TRANSACTION BRO ////////////////////////////
const {
  read: checkTransaction,
  create: addTransaction,
  readOne: findTransaction,
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
  create: addFilm,
  readOne: detailFilm,
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
router.get("/admin",authMaster, checkAdmins);
router.post("/admin/add",authMaster, addAdmin);
router.post("/admin/login", loginAdmin);


// Register and login
router.post("/register", register);
router.post("/login", login); 

// Users 
router.get("/users", checkUsers);
router.get("/users/:id_user", findUser);
router.delete("/users/delete/:id_user",authMaster, deleteUser);

// Film 
router.get("/films", checkFilms);
router.get("/films/detail/:idFilm",auth, detailFilm);
router.post("/films/add", auth, [ upload.single('thumbnailFilm') ], addFilm);
router.patch("/films/edit/:idFilm", auth, [ upload.single('thumbnailFilm') ], updateFilm);
router.delete("/films/delete/:idFilm", auth, deleteFilm); 

// Category 
router.get("/category", checkCategories);
router.get("/category/:idCategory",auth, findCategories);
router.post("/category/add", auth, addCategories);
router.patch("/category/update/:idCategory", auth, updateCategories);
router.delete("/category/delete/:idCategory", auth, deleteCategories);

// Transaction
router.get("/transaction", checkTransaction);
router.get("/transaction/:idTransaction", findTransaction);
router.post("/transaction/add", auth, [ upload.single('attache') ], addTransaction);
router.patch("/transaction/edit/:idTransaction", auth, [ upload.single('attache') ], updateTransaction);
router.delete("/transaction/delete/:idTransaction",authMaster, deleteTransaction);

// Episode
router.get("/episodes", checkEpisodes);
router.get("/film/:idFilm/episodes", listEpisodes);
router.get("/episodes/detail/:idEpisode", detailEpisode);
router.get("/film/:idFilm/episodes/:idEpisode", listEpisodesDetail);

router.post("/episodes/add", auth, [ upload.single('thumbnailFilm') ], addEpisode);
router.patch("/episodes/edit/:idEpisode", auth, [ upload.single('thumbnailFilm') ], updateEpisode);
router.delete("/episodes/delete/:idEpisode", auth, deleteEpisode);


module.exports = router;
