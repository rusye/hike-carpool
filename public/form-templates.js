'use strict';

function logInTemplate() {
  // move the onclick into javascript somehow
  return `
      <form id='loginForm' class='modal-content animate' action=''>
        <section class="imgcontainer">
          <span class="close" title="Close Modal">&times;</span>
        </section>

        <fieldset>
          <legend>Login</legend>
          <section class='container'>
            <label><b>Username</b>
              <input name='username' type='text' placeholder='Enter Username' required>
            </label>

            <label><b>Password</b>
              <input name='password' type='password' placeholder='Enter Password' required>
            </label>

            <section class='formButtons'>
              <button class='formLoginRegisterButton' type='submit'>Login</button>

              <button type='button' class='cancelbtn '>Cancel</button>
            </section>
          </section>
        </fieldset>
      </form>
  `
};

// make a function for the cancel button

function registerTemplate() {
  return `
      <form id='registerForm' class='modal-content animate' action=''>
        <section class="imgcontainer">
          <span class="close" title="Close Modal">&times;</span>
        </section>

        <fieldset>
          <legend>Register</legend>
          <section class='container'>
            <label><b>Username</b>
              <input name='username' id='registerUsername' type='text' placeholder='Enter Desired Username' required>
            </label>

            <label><b>Password</b>
              <input name='password' type='password' id='registerPassword' placeholder='Set A Password' required>
            </label>

            <label><b>First Name</b>
              <input name='firstname' type='text' id='registerFirstName' placeholder='Enter First Name'>
            </label>

            <label><b>Last Name</b>
              <input name='lastname' type='text' id='registerLastName' placeholder='Enter Last Name'>
            </label>

            <label><b>Email</b>
              <input name='email' type='email' id='registerEmail' placeholder='Enter Email'>
            </label>

            <section class='formButtons'>
              <button class='formLoginRegisterButton' type='submit'>Register</button>
              <button type='button' class='cancelbtn '>Cancel</button>
            </section>
          </section>
        </fieldset>
      </form>
  `
};