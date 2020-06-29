/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2015.11.17
 */

(function (scope) {
    if (scope.TEMP !== undefined) return;

    var TEMP = {
        vendor : {animationend : 'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd'},

        checkFloating : function (target, threshold) {
            var floatingBtn = target;
            var scrollHeight = WDDO.docHeight - threshold;
            var scrollPosition = WDDO.browserHeight + WDDO.scrollYpos;

            if (floatingBtn.length === 0) return false;

            if ((scrollHeight - scrollPosition) / scrollHeight <= 0) {
                if (floatingBtn.hasClass('hide')) return;
                    
                floatingBtn.addClass("hide");
            } else {
                if (!floatingBtn.hasClass('hide')) return;
                    
                floatingBtn.removeClass("hide");
            } 
        },

        setMask : function (_flag, _target) {
            if (_flag) {
                $('body').append('<div id="mask" class="mask"></div>');

                WDDO.disableTouchEvent(_target);
            } else {
                $('#mask').remove();

                WDDO.enableTouchEvent($('body'));
            }
        },

        openDimPop : function (target) {
            var pop = target || $('.popCalender');

            if (pop.length > 0 && pop.hasClass('popCalender')) {
                pop.filter(':last').show();

                WDDO.disableTouchEvent(target);
            }
        },

        closeDimPop : function (target) {
            var pop = target || $('.popCalender');

            if (pop.not(':hidden').length > 0) {
                pop.filter(':last').hide();

                WDDO.enableTouchEvent($('body'));
            }
        },

        openSlidePop : function (target, options) {
            var opts = $.extend({
                source : $(jQuery.fn),
                parent : $('#wrap')
            }, options);

            if (target === undefined) return;

            var popTarget = target;

            popTarget.html(opts.source.html());

            popTarget.css({
                'height' : WDDO.browserHeight,
                'min-height' : WDDO.browserHeight,
                'display' : 'block'
            }).data('st', $(window).scrollTop());

            //setTimeout(function(){
                popTarget.addClass('slide slideUp').one(TEMP.vendor.animationend, function() {
                    opts.parent.hide();
                    $(window).scrollTop(0);
                    popTarget.css('height', 'auto').addClass('show').removeClass('slideUp slide');
                });
            //}, 50);
        },

        closeSlidePop : function (target, options) {
            var opts = $.extend({
                parent : $('#wrap')
            });

            if (target === undefined) return;

            var popTarget = target;

            opts.parent.show();
            popTarget.css('height', WDDO.browserHeight).addClass('slide slideDown').one(TEMP.vendor.animationend, function() {
                popTarget.attr('style', '').removeClass('slideDown slide show').hide();
            });

            if (popTarget.data('st') !== undefined) {
                var st = parseInt(popTarget.data('st'));
                popTarget.removeData('st');

                $(window).scrollTop(st);
            }
        }
    };

    scope.TEMP = TEMP;
})(window);

/**
* Static variables for Mobile
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1
* @since : 2015.12.01
*
* history
*   1.1 (2015.12.16) : docWidht, docHeight 속성 추가 
*/

(function (scope) {
    if (scope.WDDO !== undefined) return;

    var WDDO = {
        browserWidth : 0,
        browserHeight : 0,
        docWidht : 0,
        docHeight : 0,
        scrollYpos : undefined,

        enableTouchEvent : function (_backgroundTarget) {
            var backgroundTarget = (_backgroundTarget === undefined) ? $('body') : _backgroundTarget;

            //스크롤링 활성화
            if (backgroundTarget.data('overflowY') !== undefined) {
                backgroundTarget.css({
                    'overflow-y' : backgroundTarget.data('overflowY')
                }).removeData('overflowY');
            }

            //터치이벤트 한계체크 삭제
            backgroundTarget.off('touchstart.WDDO touchmove.WDDO');
        },

        disableTouchEvent : function (_scrollTarget, _backgroundTarget) {
            var startY = 0;
            var scrollTarget;
            var backgroundTarget = (_backgroundTarget === undefined) ? $('body') : _backgroundTarget;

            //스크롤링 비활성화
            if (backgroundTarget.css('overflow-y') === 'hidden') return;

            backgroundTarget.data({
                'overflowY' : backgroundTarget.css('overflow-y')
            }).css({
                'overflow-y' : 'hidden'
            });

            //터치이벤트 한계체크
            backgroundTarget.on('touchstart.WDDO', function (e) {
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                var target = $(e.target);
                var flag = (target.closest(_scrollTarget).length > 0);

                startY = touch.pageY;
                scrollTarget = (flag) ? $(_scrollTarget).find('.innerScroller') : undefined;
            });

            backgroundTarget.on('touchmove.WDDO', function (e) {
                //console.log('scroll : ' + isScroller);
                if (scrollTarget !== undefined) {
                    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

                    var distance = touch.pageY - startY;    //이동거리
                    var max = maxScrollPos(scrollTarget);   //이동가능한 총 거리
                    var currentPos = getScrollPositions(scrollTarget); //현재 위치

                    //console.log(distance, currentPos, max);
                    if (distance > 0 && currentPos <= 0 ) {
                        //console.log('over up');

                        if (e.cancelable) e.preventDefault();
                    } else if (distance < 0 && max <= 0) {
                        //console.log('over down');

                        if (e.cancelable) e.preventDefault();
                    } else {

                    }
                } else {
                    if (e.cancelable) e.preventDefault();   
                }
            });

            function getScrollMax (_target) {
                return _target.prop('scrollHeight') - _target.prop('clientHeight');
            }

            function getScrollPositions (_target) {
                return _target.scrollTop();
            }

            function maxScrollPos(_target) {
                var target = typeof _target == 'object' ? _target : $(target);
                var max = getScrollMax(target);
                var pos = getScrollPositions(target);
                return max - pos;
            }
        }
    };

    scope.WDDO = WDDO;
})(window);

