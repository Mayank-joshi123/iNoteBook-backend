require('dotenv').config()
const connectToMongodb = require("./db")
const express = require('express')
var cors = require('cors')

const app = express()
const port = 8001

/// Connecting to database
connectToMongodb();

/// it's a Middleware
app.use(express.json())

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));

app.use(cors((x => x
  .AllowAnyMethod()
  .AllowAnyHeader()
  .SetIsOriginAllowed(origin => true) // allow any origin
  .AllowCredentials())));

// Avilable routes 
app.use("/api/auth",require("./routes/auth.js"));
app.use("/api/notes",require("./routes/notes.js"));
app.use("/api/user",require("./routes/user.js"));

app.listen(port, () => {
  console.log(`iNotebook app listening on port http://localhost:${port}`)
})