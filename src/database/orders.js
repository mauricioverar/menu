import { pool } from "../db.js"

let msg = ''
let is_admin = false

// logearse ingresar ***** buscar user
/* export const get_orders = async (req, res) => {
  console.log('get_order')
  try {
    const email = req.body.email.trim()
    const password = req.body.pass.trim()

    const [user_find] = await pool.query(
      "select * from orders where email=?",
      [email]
    )

    console.log(user_find[0])

    if (!user_find[0]) return res.status(400).json({ message: "Usuario o contraseña incorrecta" });

    // 3. verificamos las contraseñas
    // console.log(password, user_find[0].pass)
    const son_coincidentes = await bcrypt.compare(password, user_find[0].pass)
    if (!son_coincidentes) {
      console.log('errors', 'Usuario inexistente o contraseña incorrecta')
      return res.status(400).json({ message: "Usuario o contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user_find[0].id_user }, SECRET, {
      expiresIn: 86400, // 24 hours
    });

    console.log(user_find[0])
    console.log('id_user', user_find[0].id_user)
    // roles del usuario
    const [user_roles] = await pool.query(
      `SELECT  rolename
        FROM roleuser
        JOIN roles ON roles.id_role = roleuser.roleid
        where roleuser.userid = ?
        ;`,
      [user_find[0].id_user]
    )

    // user_roles=[ { rolename: 'admin' }, { rolename: 'user' }, { rolename: 'super' } ]
    console.log('roles de este usuario:')
    user_roles.map(roles => console.log(roles.rolename)) // admin


    res.json({ token }); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk5NzUwNDYsImV4cCI6MTY5MDA2MTQ0Nn0.Jbzi-0CukleAzhuNdmUqIQ5qyCWr50EF7ekgSimJod4
  } catch (error) {
    console.log(error);
  }
}; */

export async function get_order(email) {
  console.log('ver email')

  try {
    const [rows] = await pool.query(
      `select * from orders where email = ?`,
      [email]
    )
    // console.log(rows[0])
    if (rows[0].is_admin == 1) console.log(rows[0].is_admin)

    // 4. retorno el primer usuario, en caso de que exista
    console.log('ver email ok')

    return rows[0]
  } catch (error) {
    console.log(error);
  }
}

export async function create_order(date, is_rectified, observations, school_id, vegetarianos, celiacos, estandar, calorico, autoctono) {
  console.log('export create_order ')
  // console.log(date, is_rectified, observations, school_id, vegetarianos, celiacos, estandar, calorico, autoctono)
  let resp

  try {
    resp = await pool.query(
      `insert into orders
      (date, is_rectified, observations, school_id, vegetarian, celiac, standard, caloric, ethnic)
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [date, is_rectified, observations, school_id, vegetarianos, celiacos, estandar, calorico, autoctono]
    )

    // 3. Devuelvo el cliente al pool

    console.log('export create_order ok')
    console.log(resp)

    return resp[0]
  } catch (error) {
    console.log(error);
  }
}

export async function update_order(is_rectified, observations,
  vegetarian, celiac, standard, caloric, ethnic,
  vegetarianos, celiacos, estandar, calorico, autoctono, id_orden) {
  console.log("export update_order *** is_rectified", is_rectified)
  let resp

  try {
    resp = await pool.query(
      `update orders SET
      is_rectified = $1,
      observations = $2,
      vegetarian = $3,
      celiac = $4,
      standard = $5,
      caloric = $6,
      ethnic  = $7,
      ped_vegetarian = $8,
      ped_celiac = $9,
      ped_standard = $10,
      ped_caloric = $11,
      ped_ethnic  = $12
      WHERE id_order = $13`,
      [is_rectified, observations, 
        vegetarian, celiac, standard, caloric, ethnic,
        vegetarianos, celiacos, estandar, calorico, autoctono, id_orden]
    )

    // 3. Devuelvo el cliente al pool

    console.log('export create_order ok')
    console.log(resp[0])

    return resp[0]
  } catch (error) {
    console.log(error);
  }
}

//to_char(date, 'Mon dd, yyyy') as fecha
//name,  //join schools on schools(id_school) no es, en mysql es schools.id_school // inner solo los que unen tablas y outer todos de ambas tabas
export async function get_orders () {
  console.log('get_orders orders.js');
  try {
    /* const [rows] = await pool.query(
      `select name, id_order, DATE_FORMAT(date, '%d/%m/%Y')date, is_rectified, observations, school_id, vegetarian, celiac, standard, caloric, ethnic, ped_vegetarian, ped_celiac, ped_standard, ped_caloric, ped_ethnic from orders
      inner join schools on schools.id_school = orders.school_id order by date`
    ) // mysql */
    // const client = await pool.connect()
    const rows = await pool.query(
      `select name, id_order, to_char(date,'DD-MM-YYYY') As dateformat, is_rectified, observations, school_id, vegetarian, celiac, standard, caloric, ethnic, ped_vegetarian, ped_celiac, ped_standard, ped_caloric, ped_ethnic from orders
      inner join schools on schools.id_school = orders.school_id order by dateformat`
    ) // postgres
    //TypeError: (intermediate value) is not iterable // campos vacios

    // 4. retorno el primer usuario, en caso de que exista
    // console.log("rows:::", rows)
    if (rows.rowCount == 0) {
      return
    }
    // console.log('rows rows ',rows.rows)
    return rows.rows //[0]
  } catch (error) {
    console.log(error)
    console.log('error L133')
    // return "error de conexión al host"
  }
  
}
