'use strict';

const modal = document.getElementsByClassName('forms')[0];

const home = document.getElementsByClassName('loadedHome')[0];

// let currentUserToken;
// Might remove that global variable, going to pass along the data with user id and name


// ++++++++++++++++++++++++++++++++++++
// ++++++Nav bar before logging in+++++
// ++++++++++++++++++++++++++++++++++++


// Will display user content
// Don't need a function for one line of code
// function successfulLogIn() {
//   $('.loggedIn, .notLoggedIn').toggle();
//   loadHome();
// };

// Will load the main screen with all posts visible
function loadHome(user) {
  $('.nav-bar').append(`<span id='userInNav'>Welcome, ${user.username}!</span>`);
  $.ajax({
    url: '/posts',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(posts) {
      console.log(posts);
      // $('main').append(loadHomeTemplate(posts));
      loadHomeTemplate(posts);
      home.style.display = 'block';
    }
  })
};

// Will open the login form
function logInButton() {
  $('.login').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(logInTemplate);
    // document.getElementsByClassName('forms')[0].style.display = 'block';
    modal.style.display = 'block';
    logInSubmit();
    closingLoginRegisterForm();
    // loginRegisterFormCancelButton();
    // loginRegisterFormX();
    // clickOutsideOfLoginRegisterForm();
  });
};

// Will open the registration form
function registerButton() {
  $('.register').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(registerTemplate);
    // document.getElementsByClassName('forms')[0].style.display = 'block';
    modal.style.display = 'block';
    registerSubmit();
    closingLoginRegisterForm();
    // loginRegisterFormCancelButton();
    // loginRegisterFormX();
    // clickOutsideOfLoginRegisterForm();
  })
};

// Fires up the form closing listeners
function closingLoginRegisterForm() {
  loginRegisterFormCancelButton();
  loginRegisterFormX();
  clickOutsideOfLoginRegisterForm();
}

// Form will close when you click outside of it
function clickOutsideOfLoginRegisterForm() {
  // let modal = document.getElementsByClassName('forms')[0];
  window.onclick = function(e) {
    if (e.target == modal) {
      removeForm();
    };
  };
};

// Close's the form
function loginRegisterFormCancelButton() {
  // let modal = document.getElementsByClassName('forms')[0];
  $('.modal').on('click', '.cancelbtn', function(e) {
    e.preventDefault();
    removeForm();
  });
};

// Close form when clicking on X
function loginRegisterFormX() {
  $('.modal').on('click', '.close', function(e) {
    e.preventDefault();
    removeForm();
  });
};

// Hide's the form and clear it's contents
function removeForm() {
  modal.style.display = "none";
  $('.modal-content').remove();
};

// Will handle logging in
function logInSubmit() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    let formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val()
    };
    $.ajax({
      url: '/api/auth/login',
      method: 'POST',
      data: JSON.stringify(formData),
      dataType: 'json',
      contentType: 'application/json',
      success: function(data) {
        console.log(data.user.id);
        removeForm();
        $('.loggedIn, .notLoggedIn, #introPage').toggle();
        loadHome(data.user);
        loadListenersUponLogin(data.user.id);
      },
      error: function(data) {
        let message = 'There was a problem logging in. ' + data.responseText;
        window.alert(message);
      } 
    });
  });
};

// Will submit your registration form
function registerSubmit() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    let formData = {
      username: $('input[name="username"]').val(),
      password: $('input[name="password"]').val(),
      firstName: $('input[name="firstName"]').val(),
      lastName: $('input[name="lastName"]').val(),
      email: $('input[name="email"]').val()
    };
    registerUser(formData);
  });
};

function registerUser(newUserData) {
  $.ajax({
    url: '/api/users',
    method: 'POST',
    data: JSON.stringify(newUserData),
    dataType: 'json',
    contentType: 'application/json',
    success: function() {
      removeForm();
    },
    error: function(data) {
      let message = 'There was a problem with your form: ' + data.responseText.message;
      window.alert(message);
    }
  });
};

// +++++++++++++++++++++++++++++++++++
// ++++++Nav bar after logging in+++++
// +++++++++++++++++++++++++++++++++++


// Will log you out
function logOutButton() {
  $('.logout').on('click', function(e) {
    e.preventDefault();
    $('.loggedIn, .notLoggedIn, #introPage').toggle();
    $('#userInNav, #allPosts').remove();
    home.style.display = 'none';
  });
};

// Will divert you to the home page
function homeButton() {
  $('.homeButton').on('click', function(e) {
    e.preventDefault();
    loadHome();
  })
};

function myHikesButton() {};

function newHikeButton() {};

function loadListenersUponLogin(userID) {
  logOutButton();
  myHikesButton(userID);
  homeButton();
  newHikeButton(userID);
};

function loadInitialListeners() {
  logInButton();
  clickOutsideOfLoginRegisterForm();
  registerButton();
};

$(loadInitialListeners);