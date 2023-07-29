let k = require("express");
let app = k();
//app.use(k.json());
let sql3 = require("sqlite3");
let { open } = require("sqlite");
let path = require("path");
let database = path.join(__dirname, "moviesData.db");
let db = null;
let convert = (obj) => {
  //console.log(obj.movie_name);
  return {
    movieName: obj.movie_name,
  };
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
  response.send(res.map((each) => convert(each)));
});
