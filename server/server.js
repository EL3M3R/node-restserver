require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');


// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({extended: false}));
// parse some custom thing into a Buffer
app.use(bodyParser.json());
//configuracion global de rutas
app.use( require('./routes/index'));

app.use(express.static(path.resolve(__dirname , '../public')));


  mongoose.connect(process.env.URLDB,
         /* {
          useNewUrlParser   : true ,
          useCreateIndex    : true,
          useUnifiedTopology: true 
        },*/
          (err , resp)=>{
      if(err) throw err;

      console.log("BASE DE DATOS ONLINE");
  });


app.listen(process.env.PORT , ()=> {
    console.log("Escuchando al puerto :" , process.env.PORT);
});