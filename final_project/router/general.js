const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // REQUISITO INDISPENSABLE

// TAREA 10: Obtener la lista de libros usando Async/Await y Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/internal/books");
    return res.status(200).json(response.data);
  } catch (error) {
    // Manejo de error si el servicio interno falla
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// TAREA 11: Detalles por ISBN usando Promesas y Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/internal/books/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(err => res.status(404).json({ message: "ISBN not found", error: err.message }));
});

// TAREA 12: Detalles por Autor usando Async/Await y Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/internal/books");
    const filtered = Object.values(response.data).filter(b => b.author === author);
    if (filtered.length > 0) {
      res.status(200).send(JSON.stringify(filtered, null, 4));
    } else {
      res.status(404).json({ message: "Autor no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en la búsqueda por autor" });
  }
});

// TAREA 13: Detalles por Título usando Promesas y Axios
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get("http://localhost:5000/internal/books")
    .then(response => {
      const filtered = Object.values(response.data).filter(b => b.title === title);
      res.status(200).send(JSON.stringify(filtered, null, 4));
    })
    .catch(err => res.status(500).json({ message: "Error en la búsqueda" }));
});

// --- ENDPOINTS AUXILIARES (Para que Axios funcione) ---
public_users.get('/internal/books', (req, res) => res.json(books));
public_users.get('/internal/books/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book) : res.status(404).json({ message: "Not found" });
});

// Tarea 7: Registrar usuario (Mantener como lo tienes)
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

module.exports.general = public_users;