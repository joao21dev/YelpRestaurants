const Restaurante = require('../models/restaurante');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const restaurante = await Restaurante.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    restaurante.reviews.push(review);
    await review.save();
    await restaurante.save();
    req.flash('success', 'Sua Avaliação foi adicionada!');
    res.redirect(`/restaurantes/${restaurante._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Restaurante.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Sua Avaliação foi excluída!')
    res.redirect(`/restaurantes/${id}`);
}
