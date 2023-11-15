import { pool } from "../db.js"

let msg = ''
let is_admin = 0

// logearse ingresar ***** buscar users
export const get_schools = async (req, res) => {
  console.log("get_schools")
  try {
    /* const email = req.body.email.trim()
    const password = req.body.pass.trim() */

    // const [users_find] = await pool.query("select * from schools")
    const users_find = await pool.query("select * from schools")

    console.log(users_find)
    return users_find
    // console.log(user_find[0])

    // if (!user_find[0]) return res.status(400).json({ message: "Usuario o contraseña incorrecta" });

    // 3. verificamos las contraseñas
    // console.log(password, user_find[0].pass)

    /* const son_coincidentes = await bcrypt.compare(password, user_find[0].pass)
    if (!son_coincidentes) {
      console.log('errors', 'Usuario inexistente o contraseña incorrecta')
      return res.status(400).json({ message: "Usuario o contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user_find[0].id_user }, SECRET, {
      expiresIn: 86400, // 24 hours
    }); */

    // console.log(user_find[0])
    // console.log('id_user', user_find[0].id_user)
    // roles del usuario

    /* const [user_roles] = await pool.query(
      `SELECT  rolename
        FROM roleuser
        JOIN roles ON roles.id_role = roleuser.roleid
        where roleuser.userid = ?
        ;`,
      [user_find[0].id_user]
    ) */

    // user_roles=[ { rolename: 'admin' }, { rolename: 'user' }, { rolename: 'super' } ]
    // console.log('roles de este usuario:')
    // user_roles.map(roles => console.log(roles.rolename)) // admin

    // res.json({ token }); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk5NzUwNDYsImV4cCI6MTY5MDA2MTQ0Nn0.Jbzi-0CukleAzhuNdmUqIQ5qyCWr50EF7ekgSimJod4
  } catch (error) {
    console.log(error);
  }
};
export async function get_school(email) {
  console.log("ver email en school.js", email)
  // const client = await pool.connect()

  try {
    const rows = await pool.query(
      `select * from schools where email = $1`,
      [email]
    )
    // error: no existe la columna «a»
    console.log(rows.rows)
    if (rows.rows[0].is_admin == false) console.log(rows.rows[0].is_admin)

    // 4. retorno el primer usuario, en caso de que exista
    console.log("ver email ok")

    return rows.rows
  } catch (error) {
    // console.log(error);
    console.log('error email no existe')
  }
}
export async function get_school_name(name) {
  console.log('ver name')

  try {
    const [rows] = await pool.query(
      `select * from schools where name = ${name}`,
      [name]
    ) // err sintaxis = ?
    // console.log(rows[0])
    if (rows[0].is_admin == false) console.log(rows[0].is_admin)

    // 4. retorno el primer usuario, en caso de que exista
    console.log('ver name ok')

    return rows[0]
  } catch (error) {
    // console.log(error);
    console.log('error no existe nombre')
  }
}

export async function create_school(name, email, password, is_admin) {
  // console.log('export create_school ')
  console.log('create_school',name, email, password, is_admin)
  let resp
  // const client = await pool.connect()

  try {
    // const client = await pool.connect() // [resp]
    const resp = await pool.query(
      `insert into schools (name, email, password, is_admin) values ($1, $2, $3, $4)`,
      [name, email, password, is_admin]
    )

    // 3. Devuelvo el cliente al pool

    // console.log('export create_school ok')
    // console.log(resp.insertId)//[0]) // id
    // console.log("resp", resp)

    console.log(resp.rowCount)
    return resp.rowCount
  } catch (error) {
    console.log(error)
  }
}
