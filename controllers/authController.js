const User = require('../models/usuarioModel.js')
const catchAsync=require('../utils/catchAsync')
const jwt=require('jsonwebtoken')
const AppError = require('../utils/appError.js')

const signToken=userId=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{  
        expiresIn:process.env.JWT_EXPIRES_IN
    }) 
}
exports.signUp=catchAsync(async(req,res,next)=>{
    const {name,email,password,passwordConfirm}=req.body
    const newUser=await User.create({
        name,
        email,
        password,
        passwordConfirm
    })
    const token = signToken(newUser._id)


    res.status(201).json({
        status:'Success',
        token,
        data:{
            user:newUser
        }
    })
})

exports.login=catchAsync(async(req,res,next)=>{
    const {email, password} = req.body

    
    if(!email || !password){
        next(new AppError('Please provide email and password',400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user || !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401))

    } 


    const token = signToken(user._id)
    res.status(200).json({
        status:'success',
        token,
        user,
    })

}) 
