drop table schools cascade;
drop table orders;
select * from schools;
select * from orders;
delete from schools where id_school = 15;
delete from orders where id_order = 7;
select * from schools where email = 'b@web.cl';

CREATE TABLE schools (
  id_school serial NOT NULL PRIMARY KEY, -- INT(8)
  name text NOT NULL unique, -- text
  email text unique not NULL,
  password text NOT NULL,
  is_admin bool NOT NULL default false -- bool false
);

INSERT INTO schools (name, email, password, is_Admin) values ('beta', 'b@web.cl', '$2a$10$YefqEOH8e.8ZvFenEkyD3O67XL61w4MIV2koU8wSrctcw3eB2kTzO', false);

CREATE TABLE orders (
  id_order serial NOT NULL PRIMARY KEY, -- INT(8)
  date date NOT NULL,
  is_rectified bool NOT NULL default false, -- bool false
  observations text,
  school_id int NOT NULL references schools(id_school), -- public.schools.id_school
  vegetarian int,
  celiac int,
  standard int,
  caloric int,
  ethnic int,
  ped_vegetarian int,
  ped_celiac int,
  ped_standard int,
  ped_caloric int,
  ped_ethnic int
);