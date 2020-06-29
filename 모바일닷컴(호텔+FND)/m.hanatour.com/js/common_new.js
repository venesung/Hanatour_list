/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 2.1.4
 * @since : 2015.11.03
 *
 * history
 * 
 * 1.0   (2015.11.03) : 
 * 2.0   (2016.05.23) : 모바일 메인 개편에 의한 수정 적용
 * 2.0.1 (2016.08.04) : openLoadPop(options) 에서 options 인자를 openSlidePop() 과 closeSlidePop() 에 두번째 인자로 전달하도록 수정
 * 2.0.2 (2016.09.01) : 공통으로 사용하는 initToggle(), initHrefPopup() 추가 pb_toggle, pb_hrefpopup 클래스 대응, WTab > WToggle 변경
 * 2.0.3 (2016.09.22) : openSlidePop에 opts.browserHeight 옵션 받도록 추가(ios9 vh 문제때문), 슬라이드 완료 이벤트에 .dotcom 네임 스페이스 추가하고 one을 on으로 변경
 * 2.0.4 (2016.11.16) : fixedFixToggle(), innerScrollToggle() 추가하여 팝업생성 오픈시 내부 스크롤이동 대응, 'open.loadpop, close.loadpop' trigger() 전 off()하여 직전 이벤트 삭제
 *                      initToggle() 중복 초기화 방지
 * 2.0.5 (2017.01.12) : lnb 2016 온박 디자인 토대로 수정
 * 2.0.6 (2017.03.31) : openLoadPop()에 의해 생성된 팝업이 삭제되지 않은 상태에서 다중 발생 시 닫기 버튼에 대한 이벤트 중복된 정의 방지
 * 2.0.7 (2017.04.17) : setMask() 3번째 옵션 인자 추가 
 * 2.0.8 (2017.04.20) : 슬라이드 팝업 정리
 * 2.0.9 (2017.07.28) : hash 슬라이드 팝업 추가, 팝업 닫기버튼 이벤트 중복발생 수정, closeSlidePop() opts.remove 추가
 *                      initToggle() initHrefPopup() 인자로 container 받도록 수정, 외부 호출 가능하도록 DOTCOM 오브젝트 확장
 * 2.1.0 (2017.08.21) : 이중팝업 찌꺼기 삭제, 백스페이스시 #값 없으면 팝업에 닫기버튼 클릭이벤트 발생시켜 닫기
 * 2.1.1 (2017.09.01) : WToggle 2.0.4 업데이트, jQuery 확장 함수 setInstance, searchInstance, removeInstance 추가, 공통UI verticalArrowTab 추가
 * 2.1.2 (2017.12.01) : changeAct 다른 스와이프 메뉴도 적용토록 확장성 강화
 * 2.1.3 (2017.12.15) : 도시검색 컨텐츠 로직 추가, initHeader() 삭제 예정으로 주석처리, initSearch() 결과상단탭 페이지 이동기능이라 탭기능 삭제, global-swiper SwiperTemplate와 연결
 *                      initEvent() 내부에 WDDO.docWidth, WDDO.docHeight 정의, documentsize 라이브러리 추가
 * 2.1.4 (2017.12.27) : initHrefPopup() 에서 DOTCOM.openLoadPop 옵션 parent 확장성을 위해 div[data-role="page"] 가 없으면 undefined 를 통해 openSlidePop()의 기본값 $('#wrap') 지정 토록 수정
 */

