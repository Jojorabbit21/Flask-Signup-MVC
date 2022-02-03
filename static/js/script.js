function validatePassword (pw, options) {
  /*
    Password Validator 0.1
    (c) 2007 Steven Levithan 
    MIT License
  */
 
  // default options (allows any password)
  var o = {
    lower: 0,
    upper: 0,
    alpha: 0, /* lower + upper */
    numeric: 0,
    special: 0,
    length: [0, Infinity],
    custom: [/*regexes and/or functions*/],
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

function validateDisplayName(value) {
  let regExp = /^[ㄱ-힣a-zA-Z0-9]{4,16}$/g; // Ko+Eng only
  return regExp.test(value);
} 

// Validity
var validity = [false, false, false, false];

// Displayname Validation Variables
let userName = document.getElementById('userid');

// Password Validation Variables
let timeout;
let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
let password = document.getElementById('password');
let strengthBox = document.getElementsByClassName('pw-meter')[0];
let strengthText = document.getElementsByClassName('pw-meter-text')[0];
let strengthBadge = document.getElementsByClassName('pw-meter-bar')[0];

// Validate Password
function checkPassword(password) {
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



//= Event Listeners
// Display name Event Listener
userName.addEventListener('blur', () => {
  var con = validateDisplayName(userName.value);
  console.log(con);
});

// Password Event Listener
password.addEventListener('input', () => {
  console.log("password event occured");
  clearTimeout(timeout);
  timeout = setTimeout(() => checkPassword(password.value), 100);

  if(password.value.length !== 0){
    strengthBox.style.display = 'block';
  }
  else {
    strengthBox.style.display = 'none';
  }
});