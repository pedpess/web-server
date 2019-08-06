const path = require("path");
const express = require("express");
const hbs = require("hbs");
const request = require("request");

const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;

// Define custom paths
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars views
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Pedro Pessoa"
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "No search query provided."
    });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      });
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Pedro Pessoa"
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "helpful text",
    title: "Help",
    name: "Pedro Pessoa"
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Pedro Pessoa",
    errorMessage: "Help file article not found."
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Pedro Pessoa",
    errorMessage: "Page not found."
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
