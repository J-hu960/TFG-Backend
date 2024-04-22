const User = require('../models/usuarioModel')
const AppError = require('../utils/appError.js')
const catchAsync = require('../utils/catchAsync.js')
const multer = require('multer')
const server = `http://192.168.1.35:8004`
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/img/users`);
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1];
      cb(null, `${req.user.id}-${Date.now()}.${extension}`);
    }
  });
  
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image. Please upload only images.', 400), false);
    }
  };
  
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
  }).single('photo');
  
  // Controlador para actualizar la foto de perfil del usuario
  exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
    // Subir la foto de perfil del usuario
    console.log(req.body)
    upload(req, res, async (err) => {
      if (err) {
        return next(err);
      }
  
      // Verificar si se ha subido una imagen
      if (!req.file) {
        return next(new AppError('Por favor, sube una imagen.', 400));
      }
  
      try {
        // Actualizar la foto de perfil del usuario en la base de datos
        const url = `${server}/${req.file.path}`;

        await User.findByIdAndUpdate(req.user.id, { photo:url });
  
        res.status(200).json({
          status: 'success',
          message: 'Foto de perfil actualizada exitosamente',
        });
      } catch (error) {
        next(error);
      }
    });
  });



exports.updateMe = async(req,res,next)=>{
    //1-Create error POSTS a password data

    if(req.body.password||req.body.passwordConfirm){
        return next(new AppError('Cannot reset the password here',401))
    }

    //get user

    //2-Update the document
    
    if(req.file) console.log(req.file)
    const {email,nombre,descripcion} = req.body
    let photo;
    if (req.file) {
      photo = req.file.filename;
    }

    // Actualizar los datos del usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { email, nombre, descripcion, photo }, { new: true, runValidators: true });


   

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
//Volem afegir el _id del proyecto (req.body.data) al array proyectosLikeados del usuario que rebem per params
exports.likeProject=catchAsync(async(req,res)=>{ 
    if(req.body.data.action==='like'){
        try {
            //1. Rebre id del proyecto
                const projectId = req.body.data.proyectoLikeado
           //2. Rebre usuari and update
                const user = await User.findByIdAndUpdate({_id:req.user.id},
                    { $addToSet: { proyectosLikeados: projectId },
                    useFindAndModify:false,
                 },
                   
               )
               res.status(200).json({
                status:'Success',
                data:user
            })
               console.log(user)
               
            
        } catch (error) {
            console.log(error) 
        }
    }else if(req.body.data.action==='unlike'){
        
          const projectId = req.body.data.proyectoLikeado
         
          const user = await User.findByIdAndUpdate(
            { _id: req.user.id },
            {
              $pull: { proyectosLikeados: projectId}, 
              useFindAndModify: false,
            },
          );
              res.status(200).json({
               status:'Success',
               data:user
           })
              console.log(user)
              
           
      

    }})


exports.dislikeProject=catchAsync(async(req,res)=>{ 
        if(req.body.data.action==='dislike'){
            try {
                //1. Rebre id del proyecto
                    const projectId = req.body.data.proyectoDislikeado
               //2. Rebre usuari and update
                    const user = await User.findByIdAndUpdate({_id:req.user.id},
                        { $addToSet: { proyectosDislikeados: projectId },
                        useFindAndModify:false,
                     },
                       
                   )
                   res.status(200).json({
                    status:'Success',
                    data:user
                })
                   console.log(user)
                   
                
            } catch (error) {
                console.log(error) 
            }
        }else if(req.body.data.action==='undislike'){
            
              const projectId = req.body.data.proyectoDilikeado
             
              const user = await User.findByIdAndUpdate(
                { _id: req.user.id },
                {
                  $pull: { proyectosDislikeados: projectId}, 
                  useFindAndModify: false,
                },
              );
                  res.status(200).json({
                   status:'Success',
                   data:user
               })
                  console.log(user)
                  
               
          
    
        }})
