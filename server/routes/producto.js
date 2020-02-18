const express = require('express');
const { verificaToken} = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();

let Producto = require('../models/producto');
/**
 * 
 * Obtener Productos
 * 
 **/

 app.get('/producto' , (req  ,  res)=>{
    //traer todos los productos
    //populate: usuario categoria
    //paginado

    Producto.find({})
            .populate('usuario categoria')
            .exec( ( err , producto) =>{
                if(err){
                    return res.status(400).json({
                        ok:false, 
                        err
                    });
                };

                Producto.count({ } , (err , conteo) =>{
                    if(err){
                        return res.status(500).json({
                            ok:false, 
                            err
                        });
                    };
   
 
                    res.json({
                        ok:true,
                        producto,
                        conteo
                    });

                });
            });

 });

/**
 *  
 * Obtener Productos por ID
 * 
 **/

 app.get('/producto/:id' , (req , res) =>{
    //populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id  , (err , productoDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err
            }); 
        };


        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            }); 
        }

        res.json({
            ok:true,
            producto: productoDB
        });
    }).populate('usuario categoria');
    
 });


 /**
 *  
 * Crear un Nuevo Producto
 * 
 **/

app.post('/producto'  ,verificaToken, (req , res) =>{
    //grabar el usuario
    //grabar una categoria de listado
 
 
let body = req.body;

let producto = new Producto({
    usuario: req.usuario._id,
    nombre : body.nombre,
    precioUni: body.precioUni , 
    descripcion: body.descripcion,
    usuario: req.usuario._id,
    disponible : body.disponible,
    categoria: body.categoria,

    });


    producto.save( (err , productoDB) => {
        if(err) {
            return res.status(500).json({
                ok:false,
                err
            });
        };

        return res.status(201).json({
            ok:true,
            producto: productoDB
        })
    });


 });


/**
 *  
 * Actualizar un Nuevo Producto
 * 
 **/

app.put('/producto/:id' , (req , res) =>{
    //grabar el usuario
    //grabar una categoria de listado

    let id = req.params.id;

    let valid = [
        'nombre',
        'precioUni',
        'descripcion',
        'categoria',
        'usuario'
    ];
    let body = _.pick(req.body , valid);

    Producto.findByIdAndUpdate( id , body , {new : true}  , (err , productoDB) =>{
        if(err) {
            return res.status(500).json({
              ok:false,
             err
            });
        }

        if(productoDB === null){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'Producto no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
    });
 });


 /**
 *  
 * Borrar un Nuevo Producto
 * 
 **/

app.delete('/producto/:id' , (req , res) =>{
    //grabar el usuario
    //grabar una categoria de listado

    let id = req.params.id;

    Producto.findByIdAndRemove(id , (err , productoDB) =>{
        if(err){
            return res.status(400).json({
                ok:false , 
                err
            });
        };

        
        if(productoDB === null){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'Producto no encontrado'
                }
            });
        }

        res.json({
            ok:true,
            producto:productoDB,
            message: 'Producto Eliminado con exito'
        });
    });



 });
module.exports = app;

