const exprres = require('express');
const _ = require('underscore');

let Categoria = require('../models/categoria');
let { verificaToken , verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = exprres();


//===============
//Mostrar todas las Categorias
//===============

app.get('/categoria' , (req , res) =>{
 
        Categoria.find({})
        .sort('descripcion')
        .populate('usuario' , 'nombre email')
        .exec((err , categoria) =>{
            
            if(err) {
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            Categoria.count({}  , (err , conteo) =>{

           if(conteo === 0) {
               return res.json({
                ok:true,
               message: 'No hay Categorias'
            });
           }

                res.json({
                    ok:true,
                    categoria,
                    conteo
                });
            });
        });
});

//===============
//Mostrar todas las Categorias por ID de Usuario
//===============

app.get('/categoria/:id' , (req , res) =>{
    //Categoria.findId()

    let id = req.params.id;

    Categoria.findById(id , (err , categoriaDB) =>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        };


        res.json({
            ok:true,
          categoria: categoriaDB
        })
    });
});

//===============
//CREAR UNA NUEVA CATEGORIA
//verificaToken
//===============

app.post('/categoria' ,[ verificaToken , verificaAdmin_Role] ,  (req , res) =>{
    //regresa la nueva categoria
    //req.usuario.id
 
   /* return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        descripcion: req.body.descripcion
    }); */

    let body= req.body;
 
     let categoria= new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err , categoriaDB) =>{

        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        };

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });


    
}); 

//===============
//ACTUALIZAR LA CATEGORIA
//verificaToken
//=============
app.put('/categoria/:id' , [verificaToken , verificaAdmin_Role] , (req , res) =>{
 
    let id = req.params.id;

    let valid = [
        'descripcion',
    ];
    let body = _.pick(req.body , valid);

    options = {
    new: true,
    runValidators: true
  }

  Categoria.findByIdAndUpdate(id , body, {new : true} ,  (err , categoriaDB) =>{
      
    if(err) {
          return res.status(400).json({
            ok:false,
           err
          });
      }

      res.send({
          ok:true, 
         categoriaDB
      });
  });
}); 


//===============
//Borrar una categoria 
//verificaToken
//=============
app.delete('/categoria/:id' ,  (req , res) =>{
    //solo un administrador lo puede eliminar
    //categoria.findByIdAndRemove

    let id = req.params.id;
    let valid = [
        'descripcion'
    ];

   
  
    Categoria.findByIdAndRemove(id , (err , categoriaDB) =>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        };

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB,
            message:'Se elimino la categoria correctamente'
        });
    });
 }); 


module.exports =  app;