(function (scope) {
    if (scope.DOTCOM !== undefined) return;

    //iscroll.carousel 에서 추출
    if (scope.ANI_EV === undefined) {
        var dummyStyle = document.createElement('div').style;
        var vendor = (function () {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })();

        scope.ANI_EV = (function () {
            if (vendor === false) return false;

            var animationEnd = {
                ''          : 'webkitAnimationEnd',
                'webkit'    : 'webkitAnimationEnd',
                'Moz'       : 'AnimationEnd',
                'O'         : 'oAnimationEnd',
                'ms'        : 'MSAnimationEnd'
            };

            return animationEnd[vendor];
        })();
    }

    //#overlayPanel 이 transform 클래스인 slideUp, slideDown 을 물고 있음 (아래서 위로 올라오는 팝업.. 항공, DOTCOM.openLoadPop 에서 사용)
    var DOTCOM = {
        isBlockingHash : false, //add 2.0.9 .. 단순 hash 변경만 하고 'hashchange' 이벤트를 통해 openLoadPop() 안타도록 하는 변수
        //DOTCOM.setMask() flag 를 이용해 토글 하고, pop 이 #overlayPanel이 아니면 body .ui-page 안에 딤(#mask .mask) 추가
        //flag:Boolean - 딤 적용 유무
        //pop:Object - 인자로 넘기는 이유는 pop 안에 .innerScroller 를 컨트롤 스크롤로 지정 하기위함.. flag가 false 이거나 innerScroller 컨트롤 안할거면 필요 없음
        setMask : function (flag, pop, options) {
            var opts = $.extend({}, {parent: $('body .ui-page')}, options);
            if (flag) {
                if(pop !== '#overlayPanel'){
                    opts.parent.append('<div id="mask" class="mask"></div>'); //$('body .ui-page').append 에서 opts.parent.append 로 변경 //modify 2.0.7

                    if (pop !== undefined) WDDO.setDisableEvent(pop.find('.innerScroller'));
                }
            } else {
                $('#mask').remove();

                WDDO.setEnableEvent($('body'));
            }
        },

        //html 소스를 붙여 넣어 슬라이드 형태로 등장 시키는 팝업 열기
        openSlidePop : function (target, options) {
            var opts = $.extend({
                source : $(jQuery.fn),
                parent : $('#wrap'),
                browserHeight : WDDO.browserHeight //add 2.0.3
            }, options);

            if (target === undefined) return;

            var popTarget = target;

            if (opts.source.length > 0) popTarget.html(opts.source.html()); //팝업 내부에 내용 삽입

            opts.parent.attr('data-parenttop', $(window).scrollTop()); //배경위치 저장 //add 2.0.8

            setTimeout(function() { //trigger('open.loadpop'.. 보다 느리기 위한(초기화등..처리 이후 등장을 위한)
                popTarget.addClass('slide slideUp').on(ANI_EV + '.dotcom', function(e) { //one > on //modify 2.0.3 //등장모션이 완료되는 시점
                    opts.parent.hide();         //팝업 뒤편으로 깔린 화면 숨김
                    $(window).scrollTop(0);     //내부 스크롤이 생겼으므로 자체 스크롤은 0으로 초기화

                    //아래 innerScrollToggle(popTarget, false)에서의 if문을 안 탈수도 있으니 height:auto 조정
                    //display:block; 을 물고있는 'slideUp' 클래스가 빠지기 때문에 display:block; 은 'show' 클래스가 유지시켜줌
                    popTarget.css('height', 'auto').addClass('show').removeClass('slideUp slide').off(ANI_EV + '.dotcom');
                    
                    //오픈후
                    innerScrollToggle(popTarget, false);
                    fixedFixToggle(popTarget, false);
                    openSwapScroll(popTarget, false);

                    popTarget.trigger('open.slidepop', opts); 
                });

                //오픈중
                //.slideUp 에 css display:block 물려 있으므로 그 이후에 아래 로직 실행되야 내부스크롤 정상적으로 이동됨
                innerScrollToggle(popTarget, true);
                fixedFixToggle(popTarget, true);
                openSwapScroll(popTarget, true);
            }, 50);
        },
        
        //html 소스를 붙여 넣어 슬라이드 형태로 등장 시키는 팝업 닫기
        closeSlidePop : function (target, options) {
            var opts = $.extend({
                parent : $('#wrap'),
                remove : false       //add 2.0.9 닫으면 팝업 마크업 삭제
            }, options);

            if (target === undefined) return;

            var popTarget = target;

            popTarget.attr('data-scrolltop', $(window).scrollTop()); //닫기 전 재오픈시 참조할 스크롤값 저장

            opts.parent.show(); //숨겨둔 팝업 뒷편 영역 보임

            //아래 innerScrollToggle(popTarget, ture)에서의 if문을 안탈수도 있으니 css('height' 미리 조정
            popTarget.css('height', WDDO.browserHeight).addClass('slide slideDown').on(ANI_EV + '.dotcom', function() {
                //닫은후
                innerScrollToggle(popTarget, false);
                fixedFixToggle(popTarget, false);
                closeSwapScroll(popTarget, opts.parent, false);

                popTarget.attr('style', '').removeClass('slideDown slide show').off(ANI_EV + '.dotcom');

                popTarget.trigger('close.slidepop', opts); 

                if (opts.remove || popTarget.attr('id') !== 'overlayPanel') popTarget.remove(); //add 2.0.9 overlayPanel1~ 이면 삭제 (2중 팝업은 'data-scrolltop' 지원안함)
            });

            //닫는중
            //닫기 전 내부스크롤 형태로 변경
            innerScrollToggle(popTarget, true);
            fixedFixToggle(popTarget, true);
            closeSwapScroll(popTarget, opts.parent, true);

            popTarget.off('click.closeBtn'); //add 2.0.9 .. .on() 직전 .off() 정상적으로 작동안해 여기서 삭제
        },

        //opts.effect 시 openSlidePop(), closeSlidePop() 를 호출 하도록 되어있음
        openLoadPop : function (options) {
            if (DOTCOM.isBlockingHash) return; //add 2.0.9 .. 2중팝업 닫을 때 'hashchange' 안타도록

            var pop,
                source,
                oldpop,
                defaults = getDefaultOption(),
                opts = $.extend({}, defaults, options);

            function getDefaultOption() {
                return {
                    class : 'slidepopup', //add 2.0.9
                    url : undefined,
                    effect : 'slide'
                };
            }

            load();

            function open() {
                oldpop = $('.'+ opts.class).not(':hidden').filter(':last'); //add 2.0.9

                initLayout();
                initEvent();
                
                if (oldpop.length > 0) { //add 2.0.9
                    pop.attr('data-oldpop', oldpop.attr('id'));

                    pop.one(ANI_EV + '.dotcom', function (e) {
                        oldpop.removeClass('show');
                    });
                }

                if (opts.effect === 'slide') DOTCOM.openSlidePop(pop, opts); //modify 2.0.1

                //callback
                //$('body').off('close.loadpop'); //항상 걸려있는 이벤트도 존재하므로 삭제하면 안되어 주석처리함 //추가로 이벤트를 걸때는 $('body .slidepopup').on('close.loadpop') 으로
                pop.trigger('open.loadpop', opts); //항상 사라있는 공통이벤트는 $('body').on('open.loadpop', '#overlayPanel', function (e, data) { console.log(data); }); 로 걸어야함
            }

            function initLayout() {
                //팝업이 있으면 셀렉트하고 없으면 생성
                //add 2.0.9 .. oldpop 갯수를 이용하여 겹지지 않는 overlayPanel id 적용, opts.class 추가    
                pop = ( $('#overlayPanel' + (oldpop.length === 0 ? '' : oldpop.length)).length > 0 ) ? $('#overlayPanel') : $('<div id="overlayPanel' + (oldpop.length === 0 ? '' : oldpop.length) + '" class="'+ opts.class +'">');

                if (opts.remove) $('.'+ opts.class).not('#overlayPanel').remove(); //add 2.1.0 이중팝업 찌꺼기 삭제

                $('body').append(pop);

                checkUrl(); //add 2.0.8

                if (source !== undefined) pop.html(source);
            }

            function initEvent() {
                //팝업 내부 닫기버튼 & hash #을 변경된 경우
                pop.on('click.closeBtn', '.closeOverlayPanel', function (e) {
                    var target = $(e.currentTarget);

                    if (opts.effect === 'slide') DOTCOM.closeSlidePop(pop, opts); //modify 2.0.1

                    if (pop.attr('data-oldpop') !== undefined) { //add 2.0.9.. 2중팝업 상황에서 이전팝업 배경에 유지상태에서 닫기 모션 위한 로직
                        var oldpop = $('#' + pop.attr('data-oldpop'));

                        if (oldpop.length > 0) {
                            oldpop.addClass('show'); 
                            opts.parent.hide();

                            //hashchange 이벤트 발생없이 해쉬 변경
                            DOTCOM.isBlockingHash = true;
                            location.hash = '#' + oldpop.attr('data-url');
                            setTimeout(function () {DOTCOM.isBlockingHash = false;}, 50);
                        }
                    } else {
                        location.hash = '#'; //팝업 열리지 않은 최초 상태로 해쉬 변경, 'hashchange' 이벤트 발생되지만 위 closeSlidePop()에 의해 이미 닫힌상태
                    }

                    //callback
                    //$('body').off('open.loadpop'); //항상 걸려있는 이벤트도 존재하므로 삭제하면 안되어 주석처리함 //추가로 이벤트를 걸때는 $('body .slidepopup').on('open.loadpop') 으로
                    pop.trigger('close.loadpop', opts); //항상 사라있는 공통이벤트는  $('body').on('open.loadpop', '#overlayPanel', function (e, data) { console.log(data); }); 로 걸어야함
                });
            }

            //url 통해 같은 팝업 오픈시 스크롤 유지
            function checkUrl() {
                var urlstr = opts.url;//.replace(/[^\w+]/g, ''); //확장자 구분 . 삭제 
                var url = pop.attr('data-url');

                if (urlstr !== url) pop.removeAttr('data-scrolltop');

                pop.attr('data-url', urlstr);
            }

            function load() {
                $.ajax({
                    type: "GET",
                    url: opts.url,
                    dataType: "text",
                    success: function(data){
                        //console.log('success : ' + data);
                        source = data;

                        open();
                    },
                    error: function(xhr, option, error){
                        //console.log('xhr : ' + xhr + ', option : ' + option + ', error : ' + error);
                    }
                });
            }

            // html string 중에서 <script></script> 를 모두 제거
            function removeScriptTagFromHtmlStr(strHtml) {
                var scriptIdx = strHtml.indexOf('<script');
                while(scriptIdx > -1 ){
                    if( scriptIdx == 0 ){
                        strHtml = strHtml.substring(strHtml.indexOf('\</script\>') + 9);
                    }else{
                        strHtml = strHtml.substring(0,scriptIdx) + strHtml.substring(strHtml.indexOf('\</script\>') + 9);
                    }
                    scriptIdx = strHtml.indexOf('<script');
                }  
                return strHtml;
            }
        },

        //해쉬를 이용한 openLoadPop() 팝업 //add 2.0.9
        //if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);
        locationHashChanged : function () {
            if (window.location.hash.length > 1) {
                var loadURL = window.location.hash.substring(1);
                
                if (DOTCOM !== undefined && typeof DOTCOM.openLoadPop !== 'undefined') {
                    DOTCOM.openLoadPop({
                        target : $(document.activeElement),
                        url : loadURL,
                        parent : $(document.querySelector('body > #wrap')),
                        remove : true
                    });    
                }
            } else {
                $('.slidepopup[data-url]').not(':hidden').filter(':last').find('.closeOverlayPanel').trigger('click.closeBtn'); //add 2.1.0.. 백스페이스시 #값 없으면 팝업찾아 닫기
            }
        }
    };

    //css3 transform 시 팝업내에 position:fixed 버그 우회 //add 2.0.4
    function fixedFixToggle (target, isTransition) {
        var isPopupScroll = (target.height() >= WDDO.browserHeight); //modify 2.0.8 // = 으로 하면 isTransition = true 후 WDDO.browserHeight와 target.height() 같아져 false 가 안타므로 >= 로 변경 

        if (isPopupScroll) {
            if (isTransition) {
                var fixedTarget = target.find('div[data-fixedfix]').filter(function () {return $(this).css('position') === 'fixed'}); //modify 2.1.0 'div' => 'div[data-fixedfix]'
                var offsetTop, top;
                var st = target.attr('data-scrolltop') || 0;

                fixedTarget.each(function () {
                    offsetTop = $(this).offset().top;
                    $(this).css({
                        'position': 'absolute',
                        'top' : ((target.hasClass('slideUp')) ? offsetTop - WDDO.browserHeight - $(window).scrollTop() + st : offsetTop)
                    })
                }).addClass('slidePop-fixed').removeAttr('data-fixedfix'); //add 2.1.0 .removeAttr('data-fixedfix');
            } else {
                target.find('.slidePop-fixed').css({
                    'position': '',
                    'top' : ''
                }).removeClass('slidePop-fixed').attr('data-fixedfix'); //add 2.1.0 //isTransition 인자 true 적용 시 모든 position fixed 검색하지 않고 data-fixedfix 만 걸러 검색토록 수정
            }
        }
    }

    //스크롤링 되야할 크기이면 내부 스크롤 생성하여 초기 스크롤 위치 조절 할수 있도록 레이아웃 변경 //add 2.0.4
    function innerScrollToggle (target, isTransition) {
        var isPopupScroll = (target.height() >= WDDO.browserHeight); //modify 2.0.8 // = 으로 하면 isTransition = true 후 WDDO.browserHeight와 target.height() 같아져 false 가 안타므로 >= 로 변경 
        
        if (isPopupScroll) {
            if (isTransition) { //팝업이 모션이 진행 중인 상황
                //팝업 내 스크롤 준비
                target.css({
                    'height' : WDDO.browserHeight,
                    'overflow-y' : 'auto'
                });
            } else { //팝업이 모션이 끝난 상황 
                //팝업에 저장된 스크롤정보와 팝업 내 스크롤 없앰
                target.css({
                    'height' : 'auto',
                    'overflow-y' : ''
                });
            }
        }
    }

    //팝업 data-scrolltop > 내부스크롤 > 윈도우스크롤 전환 //add 2.0.8
    function openSwapScroll (target, isTransition) {
        var st = target.attr('data-scrolltop');

        if (st !== undefined) {
            if (isTransition) { // 열리는 모션중 팝업 스크롤
                target.scrollTop(st);
            } else { //열리는 모션끝나고 팝업 스크롤
                $(window).scrollTop(st);
                target.removeAttr('data-scrolltop'); //정보 삭제, 닫을때 재저장
            }
        }
    }

    //팝업 윈도우스크롤 > 내부스크롤 > 윈도우스크롤 전환 //add 2.0.8
    function closeSwapScroll (target, parent, isTransition) {
        var st = parent.attr('data-parenttop');

        if (st !== undefined) {
            if (isTransition) { //닫는 모션중 배경 위치
                target.scrollTop($(window).scrollTop());                    //내부 팝업 스크롤 유지
                setTimeout(function () { $(window).scrollTop(st); }, 1);    //배경 스크롤 복구
            } else { //닫는 모션 끝
                parent.removeAttr('data-parenttop');
            }
        }
    }

    scope.DOTCOM = DOTCOM;
})(window);

