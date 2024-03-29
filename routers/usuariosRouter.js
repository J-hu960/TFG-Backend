const express = require('express')
const {signUp,login,protect,forgotPassword,resetPassword,updatePassword} = require('../controllers/authController')
const {getAllUsers,getUser,updateMe,deleteMe,uploadUserPhoto} = require('../controllers/usuariosController')



const router = express.Router();
router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword',resetPassword)
router.post('/signup',signUp)
router.post('/login',login)
router.patch('/updateMyPassword',protect,updatePassword)
router.patch('/updateMe',protect,uploadUserPhoto,updateMe)
router.delete('/deleteMe',protect,deleteMe)


router.route('/').get(protect,getAllUsers)
// .post(createUser)


router.route('/user').get(protect,getUser)
// .delete(deleteUser)
module.exports=router

