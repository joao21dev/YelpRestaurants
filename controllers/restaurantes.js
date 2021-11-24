const Restaurante = require('../models/restaurante');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const restaurantes = await Restaurante.find({});
    res.render('restaurantes/index', { restaurantes })
}

module.exports.renderNewForm = (req, res) => {
    res.render('restaurantes/new');
}

module.exports.createRestaurante = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurante.location,
        limit: 1
    }).send()
    const restaurante = new Restaurante(req.body.restaurante);
    restaurante.geometry = geoData.body.features[0].geometry;
    restaurante.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    restaurante.author = req.user._id;
    await restaurante.save();
    console.log(restaurante);
    req.flash('success', 'O Restaurante foi adicionado!');
    res.redirect(`/restaurantes/${restaurante._id}`)
}

module.exports.showRestaurante = async (req, res,) => {
    const restaurante = await Restaurante.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurante) {
        req.flash('error', 'Restaurante não encontrado!');
        return res.redirect('/restaurantes');
    }
    res.render('restaurantes/show', { restaurante });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const restaurante = await Restaurante.findById(id)
    if (!restaurante) {
        req.flash('error', 'Restaurante não encontrado!');
        return res.redirect('/restaurantes');
    }
    res.render('restaurantes/edit', { restaurante });
}

module.exports.updateRestaurante = async (req, res) => {
    const { id } = req.params;
/*     console.log(req.body); */
    const restaurante = await Restaurante.findByIdAndUpdate(id, { ...req.body.restaurante });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    restaurante.images.push(...imgs);
    await restaurante.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await restaurante.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'O Restaurante foi editado!');
    res.redirect(`/restaurantes/${restaurante._id}`)
}

module.exports.deleteRestaurante = async (req, res) => {
    const { id } = req.params;
    await Restaurante.findByIdAndDelete(id);
    req.flash('success', 'O Restaurante foi Excluído!')
    res.redirect('/restaurantes');
}