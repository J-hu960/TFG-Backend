const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const validate= require('validator')



const userSchema = mongoose.Schema({
    nombre:{
        type:String,
        required:[true,'El campo nombre es obligatorio'],

    },
    email:{
        type:String,
        required:[true,'El campo email es obligatorio'],
        validator:[validate.isEmail,'Correo no valido'],
        unique:true,
        lowercase:true,
        
    },
    photo:{
        type:String,
        required:false
        
    },
    password:{
        type:String,
        required:[true,'El campo contraseña es obligatorio.'],
        maxlength:[20,'La contraseña debe tener entre 8 y 20 carcateres.'],
        minlength:[8,'La contraseña debe tener entre 8 y 20 carcateres.'],
        select:false

    },
    passwordConfirm:{
        type:String,
        required:true,   
        validate:{
            //This only works on CREATE AND SAVE !!
            validator:function(val){
                return val===this.password
            },
            message:'Las contraseñas no coinciden.'
        },
    },
    comunidadesMiembro:[String]
    
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,12) //12 == costo computacional
    this.passwordConfirm = undefined
    next()

})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

const User = mongoose.model('User',userSchema)

module.exports=User

