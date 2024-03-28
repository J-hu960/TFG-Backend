const express = require('express')
const {createProject,getAllProjects,getOneProject,editProject,deleteProject,getMyprojects} = require('../controllers/projectController')
const {protect,restrictTo}= require('../controllers/authController')
const router = express.Router()

router.route('/MyProjects').get(protect,getMyprojects)
router.route('/').post(protect,createProject)
.get(protect,getAllProjects)


router.route('/:id')
.get(getOneProject)
.patch(editProject)
.delete(protect,deleteProject) 
module.exports=router