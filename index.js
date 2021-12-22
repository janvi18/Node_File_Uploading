const fs = require("fs")

const express = require("express")
const path = require("path")
//multer 
const multer = require("multer") // npm install multer 
const db = require("./mysqlConfig")

const app = express()


app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var storageConfig = multer.diskStorage({
    destination: function (req, file, next) {
        next(null, "uploads") //folder 
    },
    filename: function (req, file, next) {
        fileName = file.originalname;
        ext = path.extname(file.originalname)
        next(null, fileName);//user myfile  
        //  next("ERROR : INVALID FILE")
        //tejas.gif_202111270534332->  
        //tejas.gif_202111270534333-> 
        //diya/31/ans.pdf_XXXX53333
        //diya/31/ans.pdf_XXXX53360  

    }
})


var maxFileSize = 1024 * 1000 * 10;

var upload = multer({
    storage: storageConfig,
    limits: { fileSize: maxFileSize },
    fileFilter: function (req, file, next) {
        console.log("mime => " + file.mimetype);
        // var mimeType = /jpeg|png|jpg|gif|plain/.test(file.mimetype)
        var mimeType = /plain/.test(file.mimetype) //file.mimetype.contains("plain")
        console.log("name => ", file.originalname);
        console.log("ext => ", path.extname(file.originalname));
        if (mimeType == true) {
            return next(null, file.originalname) // null => no error 
        } else {
            next("ERROR : INVALID FILE")
        }
    }
}).single("myfile");

//node --> file --> multer --> configuration -- max , type , location 
app.post("/uploadfile", function (req, res, next) {
    upload(req, res, function (err, resp) {
        if (err) {
            res.send(err);
        } else {
            let asciiData = "";

            data = fs.readFileSync("uploads/sample.txt")

            let mydata = data.toString();

            for (let i = 0; i < mydata.length; i++) {
                asciiData = asciiData + " " + mydata[i].charCodeAt(0)
            }
            console.log("data => ");
            //  return data;
            console.log(asciiData);
            res.send(asciiData);
        }
    })
})


app.post("/saveemployee", function (req, res) {
    console.log(req.body);
    //db connection
    //insert 
    // console.log(db);
    // db.query("insert into empinfo (firstName,lastName,Email,Salary,Address,Contact) values ")
    db.query("insert into empinfo set ? ", req.body, function (err, data) {
        if (err) {
            console.log("error => ", err);

            res.send("Something went wrong please check logs")
        } else {
            console.log("Record inserted");

            res.send("Employee Saved.!")
        }
    })
})

app.get("/getemployees", function (req, res) {
    db.query("select * from empinfo",function(err,data){
        // res.send(data);
        res.render("ListEmployees", {data:data});
    })
})

app.get("/", function (req, res) {
    res.render("upload");
})

app.get("/AddEmployee", function (req, res) {

    res.render("AddEmployee.ejs")
})

app.listen(3000, function () {
    console.log("Server Started");
})