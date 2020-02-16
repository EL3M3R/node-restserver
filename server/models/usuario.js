const mongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE' , 'USER_ROLE'],
    message: '{VALUE} NO ES VALIDO'
};

let Schema = mongose.Schema;

let UsuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true , "El nombre es necesario"]
    },
    email:{
        type:String,
        unique:true,
        required: [true , "El correo es necesario"]
    },
    password:{
        type: String,
        required: [true , "La contraseña es Obligatoria"]
    },
    img:{
        type:  String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type:Boolean,
        default: false
    }
});

UsuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

UsuarioSchema.plugin(uniqueValidator , {
    message: '{PATH} debe ser unico'
});
module.exports = mongose.model('Usuario' , UsuarioSchema);  