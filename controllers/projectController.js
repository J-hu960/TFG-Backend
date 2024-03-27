const Project = require('../models/projectModel.js')
const catchAsync=require('../utils/catchAsync.js')
const APIFeatures=require('../utils/apiFeatures.js')

exports.getMyprojects=catchAsync(async(req,res,next)=>{
    console.log(req.user.email)
    const features = new APIFeatures(Project.find({autor:req.user.email}),req.query).filter().sort().limitFields().paginate()
 
     const projects = await features.query
     
     res.status(200).json({
         status:'Succes',
         results:projects.length,
         projects,    
     })
 
})

exports.createProject=catchAsync(async(req,res,next)=>{
        
        const newProject = await Project.create(req.body);
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
  
        const editedProject = await Project.findByIdAndUpdate(req.params.id,req.body,{
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

