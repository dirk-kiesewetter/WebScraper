// Grab the articles as json
$.getJSON("/articles", function(data) {
  // For each one
  for (let i = 0; i < data.length; i++) {
    // Display the article on the relevant page (saved article or unsaved)
    if (!data[i].isSaved) {
      $("#articles").append(
        `<div class='each-article'><h2 class="scraped-title">${
          data[i].title
        }</h2><p class="scraped-summary">${
          data[i].summary
        }</p><a class='article-link' href='${
          data[i].articleUrl
        }'target='_blank'>${
          data[i].articleUrl
        }</a><br><a class='save-article-btn waves-light btn' data-id=${
          data[i]._id
        }>Save Article</a></div><div class='article-separator'</div>`
      );
    } else {
      {
        $("#saved-articles").append(
          `<div class='each-article'><h2 class="scraped-title">${
            data[i].title
          }</h2><p class="scraped-summary">${
            data[i].summary
          }</p><a class='article-link' href='${
            data[i].articleUrl
          }'target='_blank'>${
            data[i].articleUrl
          }</a><br><a class='delete-article-btn waves-light btn' data-id=${
            data[i]._id
          }>Delete Article</a> <a class='show-notes-btn btn' data-target='modal1' data-id=${
            data[i]._id
          }>Show notes</a></div><div class='article-separator'</div>`
        );
      }
    }
  }
});

// When you click the SAVE ARTICLE button
$(document).on("click", ".save-article-btn", function() {
  // console.log(this);
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("thisId = ", thisId);

  // PUT for changing article status to isSaved:true
  $.ajax({
    method: "PUT",
    url: "/submit",
    data: {
      title: $(".scraped-title").val(),
      summary: $(".scraped-summary").val(),
      articleUrl: $(".article-link").val(),
      thisId: thisId
    }
  }).then(function(data) {
    location.reload();
  });
});

// When you click the DELETE ARTICLE button
$(document).on("click", ".delete-article-btn", function() {
  // console.log(this);
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("thisId = ", thisId);

  // PUT for changing article status to isSaved:false
  $.ajax({
    method: "PUT",
    url: "/delete",
    data: {
      title: $(".scraped-title").val(),
      summary: $(".scraped-summary").val(),
      articleUrl: $(".article-link").val(),
      thisId: thisId
    }
  }).then(function(data) {
    location.reload();
  });
});

$(document).on("click", ".show-notes-btn", function() {
  document.getElementById("all-notes").style.visibility = "visible";
  document.getElementById("individual-note").style.visibility = "visible";

  // Empty the notes from the note section
  $("#individual-note").empty();
  // Save the id
  var thisId = $(this).attr("data-id");
  console.log("thisId - line 94", thisId); //returns good data

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("line 103", data); //correct
      // The title of the article

      // A textarea to add a new note body
      $("#individual-note").append(
        "<textarea id='bodyinput' name='body'></textarea>"
      );
      // A button to submit a new note, with the id of the article saved to it

      $("#individual-note").append(
        `<button data-id='${data._id}' class='deletenote'>Delete Note</button>`
        // console.log("line 121", data._id)
      );

      // If there's a note in the article - not working
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// getting all notes
$.getJSON("/notes", function(data) {
  console.log("notes JSON", data);
});

//closes out of the notes window
$(document).on("click", "#closebutton", function() {
  document.getElementById("individual-note").style.visibility = "hidden";
  document.getElementById("all-notes").style.visibility = "hidden";
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  document.getElementById("all-notes").style.visibility = "hidden";

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log("line 142", thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the individual-note section
      $("#individual-note").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
