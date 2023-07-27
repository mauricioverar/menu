import { Router } from "express" // const router = Router(); // export default router;
// import { index } from "../database/index.js"

const router = Router()

let messages = ''

const usuario = { name: 'mao' }
// const usuario = ''
console.log('index')
/* function protected_route(req, res, next) {
  if (!usuario.name) {
    console.log('error', 'usuario sin acceso')
    // return res.redirect('/login')
    res.send('usuario sin acceso')
    return
  }
  next()
} */
// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route(req, res, next) {
  if (!req.school) {
    
    console.log('errors', 'Debe loguearse primero')
    messages = 'Debe loguearse primero'
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  // res.locals.school = req.session.school;
  // finalmente, seguimos el camino original
  next()
}

// crear tablas users roles roleuser 

// router.get("/", index)
router.get('/', protected_route, async (req, res) => {
  console.log('index')
  const school = { id: 1, name: 'Leon', is_admin: true, liceo: '' }

  try {

    res.render('index.html', { school })

  } catch (error) {
    console.log(error)
  }
})

export default router;