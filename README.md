# TP Integrador — Node & Express

Proyecto integrador del bootcamp Fullstack JavaScript (Talento Digital / SENCE).
Se construye en tres partes sucesivas (Módulos 6, 7 y 8): este README se irá
actualizando en cada entrega para reflejar el avance real del proyecto.

Autora: Abigail Arriagada Aravena.

## Estado actual: Parte 1 — Módulo 6

Servidor Express básico con:

- Dos rutas públicas: `/` (contenido estático en HTML vía `express.static()`) y `/status` (respuesta en JSON).
- Middleware propio que registra cada petición HTTP en `logs/log.txt` usando `fs.appendFile()` (persistencia en archivo plano).
- Middleware centralizado de manejo de errores.
- Arquitectura modular en carpetas: `routes`, `controllers`, `middlewares`, `public`, `logs`.

### Requisitos del sistema

- Node.js v18 o superior
- npm

### Estructura

```
index.js                       # archivo principal (node index.js)
routes/
  status.routes.js             # define GET /status
controllers/
  status.controller.js         # lógica de la respuesta JSON de /status
middlewares/
  logger.middleware.js         # registra cada request en logs/log.txt
  errorHandler.middleware.js   # manejo centralizado de errores
public/
  index.html                   # contenido estático servido en "/"
logs/
  log.txt                      # se genera automáticamente al correr el servidor
```

### Instrucciones de instalación

```bash
npm install
cp .env.example .env
npm start
```
(o `npm run dev` para levantarlo con nodemon, que reinicia el servidor automáticamente al guardar cambios)

### Ejemplos de uso

- `http://localhost:3000/` → página estática en HTML.
- `http://localhost:3000/status` → `{"status":"success","message":"Servidor funcionando correctamente","data":{"uptime":...}}`.

Cada petición queda registrada en `logs/log.txt` con fecha, hora, método y ruta.

### Justificación técnica

- **Nombre del archivo principal (`index.js`):** se usó `index.js` en vez de `app.js` porque es la convención más común como punto de entrada de un paquete Node (es el valor por defecto que npm espera en el campo `main` de `package.json` si no se especifica otro).
- **Scripts `npm start` / `npm run dev`:** se dejaron con esos nombres estándar (en vez de crear otros personalizados) porque son los que cualquier persona que conozca Node.js va a probar primero al clonar el repo, sin necesidad de leer instrucciones extra.
- **Estructura de carpetas:** se usaron los nombres sugeridos por la consigna (`routes`, `controllers`, `middlewares`, `public`, `logs`) sin agregar carpetas adicionales todavía, ya que en esta primera parte solo existe una ruta propia (`/status`); a partir del Módulo 7 se espera sumar `services` y `models` a medida que se incorpore la base de datos.
- **`express.static()` en vez de motor de plantillas:** para esta etapa no se necesita contenido dinámico renderizado en el servidor, así que `/public` con un archivo HTML estático cumple el objetivo sin agregar complejidad innecesaria (un motor de plantillas como `ejs` se evalúa como posible Tarea PLUS más adelante).
- **Logging en archivo plano con `fs.appendFile()`:** se eligió sobre otras alternativas (por ejemplo, guardar los logs en base de datos) porque en este módulo todavía no hay conexión a base de datos — es la forma de persistencia que corresponde a esta etapa del proyecto.

### Reflexión

Lo que más me costó de este módulo fue entender el orden en que Express
ejecuta los middlewares: al principio no entendía por qué si ponía el logger
después de las rutas, no se registraba nada. Aprendí que el orden en que se
declaran los `app.use()` importa.

## Próximos pasos (no incluidos todavía en esta entrega)

- Módulo 7: conexión a PostgreSQL con Sequelize, CRUD, relaciones y transacciones.
- Módulo 8: API RESTful, subida de archivos y autenticación JWT.
