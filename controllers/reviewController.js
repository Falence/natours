const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const Review = require('./../models/reviewModel')
const factory = require('./handlerFactory')


exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const reviews = await Review.find(filter)

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id

    const review = await Review.create(req.body)

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

exports.deleteReview = factory.deleteOne(Review)