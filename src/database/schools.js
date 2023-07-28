import { pool } from "../db.js"

let msg = ''
let is_admin = 0

// logearse ingresar ***** buscar user
export const get_schools = async (req, res) => {
  console.log('get_school')
  try {
    const email = req.body.email.trim()
    const password = req.body.pass.trim()

    const [user_find] = await pool.query(
      "select * from schools where email=?",
      [email]
    )

    // console.log(user_find[0])

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

    // console.log(user_find[0])
    // console.log('id_user', user_find[0].id_user)
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
    // console.log('roles de este usuario:')
    // user_roles.map(roles => console.log(roles.rolename)) // admin


    res.json({ token }); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk5NzUwNDYsImV4cCI6MTY5MDA2MTQ0Nn0.Jbzi-0CukleAzhuNdmUqIQ5qyCWr50EF7ekgSimJod4
  } catch (error) {
    console.log(error);
  }
};

export async function get_school(email) {
  console.log('ver email')

  try {
    const [rows] = await pool.query(
      `select * from schools where email = ?`,
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
export async function get_school_name(name) {
  console.log('ver name')

  try {
    const [rows] = await pool.query(
      `select * from schools where name = ?`,
      [name]
    )
    // console.log(rows[0])
    if (rows[0].is_admin == 1) console.log(rows[0].is_admin)

    // 4. retorno el primer usuario, en caso de que exista
    console.log('ver name ok')

    return rows[0]
  } catch (error) {
    console.log(error);
  }
}

export async function create_school(name, email, password, is_admin) {
  // console.log('export create_school ')
  // console.log(name, email, password, is_admin)
  let resp

  try {
    [resp] = await pool.query(
      `insert into schools (name, email, password, is_admin) values (?, ?, ?, ?)`,
      [name, email, password, is_admin]
    )

    // 3. Devuelvo el cliente al pool

    // console.log('export create_school ok')
    // console.log(resp.insertId)//[0]) // id

    return resp.insertId
  } catch (error) {
    console.log(error);
  }

}
