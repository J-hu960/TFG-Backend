const Project = require('../models/projectModel.js')
const catchAsync=require('../utils/catchAsync.js')
const APIFeatures=require('../utils/apiFeatures.js')

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
    let features;
    const {categoria,titulo} = req.query
    if(categoria && titulo){
         features = new APIFeatures(Project.find({categoria:categoria,titulo:titulo}),req.query).filter().sort().limitFields().paginate() 
    }else if(categoria){
        features = new APIFeatures(Project.find({categoria:categoria}),req.query).filter().sort().limitFields().paginate() 
   }else if(titulo){
    features = new APIFeatures(Project.find({titulo:titulo}),req.query).filter().sort().limitFields().paginate() 
}
    else{
         features = new APIFeatures(Project.find(),req.query).filter().sort().limitFields().paginate()
    }
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

