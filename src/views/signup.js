const form = document.querySelector('form');
const emailError = document.querySelector('.email.error');
const passwordError = document.querySelector('.password.error');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  emailError.textContent = '';
  passwordError.textContent = '';

  const email = form.email.value;
  const password = form.password.value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.error) {
      emailError.textContent = data.error.email;
      passwordError.textContent = data.error.password;
    }
    if (data.user) location.assign('/');
  } catch (error) {
    console.log(error.message);
  }
});
