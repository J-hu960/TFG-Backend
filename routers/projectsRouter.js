const express = require('express')
const {createProject,getAllProjects,getOneProject,editProject,deleteProject,getMyprojects,handleDislikes,handleLikes} = require('../controllers/projectController')
const {protect,restrictTo}= require('../controllers/authController')
const reviewRouter = require('./reviewsRouter')
const router = express.Router()



router.route('/MyProjects').get(protect,getMyprojects)
router.route('/').post(protect,createProject)
.get(getAllProjects)


router.route('/:id/likes').patch(protect,handleLikes)
router.route('/:id/dislikes').patch(protect,handleDislikes)
router.route('/:id')
.get(getOneProject)
.patch(editProject)
.delete(protect,deleteProject) 

router.use('/:idproject/reviews',reviewRouter)

router.use('/:idproject/reviews/:idreview',reviewRouter)

module.exports=router