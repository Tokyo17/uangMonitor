const express=require('express')
const cors=require('cors')
const app=express()

const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const postgres = require('postgres');
require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: 'require' });

async function getPostgresVersion() {
  const result = await sql`select * from iot limit 2`;
  console.log(result)
return result
}


async function insertValue(temp,hum) {
  const result = await sql`INSERT INTO iot (temperature,humidity) VALUES (${temp},${hum})`;
  console.log(result)
return result
}





app.get("/iot",function(req,res){
  console.log(req.body.name)
    getPostgresVersion()
    .then(something => {
      res.json(something)
    });
})

app.post("/iot",function(req,res){
  console.log(req.body.name)
    insertValue(req.body.temp,req.body.hum)
    .then(() => {
      res.json("success insert")
    });
})

const port = process.env.PORT || 3001;
app.listen(port,function(){
    console.log("node server is running")
})