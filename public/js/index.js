
function wallsubmit() {

    var name = $('#name').val().trim();
    var email = $('#email').val().trim();
    var message = $('#message').val().trim();

    // make sure all the fields are fields are filled out
    if (name != '' && email != '' && message != '') {

        // call the submit function
        $.ajax({
            type: "POST",
            url: '/wallsubmit',
            data: {
                'msg_name': name,
                'msg_email': email,
                'msg_messsage': message
            },
            success: function (resp) {
                $('#name').val('');
                $('#email').val('');
                $('#message').val('');
                window.location = '/';
            }
        });
    }
    else {
        alert("Whoops, looks like you missed a field!");

    }
}

function showSnackBar() {

    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 6000);
}

$(document).ready(function() {

    showSnackBar();

    var text_max = 250;
    $('#charcount').html(text_max + ' characters remaining');

    $('#message').keyup(function() {
        var text_length = $('#message').val().length;
        var text_remaining = text_max - text_length;

        $('#charcount').html(text_remaining + ' characters remaining');
    });

});