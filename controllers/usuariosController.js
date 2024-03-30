const User = require('../models/usuarioModel')
const AppError = require('../utils/appError.js')
const catchAsync = require('../utils/catchAsync.js')
const multer = require('multer')


const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/img/users');
       
    },
    filename:(req,file,cb)=>{
        const extension = file.mimetype.split('/')[1];
        cb(null,`${req.user.id}-${Date.now()}.${extension}`)
    }
})

// const multerStorage = multer.memoryStorage()

const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new AppError('not an image, Please upload only images.',400),false)
    }
}


const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
})
exports.uploadUserPhoto=upload.single('photo')

exports.updateMe = async(req,res,next)=>{
    //1-Create error POSTS a password data

    if(req.body.password||req.body.passwordConfirm){
        return next(new AppError('Cannot reset the password here',401))
    }

    //2-Update the document

    const {email,nombre,descripcion} = req.body
    if(req.file){
        photo = req.file.filename
    }

    const updatedUser=await User.findByIdAndUpdate(req.user.id,{email,nombre,descripcion},{ new:true, runValidators:true})

    res.status(200).json({
        status:'Success',
        updatedUser
    })
    
}
exports.deleteMe=async(req,res,next)=>{

    if( !req.body.password){
        next(new AppError('Please provide  password',400))
    }

    const user = await User.findOne({email:req.user.email}).select('+password')

    if(!(await user.correctPassword(req.body.password,user.password))){
        return next(new AppError('Contraseña incorrecta',401))

    } 
    await User.findByIdAndDelete({_id:user._id})
    res.status(204).json({
        status:'User deleted',
        user:null
    })
}
exports.getAllUsers=catchAsync(async(req,res,next)=>{
        const users = await User.find()
        res.status(200).json({ 
           status:'success', 
           requestedAt:req.requestTime,
           results:users.length,
           users,                                                                                   
        
       })
       
      
})
exports.getUser= catchAsync(async(req,res,next)=>{
        res.status(200).json(req.user);
    });
    
exports.createUser=catchAsync(async(req,res)=>{
    const nuevoUsuario  = await User.create(req.body)
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined',
        createdUser:nuevoUsuario
    })
})

exports.updateUser=catchAsync(async(req,res)=>{
    const updatedUser = await User.findByIdAndUpdate(req.params.id,req.body)
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
})
exports.deleteUser=catchAsync(async(req,res)=>{
    const deletedUser = await User.findOneAndDelete(req.params.id)
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined'
    })
})