$(document).ready(function () {
    $('.swiper-container').each(function (idx) {
        var swiper = new Swiper($(this), {
            pagination: $(this).find('.swiper-pagination'),
            loop: true,
            preloadImages: false,
            lazyLoadingInPrevNext: true,
            lazyLoading: true
        });
	});

    $("img.lazy").lazyload({
	    effect : "fadeIn",
        placeholder : "data:image/gif;base64,R0lGODlhkAGQAfeKAO/v7+Dg4Ojo6MLCwtHR0ZSUlKOjo4WFhW5ubrKysnV1dWZmZv7+/vf39/X19fr6+uvr6/v7+/Hx8f39/fDw8Pz8/NbW1vj4+OLi4vT09O7u7unp6fLy8tfX1/n5+c3NzePj4/b29uzs7MTExLOzs9PT07m5ubi4uKGhod/f3/Pz86SkpOXl5eHh4XZ2dqampuTk5LCwsObm5tra2tzc3K2trdDQ0MXFxaCgoMzMzNTU1JmZmZycnNnZ2e3t7WdnZ56enry8vLu7u29vb9vb28/Pz7a2tq+vr4aGhqmpqerq6svLy66ursnJycfHx+fn587OzpOTk8bGxqurq39/f4uLi7W1tZqamtXV1crKyt3d3b29vaqqqpiYmKysrHh4eLe3t6enp3x8fMPDw3R0dKWlpX19fW1tbdLS0qioqMHBwcjIyI+Pj76+vrS0tI6OjoyMjLq6ur+/v3p6enNzc97e3oCAgJ+fn52dnZWVlYiIiNjY2MDAwIqKiomJiY2NjbGxsXl5eXt7e5eXl5CQkHd3d3BwcIKCgpubm////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ZDZmOWU0NS1kZjE3LWE5NGMtYmZhYy0yNjNkODJjN2E5ZjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUExMjQ1MEI5RDQ3MTFFNUI4NjVBNjNGQTZFNDhBRDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUExMjQ1MEE5RDQ3MTFFNUI4NjVBNjNGQTZFNDhBRDkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzM0OGU4ZmMtMDI3YS0yYzQ4LTk5ZDItZTA0NzdiMDY2ZTg3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDhmNzFkMzgtZTE5Ny0xMWU0LTkyNmUtOWMwNjExMzVkZjFiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBQQAigAsAAAAAJABkAEACP8AEwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4seTbq06dOoU6tezbq169ewY8ueTbu27du4c+vezbu379/AgwsfTry48ePIkytfzry58+fQo0ufTr269evYs2vfzr279+/gw4v/H0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5JJMNunkk1BGKeWUVFZp5ZVYZqnlllx26eWXYIYp5phklmnmmWimqeaabLap3AQOUCCBAxO4udEEEgCgJwAS1GknRg3suWcDfy7UwB4YKOSAoHo6oFAEHjDQZglDLLDAHyEgtCijjh7EgAYCCLDBBWs6gICllt6hKaMAdGqQBKGG/7qBpGnagKqlPwRw0KaCukrQA7HGSmqaHdxqqR+0EsTrnr4OBGqwAnigZgRfGLvAEgYt26hBDUArAATJormEtYE8UJC2rRbEAATeEromA35Ya8W5rDabgbcauJnCD8aeQYGy9RI0wQbemusmENbiADCnBMEKrQR/AnCGsT8kKhC6rkbg7QZ+itmADj1EkJAb1k4x0AOsGpwIB95mkBADDYTQMZUWuIAAAlR8EO5AHlR76woEhSBopgOxHCy4CGUAQwABYED0lA3YfPPNb6RwUBPGQlFQBRdcUEFB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",
	});

    //초기화
    initEvent();
    initSlidePop();
    initDimPop();
    initHotel();
    initChecklist();
    initSchedule();
    initPlanning();

    //검색내 검색
    initSearchInSearch();

    //전체메뉴
    TotalMenu.init();

    //여행상품 main_02, 국가/도시 선택 city01
	var productCategoryTab = new WTab();
	productCategoryTab.init({target: $('.main02_cont01'), selector: '> ul > li > a', onTag: 'li'});

    var latestPostsBtn = new WTab();
    latestPostsBtn.init({target: $('.main02_cont02'), selector: '.latelyBtn', onTag: 'a', content: $('.main02_cont02 > .latelyBox'), onlyOpen:false});

	var productLocationToggle = new WTab();
	productLocationToggle.init({target: $('ul.newcityList'), selector: '> li > a', onTag: 'a', onlyOpen:false});

    //일정표 schedule01
    var scheduleTab1 = new WTab();
    scheduleTab1.init({target: $('ul.subTab').not('.tab03'), selector: '> li > a', onTag: 'li', content: $('ul.subTab').not('.tab03').nextAll('div')});

    var scheduleTab2 = new WTab();
    scheduleTab2.init({target: $('ul.subTab').filter('.tab03'), selector: '> li > a', onTag: 'li', content: $('ul.subTab').filter('.tab03').nextAll('div')});

    //고개센터 customer_01 _02
    var customerTab = new WTab();
    customerTab.init({target: $('ul.qnaTab'), selector: '> li > a', onTag: 'li'});

    var customerToggle = new WTab();
    customerToggle.init({target: $('dl.qnaTxt'), selector: '> dt > a', onTag: 'dt', content: $('dl.qnaTxt > dd'), onlyOpen:false});
    customerToggle.setCloseAll();

    //검색내 검색 main_04_sub
    function initSearchInSearch() {
        //검색내 검색 열기 팝업
        $('.newdetBtn > a').on('click.temp', function (e) {
            var target = $(e.currentTarget);
            var pop = target.closest('.newdetBtn').siblings('div.endsearchBox');

            toggleSearchPop(pop.filter(':hidden').length > 0);
        });

        //정렬 select 변경 시 팝업 닫기 
        $('.newdetBtn > .nSelectBox').on('change', 'select', function (e) {
            toggleSearchPop(false);
        });

        function toggleSearchPop(show) {
            var btn = $('.newdetBtn > a');
            var pop = btn.closest('.newdetBtn').siblings('div.endsearchBox');

            if (show) {
                btn.addClass('on');
                pop.show();    
            } else  {
                btn.removeClass('on');
                pop.hide();
            }
        }
    }

    //추천기획전 planning01
    function initPlanning() {
        if ($('.planTab').length > 0) {
            var voteCategoryTab = new WTab();
            voteCategoryTab.init({target: $('.planTab > ul'), selector: '> li > a', onTag: 'li', onlyOpen: true})

            $('.planTab').on('click.temp', '.btnTogg', function (e) {
                var target = $(e.currentTarget);
                var content = target.siblings('ul');

                if (!target.hasClass('on')) {
                    target.addClass('on');
                    content.addClass('open');
                } else {
                    target.removeClass('on');
                    content.removeClass('open');
                }
            });

            $('.planList .startViewBtn').on('click.temp', function (e) {
                TEMP.openDimPop($('.popCalender'));

                e.preventDefault();
            });
        }
    }

    //일정표 schedule01
    function initSchedule() {
        //더보기 
        $('.btnGradi.plus').on('click.temp', function (e) {
            $(this).nextAll('.detailDay').show();

            e.preventDefault();
        });
    }

    //여행전 체크사항 checklist01
    function initChecklist() {
        var checkTab = new WTab();
        checkTab.init({target: $('ul.checkTab'), selector: '>li a', onTag:'li', content: $('ul.checkTab').nextAll('.checkTabCont')});
        checkTab.setCloseAll();
        checkTab.setOpen(0);

        var checklistPopTab = new WTab();
        checklistPopTab.init({target: $('ul.popcheckTab'), selector: '> li > a', onTag: 'a', content: $('ul.popcheckTab').nextAll('.tabCont')});

        var listTab = new WTab();
        listTab.init({target: $('ul.popcheckTab').nextAll('.tabCont').find('.safetyDist01'), selector: 'dt > a', onTag: 'dt', onlyOpen:false});
    }

    //해외호텔 
    function initHotel() {
        //체크인, 체크아웃 main_04
        $('.hotel_searchBox').on('click.temp', '> div > a', function (e) {
            var target = $(e.currentTarget);

            TEMP.openDimPop();

            e.preventDefault();
        });

        //재검색 hotel_view
        $('.hotel_day').on('click.temp', '> a', function (e) {
            var target = $(e.currentTarget);
            var cont = target.siblings('div.endsearchBox');

            target.toggleClass('on');
            cont.toggle();

            e.preventDefault();
        });

        //체크인, 체크아웃
        $('div.endsearchBox').on('click.temp', '> div > a.btnselRed', function (e) {
            TEMP.openDimPop();

            e.preventDefault();
        });

        //특별할인 이벤트 
        $('.specialEvent > a').removeClass('on').on('click.temp', function (e) {
            var target = $(e.currentTarget);

            target.toggleClass('on');

            e.preventDefault();
        });

        //전체 요금 보기 
        $('.chargeList').on('click.temp', '> a.btnGradi', function (e) {
            var target = $(e.currentTarget);

            target.toggleClass('on').closest('.chargeList').toggleClass('open');

            e.preventDefault();
        });
    }

    //슬라이드 팝업 초기화 travel_paper, main_04
    function initSlidePop() {
        $('a[href^="#"]').filter(function () {
            return $(this).attr('href').length > 1
        }).on('click', function (e) {
            var target = $(this).attr('href');
            var popTarget = $('#overlayPanel');

            TEMP.openSlidePop(popTarget, {source:$(target)});

            popTarget.one('click.temp', '.closeOverlayPanel', function (e) {
                TEMP.closeSlidePop(popTarget);

                e.preventDefault();
            });

            e.preventDefault();
        });
    }

    //딤 팝업 초기화 planning01, main_04 //기준이 없기때문에 오픈은 각 초기화 함수에서.. 초기 히든과 닫기만 본 함수에서 처리
    function initDimPop() {
        $('.popCalender').hide();

        $('.popCalender').on('click.temp', '.cal_closeBtn', function (e) {
            var target = $(e.currentTarget);
            var pop = target.closest('.popCalender');

            TEMP.closeDimPop(pop);

            e.preventDefault();
        });
    }



    function initEvent() {
        $(window).on('scroll.temp', function (e) {
            WDDO.scrollYpos = (document.documentElement.scrollTop !== 0) ? document.documentElement.scrollTop : document.body.scrollTop;

            scoll();
        }).triggerHandler('scroll.temp');

        $(window).on('resize.temp', function (e) {
            if (WDDO.browserWidth === $(window).width() && WDDO.browserHeight === $(window).width()) return false;
            WDDO.browserWidth = $(window).width();
            WDDO.browserHeight = $(window).height();
            WDDO.docWidht = $(document).width();
            WDDO.docHeight = $(document).height();

            resize();
        }).triggerHandler('resize.temp');

        $('.scrollTop').on('click.temp', function (e) {
            $(window).scrollTop(0);
        }); 
    }

    //스크롤
    function scoll() {
        TEMP.checkFloating($(".fixSdBtn"), 410);
    }

    //리사이즈
    function resize(){}
});

