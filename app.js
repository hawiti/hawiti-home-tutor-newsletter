const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { dirname } = require("path");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req,res){
    res.sendFile(__dirname+"/SignUp.html");
});
app.post("/", function(req,res){
  const Fname=req.body.fname;
  const Lname=req.body.lname;
  const email=req.body.email;

  const data= {
    members:[
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: Fname,
                LNAME: Lname  
            }

        }
    ]
  };

  const JsonData= JSON.stringify(data);
  const url="https://us11.api.mailchimp.com/3.0/lists/a16e63db94";
  const options={
    method: "POST",
    auth: "hawiti:26694898a6712b486f7c654ce22259c7-us11"
  }
  const request=https.request(url, options, function(response){

    if(response.statusCode===200){
      res.sendFile(__dirname+"/Success.html");
    }
    else{
      res.sendFile(__dirname+"/Failure.html");
    }
    response.on("data", function(data){
        console.log(JSON.parse(data));
    });
  });

  request.write(JsonData);
  request.end();
});
 app.post("/failure", function(req,res){
  res.redirect("/");
 })
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on 3000 port");
});
