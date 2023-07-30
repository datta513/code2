let k = require("express");
let app = k();
app.use(k.json());
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
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
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
  let res = await db.all(query);
  console.log(res);
  response.send(convert(res));
});
/*API 2  POST*/
app.put("/movies/", async (request, response) => {
  let k = request.body;
  let { directorId, movieName, leadActor } = k;
  let query = `insert into movie(director_id,movie_name,lead_actor)
        values(
            ${directorId},
            '${movieName}',
            '${leadActor}',
        );`;
  let res = await db.run(query);
  console.log(res);
});
module.exports = app;
