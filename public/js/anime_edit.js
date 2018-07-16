function animesubmit(anime_id) {

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
        'review'  : review,
        '_id'     : anime_id
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

  $.ajax({
    type: "POST",
    url: '/animedelete',
    data: {
      '_id': anime_id
    },
    success: function(resp) {

      window.location = '/anime_edit';
    }
  });

  console.log("DELETING: " + anime_id);
}

function anime_modify(anime_id) {

  $.ajax({
    type: "POST",
    url: '/animemodify',
    data: {
      '_id': anime_id
    },
    success: function(resp) {

      var jsonResp = JSON.parse(resp);

      $('#name').val('');
      $('#rating').val('');
      $('#fav_char').val('');
      $('#review').val('');

      window.location = '/anime_edit?name=' + jsonResp[0].title +
        '&rating=' + jsonResp[0].rating +
        '&fav_char=' + jsonResp[0].fav_char +
        '&review=' + jsonResp[0].review +
        '&_id=' + jsonResp[0]._id;

    }
  });

  console.log("Modifying: " + anime_id);

}