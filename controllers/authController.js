const User = require('../models/usuarioModel.js')
const catchAsync=require('../utils/catchAsync')
const jwt=require('jsonwebtoken')
const AppError = require('../utils/appError.js')
const {promisify} = require('util')
const sendEmail = require('../utils/email.js')
const { send } = require('process')
const crypto = require('crypto')

const createSendToken=(user,statusCode,res)=>{
    const token=signToken(user._id)
    const cookieOPtions={
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
            httpOnly:true,   //so it is not modified by the browser
        }
    if(process.env.NODE_ENV='production') cookieOPtions.secure=true //we must use https
    
    res.cookie('jwt',token)
    //Remove password from output
    user.password=undefined
    res.status(statusCode).json({
        status:'success',
        token,
        data:user
    })
}

const signToken=userId=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{  
        expiresIn:process.env.JWT_EXPIRES_IN
    }) 
}
exports.signUp=catchAsync(async(req,res,next)=>{
    const {nombre,email,password,passwordConfirm,passwordChangedAt,role}=req.body
    const newUser=await User.create({
        nombre,
        email,
        password,
        passwordConfirm,
        passwordChangedAt,
        role
    })
    createSendToken(newUser,201,res)
    
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

    createSendToken(user._id,200,res)
    
}) 


exports.protect=catchAsync(async(req,res,next)=>{
    //1-Getting the token and check if its there
    let token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         token = req.headers.authorization.split(' ')[1]
        console.log(token)
    }
    if(!token) return next(new AppError('Your are not logged in',401))

    //2-Verification the token

     const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
     console.log(decoded)

     
    
    //3-CHeck if user still exists
    const usuarioExiste = await User.findById(decoded.id)
    if(!usuarioExiste) return next(new AppError('El usuario relacionado con este token ya no existe.',401))


    //4-Check if user changed password after the token was issued

    if(usuarioExiste.changedPasswordAfterToken(decoded.iat)) return next(new AppError('User recently changed password, please log in again!',401))
    
     
    //Acceso a la rutas protegidas
    req.user=usuarioExiste
    next();
})

exports.restrictTo = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)) {
            console.log(req.user)
            return next(new AppError('El usuario no tiene permisos para realizar esta accion',403))
        }
        next()

    }
}

exports.forgotPassword=async(req,res,next)=>{
    //1-Get user based on POSTed email
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new AppError('User not found',404))
    }
    //2-Generate the random token
     
    const resetUnencryptedToken =  (Math.floor(Math.random() * 100000) + 1).toString()
    user.validationCode=resetUnencryptedToken
    await user.save({validateBeforeSave:false}) //necesitamos guardarlo en la BBDD ya que solo lo hemos modificado en la funcion
    //3-Send it via email (nodemailer )
    const resetUrl = `Tu codigo para cambiar la contraseña es: ${resetUnencryptedToken}`

    const message=`Forgot your password?Submit your PATCH req w your new password and passwordConfirm to: ${resetUrl},
    if you haven't, please ignore this email.`
    try {
        await sendEmail({
            email:user.email,
            subject:'Your password reset token (10 min valid)',
            message
        })
    
        
    } catch (error) {
        user. passwordResetsToken=undefined;
        user.passwordResetsExpires=undefined;
        await user.save({validateBeforeSave:false})

        next(new AppError('There was an error sending the email',500))

    }
  
    res.status(200).json({
        status:'success',
        message:'Token send to email!'
    })



    
}

exports.resetPassword=async(req,res,next)=>{
    //1-Get user based on email
    //2-Set new password if token has not yet expired, and if there is a user

    const user = await User.findOne({
        email:req.body.email,
    }) //code has not yet expired

    if(!user){
        return next(new AppError('Not user found or validation code incorrect',400))
    }
    

    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetsToken = undefined
    user.passwordResetsExpires = undefined

    await user.save()


    //3-Update changedPasswordAt property for the user (pre(save)) -- in usuarioModel
      
    //4-log in the user(send the token)
    createSendToken(user,200,res)
    
}

exports.updatePassword = async(req,res,next)=>{
    console.log(req.user)
    const user = await User.findById(req.user.id).select('+password') //req.user viene de protect middleware
    console.log(user)
    if(! await(user.correctPassword(req.body.passwordCurrent,user.password))){
        return next(new AppError('Your current password is wrong',401))

    }
    user.password = req.body.newPassword
    user.passwordConfirm= req.body.passwordConfirm
    await user.save()

    createSendToken(user,200,res)

}



