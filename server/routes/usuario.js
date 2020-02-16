const express = require('express');
const Usuario  = require('../models/usuario');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

 /***********************************************************/
 
 app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado : true} , 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err , usuarios) =>{

                if(err){
                    return res.status(400).json({
                        ok:false,
                        err
                    });
                }

                Usuario.count( {estado:true} , (err , conteo) => {
                    res.json({
                        ok:true,
                        usuarios ,
                        conteo
                    });
                });
            });
  });
  
  app.post('/usuario', function (req, res) {
      let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    });


    usuario.save((err , usuarioDB) => {
        usuarioDB.password = null;

        if( err ) {
          return  res.status(400).json({
                ok: false, 
                err
            });
        }

        res.json({
            ok: true,
            usuario:usuarioDB
        })
    });


  });
  
    app.put('/usuario/:id', function (req, res) {

        let id = req.params.id;

        let valid = [
            'nombre', 
            'email',
            'img',
            'role',
            'estado'
        ];

        let body = _.pick(req.body , valid);

        options = {
            new: true,
            runValidators: true
        }

        Usuario.findByIdAndUpdate(id , body, options, (err , usuarioDB) => {
            if( err ) {
                return  res.status(400).json({
                      ok: false, 
                      err
                  });
              }
              
            res.send({
                ok: true,
                usuario:usuarioDB
            });
        });
    });
  
    app.delete('/usuario/:id', function (req, res) {

        let id = req.params.id;
        let valid = [
            'estado'
        ];

        let body = _.pick(req.body , valid);

        let options = {
            new: true
        }

       /* ELIMINACION DE LA BASE DE DATOS
        Usuario.findByIdAndRemove(id , (err , usuarioDe)=>{
            if(err){
                return res.status(400).json({
                    ok:false , 
                    err
                });
            };

            if(!usuarioDe){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message:'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok:true,
                usuario: usuarioDe
            });
        });
*/

//ACTUALIZACION DEL ESTADO DEL USUARIO EN LA BD

        Usuario.findByIdAndUpdate(id ,body , options, (err , usuarioDB) => {
            if( err ) {
                return  res.status(400).json({
                      ok: false, 
                      err
                  });
              }
              
              if(!usuarioDB){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message:'Usuario no encontrado'
                    }
                });
            };

            res.send({
                ok: true,
                usuario:usuarioDB
            });
        });
    });
  

    module.exports = app;