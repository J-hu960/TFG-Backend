const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const app = require('./app')
const DB = process.env.DATABASE

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(()=>console.log('DB connected'))


const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`App running on port ${port}...`)
})


