window.first = true;
window._maxWidth = '';
$.fn.windowsbox = function(){	
	$logic = {
		animationSpeed: 300,
		_updateHeight: function(current, nth) {			
			id = current.find('.move ul').attr('id')
			_Height = $('ul#'+id+' li:nth-child('+nth+')').height();
			$('#'+id+'').parent().animate({ height: _Height }, $logic.animationSpeed)			
		},
		_navigationButtons: function() {
			$(document).on('click', '.simpleslider-container li', function (){				
				nth = $(this).attr('data-nav')
				$clickConatiner = $(this).parent().parent()
				$logic._updateHeight($clickConatiner, eval(nth)+1)
				$clickConatiner.find('.simpleslider-container li').removeClass('active')
				$(this).addClass('active')
				$clickConatiner.find('.move ul').animate({ marginLeft: -nth*_maxWidth }, $logic.animationSpeed)
			});		
		},
		init: function() {
			if ( window.first ) {
				window.first = false;
				$logic._navigationButtons()
			}
		}
	};
	$logic.init();
};

var $document = $(document),
	$window = $(window),
	$search = $('#wb-top-search'),
	$searchContainer = $('#wb-top-search-container');

window.WindowsBoxUI = {
	searchResize: function(){
		width = $window.width()-($('#wb-top-logo').width()+5+350);
		$searchContainer.css({ width: width })
	}
}
$(window).resize(function(){
	WindowsBoxUI.searchResize();
});
$(function(){
	WindowsBoxUI.searchResize();	
});

$('#wb-top-search-send').click(function() {
	if( $search.val() ) {
		 $('#wb-search-target li').html('Keresés a következőre: <span>"'+$search.val()+'"<span>'); $('#wb-search-target').hide().clearQueue().slideToggle(500).delay(2000).slideToggle(500);
	}
	else {
		$('#wb-search-target li').html('A keresési mező üres!'); $('#wb-search-target').hide().clearQueue().slideToggle(500).delay(2000).slideToggle(500); $search.focus()
	}
	
});
