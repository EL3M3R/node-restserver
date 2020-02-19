const express = require('express');
const fileupload = require('express-fileupload');
const Usuairo = require('../models/usuario');
const Producto = require('../models/producto');
const fs =  require('fs');
const path = require('path'); 
const app = express();

app.use( fileupload() );

app.put('/upload/:tipo/:id' , (req , res) =>{

    //recuperando datos de la url
    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }

    //validar el tipo

        ValidarTipo(tipo , res);

    let data_archivo =  req.files.archivo;
    let nombreCortado= data_archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length- 1];

    let extensionesValidas = ['png' , 'jpg' , 'gif' , 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(','),
                ext: extension
            }
        })
    }

    //cambiar el nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;
   
    data_archivo.mv(`./uploads/${ tipo }/${nombreArchivo}` , (err) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

       let valida=  ValidarTipo(tipo);

       if(valida === 'usuarios'){
       return imagenUsuario(id , res , nombreArchivo);
       }

       if(valida === 'productos'){
           return imagenProducto(id , res , nombreArchivo);
       }


      
    });
});

function imagenUsuario(id , res , nombreArchivo){
    Usuairo.findById( id ,  (err , usuarioDB) =>{
        if(err){
            BorraArchivo(nombreArchivo  , 'usuarios');

            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            BorraArchivo(nombreArchivo  , 'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El usuario no existe'
                }
            });
        }

        BorraArchivo(usuarioDB.img  , 'usuarios');
       
        usuarioDB.img = nombreArchivo;

        usuarioDB.save(  (err , usuarioGuardado) =>{

            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })


    });
}

function imagenProducto(id , res , nombreArchivo){

    Producto.findById( id ,  (err , productoDB) =>{
        if(err){
            BorraArchivo(nombreArchivo  , 'productos');

            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productoDB){
            BorraArchivo(nombreArchivo  , 'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El producto no existe'
                }
            });
        }

        BorraArchivo(productoDB.img  , 'productos');
       
        productoDB.img = nombreArchivo;

        productoDB.save(  (err , productoGuardado) =>{

            res.json({
                ok:true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })


    });
}

function BorraArchivo(nombreImagen , tipo , ){
    let pathImagen = path.resolve( __dirname , `../../uploads/${tipo}/${nombreImagen}`)
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}


function ValidarTipo(tipo , res){

    let tiposValidos = ['productos' , 'usuarios'];

        if(tiposValidos.indexOf(tipo) <0 ){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Los tipos permitidos son ' + tiposValidos.join(',')
                }
            })
        }
        return tipo;
}
module.exports = app;
