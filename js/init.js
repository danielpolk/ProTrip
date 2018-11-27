(function($){
  $(function(){

    $('.sidenav').sidenav();
    $('.parallax').parallax();

  }); // end of document ready
})(jQuery); // end of jQuery name space


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = M.FloatingActionButton.init(elems, {
    direction: 'left',
    hoverEnabled: false
  });
});

//scroll to the top function
$(window).scroll(function(){
        if ($(this).scrollTop() > 400) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });


//smooth scrolling effect for each section
//gas button scroll effect
$("#gas-action-btn").click(function() {
    $('html, body').animate({
        scrollTop: $("#gasSection").offset().top
    }, 800);
});
//food button scroll effect
$("#food-action-btn").click(function() {
    $('html, body').animate({
        scrollTop: $("#foodSection").offset().top
    }, 800);
});
// activities button scroll effect
$("#activities-action-btn").click(function() {
    $('html, body').animate({
        scrollTop: $("#activitiesSection").offset().top
    }, 800);
});
// fav button scroll effect
$("#fav-action-btn").click(function() {
    $('html, body').animate({
        scrollTop: $("#favoritesSection").offset().top
    }, 800);
});


