import { Router } from "express" // const router = Router(); // export default router;
// import { index } from "../database/index.js"
import {
    get_school
  } from "../database/schools.js"

const router = Router()

let msg = ''

const usuario = { name: 'mao' }
// const usuario = ''
console.log('users')

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {
    if (!req.school) {

        console.log('protectRute')
        msg = 'Debe loguearse primero'
        return res.redirect('/login')
    }
    next()
}

// index
router.get('/', protected_route, async (req, res) => {
    console.log('index')
    // const school = { id: 1, name: 'Leon', is_admin: true, liceo: '' }

    try {

        res.render('index.html', { school })

    } catch (error) {
        console.log(error)
    }
})

// crear tablas users roles roleuser 

// GET Login
router.get('/login', async (req, res) => {
    console.log('login')
    // const school = { id: 1, name: 'Leon', is_admin: true, liceo: '' }

    try {

        console.log('msg', msg)
        res.render('login.html', { msg })

    } catch (error) {
        console.log(error)
    }
})

// POST Login
router.post("/login", get_school);
/* router.post('/login', async (req, res) => {
    // 1. me traigo los datos del formulario
    const email = req.body.email.trim()
    const password = req.body.password.trim()

    // 2. intento buscar al usuario en base a su email 
    let school_buscado = await get_school(email)
    if (!school_buscado) {
        console.log('24 Usuario es inexistente o contraseña incorrecta')
        msg = ('Usuario es inexistente o contraseña incorrecta')
        console.log(msg)
        return res.redirect('/login')
    }

    // 3. verificamos las contraseñas
    const son_coincidentes = await bcrypt.compare(password, school_buscado.password)
    if (!son_coincidentes) {
        console.log('33 Usuario es inexistente o contraseña incorrecta')
        msg = ('errors', 'Usuario es inexistente o contraseña incorrecta')

        return res.redirect('/login')
    }

    // PARTE FINAL ***********************
    let school = {
        name: school_buscado.name,
        email: school_buscado.email,
        id: school_buscado.id,
        is_admin: school_buscado.is_admin
    }
    console.log('Usuario ok ', school)

    return res.redirect('/')
}) */

export default router;