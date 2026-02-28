const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configuración de la sesión para el cliente
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Mecanismo de autenticación para rutas protegidas
app.use("/customer/auth/*", function auth(req, res, next) {
    // Verificar si el usuario tiene una sesión con autorización
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Validar el token JWT utilizando la clave secreta "access"
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Guardar la información del usuario en el request
                next(); // Permitir el paso a la siguiente función (p. ej. agregar reseña)
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));