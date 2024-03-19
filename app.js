const express=require('express');
const comunidadesRouter = require('./routers/comunidadesRouter')
const usuariosRouter = require('./routers/usuariosRouter')




const app = express();

app.use(express.json())
app.use(express.static(`${__dirname}/public`)) //podem accedir a tots els files dins de /public desde el navegador amb lo url + nom del file


app.use('/api/v1/comunidades',comunidadesRouter)
app.use('/api/v1/usuarios',usuariosRouter)


module.exports=app




 