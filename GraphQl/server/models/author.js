const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const authorScheema = new Schema({
    name: String,
    age: Number
});

//model = collection 
//collection "book" will be full of bookschemas
module.exports = moongoose.model('Author',authorScheema);