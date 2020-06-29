/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0.1
 * @since : 2017.09.26
 *
 * 닷컴 - 테마 - 골프
 * 
 * history
 * 
 * 1.0   (2017.09.26) : class="slider priceSlider" 추가 id 다르게 정의, #overlayPanel2 에대한 css 정의 해야함 xxx
 * 1.0.1 (2017.12.15) : 도시검색 공통이라 initSearch() 로직 common_new.js 로 이동
 *
 */

(function (scope) {
    if (scope.GOLF !== undefined) return;

    var GOLF = {
        //
    };

    scope.GOLF = GOLF;
})(window);

//페이지 진입 후 hash 따라 팝업 생성
$(window).on('load', function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') DOTCOM.locationHashChanged();
});

$(document).ready(function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);

    var wrapDIV = $('#wrap');

    $('body').on('open.slidepop', '.slidepopup', completePopup); //팝업모션 완료후 실행 함수 정의 
    $('body').on('open.loadpop', '.slidepopup', initPopup); //팝업로드 완료후 실행 함수 정의 

    initTab();          //탭

    //initSearch();		//검색 //del 1.0.1
    initResult();       //검색결과

    initMain();         //메인

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/

    //탭
    function initTab() {
        if (typeof WToggle !== 'undefined') {
            var pinkArrow = new WToggle();
            pinkArrow.init({target: wrapDIV, selector: '.bd_inrig > button.miniBtn02', onlyOpen: false, onTag: 'button', content: wrapDIV, contentSelector: '.bd_inrig~div.beneDis_btmCont'});
        }
    }
    
    //검색 //main01
    /* //del 1.0.1
    function initSearch() {
        //최근 검색 버튼
        var lastSearchBtn = wrapDIV.find('button.btn_latest');
    	lastSearchBtn.on('click.golf', function (e) {
            var target = $(e.currentTarget);
            var content = target.parent().next('.latestList');
            var sw = !target.hasClass('on');

            target.toggleClass('on', sw);
            content.toggle(sw);
        });
    }
    */

    //검색 결과 //search_list
    function initResult() {
        //지역 / 날짜 선택 버튼
        var btn = wrapDIV.find('div.searchTop_select button.btnSelect');
        btn.on('click.golf', function (e) {
            var target = $(e.currentTarget);
            var content = target.next('div.st_layerpop');

            //딤팝업 열기
            content.show();
            wrapDIV.addClass('zi_none');

            //버튼 text 토대로 셀렉트 변경
            content.find('input[type="radio"]+span').each(function () {
                $(this).prev('input').prop('checked', $(this).text() === target.text());
            });

            //딤팝업 닫기
            content.off('click.golf').on('click.golf', 'button.btn_layerPop', function (e) {
                content.off('click.fnd').hide();
                $(window).off('scroll.dimpop');

                wrapDIV.removeClass('zi_none');
            });

            //스크롤 시 팝업 닫기
            $(window).off('scroll.dimpop').on('scroll.dimpop', function (e) {
                content.find('button.btn_layerPop').trigger('click.golf');
            });
        });

        //지역 선택 팝업 딤팝업 내 셀렉트
        wrapDIV.find('div.st_layerpop').on('change.golf', 'input[type="radio"]', function (e) {
            var target = $(e.currentTarget);

            var text = target.next('span').text();
            var emReg = /^\d.+(?=\s\d+.)/g;
            var reg = /(?=[^\s])[^\s]+$/g;

            var chooseEM = text.match(emReg);
            var chooseText = text.match(reg);

            if (chooseEM !== null && chooseEM.length > 0) { //2차 날짜 ~
                target.closest('.st_layerpop').prevAll('em').text( chooseEM[0] );
            }

            if (chooseText !== null && chooseText.length > 0) { //한강이북, 11. 10(금)
                target.closest('.st_layerpop').prev('button').text( chooseText[0] );
            }
        });
    }

    //메인 //main02_01
    function initMain() {
        new SwiperTemplate().initFreeSwiper($('.golf_domeSwipe .swiper-container'), {slidesOffsetBefore: 10, slidesOffsetAfter: -30, spaceBetween: 10});
    }

    //달력 //main02_01
    function initCalendar(options, pickerTarget) {
        if (typeof Hanatour_components_calendar === 'undefined') return;

        var datepickerTarget = pickerTarget || $('#datepicker');

        var opts = $.extend({}, {
            numberOfMonths: [12, 1],
            minDate: '+1d',
            maxDate: '+3y',
            yearSuffix: '',
            monthSuffix: '월',
            range: true,
            onRange : function (dateArr) {
                var checkin = dateArr[0] || '';
                var checkout = dateArr[1] || '';
                
                $('.twoType > .dayCell:eq(0) > strong').text(checkin);
                $('.twoType > .dayCell:eq(1) > strong').text(checkout);
            },
            onSelect : function (date) {
                
            },
            addUpdate : function (container) {
                var datepickers = container.container;
                var titleDIV = datepickers.find('.ui-datepicker-title');
                var dayTHEAD = datepickers.find('thead');
                var yearSPAN = titleDIV.find('span.ui-datepicker-year');
                var monthSPAN = titleDIV.find('span.ui-datepicker-month');

                titleDIV.eq(0).hide();
                dayTHEAD.remove();

                yearSPAN.hide();
                monthSPAN.each(function () {
                    $(this).text(parseInt($(this).text()));
                });
            },
            addEvent : function (container) {
                var datepickers = container.container;
                var calendarHeader = $('.popCalenderBox > .calenderTop');
            }
        }, options);

        var calendar = new Hanatour_components_calendar();
        calendar.init(datepickerTarget, opts); //{} jquery ui 옵션 확장

        //달력 헤더 스크롤에 따른 월 변경
        $(window).on('scroll', function (e) {
            changeScrollToDate();
        });

        function changeScrollToDate() {
            var datepickers = $('#datepicker .ui-datepicker-group');
            var fixedDIV = $('.header.pickerTop');
            var marginDIV = $('.headPicMargin').outerHeight();
            var scrollTop = $(window).scrollTop();
            var act = 0;

            datepickers.each(function(idx) {
                if (Math.round($(this).offset().top) + marginDIV > scrollTop) {
                    act = idx;
                    return false;
                }
            });

            var year = datepickers.eq(act).find('.ui-datepicker-year').text();
            var month = datepickers.eq(act).find('.ui-datepicker-month').text();

            fixedDIV.find('.firstMonth').text( year + '.' + getForce2Digits(parseInt(month)) );
        }

        changeScrollToDate();

        function getForce2Digits(value) {
            return (value < 10) ? '0' + value.toString() : value.toString();
        }
    }

    //팝업로드 완료후 실행 함수 정의 
    function initPopup() {
        var popInner = $('.slidepopup:last > div');

        if (popInner.length > 0) {
            //달력 //pop_calender //팝업 인라인 호출
            //var datepickerTarget = popInner.find('#datepicker');
            //if (datepickerTarget.length > 0) initCalendar({}, datepickerTarget);

            //슬라이더 //pop_time_mn
            var timeSliderTarget = popInner.find('.slider').eq(0);
            if (timeSliderTarget.length > 0) {
                var currentTime = timeSliderTarget.siblings('.bar_txt').text().match(/\d+/g); //html에서 설정값 얻기

                if (currentTime.length >= 2) {
                    timeSliderTarget.slider({
                        range: true,
                        step: 1,
                        min: 0,
                        max: 24,
                        values: [parseInt(currentTime[0]), parseInt(currentTime[1])],
                        slide: function(e, ui) {
                            changeTimeText(e, ui);
                        }
                    });
                }

                var timeText = timeSliderTarget.siblings('.bar_txt').text().substr(-1);

                function changeTimeText(e, ui) {
                    var target = $(e.target);
                    var valueSPAN = target.siblings('.bar_txt');

                    var min = getForce2Digits(String(ui.values[0]));
                    var max = getForce2Digits(String(ui.values[1]));

                    valueSPAN.text(min + timeText + ' ~ ' + max + timeText);
                }
            }

            var priceSliderTarget = popInner.find('.slider').eq(1);
            if (priceSliderTarget.length > 0) {
                var currentPrice = priceSliderTarget.siblings('.bar_txt').text().match(/\d+/g); //html에서 설정값 얻기

                priceSliderTarget.slider({
                    range: true,
                    step: 10000,
                    min: 10000,
                    max: 3000000,
                    values: [parseInt(currentPrice[0]) * 10000, parseInt(currentPrice[1]) * 10000],
                    slide: function(e, ui) {
                        changePriceText(e, ui);
                    }
                });

                var doller = priceSliderTarget.siblings('.bar_txt').text().substr(-2);

                function changePriceText(e, ui) {
                    var target = $(e.target);
                    var valueSPAN = target.siblings('.bar_txt');

                    var min = String(ui.values[0]).replace(/0000$/g, '');
                    var max = String(ui.values[1]).replace(/0000$/g, '');

                    valueSPAN.text(min + doller + ' ~ ' + max + doller);
                }
            }

            //지역탭 //pop_change
            var areaListDIV = popInner.find('.pop_areaList');
            if (areaListDIV.length > 0) {
                areaListDIV.on('click.golf', '> button', function (e) {
                    var target = $(e.currentTarget);

                    target.addClass('on').siblings().removeClass('on');
                });
            }

        } //end if
    }

    //팝업모션 완료후 실행 함수 정의 
    function completePopup() {
        var popInner = $('.slidepopup:last > div');

        if (popInner.length > 0) {
            
        }
    }


    function getForce2Digits(value) {
        return (value < 10) ? '0' + value.toString() : value.toString();
    }

    /**********************************************************************************************
     **************************************** 외부 제공 함수 **************************************
     **********************************************************************************************/

    GOLF.initCalendar = initCalendar;
    GOLF.initPopup = initPopup;
    GOLF.SwiperTemplate = (function () {return new SwiperTemplate()})();
});

/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

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