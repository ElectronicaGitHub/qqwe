 $(document).scroll(function() {
    var scrollPosition = $(document).scrollTop();
    var scrollReference = 1050;
    if (scrollPosition >= scrollReference) {      
        $("#float-block").addClass('fixed');   
    } else {
        $("#float-block").removeClass('fixed');
        $("#float-block").addClass('abs');
    };
});
$('#float-block').height($(document).height());