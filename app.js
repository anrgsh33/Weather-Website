require("dotenv").config();
const express = require("express");
const https = require("https"); //Native node module
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // To send css file with html all html,css,img,scripts should be in a subdirectory ex-public
// and then we can use this code to send files
//https://stackoverflow.com/questions/38757235/express-how-to-send-html-together-with-css-using-sendfile?rq=3 link to stackoverflow article
app.get(function (req, res) {});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  //console.log(apikey);
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;
  https.get(url, function (response) {
    //console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data); // convert JSON to js object JSON.stringify(object) it converts js object into JSON
      // console.log(weatherData);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          temp +
          " degree celcius.</h1>"
      );
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write("<img src=" + imgUrl + ">"); //sending an img
      res.send(); // We can have only one res.send() in a single app.get but can have multiole res.write()
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});
