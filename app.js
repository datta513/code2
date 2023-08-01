let express = require("express");
let app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
let sql3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let database = path.join(__dirname, "moviesData.db");
let db = null;
let convert = (obj) => {
  console.log(obj.movie_id);
  console.log("functionCall");
  let k = {
    movieId: obj.movie_id,
    directorId: obj.director_id,
    movieName: obj.movie_name,
    leadActor: obj.lead_actor,
  };
  return k;
};
let convert2 = (obj) => {
  return {
    directorId: obj.director_id,
    directorName: obj.director_name,
  };
};
let initserverdb = async () => {
  try {
    db = await open({
      filename: database,
      driver: sql3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`error occured ${e}`);
  }
};
initserverdb();
app.get("/movies/", async (request, response) => {
  let query = `
    select * from movie;`;
  let res = await db.all(query);
  response.send(res.map((eachMovie) => ({ movieName: eachMovie.movie_name })));
});
app.get("/movies/:movieId/", async (request, response) => {
  let { movieId } = request.params;
  let query = `
    select * from movie
    where movie_id=${movieId};`;
  let res = await db.get(query);
  console.log(res);
  response.send(convert(res));
});
/*API 3  POST*/
app.post("/movies/", async (request, response) => {
  // console.log("entered");
  let mo = request.body;
  let { directorId, movieName, leadActor } = mo;
  let query = `INSERT INTO
   movie(director_id,movie_name,lead_actor)
        values(
            ${directorId},
            '${movieName}',
            '${leadActor}'
        );`;
  try {
    let k = await db.run(query);
    response.send("Movie Successfully Added");
  } catch (e) {
    console.log(`error message ${e}`);
    console.log(mo);
  }
});

/*API 4 put*/
app.put("/movies/:movieId/", async (req, resp) => {
  let { movieId } = req.params;
  let { directorId, movieName, leadActor } = req.body;
  console.log(req.body.director_id);
  let query = `update movie
  set
   director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}' 
  where movie_id=${movieId};`;
  let res = await db.run(query);
  resp.send("Movie Details Updated");
  /* let query1 = `select * from movie;`;
  let res2 = await db.all(query1);
  console.log(res2);*/
});

/*API delete*/
app.delete("/movies/:movieId/", async (req, resp) => {
  let { movieId } = req.params;
  let query = `
delete from movie
where movie_id=${movieId};`;
  let res = await db.run(query);
  resp.send("Movie Removed");
});
/*API get director*/
app.get("/directors/", async (req, resp) => {
  let query = `select * from director;`;
  let res = await db.all(query);
  resp.send(res.map((each) => convert2(each)));
});
module.exports = app;
