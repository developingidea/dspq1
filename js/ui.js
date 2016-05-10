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

// $.fn.countUp = function(){	
// 	$logic = {
// 		int_speed: 50,
// 		run: function() {
// 		      var count = $('body').find('data-count').data('count');
// 		      var speed = Math.round(count),
// 		        $display = $(this),
// 		        run_count = 1,
// 		        int_speed = 40 - count * 0.3; // speedup :)
// 		      var int = setInterval(function() {
// 		        if (run_count - 1 < count) {
// 		          $display.text(run_count);
// 		          run_count++;
// 		        } else {
// 		          clearInterval(int);
// 		        }
// 		      }, int_speed);
// 		}
// 	};
// 	$logic.run();
// };

 function countUp(countclass, startdelay) { 
 	$(countclass).delay(200).animate({
        marginTop: 0, opacity: 1
    }, 1000);

    setTimeout(function() {   
      var count = $(countclass).data('count');
      if ( count == 0 || count == undefined) return
      var speed = Math.round(count),
        $display = $(countclass),
        run_count = 1,
        int_speed = 40; // speedup :)
      var int = setInterval(function() {
        if (run_count - 1 < count) {
          $display.text(run_count);
          run_count++;
        } else {
          clearInterval(int);
        }
      }, int_speed);
    }, 400);
  }
  $(document).ready(function() {
    countUp('.wb-top-notifications');
  });





var $document = $(document),
	$window = $(window),
	$search = $('#wb-top-search'),
	$searchContainer = $('#wb-top-search-container'),
	$searchSend = $('#wb-top-search-send');

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
	setTimeout(function() {
		WindowsBoxUI.searchResize();
	}, 100);	
});

$search.keypress(function (event) {
    if (event.which == 13) {
        $searchSend.trigger('click')
    }
});

$('#wb-top-search-send').click(function() {
	if( $search.val() ) {
		 $('#wb-search-target li').html('Keresés a következőre: <span>"'+$search.val()+'"<span>'); $('#wb-search-target').hide().clearQueue().slideToggle(500).delay(2000).slideToggle(500);
	}
	else {
		$('#wb-search-target li').html('A keresési mező üres!'); $('#wb-search-target').hide().clearQueue().slideToggle(500).delay(2000).slideToggle(500); $search.focus()
	}
	
});
