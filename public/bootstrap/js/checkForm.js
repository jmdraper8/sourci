var email = document.getElementById("email")
  , emailVerify = document.getElementById("emailVerify");

 var password = document.getElementById("password")
  , passwordVerify = document.getElementById("passwordVerify");



function validatePassword(){

  if (email.value == emailVerify.value && password.value == passwordVerify.value) {
	   emailVerify.setCustomValidity('');
  } else if (email.value == emailVerify.value) {
  	document.getElementById('passwordSuccess').classList.add('has-success');
  }
  else {
	if(email.value != emailVerify.value) {
		emailVerify.setCustomValidity("Emails Don't Match");
	}
	if (password.value != passwordVerify.value) {
		passwordVerify.setCustomValidity("Passwords Don't Match");
	}
  }
}

email.onchange = validatePassword;
emailVerify.onkeyup = validatePassword;
password.onkeyup = validatePassword;
passwordVerify.onkeyup = validatePassword;