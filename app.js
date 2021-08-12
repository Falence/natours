const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')


const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP! Please try again in an hour!'
})
app.use('/api', limiter) // limit the number of requests to the api routes to 100

// Body parser: reading the data from body into req.body
app.use(express.json( { limit: '10kb' } ))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())    // e.g - a user on logging in can use an email of {"$gt": ""}, which will validate successfully
                            // This middleware stops things like that

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'mazGroupSize',
        'price',
        'difficulty'
    ]
}))

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    // console.log(req.headers)
    next()
})


// Routes
app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'Falence'
    })
})

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    })
})

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker'
    })
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

// For undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
}) 

// Error handling middleware
app.use(globalErrorHandler)


module.exports = app
