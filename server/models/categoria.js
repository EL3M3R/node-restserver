const mongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongose.Schema;


let categoriaSchema = new  Schema({
     descripcion: {type: String, unique: true ,required:[  true ] },
      usuario: {type:Schema.Types.ObjectId , ref: 'Usuario' }
});

categoriaSchema.plugin(uniqueValidator , {
    message: '{PATH} debe ser unico'
});

module.exports = mongose.model('Categoria' , categoriaSchema);