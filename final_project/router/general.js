const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send(JSON.stringify({ "message": "username or password not found" }));
  }

  let filtered_users = users.filter((user) => user.username === username);
  if (filtered_users.length > 0) {
    return res.status(404).send(JSON.stringify({ "message": "username already exists", "users": users }));
  }

  users.push({
    "username": username,
    "password": password,
  });

  return res.status(200).send(JSON.stringify({ "message": username + " registered", "users": users }));

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get the book list available with promisses axios
public_users.get('/task10', function (req, res) {

  axios.get('http://localhost:5000/')
    .then(response_api => {
      return res.status(200).send(response_api.data);
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send('Error on book search');
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn]));
});


// Get book details based on ISBN with promisses axios
public_users.get('/task11/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  axios.get('http://localhost:5000/isbn/' + isbn)
    .then(response_api => {
      return res.status(200).send(response_api.data);
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send('error on isbn search');
    });

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const author = req.params.author;
    let author_clean = author.replaceAll("+", " ")

    const booksArray = Object.values(books);
    let filtered_books = booksArray.filter((book) => book.author === author_clean);
    return res.status(200).send(filtered_books[0]);

  } catch (error) {
    console.error("Error found: ", error);
    return res.status(404).send("author error");
  }
});

// Get book details based on author with promisses axios
public_users.get('/task12/:author', function (req, res) {

  const author = req.params.author;
  let author_clean = author.replaceAll("+", " ")

  axios.get('http://localhost:5000/author/' + author_clean)
    .then(response_api => {
      return res.status(200).send(response_api.data);
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send('Error in author search');
    });

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  try {
    const title = req.params.title;
    let title_clean = title.replaceAll("+", " ")

    const booksArray = Object.values(books);
    let filtered_books = booksArray.filter((book) => book.title === title_clean);
    return res.status(200).send(filtered_books[0]);

  } catch (error) {
    console.error("Error found: ", error);
    return res.status(404).send("title error");
  }
});

// Get all books based on title  with promisses axios
public_users.get('/task13/:title', function (req, res) {

  const title = req.params.title;
  let title_clean = title.replaceAll("+", " ")

  axios.get('http://localhost:5000/title/' + title_clean)
    .then(response_api => {
      return res.status(200).send(response_api.data);
    })
    .catch(error => {
      console.log(error)
      return res.status(500).send('Error in author search');
    });

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
