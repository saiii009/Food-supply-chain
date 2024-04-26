const express = require('express')
const { exec } = require("child_process");
var bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))


app.post('/placeOrder', async function (req, res){

})

app.listen(10000, ()=>{
    console.log("LISTENING ON 10000")
})