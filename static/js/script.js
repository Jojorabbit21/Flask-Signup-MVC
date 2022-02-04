/*
function validatePassword (pw, options) {
  
    Password Validator 0.1
    (c) 2007 Steven Levithan 
    MIT License
  
 
  // default options (allows any password)
  var o = {
    lower: 0,
    upper: 0,
    alpha: 0,
    numeric: 0,
    special: 0,
    length: [0, Infinity],
    custom: [],
    badWords: [],
    badSequenceLength: 0,
    noQwertySequences: false,
    noSequential: false
  };

  for(var property in options) {
    o[property] = options[property];
  }

  var re = {
    lower:   /[a-z]/g,
    upper:   /[A-Z]/g,
    alpha:   /[A-Z]/gi,
    numeric: /[0-9]/g,
    special: /[\D]/g
   },
   rule, i;

  // enforce min/max length
  if (pw.length < o.length[0] || pw.length > o.length[1]) {
    return false;
  }

  // enforce lower/upper/alpha/numeric/special rules
  for (rule in re) {
    if ((pw.match(re[rule]) || []).length < o[rule])
     return false;
  }

  // enforce word ban (case-sensitive)
  for (i=0; i < o.badWords.length; i++) {
    if (pw.toLowerCase().indexOf(o.badWords[i].toLowerCase()) > -1) return false;
  }

  // enforce no sequential, identical characters rule
  if (o.noSequential && /([\S\s])\1/.test(pw))
    return false;

  // enforce alphanumeric/qwerty sequence ban rules
  if (o.badSequenceLength) {
    var lower = "abcdefghijklmnopqrstuvwxyz",
    upper   = lower.toUpperCase(),
    numbers = "0123456789",
    qwerty  = "qwertyuiopasdfghjklzxcvbnm",
    start   = o.badSequenceLength - 1,
    seq     = "_" + pw.slice(0, start);
    for (i = start; i < pw.length; i++) {
      seq = seq.slice(1) + pw.charAt(i);
      if (
       lower.indexOf(seq)   > -1 ||
       upper.indexOf(seq)   > -1 ||
       numbers.indexOf(seq) > -1 ||
       (o.noQwertySequences && qwerty.indexOf(seq) > -1)
      ) {
       return false;
      }
    }
  }

  // enforce custom regex/function rules
  for (i=0; i<o.custom.length; i++) {
    rule = o.custom[i];
    if (rule instanceof RegExp) {
      if(!rule.test(pw)) 
        return false;
    }
    else if(rule instanceof Function) {
      if(!rule(pw)) 
        return false;
    }    
  }

  // Success
  return true;
}
*/

// Validity
// Displayname, Fullname, Password, Email, Dateofbirth, Agreement
var validity = {
  'dname':false,
  'fname':false,
  'pw':false,
  'email':false,
  'dob':false,
  'agree':false
};
var termsAgreed = false;

// Email Validation Variables
let email = document.getElementById('email');

// Displayname Validation Variables
let userName = document.getElementById('userid');

// Fullname Validation Variables
let fullName = document.getElementById('username');

// Date Validation Variables
let birth = document.getElementById('birth');

// Password Validation Variables
let timeout;
let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
let password = document.getElementById('password');
let strengthBox = document.getElementsByClassName('pw-meter')[0];
let strengthText = document.getElementsByClassName('pw-meter-text')[0];
let strengthBadge = document.getElementsByClassName('pw-meter-bar')[0];

// Checkbox
let checkbox = document.getElementById('checkbox');

// Validate Password
function validatePassword(password) {
  if(strongPassword.test(password)) {
    strengthBadge.style.backgroundImage = 'linear-gradient(to right, #0bab64, #3bb78f)';
    strengthBadge.style.width = '100%';
    strengthText.style.color = 'forestgreen';
    strengthText.innerHTML = 'Strong';
  }
  else if(mediumPassword.test(password)) {
    strengthBadge.style.backgroundImage = 'linear-gradient(to right, #ec9f05, #ff4e00)';
    strengthBadge.style.width = '60%';
    strengthText.style.color = 'orange';
    strengthText.innerHTML = 'Medium';
  }
  else {
    strengthBadge.style.backgroundImage = 'linear-gradient(to right, #f67062, #fc5296)';
    strengthBadge.style.width = '30%';
    strengthText.style.color = 'crimson';
    strengthText.innerHTML = 'Weak';
  }
}

// Validate Display Name
function validateDisplayName(value) {
  let regExp = /^[ㄱ-힣a-zA-Z0-9]{4,16}$/g; // Ko+Eng+Numbers only
  return regExp.test(value);
}

// Validate Full Name
function validateName(value) {
  let regExp = /^[ㄱ-힣a-zA-Z ]{2,30}$/; // KO+EN Only
  return regExp.test(value);
}

// Validate Email
function validateEmail(value) {
  // let regExp = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  let regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(regExp.test(value)){
    return true;
  }
  else {
    return false;
  }
}

function setValidity(i, type=Boolean) {
  if (i in validity) { 
    validity[i] = type;
    count = 0;
    for(var v in validity) {
      if (validity[v]==true) {
        count ++;
      }
    }
    if(count == Object.keys(validity).length) {
      var submit = document.getElementById('submit');
      console.log('All conditions fulfilled');
      submit.setAttribute('status','filled');
    }
  }
}

//==================================================================== Event Listeners
// Display name Event Listener
userName.addEventListener('focus', () => {
  var info = document.getElementsByClassName('dname-info')[0];
  info.style.display = 'block';
});

userName.addEventListener('blur', () => {
  var info = document.getElementsByClassName('dname-info')[0];
  var con = validateDisplayName(userName.value);
  info.style.display = 'none';
  if(con && userName.value.length > 0) {
    setValidity('dname',true);
  }
});

// Full Name Event Listener
fullName.addEventListener('blur', () => {
  var con = validateName(fullName.value);
  if(con && fullName.value.length > 0) {
    setValidity('fname',true);
  }
});

// Password Event Listener
password.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => validatePassword(password.value), 100);
  if(password.value.length !== 0){
    strengthBox.style.display = 'block';
  }
  else {
    strengthBox.style.display = 'none';
  }
});

password.addEventListener('blur', () => {
  if(password.value.length > 0)
    setValidity('pw',true);
});

// Email Event Listener
email.addEventListener('focus', () => {
  var info = document.getElementsByClassName('email-info')[0];
  info.style.display = 'none';
});

email.addEventListener('blur', () => {
  if(email.value.length > 0) {
    var con = validateEmail(email.value);
    var info = document.getElementsByClassName('email-info')[0];
    if(!con) {
      info.style.display = 'block';
      info.innerHTML = 'Wrong Email Address';
    }
    else {
      setValidity('email', true);
    }
  } 
});

birth.addEventListener('focus', () => {
  birth.style.color = "black";
});

birth.addEventListener('blur', () => {
  var info = document.getElementsByClassName('birth-info')[0];
  if(birth.value.length > 0) {
    info.style.display = 'block';
    birth.style.color='black';
    setValidity('dob', true);
  }
  else {
    info.style.display = 'none';
    birth.style.color= 'rgb(190,190,190)';
  }
}) 

// Checkbox Event Listener
checkbox.addEventListener('click', () => {
  var label = document.getElementsByClassName('checkbox-label')[0];
  if (checkbox.checked) {
    label.style.color = 'dodgerblue';
    setValidity('agree', true);
  }
  else{
    label.style.color = 'gray';
  }
});