'use strict';

const modal = document.getElementsByClassName('formLoginRegister')[0];

function successfulLogIn() {
  $('.loggedIn, .notLoggedIn').toggle();
};

function logInButton() {
  $('.login').on('click', function(e) {
    e.preventDefault();
    $('.formLoginRegister').append(logInTemplate);
    // document.getElementsByClassName('formLoginRegister')[0].style.display = 'block';
    modal.style.display = 'block';
    clickOutsideOfLoginRegisterForm();
    // successfulLogIn();
  });
};

function registerButton() {
  $('.register').on('click', function(e) {
    e.preventDefault();
    $('.formLoginRegister').append(registerTemplate);
    // document.getElementsByClassName('formLoginRegister')[0].style.display = 'block';
    modal.style.display = 'block';
    clickOutsideOfLoginRegisterForm();
  })
};

function logOutButton() {
  $('.logout').on('click', function(e) {
    e.preventDefault();
    $('.loggedIn, .notLoggedIn').toggle();
  });
};

function clickOutsideOfLoginRegisterForm() {
  // let modal = document.getElementsByClassName('formLoginRegister')[0];
  window.onclick = function(e) {
    if (e.target == modal) {
        modal.style.display = "none";
        $('.modal-content').remove();
    };
  };
};

function cancelButton() {
  // let modal = document.getElementsByClassName('formLoginRegister')[0];
  $('.modal').on('click', '.cancelbtn', function(e) {
    e.preventDefault();
    modal.style.display = "none";
    $('.modal-content').remove();
  });
};

function logInSubmit() {};

function registerSubmit() {
  $('#registerForm').submit(function(e) {
    e.preventDefault();
    console.log('hello');
  });
};

// $('form').submit(function() {
//   console.log('Input 1: '+$('input[name="input1"]').val() + ' Input 2: '+ $('input[name="input2"]').val()); // etc.
// });

function loadListeners() {
  logInButton();
  clickOutsideOfLoginRegisterForm();
  logOutButton();
  registerButton();
  cancelButton();
  registerSubmit();
};

$(loadListeners);