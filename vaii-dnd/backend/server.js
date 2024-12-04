const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const port = 3100

const app = express();
app.use(express.static(__dirname))
app.use(express.urlencoded({extended:true}))

mongoose.connect('mongodb://127.0.0.1:27017/users')
const db = mongoose.connection
db.once('open',()=>{
    console.log("Mongodb connection successful")
})

const userSchema = new mongoose.Schema({
    name: String,
    password: String
})

const Users = mongoose.model("data",userSchema)

app.get('/',(req, res)=>{
    res.sendFile(path.join(__dirname, '../src/pages/RegisterPage.js'))
})

app.post('/post',async(req,res)=>{

})

app.listen(port, ()=>{
    console.log("Server started")
})