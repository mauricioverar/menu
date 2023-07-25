import { Router } from "express"
import moment from "moment"

/* import {
    createJob,
    deleteJob,
    getJob,
    getJobs,
    updateJob,
} from "../database/jobs.js"; */
// import { verifyTokenAdmin } from "../middlewares/authjwt.js";

const router = Router()

const timestamp = moment(new Date).format('DD/MM/YYYY')

const usuario = {name: 'mao'}
// const usuario = ''
console.log('new')
function protected_route(req, res, next) {
    if (!usuario.name) {
        console.log('error', 'usuario sin acceso')
        // return res.redirect('/login')
        res.send('usuario sin acceso')
        return
    }
    next()
}

// GET all Jobs
// router.get("/jobs", getJobs);
// router.get('/jobs', protected_route, getJobs)

// new_order GET
router.get('/new_order', protected_route, (req, res) => {
    res.render('new_order.html', { timestamp })
  })

// GET An Job
// router.get("/jobs/:id", protected_route, getJob);

// rutas a verificar con token de acceso ***
// DELETE An Job
// router.delete("/jobs/:id", verifyTokenAdmin, protected_route, deleteJob);

// INSERT An Job ** tambien hacerlo desde frontend **
// router.post("/jobs", verifyTokenAdmin, protected_route, createJob); //

// router.patch("/jobs/:id", verifyTokenAdmin, protected_route, updateJob); // actualización parcial de los datos, put actualización total

export default router;