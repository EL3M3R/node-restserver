require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({extended: false}));
 
// parse some custom thing into a Buffer
app.use(bodyParser.json());

 /***********************************************************/
 
app.get('/usuario', function (req, res) {
  res.send('Hello World usuario GET')
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    res.json({
       usuario:body
    })
});

  app.put('/usuario/:id', function (req, res) {
      let id = req.params.id;
    res.send({
        id
    })
  });

  app.delete('/usuario', function (req, res) {
    res.send('Hello World usuario DELETE')
  })
 
app.listen(process.env.PORT , ()=> {
    console.log("Escuchando al puerto :" , process.env.PORT);
}
);