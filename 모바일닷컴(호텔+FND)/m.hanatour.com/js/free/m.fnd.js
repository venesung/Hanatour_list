/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.07.26
 *
 * FND
 * 
 * history
 * 
 * 1.0   (2017.07.26) : 
 *
 */

(function (scope) {
    if (scope.FND !== undefined) return;

    var FND = {
        //
    };

    scope.FND = FND;
})(window);

//페이지 진입 후 hash 따라 팝업 생성
$(window).on('load', function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') DOTCOM.locationHashChanged();
});

$(document).ready(function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);

    var wrapDIV = $('#wrap');
    var fndTabNAV = $('nav.fndTab');
    var containerDIV = $('#container');

    $('body').on('open.slidepop', '#overlayPanel', initPopup); //팝업로드 완료후 실행 함수 정의 

    initTab();          //탭
    initToolTip();      //툴팁
    initCalendar();     //달력

    initDetail();       //상세
    initReservation();  //약관

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/

    //탭
    function initTab() {
        if (typeof WToggle !== 'undefined') {
            //1뎁스 메뉴
            var oneTab = new WToggle();
            oneTab.init({target: fndTabNAV, selector: '> ul > li > a', onTag: 'li'});
        }

        containerDIV.off('.fnd');

        //토글메뉴(상하 회색 화살표) //reservation_end
        containerDIV.on('click.fnd', 'button.btn_toggle', function (e) {
            var target = $(e.currentTarget);
            var cont = target.parent().next('div');
            
            var sw = !target.is('.on');

            cont.toggle(sw);
            target.toggleClass('on', sw);
        });

        //토글메뉴(상하 흰색 화살표) //detail
        containerDIV.on('click.fnd', 'button.fnd_scToggle', function (e) {
            var target = $(e.currentTarget);
            var cont = target.closest('dt').next('dd');
            
            var sw = !target.is('.on');

            cont.toggle(sw);
            target.toggleClass('on', sw);
        });

        //펼치기 //detail
        containerDIV.on('click.fnd', 'button.txtCard_toggle', function (e) {
            var target = $(e.currentTarget);
            var cont = target.prev('p.txtCard');

            var sw = !target.is('.on');

            cont.toggleClass('open', sw);
            target.toggleClass('on', sw);
        });

        //후기 리스트(상하 화살표) //detail
        containerDIV.on('click.fnd', 'button.review_toggle', function (e) {
            var target = $(e.currentTarget);
            var cont = target.closest('dt').next('dd').find('> p')

            var sw = !target.is('.on');

            cont.toggleClass('open', sw);
            target.toggleClass('on', sw);
        });

        //딤버튼, 전체 200개 //search_end
        containerDIV.on('click.fnd', 'button.layerOpen', function (e) {
            var target = $(e.currentTarget);
            var content = target.next('div.st_layerpop');

            target.toggleClass('on');
            content.toggle(target.hasClass('on'));

            wrapDIV.addClass('zi_none');

            if (target.hasClass('on')) {
                content.off('click.fnd').on('click.fnd', 'button.btn_layerPop', function (e) {
                    content.off('click.fnd').hide().prev('.layerOpen').removeClass('on');
                    $(window).off('scroll.dimpop');

                    wrapDIV.removeClass('zi_none');
                });

                $(window).off('scroll.dimpop').on('scroll.dimpop', function (e) {
                    content.find('button.btn_layerPop').trigger('click.fnd');
                });
            }
        });

        //정렬 필터 버튼 //search_end
        $('.sort_select').on('click.fnd', 'a.sortBtn', function (e) {
            var target = $(e.currentTarget);
            var content = target.next('div.st_inBox');

            target.toggleClass('on');
            content.toggle(target.hasClass('on'));
        });
    }

    //툴팁 //reservation01
    function initToolTip() {
        $('button.miniPop').on('click.fnd', function (e) {
            var target = $(e.currentTarget);
            var pop = target.next('div.miniPop_cont');

            if (pop.is(':hidden')) {
                target.addClass('on');
                pop.show();   
                pop.find('.close_mini').one('click.fnd', function (e) {
                    $(this).closest('div.miniPop_cont').hide().prev('button.miniPop').removeClass('on');
                });
            } else {
                pop.find('.close_mini').triggerHandler('click.fnd');
            } 
        });

        /*
        $('button.miniPop').on('focusout', function (e) {
            var target = $(e.currentTarget);
            var pop = target.next('div.miniPop_cont');

            if (!pop.is(':hidden')) pop.find('.close_mini').triggerHandler('click.fnd');
        });
        */
       
        //plus, minus
        $('.btnCell').on('click.fnd', '> button', function (e) {
            var target = $(e.currentTarget);
            var text = target.siblings('strong');
            var idx = target.closest('li').index(); 

            if (target.hasClass('plus')) {
                text.text( Math.min(parseInt(text.text()) + 1, 10) );
            } else if (target.hasClass('minus')) {
                text.text( Math.max(parseInt(text.text()) - 1, (idx === 0 ? 1: 0)) ); //성인은 기본 1
            }
        });
    }

    //달력 //reservation01
    function initCalendar(options) {
        if (typeof Hanatour_components_calendar === 'undefined') return;

        var opts = $.extend({}, {
            numberOfMonths: [1, 1],
            minDate: '+1d',
            yearSuffix: '년 ',
            monthSuffix: '월',
            onSelect : function (date) {
                //console.log(date);
            },
            addUpdate : function (container) {
                var datepickers = container.container;
                var calendarHeader = $('.calenderBox > .calenderTop');
                var currentDate = datepickers.datepicker('getDate');
                var prevBtn = calendarHeader.find('.prevMonth');
                var nextBtn = calendarHeader.find('.nextMonth');

                calendarHeader.find('> strong').text( datepickers.find('.ui-datepicker-title').text() );

                var month = parseInt(datepickers.find('span.ui-datepicker-month').text()) - 1;
                var prevMonth = month - 1;
                var nextMonth = month + 1;

                prevMonth = (prevMonth < 0) ? 11 : prevMonth;
                nextMonth = (nextMonth % 12);

                prevBtn.removeClass('end').contents().eq(0).replaceWith(prevMonth+1 + "월");
                nextBtn.removeClass('end').contents().eq(0).replaceWith(nextMonth+1 + "월");

                if (datepickers.find('.ui-datepicker-prev').hasClass('ui-state-disabled')) prevBtn.addClass('end');
                if (datepickers.find('.ui-datepicker-next').hasClass('ui-state-disabled')) nextBtn.addClass('end');
            },
            addEvent : function (container) {
                var datepickers = container.container;
                var calendarHeader = $('.calenderBox > .calenderTop');

                calendarHeader.on('click.calendar', '.prevMonth', function (e) {
                    var target = $(e.currentTarget);

                    datepickers.find('.ui-datepicker-prev').trigger('click');
                });

                calendarHeader.on('click.calendar', '.nextMonth', function (e) {
                    var target = $(e.currentTarget);

                    datepickers.find('.ui-datepicker-next').trigger('click');
                });
            }
        }, options);

        var calendar = new Hanatour_components_calendar();
        calendar.init($('#datepicker'), opts); //{} jquery ui 옵션 확장
    };

    //팝업내부 초기화
    function initPopup() {
        var popInner = $('#overlayPanel .pop_innerComm');

        if (popInner.length > 0) {
            if (DOTCOM !== undefined && typeof DOTCOM.initToggle !== 'undefined') DOTCOM.initToggle(popInner);
            if (FND !== undefined && FND.SwiperTemplate !== undefined) FND.SwiperTemplate.initGallerySwiper(popInner.find('.swiper-container')); //스와이프 초기화

            if (typeof WToggle !== 'undefined') {
                //1뎁스 메뉴
                var cityInnerTab = new WToggle();
                cityInnerTab.init({target:  popInner.find('.swiper-container'), selector: '.swiper-slide .searchCont01 ul.areaList > li > button', onTag: 'button'});
            }
        }
    }

    /**********************************************************************************************
     ********************************************* 상세 *******************************************
     **********************************************************************************************/

    function initDetail() {
        var detailSECTION = $('.fnd_detail');

        //상단 페이징
        var mainSwiperDIV = detailSECTION.find('.swiper-container.fnd_imgSlide');
        if (mainSwiperDIV.length > 0) {
            var swiper = mainSwiperDIV[0].swiper;
            if (swiper !== undefined) {
                swiper.on('onTransitionEnd', function (data) {
                    swiperChange(data);
                });
            }

            mainSwiperDIV.on('click.city', '.swip_imgPrev', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slidePrev();
                swiperChange(s);

                e.preventDefault();
            });

            mainSwiperDIV.on('click.city', '.swip_imgNext', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slideNext();
                swiperChange(s);

                e.preventDefault();
            });

            //스와이프 변경
            function swiperChange(data, event) {
                var container = data.container;
                var max = container.find('.swiper-pagination > span').length;
                var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

                container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);
                container.find('.swiper-slide-visible.swiper-slide-duplicate .swiper-lazy').removeClass('swiper-lazy-loading');
            }
        }
        swiperChange({container: mainSwiperDIV});

        //아이콘 프리 스와이프
        new SwiperTemplate().initFreeSwiper(detailSECTION.find('.datail_commCont > .swiper-container.icoList'), {slidesPerView: 'auto', slidesOffsetBefore: 15, slidesOffsetAfter: 0, spaceBetween: 0});
        
        //
    }

    /**********************************************************************************************
     ********************************************* 예약 *******************************************
     **********************************************************************************************/

    function initReservation() {
        //약관
        var termsBoxDIV = $('div.termsBox');
        if (termsBoxDIV.length !== 0) {
            //조회기간 버튼
            termsBoxDIV.on('click.fnd', 'ul.inner_terms > li > button', function (e) {
                var target = $(e.currentTarget);

                target.toggleClass('open');
            });
        }
    }

    /**********************************************************************************************
     **************************************** 외부 제공 함수 **************************************
     **********************************************************************************************/

    FND.initPopup = initPopup;
    FND.initCalendar = initCalendar;
    FND.SwiperTemplate = (function () {return new SwiperTemplate()})();
});

