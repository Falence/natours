const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res) => {
    // 1) Get tour data from collection
    const tours = await Tour.find()

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug})
        .populate({ path: 'reviews', select: 'review rating user' })

    res.status(200).render('tour', {
        tour
    })
})