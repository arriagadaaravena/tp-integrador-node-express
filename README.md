# TP Integrador — Node & Express

Proyecto integrador del bootcamp Fullstack JavaScript (Talento Digital / SENCE).
Se construye en tres partes sucesivas (Módulos 6, 7 y 8): este README se irá
actualizando en cada entrega para reflejar el avance real del proyecto.

Autora: Abigail Arriagada Aravena.

## Estado actual: Parte 2 — Módulo 7

Sobre la base del servidor Express de la Parte 1 (Módulo 6), se agrega:

- Conexión a una base de datos **MySQL** real, con credenciales en variables de entorno.
- CRUD completo e independiente sobre dos entidades relacionadas: `usuarios` y `pedidos`.
- Acceso a datos con **SQL manual** (`mysql2`) y también con **ORM** (`Sequelize`), para poder comparar ambos enfoques.
- Relación 1:N entre `Usuario` y `Pedido`, resuelta con `include` del ORM.
- Una operación transaccional (registrar un usuario junto con su primer pedido) con `rollback` automático si algo falla, y log en archivo plano de las transacciones que fallan.

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
  index.js                        # instancia de Sequelize + asociaciones
  usuario.model.js
  pedido.model.js
services/
  usuario.service.js              # acceso a datos con SQL manual
  usuarioOrm.service.js           # las mismas consultas, con el ORM
services/
  pedido.service.js               # acceso a datos de pedidos (SQL manual)
routes/
  status.routes.js                # GET /status
  usuarios.routes.js              # rutas de usuarios (SQL manual)
  usuariosOrm.routes.js           # rutas de usuarios (ORM)
  pedidos.routes.js               # rutas de pedidos (SQL manual)
controllers/
  status.controller.js
  usuarios.controller.js
  usuariosOrm.controller.js
  pedidos.controller.js
middlewares/
  logger.middleware.js            # registra cada request en logs/log.txt
  errorHandler.middleware.js
public/
  index.html                      # contenido estático servido en "/"
logs/
  log.txt                         # se genera automáticamente al correr el servidor
  transacciones-fallidas.log      # se genera si una transacción hace rollback
seed.js                           # crea las tablas y datos de prueba (npm run seed)
```

### Instrucciones de instalación

```bash
npm install
cp .env.example .env
```

Edita el `.env` con los datos de tu propia base de datos MySQL (host, puerto, usuario, password y nombre de la base). Luego crea las tablas y los datos de prueba:

```bash
npm run seed
```

Y finalmente levanta el servidor:

```bash
npm start
```

(o `npm run dev` para levantarlo con nodemon)

### Ejemplos de uso

**Rutas del Módulo 6** (sin cambios):
- `http://localhost:3000/` → página estática en HTML.
- `http://localhost:3000/status` → estado del servidor en JSON.

**Rutas del Módulo 7 — SQL manual:**
- `GET /usuarios` → lista todos los usuarios (sin exponer la contraseña).
  - `GET /usuarios?nombre=Camila` → filtra por nombre (Tarea PLUS).
  - `GET /usuarios?page=1&limit=2` → pagina los resultados (Tarea PLUS).
- `PUT /usuarios/:id` → actualiza `nombre` y/o `email` de un usuario existente.
- `DELETE /usuarios/:id` → elimina un usuario existente.
- `POST /usuarios/registro-transaccional` → registra un usuario y su primer pedido en una sola transacción.
  - Body de ejemplo: `{"nombre":"Ana","email":"ana@mail.com","password":"123456","producto":"Mouse","monto":9990}`
  - Agregando `"forzarError": true` al body se puede probar el `rollback`: ni el usuario ni el pedido quedan guardados.

**Rutas del Módulo 7 — ORM (Sequelize):**
- `GET /usuarios-orm` → misma lista de usuarios que `GET /usuarios`, pero obtenida con el ORM.
- `GET /usuarios-orm/:id/pedidos` → un usuario junto con todos sus pedidos, en una sola consulta (relación 1:N con `include`).

**Rutas del Módulo 7 — CRUD de `pedidos` (SQL manual):**
- `GET /pedidos` → lista todos los pedidos (opcional: `?usuarioId=1` para filtrar por usuario).
- `POST /pedidos` → crea un pedido para un usuario existente. Body: `{"usuarioId":1,"producto":"Mouse","monto":9990}`.
- `PUT /pedidos/:id` → actualiza `producto` y/o `monto` de un pedido existente.
- `DELETE /pedidos/:id` → elimina un pedido existente.

Todas las respuestas siguen el mismo formato: `{ "status", "message", "data" }`.

### Justificación técnica

**Módulo 6:**

