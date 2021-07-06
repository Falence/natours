const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'A tour must have less than or equal to 50 characters'],
        minlength: [10, 'A tour must have more than or equal to 10 characters'],
        
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group  size'] 
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be greater than or equal 1.0'],
        max: [5, 'Rating must be less than or equal 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: [
            function(value) {
                return value < this.price
            },
            `Discount price ({VALUE}) should be lower than regular price`
        ] 
        // OR
        // validate: {
        //     validator: function(value) {
        //         return value < this.price
        //     },
        //     message: 'Discount price should be lower than regulare price'
        // }
    },
    summary: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// add virtual field when document is queried
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7
})

// Middlewares in Mongoose: document, query, aggregation and model middleware

// Document middleware
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// tourSchema.post('save', function(doc, next) {
//     console.log(doc)
//     next()
// })

// Query middleware
tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})

tourSchema.post(/^find/, function(docs, next) {
    console.log(`Query took: ${Date.now() - this.start} milliseconds`)
    next()
})

// Aggregation middleware
tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })

    console.log(this.pipeline())
    next()
})


const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour