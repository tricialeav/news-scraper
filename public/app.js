
$(document).ready(function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    .then(function (data) {
      console.log("scrape complete")
      $.ajax({
        method: "GET",
        url: "/articles"
      })
        .then(function (data) {
          for (let i = 0; i < data.length; i++) {
            $("#headline").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br><br>" + data[i].summary + "<br /></p>" + "<a href='https://www.bbc.com" + data[i].link + "' target='_blank'>https://www.bbc.com" + data[i].link + "<hr>");
          }
        });
    })

    $(document).on("click", "p", function () {
      $("#notes").empty();
      let thisId = $(this).attr("data-id");

      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        .then(function (data) {
          console.log(data);
          $("#notes").append("<h2>" + data.headline + "</h2>");
          $("#notes").append("<h3>Title</h3><input id='titleinput' name='title' label=title>");
          $("#notes").append("<h3>Note</h3><textarea id='bodyinput' name='body'></textarea><br>");
          $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");


          if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
          }
        });
    });


    $(document).on("click", "#savenote", function () {
     let thisId = $(this).attr("data-id");
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          title: $("#titleinput").val(),
          body: $("#bodyinput").val()
        }
      })
        .then(function (data) {
          console.log(data);
          $("#notes").empty();
        });
      $("#titleinput").val("");
      $("#bodyinput").val("");
    });


})

