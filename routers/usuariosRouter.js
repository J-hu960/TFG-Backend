const express = require('express')
const {signUp,login,protect,forgotPassword,resetPassword,updatePassword} = require('../controllers/authController')
const {getAllUsers,getUser} = require('../controllers/usuariosController')


const router = express.Router();
router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)
router.post('/signup',signUp)
router.post('/login',login)
router.patch('/updateMyPassword',protect,updatePassword)



router.route('/').get(protect,getAllUsers)
// .post(createUser)


router.route('/:id').get(getUser)
// .delete(deleteUser)
module.exports=router

