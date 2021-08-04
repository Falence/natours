const AppError = require('./../utils/appError')
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

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id)
    if (!review) return next(new AppError('No review exists with this ID', 404))

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    })
})