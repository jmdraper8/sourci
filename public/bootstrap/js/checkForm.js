var password = document.getElementById("password")
  , confirm_password = document.getElementById("passwordVerify")
  , email = document.getElementById("email")
  , confirm_email = document.getElementById("emailVerify");

function validateForm(){

  if (password.value != confirm_password.value || email.value != confirm_email.value) {
  	console.log('no match');
  	if (password.value != confirm_password.value) {
  		confirm_password.setCustomValidity("Passwords Don't Match");
  	}
    if (email.value != confirm_email.value) {
    	confirm_email.setCustomValidity("Emails Don't Match");    	
    }

  } else if (password.value == confirm_password.value && email.value == confirm_email.value) {
  	console.log('Both Match');
    confirm_password.setCustomValidity('');
    confirm_email.setCustomValidity('');
  }
}

email.onchange = validateForm;
confirm_email.onkeyup = validateForm
password.onchange = validateForm;
confirm_password.onkeyup = validateForm;
