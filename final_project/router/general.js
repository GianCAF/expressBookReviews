const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Requisito obligatorio para las Tareas 10-13

/**
 * TAREA 10: Obtener la lista completa de libros.
 * Utiliza Async/Await junto con Axios para realizar una petición asíncrona.
 * Incluye un bloque try/catch para un manejo de errores robusto.
 */
public_users.get('/', async function (req, res) {
  try {
    // Realiza la petición al endpoint interno para simular una fuente de datos externa
    const response = await axios.get("http://localhost:5000/internal/books");
    return res.status(200).json(response.data);
  } catch (error) {
    // Retorna un error 500 si la petición falla, proporcionando el mensaje de error
    return res.status(500).json({
      message: "Error al recuperar la lista de libros",
      error: error.message
    });
  }
});

/**
 * TAREA 11: Obtener detalles del libro por ISBN.
 * Utiliza Promesas (.then/.catch) con Axios para la búsqueda asíncrona.
 */
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/internal/books/${isbn}`)
    .then(response => {
      // Retorna los detalles del libro si se encuentra exitosamente
      res.status(200).json(response.data);
    })
    .catch(err => {
      // Maneja específicamente el caso donde el ISBN no existe o hay error de red
      res.status(404).json({
        message: `No se encontró el libro con el ISBN: ${isbn}`,
        error: err.message
      });
    });
});

/**
 * TAREA 12: Obtener detalles del libro por Autor.
 * Utiliza Async/Await y filtra la respuesta obtenida vía Axios.
 */
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/internal/books");
    const filtered = Object.values(response.data).filter(b => b.author === author);

    if (filtered.length > 0) {
      res.status(200).json(filtered);
    } else {
      // Error detallado si el autor no tiene libros registrados
      res.status(404).json({ message: `No se encontraron libros para el autor: ${author}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Error durante la búsqueda por autor", error: error.message });
  }
});

/**
 * TAREA 13: Obtener detalles del libro por Título.
 * Utiliza Promesas para manejar la operación asíncrona de Axios.
 */
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get("http://localhost:5000/internal/books")
    .then(response => {
      const filtered = Object.values(response.data).filter(b => b.title === title);
      if (filtered.length > 0) {
        res.status(200).json(filtered);
      } else {
        res.status(404).json({ message: `No se encontró ningún libro con el título: ${title}` });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Error durante la búsqueda por título", error: err.message });
    });
});

/**
 * Endpoints Auxiliares Internos.
 * Estos permiten que Axios realice peticiones HTTP a la "base de datos" local.
 */
public_users.get('/internal/books', (req, res) => res.status(200).json(books));
public_users.get('/internal/books/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  book ? res.status(200).json(book) : res.status(404).json({ message: "Libro no encontrado" });
});

// Tarea 7: Registrar usuario (Mantenido)
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