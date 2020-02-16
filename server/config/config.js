
/*
 * 
 * Puerto
 * 
*/
process.env.PORT = process.env.PORT || 3000

/*
 * 
 * Entorno
 * 
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//mongodb+srv://strider:uBOhX8cZlOcBhoiF@cluster0-nrc0o.mongodb.net/cafe


/*
 * 
 * BASE DE DATOS
 * 
*/

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = "mongodb://localhost:27017/cafe";
}else{
    urlDB = "mongodb+srv://strider:uBOhX8cZlOcBhoiF@cluster0-nrc0o.mongodb.net/cafe";
}

process.envURLDB =  urlDB;