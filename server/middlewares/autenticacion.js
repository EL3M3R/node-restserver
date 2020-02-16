const jwt = require('jsonwebtoken');
//===============================
// VERIFICAR TOKEN
//===============================

let verificaToken = ( req ,  res , next ) =>{

    let token = req.get('Authorization');

    jwt.verify( token , process.env.SEED ,  (err , decoded) => {
        if(err){
            res.status(401).json({
                ok:false,
                err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};


//===============================
// VERIFICAR Admin_Role
//===============================

let verificaAdmin_Role = (req , res , next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
       return res.json({
            ok:false,
            err:{
                message: 'El usuario no es Administrador'
            }
        });
    }
    

     

};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}