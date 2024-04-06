const express = require('express')
const {protect,restrictTo}= require('../controllers/authController')
const {createReview,getProjectReviews,deleteReview}=require('../controllers/reviewController.js')
const router = express.Router({mergeParams:true})

router.route('/').post(createReview).get(getProjectReviews)

router.route('/:idreview').delete(deleteReview)

module.exports=router