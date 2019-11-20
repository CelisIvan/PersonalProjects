const moongoose = require('mongoose');
const Schema = moongoose.Schema;

const bookScheema = new Schema({
    name: String,
    genre: String,
    authorId: String
});

//model = collection 
//collection "book" will be full of bookschemas
module.exports = moongoose.model('Book',bookScheema);