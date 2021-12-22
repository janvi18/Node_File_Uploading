const mysql = require("mysql2")
const db = mysql.createConnection({host:"localhost",user:"root",password:"root",database:"empinfo"})

db.connect(function(err){

    if(err){
        console.log("db not connected ");
        console.log(err);
    }else{
        console.log("db connected");
    
    }

})
module.exports = db 