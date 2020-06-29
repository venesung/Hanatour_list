/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0.1
 * @since : 2016.01.11
 *
 * history
 * 
 * 1.0   (2017.01.11) : 
 * 1.0.1 (2017.03.24) : 스와이프 이동 시 재생중인 영상 정지 추가
 *
 */

(function (scope) {
    if (scope.HANATV !== undefined) return;

    var HANATV = {};

    scope.HANATV = HANATV;
})(window);

$(document).ready(function () {
    //http://www.appelsiini.net/projects/viewport
    (function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);

    /*
    initVideo();

   //일정 - 관련 영상
    function initVideo() {
        var videoA = $('.tvProdBox > .hanaTvSwipe.swiper-container .swiper-slide > a');

        videoA.each(function () {
            var url = $(this).attr('href');
            var vurl;

            if (url.match('youtu') !== null) {
            //유튜브
                var regex = /youtu[A-z]+.\w+\/watch\?.*v=(\w+)/i;

                if (url.match(regex) !== null) {
                    //www.youtube.com/watch?v=In1wr8zAaPA 스타일 대응
                    vurl = url.match(regex);
                } else {
                    //youtu.be/WkdtmT8A2iY or youtube.com/v/WkdtmT8A2iY 대응
                    vurl = url.match(/youtu.*\/(\S+)/i);
                }

                if (vurl !== null && vurl.length > 1) loadYoutubeThumbnail(vurl[1], url);
            } else {}
        });

        //youtube 영상 섭네일 & 비디오 전용 url 치환
        function loadYoutubeThumbnail(vid, url) {
            var img = 'http://img.youtube.com/vi/' + vid + '/mqdefault.jpg';
            //var newUrl = url.replace(/youtu.*\//g, 'www.youtube.com/watch?v='); //영상만있는 url 로 치환

            settingAtag(img, vid, url);
        }
        
        /**
         * 영상리스트 스와이프에 쓸 a 태그 생성
         *
         * @param img      ::: 섭네일 이미지
         * @param id       ::: 영상 id
         * @param url      ::: 비디오 url
         *
        function settingAtag(img, id, url) {
            var a = $('.tvProdBox > .hanaTvSwipe.swiper-container .swiper-slide > a[href*="' + id + '"]:first');

            a.find('img').attr('data-src', img);

            if (url !== undefined) a.attr('href', url);

            return a;
        }
    }
    */
    
    initEvent();

    function initEvent() {
        $(window).on('resize.hanatv', function (e) {
            $('iframe').css('height', getLinearFunction(0, 1920, 0, 1080, $('.swiper-slide').width()));
        }).trigger('resize.hanatv');

        $(window).on('scroll.hanatv', function (e) {
            var iframeVideo = $('iframe:above-the-top').add($('iframe:below-the-fold')).filter(function () {
                return !($(this).closest('.swiper-slide').not('.swiper-slide-active').length > 0)
            });

            pauseIframeVideo(iframeVideo); //modify 1.0.1
        });
    }

    /**
     * youtube 아이프레임 일지정지
     * @param  {Jquery Object} target 적용할 대상 iframe
     */
    function pauseIframeVideo(iframe) {
        iframe.each(function () {
            this.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');    
        });
    }

    /**
     * 1차함수
     * @param a ::: 값1의 최소값
     * @param b ::: 값1의 최대값
     * @param c ::: 값2의 최소값
     * @param d ::: 값2의 최대값
     * @param x ::: 값1의 현재값
     * @return  ::: 값2의 현재값 
     */
    function getLinearFunction(a, b, c, d, x) {
        return (d - c) / (b - a) * (x - a) + c
    }

    //스와이프 1.0.1
    HANATV.initGallerySwiper = function (targetContainer, options) {
        var swiper;

        //중복 방지 초기화
        if (targetContainer.length > 0 && targetContainer.is('.swiper-container-horizontal')) {
            swiper = targetContainer[0].swiper;
            if (swiper !== undefined) swiper.destroy(false, true);    
        }

        var opts;
        var defaults = {
            viewport : false,
            pagination: targetContainer.find('.swiper-pagination'),
            loop: ((targetContainer.find('.swiper-slide').length > 1) ? true : false),
            preloadImages: false,
            lazyLoadingInPrevNext: true,
            lazyLoading: true,
            onLazyImageReady: function (swiper, slide, img) {
                verticalMode(slide, img);
            },
            onSlideChangeStart: function (data) {
                pauseIframeVideo(data.container.find('iframe')); //add 1.0.1

                swiperChange(data);
            },
            onSliderMove: function (data) {
                swiperChange(data);
            },
            onTransitionEnd: function (data) {
                swiperChange(data);
            },
            onInit: function (data) {
                swiperChange(data);

                if (opts.viewport) viewportFix(data);
            }
        };

        if (targetContainer.find('.swiper-slide').length === 1) targetContainer.find('.swiper-pagination').hide();

        //targetContainer === .swiper-container
        targetContainer.each(function (idx) {
            opts = $.extend({}, defaults, options);
            swiper = new Swiper($(this), opts);
        });

        targetContainer.find('a.big5_prev').on('click.city', function (e) {
            var target = $(e.currentTarget);
            var s = target.closest('.swiper-container')[0].swiper;
            
            s.slidePrev();
            swiperChange(s);

            e.preventDefault();
        });

        targetContainer.find('a.big5_next').on('click.city', function (e) {
            var target = $(e.currentTarget);
            var s = target.closest('.swiper-container')[0].swiper;

            s.slideNext();
            swiperChange(s);

            e.preventDefault();
        });

        //세로 모드 지원
        function verticalMode(slide, img) {
            var tImg = new Image();
            tImg.src = img.src;

            if (tImg.height > tImg.width) {
                var slideDIV = $(slide);
                slideDIV.addClass('column'); //position: absolute; left: 0; top: 50%; margin-top: -91px; height: auto;
                slideDIV.find('img').css('height', ''); //vh설정 해제

                var img = slideDIV.find('img');
                img.css('marginTop', -img.height() * .5);
            }
        }

        //ios9 에서 iframe 내부에서 vh 재대로 잡지 못하는 문제 해결
        function viewportFix(data) {
            var container = data.container;
            var vh = ($(window).width() / 9) * 16;

            container.find('.swiper-container .swiper-slide').css('height', vh * 0.32);
            container.find('.swiper-container .swiper-slide img').css('height', vh * 0.32);
        }

        function swiperChange(data) {
            var container = data.container;
            var max = container.find('.swiper-pagination > span').length;
            var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

            container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);

            if (opts.exChange !== undefined) opts.exChange(data);
        }
    };

    HANATV.initGallerySwiper($('.tvProdBox > .hanaTvSwipe.swiper-container'), {viewport:false, paginationClickable:true, exChange: function (data) {
        var container = data.container;
        var idx = container.find('.swiper-pagination > .swiper-pagination-bullet-active').index();

        $('.productFade > .prodCont').hide().eq(idx).show();

        $(window).triggerHandler('resize.hanatv')
        $(window).triggerHandler('scroll.hanatv');
    }});
});