const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Tarea 7: Registrar un nuevo usuario
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register customer." });
});

// TAREA 10: Obtener la lista de libros usando Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });
    const bookList = await getBooks;
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros" });
  }
});

// TAREA 11: Obtener detalles del libro por ISBN usando Promesas
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Libro no encontrado");
    }
  });

  getByIsbn
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({ message: err }));
});

// TAREA 12: Obtener detalles por Autor usando Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getByAuthor = new Promise((resolve) => {
      const keys = Object.keys(books);
      const filtered = keys.filter(key => books[key].author === author).map(key => books[key]);
      resolve(filtered);
    });

    const booksFound = await getByAuthor;
    if (booksFound.length > 0) {
      res.status(200).send(JSON.stringify(booksFound, null, 4));
    } else {
      res.status(404).json({ message: "Autor no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en la búsqueda" });
  }
});

// TAREA 13: Obtener detalles por Título usando Promesas
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getByTitle = new Promise((resolve) => {
    const keys = Object.keys(books);
    const filtered = keys.filter(key => books[key].title === title).map(key => books[key]);
    resolve(filtered);
  });

  getByTitle
    .then((booksFound) => {
      if (booksFound.length > 0) {
        res.status(200).send(JSON.stringify(booksFound, null, 4));
      } else {
        res.status(404).json({ message: "Título no encontrado" });
      }
    });
});

// Tarea 6: Obtener reseñas del libro
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({ message: "Reviews not found for this ISBN" });
  }
});

module.exports.general = public_users;