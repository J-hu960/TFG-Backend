const User = require('../models/usuarioModel')
const catchAsync = require('../utils/catchAsync.js')


exports.getAllUsers=catchAsync(async(req,res)=>{
        const users = await User.find()
        res.status(200).json({ 
           status:'success', 
           requestedAt:req.requestTime,
           results:users.length,
            data:{
                users,                                                                                   
            } 
       })
       
      
})
exports.getUser= catchAsync(async(req,res)=>{

    const user = await User.findById(req.params.id)
    res.status(500).json({
        status:'error',
        message:'This route is not yet defined',
        data:user
    })
})
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
