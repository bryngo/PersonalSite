function animesubmit() {

  var title = $('#name').val().trim();
  var rating = $('#rating').val().trim();
  var fav_char = $('#fav_char').val().trim();
  var review = $('#review').val().trim();

  // make sure all the fields are fields are filled out
  if (title != '' && rating != '' && fav_char != '' && review != '') {

    // call the submit function
    $.ajax({
      type: "POST",
      url: '/animesubmit',
      data: {
        'title'   : title,
        'rating'  : rating,
        'fav_char': fav_char,
        'review'  : review
      },
      success: function (resp) {
        $('#name').val('');
        $('#rating').val('');
        $('#fav_char').val('');
        $('#review').val('');
        window.location = '/anime_edit';
      }
    });
  }
  else {
    alert("Whoops, looks like you missed a field!");
  }
}

function anime_delete(anime_id) {

  console.log("DELETING: " + anime_id);
}

function anime_edit(anime_id) {

  console.log("EDITING: " + anime_id);

}