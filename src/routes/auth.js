import { Router } from "express" // const router = Router(); // export default router;
import bcrypt from "bcryptjs"
import moment from "moment"

// import { index } from "../database/index.js"
import {
    get_school,
    get_school_name,
    create_school
} from "../database/schools.js"
import {
    create_order,
    get_orders
} from "../database/orders.js"

const router = Router()

let msg = ''
let school = { name: 'Visitante', is_admin: 0 }
// let school = null
let is_admin = 0
// let timestamp = moment(new Date).format('DD/MM/YYYY')
let timestamp = moment(new Date).format('YYYY/MM/DD') // formato date mysql
let vegetarianos = 0
let celiacos = 0
let calorico = 0
let autoctono = 0
let estandar = 0
let fechas = []

const usuario = { name: 'mao' }
// const usuario = ''
// console.log('user:', school.name)

// está logueado o no
function protected_route(req, res, next) {
    console.log('schoo', school)
    // !school
    if (school.name == 'Visitante') {

        console.log('protectRute')
        msg = 'Debe loguearse primero'
        return res.redirect('/login')
    }
    next()
}

// index
router.get('/', async (req, res) => { //protected_route, 
    console.log('index')
    try {
        const ordenes = await get_orders()
        console.log('ordenes', ordenes)
        if (!ordenes) return res.render('index.html', {school}) // estado inicial
        console.log(ordenes.length, 'ordenes')
        // let fechas = []
        ordenes.forEach((item) => {
            // fechas.push(item.fecha)
            // const fecha = moment(item.fecha).format('DD/MM/YYYY') // ************
            // fechas.push(fecha) //***********
            fechas.push(item.date)
            // console.log('item index fecha ',item.fecha) // 'Jun 11, 2023' moment(new Date).format('DD/MM/YYYY')
            // console.log('item index fecha ',moment(item.fecha).format('DD/MM/YYYY') ) // 11/06/2023
            console.log('rectificado?', item.is_rectified, item.date)
        })
        console.log(school)
        console.log(fechas)
        res.render('index.html', { school, ordenes, fechas })
    } catch (error) {
        console.log(error)
    }
})

// crear tablas users roles roleuser 

// GET Login
router.get('/login', async (req, res) => {
    console.log('login')
    try {
        console.log('msg', msg)
        res.render('login.html', { msg })

    } catch (error) {
        console.log(error)
    }
})

router.get('/register', (req, res) => {
    console.log('auth', msg)
    res.render('register.html', { msg })
})

// POST Login
router.post('/login', async (req, res) => {
    // 1. me traigo los datos del formulario
    const email = req.body.email.trim()
    console.log('req.body.password', req.body)
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
    const son_iguales = await bcrypt.compare(password, school_buscado.password)
    if (!son_iguales) {
        console.log('33 Usuario es inexistente o contraseña incorrecta')
        msg = ('errors', 'Usuario es inexistente o contraseña incorrecta')

        return res.redirect('/login')
    }

    // PARTE FINAL ***********************
    school = {
        name: school_buscado.name,
        email: school_buscado.email,
        id: school_buscado.id_school,
        is_admin: school_buscado.is_admin
    }
    console.log('Usuario ok ', school)

    return res.redirect('/')
})

router.post('/register', async (req, res) => {
    // 1. me traigo los datos del formulario
    console.log(req.body)
    const name = req.body.name.trim()
    const email = req.body.email.trim()
    const password = req.body.password.trim()
    const password_repeat = req.body.password_repeat.trim()

    // 2. contraseñas
    if (password != password_repeat) {
        msg = ('errors', 'Contraseñas diferentes')
        console.log('errors', 'Contraseñas diferentes')
        return res.redirect('/register')
    }

    // 3. otro usuario con ese mismo correo
    const current_school = await get_school(email)
    if (current_school) {
        msg = ('errors', 'Ese email ya está ocupado')
        return res.redirect('/register')
    }
    // 3. otro liceo con ese mismo nombre
    const current_name = await get_school_name(name)
    if (current_name) {
        msg = ('errors', 'Ese nombre ya está ocupado')
        return res.redirect('/register')
    }

    // 4. es administrador?
    is_admin = 1

    // 5. Finalmente lo agregamos a la base de datos
    const encrypted_pass = await bcrypt.hash(password, 10)
    const new_school = await create_school(name, email, encrypted_pass, is_admin)
    console.log(new_school) //  nuevo id
    /* school = { id: new_school.id_school, name, email }
    console.log('school', school) */
    is_admin = 0
    msg = ''

    // 6. y redirigimos a la ruta principal
    res.redirect('/login')
})

router.get('/new_order', protected_route, async (req, res) => {
    console.log('new_order')
    try {
        console.log('school', school)
        res.render('new_order.html', { timestamp, school })
    } catch (error) {
        console.log(error)
    }
})

// new_order POST
router.post('/new_order', protected_route, async (req, res) => {
    try {

        console.log(req.body)
        if (school.is_admin == 1) {
            console.log(req.body.school_id)
            console.log('fecha de new ', req.body.fecha) // ok '2023-06-10'
            const date = req.body.fecha
            console.log(date) // ok '2023-06-10'
            // console.log('fecha ', date + 'T04:00:00.000Z') // fecha  10/06/2023T04:00:00.000Z --- 2023-06-04T04:00:00.000Z
            // usar 
            /*   const d = new Date(date)
                console.log('d ', d, date) */

            const school_id = req.body.school_id
            vegetarianos = req.body.vegetarianos
            if (vegetarianos == '') { vegetarianos = 0 }
            calorico = req.body.calorico
            if (calorico == '') { calorico = 0 }
            celiacos = req.body.celiacos
            if (celiacos == '') { celiacos = 0 }
            autoctono = req.body.autoctono
            if (autoctono == '') { autoctono = 0 }
            estandar = req.body.estandar
            if (estandar == '') { estandar = 0 }
            /* const vegetarian_ped = 0
            const calorico_ped = 0
            const celiacos_ped = 0
            const autoctono_ped = 0
            const estandar_ped = 0 */
            const is_rectified = 0
            const observations = ''

            fechas.forEach((item) => {
                console.log('item')
                console.log(fechas[0])

                /* if ((date + 'T04:00:00.000Z') == item.split('T04:00:00.000Z')) {
                  req.flash('errors', 'Fecha no puede repetirse entre pedidos')
                  console.log('Fecha no puede repetirse entre pedidos')
                  return res.redirect('/new_order')
                } */
            })

            await create_order(date, is_rectified, observations, school_id, vegetarianos, celiacos, estandar, calorico, autoctono)
        }
        res.redirect('/')

    } catch (error) {
        console.log(error)
    }

    // return res.redirect('/')

})

// rectify POST
router.post('/rectify', protected_route, (req, res) => {
    console.log(req.body)
    const orden = req.body.orden
    const fecha = req.body.fecha
    console.log('fecha rect ', req.body.fecha) // jun // Jun 09, 2023
    // console.log('fecha rect ', req.query.fecha) // jun
    const vegetarian = req.body.vegetarian
    const celiac = req.body.celiac
    const standard = req.body.standard
    const caloric = req.body.caloric
    const ethnic = req.body.ethnic
    console.log('rec ',fecha)
    res.render('rectify.html', { school, orden, fecha, vegetarian, celiac, standard, caloric, ethnic })
  })

router.get('/logout', (req, res) => {
    school = { name: 'Visitante', is_admin: 0 }
    res.redirect('/login')
})

export default router;