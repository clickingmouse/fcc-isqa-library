/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
var mongoose=require('mongoose')
var Schema=mongoose.Schema
var shortid=require('shortid')
mongoose.connect(process.env.DB)
var bookSchema = new Schema({
_id:{
type:String,
  default:shortid.generate
},
  title:{
  type:String
  },
  comments: {type:Array,
            default: []
           }
})


var Books = new mongoose.model("Books", bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, done){
    console.log('route : /api/books')
      var result={}
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    Books.find(function(err, data){
      if(err){done(err)}
      
      //console.log("...retrieving")
      //console.log(data)
      //result._id = data._id
      //result.title = data.title
      //result.commentcount=data.comments.length
      result=data.map((book)=>{
        return (
          {_id:book._id,
           title:book.title,
          commentcount:book.comments.length
          
          }
        
        )
      
      
      })
      
      //console.log(result)
      //console.log(data.commentslength)
      res.json(result)  
      //console.log(data)
      //done()
      })
    })
    
  //I can post a title to /api/books to add a book 
  //and returned will be the object with the title and a unique _id.
  
    .post(function (req, res, done){
    //console.log("posting,  "+ req.body.title)
    var title = req.body.title;
    var result={}
      //response will contain new book object including atleast _id and title
    if (req.body.title == "" ){
    res.send("missing title")} else {
    var newBook = new Books({title:req.body.title})
        newBook.save(function(err,data){
    if(err){done(err)}
    console.log(data) 
    res.json(data)    
    
    })
    }//else
    
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res, done){
    console.log('/api/books/:id' + " :::::" + req.params.id)
    var result2 ={}
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Books.findById(bookid, function(err,data){
      if(err){
        //console.log(err)
        done(err)}
       
        
       if(data == null){
       //console.log("not found")
         res.send("no book exists")
       }  else {
        //console.log(data)
      result2._id = data._id
        result2.title=data.title
        result2.comments=data.comments
        //= data.map((book)=>{
        //console.log("mapping")
      //return ({
      //_id: book._id,
        //title: book.title
        //comments: book.comments
       // })
      
      //})  
        
      //console.log(result2)
        res.json(result2)
       }
      })
    })
    
    .post(function(req, res){
    //I can post a comment to /api/books/{_id} to add a comment to a book and 
    //returned will be the books object similar to get /api/books/{_id}.
    
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
