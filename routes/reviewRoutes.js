const express = require('express')
const reviewController = require('./../controllers/reviewController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.post('/', authController.protect, reviewController.createReview)

module.exports = router