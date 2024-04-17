const express=require('express');
const comunidadesRouter = require('./routers/comunidadesRouter')
const projectsRouter = require('./routers/projectsRouter')
const usuariosRouter = require('./routers/usuariosRouter')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const globalErrorHandler = require('./controllers/errorController');




const app = express();
const cors = require('cors');



app.use(cors({ origin: '*' }));
//Security http headers
app.use(helmet())

const limiter = rateLimit({
    max:1000,
    windowM:60*60*1000, //100 req/h
    message:'Too many requests for this IP.'

})
//Limit request for IPs
app.use('/api',limiter)

//Body parser, reading data from req.body
app.use(express.json({limit:'10kb'}))

//Data sanitization against NoSql query injection
app.use(mongoSanitize())

//Data sanization against XSS

app.use(xss())

//Prevent parameter pollution
app.use(hpp())

//podem accedir a tots els files dins de /public desde el navegador amb lo url + nom del file
app.use(express.static(`${__dirname}/public`)) 


app.use('/api/v1/comunidades',comunidadesRouter)
app.use('/api/v1/usuarios',usuariosRouter)
app.use('/api/v1/projects',projectsRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
  
app.use(globalErrorHandler);


module.exports=app




 