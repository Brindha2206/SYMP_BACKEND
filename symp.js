const express=require("express")
const bodyParser = require("body-parser")
const refexp=require("express")
const refmysql=require("mysql2")
const cors=require('cors')

const app=refexp()
const dbase=refmysql.createConnection({
    "host":"localhost",
    "user":"root",
    "password":"22br06un2005dha",
    "port":3306,
    "database":"symposium"
})
dbase.connect(()=>{
    console.log("DATABASE CONNECTED")
})
const application= express()
application.use(bodyParser.urlencoded({extended:true}))
application.use(bodyParser.json())
application.use(cors())
application.listen(1995,()=>{
    console.log("APP IS RUNNING!!")
})
application.get('/fetch',async(req,res)=>{
    const sql="select * from Symposiums"
    dbase.query(sql,(err,records)=>{
        if(err){
            res.status(404).json({"error":err.message})
            return
        }
        if(records.length==0){
            res.json(201).json({"message":"data not found"})
            return
        }
        res.status(200).json({records})
    })
})

application.post("/new",async(req,res)=>{
    const{ID,Department,Completion_year,Event_Name,Event_Date,Venue,student_name}=req.body
    const sql="insert into Symposiums values(?,?,?,?,?,?,?)"
    dbase.query(sql,[ID,Department,Completion_year,Event_Name,Event_Date,Venue,student_name],(err,ack)=>{
        if(err){
            res.status(404).json({"error":err.message})
            return
        }
        res.status(200).json({message:"PARTICIPANT ADDED SUCESSFULLY"})
    })

})

application.put("/change/:number",async(req,res)=>{
    const{Event_Name,Venue}=req.body
    const sql="update Symposiums set Event_name=?,Venue=? where ID=?"
    dbase.query(sql,[Event_Name,Venue,req.params.number],(err,ack)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        res.status(200).json({message:"EVENT NAME AND VENUE UPDATED"})

    })
})

application.delete('/delkey/:key',async(req,res)=>{
    const sql="delete from Symposiums where ID=?"
    dbase.query(sql,[req.params.key],(err,ack)=>{
        if(err){
            res.status(500).json({error:err.message})
            return
        }
        if(ack.affectedRows==0){
            res.status(404).json({message:"Records not available to delete"})
            return
        }
        res.status(201).json({message:"Records deleted"})
    })
})