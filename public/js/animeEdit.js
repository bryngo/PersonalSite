/**
 *
 * @param ObjectID anime_id
 */
function animeSubmit(anime_id) {

  var title = $('#name').val().trim();
  var rating = $('#rating').val().trim();
  var fav_char = $('#fav_char').val().trim();
  var review = $('#review').val().trim();
  var wallpaper = $('#wallpaper').val().trim();


  // make sure all the fields are fields are filled out
  if (title != '' && rating != '' && fav_char != '' && review != '' && wallpaper != '') {

    // call the submit function
    $.ajax({
      type: "POST",
      url: '/animesubmit',
      data: {
        'title'   : title,
        'rating'  : rating,
        'fav_char': fav_char,
        'review'  : review,
        '_id'     : anime_id,
        'wallpaper': wallpaper
      },
      success: function (resp) {
        $('#name').val('');
        $('#rating').val('');
        $('#fav_char').val('');
        $('#review').val('');
        $('#wallpaper').val('');
        window.location = '/animeEdit';
      }
    });
  }
  else {
    alert("Whoops, looks like you missed a field!");
  }
}

/**
 *
 * @param ObjectID anime_id
 */
function animeDelete(anime_id) {

  $.ajax({
    type: "POST",
    url: '/animedelete',
    data: {
      '_id': anime_id
    },
    success: function(resp) {

      window.location = '/animeEdit';
    }
  });

  console.log("DELETING: " + anime_id);
}

/**
 *
 * @param ObjectID anime_id
 */
function animeModify(anime_id) {

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
      $('#wallpaper').val('');

      window.location = '/animeEdit?name=' + jsonResp[0].title +
        '&rating=' + jsonResp[0].rating +
        '&fav_char=' + jsonResp[0].fav_char +
        '&review=' + jsonResp[0].review +
        '&_id=' + jsonResp[0]._id +
        '&wallpaper=' + jsonResp[0].wallpaper;
    }

  });

  console.log("Modifying: " + anime_id);

}

/**
 *
 * @param ObjectId anime_id
 */
function animeEpSubmitRedirect(anime_id) {

  window.location = '/animeEpEdit?parentId=' + anime_id;

} // called from the animeEdit page, redirects user to animeEpEdit page

/**
 *
 * @param ObjectId parentId
 */
function animeEpSubmit(parentId) {

  var epNumber = $('#epNumber').val().trim();
  var epRating = $('#epRating').val().trim();
  var epReview = $('#epReview').val().trim();

  // make sure all the fields are filled out
  if(epNumber != '' && epRating != '' && epReview != '') {

    // submit the episode data to the appropriate anime
    $.ajax({
      type: "POST",
      url: '/animeEpSubmit',
      data: {
        'epNumber' : epNumber,
        'epRating' : epRating,
        'epReview' : epReview,
        'parentId' : parentId
      },
      success: function (resp) {
        $('#epNumber').val('');
        $('#epRating').val('');
        $('#epReview').val('');

        window.location = '/animeEpEdit?parentId=' + parentId;
      }
    });
  }

}

/**
 *
 * @param ObjectID animeEpId
 */
function animeEpDelete(animeEpId) {

  $.ajax({
    type: "POST",
    url: '/animedelete',
    data: {
      '_id': anime_id
    },
    success: function(resp) {

      window.location = '/animeEdit';
    }
  });

  console.log("DELETING: " + anime_id);

}

/**
 *
 * @param ObjectId animeEpId
 */
function animeEpModify(animeEpId) {

}
