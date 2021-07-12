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

// handle unhandled promise rejection error
process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION! 🔥 Shutting down...')
    server.close(() => {
        process.exit(1)
    })
})