'use strict';

const modal = document.getElementsByClassName('formLoginRegister')[0];


// ++++++++++++++++++++++++++++++++++++
// ++++++Nav bar before logging in+++++
// ++++++++++++++++++++++++++++++++++++


// Will display user content
function successfulLogIn() {
  $('.loggedIn, .notLoggedIn').toggle();
};

// Will open the login form
function logInButton() {
  $('.login').on('click', function(e) {
    e.preventDefault();
    $('.formLoginRegister').append(logInTemplate);
    // document.getElementsByClassName('formLoginRegister')[0].style.display = 'block';
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
    $('.formLoginRegister').append(registerTemplate);
    // document.getElementsByClassName('formLoginRegister')[0].style.display = 'block';
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
  // let modal = document.getElementsByClassName('formLoginRegister')[0];
  window.onclick = function(e) {
    if (e.target == modal) {
      removeForm();
    };
  };
};

// Close's the form
function loginRegisterFormCancelButton() {
  // let modal = document.getElementsByClassName('formLoginRegister')[0];
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
    console.log('username: '+$('input[name="username"]').val() + ' password: '+ $('input[name="password"]').val());
    removeForm();
    successfulLogIn();
  });
};

// Will submit your registration form
function registerSubmit() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    console.log('username: '+$('input[name="username"]').val() + ' password: '+ $('input[name="password"]').val());
    removeForm();
  });
};


// +++++++++++++++++++++++++++++++++++
// ++++++Nav bar after logging in+++++
// +++++++++++++++++++++++++++++++++++


// Will log you out
function logOutButton() {
  $('.logout').on('click', function(e) {
    e.preventDefault();
    $('.loggedIn, .notLoggedIn').toggle();
  });
};

function loadListeners() {
  logInButton();
  clickOutsideOfLoginRegisterForm();
  logOutButton();
  registerButton();
};

$(loadListeners);