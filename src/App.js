const cors=require('cors')
const express = require('express')
const morgan =require('morgan');
const bodyParser=require('body-parser')
const app = express()
const cookieParser = require('cookie-parser');
const routes=require('./routes/index.js')
const path=require('path')
// require('./mongodb.js')

// app.set('port',process.env.PORT || 4200) 

app.use(morgan('dev')) 
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json({limit:"50mb"}))
app.use(cookieParser());
app.use(cors())
// app.use(routes)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin: *' ); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

app.use('/', routes); 

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
  });

module.exports=app