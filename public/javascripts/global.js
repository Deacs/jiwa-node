// User list data array for filling in info box
var userListData = [];

$(document).ready(function() {
    // Populate user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Edit user link click
    $('#userList table tbody').on('click', 'td a.linkedituser', editUserInfo);

    // Edit current user link (shown within the user details box)
    $('#btnEditCurrentUser').on('click', editUserInfo);

    // Add user button click
    $('#btnAddUser').on('click', addUser);

    // Edit user button click
    $('#btnUpdateUser').on('click', updateUser);

    // Delete user button click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Fill in table with data
function populateTable() {
    // Empty content string
    var tableContent = '';

    // jQuery Ajax call for data
    $.getJSON('/users/userlist', function( data ) {

        // Add the user data as a var in the global object
        userListData = data;

        // Add a new row for each JSON item
        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this._id + '">' + this.username+ '</a></td>';
            tableContent += '<td>' + this.email+ '</td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id+ '">Edit</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id+ '">Delete</a></td>';
            tableContent += '<tr>';
        });

        // Inject the string into the HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {
    event.preventDefault();
    $('#btnEditCurrentUser').show();
    var thisUserId = $(this).attr('rel');

    // Populate the info box
    handleUserData(thisUserId, populateInfoBox);
};

// Take a user ID, retrieve their data and pass it to the success handler
function handleUserData(id, resultHandler) {
    $.ajax({
        type: 'GET',
        url: '/users/' + id,
        dataType: 'JSON',
        success: function(response) {
            return resultHandler(response);
        },
        error: function() {
            swal({
                title: 'Oops!',
                text: 'That use cannot be found',
                icon: 'error'
            });
        }
    });
};

// Edit user
function editUserInfo(event) {
    event.preventDefault();
    var thisUserId = $(this).attr('rel');

    handleUserData(thisUserId, populateEditForm);
};

// Populate the edit form with the current user's data
function populateEditForm(userObject) {
    $('#inputUpdateUserName').val(userObject.username);
    $('#inputUpdateUserFullname').val(userObject.fullname);
    $('#inputUpdateUserEmail').val(userObject.email);
    $('#inputUpdateUserAge').val(userObject.age);
    $('#inputUpdateUserGender').val(userObject.gender);
    $('#inputUpdateUserLocation').val(userObject.location);
    $('#inputUpdateUserId').val(userObject._id);
};

// Populate the info box with the current user's data
function populateInfoBox(userObject) {
    $('#userInfoName').text(userObject.fullname);
    $('#userInfoAge').text(userObject.age);
    $('#userInfoGender').text(userObject.gender);
    $('#userInfoLocation').text(userObject.location);
    $('#btnEditCurrentUser').attr('rel', userObject._id);
};

// Update user
function updateUser(event) {
    event.preventDefault();
    // Validation
    var errorCount = 0;

    // Once again, crazy simple validation
    $('#updateUser input, #updateUser select').each(function(index, val) {
        // Increment the error count if any field is empty
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // Empty error count means we're good to go
    if (errorCount === 0) {
        // Object creation, we are not checking for changes, just rebuilding the object
        var updatedUser = {
            'username': $('#updateUser fieldset input#inputUpdateUserName').val(),
            'email': $('#updateUser fieldset input#inputUpdateUserEmail').val(),
            'fullname': $('#updateUser fieldset input#inputUpdateUserFullname').val(),
            'age': $('#updateUser fieldset input#inputUpdateUserAge').val(),
            'location': $('#updateUser fieldset input#inputUpdateUserLocation').val(),
            'gender': $('#updateUser fieldset select#inputUpdateUserGender').val()
        };

        var updatedUserId = $('#updateUser fieldset input#inputUpdateUserId').val();

        // Put the object to the updateuser service
        $.ajax({
            type: 'PUT',
            data: updatedUser,
            url: '/users/update/' + updatedUserId,
            dataType: 'JSON'
        }).done(function( response ) {
            if (response.msg === '') {
                swal({
                    title: "Good job!", 
                    text: response.body.fullname + " successfully updated!", 
                    icon: "success",
                    timer: 3000,
                    buttons: false
                });
                // Tidy up and clear the form inputslinkshowuser
                $('#updateUser fieldset input').val('');
                // Update the table
                populateTable();
                // If the info box is displaying the details of the user that we are updating, refresh those details
                if (response._id === $('#btnEditCurrentUser').attr('rel')) {
                    // This is crazy as a second API request is being made to get the data
                    handleUserData(response._id, populateInfoBox);
                }
            } else {
                // Something has failed, output the received message
                swal({
                    title: "Error!", 
                    text: response.msg, 
                    icon: "error",
                    timer: 5000,
                    buttons: true
                });
                alert('Error: ' + response.msg);
            }
        }).fail(function() {
            swal({
                title: "Error!", 
                text: response.fullname + " could not be edited!", 
                icon: "error",
                timer: 2000,
                buttons: false
            });
        });
    } else {
        swal({
            title: 'Oops!',
            text: 'You can\t leave any fields empty',
            icon: 'error'
        });
        return false;
    }
};

// Add User
function addUser(event) {
    event.preventDefault();
    // Some VERY basic validation
    var errorCount = 0;
    $('#addUser input, #addUser select').each(function(index, val) {
        // Increment the error count if any field is empty
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // If the error count is still at zero, we can proceed
    if (errorCount === 0) {
        // Compile all of the form data into one object
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset select#inputUserGender').val()
        }

        // Post the object to the adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            // A blank response is a successful response
            if (response.msg === '') {

                swal({
                    title: "Good job!", 
                    text: response.fullname + " successfully added!", 
                    icon: "success",
                    timer: 3000,
                    buttons: false
                });

                // Tidy up and clear the form inputs
                $('#addUser fieldset input').val('');
                // Update the table
                populateTable();
            } else {
                // Something has failed, output the received message
                alert('Error: ' + response.msg);
            }
        });
    } else {
        // There is a positive errorCount, therefore validation failed
        swal({
            title: 'Oops!',
            text: 'Please fill in all fields',
            icon: 'error'
        });
        return false;
    }
};

// Delete User
function deleteUser(event) {
    event.preventDefault();

    swal({
        title: "Delete User?",
        text: "Once deleted, you will not be able to recover this amazing individual!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {

            $.ajax({
                type: 'DELETE',
                url: '/users/deleteuser/' + $(this).attr('rel')
            }).done(function( response ) {
                // A blank response is a successful response
                if (response.msg === '') {
                    swal({
                        title: "Piff Paff Poff!",
                        text: "They have gone!",
                        icon: "success",
                        timer: 3000,
                        buttons: false,
                    });

                    populateTable();
                } else {
                    swal({
                        title: "Error",
                        text: response.msg, 
                        icon: "error",
                        timer: 3000,
                        buttons: false,
                    });
                }
            });

        } else {
            swal("Phew! That was close!");
            return false;
        }
    });
};