/**
* Static variables for Mobile
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1.1
* @since : 2015.12.01
*
* history
*   1.1 (2015.12.16) : docWidht, docHeight 속성 추가 
*   1.1.1 (2016.02.12) : enableTouchEvent, disableTouchEvent 을 setEnableEvent, setDisableEvent 로 변경
*/

(function (scope) {
    if (scope.WDDO !== undefined) return;

    var WDDO = {
        browserWidth : 0,
        browserHeight : 0,
        docWidht : 0,
        docHeight : 0,
        scrollYpos : undefined,

        setEnableEvent : function (bt) {
            var backgroundTarget = (bt === undefined) ? $('body') : bt;

            //스크롤링 활성화
            if (backgroundTarget.data('overflowY') !== undefined) {
                backgroundTarget.css({
                    'overflow-y' : backgroundTarget.data('overflowY')
                }).removeData('overflowY');
            }

            //터치이벤트 한계체크 삭제
            backgroundTarget.off('touchstart.WDDO touchmove.WDDO');
        },

        setDisableEvent : function (st, bt) {
            var startY = 0;
            var scrollTarget;
            var backgroundTarget = (bt === undefined) ? $('body') : bt;

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
                var flag = (target.closest(st).length > 0);

                startY = touch.pageY;
                scrollTarget = (flag) ? $(st) : undefined;
            });

            backgroundTarget.on('touchmove.WDDO', function (e) {
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

            function getScrollMax (target) {
                return target.prop('scrollHeight') - target.prop('clientHeight');
            }

            function getScrollPositions (target) {
                return target.scrollTop();
            }

            function maxScrollPos(target) {
                var target = typeof target == 'object' ? target : $(target);
                var max = getScrollMax(target);
                var pos = getScrollPositions(target);
                return max - pos;
            }
        }
    };

    scope.WDDO = WDDO;
})(window);

