const sharp = require('sharp')
const multer = require('multer')
const AppError = require('../utils/appError')
const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400))
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
])

// upload.array('images', 5)

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    console.log(req.files)

    if (!req.files.imageCover || !req.files.images) return next()

    // 1) Cover Image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333) // 3:2 ratio
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`)

    // 2) Images
    req.body.images = []

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`

            await sharp(file.buffer)
                .resize(2000, 1333) // 3:2 ratio
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`)

            req.body.images.push(filename)
        })
    )

    next()
})

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = 'price,-ratingsAverage,'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}


// exports.getTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findById(req.params.id).populate('reviews')

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     })
// })

exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

// exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id)

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404))
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     })
// })

exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    
    const year = req.params.year * 1

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' }
            }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numTours: -1 }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })

})

// /tours-within/:distance/center/:latlng/unit/:unit
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [ lat, lng ] = latlng.split(',')

    // calculate radius of the sphere from the distance (km or mi) with respect to the earth in radians
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide a latitude and longitude in the format "lat,lng"',
                400
            )
        )
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    })

    res.status(200).json({
        status: 'success',
        results: tours.length, 
        data: {
            data: tours
        }
    })
})

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params
    const [ lat, lng ] = latlng.split(',')

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    if (!lat || !lng) {
        next(
            new AppError(
                'Please provide a latitude and longitude in the format "lat,lng"',
                400
            )
        )
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })
})