/**
* 전체메뉴
*
* TotalMenu.init(options);
*
* @param options            ::: 설정 Object 값
*
* options
*   key:type = value        //설명
*
* method
*   TotalMenu.init(options);    //초기화
*/
var TotalMenu = (function ($) {
    var scope,
        wrapDIV,
        menuDIV,
        menuBtnA,
        menuMaskDIV,
        opts,
        defaults = getDefaultOption(),
        init = function (options) {
            opts = $.extend(defaults, options);

            wrapDIV = $('div#wrap');
            menuDIV = $('div#menuPanel');
            menuBtnA = $('a#btnMenu');
            menuMaskDIV = menuDIV.find('div.innerScroller');

            if (menuDIV.length > 0 && menuDIV.data('scope') === undefined) {
                menuDIV.data('scope', scope);

                initLayout();
                initEvent();
            }
        };

    function getDefaultOption() {
        return {
            
        };
    }

    function initLayout() {
        menuMaskDIV.css('height', WDDO.browserHeight);
    }

    function initEvent() {
        menuBtnA.on('click.TotalMenu', function (e) {
            var target = $(e.currentTarget);

            TEMP.setMask(true, $("#menuPanel"));

            menuMaskDIV.css('height', WDDO.browserHeight);

            menuDIV.addClass("slideIn").addClass("slideLeft");

            $("#mask, .closeSlide").one("click.TotalMenu", function (e) {
                menuDIV.removeClass("slideIn").removeClass("slideLeft");

                TEMP.setMask(false, $("#menuPanel"));

                e.preventDefault();
            });

            e.preventDefault();
        });
    }

    return {
        init: function (options) {
            scope = this;

            init(options);
        }
    };
}(jQuery));