$(document).ready(function () {
    //공통 스와이프
    initSwiper();

    //공통 Event
    initEvent();

    //공통 UI
    //initHeader(); //del 2.1.3
    initLnb();
    initTopBtn();
    initToggle();
    initHrefPopup();

    //컨텐츠 Script
    initSearch();       //통합검색
    initSearchCity();   //도시검색

    //공통 기본형 swiper
    function initSwiper() {
        if (typeof Swiper === 'undefined') return;

        /* //del 2.1.3
        $('.global-swiper').each(function (idx) {
            var swiper = new Swiper($(this), {
                pagination: $(this).find('.swiper-pagination'),
                loop: (($(this).find('.swiper-slide').length > 1) ? true : false),
                preloadImages: false,
                lazyLoadingInPrevNext: true,
                lazyLoading: true
            });
        });
        */

        new SwiperTemplate().initGallerySwiper($('.global-swiper'), {}); //add 2.1.3
    }

    //이벤트 초기화
    function initEvent() {
        try {
            $(document).on('scroll.dotcom', function (e) {
                try {
                    WDDO.scrollYpos = (document.documentElement.scrollTop !== 0) ? document.documentElement.scrollTop : document.body.scrollTop;

                    WDDO.docWidth = $.documentWidth();      //add 2.1.3
                    WDDO.docHeight = $.documentHeight();    //
                } catch (e) {}
            }).triggerHandler('scroll.dotcom');

            $(window).on('resize.dotcom', function (e) {
                if (WDDO.browserWidth === $.windowWidth() && WDDO.browserHeight === $.windowHeight()) return false;

                WDDO.browserWidth = $.windowWidth();        //modify 2.1.3 $(window).width() -> $.windowWidth()
                WDDO.browserHeight = $.windowHeight();      //

                resize();
            }).triggerHandler('resize.dotcom');

            $('.scrollTop').on('click.dotcom', function (e) {
                $(window).scrollTop(0);
            });

        } catch (e) {}
    }
    
    //해더 GNB 영역
    /* //del 2.1.3
    function initHeader() {
         //common.js 와 중복 방지 //common.js 에서 사용한 innerScroller 변수가 있고 #gnb 에 siwper-continer 클래스가 없으면 구버전으로 간주하여 아래 로직 사용 안함
        if (typeof innerScroller !== 'undefined' && ($('#gnb').length > 0 && !$('#gnb').hasClass('swiper-container'))) return;

        //기존 버튼 액션 삭제
        $('#btnMenu').off('click');
        $('#btnMyhome').off('click');

        var oldTotalMenu = $('#menuPanel'); //신규 개편 토탈메뉴
        var TotalMenu = $('#menuPanel02');  //이전 구버전 토탈메뉴
        var contentWrapper = $('#wrap');    //컨텐츠 전체 컨테이너

        //바둑판 메뉴들
        TotalMenu.on('click', '.hanaMenuList > ul.topList > li > a', function (e) {
            var target = $(e.currentTarget);
            var li = target.closest('li');
            var idx = li.index();

            if (li.hasClass('on')) {
                TotalMenu.find('ul.topList > li').removeClass('on'); //버튼 전부 비활성화
                TotalMenu.find('.innerMenuBox > ul').removeClass('open'); //컨텐츠 전부 비활성화
            } else {
                TotalMenu.find('ul.topList > li').removeClass('on'); //버튼 전부 비활성화
                TotalMenu.find('.innerMenuBox > ul').removeClass('open'); //컨텐츠 전부 비활성화

                li.addClass('on');
                target.closest('ul').next('.innerMenuBox').find('> ul').eq(idx).addClass('open');                
            }

            e.preventDefault();
        });

        //전체메뉴 열기
        $('#btnMenu').on('click.dotcom', function (e) {
            //신규 전체메뉴
            if (TotalMenu.length > 0) {
                TotalMenu.find('.innerScroller').scrollTop(0); //스크롤 상단으로 초기화
                TotalMenu.css('display', 'block');

                setTimeout(function () {
                    TotalMenu.addClass('open');
                }, 5);
                contentWrapper.addClass('slideLeft'); //뒤 컨텐츠 밀림
            } else {
            //구버전
                oldTotalMenu.addClass('slideIn'); //메뉴 등장
                contentWrapper.addClass('slideLeft'); //뒤 컨텐츠 밀림
            }

            DOTCOM.setMask(true, TotalMenu); //마스킹
            
            //닫기
            $('#mask, .closeSlide').one('click.dotcom', function (e) {
                //신규 전체메뉴
                if (TotalMenu.length > 0) {
                    TotalMenu.removeClass('open');
                    contentWrapper.removeClass('slideLeft'); //뒤 컨텐츠 밀림 돌아오기
                } else {
                //구버전
                    oldTotalMenu.removeClass('slideIn'); //메뉴 복귀
                    contentWrapper.removeClass('slideLeft'); //뒤 컨텐츠 밀림 돌아오기
                }

                DOTCOM.setMask(false);

                e.preventDefault();
            });

            e.preventDefault();
        });

        //닫히는 모션 끝나면 숨기기
        TotalMenu.on('transitionend webkitTransitionEnd', function (e) {
            if (!TotalMenu.hasClass('open')) {
                TotalMenu.css('display', 'none');
            }
        });

        function matrixToArray(str){
            return str.split( '(')[ 1].split( ')')[ 0].split( ',') ;
        };

        // 마이메뉴
        $('#btnMyhome').on('click.dotcom', function (e) {
            DOTCOM.setMask(true, $('#userPanel'));

            $('#userPanel').addClass('slideIn');
            $('#wrap').addClass('slideRight');

            $('#mask, .closeSlide').one('click.dotcom', function (e) {
                $('#userPanel').removeClass('slideIn');
                $('#wrap').removeClass('slideRight');
                DOTCOM.setMask(false);

                e.preventDefault();
            });

            e.preventDefault();
        });
    }
    */

    //로케이션 네비게이션 바
    function initLnb() {
        if (typeof Swiper === 'undefined') return;

        var swiper = new Swiper('#gnb', {
            slidesPerView: 'auto',
            simulateTouch: false,
            spaceBetween: 0,
            freeMode: true,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 45,
            /*resistanceRatio: 0,*/
            wrapperClass: 'gnb-wrapper',
            slideClass: 'gnb-slide',
            onInit: function () {
                $('#gnb').addClass('nextShadow');
            },
            onProgress: function (data, progress) {
                if (progress <= 0) {
                    $('#gnb').removeClass('prevShadow').addClass('nextShadow');
                } else if (progress >= 1) {
                    $('#gnb').removeClass('nextShadow').addClass('prevShadow');
                } else {
                    $('#gnb').addClass('nextShadow prevShadow');
                }
            }
        });

        $('#gnb').on('click', '> ul > li > a', function (e) {
            var target = $(e.currentTarget);
            var idx = target.parent().index();

            $('#gnb').changeAct(idx);

            e.preventDefault();
        });

        //add 2.0.5
        var totalMenuDIV = $('div.allDepBox');
        $('a.btn_navAll').on('click.dotcom', function (e) {
            var target = $(e.currentTarget);

            target.toggleClass('on');
            totalMenuDIV.toggle();

            e.preventDefault();
        });

        //활성화 변경 jQuery 확장
        if ($.fn.changeAct === undefined) {
            $.fn.changeAct = function (idx) {                
                this.find('> ul > li').removeClass('on').eq(idx).addClass('on');

                if (this.hasClass('swiper-container')) {
                    var swiper = this[0].swiper; //인스턴트 반환
                    var activate = (this.is('nav#gnb')) ? idx - 1 : idx; //메인의 네비게이션 왼쪽에 그림자 때문에 첫번째로 이동하면 가리므로 활성화 idx -1

                    swiper.slideTo(Math.max(activate, 0));

                    if (this.is('nav#gnb') && totalMenuDIV.length > 0) totalMenuDIV.find('ul > li').removeClass('on').eq(idx).addClass('on'); //add 2.0.5

                    if ($.fn.getInstance !== undefined) { //add 2.1.2
                        var toggle = this.getInstance();
                        toggle.setCloseAll();
                        toggle.setOpen(activate);
                    }
                }
            };
        }
    }

    //홈, 패키지, 국내여행 - 오른 하단 플로팅메뉴 탑버튼
    function initTopBtn() {
        var topBtn = $('#topBtn01');
        var quickObj = $('.quickDimBox');

        if (topBtn.length === 0) return;
        
        var footer = $('.newFoot');
        if (footer.length == 0)  {
            footer = $('.common_copyright_btmMenu'); // 구버전 Footer
        }
        if (footer.length == 0)  {
            footer = $('#commonArea_footer'); // 통합 Footer
        }
        var fHeight = footer.height();
        var topBtnAreaHeight = /*topBtn.height()*/47 + parseInt(topBtn.css('bottom'));

        $(window).on('scroll.topbtn', function(e) {
            $(window).trigger('scroll.dotcom');

            var st = WDDO.scrollYpos;
            var scrollPosition = $(window).height() + st;

            //브라우저 높이 + 스크롤위치 > 하단 영역 + 동동이상단부터 여백높이
            if (st <= 0 || WDDO.browserHeight + st > footer.offset().top + topBtnAreaHeight) {
                topBtn.removeClass('on');
                quickObj.removeClass("topPosi");
            } else {
                topBtn.addClass('on');
                quickObj.addClass("topPosi");
            }
        });
    }

    //공통 toggle //add 2.0.2
    function initToggle(container) {
        var con = container || $('body'); //add 2.0.9
        var targetDIV = con.find('div.pb_toggle');

        //일반 공통 토글
        var tab;
        targetDIV.each(function () {
            var target = $(this);

            if (typeof target.getInstance !== 'undefined' && target.getInstance() !== undefined) return; //add 2.0.4 //중복방지

            tab = new WToggle();
            tab.init({target: target, selector: '> .tabList > li > a', onTag: 'li', onClass: 'on', content: target, contentSelector: '> div.tabCont'});
        });

        //상화 화살표 아코디언 메뉴
        var verticalArrowTab = new WToggle();
        verticalArrowTab.init({target: con, selector: 'button.btn_toggle', onTag: 'button', onClass: 'on', onlyOpen:false, onChangeStart: function (data) {
            var target = data.target;
            var cont = target.parent().next('div');
            var h3 = target.closest('h3');
            
            var sw = !target.is('.on');

            cont.toggle(sw);
            h3.toggleClass('close', !sw);
        }});

        //약관전용 아코디언 메뉴
        var termsArrowTab = new WToggle();
        termsArrowTab.init({target: con, selector: 'button.termsTog', onTag: 'button', onClass: 'open', onlyOpen:false, onChangeStart: function (data) {
            //open 클래스로 css 컨트롤
            /*
            var target = data.target;
            var cont = target.parent().next('div.in_termsScrBox');
            var sw = !target.is('.open');

            cont.toggle(sw);
            */
        }});

        //미니팝업
        var tooltip = new WTooltip();
        tooltip.init({
            target : con,
            selector : 'button.cm_miniBtn',
            content : con,
            contentSelector : 'div.cm_miniPop_cont',
            closeClass : 'cm_miniClose',
            isContentEvent: true,
            onOpen : function (data) {
                data.btn.addClass('on');
            },
            onClose : function (data) {
                data.btn.removeClass('on');
            }
        });

    }

    if (DOTCOM !== undefined && typeof DOTCOM.initToggle === 'undefined') DOTCOM.initToggle = initToggle; //add 2.0.9

    //공통 페이지 로드 슬라이드 팝업 //add 2.0.2
    function initHrefPopup(container) {
        var con = container || $('body'); //add 2.0.9
        var linkTagA = con.find('a.pb_hrefpopup');

        linkTagA.on('click', function (e) {
            var target = $(e.currentTarget);
            var loadURL = $(this).attr('href');
        
            DOTCOM.openLoadPop({
                target : target,
                url : loadURL,
                parent : ($('body > div[data-role="page"]').length > 0) ? $('body > div[data-role="page"]') : undefined
                //data-role='page' 인 div 가 팝업 열리면 display:none 처리 의미, 기본값 #wrap //modify 2.1.4
            });

            e.preventDefault();
        });
    }

    if (DOTCOM !== undefined && typeof DOTCOM.initHrefPopup === 'undefined') DOTCOM.initHrefPopup = initHrefPopup; //add 2.0.9

    //컨텐츠 : 통합검색
    function initSearch() {
        //여행지 검색 input
        var searchInput= $('.integ_search > .inputBox > input');
        var searchInputContainer = $('.integ_search > .inputBox');

        if (searchInput.length === 0 || searchInputContainer.length === 0) return;

        searchInputContainer.on('mousedown.dotcom', 'a', function (e) {
            var target = $(e.currentTarget);
            searchInput.val('').focus();

            e.preventDefault();
        });

        //통합검색 탭
        var totalSearchTab = new WToggle();
        totalSearchTab.init({target: $('.searchBox > ul.searchTab > li > a'), onTag: 'li', content: $('.searchBox > ul.searchTab').nextAll('div.searchCont')});

        //통합검색 결과 상단 탭 //del 2.1.3
        //var totalSearchKindTab = new WToggle();
        //totalSearchKindTab.init({target: $('ul.searEndTab > li > a'), onTag: 'li'});

        //통합검색 카테고리 탭
        var totalSearchCategoryTab = new WToggle();
        totalSearchCategoryTab.init({target: $('.categoryBox > ul.cateTab > li > a'), onTag: 'li', onlyOpen: false, onChange: function (obj) {
            var idx = obj.idx;
            var ul = $('.categoryBox > ul.cateTab');
            var li = ul.find('> li');
            var content = ul.nextAll('div');

            li.not(':eq(' + idx + ')').removeClass('on');

            var isOpen = (li.filter('.on').length > 0);

            if (isOpen) {
                ul.addClass('open');
                content.hide().eq(idx).show();
            } else {
                ul.removeClass('open');
                content.hide();
            }
        }});
    }

    //컨텐츠 : 도시검색 
    function initSearchCity() {
        //최근 검색 버튼
        var lastSearchBtn = $('.majorCity_select').find('button.btn_latest');
        lastSearchBtn.on('click.dotcom', function (e) {
            var target = $(e.currentTarget);
            var content = target.parent().next('.latestList');
            var sw = !target.hasClass('on');

            target.toggleClass('on', sw);
            content.toggle(sw);

            e.preventDefault();
        });
    }

    // 리사이즈
    function resize(){
        // 좌우측 메뉴 Resize
        //$('#menuPanel .innerScroller').css('height', WDDO.browserHeight); //del 2.1.3
        //$('#userPanel .innerScroller').css('height', WDDO.browserHeight); //del 2.1.3

        //$('#menuPanel02').css('transform' , 'translateX(' + (($('.mask').length > 0) ? 100 : 0) + '%)' );
    }

    
});

