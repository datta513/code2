let express = require("express");
let app = express();
app.use(express.json());
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
/*API 2  POST*/
app.post("/movies/", async (request, response) => {
  // console.log("entered");
  let mo = request.body;
  let { directorId, movieName, leadActor } = mo;
  let query = `INSERT INTO movie(director_id,movie_name,lead_actor)
        values(
            ${directorId},
            '${movieName}',
            '${leadActor}',
        );`;
  try {
    await db.run(query);

    response.send("Movie Successfully Added");
  } catch (e) {
    console.log(`error message ${e}`);
    console.log(mo);
  }
});
module.exports = app;