/**
* 하나투어 jQuery UI 기반 슬라이드 :: 인라인 초기화
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.0
* @since : 2015.12.04
*
* history
*
* HT_JQUI_WRangeSlider.init(target, options);
*
* @param target             ::: slider 타깃 설정
* @param options            ::: 설정 Object 값
*
* options
*   key:type = value        //설명
*
* method
*   HT_JQUI_WRangeSlider.init(target, options);    //초기화
*/
var HT_JQUI_WRangeSlider = (function ($) {
    var scope,
        container,
        opts,
        defaults = getDefaultOption(),
        init = function (target, options) {
            opts = $.extend(defaults, options);

            container = target;

            if (container.length > 0 && !container.hasClass('ui-slider')) {
                container.data('scope', scope);

                initCallback();
                initLayout();
                initEvent();
            }
        };

    function getDefaultOption() {
        return {
            range: true,
            values: [0, 0],
            min: 0,
            max: 0,
            slide: function(e, ui) {
                var slider = $(e.target);

                changeText(ui.values[0], ui.values[1]);
            }
        };
    }

    function changeText(_min, _max) {
        var min = String(_min).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        var max = String(_max).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

        container.siblings('div').find('> span:eq(0)').text(min + '원');
        container.siblings('div').find('> span:eq(1)').text(max + '원');
    }

    function initCallback() {
        
    }

    function initLayout() {
        container.slider(opts);
        changeText(container.slider('values', 0), container.slider('values', 1));
    }

    function initEvent() {
        
    }

    return {
        init: function (target, options) {
            scope = this;

            init(target, options);
        }
    };
}(jQuery));

