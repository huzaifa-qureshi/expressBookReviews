const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

let myPromise = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve("Promise resolved")
  },6000)})
// Get the book list available in the shop
myPromise.then((successMessage) => {
  public_users.get('/',async function (req, res) {
  res.send(JSON.stringify(books,null,3));
});
})


// Get book details based on ISBN
myPromise.then(() => {
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
   });
})

  
// Get book details based on author
myPromise.then(() => {
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    for (i = 1 ; i <= 10 ; i++){
      if (books[i].author == author){
        res.send(books[i])
      }
    }
  });
})


// Get all books based on title
myPromise.then(() => {
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    for (i = 1 ; i <= 10 ; i++){
      if (books[i].title == title){
        res.send(books[i])
      }
    }
  });
})


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