/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1
* @since : 2016.11.11
*
* history
*   1.0   (2016.11.11) : -
*   1.1.0 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
*                        resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
*                        initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
*   1.1.1 (2017.05.19) : verticalMode 에서 가로형 이미지도 모두 적용토록 수정하고 opts.vertical 생성하여 필요시에만 적용, verticalMode() 간소화
*                        loop, lazy 조합 시 div.swiper-slide-duplicate 에 .swiper-lazy 대상이 .swiper-lazy-loading 상황일때 복제되어 lazy 재로드 못하는 문제 해결 
*                        watchSlidesVisibility:true 기본으로 추가되도록 수정
*
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
(function(b){if(b.SwiperTemplate!==undefined){return}var a=(function(d){var c=function(){var e,h;var k={};var l=false;function g(q,p){var o=q.container;var n=o.find(".swiper-pagination > span").length;var m=o.find(".swiper-pagination .swiper-pagination-bullet-active").index();o.find(".swiper-pag-num").html("<span>"+(m+1)+"</span> / "+n);if(k.loop&&k.lazyLoading){o.find(".swiper-slide-visible.swiper-slide-duplicate .swiper-lazy").removeClass("swiper-lazy-loading")}if(k.exChange!==undefined){k.exChange(q,p)}}function j(){h.each(function(m){if(d(this).is(".swiper-container-horizontal")){e=d(this)[0].swiper;if(e!==undefined){e.destroy(false,true)}}})}function i(m,o){var n=d(m);var o=n.find("img");o.css("marginTop",(o.parent().height()-o.height())*0.5)}function f(n){var m=n.container;var o=(d(window).width()/9)*16;m.find(".swiper-container .swiper-slide").css("height",o*0.32);m.find(".swiper-container .swiper-slide img").css("height",o*0.32)}return{initGallerySwiper:function(n,m){var o;h=n;j();if(h.find(".swiper-slide").length===1){h.find(".swiper-pagination").hide()}h.each(function(p){o={viewport:false,vertical:false,pagination:d(this).find(".swiper-pagination"),loop:((d(this).find(".swiper-slide").length>1)?true:false),preloadImages:false,watchSlidesVisibility:true,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(s,q,r){if(k.vertical){i(q,r)}},onSlideChangeStart:function(q){g(q,"onSlideChangeStart")},onSliderMove:function(q){g(q,"onSliderMove")},onTransitionEnd:function(q){g(q,"onTransitionEnd")},onInit:function(q){g(q,"onInit");if(k.viewport){f(q)}}};k=d.extend({},o,m);e=new Swiper(d(this),k)});h.find("a.big5_prev").on("click.city",function(r){var q=d(r.currentTarget);var p=q.closest(".swiper-container")[0].swiper;p.slidePrev();g(p);r.preventDefault()});h.find("a.big5_next").on("click.city",function(r){var q=d(r.currentTarget);var p=q.closest(".swiper-container")[0].swiper;p.slideNext();g(p);r.preventDefault()})},initFreeSwiper:function(n,m){h=n;j();var o={pagination:h.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true};h.each(function(p){k=d.extend({},o,m);e=new Swiper(d(this),k)})},resetSwiper:function(m){h=(m.hasClass("swiper-container-horizontal"))?m:m.find(".swiper-container-horizontal");h.each(function(){e=d(this)[0].swiper;if(e!==undefined){e.destroy(false,true);new Swiper(e.container,e.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);