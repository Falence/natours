const express = require('express')
const viewController = require('./../controllers/viewController')
const authController = require('./../controllers/authController')

const router = express.Router()

router.get('/', viewController.getOverview)
router.get('/tours/:slug', authController.protect, viewController.getTour)
router.get('/login', viewController.getloginForm)

module.exports = router