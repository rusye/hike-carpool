'use strict';

function logInTemplate() {
  // move the onclick into javascript somehow
  return `
    <!-- <section class='modal formLoginRegister' aria-live='assertive'> --> <!-- removed id='id01' -->
      <form class='modal-content animate' action=''>
        <fieldset>
          <legend>Login</legend>
          <section class='container'>
            <label><b>Username</b>
              <input type='text' placeholder='Enter Username' required>
            </label>

            <label><b>Password</b>
              <input type='password' placeholder='Enter Password' required>
            </label>

            <button class='formLoginRegisterButton logInSubmit' type='submit'>Login</button>
          </section>

          <section class='container' style='background-color:#f1f1f1'>
            <button type='button' class='cancelbtn'>Cancel</button>
          </section>
        </fieldset>
      </form>
      <!-- </section> -->
  `
};

// make a function for the cancel button

function registerTemplate() {
  return `
  <!--<section class='modal formLoginRegister' aria-live='assertive'> --> <!-- removed id='id01' -->
      <form id='registerForm' class='modal-content animate' action=''>
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

            <button class='formLoginRegisterButton registerSubmit' type='submit'>Register</button>
          </section>

          <section class='container' style='background-color:#f1f1f1'>
            <button type='button' class='cancelbtn'>Cancel</button>
          </section>
        </fieldset>
      </form>
      <!--</section> -->
  `
};