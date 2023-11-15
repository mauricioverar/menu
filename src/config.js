import { config } from "dotenv"
config()

export const PORT = process.env.PORT
export const USUARIO = process.env.USUARIO
export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_DATABASE = process.env.DB_DATABASE
export const DB_PORT = process.env.DB_PORT

export const SECRET = process.env.SECRET

export const APP_NAME = process.env.APP_NAME
console.log("App conf", APP_NAME) // Menu_Escolar
