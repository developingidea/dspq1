if (typeof windowsbox === "undefined") {
    var windowsbox = {};
}(function($) {
    "use strict";

    function resolutionUtilities() {
        windowsbox.windowWidth = $(window).width();
        windowsbox.windowHeight = $(window).height();
        if (windowsbox.windowWidth <= 767) {
            windowsbox.device = 'mobile';
        }
        if (windowsbox.windowWidth > 767 && windowsbox.windowWidth < 1200) {
            windowsbox.device = 'tablet';
        }
        if (windowsbox.windowWidth >= 1200) {
            windowsbox.device = 'desktop';
        }
    }
    resolutionUtilities();
    $(document).on('windowsbox:resize', resolutionUtilities);

    function detectUserAgent() {
        windowsbox.userAgent = '';
        if (navigator.userAgent.match(/iPad/i) !== null) {
            windowsbox.userAgent = 'iPad';
        }
        if (navigator.userAgent.match(/iPhone/i) !== null) {
            windowsbox.userAgent = 'iPhone';
        }
        if (navigator.userAgent.match(/Android/i) !== null) {
            windowsbox.userAgent = 'Android';
        }
        windowsbox.platform = '';
        if (navigator.platform.match(/Mac/i) !== null && navigator.userAgent.match(/10_6/i) === null && navigator.userAgent.match(/10.6/i) === null && navigator.userAgent.match(/10_5/i) === null && navigator.userAgent.match(/10.5/i) === null) {
            windowsbox.platform = 'Mac';
        }
        windowsbox.browser = '';
        if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
            windowsbox.browser = 'Safari';
        }
        if (windowsbox.userAgent == 'iPad' || windowsbox.userAgent == 'iPhone' || windowsbox.userAgent == 'Android') {
            $('html').addClass('windowsbox-touchscreen--true');
        } else {
            $('html').addClass('windowsbox-touchscreen--false');
        }
    }
    detectUserAgent();

    function mainContentWidth() {
        if (windowsbox.device == 'mobile') {
            windowsbox.mainContentSize = 's';
            $('.main-content').removeClass('main-content--s main-content--m main-content--l main-content--xl main-content--m-plus main-content--l-plus');
            return;
        }
        windowsbox.mainContentWidth = $('.main-content__inside').width();
        if (windowsbox.mainContentWidth >= 1075) {
            windowsbox.mainContentSize = 'xl';
        } else if (windowsbox.mainContentWidth >= 774) {
            windowsbox.mainContentSize = 'l';
        } else if (windowsbox.mainContentWidth >= 600) {
            windowsbox.mainContentSize = 'm';
        } else {
            windowsbox.mainContentSize = 's';
        }
        $('.main-content').removeClass('main-content--s main-content--m main-content--l main-content--xl main-content--m-plus main-content--l-plus');
        switch (windowsbox.mainContentSize) {
            case 'xl':
                $('.main-content').addClass('main-content--xl main-content--l-plus main-content--m-plus');
                break;
            case 'l':
                $('.main-content').addClass('main-content--l main-content--l-plus main-content--m-plus');
                break;
            case 'm':
                $('.main-content').addClass('main-content--m main-content--m-plus');
                break;
            case "s":
                $('.main-content').addClass('main-content--s');
                break;
        }
    }
    $(document).ready(mainContentWidth);
    $(document).on('windowsbox:ajaxPageLoad', mainContentWidth);
    $(document).on('windowsbox:resize', mainContentWidth);

    function ajaxEnabled() {
        windowsbox.ajaxEnabled = false;
       // if (Modernizr.history && $('body').hasClass('js-ajax-load-pages')) {
      //      windowsbox.ajaxEnabled = true;
       // }
    }
    $(document).ready(ajaxEnabled);

    var resizeTimeout;

    $(window).resize(function() {
        if (windowsbox.device == 'mobile') {
            var w = $(window).width();
            var h = $(window).height();
            if (Math.abs(windowsbox.windowWidth - w) < 80 && Math.abs(windowsbox.windowHeight - h) < 80) {
                return;
            }
        }
        requestAnimationFrame(function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                $(document).trigger('windowsbox:resize');
            }, 200);
        });
    });
    var scrollTime = 0;
    var scrollTimeout;

    function windowsboxScrollEvent() {
        requestAnimationFrame(function() {
            var now = new Date().getTime();
            var dt = now - scrollTime;
            if (dt < 70) {
                return;
            }
            scrollTime = now;
            $(document).trigger('windowsbox:scroll');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                $(document).trigger('windowsbox:scroll');
            }, 250);
        });
    }

    function windowsboxScrollWatch() {
        if (windowsbox.device == 'mobile') {} else {
            if ($('body').hasClass('independent-sidebar--true')) {
                $('.main-content .nano-content').scroll(windowsboxScrollEvent);
            } else {
                $('.content-wrapper').scroll(windowsboxScrollEvent);
            }
        }
    }

    $(document).ready(windowsboxScrollWatch);
    $(document).on('windowsbox:ajaxPageLoad', windowsboxScrollWatch);
    $(document).on('windowsbox:resize', windowsboxScrollWatch);


    function scrollPageToTop() {
        $('body').css('height', 'auto');
        if (windowsbox.device != 'desktop') {
            $('body').scrollTop(0);
        } else {
            $('.content-wrapper').scrollTop(0);
        }
        $('body').css('height', '');
    }


    function layoutHeightEq() {
        if (Modernizr.flexbox) {
            return;
        }

        function setHeight() {
            if (windowsbox.device != 'mobile' && $('body').hasClass('independent-sidebar--true')) {
                return;
            }
            $('.main-content__inside, .sidebar__content').css('height', '');
            if (windowsbox.device == 'mobile') {
                return;
            }
            var getHeightFrom = '.main-content__inside, .sidebar__general, .sidebar__comments';
            var maxHeight = window.innerHeight;
            $(getHeightFrom).each(function() {
                var height = $(this).innerHeight();
                maxHeight = Math.max(height, maxHeight);
            });
            $('.main-content__inside, .sidebar__content').height(maxHeight);
        }
        setHeight();
        $(document).on('windowsbox:ajaxPageLoad', setHeight);
        $(document).on('windowsbox:resize', setHeight);
    }
    $(document).ready(layoutHeightEq);

    function headerFooterSpace() {
        $('.header__inwrap').waitForImages(function() {
            var footerHeight = $('.js-header-footer').innerHeight();
            $('.header__inwrap').css('padding-bottom', footerHeight);
        });
    }
    $(document).ready(headerFooterSpace);

    function titleHeadHeight() {
        var height = windowsbox.device != 'mobile' ? windowsbox.windowHeight * 0.5 : windowsbox.windowHeight;
        var heightText = height;
        var header__inwrapHeight = $('.title-header__inwrap').height();
        if (header__inwrapHeight % 2 === 1) {
            $('.title-header__inwrap').height(header__inwrapHeight + 1);
        }
        $('.title-header--big').css({
            'min-height': Math.max(height, (header__inwrapHeight + 50)) + 'px'
        });
        var featuredElements = '.format-head--image, .format-head--quote, .format-head--status, .format-head--link';
        $(featuredElements, '.article-single--post').each(function() {
            heightText = $(this).find('.post__text').height();
            $(this).find('.post__media').css({
                'height': Math.max(height, heightText + 50) + 'px'
            });
        });
        $(featuredElements, '.loop-container--wp').each(function() {
            $(this).find('.post__media').height('');
            heightText = $(this).find('.post__text').height();
            if (windowsbox.device == 'mobile') {
                $(this).find('.post__media').css({
                    'height': Math.max((height * 0.9), heightText + 50) + 'px'
                });
            } else {
                $(this).find('.post__media').css({
                    'min-height': (heightText + 50) + 'px'
                });
            }
        });
    }
    $(document).ready(titleHeadHeight);
    $(document).on('windowsbox:ajaxPageLoad', titleHeadHeight);
    $(document).on('windowsbox:resize', titleHeadHeight);

    function nanoScroll() {
        if (windowsbox.userAgent == 'iPad' || windowsbox.userAgent == 'iPhone' || windowsbox.userAgent == 'Android') {
            return false;
        }
        var elements = '';
        if ($('body').hasClass('independent-sidebar--true')) {
            elements = '.js-nano';
        } else {
            elements = '.js-nano-header';
        }
        var options = {
            disableResize: true
        };
        var options_kill = {
            disableResize: true,
            destroy: true
        };
        if (windowsbox.device != 'mobile') {
            $(elements).each(function() {
                $(this).waitForImages(function() {
                    $(this).addClass('nano').nanoScroller(options);
                });
            });
        } else {
            $(elements).removeClass('nano').nanoScroller(options_kill);
        }
    }
    $(document).ready(nanoScroll);
    $(document).on('windowsbox:ajaxPageLoad', nanoScroll);
    $(document).on('windowsbox:resize', nanoScroll);

    function initLoadAnimation() {
        $('body').waitForImages(function() {
            $('body').addClass('init-load-animation-start');
            setTimeout(function() {
                $('body').addClass('init-load-animation-end');
                $('body').removeClass('init-load-animation-start');
            }, 1500);
        });
    }
    $(document).ready(initLoadAnimation);

    function sidebarTabControl() {
        if (window.location.hash == '#respond' || window.location.hash == '#comments') {
            $('.js-sidebar-tab[data-tab="comments"]').addClass('active').siblings().removeClass('active');
            $('.sidebar').addClass('sidebar--comments-active');
        }
        $('html').on('click', '.js-sidebar-tab', function(e) {
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            var tab = $(this).attr('data-tab');
            if (tab == 'comments') {
                $('.sidebar').removeClass('sidebar--general-active');
                $('.sidebar').addClass('sidebar--comments-active');
            } else {
                $('.sidebar').removeClass('sidebar--comments-active');
                $('.sidebar').addClass('sidebar--general-active');
            }
        });
    }
    $(document).ready(sidebarTabControl);

    function headerToggle() {
        $('.js-touchscreen-header-toggle').click(function(e) {
            e.preventDefault();
            $('body').toggleClass('touchscreen-header-open');
        });
        $('.content-wrapper').click(function(e) {
            if ($('body').hasClass('touchscreen-header-open')) {
                $('body').removeClass('touchscreen-header-open');
            }
        });
    }
    $(document).ready(headerToggle);



    function slider() {
        $('.js-windowsbox-slider:not(.processed)').each(function(e) {
            var $el = $(this).addClass('js-started');
            var elType = 'element';
            var $items = $el.find('.windowsbox-slider__items');
            var $item = $el.find('.windowsbox-slider__item');
            var $active = $item.filter('.active');
            var $first = $item.first();
            var $last = $item.last();
            var interval;
            var intervalVal = parseInt($el.attr('data-interval'));
            var control = $el.attr('data-control');
            var $arrows = $el.find('.windowsbox-ui--slider-arrows');
            var $arrowPrev = $el.find('.js-windowsbox-ui-arrow--prev');
            var $arrowNext = $el.find('.js-windowsbox-ui-arrow--next');
            var $pager = $el.find('.js-windowsbox-slider-pager-item');
            var dataHeight = $el.attr('data-height');
            var $blogControl = $el.find('.windowsbox-ui--blog-slider');
            var $loader = $el.find('.windowsbox-ui__loader');
            if ($el.hasClass('loop-container')) {
                elType = 'blog';
            }
            if ($el.hasClass('windowsbox-slider--images')) {
                elType = 'images';
            }
            if ($el.hasClass('windowsbox-slider--element')) {
                elType = 'element';
            }
            $arrows.find('.js-info-total').html($item.length);
            if ($first.attr('data-id') != 'slider-item-0') {
                $item.each(function(i) {
                    $(this).attr('data-id', 'slider-item-' + i);
                });
            }
            if (!$first.hasClass('active')) {
                $active = $first.addClass('active');
            }

            function sliderHeightEq() {
                var height = 0;
                if (elType == 'blog') {
                    $first.waitForImages(function() {
                        $item.each(function() {
                            var thisHeight = $('.windowsbox-slider__item-inwrap', this).height('').height();
                            height = Math.max(thisHeight, height);
                        });
                        if (windowsbox.device == 'mobile' && $el.hasClass('loop-container--style-slider_overlay')) {
                            height = Math.max(height, windowsbox.windowHeight);
                            $item.find('.windowsbox-slider__item-inwrap').height(height);
                        }
                        if (height > 0) {
                            $items.height(height);
                        }
                        var mediaHeight = $first.find('.post__media').innerHeight();
                        var blogControlHeight = $blogControl.innerHeight();
                        $blogControl.css({
                            'top': mediaHeight - blogControlHeight,
                            'bottom': 'auto'
                        });
                    });
                } else if (elType == 'element') {
                    $item.each(function() {
                        var $textContent = $(this).find('.windowsbox-slider__text');
                        var textContentHeight = $textContent.height('').height();
                        if (textContentHeight % 2 === 1) {
                            textContentHeight++;
                            $textContent.height(textContentHeight);
                        }
                        if (windowsbox.device == 'mobile') {
                            height = Math.max(textContentHeight + 140, height, windowsbox.windowHeight);
                        } else {
                            if (windowsbox.mainContentSize == 'xl') {
                                height = Math.max(textContentHeight + 140, height, dataHeight);
                            } else {
                                height = Math.max(textContentHeight + 140, height);
                            }
                        }
                    });
                    if (height > 0) {
                        $items.height(height);
                    }
                } else if (elType == 'images') {
                    $item.each(function() {
                        $(this).waitForImages(function() {
                            var thisHeight = $('.windowsbox-slider__item-inwrap', this).removeClass('processed').height('').height();
                            $('.windowsbox-slider__item-inwrap', this).addClass('processed');
                            height = Math.max(thisHeight, height);
                            if (height > 0) {
                                $items.height(height);
                            }
                        });
                    });
                }
                layoutHeightEq();
                nanoScroll();
                $(document).one('windowsbox:resize', sliderHeightEq);
            }
            sliderHeightEq();

            function activate($activateItem, isPrev) {
                var reverseClass = isPrev === true ? 'animate-reverse' : '';
                var slideId = $activateItem.attr('data-id');
                if (!$activateItem.hasClass('active')) {
                    $activateItem.addClass('animate-in ' + reverseClass);
                    var $itemOut = $active.addClass('animate-out ' + reverseClass);
                    setTimeout(function() {
                        $itemOut.removeClass('animate-out ' + reverseClass);
                        $activateItem.removeClass('animate-in ' + reverseClass);
                        $activateItem.addClass('active').siblings().removeClass('active ' + reverseClass);
                        $active = $activateItem;
                    }, 1000);
                    if (control == 'pager') {
                        $pager.removeClass('active');
                        $pager.filter('[data-id="' + slideId + '"]').addClass('active');
                    }
                    if (control == 'arrows') {
                        if (slideId) {
                            var infoCurrent = parseInt(slideId.split('-')[2]);
                            infoCurrent = infoCurrent + 1;
                            $arrows.find('.js-info-current').html(infoCurrent);
                        }
                    }
                    if (windowsbox.device != 'desktop' && intervalVal !== 0) {
                        startInterval();
                    }
                }
            }

            function activateNextItem() {
                var $nextItem;
                if ($active.next('.windowsbox-slider__item').length > 0) {
                    $nextItem = $active.next('.windowsbox-slider__item');
                } else {
                    $nextItem = $first;
                }
                activate($nextItem);
            }

            function activatePrevItem() {
                var $prevItem;
                if ($active.prev('.windowsbox-slider__item').length > 0) {
                    $prevItem = $active.prev('.windowsbox-slider__item');
                } else {
                    $prevItem = $last;
                }
                activate($prevItem, true);
            }
            if (intervalVal && intervalVal != '0') {
                startInterval();
                $(document).off('.stopInterval');
                $(document).on('windowsbox:ajaxPageLoad.stopInterval', stopInterval);
                $el.hover(stopInterval, startInterval);
            }

            function startInterval() {
                clearInterval(interval);
                interval = setInterval(function() {
                    activateNextItem();
                }, intervalVal);
            }

            function stopInterval() {
                clearInterval(interval);
            }
            $arrowNext.click(function(e) {
                e.preventDefault();
                activateNextItem();
            });
            $arrowPrev.click(function(e) {
                e.preventDefault();
                activatePrevItem();
            });
            $el.swipe({
                swipeRight: function() {
                    activatePrevItem();
                },
                swipeLeft: function() {
                    activateNextItem();
                },
                threshold: 40
            });
            $(document).keydown(function(e) {
                if (e.which == 37) {
                    activatePrevItem();
                }
                if (e.which == 39) {
                    activateNextItem();
                }
            });
            $pager.click(function(e) {
                e.preventDefault();
                var activeId = $active.attr('data-id');
                var pagerId = $(this).attr('data-id');
                var isPrev = false;
                if (pagerId.replace(/^\D+/g, '') < activeId.replace(/^\D+/g, '')) {
                    isPrev = true;
                }
                activate($items.find('[data-id="' + pagerId + '"]'), isPrev);
            });
            $el.addClass('processed');
        });
    }
    $(document).ready(slider);
    $(document).on('windowsbox:ajaxPageLoad', slider);

    function carousel() {
        $('.js-windowsbox-carousel:not(.processed)').each(function(e) {
            var $el = $(this).addClass('js-started');
            var $elInwrap = $el.find('.windowsbox-carousel__inwrap');
            var $items = $el.find('.windowsbox-carousel__items');
            var $item = $el.find('.windowsbox-carousel__item');
            var interval;
            var intervalVal = $el.attr('data-interval');
            var arrowsUse = $el.attr('data-carousel-arrows');
            var gridMax = parseInt($el.attr('data-carousel-grid'));
            var grid = gridMax;
            var itemCount = $item.length;
            var itemWidth;
            var itemsWidth;
            var elWidth;
            var step;
            var position = 0;
            var itemHeight = 0;
            var $arrowPrev = $el.find('.js-windowsbox-ui-arrow--prev');
            var $arrowNext = $el.find('.js-windowsbox-ui-arrow--next');

            function carouselLayout() {
                if (windowsbox.mainContentSize == 's') {
                    grid = 1;
                }
                if (windowsbox.mainContentSize == 'm' || windowsbox.mainContentSize == 'l') {
                    grid = gridMax < 3 ? gridMax : 3;
                }
                if (windowsbox.mainContentSize == 'm' && windowsbox.device == 'tablet') {
                    grid = gridMax < 2 ? gridMax : 2;
                }
                if (windowsbox.mainContentSize == 'xl') {
                    grid = gridMax;
                }
                elWidth = Math.floor($el.innerWidth());
                itemWidth = Math.floor(elWidth / grid);
                itemsWidth = Math.floor(itemWidth * itemCount);
                step = itemWidth;
                $item.width(itemWidth);
                $items.width(itemsWidth);
                itemHeight = 0;
                $item.height('');
                $el.waitForImages(function() {
                    $item.each(function() {
                        var currentHeight = $(this).innerHeight();
                        itemHeight = Math.max(currentHeight, itemHeight);
                    });
                    $item.height(itemHeight);
                    if (arrowsUse == 'false') {
                        initCustomScrollbar();
                    }
                    layoutHeightEq();
                    nanoScroll();
                });
                $(document).one('windowsbox:resize', carouselLayout);
            }
            carouselLayout();
            setTimeout(function() {
                carouselLayout();
            }, 250);

            function initCustomScrollbar() {
                if (windowsbox.device != 'desktop') {
                    $elInwrap.mCustomScrollbar('destroy');
                    return;
                }
                $elInwrap.mCustomScrollbar({
                    axis: "x",
                    scrollInertia: 500,
                    mouseWheel: {
                        enable: false
                    },
                    callbacks: {
                        onScroll: function() {
                            position = Math.abs(this.mcs.left);
                        }
                    }
                });
            }

            function animate(position) {
                if (typeof position === 'undefined') {
                    return;
                }
                if (windowsbox.device != 'desktop' || arrowsUse == 'true') {
                    $elInwrap.stop().animate({
                        scrollLeft: position
                    }, 500);
                } else {
                    $elInwrap.mCustomScrollbar('scrollTo', [0, position], {
                        scrollInertia: 1000
                    });
                }
            }

            function scrollNext() {
                if (windowsbox.device != 'desktop' || arrowsUse == 'true') {
                    position = $elInwrap.scrollLeft();
                }
                if (position + elWidth > itemsWidth - 1) {
                    position = 0;
                } else {
                    position = position + step;
                }
                animate(position);
            }

            function scrollPrev() {
                if (windowsbox.device != 'desktop' || arrowsUse == 'true') {
                    position = $elInwrap.scrollLeft();
                }
                if (position === 0) {
                    position = itemsWidth - step;
                } else {
                    position = position - step;
                }
                animate(position);
            }
            if (intervalVal && intervalVal != '0') {
                startInterval();
                $(document).off('.stopInterval');
                $(document).on('windowsbox:ajaxPageLoad.stopInterval', stopInterval);
                $el.hover(stopInterval, startInterval);
                $elInwrap.on('touchstart', stopInterval);
            }

            function stopInterval() {
                clearInterval(interval);
            }

            function startInterval() {
                interval = setInterval(scrollNext, intervalVal);
            }
            $arrowNext.click(function(e) {
                e.preventDefault();
                scrollNext();
            });
            $arrowPrev.click(function(e) {
                e.preventDefault();
                scrollPrev();
            });
            $el.swipe({
                swipeRight: function() {
                    activatePrevItem();
                    killInterval();
                },
                swipeLeft: function() {
                    activateNextItem();
                    killInterval();
                },
                threshold: 40
            });
            $el.addClass('processed');
        });
    }
    $(document).ready(carousel);
    $(document).on('windowsbox:ajaxPageLoad', carousel);

    function animateAnchors() {
        $('html').on('click', '.js-anchor-link', function(e) {
            e.preventDefault();
            var hash = $(this).attr('href');
            var target = $('html').find(hash);
            var targetY = target.offset().top;
            $('html').find('#content-wrapper, .main-content-inside').animate({
                scrollTop: targetY
            }, 500);
            history.pushState({
                page: hash
            }, '', hash);
        });
    }
    $(document).ready(animateAnchors);

    function wpLoopLoadMore() {
        $('html').off('.load-more--wp-loop');
        $('html').on('click.load-more--wp-loop', '.js-load-more--wp-loop', function(e) {
            e.preventDefault();
            loadItems($(this));
        });
        var $autoLoadMore = $('.js-auto-load-more--wp-loop');
        $(document).off('.callAutoLoadMore');
        if ($autoLoadMore.length > 0 && windowsbox.device != 'mobile') {
            $(document).on('windowsbox:scroll.callAutoLoadMore', callAutoLoadMore);
            $(document).on('windowsbox:resize.callAutoLoadMore', callAutoLoadMore);
        }
        var autoLoadMoreTime = 0;

        function callAutoLoadMore() {
            if (windowsbox.device == 'mobile') {
                return;
            }
            requestAnimationFrame(function() {
                var now = new Date().getTime();
                var dt = now - autoLoadMoreTime;
                if (dt < 400) {
                    return;
                }
                autoLoadMoreTime = now;
                if ($autoLoadMore.hasClass('pagination--loading') || $autoLoadMore.hasClass('pagination--disabled')) {
                    return;
                }
                if ($autoLoadMore.offset().top - 250 < windowsbox.windowHeight) {
                    loadItems($autoLoadMore);
                }
            });
        }

        function loadItems($target) {
            if ($target.hasClass('pagination--loading') || $target.hasClass('pagination--disabled')) {
                return;
            }
            var $el = $('.loop-container--wp');
            var $this = $target;
            var href = $this.attr('href');
            var max = parseInt($this.attr('data-max'));
            var current = parseInt($this.attr('data-current'));
            if (max > current) {
                $this.addClass('pagination--loading');
                if (windowsbox.xhr) {
                    windowsbox.xhr.abort();
                }
                windowsbox.xhr = $.ajax({
                    type: "GET",
                    url: href,
                    success: function(data, response, xhr) {
                        var posts = $(data).find('.loop-container--wp');
                        $el.append(posts.html());
                        $el.waitForImages(function() {
                            $(document).trigger('windowsbox:ajaxPageLoad');
                            if (!$el.hasClass('loop-is-masonry')) {
                                $this.removeClass('pagination--loading');
                            }
                        });                     
                        current = current + 1;
                        if (/\/page\/[0-9]+/.test(href)) {
                            href = href.replace(/\/page\/[0-9]+/, '/page/' + (current + 1));
                        } else {
                            href = href.replace(/paged=[0-9]+/, 'paged=' + (current + 1));
                        }
                        $this.attr('data-current', current);
                        $this.attr('href', href);
                        if (current == max) {
                            $this.addClass('pagination--disabled');
                        }
                    },
                    fail: function() {
                        $this.removeClass('pagination--loading');
                    }
                });
            }
        }
    }
    $(document).ready(wpLoopLoadMore);
    $(document).on('windowsbox:ajaxPageLoad', wpLoopLoadMore);

    function windowsboxLoopLoadMore() {
        $('html').on('click', '.js-load-more--windowsbox-loop', function(e) {
            e.preventDefault();
            var $this = $(this);
            var $el = $('#' + $this.attr('data-id'));
            var shortcode = $el.attr('data-shortcode');
            var postsPerPage = parseInt($el.attr('data-posts_per_page'));
            var currentPage = parseInt($el.attr('data-current_page'));
            var maxPages = parseInt($el.attr('data-max_pages'));
            var style = $el.attr('data-style');
            var category = $el.attr('data-category');
            var sort_by = $el.attr('data-sort_by');
            var sort_order = $el.attr('data-sort_order');
            if (maxPages > currentPage) {
                $this.addClass('ajax-loading');
                $.post(windowsboxAjax.ajaxurl, {
                    action: 'windowsbox-ajax-loops',
                    loop: shortcode + '_loop',
                    posts_per_page: postsPerPage,
                    paged: currentPage + 1,
                    style: style,
                    category: category,
                    sort_by: sort_by,
                    sort_order: sort_order
                }, function(data) {
                    var $html = $(data.loop.html);
                    $el.find('.loop-container').append($html);
                    $el.waitForImages(function() {
                        $(document).trigger('windowsbox:ajaxPageLoad');
                    });
                    $el.attr('data-current_page', currentPage + 1);
                    $this.removeClass('ajax-loading');
                    if (currentPage + 1 == maxPages) {
                        $this.addClass('load-more--disabled');
                    }
                }).fail(function() {
                    $this.text('Error');
                    $this.removeClass('ajax-loading');
                });
            }
        });
    }

    function ajaxLoadPages() {
        if (windowsbox.ajaxEnabled === false) {
            return;
        }
        var hashedLink;
        var ajaxLoadPageTime = 0;
        var popped = false;
        $('html').on('click', 'a', function(e) {
            var now = new Date().getTime();
            var dt = now - ajaxLoadPageTime;
            if (dt < 700) {
                e.preventDefault();
                return;
            }
            ajaxLoadPageTime = now;
            var href = $(this).attr('href');
            if (isExternal(href)) {
                return;
            }
            hashedLink = true;
            if (($(this).not(".ab-item, .comment-reply-link, #cancel-comment-reply-link, .comment-edit-link, .wp-playlist-caption, .js-skip-ajax")) && (href.indexOf('#') == -1) && (href.indexOf('wp-login.php') == -1) && (href.indexOf('/wp-admin/') == -1) && (href.indexOf('wp-content/uploads/') == -1) && ($(this).attr('target') != '_blank') && (href != windowsbox.baseUrl + '/feed/') && (href != windowsbox.baseUrl + '/comments/feed/') && ($(this).not('[hreflang]')) && ($(this).parents('#lang_sel').length === 0) && ($(this).parents('#lang_sel_click').length === 0) && ($(this).parents('#lang_sel_list').length === 0) && ($(this).parents('.menu-item-language').length === 0) && (typeof DISQUS === 'undefined') && (typeof countVars === 'undefined' || typeof countVars.disqusShortname === 'undefined')) {
                e.preventDefault();
                popped = true;
                hashedLink = false;
                var pagination = $(this).is('.page-numbers') ? true : false;
                push_state(href, pagination);
            }
        });
        $(window).on('popstate', function() {
            if (!hashedLink && popped) {
                ajaxLoadPage(location.href);
            }
            popped = true;
        });
        $('html').on('submit', 'form.search-form', function(e) {
            e.preventDefault();
            var action = $(this).attr('action');
            var term = $(this).find('.textfield').val();
            if (action && term) {
                popped = true;
                push_state(action + '/?s=' + term);
            }
        });

        function push_state(href, pagination) {
            history.pushState({
                page: href
            }, '', href);
            ajaxLoadPage(href, pagination);
        }

        function ajaxLoadPage(href, pagination) {
            $('body').removeClass('ajax-main-content-loading-end ajax-content-wrapper-loading-end');
            if (windowsbox.xhr) {
                windowsbox.xhr.abort();
            }
            var timeStarted = 0;
            if (pagination) {
                $('body').addClass('ajax-main-content-loading-start');
                $('body').removeClass('touchscreen-header-open');
                timeStarted = new Date().getTime();
                windowsbox.xhr = $.ajax({
                    type: "GET",
                    url: href,
                    success: function(data, response, xhr) {
                        var now = new Date().getTime();
                        var timeDiff = now - timeStarted;
                        if (timeDiff < 1000) {
                            setTimeout(ajaxLoadPageCallback, (1000 - timeDiff));
                        } else {
                            ajaxLoadPageCallback();
                        }

                        function ajaxLoadPageCallback() {
                            var $data = $(data);
                            var pageTitle = $data.filter('title').text();
                            document.title = pageTitle;
                            $('#main-content').html($data.find('.main-content__inside'));
                            scrollPageToTop();
                            $('#main-content').waitForImages(function() {
                                $('body').addClass('ajax-main-content-loading-end');
                                $('body').removeClass('ajax-main-content-loading-start');
                                $(document).trigger('windowsbox:ajaxPageLoad');
                            });

                        }
                    },
                    error: function() {
                        $('body').addClass('ajax-main-content-loading-end');
                        $('body').removeClass('ajax-main-content-loading-start');
                    }
                });
            } else {
                $('body').addClass('ajax-content-wrapper-loading-start');
                $('body').removeClass('touchscreen-header-open');
                timeStarted = new Date().getTime();
                windowsbox.xhr = $.ajax({
                    type: "GET",
                    url: href,
                    success: function(data, response, xhr) {
                        var now = new Date().getTime();
                        var timeDiff = now - timeStarted;
                        if (timeDiff < 1000) {
                            setTimeout(ajaxLoadPageCallback, (1000 - timeDiff));
                        } else {
                            ajaxLoadPageCallback();
                        }

                        function ajaxLoadPageCallback() {
                            var $data = $(data);
                            var pageTitle = $data.filter('title').text();
                            document.title = pageTitle;
                            $('#content-wrapper').html($data.find('#content-wrapper-inside'));
                            scrollPageToTop();
                            $('#content-wrapper').waitForImages(function() {
                                $('body').addClass('ajax-content-wrapper-loading-end');
                                $('body').removeClass('ajax-content-wrapper-loading-start');
                                $(document).trigger('windowsbox:ajaxPageLoad');
                            });
                        }
                    },
                    error: function() {
                        $('body').addClass('ajax-content-wrapper-loading-end');
                        $('body').removeClass('ajax-content-wrapper-loading-start');
                    }
                });
            }
        }

        function isExternal(url) {
            if (url == '#') {
                return false;
            }
            var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
            if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) {
                return true;
            }
            if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + {
                    "http:": 80,
                    "https:": 443
                }[location.protocol] + ")?$"), "") !== location.host) {
                return true;
            }
            var regexBaseUrl = new RegExp(windowsbox.baseUrl + '([^\/]*)');
            match = url.match(regexBaseUrl);
            if (!match || match[1] !== '') {
                return true;
            }
            return false;
        }
    }
    $(document).ready(ajaxLoadPages);

    function windowsboxMejs() {
        $('audio.wp-audio-shortcode, video.wp-video-shortcode').each(function() {
            var $el = $(this);
            if (($(this).parent().hasClass('mejs-mediaelement')) || (typeof mejs === 'undefined')) {
                return;
            }
            mejs.plugins.silverlight[0].types.push('video/x-ms-wmv');
            mejs.plugins.silverlight[0].types.push('audio/x-ms-wma');
            $(function() {
                var settings = {};
                if ($(document.body).hasClass('mce-content-body')) {
                    return;
                }
                if (typeof _wpmejsSettings !== 'undefined') {
                    settings.pluginPath = _wpmejsSettings.pluginPath;
                }
                settings.success = function(mejs) {
                    var autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
                    if ('flash' === mejs.pluginType && autoplay) {
                        mejs.addEventListener('canplay', function() {
                            mejs.play();
                        }, false);
                    }
                };
                $el.mediaelementplayer(settings);
            });
        });
    }
    $(document).on('windowsbox:ajaxPageLoad', windowsboxMejs);

    function loopMasonry() {
        if (windowsbox.device == 'mobile') {
            if (!$('.js-loop-is-masonry').hasClass('loop-is-masonry--init-processed')) {
                return;
            }
        }
        $('.js-loop-is-masonry').each(function() {
            var el = this;
            var $el = $(this).addClass('loop-is-masonry');
            var $post = $el.find('.post').not('.masonry-processed');
            var masonry = new Masonry(el, {
                //columnWidth: '.post--size-small',
                itemSelector: '.post',
                stamp: '.stamp:after',
                fitWidth: true,
                isInitLayout: true,
                isResizeBound: true,
                percentPosition: true,
                transitionDuration: '0.4s'
            });
            $el.waitForImages(function() {
                masonry.layout();
                $post.addClass('masonry-processed');
                $el.next('.pagination').removeClass('pagination--loading');
                $el.addClass('loop-is-masonry--init-processed');
                layoutHeightEq();
                nanoScroll();
                setTimeout(function() {
                    masonry.layout();
                    layoutHeightEq();
                    nanoScroll();
                }, 200);
            });
        });
    }
    $(document).ready(loopMasonry);
    $(document).on('windowsbox:resize', loopMasonry);
    $(document).on('windowsbox:ajaxPageLoad', loopMasonry);

    function sharer() {
        $('.js-sharer').click(function(e) {
            e.preventDefault();
            var link = $(this).attr('href');
            var windowFeatures = "height=320, width=640, status=no,resizable=yes,toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
            window.open(link, 'Sharer', windowFeatures);
        });
    }
    $(document).ready(sharer);
    $(document).on('windowsbox:ajaxPageLoad', sharer);

    function commentPostAjax() {
        var $form = $('#commentform');
        var $btn = $form.find('#submit');
        var url = $form.attr('action');
        var $comments = $('.comment__list .comments');
        $btn.click(function(e) {
            e.preventDefault();
            var formValid = true;
            $form.find('.required').each(function() {
                if (!$.trim($(this).val())) {
                    formValid = false;
                    $(this).addClass('error');
                } else {
                    $(this).removeClass('error');
                }
                if ($(this).attr('name') == 'email') {
                    if (!validateEmail($(this).val())) {
                        formValid = false;
                        $(this).addClass('error');
                    } else {
                        $(this).removeClass('error');
                    }
                }
            });
            if (!formValid) {
                return;
            }
            var $textarea = $form.find('#comment');
            var parent = $form.find('#comment_parent').val();
            var $parent = $comments.find('#comment-' + parent);
            $.ajax({
                type: 'post',
                url: url,
                data: $form.serialize(),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $btn.val('Error');
                },
                success: function(data, textStatus) {
                    var $data = $(data).addClass('comment--ajax-loaded');
                    if (parent == '0') {
                        if ($comments.length === 0) {
                            $('#respond').before('<div class="comment__list">' + '<h2 id="comments">1 Comment</h2>' + '<ul class="comments"></ul>' + '</div>');
                            $comments = $('.comment__list .comments');
                        }
                        $data.appendTo($comments);
                    } else {
                        if (!$parent.hasClass('parent')) {
                            $parent.append('<ul class="children"></ul>');
                            $parent.addClass('parent');
                        }
                        $data.appendTo($parent.find('.children:first'));
                        $('#cancel-comment-reply-link').trigger('click');
                    }
                    $textarea.val('');
                    $data.addClass('comment--ajax-loaded-animate');
                }
            });
        });
    }
    $(document).ready(commentPostAjax);
    $(document).on('windowsbox:ajaxPageLoad', commentPostAjax);

    function wpCommentsLoadMore() {
        $('html').on('click', '.comment__pager a', function(e) {
            e.preventDefault();
            var $el = $('.comment__list');
            var $this = $(this);
            var href = $this.attr('href');
            $this.addClass('button--loading');
            $.get(href, function(data, status, xhr) {
                var comments = $(data).find('.comment__list .comments');
                comments.find('.comment').addClass('windowsbox-animate-appearance');
                $el.find('.comments').append(comments.html());
                $el.waitForImages(function() {
                    $el.find('.windowsbox-animate-appearance').addClass('windowsbox-animate-appearance--start windowsbox-fade-in-top-soft');
                });
                var btn = $(data).find('.comment__list .comment__pager');
                $this.parent().html(btn.html());
                layoutHeightEq();
            }).fail(function() {
                $this.text('Error');
                $this.removeClass('button--loading');
            });
        });
    }
    $(document).ready(wpCommentsLoadMore);

    function mainNav() {
        var $el = $('.header__nav');
        var $link = $el.find('.menu-item-has-children > a');
        var $linkTop = $el.find('ul > .menu-item-has-children > a');
        var $linkLang = $el.find('.menu-item-language > a');
        var activeCount = 0;
        $linkTop.click(function(e) {
            if ($(this).attr('href') == '#') {
                e.preventDefault();
            }
            var $currentParent = $(this).parent();
            if ($currentParent.hasClass('active')) {
                $el.removeClass('dropdown-open');
            } else {
                $el.addClass('dropdown-open');
            }
        });
        $link.click(function(e) {
            if ($(this).attr('href') == '#') {
                e.preventDefault();
            }
            var $currentParent = $(this).parent();
            if ($currentParent.hasClass('active')) {
                $currentParent.removeClass('active');
                $currentParent.find('.menu-item-has-children').removeClass('active');
            } else {
                $currentParent.addClass('active');
                $currentParent.siblings().removeClass('active');
                $currentParent.siblings().find('.menu-item-has-children').removeClass('active');
            }
        });
        $linkLang.click(function() {
            var $currentParent = $(this).parent();
            if ($currentParent.hasClass('active')) {
                $currentParent.removeClass('active');
                $el.removeClass('dropdown-open');
            } else {
                $currentParent.addClass('active');
                $currentParent.siblings().removeClass('active');
                $el.addClass('dropdown-open');
            }
        });
    }
    $(document).ready(mainNav);

    function animateAppearance() {
        var $el = $('.windowsbox-animate-appearance');
        if ($el.length === 0) {
            return;
        }

        function animateIfInViewport() {
            if (windowsbox.device == 'mobile') {
                return;
            }
            $el.each(function() {
                var $this = $(this);
                requestAnimationFrame(function() {
                    if ($this.hasClass('windowsbox-animate-appearance--start')) {
                        return;
                    }
                    if ($this.offset().top + 60 < windowsbox.windowHeight) {
                        $this.addClass('windowsbox-animate-appearance--start');
                    }
                });
            });
        }
        animateIfInViewport();
        $(document).off('.animateIfInViewport');
        $(document).on('windowsbox:scroll.animateIfInViewport', animateIfInViewport);
        $(document).on('windowsbox:resize.animateIfInViewport', animateIfInViewport);
    }
    $(document).ready(animateAppearance);
    $(document).on('windowsbox:ajaxPageLoad', animateAppearance);

    function progressBar() {
        $(document).off('.animateProgressBar');
        var $el = $('.progress-bar');
        if ($el.length === 0) {
            return;
        }
        if (windowsbox.device == 'mobile') {
            $el.each(function() {
                var $this = $(this);
                if ($this.hasClass('processed')) {
                    return;
                }
                var percent = $this.attr('data-percent');
                $this.find('.bar div').width(percent + '%');
                $this.addClass('processed');
            });
            return;
        }

        function animateProgressBar() {
            $el.each(function() {
                var $this = $(this);
                requestAnimationFrame(function() {
                    if ($this.hasClass('processed')) {
                        return;
                    }
                    if ($this.offset().top + 60 < windowsbox.windowHeight) {
                        var percent = $this.attr('data-percent');
                        $this.find('.bar div').width(percent + '%');
                        $this.addClass('processed');
                    }
                });
            });
        }
        animateProgressBar();
        $(document).on('windowsbox:scroll.animateProgressBar', animateProgressBar);
        $(document).on('windowsbox:resize.animateProgressBar', animateProgressBar);
    }
    $(document).ready(progressBar);
    $(document).on('windowsbox:ajaxPageLoad', progressBar);

    function relatedItemsFix() {
        if (windowsbox.device == 'mobile') {
            return;
        }
        var $el = $('.post__related');
        if ($el.length === 0) {
            return;
        }
        var $item = $el.find('.post--related');
        if ($item.length !== 3) {
            return;
        }
        var elWidth = $el.width();
        $item.width('');
        if (windowsbox.mainContentSize == 's') {
            return;
        }
        if (elWidth % 3 == 2) {
            $item.width(Math.floor(elWidth / 3));
        }
    }
    $(document).ready(relatedItemsFix);
    $(document).on('windowsbox:ajaxPageLoad', relatedItemsFix);
    $(document).on('windowsbox:resize', relatedItemsFix);

    function galleryMasonry() {
        if (windowsbox.device == 'mobile') {
            if (!$('.js-gallery-masonry').hasClass('gallery-masonry--init-processed')) {
                return;
            }
        }
        $('.js-gallery-masonry').each(function() {
            var el = this;
            var $el = $(this);
            var $image = $el.find('.gallery-item').not('.masonry-processed');
            var masonry = new Masonry(el, {
                columnWidth: '.gallery-item',
                itemSelector: '.gallery-item',
                isResizeBound: false
            });
            $el.waitForImages(function() {
                masonry.layout();
                $image.addClass('masonry-processed');
                $el.addClass('gallery-masonry--init-processed');
                layoutHeightEq();
                nanoScroll();
            });
        });
    }
    $(document).ready(galleryMasonry);
    $(document).on('windowsbox:resize', galleryMasonry);
    $(document).on('windowsbox:ajaxPageLoad', galleryMasonry);

    function windowsboxLightbox(images, active) {
        if ($('.windowsbox-lightbox').length === 0) {
            $('body').append('<div class="windowsbox-lightbox dark-mode"><div class="windowsbox-lightbox__mask js-close"></div><div class="windowsbox-loader"></div><div class="windowsbox-lightbox__content"></div><div class="windowsbox-lightbox__close js-close"><i class="icon-cross"></i></div><div class="windowsbox-lightbox__info"></div><div class="windowsbox-lightbox__arrow windowsbox-lightbox__arrow--prev js-arrow-prev"><i class="icon-arrow-left"></i></div><div class="windowsbox-lightbox__arrow windowsbox-lightbox__arrow--next js-arrow-next"><i class="icon-arrow-right"></i></div></div>');
        }
        var $el = $('body').find('.windowsbox-lightbox').fadeIn(300);
        var $content = $el.find('.windowsbox-lightbox__content');
        var $loader = $el.find('.windowsbox-loader');
        active = parseInt(active);
        activate();

        function activate() {
            var imgUrl = images[active].url;
            var caption = images[active].caption;
            $el.find('.windowsbox-lightbox__info').html((active + 1) + '/' + images.length);
            $content.stop().fadeOut(300, function() {
                $content.html('<img src="' + imgUrl + '">');
                if (caption) {
                    $content.append('<div class="windowsbox-slider__caption">' + caption + '</div>');
                }
                $loader.stop().animate({
                    'opacity': 1
                }, 500);
                $content.waitForImages(function() {
                    $content.fadeIn(300);
                    $loader.stop().animate({
                        'opacity': 0
                    }, 300);
                });
            });
        }

        function activateNext() {
            if (active < images.length - 1) {
                active++;
            } else {
                active = 0;
            }
            activate();
        }

        function activatePrev() {
            if (active > 0) {
                active = active - 1;
            } else {
                active = images.length - 1;
            }
            activate();
        }
        $el.find('.js-close').click(function() {
            $el.fadeOut(300, function() {
                $el.remove();
            });
        });
        var locked;
        var lockTimeout;

        function lockEvents(delay) {
            delay = delay ? delay : 200;
            locked = true;
            clearTimeout(lockTimeout);
            lockTimeout = setTimeout(function() {
                locked = false;
            }, delay);
        }
        $el.on('click', '.js-arrow-next', activateNext);
        $el.on('click', '.js-arrow-prev', activatePrev);
        $el.on('click', 'img', function() {
            if (!locked) {
                activateNext();
            }
        });
        $(document).keydown(function(e) {
            if (e.which == 37) {
                activatePrev();
            }
            if (e.which == 39) {
                activateNext();
            }
        });
        $el.swipe({
            swipeRight: function() {
                activatePrev();
                lockEvents();
            },
            swipeLeft: function() {
                activateNext();
                lockEvents();
            },
            threshold: 40,
            excludedElements: ''
        });
    }

    function galleryLightbox() {
        $('.gallery--lightbox').each(function() {
            var $el = $(this);
            var $item = $el.find('.gallery-item');
            var lightboxArray = [];
            $item.each(function() {
                var imgUrl = $(this).find('.gallery-icon a').attr('href');
                var caption = $(this).find('.gallery-caption').html();
                lightboxArray.push({
                    url: imgUrl,
                    caption: caption
                });
            });
            $item.on('click', '.gallery-icon a', function(e) {
                e.preventDefault();
                var activeId = $(this).closest('.gallery-item').attr('data-item-id');
                windowsboxLightbox(lightboxArray, activeId);
            });
        });
    }
    $(document).ready(galleryLightbox);
    $(document).on('windowsbox:ajaxPageLoad', galleryLightbox);

    function windowsboxWrapSelect() {
        $('select').not('.windowsbox-js-processed').each(function() {
            var $el = $(this);
            $el.wrap('<div class="windowsbox-select-wrap"></div>');
            $el.addClass('windowsbox-js-processed');
        });
    }
    $(document).ready(windowsboxWrapSelect);
    $(document).on('windowsbox:ajaxPageLoad', windowsboxWrapSelect);
})(jQuery);
