'use strict';

const modal = document.getElementsByClassName('forms')[0];

const home = document.getElementsByClassName('loadedHome')[0];

const newHikeDisplay = document.getElementsByClassName('makeNewPost')[0];


// ++++++++++++++++++++++++++++++++++++
// ++++++Nav bar before logging in+++++
// ++++++++++++++++++++++++++++++++++++


// Will load the main screen with all posts visible
function getAllPosts() {
  $.ajax({
    url: '/posts',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(posts) {
      console.log(posts);
      displayAllPostsTemplate(posts);
      home.style.display = 'block';
    }
  })
};

// Will open the login form
function logInButton() {
  $('.login').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(logInTemplate);
    closeAForm();
    modal.style.display = 'block';
    logInSubmit();
  });
};

// Will open the registration form
function registerButton() {
  $('.register').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(registerTemplate);
    closeAForm();
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

// This will populate localStorage with the necessary items
function populateStorage(data) {
  localStorage.setItem('username', data.user.username);
  localStorage.setItem('userID', data.user.id);
  localStorage.setItem('token', data.authToken);
  console.log(localStorage.getItem('token'));
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
        populateStorage(data);
        removeForm();
        $('.loggedIn, .notLoggedIn, #introPage').toggle();
        $('.nav-bar').append(`<span id='userInNav'>Welcome, ${localStorage.getItem('username')}!</span>`);
        getAllPosts();
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
      let message = 'Create some popup giving them instructions to login now';
      window.alert(message);
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
    $('.posts').empty();
    $('#userInNav, #allPosts').remove();
    console.log('I have logged out');
    $('.loggedIn, .notLoggedIn, #introPage').toggle();
    home.style.display = 'none';
    localStorage.clear();
  });
};

// Will divert you to the home page
function homeButton() {
  $('.homeButton').on('click', function(e) {
    e.preventDefault();
    $('.posts').empty();
    getAllPosts();
    newHikeDisplay.style.display = 'block';
  })
};

// This will load all of your posts
function myHikesButton() {
  $('.myHikesButton').on('click', function(e) {
    e.preventDefault();
    newHikeDisplay.style.display = 'none';
    $('.posts').empty();
    $.ajax({
      url: '/api/users/' + localStorage.getItem('userID'),
      method: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
      success: function(myposts) {
        console.log('find hike', myposts.posts, myposts.username);
        displayAllPostsTemplate(myposts.posts, myposts.username);
      }
    });
  })
};

// This will load the form for new hikes
function newHikeButton() {
  $('.makeNewPost').on('click', function(e) {
    e.preventDefault();
    $('.forms').append(newHikePost);
    closeAForm();
    modal.style.display = 'block';
    newHikeSubmit();
  })
};

// This will submit the new post
function newHikeSubmit() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    let formData = {
      user_id: localStorage.getItem('userID'),
      hikename: $('input[name="hikename"]').val(),
      openseats: $('input[name="openseats"]').val(),
      content: $('input[name="content"]').val()
    };
    postNewHike(formData);
  })
};

// This will post the new post to the database
function postNewHike(newPostData) {
  console.log(newPostData);
  $.ajax({
    url: '/posts',
    method: 'POST',
    data: JSON.stringify(newPostData),
    dataType: 'json',
    contentType: 'application/json',
    headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')},
    success: function(data) {
      removeForm();
      let message = 'success! remove me later';
      window.alert(message);
      getAllPosts();
    },
    error: function(data) {
      let message = 'There was a problem with your form: ' + data.responseText.message;
      window.alert(message);
    }
  });
};

// Initial listeners that are needed when the page fist loads
function loadInitialListeners() {
  logInButton();
  registerButton();
  logOutButton();
  myHikesButton();
  homeButton();
  newHikeButton();
};

$(loadInitialListeners);