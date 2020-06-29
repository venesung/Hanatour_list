/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 2.2.4
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
 * 2.1.5 (2018.01.08) : common_new 성격을 닷컴이 아닌 전체 common 으로 변경하고 닷컴 네비부분 최소 분리 유지, 삭제 가능할때 삭제, DOTCOM 객체 HT 로 변경 
 * 2.1.6 (2018.03.21) : 같은 data-url 물고 있는 슬라이드 팝업 존재 시 다중 팝업 띄우지 않도록 수정
 * 2.1.7 (2018.04.13) : fixedFixToggle() 의 st 변수 무조건 숫자형태로 받도록 수정
 * 2.1.8 (2018.05.29) : totalMenuDIV 내 li display:none; 은 .on 활성화에서 제외
 * 2.1.9 (2018.06.29) : 열리는 중 닫기 호출되면 닫히지만 열기완료 이벤트의 바탕 hide 되는 문제, 슬라이드 팝업 닫힐 때 열기 호출시 #url 된상태로 닫히는 문제 수정
 * 2.2.0 (2018.07.09) : 이중팝업 parenttop 사라지는 문제 수정, data-direct 통하여 다이렉트 팝업진입 여부 파악하여 history.back() 지원
 * 2.2.1 (2018.07.16) : WToggle 2.0.8 업데이트, getInstance 1.2.3 업데이트
 * 2.2.2 (2018.08.02) : openLoadPop 에서 ajax 완료전에 클릭 방지를 위해 mak 생성(.slidepopupWrap 활용), 삭제 로직 추가
 * 2.2.3 (2018.08.31) : gnb 개편(홀딩)
 * 2.2.4 (2018.09.10) : openSlidePop, closeSlidePop 단독사용 수정
 */

