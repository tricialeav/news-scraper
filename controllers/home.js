module.exports = {
    renderHome: function(req, res) {
      res.render("../views/index.handlebars", {
        msg: "Welcome! this is data being passed into the render method!"
      });
    }
  };