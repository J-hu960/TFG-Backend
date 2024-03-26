const express = require('express')
const {createProject,getAllProjects,getOneProject,editProject,deleteProject} = require('../controllers/projectController')
const {protect,restrictTo}= require('../controllers/authController')
const router = express.Router()


router.route('/')
.post(createProject)
.get(getAllProjects)


router.route('/:id')
.get(getOneProject)
.patch(editProject)
.delete(protect,restrictTo('admin'),deleteProject) 
module.exports=router