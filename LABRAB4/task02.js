const ut = require('./utils');
const con = ut.get_conn();
const query = "INSERT INTO data_set(day,city,name,count) VALUES ('2021-05-12','Кунгур','elon musk',250)"
con.promise()
    .query(query) 
    .then(console.log('Данные добавлены'))
    .catch((err)=>console.error(err))
    .then(con.end());