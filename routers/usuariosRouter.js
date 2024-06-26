const express = require('express')
const {signUp,login,protect,forgotPassword,resetPassword,updatePassword} = require('../controllers/authController')
const {getAllUsers,getUser,updateMe,deleteMe,uploadUserPhoto,likeProject,dislikeProject} = require('../controllers/usuariosController')



const router = express.Router();
router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword',resetPassword)
router.post('/signup',signUp)
router.post('/login',login)
router.patch('/upload-photo', protect, uploadUserPhoto);
router.patch('/updateMyPassword',protect,updatePassword)
router.patch('/updateMe',protect,updateMe)//podem fer una ruta /me i fer el delete, patch i get alla
router.patch('/updateMyLikes',protect,likeProject)//podem fer una ruta /me i fer el delete, patch i get alla
router.patch('/updateMyDislikes',protect,dislikeProject)//podem fer una ruta /me i fer el delete, patch i get alla

router.delete('/deleteMe',protect,deleteMe)



router.route('/').get(protect,getAllUsers)
// .post(createUser)

// router.patch('/:id',protect,likeProject)



router.route('/user').get(protect,getUser)
// .delete(deleteUser)
module.exports=router

