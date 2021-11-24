const { restauranteSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Restaurante = require('./models/restaurante');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Você precisa Entrar primeiro!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateRestaurante = (req, res, next) => {
    const { error } = restauranteSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const restaurante = await Restaurante.findById(id);
    if (!restaurante.author.equals(req.user._id)) {
        req.flash('error', 'Você não tem permissão para fazer isso!');
        return res.redirect(`/restaurantes/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Você não tem permissão para fazer isso!');
        return res.redirect(`/restaurantes/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}