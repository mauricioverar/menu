import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import favicon from "serve-favicon"
import nunjucks from "nunjucks" //usar templates
import path from "path" //para trabajar con rutas de archivos y directorios
import { fileURLToPath } from 'url' //el objeto de URL para convertir en una ruta

import {APP_NAME} from "./config.js"
import auth from "./routes/auth.js"
// import index from "./routes/index.js"
import new_order from "./routes/new_order.js" // no usar new solo (palabra reservada)

const app = express()

const __filename = fileURLToPath(import.meta.url) //obtenga el nombre del archivo con la ruta absoluta completa del archivo
const __dirname = path.dirname(__filename) //Obtiene el nombre completo del directorio donde se encuentra el archivo
console.log('ruta comp arch', __filename) //C:\Users\mao\Desktop\menu\src\app.js
console.log('directorio del arch', __dirname) //C:\Users\mao\Desktop\menu\src

// Middlewares
app.use(morgan("dev")) // ver datos en consola
app.use(express.json()) // interpretar json
app.use(express.urlencoded({extended: true})) // se configura uso de formularios
app.use(helmet()) // ocultar info sobre versiones y validar

// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('./public'))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


// se configura nunjucks //directorio views q contiene templates
const nunj_env = nunjucks.configure(path.resolve(__dirname, "views"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true,
});
nunj_env.addGlobal('app_name', APP_NAME) // app_name var global *****

// Routes
app.use("/", auth) //index
// app.use("/", index) //index
app.use('/', new_order) //orders (prefijo) , pierde bootstrap

/* app.use("/api", jobs); // prefijo
app.use("/api/auth", auth); // signup y signin *** */

// ruta no existe
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;