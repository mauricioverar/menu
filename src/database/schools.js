import { pool } from "../db.js"
import bcrypt from "bcryptjs"

// logearse ingresar ***** buscar user
export const get_school = async (req, res) => {
    console.log('get_school')
    try {
      const email = req.body.email.trim()
      const password = req.body.pass.trim()
  
      const [user_find] = await pool.query(
        "select * from schools where email=?",
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
  };