  // This is a trial function, it detects when the browser is scrolled down and makes changes accordingly
  // The Signup/Profile should be according to every user
 $(window).scroll(function() {
    if($(this).scrollTop() > 50)  /*height in pixels when the navbar becomes non opaque*/ 
    {
        $('#Profiling').text('Sign up');  
    } else {
         $('#Profiling').text('Profile');
    }
});
$(window).ready(function()
{
   $('#Profiling').text('Sign up');
});

