const { faker } = require('@faker-js/faker');
const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const mysql = require('mysql2');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended: true}));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: "devild",
    password:"200407@bibhu"
  });
//    let data=[];   

  let createRandomUser= () => {
    return [
      faker.datatype.uuid(),    //now returns a array...
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  }
  
  app.listen("8080",()=>{
    console.log(`listening on port ${port}`);
  });

  app.get("/",(req,res)=>{
  let q=`SELECT COUNT(*) FROM userdevil`;
  try {
    connection.query(q, //important write [] when passing multiple data...
      function(err, results) {
              if(err) throw err;
              let Count=results[0]["COUNT(*)"];
              res.render("EJ.ejs",{Count});
              console.log(Count); // results is an array...so all the array functions will work on it... 
          });}
        catch (err) {
              console.log(err);
          }
  });

  app.get("/user",(req,res)=>{
    let q=`SELECT * FROM userdevil`;
    try {
      connection.query(q, //important write [] when passing multiple data...
        function(err, results) {
                if(err) throw err;
                res.render("showuser.ejs",{ results }); 
            });}
          catch (err) {
                console.log(err);
            }
    });

    app.get("/user/:id/edit",(req,res)=>{
      let id=req.params;
      console.log(id);
      let q=`SELECT id,username,email FROM userdevil WHERE id='${id.id}'`;
      try {
        connection.query(q, //important write [] when passing multiple data...
          function(err, results) {
                  if(err) throw err;
                  //console.log(results[0]);
                  let gyg=results[0];
                  res.render("formedit.ejs",{ gyg}); 
              });}
            catch (err) {
                  console.log(err);
              }
      });
      
      app.patch("/user/:id",(req,res) => {
        let {id}=req.params;
        console.log(id);
        console.log(req.body);
        let {content:USER,password:PASS}=req.body;
        console.log(USER);
        console.log(PASS);
        let q=`SELECT * FROM userdevil WHERE id='${id}'`;
        try {
          connection.query(q, //important write [] when passing multiple data...
            function(err, user) {
                    if(err) throw err;
                    console.log(user[0].password);
                    if(PASS == user[0].password){
                      let query=`UPDATE userdevil SET username=' ${USER}' WHERE id='${id}'`;
                      connection.query(query, //important write [] when passing multiple data...
                      function(err, results) {
                      if(err) throw err;
                      res.redirect("/user");
                      });
                    }else{
                      res.send("Wrong password");
                    } 
                });}
              catch (err) {
                    console.log(err);
                }
      });
      
      app.get("/newuser",(req,res) =>{
        res.render("newdata.ejs");
      });

      app.post("/user",(req,res) => {
        let query="INSERT INTO userdevil (id,username,email,password) VALUES (?,?,?,?);";
        let val=[req.body.id,req.body.username,req.body.email,req.body.password];
        connection.query(query, val,//important write [] when passing multiple data...
        function(err, results) {
        res.redirect("/user");
        });
      });

      app.get("/user/:id/delete",(req,res)=>{
      let id=req.params;
      let q=`SELECT * FROM userdevil WHERE id='${id.id}'`;
      try {
        connection.query(q, //important write [] when passing multiple data...
          function(err, results) {
                  if(err) throw err;
                  let gyg=results[0];
                  res.render("deletecheck.ejs",{ gyg}); 
              });}
            catch (err) {
                  console.log(err);
              }
        });

      app.delete("/user/:id",(req,res)=>{
        let id=req.params;
        let {email:EMAIL,password:PASS}=req.body;
        let q=`SELECT * FROM userdevil WHERE id='${id.id}'`;
        try {
        connection.query(q, //important write [] when passing multiple data...
          function(err, results) {
                  if(err) throw err;
                  let gyg=results[0];
                  if (gyg.email == EMAIL && gyg.password == PASS) {
                    let query=`DELETE FROM userdevil WHERE password = '${PASS}';`;
                    connection.query(query, //important write [] when passing multiple data...
                    function(err, results) {
                    if(err) throw err;
                    res.redirect("/user");
                    });
                  } else {
                    res.send("wrong password or email");
                  }
              });}
            catch (err) {
                  console.log(err);
              }
        });
  //  for (let index = 0; index < 100; index++) {
  //       data.push(createRandomUser());
  //  }
 
  //let query="INSERT INTO userdevil (id,username,email,password) VALUES ? ;"; //insert data for multiple users...at once...
   
  //let val=["12345","12345@bbc","abc45@gmail.com","abc12345"]; insert data for single user...at once...
  //let val=[["123","123@bbc","abc@gmail.com","abc123"],["1234","1234@bbc","abc4@gmail.com","abc1234"]];// and only single question mark..
  //console.log(fields); we write fields when we use select query...fields contains extra meta data about results, if availabl
