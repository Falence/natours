const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!!'))


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App running on port: ${port}...`)
})

// handle unhandled promise rejection error || For asynchronous code
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 🔥 Shutting down...')
    console.log(err)
    server.close(() => {
        process.exit(1)
    })
})

// handle uncaught exceptions || For synchronous code
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 🔥 Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })    
})