(function (scope) {
    if (scope.DOTCOM !== undefined || scope.HT !== undefined) {
        if (scope.HT === undefined) scope.HT = scope.DOTCOM;
        if (scope.DOTCOM === undefined) scope.DOTCOM = scope.HT;
        return;
    }

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

    //#overlayPanel 이 transform 클래스인 slideUp, slideDown 을 물고 있음 (아래서 위로 올라오는 팝업.. 항공, HT.openLoadPop 에서 사용)
    var HT = {
        isBlockingHash : false, //add 2.0.9 .. 단순 hash 변경만 하고 'hashchange' 이벤트를 통해 openLoadPop() 안타도록 하는 변수
        //HT.setMask() flag 를 이용해 토글 하고, pop 이 #overlayPanel이 아니면 body .ui-page 안에 딤(#mask .mask) 추가
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
                class : 'slidepopup',
                browserHeight : WDDO.browserHeight //add 2.0.3
            }, options);

            if (target === undefined) return;

            var popTarget = target;
            var slidePopDIV = $('.' + opts.class); //modify 2.2.4
            
            if (opts.class !== undefined) {
                if (!popTarget.hasClass(opts.class)) popTarget.addClass(opts.class); //add 2.2.4
                popTarget.wrap('<div class="' + opts.class + 'Wrap">'); //슬라이드팝업 오픈중 클릭 막음//add 2.2.0
            }

            if (opts.source.length > 0) popTarget.html(opts.source.html()); //팝업 내부에 내용 삽입

            if (slidePopDIV.length < 2) opts.parent.attr('data-parenttop', $(window).scrollTop()); //배경위치 저장//add 2.0.8 //slidePopDIV.length < 2 통하여 이중팝업엔 적용안함//add 2.2.0

            if (opts.parent.is(':hidden') && slidePopDIV.length === 1) { //이중팝업에서 back 버튼 시 등장 모션 삭제
                slidePopDIV.addClass('notTrans'); //.slidepopup.slideUp.notTrans {-webkit-animation-duration: 0ms;animation-duration: 0ms;-webkit-animation-delay: 0ms;animation-delay: 0ms;} //add 2.2.0
            }

            setTimeout(function() { //trigger('open.loadpop'.. 보다 느리기 위한(초기화등..처리 이후 등장을 위한)
                popTarget.addClass('slide slideUp').on(ANI_EV + '.dotcom', function(e) { //one > on //modify 2.0.3 //등장모션이 완료되는 시점
                    if (popTarget.hasClass('slideDown')) return; //닫히고 있는 슬라이드 팝업이 있으면 더 진행 하지않아 opts.parent.hide() 막음 //add 2.1.9

                    if (!popTarget.parent().is('body')) popTarget.unwrap(); //슬라이드팝업 오픈중 클릭 막음 해제//add 2.2.0

                    opts.parent.hide();         //팝업 뒤편으로 깔린 화면 숨김
                    $(window).scrollTop(0);     //내부 스크롤이 생겼으므로 자체 스크롤은 0으로 초기화

                    //아래 innerScrollToggle(popTarget, false)에서의 if문을 안 탈수도 있으니 height:auto 조정
                    //display:block; 을 물고있는 'slideUp' 클래스가 빠지기 때문에 display:block; 은 'show' 클래스가 유지시켜줌
                    popTarget.css('height', 'auto').addClass('show').removeClass('slideUp slide notTrans').off(ANI_EV + '.dotcom'); //add 'notTrans'//add 2.2.0
                    
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
                class : 'slidepopup', //add 2.2.4
                remove : false       //add 2.0.9 닫으면 팝업 마크업 삭제
            }, options);

            if (target === undefined) return;
            
            var popTarget = target;
            
            if (!popTarget.parent().is('body')) popTarget.unwrap(); //슬라이드팝업 오픈중 닫히면 막음 해제//add 2.2.0
            
            popTarget.attr('data-scrolltop', $(window).scrollTop()); //닫기 전 재오픈시 참조할 스크롤값 저장
            
            opts.parent.show(); //숨겨둔 팝업 뒷편 영역 보임

            //아래 innerScrollToggle(popTarget, ture)에서의 if문을 안탈수도 있으니 css('height' 미리 조정
            popTarget.css('height', WDDO.browserHeight).addClass('slide slideDown').on(ANI_EV + '.dotcom', function() {
                //닫은후
                innerScrollToggle(popTarget, false);
                fixedFixToggle(popTarget, false);
                closeSwapScroll(popTarget, false, opts); //modify 2.2.4

                popTarget.attr('style', '').removeClass('slideDown slide show').off(ANI_EV + '.dotcom');

                popTarget.trigger('close.slidepop', opts); 

                if (opts.remove || popTarget.attr('id') !== 'overlayPanel') popTarget.remove(); //add 2.0.9 overlayPanel1~ 이면 삭제 (이중팝업은 'data-scrolltop' 지원안함)
            });
            
            //닫는중
            //닫기 전 내부스크롤 형태로 변경
            innerScrollToggle(popTarget, true);
            fixedFixToggle(popTarget, true);
            closeSwapScroll(popTarget, true, opts); //modify 2.2.4
            
            popTarget.off('click.closeBtn'); //add 2.0.9 .. .on() 직전 .off() 정상적으로 작동안해 여기서 삭제
        },

        //opts.effect 시 openSlidePop(), closeSlidePop() 를 호출 하도록 되어있음
        openLoadPop : function (options) {
            var pop,
                source,
                oldpop,
                defaults = getDefaultOption(),
                opts = $.extend({}, defaults, options);

            function getDefaultOption() {
                return {
                    class : 'slidepopup', //add 2.0.9
                    url : undefined,
                    effect : 'slide',
                    ajaxComplate : undefined //add 2.2.0
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

                if (opts.ajaxComplate !== undefined) opts.ajaxComplate(pop, opts); //ajax 통해 마크업 생성된 직후 발생//add 2.2.0 

                if (opts.effect === 'slide') HT.openSlidePop(pop, opts); //modify 2.0.1

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
                pop.off('click.closeBtn').on('click.closeBtn', '.closeOverlayPanel', function (e) {
                    var target = $(e.currentTarget);

                    if (opts.effect === 'slide') closeSlidePopup(pop, opts);

                    //callback
                    //$('body').off('open.loadpop'); //항상 걸려있는 이벤트도 존재하므로 삭제하면 안되어 주석처리함 //추가로 이벤트를 걸때는 $('body .slidepopup').on('open.loadpop') 으로
                    pop.trigger('close.loadpop', opts); //항상 사라있는 공통이벤트는  $('body').on('open.loadpop', '#overlayPanel', function (e, data) { console.log(data); }); 로 걸어야함

                    e.preventDefault(); //#으로 hash 변경 방지//add 2.2.0
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
                //add 2.2.2
                if (opts.class !== undefined && opts.effect === 'slide') {
                    if ($('body').find('> .' + opts.class + 'Wrap').length > 0) return;
                    
                    $('body').append('<div class="' + opts.class + 'Wrap mak">');
                }

                $.ajax({
                    type: "GET",
                    url: opts.url,
                    dataType: "text",
                    success: function(data){
                        //console.log('success : ' + data);
                        source = data;

                        removeMak(); //add 2.2.2
                        open();
                    },
                    error: function(xhr, option, error){
                        //console.log('xhr : ' + xhr + ', option : ' + option + ', error : ' + error);

                        removeMak(); //add 2.2.2
                    }
                });
            }

            //add 2.2.2
            function removeMak() {
                if (opts.class !== undefined && opts.effect === 'slide') $('body').find('> .' + opts.class + 'Wrap.mak').remove();
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
        //if (HT !== undefined && typeof HT.locationHashChanged !== 'undefined') window.addEventListener('hashchange', HT.locationHashChanged);
        locationHashChanged : function (_direct) {
            var slidePopDIV = $('.slidepopup[data-url]').not(':hidden');
            var direct = _direct === true ? _direct : false; //hashchange가 window.onload 통해 발생했으면 true(url통해 슬라이드팝업 바로 진입이라 판단)//add 2.2.0

            if (window.location.hash.length > 1) {
                var loadURL = window.location.hash.substring(1);

                //같은 #url를 가지는 팝업이 존재하면 띄우지 않음 //add 2.1.6
                if (slidePopDIV.length > 0 && slidePopDIV.attr('data-url') === loadURL && !HT.isBlockingHash) { //!HT.isBlockingHash 추가(이중팝업 닫을 때 타지 않도록)//add 2.2.0 
                    //#url 변경된 hash 강제 # 변경 //add 2.1.9
                    changeHashStealth('#');

                    return false;
                }

                if (HT !== undefined && typeof HT.openLoadPop !== 'undefined') {
                    if (!HT.isBlockingHash) { //add 2.0.9 .. 이중팝업 닫을 때 'hashchange' 안타도록
                        HT.openLoadPop({
                            target : $(document.activeElement),
                            url : loadURL,
                            parent : $(document.querySelector('body > #wrap')),
                            remove : true,
                            ajaxComplate : function (pop) { //add 2.2.0
                                pop.attr('data-direct', direct);
                            }
                        });
                    }
                }
            } else {
                slidePopDIV.filter(':last').find('.closeOverlayPanel').trigger('click.closeBtn'); //add 2.1.0.. 백스페이스시 #값 없으면 팝업찾아 닫기
            }
        }
    };

    //슬라이드 팝업 닫기 (history.back() 혹은 # hash 변경 대응) //add 2.2.0
    function closeSlidePopup(target, options) {
        //닫기버튼을 history.back()으로 구현하고 해당 로직 이곳에 추가
        var pop = target.filter(':last');

        if (pop.length > 0) HT.closeSlidePop(pop, options);

        //x버튼(history.back(), 브라우저 back버튼이 아닌 강제 # 이나 #url 전환을 위한 로직)
        if (pop.attr('data-oldpop') !== undefined) { //add 2.0.9.. 이중팝업 상황에서 이전팝업 배경에 유지상태에서 닫기 모션 위한 로직
            var oldpop = $('#' + pop.attr('data-oldpop'));

            if (oldpop.length > 0) {
                oldpop.addClass('show');
                options.parent.hide();
                
                //hashchange 이벤트 발생없이 해쉬 변경
                changeHashStealth('#' + oldpop.attr('data-url'));
            }
        } else {
            changeHashStealth('#');
        }
    }

    //hashchange 이벤트 발생없이 해쉬 변경
    function changeHashStealth(hash) {
        HT.isBlockingHash = true;
        location.hash = hash;
        setTimeout(function () {HT.isBlockingHash = false;}, 50);
    }

    //css3 transform 시 팝업내에 position:fixed 버그 우회, data-fixedfix 속성있는 element 적용 //add 2.0.4
    function fixedFixToggle (target, isTransition) {
        var isPopupScroll = (target.height() >= WDDO.browserHeight); //modify 2.0.8 // = 으로 하면 isTransition = true 후 WDDO.browserHeight와 target.height() 같아져 false 가 안타므로 >= 로 변경 

        if (isPopupScroll) {
            if (isTransition) {
                var fixedTarget = target.find('div[data-fixedfix]').filter(function () {return $(this).css('position') === 'fixed'}); //modify 2.1.0 'div' => 'div[data-fixedfix]'
                var offsetTop, top;
                var st = parseInt(target.attr('data-scrolltop')) || 0; //modify 2.1.7 //parseInt() 추가

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
    function closeSwapScroll (target, isTransition, options) {
        var st = options.parent.attr('data-parenttop');
        var slidePopDIV = $('.' + options.class);

        if (st !== undefined) {
            if (isTransition) { //닫는 모션중 배경 위치
                target.scrollTop($(window).scrollTop());                    //내부 팝업 스크롤 유지
                setTimeout(function () { $(window).scrollTop(st); }, 1);    //배경 스크롤 복구
            } else { //닫는 모션 끝
                if (slidePopDIV.length < 2) options.parent.removeAttr('data-parenttop'); //slidePopDIV.length < 2 통하여 이중팝업엔 적용안함//add 2.2.0
            }
        }
    }

    scope.HT = scope.DOTCOM = HT;
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
    initToggle();
    initHrefPopup();
    initFrom();

    //컨텐츠 Script
    initSearch();       //통합검색
    initSearchCity();   //도시검색

    //m.hanatour.com //modify 2.1.5
    initLnb(); //
    initTopBtn();

    //공통 기본형 swiper
    function initSwiper() {
        if (typeof Swiper === 'undefined') return;
        
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

    if (HT !== undefined && typeof HT.initToggle === 'undefined') HT.initToggle = initToggle; //add 2.0.9

    //공통 페이지 로드 슬라이드 팝업 //add 2.0.2
    function initHrefPopup(container) {
        var con = container || $('body'); //add 2.0.9
        var linkTagA = con.find('a.pb_hrefpopup');

        linkTagA.on('click', function (e) {
            var target = $(e.currentTarget);
            var loadURL = $(this).attr('href');
        
            HT.openLoadPop({
                target : target,
                url : loadURL,
                parent : ($('body > div[data-role="page"]').length > 0) ? $('body > div[data-role="page"]') : undefined
                //data-role='page' 인 div 가 팝업 열리면 display:none 처리 의미, 기본값 #wrap //modify 2.1.4
            });

            e.preventDefault();
        });
    }

    if (HT !== undefined && typeof HT.initHrefPopup === 'undefined') HT.initHrefPopup = initHrefPopup; //add 2.0.9

    //폼
    function initFrom() {
        $('label.placeholderTxt').each(function () {
            $(this).next('input').on('input.dotcom', function (e) {
                var target = $(e.currentTarget);
                target.prev('label.placeholderTxt').toggle(target.val().length === 0);
            });
        });
    }

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

    /********************************************************************************************/
    /************************************** m.hanatour.com **************************************/
    /********************************************************************************************/
    //modify 2.1.5
    
    //로케이션 네비게이션 바
    function initLnb() {
        var locationNAV = $('.ui-page nav#gnb');

        if (typeof Swiper === 'undefined' || locationNAV.length === 0) return;

        new SwiperTemplate().initFreeSwiper(locationNAV, {slidesOffsetBefore:0, slidesOffsetAfter:45, spaceBetween:0, slidesPerView: 'auto', simulateTouch: false/*, resistanceRatio:0*/, wrapperClass: 'gnb-wrapper', slideClass: 'gnb-slide',
            exChange: function (data, type) {
                if (type === 'onInit') {
                    locationNAV.addClass('nextShadow');
                }
            },
            onProgress: function (data, progress) {
                if (progress <= 0) {
                    locationNAV.removeClass('prevShadow').addClass('nextShadow');
                } else if (progress >= 1) {
                    locationNAV.removeClass('nextShadow').addClass('prevShadow');
                } else {
                    locationNAV.addClass('nextShadow prevShadow');
                }
            }
        });

        locationNAV.on('click', '> ul > li > a', function (e) {
            var target = $(e.currentTarget);
            var idx = target.parent().index();

            locationNAV.changeAct(idx);

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

                    if (this.is('nav#gnb') && totalMenuDIV.length > 0) totalMenuDIV.find('ul > li').removeClass('on').filter(function () {
                        return $(this).css('display') !== 'none'; //add 2.1.8
                    }).eq(idx).addClass('on'); //add 2.0.5

                    if ($.fn.getInstance !== undefined) { //add 2.1.2
                        var toggle = this.getInstance();
                        if (toggle !== undefined){
                            toggle.setCloseAll();
                            toggle.setOpen(activate);
                        }   
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

/*! toggle @version : 2.0.8 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):t.WToggle=e()}(this,function(){"use strict";var t="undefined"!=typeof Hanatour&&Hanatour.jquery?Hanatour.jquery:jQuery,e=function(){var e,n,o,a={target:t(t.fn),selector:"",event:"click.toggle",onTag:"li",onClass:"on",onlyOpen:!0,mustClose:!1,behavior:!1,repeat:!1,speed:0,content:t(t.fn),contentSelector:"",onChange:void 0,onChangeStart:void 0},r=function(r){(o=t.extend(a,r)).target.length>0&&(void 0!==t.fn.setInstance&&o.target.setInstance(e),function(){""===o.selector?o.target.on(o.event,e):o.target.on(o.event,o.selector,e);function e(e){var a=t(e.currentTarget);s(),n=g(o.content,o.contentSelector);var r=parseInt(a.data("toggle-idx")),d="a"===o.onTag||"button"===o.onTag?a:a.closest(o.onTag);void 0!==o.onChangeStart&&o.onChangeStart.apply(this,[{target:a,idx:r,content:n.eq(r)}]),o.target.trigger("changestart.toggle",[{target:a,idx:r,content:n.eq(r)}]),d.hasClass(o.onClass)?o.onlyOpen?o.mustClose&&(i(r),u(r)):(i(r),u(r)):o.onlyOpen?(i(),u(),c(r),l(r)):(c(r),l(r)),void 0!==o.onChange&&o.onChange.apply(this,[{target:a,idx:r,content:n.eq(r)}]),o.target.trigger("change.toggle",[{target:a,idx:r,content:n.eq(r)}]),o.behavior||(e.preventDefault(),e.stopPropagation())}s()}())};function s(){g(o.target,o.selector).each(function(e){t(this).data("toggle-idx",e)})}function g(t,e){return""!==e&&void 0!==e?t.find(e):t}function c(t){var e=void 0===t?g(o.target,o.selector):g(o.target,o.selector).eq(t);("a"===o.onTag||"button"===o.onTag?e:e.closest(o.onTag)).addClass(o.onClass)}function i(t){var e=void 0===t?g(o.target,o.selector):g(o.target,o.selector).eq(t);("a"===o.onTag||"button"===o.onTag?e:e.closest(o.onTag)).removeClass(o.onClass)}function l(t){var e=void 0===t?g(o.content,o.contentSelector):g(o.content,o.contentSelector).eq(t);0===o.speed?e.show():e.slideDown(o.speed)}function u(t){var e=void 0===t?g(o.content,o.contentSelector):g(o.content,o.contentSelector).eq(t);0===o.speed?e.hide():e.slideUp(o.speed)}function d(t){return Math.max(Math.min(t,g(o.target,o.selector).length-1),0)}return{init:function(t){e=this,r(t)},setCloseAll:function(){i(),u()},setOpen:function(t){c(t),l(t)},setNext:function(){var e=parseInt(g(o.target,o.selector).filter(function(){return t(this).closest(o.onTag).hasClass(o.onClass)}).data("toggle-idx")),n=o.repeat&&e+1>g(o.target,o.selector).length-1?0:d(e+1);isNaN(e)||g(o.target,o.selector).eq(n).trigger("click.toggle")},setPrev:function(){var e=parseInt(g(o.target,o.selector).filter(function(){return t(this).closest(o.onTag).hasClass(o.onClass)}).data("toggle-idx")),n=o.repeat&&e-1<0?g(o.target,o.selector).length-1:d(e-1);isNaN(e)||g(o.target,o.selector).eq(n).trigger("click.toggle")},setChange:function(t){void 0!==t&&g(o.target,o.selector).eq(t).trigger("click.toggle")},setOptions:function(e){t.extend(o,e)},getOptions:function(){return o},getIndex:function(){return parseInt(g(o.target,o.selector).filter(function(){return t(this).closest(o.onTag).hasClass(o.onClass)}).data("toggle-idx"))},package:this.package}};return e.prototype.package="Hanatour.controls.toggle",e});

/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1.8
* @since : 2016.11.11
*
* history
*   1.0   (2016.11.11) : -
*   1.1.0 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
*                        resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
*                        initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
*   1.1.1 (2017.05.19) : verticalMode 에서 가로형 이미지도 세로정렬 적용토록 수정하고 opts.vertical 생성하여 필요시에만 적용, verticalMode() 간소화
*                        loop, lazy 조합 시 div.swiper-slide-duplicate 에 .swiper-lazy 대상이 .swiper-lazy-loading 상황일때 복제되어 lazy 재로드 못하는 문제 해결 
*                        watchSlidesVisibility:true 기본으로 추가되도록 수정
*   1.1.2 (2017.08.29) : initFreeSwiper에 change 이벤트 확장, orientationchange 이벤트 적용, data.position 추가 하여 이동 포지션 참조 가능
*   1.1.3 (2017.10.25) : transform = 'none' 값 반환시 matrixToArray 함수 오류 방지 
*   1.1.4 (2017.12.08) : next, prev 버튼 기능 부여할 selector 지정(확장) 필요하여 opts.nextSelector, opts.prevSelector 옵션 추가 
*   1.1.5 (2018.03.12) : verticalMode 제거, applyArea() 생성하여 WPreLoad 통하여 'vertical', 'horizontal' 클래스 처리, opts.vertical 를 opts.areaClass 로 변경
*   1.1.6 (2018.04.23) : swiper 라이브러리 4.x.x 대응
*   1.1.7 (2018.06.18) : opts.autoplayDisableOnInteraction 적용(autoplay 시 사용자 인터렉션 이후 계속 재생되도록 기본값 false 설정) 
*   1.1.8 (2018.09.04) : opts.exLazyImageReady 추가
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
!function(i){if(void 0===i.SwiperTemplate){void 0===i.WPreLoad&&(i.WPreLoad=function(e,i){var n,a=$.extend({},{done:function(){},complete:function(){}},i),t=e.length,o=0,r=[];if(void 0!==e.jquery)e.each(function(i){s(e.eq(i))});else for(n in e)s(e[n]);function s(i){var e=void 0!==i.jquery?i.attr("src"):i;r.push($("<img />").load(function(){o+=1;var i=Math.round(o/t*100);a.done({source:this,element:$(this).data("element"),percent:i}),o===t&&a.complete(r.map(function(i){return i.get(0)}))}).attr("src",e).data("element",i))}});var h,e=(h=jQuery,function(){var t,o,r={};function s(i,e){var n=i.container||i.$el,a=n.find(".swiper-pagination > span").length,t=n.find(".swiper-pagination .swiper-pagination-bullet-active").index();n.find(".swiper-pag-num").html("<span>"+(t+1)+"</span> / "+a),r.loop&&r.lazyLoading&&n.find(".swiper-slide-visible.swiper-slide-duplicate .swiper-lazy").removeClass("swiper-lazy-loading");var o=n.find(".swiper-wrapper").css("transform");void 0!==o&&"none"!==o&&h.isArray(c(o))&&5<o.length&&(i.position={x:parseInt(c(o)[4])}),void 0!==r.exChange&&r.exChange(i,e)}function l(){o.each(function(i){h(this).is(".swiper-container-horizontal")&&void 0!==(t=h(this)[0].swiper)&&t.destroy(!1,!0)})}function d(i){var e=h(i).find("img");new WPreLoad(e,{done:function(i){var e=i.source,n=h(e).data("element").closest("."+r.areaClass);n.removeClass("vertical horizontal"),e.width<e.height?n.addClass("vertical"):e.width>e.height&&n.addClass("horizontal")}})}function c(i){return i.split("(")[1].split(")")[0].split(",")}function p(i){return i.on={lazyImageLoad:i.onLazyImageReady,transitionStart:i.onTransitionStart,sliderMove:i.onSliderMove,slideChangeTransitionStart:i.onSlideChangeStart,transitionEnd:i.onTransitionEnd,init:i.onInit},i.lazy=i.lazyLoading,i.loadPrevNext=i.lazyLoadingInPrevNext,0<i.pagination.length&&(i.pagination={el:".swiper-pagination"}),0<i.autoplay.length&&(i.autoplay={disableOnInteraction:i.autoplayDisableOnInteraction}),i}return{initGallerySwiper:function(i,e){var n;o=i,l(),1===o.find(".swiper-slide").length&&o.find(".swiper-pagination").hide(),o.each(function(i){n={viewport:!1,areaClass:void 0,pagination:h(this).find(".swiper-pagination"),loop:1<h(this).find(".swiper-slide").length,preloadImages:!1,watchSlidesVisibility:!0,lazyLoadingInPrevNext:!0,lazyLoading:!0,autoplayDisableOnInteraction:!1,onLazyImageReady:function(i,e,n){var a=void 0!==i?i:this,t=h(void 0!==i?e:i),o=h(void 0!==i?n:e);r.areaClass&&!t.hasClass("vertical")&&!t.hasClass("horizontal")&&0<t.find("."+r.areaClass).length&&d(t),void 0!==r.exLazyImageReady&&r.exLazyImageReady(a,t,o)},onSlideChangeStart:function(i){s(i||this,"onSlideChangeStart")},onSliderMove:function(i){s(void 0===i.type?i:i.target.closest(".swiper-container").swiper,"onSliderMove")},onTransitionEnd:function(i){s(i||this,"onTransitionEnd")},onInit:function(i){var e,n,a,t=void 0!==i?i:this;h(window).on("orientationchange",function(){setTimeout(function(){s(t,"orientationchange")},50)}),s(t,"onInit"),!r.lazyLoading&&r.preloadImages&&r.areaClass&&h(t.slides).each(function(){e=h(this),r.areaClass&&!e.hasClass("vertical")&&!e.hasClass("horizontal")&&0<e.find("."+r.areaClass).length&&d(e)}),r.viewport&&(n=t.container,a=h(window).width()/9*16,n.find(".swiper-container .swiper-slide").css("height",.32*a),n.find(".swiper-container .swiper-slide img").css("height",.32*a))},prevSelector:"a.big5_prev",nextSelector:"a.big5_next"},r=h.extend({},n,e),void 0!==Swiper.prototype.init&&(r=p(r)),t=new Swiper(h(this),r)}),o.find(r.prevSelector).on("click.swipertemplate",function(i){var e=h(i.currentTarget).closest(".swiper-container")[0].swiper;e.slidePrev(),s(e),i.preventDefault()}),o.find(r.nextSelector).on("click.swipertemplate",function(i){var e=h(i.currentTarget).closest(".swiper-container")[0].swiper;e.slideNext(),s(e),i.preventDefault()})},initFreeSwiper:function(i,e){var n;o=i,l();var a={areaClass:void 0,pagination:o.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:!0,roundLengths:!0,preloadImages:!1,watchSlidesVisibility:!0,lazyLoadingInPrevNext:!0,lazyLoading:!0,onLazyImageReady:function(i,e,n){var a=void 0!==i?i:this,t=h(void 0!==i?e:i),o=h(void 0!==i?n:e);r.areaClass&&!t.hasClass("vertical")&&!t.hasClass("horizontal")&&0<t.find("."+r.areaClass).length&&d(t),void 0!==r.exLazyImageReady&&r.exLazyImageReady(a,t,o)},onTransitionStart:function(i){var e=i||this;void 0!==n&&(clearInterval(n),n=void 0),n=setInterval(function(){s(e,"onTransitionStart")},10)},onSliderMove:function(i){s(void 0===i.type?i:i.target.closest(".swiper-container").swiper,"onSliderMove")},onTransitionEnd:function(i){void 0!==n&&(clearInterval(n),n=void 0)},onInit:function(i){var e,n=void 0!==i?i:this;h(window).on("orientationchange",function(){setTimeout(function(){s(n,"orientationchange")},50)}),s(n,"onInit"),!r.lazyLoading&&r.preloadImages&&r.areaClass&&h(n.slides).each(function(){e=h(this),r.areaClass&&!e.hasClass("vertical")&&!e.hasClass("horizontal")&&0<e.find("."+r.areaClass).length&&d(e)})}};o.each(function(i){r=h.extend({},a,e),void 0!==Swiper.prototype.init&&(r=p(r)),t=new Swiper(h(this),r)})},resetSwiper:function(i){(o=i.hasClass("swiper-container-horizontal")?i:i.find(".swiper-container-horizontal")).each(function(){void 0!==(t=h(this)[0].swiper)&&(t.destroy(!1,!0),new Swiper(t.container,t.params))})}}});i.SwiperTemplate=e}}(window);

//WTab migration //add 2.0.2
if (WTab === undefined && WToggle !== undefined) var WTab = WToggle;

//get instance ver 1.2.3
;$(function(a){if(a.fn.getInstance===undefined){a.fn.getInstance=function(){return this.data("scope")}}if(a.fn.setInstance===undefined){a.fn.setInstance=function(h){var j=this.data("scope")||undefined;if(j===undefined){this.data("scope",h)}else{var e=c(h["package"]);var f;if(j["package"]!==undefined){var d=c(j["package"]);f={};if(d!==e){f[d]=j;f[e]=h}else{f[e]=[j,h]}}else{f=j;if(!g(e)){var i={};if(e!==undefined){i[e]=h}a.extend(f,i)}else{var b=f[e];if(a.isPlainObject(b)){f[e]=[b]}if(a.isArray(f[e])){f[e].push(h)}}}this.data("scope",f)}function g(l){var k=false;for(var m in f){if(m===l){k=true;break}}return k}function c(k){return(k!==undefined)?k.substr(k.lastIndexOf(".")+1):undefined}}}if(a.fn.removeInstance===undefined){a.fn.removeInstance=function(e,b){var d=this.data("scope")||undefined;if(d!==undefined&&e!==undefined){if(d["package"]!==undefined){this.removeData("scope")}else{if(d["package"]===undefined&&d[e]!==undefined){var c=d[e];if(b!==undefined&&a.isArray(c)&&c.length>b){c.splice(b,1);if(c.length===1){d[e]=c[0]}}else{delete d[e]}}}}}}if(a.fn.searchInstance===undefined){a.fn.searchInstance=function(e,b){var d=this.data("scope")||undefined;var c;if(d!==undefined&&e!==undefined){if(d["package"]!==undefined&&d["package"].split(".").pop()===e){c=d}else{if(d["package"]===undefined&&d[e]!==undefined){c=d[e];if(b!==undefined&&a.isArray(c)&&c.length>b){c=c[b]}}}}return c}}}(jQuery));

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