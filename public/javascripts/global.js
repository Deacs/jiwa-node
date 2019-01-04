// User list data array for filling in info box
var userListData = [];

$(document).ready(function() {
    // Populate user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Edit user link click
    $('#userList table tbody').on('click', 'td a.linkedituser', editUserInfo);

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
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username+ '</a></td>';
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

    // Prevent Link from Firing
    event.preventDefault();
  
    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');
  
    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);
  
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];
  
    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
  
  };

  // Edit user
  function editUserInfo(event) {

    console.log('Prepare to edit user!');
    console.log('--------------------');

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserId = $(this).attr('rel');

    console.log('User ID:');
    console.log(thisUserId);
    console.log('--------------------');

    // Pull from global object - temporary
    // Make an ajax request to find the individual user

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisUserId);
  
    // Get our User Object
    var thisUserObject = userListData[arrayPosition];
    console.log('User Object fron global object');
    console.log(thisUserObject);
    console.log('--------------------');
  };


  // Update user
  function updateUser(event) {
      console.log('Edit User!');
  };

  // Add User
  function addUser(event) {

      event.preventDefault();

      // Some VERY basic validation
      var errorCount = 0;
      $('#addUser input').each(function(index, val) {
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
                        title: "Poof!",
                        text: "They have gone!",
                        icon: "success",
                        timer: 3000,
                        buttons: false,
                    });
                    // Update the table - should only happen if action was successful
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