import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import nunjucks from "nunjucks"
import flash from "connect-flash"
import path from "path"
import { fileURLToPath } from 'url';

import index from "./routes/index.js"
import {APP_NAME} from "./config.js"
import new_order from "./routes/new_order.js" // no usar new solo (palabra reservada)

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(morgan("dev")) // ver datos en consola
app.use(express.json()) // interpretar json
app.use(express.urlencoded({extended: true})) // se configura uso de formularios
app.use(helmet()) // ocultar info sobre versiones y validar
app.use(flash()) // se configura uso de mensajes flash

// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('./public'))

// se configura nunjucks
const nunj_env = nunjucks.configure(path.resolve(__dirname, "views"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true,
});
nunj_env.addGlobal('app_name', APP_NAME) // var global *****

// Routes
app.use("/", index)
app.use('/orders', new_order)

/* app.use("/api", jobs); // prefijo
app.use("/api/auth", auth); // signup y signin *** */

// ruta no existe
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;