# TP Integrador — Node & Express

Proyecto integrador del bootcamp Fullstack JavaScript (Talento Digital / SENCE).
Se construyó en tres partes sucesivas (Módulos 6, 7 y 8), cada una sobre la anterior.

Autora: Abigail Arriagada Aravena.

## Estado actual: Parte 3 — Módulo 8 (proyecto completo)

- **Módulo 6:** servidor Express, contenido estático, ruta `/status` y registro de peticiones en archivo plano (`logs/log.txt`).
- **Módulo 7:** conexión a MySQL, CRUD con SQL manual (`mysql2`) y con ORM (`Sequelize`), relación 1:N y transacción con rollback.
- **Módulo 8:** API RESTful con autenticación JWT (registro, login y rutas protegidas), subida de archivos con `multer`, nuevo recurso `/productos`, relaciones 1:1 y N:M, validaciones centralizadas y documentación con Swagger.

### Requisitos del sistema

- Node.js v18 o superior
- npm
- MySQL (local o remoto)

### Estructura

```
index.js                          # archivo principal (node index.js)
config/
  db.js                           # pool de conexión mysql2 (SQL manual)
models/
  index.js                        # Sequelize + todas las relaciones (1:1, 1:N, N:M)
  usuario.model.js
  pedido.model.js
  producto.model.js               # Módulo 8
  pedidoProducto.model.js         # Módulo 8 — tabla intermedia N:M
  perfil.model.js                 # Módulo 8 — relación 1:1 con usuario
services/                         # lógica de acceso a datos
  usuario.service.js              # SQL manual
  usuarioOrm.service.js           # ORM
  pedido.service.js               # SQL manual
  pedidoOrm.service.js            # ORM — relación N:M
  producto.service.js             # ORM
  auth.service.js                 # registro, login y JWT
  perfil.service.js               # asocia la foto subida al perfil
controllers/
  status.controller.js
  usuarios.controller.js
  usuariosOrm.controller.js
  pedidos.controller.js
  productos.controller.js
  auth.controller.js
  upload.controller.js
routes/                           # un archivo por recurso
  status.routes.js
  usuarios.routes.js
  usuariosOrm.routes.js
  pedidos.routes.js
  productos.routes.js
  auth.routes.js
  upload.routes.js
middlewares/
  logger.middleware.js            # registra cada request en logs/log.txt
  errorHandler.middleware.js      # manejo centralizado de errores
  auth.middleware.js              # verifica el JWT (rutas protegidas)
  upload.middleware.js            # multer: tipo y tamaño de archivo
  validarCampos.middleware.js     # campos obligatorios y formato de email
docs/
  openapi.json                    # documentación de la API (Swagger)
public/
  index.html                      # contenido estático servido en "/"
uploads/                          # archivos subidos con POST /upload
logs/
  log.txt                         # se genera al correr el servidor
  transacciones-fallidas.log      # se genera si una transacción hace rollback
seed.js                           # crea las tablas y datos de prueba (npm run seed)
```

### Instrucciones de instalación

```bash
npm install
cp .env.example .env
```

Edita el `.env` con los datos de tu base de datos MySQL y define un `JWT_SECRET` propio (un texto largo y difícil de adivinar). Después crea las tablas y los datos de prueba:

```bash
npm run seed
```

El seed se puede ejecutar más de una vez sin duplicar datos: solo crea las tablas que falten y solo inserta datos en las tablas vacías.

Finalmente levanta el servidor:

```bash
npm start
```

(o `npm run dev` para levantarlo con nodemon)

## Cómo autenticarse

Las rutas marcadas con 🔒 en la tabla de endpoints requieren un token JWT.

1. **Crea una cuenta** (o usa un usuario de prueba del seed, por ejemplo `camila.rojas@example.com` / `123456`):
   ```
   POST http://localhost:3000/registro
   Content-Type: application/json

   {"nombre":"Ana Pérez","email":"ana@example.com","password":"123456"}
   ```
2. **Inicia sesión** para obtener el token:
   ```
   POST http://localhost:3000/login
   Content-Type: application/json

   {"email":"ana@example.com","password":"123456"}
   ```
   La respuesta trae el token en `data.token`.
3. **Envía el token** en cada petición a una ruta protegida, en la cabecera:
   ```
   Authorization: Bearer <token>
   ```
   En Thunder Client o Postman: pestaña **Auth** → **Bearer** → pegar el token.

El token dura lo que indique `JWT_EXPIRES_IN` en el `.env` (por defecto 1 hora). Si falta, es inválido o expiró, la API responde `401` con un mensaje que explica el motivo, y hay que volver a hacer login.

