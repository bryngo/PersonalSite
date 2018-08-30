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

    $.post('/animesubmit',
      {
        'title'    : encodeURIComponent(title),
        'rating'   : encodeURIComponent(rating),
        'fav_char' : encodeURIComponent(fav_char),
        'review'   : encodeURIComponent(review),
        'animeID'  : encodeURIComponent(anime_id),
        'wallpaper': encodeURIComponent(wallpaper)
      },
      function(returnedData){
        console.log(returnedData);
        window.location = '/animeEdit';

      }).fail(function(){
      console.log("Error while submitting anime");
    });
  } else {
    alert("Whoops, looks like you missed a field!");
  }
}

/**
 *
 * @param ObjectID anime_id
 */
function animeDelete(anime_id) {

  $.post('/animedelete',
    {
      'animeID': anime_id
    },
    function(returnedData){
      window.location = '/animeEdit';
    }).fail(function(){
    console.log("Error while deleting anime");
  });
}

/**
 *
 * @param ObjectID anime_id
 */
function animeModify(anime_id) {

  $.post('/animemodify',
    {
      'animeID': anime_id
    },
    function(resp){

      var jsonResp = JSON.parse(resp);

      $('#name').val('');
      $('#rating').val('');
      $('#fav_char').val('');
      $('#review').val('');
      $('#wallpaper').val('');

      window.location = '/animeEdit?animeID=' + jsonResp[0]._id;

    }).fail(function(){
    console.log("Error while modifying anime");
  });
}

/**
 *
 * @param ObjectId anime_id
 */
function animeEpSubmitRedirect(anime_id) {

  window.location = '/animeEpEdit?parentID=' + anime_id;

} // called from the animeEdit page, redirects user to animeEpEdit page

/**
 *
 * @param ObjectId parentId
 */
function animeEpSubmit(parentId, episodeId) {

  var epNumber = $('#epNumber').val().trim();
  var epRating = $('#epRating').val().trim();
  var epReview = $('#epReview').val().trim();

  // make sure all the fields are filled out
  if (epNumber != '' && epRating != '' && epReview != '') {

    $.post('/animeEpSubmit',
      {
        'epNumber': encodeURIComponent(epNumber),
        'epRating': encodeURIComponent(epRating),
        'epReview': encodeURIComponent(epReview),
        'parentID': encodeURIComponent(parentId),
        'episodeID': encodeURIComponent(episodeId)
      },
      function (resp) {

        $('#epNumber').val('');
        $('#epRating').val('');
        $('#epReview').val('');

        window.location = '/animeEpEdit?parentID=' + parentId;

      }).fail(function () {
      console.log("Error while submitting anime episode");
    });
  }
}

/**
 *
 * @param ObjectID animeEpId
 */
function animeEpDelete(animeEpId, parentId) {


  $.post('/animeEpDelete',
    {
      'episodeID': animeEpId
    },
    function(returnedData){
      window.location = '/animeEpEdit?parentID=' + parentId;
    }).fail(function(){
    console.log("Error while deleting anime episode");
  });
}

/**
 *
 * @param ObjectId animeEpId
 */
function animeEpModify(animeEpID, parentID) {

  $.post('/animeEpModify',
    {
      'episodeID': animeEpID,
      'parentID' : parentID
    },
    function(resp){
      var jsonResp = JSON.parse(resp);

      $('#epNumber').val('');
      $('#epRating').val('');
      $('#epReview').val('');

      window.location = '/animeEpEdit?parentID=' + parentID + '&episodeID=' + jsonResp[0]._id;
    }).fail(function(){
    console.log("Error while deleting anime episode");
  });
}
