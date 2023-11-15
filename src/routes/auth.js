import { Router } from "express" // const router = Router(); // export default router;
import bcrypt from "bcryptjs"
import moment from "moment"

// import { index } from "../database/index.js"
import {
  get_school,
  get_schools,
  get_school_name,
  create_school,
} from "../database/schools.js"

import { create_order, get_orders, update_order } from "../database/orders.js"

import { USUARIO } from "../config.js"

const router = Router()

let msg = ""
let school = { name: "Visitante", is_admin: false }
// let school = null
let is_admin = false
// let timestamp = moment(new Date).format('DD/MM/YYYY')
let timestamp = moment(new Date()).format("YYYY/MM/DD") // formato date mysql
let vegetarianos = 0
let celiacos = 0
let calorico = 0
let autoctono = 0
let estandar = 0
let fechas = []

const usuario = { name: USUARIO }
console.log("usuario", usuario.name)
// const usuario = ''
// console.log('user:', school.name)

// está logueado o no
function protected_route(req, res, next) {
  console.log("protected_route")
  // console.log('schoo', school)
  // !school
  if (school.name == "Visitante") {
    console.log("protectRute")
    msg = "Debe loguearse primero"
    return res.redirect("/login")
  }
  next()
}

// index
router.get("/", async (req, res) => {
  //protected_route,
  console.log("index auth")
  try {
    const ordenes = await get_orders()
    if (!ordenes) return res.render("index.html", { school }) // estado inicial *** modi
    console.log(ordenes.length, "ordenes length")
    // let fechas = []
    ordenes.forEach((item) => {
      console.log(item)
      // fechas.push(item.fecha)
      // const fecha = moment(item.fecha).format('DD/MM/YYYY') // ************
      // fechas.push(fecha) //***********
      fechas.push(item.dateformat)
      // console.log('item index fecha ',item.fecha) // 'Jun 11, 2023' moment(new Date).format('DD/MM/YYYY')
      // console.log('item index fecha ',moment(item.fecha).format('DD/MM/YYYY') ) // 11/06/2023
      console.log("rectificado?", item.is_rectified, item.dateformat)
    })
    // console.log(school)
    console.log(fechas)
    res.render("index.html", { school, ordenes, fechas })
  } catch (error) {
    console.log(error)
  }
})

// crear tablas users roles roleuser

// GET Login
router.get("/login", async (req, res) => {
  console.log("login")
  try {
    console.log("msg", msg)
    res.render("login.html", { msg })
  } catch (error) {
    console.log(error)
  }
})

router.get("/register", (req, res) => {
  console.log("auth", msg)
  res.render("register.html", { msg })
})

// POST Login
router.post("/login", async (req, res) => {
  // 1. me traigo los datos del formulario
  const email = req.body.email.trim()
  // console.log('req.body.password', req.body)
  const password = req.body.password.trim()

  console.log("login", email, password)

  // 2. intento buscar al usuario en base a su email
  let school_buscado = await get_school(email)
  console.log('school_buscado', school_buscado)
  if (!school_buscado) {
    console.log("107 Usuario es inexistente o contraseña incorrecta")
    msg = "Usuario es inexistente o contraseña incorrecta"
    // console.log(msg)
    return res.redirect("/login")
  }

  // 3. verificamos las contraseñas
  const son_iguales = await bcrypt.compare(password, school_buscado[0].password)
  console.log(school_buscado[0].password)
  console.log(son_iguales) // true
  if (!son_iguales) {
    console.log("116 Usuario es inexistente o contraseña incorrecta")
    msg = ("errors", "Usuario es inexistente o contraseña incorrecta")

    return res.redirect("/login")
  }

  // PARTE FINAL ***********************
  school = {
    name: school_buscado[0].name,
    email: school_buscado[0].email,
    id: school_buscado[0].id_school,
    is_admin: school_buscado[0].is_admin,
  }
  // console.log('Usuario ok ', school)

  return res.redirect("/")
})

router.post("/register", async (req, res) => {
  // 1. me traigo los datos del formulario
  // console.log(req.body)
  const name = req.body.name.trim()
  const email = req.body.email.trim()
  const password = req.body.password.trim()
  const password_repeat = req.body.password_repeat.trim()

  // 2. contraseñas
  if (password != password_repeat) {
    msg = ("errors", "Contraseñas diferentes")
    console.log("errors", "Contraseñas diferentes")
    return res.redirect("/register")
  }

  // 3. otro usuario con ese mismo correo
  const current_school = await get_school(email)
  if (current_school) {
    msg = ("errors", "Ese email ya está ocupado")
    return res.redirect("/register")
  }
  // 4. otro liceo con ese mismo nombre
  const current_name = await get_school_name(name)
  if (current_name) {
    msg = ("errors", "Ese nombre ya está ocupado")
    return res.redirect("/register")
  }

  // 5. otro liceo?
  /* const exists_school = await get_schools()
  if (!exists_school) {
    is_admin = true
    msg = ("errors", "Serás el administrador")
  } */

  // 5. Finalmente lo agregamos a la base de datos
  const encrypted_pass = await bcrypt.hash(password, 10)
  console.log(encrypted_pass)
  //   const new_school = await create_school(name, email, encrypted_pass, is_admin)
  is_admin = true
  const resp = await create_school(name, email, encrypted_pass, is_admin)
  // console.log(new_school) //  nuevo id
  /* school = { id: new_school.id_school, name, email }
    console.log('school', school) */
  is_admin = false
  msg = ""

  if (resp == 1) {
    console.log('school ingresado OK', resp)
  }

  // 6. y redirigimos a la ruta principal
  res.redirect("/login")
})

