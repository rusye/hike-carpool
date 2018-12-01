'use strict';

function logInTemplate() {
  return `
    <form id='loginForm' class='modal-content animate' action=''>
      <section class="imgcontainer">
        <span class="close" title="Close Form">&times;</span>
      </section>

      <fieldset>
        <legend>Login</legend>
        <section class='container'>
          <label><b>Username</b>
            <input name='username' type='text' placeholder='required' required>
          </label>

          <label><b>Password</b>
            <input name='password' type='password' placeholder='required' required>
          </label>

          <section class='formButtons'>
            <button class='formSubmitButton' type='submit'>Login</button>

            <button type='button' class='cancelbtn '>Cancel</button>
          </section>
        </section>
      </fieldset>
    </form>
  `
};

function registerTemplate() {
  return `
    <form id='registerForm' class='modal-content animate' action=''>
      <section class="imgcontainer">
        <span class="close" title="Close Form">&times;</span>
      </section>

      <fieldset>
        <legend>Register</legend>
        <section class='container'>
          <label><b>Username</b>
            <input name='username' id='registerUsername' type='text' placeholder='required' required>
          </label>

          <label><b>Password</b>
            <input minlength='4' maxlength='72' name='password' type='password' id='registerPassword' placeholder='required' required>
          </label>

          <label><b>First Name</b>
            <input name='firstName' type='text' id='registerFirstName' placeholder='optional'>
          </label>

          <label><b>Last Name</b>
            <input name='lastName' type='text' id='registerLastName' placeholder='optional'>
          </label>

          <label><b>Email</b>
            <input name='email' type='email' id='registerEmail' placeholder='optional'>
          </label>

          <section class='formButtons'>
            <button class='formSubmitButton' type='submit'>Register</button>
            <button type='button' class='cancelbtn '>Cancel</button>
          </section>
        </section>
      </fieldset>
    </form>
  `
};

function displayAllPostsTemplate(posts) {
  posts.forEach(post => {
    $('.posts').prepend(`
      <section id='individualPosts'>
          <h2>${post.hikename}</h2>
          <p>${post.date}</p>

          <section id='userAndSeats'>
            <h3>${post.user}</h3>
            <h3>${post.openseats}</h3>
          </section>

          <section id='postContent'>
            <p>${post.content}</p>
          </section>
        </section>
      </section>
    `);
  });
};

function newHikePost() {
  return `
      <form id='newHikePost' class='modal-content animate' action=''>
        <section class="imgcontainer">
          <span class="close" title="Close Form">&times;</span>
        </section>

        <fieldset>
          <legend>New Hike</legend>
          <section class='container'>
            <label><b>Hike Name</b>
              <input name='hikename' id='newHikeName' type='text' placeholder='required' required>
            </label>

            <label><b>Number of Open Seats</b>
              <input name='openseats' id='newOpenSeats' type='number' max='14' placeholder='required' required>
            </label>

            <label><b>Description About Hike</b>
              <input name='content' id='newContent' type='text' placeholder='required' required>
            </label>

            <section class='formButtons'>
              <button class='formSubmitButton' type='submit'>Create New Hike</button>
              <button type='button' class='cancelbtn '>Cancel</button>
            </section>
          </section>
        </fieldset>
      </form>
  `
};