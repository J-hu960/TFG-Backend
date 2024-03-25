const Community = require('../models/comunityModel.js')
const catchAsync=require('../utils/catchAsync.js')
const APIFeatures=require('../utils/apiFeatures.js')

exports.createComunity=catchAsync(async(req,res,next)=>{
        
        const newCommunity = await Community.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: {
                community: newCommunity
            }
        });
    } 
)
exports.getAllComunites=catchAsync(async(req,res,next)=>{
        const features = new APIFeatures(Community.find(),req.query).filter().sort().limitFields().paginate()
        const communities = await features.query

        res.status(200).json({
            status:'Succes',
            results:communities.length,
            communities,
            
        })
    
})

exports.getOneComunity=catchAsync(async(req,res, next)=>{
    
       const features = new APIFeatures(Community.find({_id:req.params.id}),req.query).limitFields()
        const community = await features.query
        if(!community){  res.status(404).json({
            message:'COmmunity not found'
        })}
        res.status(200).json({
            status:'Succes',
            community,
        })
        
} )

exports.editComunity=catchAsync(async(req,res,next)=>{
  
        const editedCommunity = await Community.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:false
        })
        res.status(200).json({
            status:'Succes',
            editedCommunity,
        }) 
})

exports.deleteCommunity=catchAsync(async(req,res,next)=>{
  
        const deletedCommunity = await Community.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:'Succes',
            deletedCommunity,
        }) 
    } )

