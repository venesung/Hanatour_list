/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.08.04
 *
 * history
 * 
 * 1.0   (2016.08.04) : 
 *
 */

(function (scope) {
    if (scope.LODGE !== undefined) return;

    var LODGE = {};

    scope.LODGE = LODGE;
})(window);

$(document).ready(function () {
    var searchContainerDIV = $('.ht_listBox');
    var detailTopDIV = $('.htDetailTop');
    var sortingDIV = $('.newMain_hotel > .reservSorting');
    var faqDL = $('.ht_faqList');

    initHrefPop();          //페이지 로드 팝업 초기화
    initTab();              //호텔 - 상세검색 - 탭
    initSortFilter();       //호텔 - 검색결과 - 상단탭 정렬변경 버튼 //hotel_sub01
    initProductDetail();    //호텔 - 호텔상세
    initBookingList();      //호텔 - 예약내역
    initFaq();              //호텔 - faq

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/

    //페이지 로드 팝업
    function initHrefPop() {
        var linkTagA = $('a.InfoPop');

        linkTagA.on('click', function (e) {
            var target = $(e.currentTarget);
            var loadURL = $(this).attr('href');
        
            DOTCOM.openLoadPop({
                target : target,
                url : loadURL,
                parent : $('body > div[data-role="page"]')
            });

            e.preventDefault();
        });
    }

    /**********************************************************************************************
     ********************************************* 검색 *******************************************
     **********************************************************************************************/

    //호텔 - 상세검색 - 탭
    function initTab() {
        searchContainerDIV.on('click.lodge', '> ul.stTabBtn > li:not(":first") > a', function (e) {
            var target = $(e.currentTarget);
            var li = target.closest('li');
            var idx = li.index();

            var tabContainer = searchContainerDIV.find('> ul.stTabBtn');
            var sortBtnA = tabContainer.find('> li:eq(1) > a');
            var mapBtnA = tabContainer.find('> li:eq(2) > a');

            var sortContent = searchContainerDIV.find('.ht_inner > .st_inBox');
            var listContent = searchContainerDIV.find('.ht_inner');
            var mapContent = searchContainerDIV.find('.ht_map');

            tabContainer.removeClass('w50');
            mapBtnA.removeClass('bg_ico04');
            listContent.hide();
            mapContent.hide();

            switch (idx) {
                case 0 :
                    //상세검색, initHrefPop() 실행

                    break;
                case 1 :
                    //추천순
                    listContent.show();

                    if (sortBtnA.parent().hasClass('open')) {
                        sortBtnA.parent().removeClass('open');
                        sortContent.hide();
                    } else {
                        sortBtnA.parent().addClass('open');
                        sortContent.show();
                    }
                    

                    break;
                case 2 : 
                    //지도보기                  
                    if (mapBtnA.hasClass('bg_ico03')) {
                        mapContent.show();

                        mapBtnA.removeClass('bg_ico03').addClass('bg_ico04');
                        sortBtnA.parent().hide().closest('ul.stTabBtn').addClass('w50');
                    } else {
                        listContent.show();

                        mapBtnA.removeClass('bg_ico04').addClass('bg_ico03');
                        sortBtnA.parent().show();
                    }


                    break;
                default :

            }
        });
    }
    
    //호텔 - 검색결과 - 상단탭 정렬변경 버튼 //hotel_sub01
    function initSortFilter() {
        if (searchContainerDIV.length === 0) return;

        var filterTab = new WTab();
        filterTab.init({target: searchContainerDIV.find('.st_inBox > ul'), selector: '> li > a', onTag: 'li', onClass: 'on', onChange: function (data) {
            var label = $(data.target).text();

            searchContainerDIV.find('.stTabBtn > li.open > a').contents().eq(0).replaceWith(label);
            searchContainerDIV.find('> ul.stTabBtn > li:eq(1) > a').parent().removeClass('open');
            searchContainerDIV.find('.ht_inner > .st_inBox').hide();
            
        }});
    }

    /**********************************************************************************************
     ********************************************* 상세 *******************************************
     **********************************************************************************************/

    //호텔 - 호텔상세 //hotel_sub03
    function initProductDetail() {
        if (detailTopDIV.length === 0) return;

        var detailContainerDIV = detailTopDIV.closest('.hotelSection');    //호텔상세 컨텐츠 컨테이너 

        //변경 버튼
        detailContainerDIV.on('click.lodge', '.reSearchTop > a', function (e) {
            var target = $(e.currentTarget);
            var content = target.closest('.reSearchTop').next('.reSearchBox');

            content.toggle();

            e.preventDefault();
        });

        //객실 더보기 버튼
        detailContainerDIV.on('click.lodge', 'a.viewRoomBtn', function (e) {
            var target = $(e.currentTarget);
            var listContainer = target.prev('ul');

            listContainer.addClass('open');
            target.hide();

            e.preventDefault();
        });

        //트립어드바이저평점, 하나투어 평점
        if (WTab !== undefined) {
            var tab = new WTab();
            tab.init({target : detailContainerDIV, selector: '.rankingBox > ul > li >a', onTag: 'li', content: detailContainerDIV, contentSelector: '.rankingBox > div'});
            tab.setCloseAll();
            tab.setOpen(0);
        }

        //객설선택하기 
        detailContainerDIV.on('click.lodge', '.fixSdBtn > a.roomChoice', function (e) {
            var target = $(e.currentTarget);
            var researchContainer = detailContainerDIV.find('.reSearchSect');
            var header = $('header');

            if (researchContainer.length > 0) {
                var ypos = researchContainer.offset().top - header.outerHeight();

               moveScroll(ypos);
            }
        });

        //스크롤 이동
        function moveScroll(targetY) {
            $('html, body').stop().animate({
                scrollTop : targetY
            }, {queue: false, duration: 1000, easing: 'easeInOutQuart', complete: function () {
                $('body').off('touchstart.lodge');
            }});

            $('body').one('touchstart.lodge', function (e) {
                $('html, body').stop();
            });
        }
    }

    /**********************************************************************************************
     ********************************************* 예약 *******************************************
     **********************************************************************************************/

    //호텔 - 예약내역 //hotel_sub05
    function initBookingList() {
        if (sortingDIV.length === 0) return;

        //조회기간 버튼
        sortingDIV.on('click.lodge', '> .rightSearch > .togBtn > a', function (e) {
            var target = $(e.currentTarget);

            target.parent().toggleClass('open');
        });
    }

    /**********************************************************************************************
     ********************************************* 기타 *******************************************
     **********************************************************************************************/

    //호텔 - faq //hotel_sub08
    function initFaq() {
        if (faqDL.length === 0) return;
        
        var tab = new WTab();
        tab.init({target: faqDL, selector: '> dt > a', onTag: 'dt', onClass: 'open', onlyOpen: false, onChange: function (data) {
        }});
    }

    /**********************************************************************************************
     **************************************** 외부 제공 함수 **************************************
     **********************************************************************************************/

    //달력
    LODGE.initCalendar = function () {
        if (typeof Hanatour_components_calendar === 'undefined') return;

        var calendar = new Hanatour_components_calendar();
        calendar.init($('#datepicker'), {
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
        }); //{} jquery ui 옵션 확장

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
    };

    //호텔 - 도시검색 - 팝업 //hotel_main01
    LODGE.initCitySearch = function () {
        if (WTab !== undefined) {
            var tab = new WTab();
            tab.init({target: $('.cityListNew'), selector: '> ul > li > a', onTag: 'a', content: $('.cityListNew'), contentSelector: '> ul > li > div', onChange: function (data) {
            }});
        }
    };

    //호텔 - 상세검색 - 팝업 //hotel_sub01
    LODGE.initDetailSearch = function () {
        var hotelLevelContanerDIV = $('.popHotelLevel');

        $('.popLabelAco').on('click.lodge', '> h4 > a', function (e) {
            var target = $(e.currentTarget);

            target.parent().toggleClass('on');
        });

        hotelLevelContanerDIV.on('click.lodge', '> ul > li > a', function (e) {
            var target = $(e.currentTarget);
            var li = target.closest('li');

            li.toggleClass('on');
        });

        $('#slider').slider({
            range: true,
            min: 0,
            max: 1000000,
            values: [0, 1000000],
            slide: function(e, ui) {
                changeText(e, ui);
            }
        });

        var doller = $('#slider').siblings('.moneySect').find('> span').text().substr(0, 1);

        function changeText(e, ui) {
            var target = $(e.target);
            var valueSPAN = target.siblings('.moneySect').find('> span');

            var idx = $(ui.handle).index() - 1;
            var min = String(ui.values[0]).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            var max = String(ui.values[1]).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

            valueSPAN.removeClass('on').eq(idx).addClass('on');
            valueSPAN.eq(0).text(doller + ' ' + min);
            valueSPAN.eq(1).text(doller + ' ' + max);
        }
    };

    //호텔 - 상세검색 - 평점 - 자세히보기 - 팝업 //hotel_sub03
    LODGE.initReviewTab = function () {
        var tab = new WTab();
        tab.init({target: $('.popReserve01'), selector: 'dl > dt > a', onTag: 'dt', onlyOpen: false, onClass: 'open', onChange: function (data) {
        }});
    };

    //스와이프
    LODGE.initGallerySwiper = function (targetContainer, options) {
        var opts = $.extend({}, {
            viewport : false
        }, options);

        var swiper;

        //중복 방지 초기화
        if (targetContainer.length > 0 && targetContainer.is('.swiper-container-horizontal')) {
            swiper = targetContainer[0].swiper;
            if (swiper !== undefined) swiper.destroy(false, true);    
        }

        //targetContainer === .swiper-container
        targetContainer.each(function (idx) {
            swiper = new Swiper($(this), {
                pagination: $(this).find('.swiper-pagination'),
                loop: (($(this).find('.swiper-slide').length > 1) ? true : false),
                preloadImages: false,
                lazyLoadingInPrevNext: true,
                lazyLoading: true,
                onLazyImageReady: function (swiper, slide, img) {
                    verticalMode(slide, img);
                },
                onSlideChangeStart: function (data) {
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
            });

            $(this).find('a.big5_prev').on('click.city', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slidePrev();
                swiperChange(s);

                e.preventDefault();
            });

            $(this).find('a.big5_next').on('click.city', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slideNext();
                swiperChange(s);

                e.preventDefault();
            });
        });

        //세로 모드 지원
        function verticalMode(slide, img) {
            var tImg = new Image();
            tImg.src = img.src;

            //alert(tImg.height + 'x' + tImg.width + ':' + tImg.src);

            if (tImg.height > tImg.width) {
                var slideDIV = $(slide);
                slideDIV.addClass('column'); //position: absolute; left: 0; top: 50%; margin-top: -91px; height: auto;
                slideDIV.find('> img').css('height', ''); //vh설정 해제

                var img = slideDIV.find('> img');
                img.css('marginTop', -img.height() * .5);
            }
        }

        //ios9 에서 iframe 내부에서 vh 재대로 잡지 못하는 문제 해결
        function viewportFix(data) {
            var container = data.container;
            var vh = ($(window).width() / 9) * 16;

            container.find('.swiper-container .swiper-slide').css('height', vh * 0.32);
            container.find('.swiper-container .swiper-slide > img').css('height', vh * 0.32);
        }

        function swiperChange(data) {
            var container = data.container;
            var max = container.find('.swiper-pagination > span').length;
            var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

            container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);
        }
    };

    LODGE.initGallerySwiper($('.airevent01 .swiper-container'), {});    //호텔 - 메인 - 하단 기획전 //hotel_main01
    LODGE.initGallerySwiper($('.htDetailTop > .swiper-container:eq(0)'), {viewport: true});   //호텔 - 호텔상세 - 상단비주얼 //hotel_sub03

    //프리모드 스와이프
    LODGE.initFreeSwiper = function (targetContainer, options) {        
        var swiper;

        //중복 방지 초기화
        if (targetContainer.length > 0 && targetContainer.is('.swiper-container-horizontal')) {
            swiper = targetContainer[0].swiper;
            if (swiper !== undefined) swiper.destroy(false, true);    
        }
        
        var opts;
        var defaults = {
            pagination: targetContainer.find('.swiper-pagination'),
            slidesPerView: 1,
            spaceBetween: 0,
            freeMode: true,
            roundLengths: true
        };
        
        targetContainer.each(function (idx) {
            opts = $.extend({}, defaults, options);
            swiper = new Swiper($(this), opts);
        });
    };

    LODGE.initFreeSwiper($('.htDetailTop .icoList'), {slidesPerView: 5.9, slidesOffsetBefore: 7, slidesOffsetAfter: 7});

    //스와이프 리셋
    LODGE.resetSwiper = function (targetContainer) {
        targetContainer.find('.swiper-container-horizontal').each(function () {
            //swiper 초기화
            var swiper = $(this)[0].swiper;
            if (swiper !== undefined) {
                swiper.destroy(false, true);
                new Swiper(swiper.container, swiper.params);
            }
        });
    };
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