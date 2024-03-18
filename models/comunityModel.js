const mongoose = require('mongoose')
const validator = require('validator')

const communitySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'LA comunidad debe tener un nombre.'],
        unique:true,
        trim:true,
        maxlength:[40,'El nombre de la comunidad no debe exceder los 40 carcteres.'],
        minlength:[3,'El nombre de la comunidad debe contener almenos 3 caracteres.'],
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
    linkComunidad:{
        type:String,
        required:false
    },
    descripcion:{
        type:String,
        required:true,
        maxlength:[500,'La descripción no dene superar los 500 caracteres.']

    },
    
    limiteMiembros:{
        type:Number,
        required:false,
        max:[100000,'El límite de miembros  está en 100.000']
    },
    miembros:{
        type:[String],
        default:[]
    },
    moderadores:{
        type:[String],
       
    }

})

const Community=mongoose.model('community',communitySchema)

module.exports=Community