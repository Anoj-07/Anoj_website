// progress bar 
const spans = document.querySelectorAll(".prog-bar div");
spans.forEach(div => {

  div.style.width = div.dataset.width;
  div.innerHTML = div.dataset.width;
});






// Inserting Date and Time in Website 

// function to format 1 in 01

const zeroFill = n => {
    return('0' + n). slice(-2);

}

// Creates interval
const interval = setInterval(() => {
    // Get current time 
    const now = new Date();

    // formate date as in mm/dd/yyyy hh:ii:ss 
    const dateTime = zeroFill((now.getMonth() + 1)) + '/' + zeroFill(now.getUTCDate()) + '/' +now.getFullYear() + '      '+ zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());

    // Display the date and time on the screen  using div#date-time 

    document.getElementById('date-time').innerHTML = dateTime;
}, 1000);



$(window).on('scroll',function(){
    if ($(window).scrollTop()){
        $('nav').addClass('black');
    }

    else{
        $('nav').removeClass('black');
    }
});



    // <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "100575456006902");
      chatbox.setAttribute("attribution", "biz_inbox");
    // </script>

    // <!-- Your SDK code -->
    // <script>
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v14.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    // </script>

    let whenClicked = () => {
      Links.classList.remove("show");
    };



    // ES6 Class(type writer effect)
class TypeWriter {
  constructor(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if(this.isDeleting) {
      // Remove char
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      // Add char
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Initial Type Speed
    let typeSpeed = 100;

    if(this.isDeleting) {
      typeSpeed /= 2;
    }

    // If word is complete
    if(!this.isDeleting && this.txt === fullTxt) {
      // Make pause at end
      typeSpeed = this.wait;
      // Set delete to true
      this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      // Move to next word
      this.wordIndex++;
      // Pause before start typing
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}


// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
  const txtElement = document.querySelector('.second-text');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');
  // Init TypeWriter
  new TypeWriter(txtElement, words, wait);
}




// responsive navBar
document.getElementById('hamburger').onclick = function active(){
  document.getElementById('navlist').classList.toggle('active');
  document.getElementById('line1').classList.toggle('start1');
  document.getElementById('line2').classList.toggle('start2');
  document.getElementById('line3').classList.toggle('start3');



}

document.getElementById("navlist").onclick = function yes(){
  document.getElementById('navlist').classList.remove('active');
  document.getElementById('line1').classList.toggle('start1');
  document.getElementById('line2').classList.toggle('start2');
  document.getElementById('line3').classList.toggle('start3');
}






