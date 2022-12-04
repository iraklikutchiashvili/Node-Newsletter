const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/f5b671c1e4";
    const options = {
        method: "POST",
        auth: "irakli:5d795e3cba4cc860f59adebe8e42a1bf-us17"
    }

    const request = https.request(url, options, function(response){

        (response.statusCode === 200)?res.sendFile(__dirname + "/success.html"):res.sendFile(__dirname + "/failure.html");

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/success", function(req, res){
    res.redirect("/")
})

app.listen(3000, () => {
    console.log("The server is running on Port 3000");
})


//API key
//5d795e3cba4cc860f59adebe8e42a1bf-us17

//List Id
//f5b671c1e4