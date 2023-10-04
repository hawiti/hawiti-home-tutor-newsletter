const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
require("dotenv").config();

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
  const url="https://us11.api.mailchimp.com/3.0/lists/"+process.env.id;
  const options={
    method: "POST", 
    auth: "hawiti:"+process.env.api_key
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
