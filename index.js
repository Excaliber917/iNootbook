const connectTOMongo = require('./db')
const express = require('express')
var cors = require('cors')
const dotenv = require("dotenv");
dotenv.config();

connectTOMongo()
const app = express()
const PORT = process.env.PORT || 5000
app.use(cors())

app.use(express.json())

//rotes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(PORT, () => {
    // console.log(`Example app listening at http://localhost:${port}`)
    console.log("why are you seeking in console")
})
