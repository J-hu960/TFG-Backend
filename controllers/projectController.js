const Project = require('../models/projectModel.js')
const catchAsync=require('../utils/catchAsync.js')
const APIFeatures=require('../utils/apiFeatures.js')

exports.getMyprojects=catchAsync(async(req,res,next)=>{
    console.log(req.user.id)
    const features = new APIFeatures(Project.find({createdBy:req.user.id}),req.query).filter().sort().limitFields().paginate()
 
     const projects = await features.query
     
     res.status(200).json({
         status:'Succes',
         results:projects.length,
         projects,    
     })
 
})

exports.createProject=catchAsync(async(req,res,next)=>{
        req.body.data.newProject.createdAt= Date.now()
        console.log(req.body.data.newProject)
        const newProject = await Project.create(req.body.data.newProject);
        res.status(201).json({
            status: 'Success',
            data: {
                Project: newProject
            }
        });
    } 
)
exports.getAllProjects=catchAsync(async(req,res,next)=>{
    
   
       const features = new APIFeatures(Project.find(),req.query).filter().sort().limitFields().paginate()
    
        const projects = await features.query

        res.status(200).json({
            status:'Succes',
            results:projects.length,
            projects,    
        })
    
})

exports.getOneProject=catchAsync(async(req,res, next)=>{
    
       const features = new APIFeatures(Project.find({_id:req.params.id}),req.query).limitFields()
        const Project = await features.query
        if(!Project){  res.status(404).json({
            message:'Project not found'
        })}
        res.status(200).json({
            status:'Succes',
            Project,
        })
        
} )

exports.editProject=catchAsync(async(req,res,next)=>{
  
        const editedProject = await Project.findByIdAndUpdate(req.params.id,req.body.data.newProject,{
            new:true,
            runValidators:false,
            useFindAndModify:false
        })
        res.status(200).json({
            status:'Succes',
            editedProject,
        }) 
})
exports.handleLikes=catchAsync(async(req,res,next)=>{
  
    const editedProject = await Project.findByIdAndUpdate(req.params.id,{likes:req.body.data.likes},{
        new:true,
        runValidators:false,
        useFindAndModify:false
    })
    res.status(200).json({
        status:'Succes',
        editedProject,
    }) 
})
exports.handleDislikes=catchAsync(async(req,res,next)=>{
  
    const editedProject = await Project.findByIdAndUpdate(req.params.id,{dislikes:req.body.data.dislikes},{
        new:true,
        runValidators:false,
        useFindAndModify:false
    })
    res.status(200).json({
        status:'Succes',
        editedProject,
    }) 
})

exports.deleteProject=catchAsync(async(req,res,next)=>{
  
        const deletedProject = await Project.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:'Succes',
            deletedProject,
        }) 
    } )

