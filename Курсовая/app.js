const mysql = require("mysql2");
const express = require("express");
const get_conn = require('./utils').get_conn;

const pool = mysql.createPool({
    host: "pgsha.ru",
    port: "35006",
    user: "soft0068",
    password: "ypHKMRNF",
    database: "soft0068_labrab_06"    
});

const app = express();
const urlencodedParser = express.urlencoded({extended: false});
app.use('/css', express.static(__dirname + '/css'));
app.set("view engine", "hbs");

/* отобразить сериалов */

app.get("/", function(req, res) { // получим список сериалов
    let query = "SELECT * FROM serials";
    pool.query(query, function(err, data) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            serials: data
        });
    });
});

/* добавить новый сериал */

app.get("/create", function(req, res) { // добавить сериал
    res.render("create.hbs");
});

app.post("/create", urlencodedParser, function (req, res) { // сохранить запись в БД
    if (!req.body) return res.sendStatus(400);
    const name = req.body.name;
    const season = req.body.season;
    const data = req.body.data;
	const country = req.body.country;
	const rating = req.body.rating;
    let query = "INSERT INTO serials (name, season, data, country, rating) VALUES (?,?,?,?,?)";
    let params = [name, season, data, country, rating];
    pool.query(query, params, function(err, data) {
        if (err) return console.error(err);
        res.redirect("/");
    });
});

/* изменить данные сериалу */

app.get("/edit/:id", function(req, res) {
    const id = req.params.id;
    pool.query("SELECT * FROM serials WHERE id=?", [id], function(err, data) {
        if (err) return console.error(err);
        res.render("edit.hbs", {
            serials: data[0]
        });
    });
});

app.post("/edit", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const name = req.body.lastname;
    const season = req.body.season;
    const data = req.body.data;
	const country = req.body.country;
	const rating = req.body.rating;
    let query = "UPDATE serials SET name=?, season=?, data=?, country=?, rating=? WHERE id=?";
    let params = [name, season, data, country, rating, id];
    pool.query(query, params, function(err, data) {
        if (err) return console.error(err);
        res.redirect("/");
    });
});

/* удалить запись про сериал */ 

app.post("/delete/:id", function(req, res) {
    const id = req.params.id;
    pool.query("DELETE FROM serials WHERE id=?", [id], function(err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/clear", function(req, res) {   // очистка списока сериалов
    let query_truncate = "TRUNCATE serials";
    const conn = get_conn();

    conn.promise()
    .query(query_truncate)
    .then(() => {
        conn.promise()
            .query('SELECT * FROM serials')
            .then(([data]) => {
                res.render('index.hbs', {
                    serials: data
                });
            })
            .then(conn.end())
            .catch((err) => console.error('sel -> ', err));
    })
    .catch((err) => console.error('tunc ->', err));
}); 


/* отсортировать сериалы */

app.get("/sort/:field.:direct", function(req, res) { // получим список сериалов
    const field = req.params.field;
    const direct = req.params.direct;
    let query = "SELECT * FROM serials ORDER BY " + field + " " + direct;
    pool.query(query, function(err, data) {
        if (err) return console.log(err);
        res.render("index.hbs", {
            serials: data
        });
    });
});


app.listen(3000, function() {
    console.log("смотрим работу через браузер - http://localhost:3000/");
    let isWin = process.platform === "win32";
    let hotKeys = isWin? "Ctrl+C": "Ctrl+D"; // Windows / Linux
    console.log(`остановить сервер - ${hotKeys}`);
});

