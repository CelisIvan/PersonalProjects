const express = require ('express');
const graphqlHTTP = require ('express-graphql');
const schema = require ('./schema/schema');
const mongoose = require ('mongoose');

const app = express();

//connect to mlab
mongoose.connect('mongodb+srv://ivan:test123@gql-project-gjum3.mongodb.net/test?retryWrites=true&w=majority')
mongoose.connection.once('open',()=>{
    console.log('connected to database');
});
//midleware. function handle
app.use('/graphql',graphqlHTTP({
    //schema for the data (graph)
    schema,
    //graphiql interface enabled
    graphiql:true
}));


app.listen(4000, ()=>{
    console.log("Now listening on port 4000");
});