También puedes probar toda la API desde el navegador en **http://localhost:3000/api-docs** (Swagger): haz login, copia el token y pégalo en el botón **Authorize**.

## Endpoints

Todas las respuestas siguen el mismo formato: `{ "status", "message", "data" }`.

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| GET | `/` | | Página estática (HTML) |
| GET | `/status` | | Estado del servidor |
| POST | `/registro` | | Crea una cuenta |
| POST | `/login` | | Devuelve un JWT |
| GET | `/perfil` | 🔒 | Usuario autenticado + su foto (relación 1:1) |
| POST | `/upload` | 🔒 | Sube una foto de perfil |
| GET | `/productos` | | Lista productos (`?nombre=`, `?precioMax=`) |
| GET | `/productos/:id` | | Un producto |
| POST | `/productos` | 🔒 | Crea un producto |
| PUT | `/productos/:id` | 🔒 | Actualiza un producto |
| DELETE | `/productos/:id` | 🔒 | Elimina un producto |
| GET | `/usuarios` | | Lista usuarios (`?nombre=`, `?page=`, `?limit=`) |
| PUT | `/usuarios/:id` | 🔒 | Actualiza nombre y/o email |
| DELETE | `/usuarios/:id` | 🔒 | Elimina un usuario |
| POST | `/usuarios/registro-transaccional` | 🔒 | Usuario + primer pedido en una transacción |
| GET | `/usuarios-orm` | | Lista usuarios con el ORM |
| GET | `/usuarios-orm/:id/pedidos` | | Usuario con sus pedidos (relación 1:N) |
| GET | `/pedidos` | | Lista pedidos (`?usuarioId=`) |
| POST | `/pedidos` | 🔒 | Crea un pedido |
| PUT | `/pedidos/:id` | 🔒 | Actualiza un pedido |
| DELETE | `/pedidos/:id` | 🔒 | Elimina un pedido |
| GET | `/pedidos/:id/productos` | | Productos de un pedido (relación N:M) |
| POST | `/pedidos/:id/productos` | 🔒 | Agrega un producto a un pedido |

Cualquier ruta que no exista responde `404` en JSON.

### Ejemplos de uso

```
POST /productos
Authorization: Bearer <token>
{"nombre":"Parlante bluetooth","precio":24990}

POST /pedidos/1/productos
Authorization: Bearer <token>
{"productoId":4,"cantidad":2}
```

## Subida de archivos

- **Endpoint:** `POST /upload` (🔒 requiere token).
- **Formato:** `multipart/form-data`, con el archivo en el campo **`archivo`**. En Thunder Client: pestaña **Body** → **Form** → activar **Files** → nombre `archivo` → elegir la imagen.
- **Tipos permitidos:** JPG, PNG o WEBP (se revisa tanto el tipo que declara el cliente como la extensión del archivo). **Tamaño máximo:** 2 MB. Si no se cumple, responde `400` explicando el motivo.
- **Dónde queda:** en la carpeta `uploads/`, con un nombre único (`usuario-<id>-<fecha>.<ext>`), y es accesible en `http://localhost:3000/uploads/<archivo>`.
- **Asociación con la base de datos:** la ruta de la imagen se guarda en el perfil del usuario autenticado (tabla `perfiles`, relación 1:1). Se puede comprobar con `GET /perfil`.

## Modelo de datos y relaciones

| Relación | Entidades | Cómo se consulta |
|---|---|---|
| 1:1 | `Usuario` ↔ `Perfil` | `GET /perfil` |
| 1:N | `Usuario` → `Pedidos` | `GET /usuarios-orm/:id/pedidos` |
| N:M | `Pedido` ↔ `Producto` (tabla `pedido_productos`, con `cantidad`) | `GET /pedidos/:id/productos` |

## Justificación técnica

**Módulo 6:**

- **Archivo principal `index.js`:** es la convención más común como punto de entrada de un paquete Node y el valor por defecto del campo `main` en `package.json`.
- **Scripts `npm start` / `npm run dev`:** nombres estándar que cualquiera que conozca Node va a probar primero al clonar el repositorio.
- **`express.static()` en vez de motor de plantillas:** no se necesitaba contenido renderizado en el servidor, así que un HTML estático cumplía el objetivo sin agregar complejidad.
- **Logging con `fs.appendFile()`:** en esa etapa todavía no había base de datos, así que el archivo plano era la forma de persistencia que correspondía.

**Módulo 7:**

