'use strict';

const modal = document.getElementsByClassName('forms')[0];

const home = document.getElementsByClassName('loadedHome')[0];


// ++++++++++++++++++++++++++++++++++++
// ++++++Nav bar before logging in+++++
// ++++++++++++++++++++++++++++++++++++


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
      loadHomeTemplate(posts);
      home.style.display = 'block';
    }
  })
};

// Will open the login form
function logInButton() {
  $('.login').on('click', function(e) {
    e.preventDefault();
    closeAForm();
    $('.forms').append(logInTemplate);
    modal.style.display = 'block';
    logInSubmit();
  });
};

// Will open the registration form
function registerButton() {
  $('.register').on('click', function(e) {
    e.preventDefault();
    closeAForm();
    $('.forms').append(registerTemplate);
    modal.style.display = 'block';
    registerSubmit();
  })
};

// Fires up the form closing listeners
function closeAForm() {
  formsCancelButton();
  formsX();
  clickOutsideOfForms();
}

// Form will close when you click outside of it
function clickOutsideOfForms() {
  window.onclick = function(e) {
    if (e.target == modal) {
      removeForm();
    };
  };
};

// Close's the form
function formsCancelButton() {
  $('.modal').on('click', '.cancelbtn', function(e) {
    e.preventDefault();
    removeForm();
  });
};

// Close form when clicking on X
function formsX() {
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

// This will load all of your posts
function myHikesButton() {};

// This will load the form for new hikes
function newHikeButton(userID) {
  $('.makeNewPost').on('click', function(e) {
    e.preventDefault();
    closeAForm();
    $('.forms').append(newHikePost);
    modal.style.display = 'block';
    newHikeSubmit(userID);
  })
};

// This will submit the new post
function newHikeSubmit(userID) {};

// Load additional listeners upon login
function loadListenersUponLogin(userID) {
  logOutButton();
  myHikesButton(userID);
  homeButton();
  newHikeButton(userID);
};

// Initial listeners that are needed when the page fist loads
function loadInitialListeners() {
  logInButton();
  registerButton();
};

$(loadInitialListeners);