const express = require('express')
const {signUp,login} = require('../controllers/authController')
const {getAllUsers,getUser} = require('../controllers/usuariosController')


const router = express.Router();

router.post('/signup',signUp)
router.post('/login',login)


router.route('/').get(getAllUsers)
// .post(createUser)


router.route('/:id').get(getUser)
// .patch(updateUser)
// .delete(deleteUser)
module.exports=router

