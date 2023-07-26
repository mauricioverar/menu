import { Router } from "express" // const router = Router(); // export default router;
// import { index } from "../database/index.js"

const router = Router()

const usuario = { name: 'mao' }
// const usuario = ''
console.log('users')
function protected_route(req, res, next) {
  if (!usuario.name) {
    console.log('error', 'usuario sin acceso')
    // return res.redirect('/login')
    res.send('usuario sin acceso')
    return
  }
  next()
}

// crear tablas users roles roleuser 

// router.get("/", index)
router.get('/', protected_route, async (req, res) => {
  console.log('index')
  const school = { id: 1, name: 'Leon', is_admin: false, liceo: '' }

  try {

    res.render('index.html', { school })

  } catch (error) {
    console.log(error)
  }
})

export default router;