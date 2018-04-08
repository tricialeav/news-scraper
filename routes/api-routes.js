const request = require("request");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function(app) {
app.get("/scrape", function (req, res) {
  request("https://www.bbc.com/news", function (error, response, body) {
    console.log('error:', error); 
    console.log('statusCode:', response && response.statusCode)
    
    const $ = cheerio.load(body);
    $(".gs-c-promo-body").each(function (i, element) {
      const result = {};
      result.headline = $(this)
      .children()
        .find("h3")
        .text();
      result.summary = $(this)
        .find("p")
        .text();
      result.link = $(this)
        .find("a")
        .attr("href");
      // The articles are not being updated on page load. TODO run check to see if article has been loaded to db, and if not post. 

      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

app.get("/articles/", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});
};