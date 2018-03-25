
function wallsubmit() {

    console.log("Submitting...");
    var name = $('#name').val().trim();
    var email = $('#email').val().trim();
    var message = $('#message').val().trim();

    console.log("Name: " + name);
    console.log("email: " + email);
    console.log("message: " + message);

    // make sure all the fields are fields are filled out
    if (name != '' && email != '' && message != '') {

        console.log("All fields are good! Uploading to database");

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

$(document).ready(function() {

    var text_max = 250;
    $('#charcount').html(text_max + ' characters remaining');

    $('#message').keyup(function() {
        var text_length = $('#message').val().length;
        var text_remaining = text_max - text_length;

        $('#charcount').html(text_remaining + ' characters remaining');
    });

});