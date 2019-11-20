const graphql = require ('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');


//object types, relations /how can we jump into the type (mutate)

//wrap smt from graphql
const {GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull} = graphql;

//array exampe w data
// var books =[
//     {name:'Misery',genre:'Suspense',id:'2',authorId:'1'},
//     {name:'Harry Potter and the chamber of secrets',genre:'Fantasy',id:'1',authorId:'3'},
//     {name:'Lord of the Rings: Two Towers',genre:'Fantasy',id:'3',authorId:'2'},
//     {name:'Lord of the Rings: Return of the King', genre: 'Fantasy', id:'4',authorId:'2'},
//     {name:'Fire Eyes', genre: 'Suspense', id:'5', authorId:'1'},
//     {name:'Harry Potter and the Goblet of Fire', genre:'Fantasy', id:'6', authorId:'3'}

// ];


// //dummy data
// var authors =[
//     {name:'Stephen King', age: 44, id:'1'},
//     {name:'J.R.R. Tolkien', age:67, id: '2'},
//     {name: 'J.K. Rowling', age:58, id:'3'}
// ];


const BookType = new GraphQLObjectType({
    name: 'Book',
    //functions to query the data, avoid reference errors
    fields:()=>({
        //type of the object
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type:AuthorType,
            //not necessary to add the args, just the type and the reolve function
            resolve(parent,args){
                //on the parent are the properties of the book
                // console.log(parent);
                // return _.find(authors,{id:parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

//OBJETCS TYPE
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    //functions to query the data, avoid reference errors
    //bc some of them are defined later on 
    fields:()=>({
        //type of the object
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books:{
            //list of object types
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return _.filter(books,{authorId:parent.id});
                return Book.find({authorId:parent.id});
            }
        }
    })
});

//defining rootueries (how to get into the graph to get data)
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //types of requerie
        book: {
            type: BookType,
            //get acces to the id
            args: {id:{type: GraphQLID}},
            resolve(parent,args){
                //code to get fata from db or other source
            //     console.log(typeof(args.id));
            //   return _.find(books,{id:args.id});
            return Book.findById(args.id)
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                return Author.findById(args.id);
                // return _.find(authors,{id:args.id});
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return Book.find({});
                // return books;
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return Author.find({});
                // return authors;
            }
        }
    }
    
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name: {type: new GraphQLNonNull (GraphQLString)},
                age: {type: new GraphQLNonNull (GraphQLInt)},
            },
            resolve(parent,args){
                //author imported at the top of doc
                let author= new Author({
                    name: args.name,
                    age: args.age
                });
                //.save() returns an object 
               return author.save();
            }
        },
        addBook:{
            type: BookType,
            args:{
                name:{type: new GraphQLNonNull (GraphQLString)},
                genre:{type:  new GraphQLNonNull(GraphQLString)},
                authorId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId:args.authorId
                });
                return book.save();
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
