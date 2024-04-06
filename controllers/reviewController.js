
const Review = require('../models/reviewModel.js')
const catchAsync=require('../utils/catchAsync.js')
const APIFeatures=require('../utils/apiFeatures.js')
const AppError = require('../utils/appError.js')

// .get(getProjectReviews)

// router.route('/:idreview').delete(deleteReview)


exports.createReview = async(req,res,next)=>{
    try {
       
         req.body.data.createdAt= Date.now()
         req.body.data.proyecto = req.params.idproject
         req.body.data.createdBy = req.body.data.userid
         const userAndPost = await Review.find({
            proyecto:req.body.data.proyecto,
            createdBy:req.body.data.createdBy 
            })
        if(userAndPost.length>0){
            return new AppError('No puede poner 2 reseñas al mismo proyecto',401)
        }
         const newReview = await Review.create(req.body.data)
         console.log('Success')
    
        res.status(201).json({
            status:'Succes',
            review:newReview
        })
        
    } catch (error) {
        console.log(error)
    }
   
    
}

exports.getProjectReviews= async(req,res,next)=>{
    const propjectID = req.params.idproject
    const reviews = await Review.find({proyecto:propjectID})
    res.status(200).json({
        status:'Succes',
        data:reviews
    })
}

exports.deleteReview=async(req,res,next)=>{
    const reviewId = req.params.idreview
    const deletedReview = await Review.findByIdAndDelete({_id:reviewId})
    res.status(201).json({
        message:'Succes',
        review:deletedReview
    })
}