const express = require('express');
const router = express.Router();
const restaurantes = require('../controllers/restaurantes');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateRestaurante } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Restaurante = require('../models/restaurante');

router.route('/')
    .get(catchAsync(restaurantes.index))
    .post(isLoggedIn, upload.array('image'), validateRestaurante, catchAsync(restaurantes.createRestaurante))


router.get('/new', isLoggedIn, restaurantes.renderNewForm)

router.route('/:id')
    .get(catchAsync(restaurantes.showRestaurante))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateRestaurante, catchAsync(restaurantes.updateRestaurante))
    .delete(isLoggedIn, isAuthor, catchAsync(restaurantes.deleteRestaurante));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(restaurantes.renderEditForm))



module.exports = router;