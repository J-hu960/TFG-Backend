const mongoose = require('mongoose')

const reviewModel = new mongoose.Schema({

    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    descripcion:{
        type:String,
        required:[true,'El proyecto debe tener una descripcion'],
        maxlength:[500,'La descripción no dene superar los 500 caracteres.']

    },

    proyecto:{
        type:mongoose.Schema.ObjectId,
        ref:'Project'

    },
   
    createdBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }

})

reviewModel.pre(/^find/,function(next){
    this.populate({
        path:'createdBy', 
        select:'nombre'
    })
    next()
})
reviewModel.index({createdBy:1,proyecto:1},{unique:true})

const Review=mongoose.model('Review',reviewModel)

module.exports=Review