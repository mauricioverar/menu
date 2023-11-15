-- CREATE DATABASE IF NOT EXISTS menu_escolar;

-- USE menu_escolar;

CREATE TABLE schools (
  id_school INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY, -- INT(8)
  name VARCHAR(22) NOT NULL unique, -- text
  email VARCHAR(45) unique not NULL,
  password VARCHAR(99) NOT NULL,
  is_admin int(1) NOT NULL default 0 -- bool false
);

drop table schools;
drop table orders;
INSERT INTO schools (name, email) values ('a3', 'a@web.cl');
DELETE FROM schools WHERE is_admin=0;

-- CREATE TABLE IF NOT EXISTS orders (
CREATE TABLE orders (
  id_order integer NOT NULL AUTO_INCREMENT PRIMARY KEY, -- INT(8)
  date date NOT NULL,
  is_rectified int(1) NOT NULL default 0, -- bool false
  observations text,
  school_id integer NOT NULL references schools(id_school), -- public.schools.id_school
  vegetarian integer,
  celiac integer,
  standard integer,
  caloric integer,
  ethnic integer,
  ped_vegetarian integer,
  ped_celiac integer,
  ped_standard integer,
  ped_caloric integer,
  ped_ethnic integer
);

CREATE TABLE jobs (
  id_job INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(22) NOT NULL,
  uri VARCHAR(45) DEFAULT NULL,
  img VARCHAR(45) NOT NULL,
  num INT(3) NOT NULL, 
  text text NOT NULL
);

-- eliminar campo num, usar id
ALTER TABLE jobs
DROP COLUMN `num`;

CREATE TABLE icons (
  id_icon INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(22) NOT NULL,
  ext VARCHAR(22) NOT NULL
);

CREATE TABLE roles (
  id_role INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  rolename VARCHAR(22) NOT NULL
);
-- id_role INT NOT NULL unique PRIMARY KEY,

INSERT INTO roles (rolename) values 
  ("admin"),
  ("user"),
  ("super")
;

select * from roles;

CREATE TABLE roleuser (
  userid int NOT NULL REFERENCES users(id_user),
  roleid int NOT NULL REFERENCES roles(id_role),
  primary key(userid,roleid)
);

-- obtener roles de un usuario
SELECT  rolename
FROM roleuser
JOIN roles ON roles.id_role = roleuser.roleid
where roleuser.userid = 22
;

-- role como int
CREATE TABLE users (
  id_user INT(3) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(22) NOT NULL,
  email VARCHAR(22) NOT NULL,
  pass VARCHAR(99) NOT NULL
);
-- ,  role int NOT NULL REFERENCES roles(id_role)
-- role default 0 o false (is_admin)

-- ALTER TABLE <NOMBRE DE TABLA> MODIFY <NOMBRE DE COLUMNA> <TIPO DE DATO>;
-- ALTER TABLE users MODIFY pass VARCHAR(99) NOT NULL;
-- ALTER TABLE users MODIFY role int default 2 not null;
-- agregar relación
-- ALTER TABLE users ADD FOREIGN KEY(role) REFERENCES roles(id_role);
-- borrar foranea
-- alter table users drop FOREIGN KEY users_ibfk_1;
-- borrar campo q tenía foranea
-- alter table users drop role;

-- DELETE FROM table_name WHERE condition;
DELETE FROM users WHERE id_user = 2;

DESCRIBE jobs;

-- INSERT INTO users; usar backend para registrar con pass encriptada
/* {
    "username": "mao",
    "email": "mao@web.cl",
    "pass": "pass",
    "role": 1
} */

SELECT * FROM jobs;

/* ALTER TABLE IF EXISTS public.games
  ADD CONSTRAINT games_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES public.users (id) MATCH SIMPLE
  ON UPDATE NO ACTION
  ON DELETE NO ACTION
; */

-- de muchos a muchos
/* drop table if exists autores_libros;
CREATE TABLE autores_libros(
    autor_cod integer NOT NULL REFERENCES autores(cod) ON DELETE CASCADE ,
    libro_ISBN character varying(15)REFERENCES libros(ISBN) ON DELETE CASCADE ,
    es_coautor boolean DEFAULT false,
    primary key(autor_cod,libro_ISBN)
); */