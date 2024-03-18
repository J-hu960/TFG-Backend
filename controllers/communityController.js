const { ServeCLIProgramNotFoundException } = require('ionic/lib/errors.js');
const Community = require('../models/comunityModel.js')

exports.createComunity=async(req,res,next)=>{
    try {
        const newCommunity = await Community.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: {
                community: newCommunity
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: error.message,
           
        });
    }
}

exports.getAllComunites=async(req,res,next)=>{
    
    try {
        const communities = await Community.find()

        res.status(200).json({
            status:'Succes',
            data:{
                results:communities.length,
                communities,
            }
        })
        
    } catch (error) {
        res.status(404).json({
            message:'Failed'
        })
    }
    
}

exports.getOneComunity=async(req,res,next)=>{
    try {
        const community = await Community.find({_id:req.params.id})
        if(!community){  res.status(404).json({
            message:'COmmunity not found'
        })}
        res.status(200).json({
            status:'Succes',
            community,
        })
    }
        
     catch (error) {
        res.status(404).json({
            message:'Failed'
        })
        
    }
} 

exports.editComunity=async(req,res,next)=>{
    try {
        const editedCommunity = await Community.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:false
        })
        res.status(200).json({
            status:'Succes',
            editedCommunity,
        }) 
    } catch (error) {
        res.status(400).json({
            status:'Failed',
        })
        
    }
    
}

exports.deleteCommunity=async(req,res,next)=>{
    try {
        const deletedCommunity = await Community.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status:'Succes',
            deletedCommunity,
        }) 
    } catch (error) {
        res.status(400).json({
            status:'Failed',
        })  
    }
}