- **¿Por qué ese cliente de conexión?** Se usó `mysql2` (con promesas) para el SQL manual, porque ya tenía MySQL configurado en mi iMac y en un VPS propio, y `Sequelize` para el ORM, que soporta MySQL sin limitaciones. La consigna menciona PostgreSQL en los requerimientos generales, pero el objetivo específico de la Lección 1 del Módulo 7 permite "MySQL o PostgreSQL".
- **¿Cómo se protegen los datos sensibles?** La contraseña nunca se selecciona en las consultas SQL (`SELECT id, nombre, email, created_at`) y en el modelo de Sequelize se excluye con `defaultScope`. Además se guarda siempre hasheada con `bcrypt`.
- **¿Por qué actualizar solo ciertos campos?** `PUT /usuarios/:id` solo modifica `nombre` y `email`; cambiar una contraseña es una operación sensible que necesita sus propias validaciones.
- **¿Qué ventaja tiene el ORM frente al SQL manual?** Evita escribir el SQL a mano y resolver relaciones con `include` es mucho más simple que un `JOIN` armado a mano. A cambio, con SQL manual queda más claro qué consulta se ejecuta.
- **Nombres del modelo (`Usuario` y no `User`) y reutilización de "Pedidos"** en la transacción y en la relación: se priorizó la consistencia del proyecto, que está nombrado en español, y evitar tablas que no se volverían a usar.

**Módulo 8:**

- **¿Cómo decidiste separar tus rutas y controladores?** Hay un archivo de rutas por recurso (`usuarios`, `pedidos`, `productos`, `auth`, `upload`). Las rutas solo definen la URL, el método y qué middlewares se aplican (token, validaciones, multer); los controladores deciden qué responder; y los servicios hablan con la base de datos. Así, por ejemplo, para proteger una ruta basta con agregar `verificarToken` en su línea, sin tocar la lógica del controlador.
- **¿Qué validaciones se hacen antes de insertar o modificar datos?** El middleware `validarCampos` se aplica en las rutas antes de llegar al controlador y revisa tres cosas: que vengan los campos obligatorios, que los campos numéricos (`precio`, `monto`, `cantidad`, ids) sean números mayores que 0, y que el email tenga un formato válido. Además, en los controladores y servicios se valida que la contraseña tenga al menos 6 caracteres, que el email no esté en uso por otro usuario (`409`, tanto al registrarse como al editar un usuario), y que los registros existan antes de modificarlos o eliminarlos (`404`). En la subida de archivos se valida el tipo declarado, la extensión y el tamaño.
- **¿Por qué proteger esas rutas?** Se protegieron todas las operaciones que **crean, modifican o eliminan** datos (`POST`, `PUT`, `DELETE`), la subida de archivos y `/perfil`. La lectura (`GET`) se dejó pública porque es información que un catálogo o una página podría mostrar a cualquiera; en cambio, cambiar datos tiene que quedar asociado a un usuario identificado. `/perfil` y `/upload` además necesitan saber *quién* hace la petición, y ese dato sale del token.
- **¿Dónde y cómo se almacena el token?** El servidor **no guarda los tokens**: los firma con `JWT_SECRET` (que vive solo en el `.env`, nunca en GitHub) y en cada petición verifica la firma y la fecha de expiración con `jwt.verify`. Quien guarda el token es el cliente: en estas pruebas, Thunder Client/Swagger; en un front-end real, en memoria o en una cookie `httpOnly`. El token dura 1 hora, así que si se filtra, deja de servir pronto.
- **Asociación de archivos:** la imagen se guarda en disco (`uploads/`) y en la base de datos solo se guarda su ruta, en la tabla `perfiles` (1:1 con `usuarios`). Guardar el archivo completo en la base de datos la haría crecer mucho y más lenta; guardar solo la ruta es lo habitual.
- **Convenciones REST:** los recursos se nombran en plural (`/productos`, `/pedidos`), el identificador va en la URL (`/productos/:id`), la acción la indica el método HTTP y los códigos de respuesta son los estándar (`200`, `201`, `400`, `401`, `404`, `409`, `500`). Las rutas `/usuarios-orm` y `/usuarios/registro-transaccional` se mantienen porque cumplen un rol demostrativo del Módulo 7 (comparar SQL manual con ORM y probar el rollback).

## Iteraciones sobre partes anteriores

En el Módulo 8 se hicieron estos ajustes sobre lo construido en los módulos 6 y 7:

- **Contraseñas del registro transaccional:** en el Módulo 7, `POST /usuarios/registro-transaccional` guardaba la contraseña tal como llegaba. Ahora se hashea con `bcrypt`, igual que en `POST /registro`, para que esos usuarios también puedan iniciar sesión. (Los usuarios creados por esa ruta *antes* de este cambio conservan la contraseña sin hashear y no pueden hacer login.)
- **Escrituras protegidas:** las rutas `PUT`/`DELETE` de usuarios, `POST`/`PUT`/`DELETE` de pedidos y el registro transaccional, que en el Módulo 7 eran públicas, ahora requieren token.
- **Validaciones centralizadas:** se agregó el middleware `validarCampos` y se aplicó también a las rutas del Módulo 7. Al probar casos extremos se detectó que antes se podía crear o editar un pedido con **monto negativo**, que un monto escrito como texto provocaba un error `500`, y que `PUT /usuarios/:id` aceptaba un email sin formato válido. Ahora esos casos responden `400` con un mensaje claro.
- **Email repetido:** editar un usuario (o usar el registro transaccional) con un email que ya existe producía un error `500` con el mensaje interno de MySQL. Ahora se revisa antes y se responde `409`.
- **Errores en JSON:** las rutas inexistentes ahora responden `404` en JSON (antes Express devolvía una página HTML "Cannot GET"), y el manejador de errores respeta el código de cada error (`401`, `409`...) y oculta los detalles internos en los errores `500`.
- **Seed reutilizable:** `seed.js` ahora revisa tabla por tabla, así que se puede volver a ejecutar sobre una base de datos existente para agregar las tablas nuevas sin duplicar datos.
- **Relaciones completas:** se agregaron las relaciones 1:1 (`Usuario`–`Perfil`) y N:M (`Pedido`–`Producto`), que junto con la 1:N del Módulo 7 cubren los tres tipos que pide la consigna.

## Reflexión

**Módulo 6:** Lo que más me costó de este módulo fue entender la estructura de carpetas:
al principio no tenía claro por qué había que separar el código en `routes`,
`controllers` y `middlewares` en vez de tener todo en un solo archivo, y me
costó ubicar qué lógica iba en cada lugar. Con la práctica fui entendiendo
que cada carpeta cumple un rol distinto (rutas define el "por dónde", los
controllers el "qué responder", y los middlewares las funciones que se
ejecutan en el camino de una petición), y también entendí por qué conviene
usar `path.join(__dirname, ...)` para armar rutas de archivos en vez de
escribirlas directamente como texto.

**Módulo 7:** Lo que más me costó en este módulo fue algo que no tenía nada que ver
con el código: al ejecutar `npm start`, el servidor se quedaba pegado y no mostraba
ningún mensaje ni error. Tuve que ir descartando varias cosas hasta descubrir que el
problema era que el proyecto estaba guardado en el Escritorio, que en mi Mac se
sincroniza con iCloud, y eso hacía que Node tardara muchísimo en leer los archivos de
`node_modules`. Al mover el proyecto a otra carpeta funcionó de inmediato. Aprendí que
no conviene guardar proyectos de Node en carpetas sincronizadas con la nube.

Otra cosa que me confundió fue probar las rutas con Thunder Client. Al principio
mandaba todas las peticiones con GET sin darme cuenta, y me aparecía "Cannot GET
/usuarios/1" aunque la ruta sí existía. Ahí entendí que una misma URL puede hacer
cosas distintas según el método HTTP: GET para leer, POST para crear, PUT para
actualizar y DELETE para eliminar, y que hay que elegir el método correcto antes de
enviar la petición.

**Módulo 8 y cierre del proyecto:** En este módulo lo que más me costó fue entender
el token JWT. Al principio no tenía claro qué era ese texto tan largo que me devolvía
el login, ni que tenía que copiarlo y pegarlo en la pestaña Auth → Bearer para que
las rutas protegidas me dejaran pasar. También me confundió que el token dejara de
servir después de una hora y hubiera que volver a iniciar sesión.

Relacionado con eso, me costó entender por qué algunas rutas funcionaban sin token y
otras me respondían 401. Después entendí la lógica: leer información (GET) puede ser
público, pero crear, modificar o eliminar datos tiene que quedar asociado a un usuario
identificado, y ese dato sale justamente del token.

La subida de archivos también tuvo sus complicaciones. Primero descubrí que la versión
gratuita de Thunder Client no permite enviar archivos, así que tuve que usar Swagger
para probar `POST /upload`. Además, una imagen `.svg` me fue rechazada aunque era una
imagen, y ahí entendí que la validación revisa el tipo exacto de archivo (JPG, PNG o
WEBP) y no solo que "parezca" una imagen.

Por último, lo que más me hizo sentido fue ver cómo se unían los tres módulos: el
servidor y el registro en `log.txt` del Módulo 6, la base de datos y el ORM del
Módulo 7, y la autenticación y la subida de archivos del Módulo 8 siguieron
funcionando juntos. Cada parte se fue construyendo encima de la anterior, y al probar
todo al final pude ver el proyecto completo como una API de verdad.