/********************************************************************************************/
/****************************************** Method ******************************************/
/********************************************************************************************/

//https://github.com/hashchange/jquery.documentsize#window-size
(function(g){var k,F,l,x,h,q=!!window.getComputedStyle;g.documentWidth=function(H){var I;H||(H=document);try{if(x===undefined){D()}I=H[x].scrollWidth}catch(J){I=s("Width",H)}return I};g.documentHeight=function(I){var H;I||(I=document);try{if(x===undefined){D()}H=I[x].scrollHeight}catch(J){H=s("Height",I)}return H};g.windowWidth=function(H,I){var e=v(arguments);return y("Width",e)};g.windowHeight=function(H,I){var e=v(arguments);return y("Height",e)};g.pinchZoomFactor=function(e){return j(e)};g.scrollbarWidth=C;function y(P,J){var Q,M,I,N,L,S,e=J.window,H=C()!==0,O=J.useLayoutViewport&&P==="Width",K=H||!t()||O,R=K?e.document.documentElement["client"+P]:w(P,e);if(J.useLayoutViewport&&!K){M=R;I=j(e,{asRange:true});R=Math.round(M*I.calculated);if(!c()){Q=e.document.documentElement.clientHeight;L=(M-1)*I.min;S=(M+1)*I.max;N=(R<=Q+3&&R>=Q-3)||(L<=Q&&S>=Q&&S<Q+30);if(N){R=Q}}}return R}function j(N,e){var M,I,H=e&&e.asRange,K=(N||window).visualViewport&&(N||window).visualViewport.scale,L={calculated:K||1,min:K||1,max:K||1},J=C()!==0||!t()||K;if(!J){N||(N=window);M=N.document.documentElement.clientWidth;I=G(N);L.calculated=M/I;if(H){if(c()){L.min=L.max=L.calculated}else{L.min=M/(I+1);L.max=M/(I-1)}}}return H?L:L.calculated}function v(J){var e,I,H,L=window,K=true;if(J&&J.length){J=Array.prototype.slice.call(J);e=A(J[0]);if(!e){J[0]=E(J[0])}I=!e&&J[0];if(!I){J[1]=E(J[1])}H=!I&&J[1];if(e){L=J[0];if(H&&J[1].viewport){K=f(J[1].viewport)}}else{if(I){if(J[0].viewport){K=f(J[0].viewport)}if(A(J[1])){L=J[1]}}else{if(!J[0]&&J[1]){if(H&&J[1].viewport){K=f(J[1].viewport)}else{if(A(J[1])){L=J[1]}}}}}}return{window:L,useVisualViewport:K,useLayoutViewport:!K}}function f(H){var e=n(H)&&H.toLowerCase();if(H&&!e){throw new Error("Invalid viewport option: "+H)}if(e&&e!=="visual"&&e!=="layout"){throw new Error("Invalid viewport name: "+H)}return e==="visual"}function E(e){return(n(e)&&e!=="")?{viewport:e}:e}function t(){if(F===undefined){F=G()>10}return F}function C(){var e;if(k===undefined){e=document.createElement("div");e.style.cssText="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -500px; left: -500px; margin: 0px; padding: 0px; border: none;";document.body.appendChild(e);k=e.offsetWidth-e.clientWidth;document.body.removeChild(e)}return k}function D(){var J,I,M,H,K=B(),e=K&&K.contentDocument||document,L=e.body,N=e!==document;I=e.createElement("div");I.style.cssText="width: 1px; height: 1px; position: relative; top: 0px; left: 32000px;";if(!N){J=d()}M=L.scrollWidth;L.appendChild(I);H=M!==L.scrollWidth;L.removeChild(I);if(!N){p(J)}x=H?"documentElement":"body";if(K){document.body.removeChild(K)}}function B(){var H=document.createElement("iframe"),e=document.body;H.style.cssText="position: absolute; top: -600px; left: -600px; width: 500px; height: 500px; margin: 0px; padding: 0px; border: none; display: block;";H.frameborder="0";e.appendChild(H);H.src="about:blank";if(!H.contentDocument){return}H.contentDocument.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title></title><style type="text/css">html, body { overflow: hidden; }</style></head><body></body></html>');return H}function d(){var H,M,Q=document.documentElement,K=document.body,L=q?window.getComputedStyle(Q,null):Q.currentStyle,O=q?window.getComputedStyle(K,null):K.currentStyle,I=(L.overflowX||L.overflow||"visible").toLowerCase(),P=(O.overflowX||O.overflow||"visible").toLowerCase(),J=P!=="hidden",N=I==="visible",e={documentElement:{modified:N},body:{modified:J}};if(N){H=Q.style;e.documentElement.styleOverflowX=H.overflowX;H.overflowX="auto"}if(J){M=K.style;e.body.styleOverflowX=M.overflowX;M.overflowX="hidden"}return e}function p(e){if(e.documentElement.modified){document.documentElement.style.overflowX=e.documentElement.styleOverflowX}if(e.body.modified){document.body.style.overflowX=e.body.styleOverflowX}}function s(I,e){var H=e.documentElement;return Math.max(H.body["scroll"+I],e["scroll"+I],H.body["offset"+I],e["offset"+I],e["client"+I])}function G(e){return w("Width",e)}function i(e){return w("Height",e)}function w(H,I){var e=(I||window).visualViewport?(I||window).visualViewport[H.toLowerCase()]:(I||window)["inner"+H];if(e){a(e)}return e}function a(e){if(!l&&b(e)){l=true}}function c(){return !!l}function A(e){return e!=null&&e.window==e}function n(e){return typeof e==="string"||e&&typeof e==="object"&&Object.prototype.toString.call(e)==="[object String]"||false}function o(H){var e=typeof H==="number"||H&&typeof H==="object"&&Object.prototype.toString.call(H)==="[object Number]"||false;return e&&H===+H}function b(e){return e===+e&&e!==(e|0)}function m(){var H,e;if(h===undefined){h=false;H=navigator&&navigator.userAgent;if(navigator&&navigator.appName==="Microsoft Internet Explorer"&&H){e=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");if(e.exec(H)!=null){h=parseFloat(RegExp.$1)}}}return h}function u(){var e=m();return e&&e<8}function r(){return m()===9}if(typeof g==="function"&&!u()&&!r()){try{g(function(){if(x===undefined){D()}C()})}catch(z){}}}(typeof jQuery!=="undefined"?jQuery:typeof Zepto!=="undefined"?Zepto:$));


/*!
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.4.0
 * @since : 2016.03.03
 *
 * history
 *
 * 1.0   (2016.03.03) : -
 * 1.1   (2016.04.18) : 리스트형태의 컨텐츠의 경우 여러 인스턴트 생성하지 않고 한개로 여러개 컨트롤 하도록 함, 서버개발과 타이밍 문제 해결
 * 1.2   (2016.05.19) : target 과 content 의 빠른 마우스 이동시 fade 에 의한 opacity 트윈중 중간에서 멈춰 버리는 증상 수정
 * 1.3   (2016.08.23) : data('idx') 를 data('tooltip-idx') 로 변경, 스크롤(overlfow:hidden) 내부영역 영향 받지 않도록 opts.dynamic 추가, 관련 옵션(dynamicScrollClass, dynamicPopClass) 추가
 *                      툴팁 내부 닫기버튼 대응토록 opts.closeClass 추가
 *                      content 마우스 이벤트 받지 않도록 설정할 수 있는 opts.isContentEvent 추가
 * 1.3.1 (2017.07.25) : targetA.length 선행체크로 opts.selector 에 의미가 없어져 삭제함
 *                      .setInstance() 적용, targetA, content 변수 삭제하고 getTarget(), getContent() 로 대체
 * 1.4.0 (2017.09.04) : dynamic 아니더라도 닫기버튼 적용토록 수정, 모바일 대응 (hasTouch)
 *                      opts.tipClass 추가, opts.onOpen, opts.onClose 추가
 *
 ********************************************************************************************
 ***************************************** WTooltip ******************************************
 ********************************************************************************************
 *
 * 1. content 마우스 오버시 유지 되는 툴팁 형태 (opts.isContentEvent: false 으로 content(fade 효과 없어짐) 마우스 오버기능 삭제 가능하도록 1.3에 수정됨)
 * 2. 버튼타겟 안에 팝업컨테츠 가 있으면 안된다.
 * 
 * var instance = new WTooltip();
 * instance.init(options);                   //초기화
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
 *   selector:String = 'li > a'              //on() 두번째 인자의 셀렉터
 *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
 *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
 *   delay:Number = 300                      //마우스 반응 딜레이 0.3초
 *   speed:Number = 100                      //등장&퇴장 속도 0.1초
 *   dynamic: false                          //스크롤 속 툴팁 대응(overflow:hidden) 유무
 *   dynamicScrollClass = 'sc_laypop_tool'   //overflow:hidden 대상 div
 *   dynamicPopClass = 'sc_laypop_txt'       //dynamic:true 따른 생성되는 툴팁 클래스명
 *   closeClass = 'close'                    //툴팁 속 닫기 버튼 클래스명
 *   isContentEvent = true                   //툴팁 마우스 이벤트 유무(false 시 fade효과 자동 삭제됨)
 *   tipClass = 'tooltip'                    //툴팁 기본 클래스
 *   onOpen:Function = function (data) {}    //열기 콜백 함수
 *   onClose:Function = function (data) {}   //닫기 콜백 함수
 *
 * method
 */
;var WTooltip=(function(b){var a=function(e){var d,c,r,p,s=typeof window.ontouchstart!=="undefined",k,i=n(),q=function(y){k=b.extend(i,y);if(k.target.searchInstance("tooltip")===undefined){k.target.setInstance(d);if(!k.isContentEvent){k.delay=k.speed=0}f();o();h()}};function n(){return{target:b(b.fn),selector:"",content:b(b.fn),contentSelector:"",delay:200,speed:100,dynamic:false,dynamicScrollClass:"sc_laypop_tool",dynamicPopClass:"sc_laypop_txt",closeClass:"close",isContentEvent:true,tipClass:"tooltip",onOpen:undefined,onClose:undefined}}function o(){}function h(){if(k.selector===""){k.target.on((!s?"mouseenter.tooltip":"click.tooltip"),z);k.target.on("mouseleave.tooltip",y)}else{k.target.on((!s?"mouseenter.tooltip":"click.tooltip"),k.selector,z);k.target.on("mouseleave.tooltip",k.selector,y)}function z(F){g();var E=b(F.currentTarget);var C=x();if(E.data("tooltip-idx")===undefined){v()}var A=c;c=parseInt(E.data("tooltip-idx"));if(A===c){l()}var D=C.not(":hidden");if(D.data("hit")===undefined&&A!==c){m(C.not(":hidden"))}var B=C.eq(c);B.addClass(k.tipClass);if(B.data("toooltip-idx")===undefined){B.data("toooltip-idx",c)}if(k.dynamic){u(B);B=b("."+k.dynamicPopClass)}else{B.on("click.tooltip","."+k.closeClass,function(G){l();m(B);G.preventDefault()})}if(B.is(":animated")){B.clearQueue().stop().show()}j(B)}function y(D){var C=b(D.currentTarget);var B=x();if(C.data("tooltip-idx")===undefined){v()}c=parseInt(C.data("tooltip-idx"));var A=B.eq(c);if(k.dynamic){A=b("."+k.dynamicPopClass)}A.removeClass(k.tipClass);l();r=setTimeout(function(){if(!A.data("hit")&&!A.is(":hidden")){m(A)}},k.delay)}}function l(){if(r!==undefined){clearTimeout(r);r=undefined}}function g(){if(p!==undefined){clearTimeout(p);p=undefined}}function f(){t().each(function(y){b(this).data("tooltip-idx",y)})}function v(){f()}function j(z){if(k.speed===0){z.clearQueue().stop().show()}else{z.clearQueue().stop().filter(function(){return parseInt(z.css("opacity"))!==1}).fadeOut(0);z.fadeIn(k.speed)}z.off("mouseenter.tooltip mouseleave.tooltip");if(k.isContentEvent){z.on("mouseenter.tooltip",function(A){z.off("mouseenter.tooltip");b(this).data("hit",true)});z.on("mouseleave.tooltip",function(A){z.off("mouseleave.tooltip");g();z.removeData("hit");p=setTimeout(function(){m(z)},k.delay)})}if(s){b(document).on("touchmove.tooltip",function(A){if(b(A.target).closest("."+k.tipClass).length>0){return}l();m(z)})}var y=z.data("toooltip-idx");if(k.onOpen!==undefined){k.onOpen({btn:t().eq(y),tooltip:z,idx:y})}}function m(z){z.off(".tooltip");b(document).off("touchmove.tooltip");if(k.speed===0){z.clearQueue().stop().show().hide().removeData("hit");if(k.dynamic){w(z)}}else{z.clearQueue().stop().show().fadeOut(k.speed,function(){if(k.dynamic){w(z)}}).removeData("hit")}var y=z.data("toooltip-idx");if(k.onClose!==undefined){k.onClose({btn:t().eq(y),tooltip:z,idx:y})}}function u(y){b("."+k.dynamicPopClass).remove();y.css("display","block");var z=b('<div class="'+k.dynamicPopClass+'">');z.css({position:"absolute",top:y.offset().top,left:y.offset().left,width:y.outerWidth(),height:y.outerHeight()});b("body").append(z);z.append(y.clone());if(k.isContentEvent){z.on("click.tooltip","."+k.closeClass,function(A){m(z);A.preventDefault()});t().closest("."+k.dynamicScrollClass).on("scroll.tooltip",function(A){b(this).off("scroll.tooltip");m(z)})}y.css("display","none")}function w(y){t().closest("."+k.dynamicScrollClass).off("scroll.tooltip");b("."+k.dynamicPopClass).remove()}function t(){return(k.selector==="")?k.target:k.target.find(k.selector)}function x(){return(k.contentSelector==="")?k.content:k.content.find(k.contentSelector)}return{init:function(y){d=this;q(y)}}};return a}(jQuery));

/*!
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 2.0.5
 * @since : 2015.11.09
 *
 * history
 *
 * 1.2   (2015.12.10) : setNext(), setPrev(), opts.onClass 추가 
 * 1.2.1 (2015.12.11) : getOptions() 추가
 * 1.3   (2016.04.18) : opts.onlyOpen = true 기본값 고정, otps.contentSelector 추가
 * 2.0   (2016.05.16) : init()시 opts.selector 가 없어도 초기화 될수 있도록 수정
 * 2.0.1 (2017.01.25) : addIdx() 1회 최소실행 추가, setNext(), setPrev() idx 반환 수정, opts.repeat 추가
 * 2.0.2 (2017.05.16) : btnListener()에 onClass 삽입 전 상황을 전달할 콜백 함수 opts.onChangeStart 추가
 *                      opts.setCallback 삭제하고 확정성을 위해 opts.getOptions 추가, opts.onChangeParams 삭제
 * 2.0.3 (2017.08.11) : opts.mustClose 추가
 * 2.0.4 (2017.09.01) : opts.onTag 의 자신이 버튼구별 기준을 a 태그를 뿐만아니라 button 도 포함
 *                      setInstance() 적용
 * 2.0.5 (2017.09.05) : ins.getIndex() 추가
 * 
 ********************************************************************************************
 ***************************************** WToggle ******************************************
 ********************************************************************************************
 *
 * var instance = new WToggle();
 * instance.init(options);                   //초기화
 *
 * @param options    ::: 설정 Object 값
 *
 * options
 *   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
 *   selector:String = 'li > a'              //on() 두번째 인자의 셀렉터
 *   onTag:String = 'li'                     //on 클래스를 적용 할 태그 셀렉션 String
 *   onClass:String = 'on'                   //on 클래스 명
 *   onlyOpen:Boolean = true                 //비 중복 활성화 유무
 *   mustClose:Boolean = false               //onlyOpen:true에 활성화 클릭시 닫을지 유무
 *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
 *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
 *   onChange:Function = fun(event)          //텝 변경 콜백함수
 *   onChangeStart:Function = fun(event)     //텝 변경 직전 콜백함수 
 *   behavior:Boolean = false                //기본 비헤이비어 삭제 유무, 기본은 막음
 *   repeat:Boolean = false                  //setNext(), setPrev() 시 무한 반복 유무
 *
 * method
 *   .setCloseAll()                          //모두 닫기
 *   .setOpen(idx)                           //열기
 *   .setNext()                              //다음 메뉴 활성화
 *   .setPrev()                              //이전 메뉴 활성화
 *   .getOptions()                           //옵션 반환
 *   .getIndex()                             //인덱스 반환
 */
;var WToggle=(function(b){var a=function(r){var p,i,c,e=d(),o=function(s){c=b.extend(e,s);if(c.target.length>0){if(b.fn.setInstance!==undefined){c.target.setInstance(p)}h();q()}};function d(){return{target:b(b.fn),selector:"",onTag:"li",onClass:"on",onlyOpen:true,mustClose:false,behavior:false,content:b(b.fn),contentSelector:"",onChange:undefined,onChangeStart:undefined}}function h(){}function q(){if(c.selector===""){c.target.on("click.toggle",s)}else{c.target.on("click.toggle",c.selector,s)}l();function s(w){var v=b(w.currentTarget);l();i=j(c.content,c.contentSelector);var t=parseInt(v.data("toggle-idx"));var u=(c.onTag==="a"||c.onTag==="button")?v:v.closest(c.onTag);if(c.onChangeStart!==undefined){c.onChangeStart.apply(this,[{target:v,idx:t,content:i.eq(t)}])}c.target.trigger("changestart.toggle",[{target:v,idx:t,content:i.eq(t)}]);if(u.hasClass(c.onClass)){if(c.onlyOpen){if(c.mustClose){g(t);n(t)}}else{g(t);n(t)}}else{if(c.onlyOpen){g();n();k(t);f(t)}else{k(t);f(t)}}if(c.onChange!==undefined){c.onChange.apply(this,[{target:v,idx:t,content:i.eq(t)}])}c.target.trigger("change.toggle",[{target:v,idx:t,content:i.eq(t)}]);if(!c.behavior){w.preventDefault();w.stopPropagation()}}}function l(){j(c.target,c.selector).each(function(s){b(this).data("toggle-idx",s)})}function j(t,s){return(s!==""&&s!==undefined)?t.find(s):t}function k(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a"||c.onTag==="button")?u:u.closest(c.onTag);t.addClass(c.onClass)}function g(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a"||c.onTag==="button")?u:u.closest(c.onTag);t.removeClass(c.onClass)}function f(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.show()}function n(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.hide()}function m(s){return Math.max(Math.min(s,j(c.target,c.selector).length-1),0)}return{init:function(s){p=this;o(s)},setCloseAll:function(){g();n()},setOpen:function(s){k(s);f(s)},setNext:function(){var s=parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"));var t=(c.repeat&&s+1>j(c.target,c.selector).length-1)?0:m(s+1);if(!isNaN(s)){j(c.target,c.selector).eq(t).trigger("click.toggle")}},setPrev:function(){var t=parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"));var s=(c.repeat&&t-1<0)?j(c.target,c.selector).length-1:m(t-1);if(!isNaN(t)){j(c.target,c.selector).eq(s).trigger("click.toggle")}},setOptions:function(s){b.extend(c,s)},getOptions:function(){return c},getIndex:function(){return parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"))}}};return a}(jQuery));

/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1.4
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
*   1.1.2 (2017.08.29) : initFreeSwiper에 change 이벤트 확장, orientationchange 이벤트 적용, data.position 추가 하여 이동 포지션 참조 가능
*   1.1.3 (2017.10.25) : transform = 'none' 값 반환시 matrixToArray 함수 오류 방지 
*   1.1.4 (2017.12.08) : next, prev 버튼 기능 부여할 selector 지정(확장) 필요하여 opts.nextSelector, opts.prevSelector 옵션 추가 
*
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
(function(b){if(b.SwiperTemplate!==undefined){return}var a=(function(d){var c=function(){var j,g;var e={};var h=false;function k(s,r){var p=s.container;var o=p.find(".swiper-pagination > span").length;var n=p.find(".swiper-pagination .swiper-pagination-bullet-active").index();p.find(".swiper-pag-num").html("<span>"+(n+1)+"</span> / "+o);if(e.loop&&e.lazyLoading){p.find(".swiper-slide-visible.swiper-slide-duplicate .swiper-lazy").removeClass("swiper-lazy-loading")}var q=p.find(".swiper-wrapper").css("transform");if(q!==undefined&&q!=="none"&&d.isArray(f(q))&&q.length>5){s.position={x:parseInt(f(q)[4])}}if(e.exChange!==undefined){e.exChange(s,r)}}function i(){g.each(function(n){if(d(this).is(".swiper-container-horizontal")){j=d(this)[0].swiper;if(j!==undefined){j.destroy(false,true)}}})}function m(n,p){var o=d(n);var p=o.find("img");p.css("marginTop",(p.parent().height()-p.height())*0.5)}function l(o){var n=o.container;var p=(d(window).width()/9)*16;n.find(".swiper-container .swiper-slide").css("height",p*0.32);n.find(".swiper-container .swiper-slide img").css("height",p*0.32)}function f(n){return n.split("(")[1].split(")")[0].split(",")}return{initGallerySwiper:function(o,n){var p;g=o;i();if(g.find(".swiper-slide").length===1){g.find(".swiper-pagination").hide()}g.each(function(q){p={viewport:false,vertical:false,pagination:d(this).find(".swiper-pagination"),loop:((d(this).find(".swiper-slide").length>1)?true:false),preloadImages:false,watchSlidesVisibility:true,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(t,r,s){if(e.vertical){m(r,s)}},onSlideChangeStart:function(r){k(r,"onSlideChangeStart")},onSliderMove:function(r){k(r,"onSliderMove")},onTransitionEnd:function(r){k(r,"onTransitionEnd")},onInit:function(r){d(window).on("orientationchange",function(){setTimeout(function(){k(r,"orientationchange")},50)});k(r,"onInit");if(e.viewport){l(r)}},prevSelector:"a.big5_prev",nextSelector:"a.big5_next"};e=d.extend({},p,n);j=new Swiper(d(this),e)});g.find(e.prevSelector).on("click.swipertemplate",function(t){var r=d(t.currentTarget);var q=r.closest(".swiper-container")[0].swiper;q.slidePrev();k(q);t.preventDefault()});g.find(e.nextSelector).on("click.swipertemplate",function(t){var r=d(t.currentTarget);var q=r.closest(".swiper-container")[0].swiper;q.slideNext();k(q);t.preventDefault()})},initFreeSwiper:function(p,n){g=p;i();var o;var q={pagination:g.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true,onTransitionStart:function(r){if(o!==undefined){clearInterval(o);o=undefined}o=setInterval(function(){k(r,"onTransitionStart")},10)},onSliderMove:function(r){k(r,"onSliderMove")},onTransitionEnd:function(r){if(o!==undefined){clearInterval(o);o=undefined}},onInit:function(r){d(window).on("orientationchange",function(){setTimeout(function(){k(r,"orientationchange")},50)});k(r,"onInit")}};g.each(function(r){e=d.extend({},q,n);j=new Swiper(d(this),e)})},resetSwiper:function(n){g=(n.hasClass("swiper-container-horizontal"))?n:n.find(".swiper-container-horizontal");g.each(function(){j=d(this)[0].swiper;if(j!==undefined){j.destroy(false,true);new Swiper(j.container,j.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);

//WTab migration //add 2.0.2
if (WTab === undefined && WToggle !== undefined) var WTab = WToggle;

//get instance
void 0===$.fn.getInstance&&($.fn.getInstance=function(){return this.data("scope")}),void 0===$.fn.setInstance&&($.fn.setInstance=function(e){function a(e){var a=!1;for(var i in t)if(i===e){a=!0;break}return a}function i(e){return void 0!==e?e.substr(e.lastIndexOf(".")+1):void 0}var n=this.data("scope")||void 0;if(void 0===n)this.data("scope",e);else{var t,o=i(e["package"]),s={};if(void 0!==n["package"])t={},t[i(n["package"])]=n,t[o]=e;else if(t=this.data("scope"),a(o)){var c=t[o];$.isPlainObject(c)&&(t[o]=[c]),$.isArray(t[o])&&t[o].push(e)}else void 0!==e["package"]&&(s[o]=e),$.extend(t,s);this.data("scope",t)}}),void 0===$.fn.removeInstance&&($.fn.removeInstance=function(e,a){var i=this.data("scope")||void 0;if(void 0!==i&&void 0!==e)if(void 0!==i["package"])this.removeData("scope");else if(void 0===i["package"]&&void 0!==i[e]){var n=i[e];void 0!==a&&$.isArray(n)&&n.length>a?(n.splice(a,1),1===n.length&&(i[e]=n[0])):delete i[e]}}),void 0===$.fn.searchInstance&&($.fn.searchInstance=function(e,a){var i,n=this.data("scope")||void 0;return void 0!==n&&void 0!==e&&(void 0!==n["package"]&&n["package"].split(".").pop()===e?i=n:void 0===n["package"]&&void 0!==n[e]&&(i=n[e],void 0!==a&&$.isArray(i)&&i.length>a&&(i=i[a]))),i});

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