/**
* 하나투어 jQuery UI 기반 달력 :: 인라인 초기화
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.0.1
* @since : 2015.12.04
*
* history
*   1.0.1 (2015.12.16) : 외부 레이아웃 수정 가능한 addUpdate, addEvent 옵션 추가
*
* HT_JQUI_WCalendar.init(target, options);
*
* @param target             ::: datepicker 타깃 설정
* @param options            ::: 설정 Object 값
*
* options                   ::: jquery ui datepicker 옵션 기반
*   addUpdate:Function = function (container) {}        //레이아웃 업데이트 확장 함수
*   addEvent:Function = function (container) {}         //이벤트 확장 함수
*
* method
*   HT_JQUI_WCalendar.init(target, options);    //초기화
*/
var HT_JQUI_WCalendar = (function ($) {
    var scope,
        container,
        isMulti = false,
        holidays = ['1-1', '3-1', '5-1', '5-5', '6-6', '8-15', '10-3', '10-9', '12-25'],
        lunardays = ['2014-1-30', '2014-1-31', '2014-2-1', '2014-5-6', '2014-9-7', '2014-9-8', '2014-9-9', '2015-2-18', '2015-2-19', '2015-2-20', '2015-5-25', '2015-8-14', '2015-9-26', '2015-9-27', '2015-9-28', '2016-2-8', '2016-2-9', '2016-5-14', '2016-2-10', '2016-9-14', '2016-9-15', '2016-9-16', '2017-1-27', '2017-1-28', '2017-1-29', '2017-5-3', '2017-10-3', '2017-10-4', '2017-10-5', '2018-2-15', '2018-2-16', '2018-2-17', '2018-5-22', '2018-9-23', '2018-9-24', '2018-9-25', '2019-2-4', '2019-2-5', '2019-2-6', '2019-5-12', '2019-9-12', '2019-9-13', '2019-9-14', '2020-1-24', '2020-1-25', '2020-1-26', '2020-4-30', '2020-9-30', '2020-10-1', '2020-10-2'],
        opts,
        defaults = getDefaultOption(),
        init = function (target, options) {
            opts = $.extend(defaults, options);

            isMulti = ($.isArray(opts.numberOfMonths) && opts.numberOfMonths.length > 0 && opts.numberOfMonths[0] > 1)
            container = target;

            if (container.length > 0 && !container.hasClass('hasDatepicker')) {
                container.data('scope', scope);

                initCallback();
                initLayout();
                initEvent();
            }
        };

    function getDefaultOption() {
        return {
            //numberOfMonths: [4, 1],
            //minDate: '+1d',
            dateFormat: 'yy-mm-dd',
            showMonthAfterYear: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            dayNames: ['일', '월', '화', '수', '목', '금', '토'],
            dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
            yearSuffix: '.',
            beforeShowDay: function (date) {
                var holiday = (checkHoliday(date) || checkLunarday(date))? 'holiday' : '';

                switch (date.getDay()) {
                    case 0: //일요일
                        result = [showDate(date), holiday + ' sun'] ;
                        break;
                    case 6: //토요일
                        result = [showDate(date), holiday + ' sat'];
                        break;
                    default:
                        result = [showDate(date), holiday];
                }

                return result;
            },
            addUpdate : undefined,
            addEvent : undefined
        };
    }

    function checkLunarday(date) {
        var day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

        return $.inArray(day, lunardays) > -1;
    }

    function checkHoliday(date) {
        var day = (date.getMonth() + 1) + '-' + date.getDate();
        
        return $.inArray(day, holidays) > -1;
    }

    function showDate(date) {
        return (opts.extendBeforeShowDay !== undefined) ? opts.extendBeforeShowDay(date) : true;
    }

    function initCallback() {
        //feb. mar. apr. may. jun. jul. aug. sep. oct. nov. dec

        container.on('update.wddo', function (e) {
            if (opts.addUpdate !== undefined) opts.addUpdate(container);

            var datepicker = (isMulti) ? $(this).find('.ui-datepicker-group') : $(this);

            //타이틀에 연월 간격 삭제
            datepicker.find('.ui-datepicker-title').each(function (idx) {
                $(this).contents().eq(1).replaceWith('.');
            });  
        });

        container.on('complete.wddo', function (e) {
            claerSelect();
        })
    }

    function initLayout() {
        if (container.datepicker !== undefined) container.datepicker(opts);
    }

    function initEvent() {
        if (opts.addEvent !== undefined) opts.addEvent(container);
    }

    function claerSelect() {
        container.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day').find('> a').removeClass('ui-state-active ui-state-highlight ui-state-hover');
    }

    function changeDate(_date) {
        var ins = container.data('datepicker');

        ins.currentYear = _date.getFullYear();
        ins.currentMonth = _date.getMonth();
        ins.currentDay = _date.getDate();
    }

    function selectAll(group) {
        claerSelect();

        container.find('td.on').removeClass('on'); //멀티 달력끼리 중복 on 방지
        group.find('a').parent().addClass('on'); //해당 달력 모두 활성화 
    }

    return {
        init: function (target, options) {
            scope = this;

            init(target, options);
        },

        setClaer: function () {
            claerSelect();
        },

        setSelect: function (_date) {
            changeDate(_date);

            container.datepicker('refresh');
        },

        setSelectAll: function (_date) {
            container.find('.ui-datepicker-group').each(function () {
                var yearStr = $(this).find('.ui-datepicker-year').text();
                var monthStr = parseInt($(this).find('.ui-datepicker-month').text()).toString();
                
                if (yearStr === String(_date.getFullYear()) &&  monthStr === String(_date.getMonth()+1)) {
                    changeDate(_date);

                    selectAll($(this));
                }
            });
        }
    };
}(jQuery));

