const express = require('express')
const viewController = require('./../controllers/viewController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.get('/', authController.isLoggedIn, viewController.getOverview)
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour)
router.get('/signup', authController.isLoggedIn, viewController.getSingupForm)
router.get('/login', authController.isLoggedIn, viewController.getloginForm)
router.get('/me', authController.protect, viewController.getAccount)

router.post('/submit-user-data', authController.protect, viewController.updateUserData) // when submitting form directly (without API)

module.exports = router
