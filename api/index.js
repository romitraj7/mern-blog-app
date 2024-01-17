import express from 'express'
const app = express()
const port = 3000;

app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(port,(req,res)=>{
    console.log(`Server is running on http://localhost:${port}`)
});
