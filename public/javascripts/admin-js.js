$(document).ready(function() {
	$('.ok').click(function() {
		var e = tinymce.get('text_in').getContent();
		console.log(e);
		$(this).css('background-color', '#99FF81');
		$(this).css('border', '#00FF6D');
		$('.ok p').text('Молодец!');
		$('.text_in').html(e);
		console.log('text_in', e);
	});

	$('.type_in').click(function() {
		var d = $(this).val();
		$('#idk').text(d);
	})
});
