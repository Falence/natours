const catchAsync = require('./../utils/catchAsync')
const Review = require('./../models/reviewModel')

exports.createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        tour: req.body.tour,
        user: req.user._id
    })

    res.status(201).json({
        status: 'success',
        data: {
            review
        }
    })
})