/********************************************************************************************/
/****************************************** Method ******************************************/
/********************************************************************************************/

/**
* WTab - 토글탭
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.2.1
* @since : 2015.11.09
*
* history
*   1.2 (2015.12.10) : setNext(), setPrev(), opts.onClass 추가 
*   1.2.1 (2015.12.11) : getOptions() 추가
*
* var instance = new WTab();
* instance.init(options);                   //초기화
*
* @param options    ::: 설정 Object 값
*
* options
*   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
*   selector:String = 'li > a';             //on() 두번째 인자의 셀렉터
*   onTag:String = 'li'                     //on 클래스를 적용 할 태그 셀렉션 String
*   onClass:String = 'on'                   //on 클래스 명
*   onlyOpen:Boolean = true                 //비 중복 활성화 유무
*   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
*   onChange:Function = fun(event)          //텝 변경 콜백함수
*   onChangeParams:Array = []               //텝 변경 콜백함수 인자
*
* method
*   .setCloseAll()                          //모두 닫기
*   .setOpen(idx)                           //열기
*   .setCallback(change, param)             //콜백 설정
*   .setNext()                              //다음
*   .setPrev()                              //이전
*   .getOptions()                           //옵션객체 반환
*/
var WTab = (function ($) {
    var wddoObj = function (options) {
        var scope,
            targetA,
            content,
            opts,
            defaults = getDefaultOption(),
            init = function (options) {
                opts = $.extend(defaults, options);

                targetA = (opts.selector === '') ? opts.target : opts.target.find(opts.selector);
                content = opts.content;

                //targetA의 on에 의해 content 오픈 이므로 onlyOpen = true
                if (content.length === 0 && opts.onlyOpen === undefined) {
                    opts.onlyOpen = true;  
                }

                //onlyOpen 초기값 설정
                if (opts.onlyOpen === undefined) opts.onlyOpen = true;

                if (targetA.length > 0 && opts.target.data('scope') === undefined) {
                    opts.target.data('scope', scope);

                    addIdx();
                    initLayout();
                    initEvent();
                }
            };

        function getDefaultOption() {
            return {
                target : $(jQuery.fn),
                selector : '',
                onTag : 'li',
                onClass : 'on',
                onlyOpen : undefined,
                content : $(jQuery.fn),
                onChange : undefined,
                onChangeParams : []
            };
        }
         
        function initLayout() {

        }

        function initEvent() {
            if (opts.selector === '') {
                opts.target.on('click.WTab', btnListener);    
            } else {
                opts.target.on('click.WTab', opts.selector, btnListener);
            }
            
            function btnListener(e) {
                var target = $(e.currentTarget);

                if (target.data('idx') === undefined) reset();

                var idx = parseInt(target.data('idx'));
                var onTag = (opts.onTag === 'a') ? target : target.closest(opts.onTag);

                //console.log("onTag.hasClass('on')" , onTag.hasClass('on'));
                //console.log("opts.onlyOpen" , opts.onlyOpen);
                if (onTag.hasClass(opts.onClass)) {
                    //열려있는 것 클릭 시 
                    if (opts.onlyOpen) {
                        //하나만 활성화, 닫지 않음

                    } else {
                        //동시 활성화, 닫음                         
                        btnOff(idx);
                        close(idx);
                    }
                } else {
                    //닫혀있는 것 클릭 시 
                    if (opts.onlyOpen) {
                        //하나만 활성화, 열려있는 것 모두 닫고 열기
                        btnOff();
                        close();
                        btnOn(idx);
                        open(idx);
                    } else {
                        //동시 활성화, 열려있는 것 유지
                        btnOn(idx);
                        open(idx)
                    }
                }

                if (opts.onChange !== undefined) opts.onChange.apply(this, [{target: target, idx: idx, content: content.eq(idx), params: opts.onChangeParams}]);
                opts.target.trigger('change.WTab', [{target: target, idx: idx, content: content.eq(idx), params: opts.onChangeParams}]);

                e.preventDefault();
                e.stopPropagation();
            }
        }

        function addIdx() {
            targetA.each(function (idx) {
                $(this).data('idx', idx);
            });
        }

        function reset() {
            targetA = $(targetA.selector);
            content = $(content.selector);

            addIdx();
        }

        function btnOn(idx) {
            var target = (idx === undefined) ? targetA : targetA.eq(idx);
            var onTag = (opts.onTag === 'a') ? target : target.closest(opts.onTag);

            onTag.addClass(opts.onClass);
        }

        function btnOff(idx) {
            var target = (idx === undefined) ? targetA : targetA.eq(idx);
            var onTag = (opts.onTag === 'a') ? target : target.closest(opts.onTag);

            onTag.removeClass(opts.onClass);
        }

        function close(idx) {
            var target = (idx === undefined) ? content : content.eq(idx);
            
            target.hide();
        }
        
        function open(idx) {
            var target = (idx === undefined) ? content : content.eq(idx);

            target.show();
        }

        function checkIdx(idx) {
            return Math.max(Math.min(idx, targetA.length - 1), 0);
        }
        
        return {
            init: function (options) {
                scope = this;

                init(options);
            },

            setCloseAll: function () {
                btnOff();
                close();
            },

            setOpen: function (idx) {
                btnOn(idx);
                open(idx);
            },

            setCallback: function (change, param) {
                opts.onChange = change;
                if (param !== undefined) opts.onChangeParams = param;
            },

            setNext: function () {
                var currentIdx = parseInt(targetA.closest('.' + opts.onClass).data('idx'));
                var nextIdx = checkIdx(currentIdx + 1);

                if (!isNaN(currentIdx)) targetA.eq(nextIdx).trigger('click.WTab');
            },

            setPrev: function () {
                var currentIdx = parseInt(targetA.closest('.' + opts.onClass).data('idx'));
                var prevIdx = checkIdx(currentIdx - 1);

                if (!isNaN(currentIdx)) targetA.eq(prevIdx).trigger('click.WTab');
            },

            getOptions: function () {
                return opts;
            }
        };
    };

    return wddoObj;
}(jQuery));

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };

