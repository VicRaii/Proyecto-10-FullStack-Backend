// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Registrar el error en la consola

  // Si el error tiene un código de estado, usarlo, si no, usar 500
  const statusCode = err.statusCode || 500;

  // Responder con un mensaje de error más detallado
  res.status(statusCode).json({
    message: err.message || "Ocurrió un error en el servidor",
    stack: process.env.NODE_ENV === "development" ? err.stack : {}, // Mostrar el stack solo en desarrollo
  });
};

module.exports = errorHandler;
