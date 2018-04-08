const apiController = require("../controllers/api_controller");

module.exports = function(app) {
  app.get("/scrape", apiController.scrape); 

  app.get("/api/articles", apiController.articles);

  app.post("/api/articles/:id", apiController.oneArticle); 

};