/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.3
 *
 */
(function(c,b,a,e){var d=c(b);c.fn.lazyload=function(f){var h=this;var i;var g={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:true,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};function j(){var k=0;h.each(function(){var l=c(this);if(g.skip_invisible&&!l.is(":visible")){return}if(c.abovethetop(this,g)||c.leftofbegin(this,g)){}else{if(!c.belowthefold(this,g)&&!c.rightoffold(this,g)){l.trigger("appear");k=0}else{if(++k>g.failure_limit){return false}}}})}if(f){if(e!==f.failurelimit){f.failure_limit=f.failurelimit;delete f.failurelimit}if(e!==f.effectspeed){f.effect_speed=f.effectspeed;delete f.effectspeed}c.extend(g,f)}i=(g.container===e||g.container===b)?d:c(g.container);if(0===g.event.indexOf("scroll")){i.bind(g.event,function(){return j()})}this.each(function(){var k=this;var l=c(k);k.loaded=false;if(l.attr("src")===e||l.attr("src")===false){if(l.is("img")){l.attr("src",g.placeholder)}}l.one("appear",function(){if(!this.loaded){if(g.appear){var m=h.length;g.appear.call(k,m,g)}c("<img />").bind("load",function(){var o=l.attr("data-"+g.data_attribute);l.hide();if(l.is("img")){l.attr("src",o)}else{l.css("background-image","url('"+o+"')")}l[g.effect](g.effect_speed);k.loaded=true;var n=c.grep(h,function(q){return !q.loaded});h=c(n);if(g.load){var p=h.length;g.load.call(k,p,g)}}).attr("src",l.attr("data-"+g.data_attribute))}});if(0!==g.event.indexOf("scroll")){l.bind(g.event,function(){if(!k.loaded){l.trigger("appear")}})}});d.bind("resize",function(){j()});if((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)){d.bind("pageshow",function(k){if(k.originalEvent&&k.originalEvent.persisted){h.each(function(){c(this).trigger("appear")})}})}c(a).ready(function(){j()});return this};c.belowthefold=function(g,h){var f;if(h.container===e||h.container===b){f=(b.innerHeight?b.innerHeight:d.height())+d.scrollTop()}else{f=c(h.container).offset().top+c(h.container).height()}return f<=c(g).offset().top-h.threshold};c.rightoffold=function(g,h){var f;if(h.container===e||h.container===b){f=d.width()+d.scrollLeft()}else{f=c(h.container).offset().left+c(h.container).width()}return f<=c(g).offset().left-h.threshold};c.abovethetop=function(g,h){var f;if(h.container===e||h.container===b){f=d.scrollTop()}else{f=c(h.container).offset().top}return f>=c(g).offset().top+h.threshold+c(g).height()};c.leftofbegin=function(g,h){var f;if(h.container===e||h.container===b){f=d.scrollLeft()}else{f=c(h.container).offset().left}return f>=c(g).offset().left+h.threshold+c(g).width()};c.inviewport=function(f,g){return !c.rightoffold(f,g)&&!c.leftofbegin(f,g)&&!c.belowthefold(f,g)&&!c.abovethetop(f,g)};c.extend(c.expr[":"],{"below-the-fold":function(f){return c.belowthefold(f,{threshold:0})},"above-the-top":function(f){return !c.belowthefold(f,{threshold:0})},"right-of-screen":function(f){return c.rightoffold(f,{threshold:0})},"left-of-screen":function(f){return !c.rightoffold(f,{threshold:0})},"in-viewport":function(f){return c.inviewport(f,{threshold:0})},"above-the-fold":function(f){return !c.belowthefold(f,{threshold:0})},"right-of-fold":function(f){return c.rightoffold(f,{threshold:0})},"left-of-fold":function(f){return !c.rightoffold(f,{threshold:0})}})})(jQuery,window,document);

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
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if($.ui===undefined)return;if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */