const mongoose = require('mongoose')
const validator = require('validator')

const projectSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required:[true,'El proyecto debe tener un nombre.'],
        unique:true,
        trim:true,
        maxlength:[40,'El titulo del proyecto no debe exceder los 40 carcteres.'],
        minlength:[3,'El titulo del proyecto debe contener almenos 3 caracteres.'],
    },
    autor:{
        type:String,
        required:[true,'El proyecto debe tener un autor.'],
        unique:false,
        trim:true,
        maxlength:[40,'El autor no debe exceder los 40 carcteres.'],
        minlength:[3,'El autor del proyecto debe contener almenos 3 caracteres.'],
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    fotos:{
        type:String,
        required:false
    },
    linkWeb:{
        type:String,
        required:false
    },
    descripcion:{
        type:String,
        required:true,
        maxlength:[500,'La descripción no dene superar los 500 caracteres.']

    },
    
    cofinanciadores:{
        type:[String],
        default:[]
    },
    likes:Number,

    dislikes:Number,

    esExito:Boolean,

    meta:Number,

    recaudado:Number,
    categoria:String

})

const Project=mongoose.model('Project',projectSchema)

module.exports=Project