router.get("/new_order", protected_route, async (req, res) => {
  console.log("new_order GET")
  try {
    // console.log('school', school)
    res.render("new_order.html", { timestamp, school })
  } catch (error) {
    console.log(error)
  }
})

// new_order POST
router.post("/new_order", protected_route, async (req, res) => {
  try {
    console.log("new_order POST")
    // console.log(req.body)
    if (school.is_admin == 1) {
      // console.log(req.body.school_id)
      console.log("fecha de new ", req.body.fecha) // ok '2023-06-10' // postgres 2023/11/14
      const date = req.body.fecha
      console.log(date) // ok '2023-06-10'
      // console.log('fecha ', date + 'T04:00:00.000Z') // fecha  10/06/2023T04:00:00.000Z --- 2023-06-04T04:00:00.000Z
      // usar
      /*   const d = new Date(date)
                console.log('d ', d, date) */

      const school_id = req.body.school_id
      vegetarianos = req.body.vegetarianos
      if (vegetarianos == "") {
        vegetarianos = 0
      }
      calorico = req.body.calorico
      if (calorico == "") {
        calorico = 0
      }
      celiacos = req.body.celiacos
      if (celiacos == "") {
        celiacos = 0
      }
      autoctono = req.body.autoctono
      if (autoctono == "") {
        autoctono = 0
      }
      estandar = req.body.estandar
      if (estandar == "") {
        estandar = 0
      }
      /* const vegetarian_ped = 0
            const calorico_ped = 0
            const celiacos_ped = 0
            const autoctono_ped = 0
            const estandar_ped = 0 */
      const is_rectified = false
      const observations = ""

      fechas.forEach((item) => {
        console.log("item")
        console.log(fechas[0])

        /* if ((date + 'T04:00:00.000Z') == item.split('T04:00:00.000Z')) {
                  req.flash('errors', 'Fecha no puede repetirse entre pedidos')
                  console.log('Fecha no puede repetirse entre pedidos')
                  return res.redirect('/new_order')
                } */
      })

      await create_order(
        date,
        is_rectified,
        observations,
        school_id,
        vegetarianos,
        celiacos,
        estandar,
        calorico,
        autoctono
      )
    }
    res.redirect("/")
  } catch (error) {
    console.log(error)
  }

  // return res.redirect('/')
})

// rectify POST
router.post("/rectify", protected_route, (req, res) => {
  console.log(req.body)
  const orden = req.body.orden
  const fecha = req.body.fecha
  console.log("fecha rect ", req.body.fecha) // jun // Jun 09, 2023 // postgres 14-11-2023
  console.log("vegetarianos_rect", vegetarianos)
  // console.log('fecha rect ', req.query.fecha) // jun
  vegetarianos = req.body.vegetarian
  celiacos = req.body.celiac
  estandar = req.body.standard
  calorico = req.body.caloric
  autoctono = req.body.ethnic

  console.log("rec ", fecha) // postgres 14-11-2023
  console.log("vegetarianos rectify", vegetarianos)

  res.render("rectify.html", {
    school,
    orden,
    fecha,
    vegetarianos,
    celiacos,
    estandar,
    calorico,
    autoctono,
  })
})

// Actualizar new_order
router.post("/order_rectify", async (req, res) => {
  console.log('rectif ypost')
  try {
    const id_orden = req.body.id_orden
    console.log("id_orden PUT", id_orden)
    console.log("PUT", req.body)
    let vegetarian = req.body.vegetarianos
    if (vegetarian == "") {
      vegetarian = 0
    }
    let caloric = req.body.calorico
    if (caloric == "") {
      caloric = 0
    }
    let celiac = req.body.celiacos
    if (celiac == "") {
      celiac = 0
    }
    let ethnic = req.body.autoctono
    if (ethnic == "") {
      ethnic = 0
    }
    let standard = req.body.estandar
    if (standard == "") {
      standard = 0
    }

    const observations = req.body.observaciones
    const is_rectified = true

    console.log("vegetarianos put", vegetarianos)

    await update_order(
      is_rectified,
      observations,
      vegetarian,
      celiac,
      standard,
      caloric,
      ethnic,
      vegetarianos,
      celiacos,
      estandar,
      calorico,
      autoctono,
      id_orden
    )

    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})

// Detalle
router.post("/detalle", async (req, res) => {
  try {
    console.log("detalle", req.body)

    // orden = req.body.orden // school,
    const orden = req.body.orden
    const fecha = req.body.fecha

    vegetarianos = parseInt(req.body.vegetarian)
    celiacos = parseInt(req.body.celiac)
    estandar = parseInt(req.body.standard)
    calorico = parseInt(req.body.caloric)
    autoctono = parseInt(req.body.ethnic)

    const ped_vegetarianos = parseInt(req.body.ped_vegetarian)
    const ped_celiacos = parseInt(req.body.ped_celiac)
    const ped_estandar = parseInt(req.body.ped_standard)
    const ped_calorico = parseInt(req.body.ped_caloric)
    const ped_autoctono = parseInt(req.body.ped_ethnic)

    const observations = req.body.observations

    const perdida =
      ped_vegetarianos +
      ped_celiacos +
      ped_estandar +
      ped_calorico +
      ped_autoctono -
      (vegetarianos + celiacos + estandar + calorico + autoctono)

    console.log(perdida)

    res.render("detalle.html", {
      orden,
      fecha,
      school,
      vegetarianos,
      celiacos,
      estandar,
      calorico,
      autoctono,
      ped_vegetarianos,
      ped_celiacos,
      ped_estandar,
      ped_calorico,
      ped_autoctono,
      perdida,
      observations,
    })
  } catch (error) {
    console.log(error)
  }
})

router.get("/logout", (req, res) => {
  school = { name: "Visitante", is_admin: 0 }
  res.redirect("/login")
})

export default router