- **Nombre del archivo principal (`index.js`):** se usó `index.js` en vez de `app.js` porque es la convención más común como punto de entrada de un paquete Node (es el valor por defecto que npm espera en el campo `main` de `package.json` si no se especifica otro).
- **Scripts `npm start` / `npm run dev`:** se dejaron con esos nombres estándar (en vez de crear otros personalizados) porque son los que cualquier persona que conozca Node.js va a probar primero al clonar el repo, sin necesidad de leer instrucciones extra.
- **Estructura de carpetas:** se usaron los nombres sugeridos por la consigna (`routes`, `controllers`, `middlewares`, `public`, `logs`), y en el Módulo 7 se sumaron `config`, `models` y `services` a medida que se incorporó la base de datos, tal como se anticipaba.
- **`express.static()` en vez de motor de plantillas:** para esta etapa no se necesita contenido dinámico renderizado en el servidor, así que `/public` con un archivo HTML estático cumple el objetivo sin agregar complejidad innecesaria.
- **Logging en archivo plano con `fs.appendFile()`:** en el Módulo 6 se eligió sobre otras alternativas porque todavía no había conexión a base de datos.

**Módulo 7:**

- **¿Por qué elegiste ese cliente de conexión?** Se usó `mysql2` (con su API de promesas) para las consultas SQL manuales, porque ya tenía una base de datos MySQL configurada de antes (en mi iMac y en un VPS), así que reutilizar esa infraestructura fue más rápido que instalar PostgreSQL desde cero. Para la parte de ORM se usó `Sequelize`, que soporta MySQL igual de bien.
- **¿Cómo se protegen los datos sensibles?** La columna `password` nunca se selecciona en las consultas SQL manuales (`SELECT id, nombre, email, created_at`), y en el modelo de Sequelize se excluye por defecto con `defaultScope`. Además, las contraseñas se guardan siempre hasheadas con `bcrypt`, nunca en texto plano, aunque en este módulo todavía no se usen para autenticar (eso se implementa con JWT en el Módulo 8).
- **¿Por qué decidiste actualizar sólo ciertos campos?** La ruta `PUT /usuarios/:id` solo permite modificar `nombre` y `email`. Se dejó fuera la contraseña a propósito: cambiar una contraseña es una operación sensible que debería tener su propia validación (confirmar la contraseña actual, exigir un mínimo de seguridad, etc.), algo que tiene más sentido resolver junto con la autenticación del Módulo 8.
- **¿Qué validaciones aplicaste para evitar errores?** Antes de actualizar o eliminar un usuario, se valida que exista (`existeUsuario`) y se responde con un error 404 claro si no. En la transacción, cualquier error revierte automáticamente todo lo que se había insertado hasta ese punto (`rollback`), para no dejar datos a medias.
- **¿Qué ventaja encontraste usando ORM frente al cliente SQL tradicional?** Con `Sequelize` no hace falta escribir el `SELECT`/`INSERT` a mano ni preocuparse tanto de escapar valores para evitar inyección SQL; además, resolver la relación `Usuario` → `Pedidos` fue mucho más simple con `include` que escribiendo un `JOIN` y después "armando" el objeto anidado a mano. La contraparte es que con SQL manual queda más claro exactamente qué consulta se está ejecutando, lo cual ayuda a entender qué está pasando "por debajo" del ORM.
- **¿Por qué MySQL y no PostgreSQL?** La consigna menciona ambos motores según la sección: los "Requerimientos" generales y "Acceso y gestión de datos" nombran PostgreSQL, mientras que el objetivo específico de la Lección 1 permite explícitamente "MySQL o PostgreSQL". Se optó por MySQL porque ya se contaba con una instancia configurada y en uso (en el iMac y en un VPS propio), lo que permitió enfocar el tiempo en la lógica de la aplicación en vez de en instalar un motor nuevo. Tanto `mysql2` como `Sequelize` (con `dialect: 'mysql'`) soportan este motor sin ninguna limitación para lo que pide este módulo.
- **¿Por qué el modelo se llama `Usuario` y no `User`?** La Lección 5 sugiere el nombre `User` a modo de ejemplo, pero se mantuvo `Usuario` para que el modelo del ORM sea consistente con el resto del proyecto, que está nombrado en español (tabla `usuarios`, rutas `/usuarios`, `usuario.controller.js`, etc.).
- **¿Por qué se usó "Pedidos" tanto en la transacción (Lección 4) como en la relación (Lección 6)?** La consigna da ambos ejemplos por separado ("registrar un usuario y crear su historial" para la transacción, "Usuario tiene muchos Pedidos" para la relación), pero como son solo ejemplos ilustrativos, se optó por usar una única segunda entidad (`Pedidos`) para las dos cosas: así la transacción de la Lección 4 queda demostrando, de paso, la relación que se explota en la Lección 6, en vez de crear una tabla extra (`historial`) que no se volvería a usar.

### Reflexión

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

## Próximos pasos (no incluidos todavía en esta entrega)

- Módulo 8: API RESTful, subida de archivos y autenticación JWT.
