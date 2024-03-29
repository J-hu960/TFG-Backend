const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const validate= require('validator')
const crypto = require('crypto')
 



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
    role:{
        type:String,
        enum:['user','admin','moderador'],
    },
    photo:{
        type:String,
        required:false,
        default:'default-avatar.jpg'
        
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
    isActive:{
        type:Boolean,
        default:true,
        select:false
    },
    passwordChangedAt:Date,
    comunidadesMiembro:[String],
    passwordResetsToken:String,
    passwordResetsExpires:Date,
    
})
userSchema.pre(/^find/,function(next){
    //poitns to the current query
    this.find({isActive:{$ne:false}})
    next()
})
userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) return next()

    this.passwordChangedAt = Date.now()-1000
    next()
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

userSchema.methods.changedPasswordAfterToken=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestamp<changedTimeStamp
    }

    return false
}

userSchema.methods.createRandomToken=function(){

   const resetToken = crypto.randomBytes(32).toString('hex');
   this.passwordResetsToken= crypto.createHash('sha256').update(resetToken).digest('hex');
   this.passwordResetsExpires= Date.now()+ 10*60*10000
   return resetToken
}


const User = mongoose.model('User',userSchema)

module.exports=User

