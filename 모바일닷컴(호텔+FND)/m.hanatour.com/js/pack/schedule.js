/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.4.1
 * @since : 2016.04.29
 *
 * 닷컴 - 해외 - 하나팩 - 일정표
 * 
 * history
 * 
 * 1.0   (2016.04.29) : 
 * 1.1   (2016.05.27) : initFreeSwiper() 에 pagination 대상을 $(this) 에서 인자로 넘어온 targetContainer 로 오타 수정
 * 1.2   (2016.06.20) : initVideo() 개발로 넘김, 개발에서 호출 하는 내용 적용 (TO DO, -ys), 앱다운로드 배너 감안한 fixed 수정
 *                    zoom 라이브러리 settings 생성에 var 누락 수정, 라이브러리 자체에서 생성하므로 div.zoomContainer 생성을 삭제함
 * 1.3   (2016.06.28) : trigger('scroll 을 triggerHandler('scroll 로 변경
 * 1.3.1 (2016.06.29) : swiper 중복방지 초기화
 * 1.3.2 (2016.07.04) : SCHEDULE.initVideo() 에서 youtube 대응하도록 수정, 상단 스와이프 세로 모드 적용
 * 1.3.3 (2016.07.04) : 개발추가본 적용
 * 1.3.4 (2016.07.12) : 일정표 탭메뉴 클릭 시 scrollTop 에 앱다운배너 높이 영향 수정
 * 1.3.5 (2016.09.22) : ios9 vh 대응
 * 1.3.6 (2016.11.29) : initVideo() 내부 youtube 아이디에 '-' 존재하여 /w 에서 /S 로 수정
 * 1.3.7 (2016.01.19) : 맛 10 스와이프 추가
 * 1.3.8 (2017.03.22) : #adBanner 자동 롤링 적용
 * 1.3.9 (2017.06.26) : 선택관광내부 탭2개 이상 생성에 따른 수정
 * 1.4.0 (2017.10.19) : 예약시 인원선택 +- 버튼 기능 추가
 * 1.4.1 (2017.11.15) : 하나팩에서 선택관광 토글 .scheduleAco02 중복 클래스로 selector 변경
 *
 */

(function (scope) {
    if (scope.SCHEDULE !== undefined) return;

    var SCHEDULE = {};

    scope.SCHEDULE = SCHEDULE;
})(window);

$(document).ready(function () {
    initTip();
    initTab();
    initContent();
    initFixedBar();
    initHrefPop();
    //initVideo(); //개발에서 호출

    SCHEDULE.initCalendar = function () {
        if (typeof Hanatour_components_calendar === 'undefined') return;
        
        //상품 출발일
        var y = JSCHEDULE.pkgMstDate.substr(0,4);
        var m = JSCHEDULE.pkgMstDate.substr(4,2);
        var d = JSCHEDULE.pkgMstDate.substr(6,2);
        
        var calendar = new Hanatour_components_calendar();
        calendar.init($('#datepicker'), {
            numberOfMonths: [1, 1],
            minDate: "+3d",     //minDate - 오늘 부터 3일 후 예약 가능(변경 되면 JSCHEDULE.getPKGOtherListCalendarApi의 getAgoDate(0,0,3)함수 도 변경 되어 야 함)
            yearSuffix: '년 ',
            monthSuffix: '월',
            onSelect : function (date) {
                JSCHEDULE.pageCnt = 1;
                JSCHEDULE.getPKGOtherListProductApi(date.replaceAll("-","").substring(0,8));    //다른 출발이 조회 - (yyyy-mm-dd(요일) >> yyyymmdd 변경)
                setData("package_mst_startDate",date.replaceAll("-","").substring(0,8));
                JSCHEDULE.pkgMstDate = date.replaceAll("-","").substring(0,8);
            },
            addUpdate : function (container) {
                var datepickers = container.container;
                var calendarHeader = $('.popCalenderBox > .calenderTop');
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
                var calendarHeader = $('.popCalenderBox > .calenderTop');

                calendarHeader.on('click.calendar', '.prevMonth', function (e) {
                    JSCHEDULE.yyyyMmDd = new Array();
                    
                    var target = $(e.currentTarget);
                    var prevMm = target[0].innerHTML.substring(0, target[0].innerHTML.length-1);
                    var prevDt = "";
                    if(Number(prevMm) < 10 ){
                        prevMm = "0"+prevMm;
                    }

                    //오늘 부터 이전 달로는 갈 수 없음
                    if(prevMm == "12"){
                        prevDt = (Number($(".calenderTop > strong").text().substring(0,4)) - 1)+""+prevMm;
                    } else {
                        prevDt = $(".calenderTop > strong").text().substring(0,4)+""+prevMm;
                    }
                    
                    if( Number(prevDt) >= Number(getAgoDate(0,0,0).replaceAll("-","").substring(0,6))){
                        JSCHEDULE.getPKGOtherListCalendarApi(prevDt , "click");
                        
                        datepickers.find('.ui-datepicker-prev').trigger('click');
                        JSCHEDULE.pkgMstDate = JSCHEDULE.yyyyMmDd1;
                        var y1 = JSCHEDULE.pkgMstDate.substring(0,4);
                        var m1 = JSCHEDULE.pkgMstDate.substring(4,6); 
                        var d1 = JSCHEDULE.pkgMstDate.substring(6,8); 
                        
                        var ins1 = $('#datepicker').getInstance();
                        ins1.setDate(new Date(y1, m1 - 1 , d1));    //페이지 진입시 date 설정
                    }
                });

                calendarHeader.on('click.calendar', '.nextMonth', function (e) {
                    JSCHEDULE.yyyyMmDd = new Array();
                     
                    var target = $(e.currentTarget);
                    var nextMm = target[0].innerHTML.substring(0, target[0].innerHTML.length-1);
                    if(Number(nextMm) < 10 ){
                        nextMm = "0"+nextMm;
                    }
                    
                    datepickers.find('.ui-datepicker-next').trigger('click');
                    JSCHEDULE.getPKGOtherListCalendarApi($(".calenderTop > strong").text().substring(0,4)+""+ nextMm , "click");
                    JSCHEDULE.pkgMstDate = JSCHEDULE.yyyyMmDd1;
                    var y1 = JSCHEDULE.pkgMstDate.substring(0,4);
                    var m1 = JSCHEDULE.pkgMstDate.substring(4,6); 
                    var d1 = JSCHEDULE.pkgMstDate.substring(6,8); 
                    
                    var ins1 = $('#datepicker').getInstance();
                    ins1.setDate(new Date(y1, m1 - 1 , d1));    //페이지 진입시 date 설정
                });
            },
            extendBeforeShowDay : calShowYn
        }); //{} jquery ui 옵션 확장
        
        //<!-- 1.3.3
        var ins = $('#datepicker').getInstance();
        ins.setDate(new Date(y, m - 1 , d));    //페이지 진입시 date 설정
        //--> 1.3.3
    };
    
   // var cnt = 0;
    function calShowYn(date){
        var returnVal = false; 
        
        var mm = date.getMonth() + 1;
        mm = mm < 10 ? "0"+mm : mm;
        var dd = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
        
        if($.inArray(date.getFullYear()+""+mm+dd , JSCHEDULE.yyyyMmDd ) > -1 ){ //inArray(검색 값, 배열) - 조건 만족 시 index 값 return
            returnVal = true;
        }       
        return returnVal;
    }

    //상단 스와이프
    SCHEDULE.initGallerySwiper = function (targetContainer) {
        var swiper;

        //중복 방지 초기화 //add 1.3.1
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
                    verticalMode(slide, img); //add 1.3.2
                },
                onSlideChangeStart: function (data) {
                    swiperChange(data);
                },
                onSliderMove: function (data) {
                    swiperChange(data);
                },
                onTransitionEnd: function (data) {
                    swiperChange(data);
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

        //세로 모드 지원 //add 1.3.2
        function verticalMode(slide, img) {
            var tImg = new Image();
            tImg.src = img.src;

            if (tImg.height > tImg.width) {
                var slideDIV = $(slide);
                slideDIV.addClass('column'); //position: absolute; left: 0; top: 50%; margin-top: -91px; height: auto;
                slideDIV.find('> img').css('height', ''); //vh설정 해제 //add 1.3.5

                var img = slideDIV.find('> img');
                img.css('marginTop', -img.height() * .5);
            }
        }

        //iframe 내부에서 vh 재대로 잡지 못하는 문제 해결 //add 1.3.5
        var vh = ($(window).width() / 9) * 16;
        $('.scTopSlide .swiper-slide').css('height', vh * 0.32);
        $('.scTopSlide .swiper-slide > img').css('height', vh * 0.32);

        function swiperChange(data) {
            var container = data.container;
            var max = container.find('.swiper-pagination > span').length;
            var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

            container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);
        }
    }
    SCHEDULE.initGallerySwiper($('.scheduleBox > .swiper-container'));
    SCHEDULE.initGallerySwiper($('.sche_tabCont li.hotelSpecial > .swiper-container')); //일정표 5일차 호텔 swiper

    //프리모드 스와이프
    SCHEDULE.initFreeSwiper = function (targetContainer, options) {        
        var swiper;

        //중복 방지 초기화 //add 1.3.1
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
    SCHEDULE.initFreeSwiper($('.swiperMov'), {slidesPerView: 1.85, spaceBetween: 10, width: 221 * 1.63});
    SCHEDULE.initFreeSwiper($('.scCouponBanner'), {slidesPerView: 1.03, spaceBetween: 9});
    SCHEDULE.initFreeSwiper($('.scThemeCard > .swiper-container'), {slidesPerView: 2.3 , spaceBetween: 8, slidesOffsetBefore: 12, slidesOffsetAfter: 12}); //add 1.3.7

    //스와이프 리셋
    SCHEDULE.resetSwiper = function (targetContainer) {
        targetContainer.find('.swiper-container-horizontal').each(function () {
            //swiper 초기화
            var swiper = $(this)[0].swiper;
            if (swiper !== undefined) {
                swiper.destroy(false, true);
                new Swiper(swiper.container, swiper.params);
            }
        });
    };

    //말풍선
    function initTip() {
        var btnA = $('a.qna_second');
        btnA.on('click', function (e) {
            var target = $(e.currentTarget);
            var tip = target.next('div.qnaPopTxt');

            //열는 상황이면 
            if (!target.hasClass('on')) {
                //기존 있으면 닫기
                if ($('.qnaPopTxt').not(':hidden').length > 0) $('.qnaPopTxt').not(':hidden').prev('a.on').removeClass('on');

                target.addClass('on');

                //열기
                tip.find('> a').on('click.tip', function (e) {
                    $(this).closest('div').prev('a.on').removeClass('on');
                });

                //그외 영역 터치 시 팝업 닫기
                $(document).on('touchstart.tip', function (e) {
                    var target = $(e.target)

                    if (target.closest('.qnaPopTxt').length === 0 && !target.hasClass('qna_second')) {
                        $('.qnaPopTxt').not(':hidden').prev('a.on').removeClass('on');    
                    }
                });
                
                //TODO 3초 후 팝업 닫기 - ys
                setTimeout(function(){
                    target.removeClass('on');
                    tip.find('> a').off('click.tip');
                    $(document).off('touchstart.tip');
                }, 3000);
            } else {
                target.removeClass('on');
                tip.find('> a').off('click.tip');
                $(document).off('touchstart.tip');
            }

            e.preventDefault();
        });
    }

    //탭
    function initTab() {
        if (typeof WTab === 'undefined') return;

        var header = $('#commonArea_header').length > 0 ? $('#commonArea_header') : $('#header'); //로고 메뉴 물고있는 header
        var tabDIV = $('.sche_tabMenu'); //일정표 fixed 메뉴
        var scheduleWrap = $('.scheduleTabSect');
        var appDownBanner = $('#areaHeaderAppDownBanner').length > 0 ? $('#areaHeaderAppDownBanner') : $('.topBannerApp'); //앱다운배너 //add 1.2
        var appDownBannerH = (appDownBanner.not(':hidden').length > 0) ? appDownBanner.outerHeight() : 0; //앱다운배너 높이 //add 1.3.4

        var tab = new WTab();
        tab.init({target: tabDIV, selector: '> li > a', onTag: 'li', content: tabDIV.nextAll('div.sche_tabCont'), onChange: function (data) {
            SCHEDULE.resetSwiper(data.content);
            $(window).scrollTop(scheduleWrap.offset().top - tabDIV.outerHeight() - appDownBannerH); //modify 1.3.4, aappDownBannerH 추가
        }});

        var acoTab, acoTab2, grayAcoTab, scheTab, btmAcoTab, hsTabSectTab;
        tabDIV.nextAll('div.sche_tabCont').each(function (idx) {
            //상품정보, 참고사항 - 화살표탭 
            acoTab = new WTab();
            acoTab.init({target: $(this).find('.scheduleAco'), selector: '> dt > a', onlyOpen: false, onTag: 'dt', onClass: 'open'});

            //선택관광 //midify 1.3.9
            $(this).find('.scheduleAco02').each(function () {
                acoTab2 = new WTab();
                acoTab2.init({target: $(this), selector: 'dt > a', onlyOpen: false, onTag: 'dt', onClass: 'open'}); //modify 1.4.1 '> dt > a' -> 'dt > a'
            });

            //일정 - n일차 ~ 
            grayAcoTab = new WTab();
            grayAcoTab.init({target: $(this).find('.scDayList'), selector: '> dt > a', onlyOpen: false, onTag: 'dt', onClass: 'open'});

            //일정 - 간략일정표, 상세일정표
            scheTab = new WTab();
            scheTab.init({target: $(this).find('.sche02_inTab'), selector: '> li > a', onTag: 'li', content: $(this).find('.sche02_inTab').nextAll('div')});
            
            //일정 - 관련영상, 여행도시 정보
            btmAcoTab = new WTab();
            btmAcoTab.init({target: $(this).find('.sc_btmAco'), selector: '> a', onlyOpen: false, onTag: 'a', onClass: 'open', onChange: function (data) {
                var swiper = data.target.next('div').find('.swiper-container-horizontal')[0].swiper;
                if (swiper !== undefined) {
                    //swiper.destroy(false, true);
                    //new Swiper(swiper.container, swiper.params);
                    swiper.update(); //위치 초기화 때문에 불안정 하지만 update() 로
                }
            }});

            //일정 - 호텔소개, 객실시설, 부대시설 
            hsTabSectTab = new WTab();
            hsTabSectTab.init({target: $(this).find('.hsTabSect'), selector: 'ul > li > a', onTag: 'li', content: $(this).find('.hsTabSect > div')});
            hsTabSectTab.setCloseAll();
            hsTabSectTab.setOpen(0);
        });

        //스크롤에 따른 탭 fixed
        $(window).on('scroll.tabmenu', function(e) {
            $(window).triggerHandler('scroll.dotcom'); //trigger -> triggerHandler //modify 1.3 
            //WDDO.scrollYpos = (document.documentElement.scrollTop !== 0) ? document.documentElement.scrollTop : document.body.scrollTop;

            var st = WDDO.scrollYpos;
            var tabTop;

            appDownBannerH = (appDownBanner.not(':hidden').length > 0) ? appDownBanner.outerHeight() : 0; //add 1.2

            //장바구니,예약대기 메뉴
            var floatMenu = $('.fixSdBtn');
            if(st >= $(document).height()- $(window).height()){
                floatMenu.hide();
            }else{
                floatMenu.show();
            }
            
            if (scheduleWrap.offset().top < st + header.outerHeight() + appDownBannerH) {
                //넘어서면
                tabTop = (header.length > 0) ? (52 + appDownBannerH) : 0; //탭의 

                tabDIV.addClass('fixed').css('top', tabTop);
                scheduleWrap.css('paddingTop', tabDIV.outerHeight());
            } else {
                //넘어서지 않으면
                tabDIV.removeClass('fixed');
                scheduleWrap.css('paddingTop', '');
            }
        });
    }

    //기타 컨텐츠 컨트롤
    function initContent() {
        //adBanner autoplay //add 1.3.8
        var adBanner = $('#adBanner');
        if (adBanner.length > 0) {
            var adSwiper = adBanner[0].swiper;
            if (adSwiper !== undefined) {
                adSwiper.params.autoplay = 3500;
                adSwiper.startAutoplay();
            }
        }
        
        //간략일정 - 예정호텔 더보기
        $('.hotel_inforBox .plusBtn').on('click', function (e) {
            var target = $(e.currentTarget);

            target.toggleClass('open');
            target.parent().toggleClass('open');

            e.preventDefault();
        });

        //선택관광 > 모두접기
        $('.pad-12').on('click', '.graBtn', function (e) {
            $(this).closest('.yellowBox').siblings('.scheduleAco02').getInstance().setCloseAll();
            
            $(this).text("모두 펼치기");
            $(this).attr("id" , "open");
        });
        
        //TODO 선택관광 > 모두펼치기
        $('.pad-12').on('click', '#open', function (e) {
            $(this).closest('.yellowBox').siblings('.scheduleAco02').getInstance().setOpen();
            
            $(this).text("모두 접기");
            $(this).attr("id" , "close");
        });

        //참고사항 > 모두접기
        $('.mar-12').on('click', '.graBtn', function (e) {
            $(this).closest('.yellowBox').siblings('.scheduleAco').getInstance().setCloseAll();
            
            $(this).text("모두 펼치기");
            $(this).attr("id" , "open");
        });
        
        //참고사항 > 모두펼치기
        $('.mar-12').on('click', '#open', function (e) {
            $(this).closest('.yellowBox').siblings('.scheduleAco').getInstance().setOpen();
            
            $(this).text("모두 접기");
            $(this).attr("id" , "close");            
        });

        //일정 - 호텔 - 접기, 펼치기
        $('.hsBtn.on').removeClass('on').each(function () {
            $(this).contents().eq(0).replaceWith('펼치기');
        });
        $('.txtBox.open').removeClass('open');
        
        $('.sche_tabCont').on('click', '.hsBtmBox .hsBtn', function (e) {
            var target = $(e.currentTarget);
            var content = target.prev('.txtBox');

            if (!target.hasClass('on')) {
                target.addClass('on').contents().eq(0).replaceWith('접기');
                content.addClass('open');
            } else {
                target.removeClass('on').contents().eq(0).replaceWith('펼치기');
                content.removeClass('open');
            }
            
            e.preventDefault();
        });
    }

    //하단에 장바구니/예약하기 바
    function initFixedBar() {
        var fixedBar = $('.fixSdBtn');
        var bookingBtn = fixedBar.find('> a.basic');
        var dim = fixedBar.next('.scPopDim');
        var pop = fixedBar.find('> .peopleLayer');

        bookingBtn.on('click', function (e) {
            pop.show();
            dim.show();

            pop.find('.scPopClose').one('click', function (e) {
                pop.hide();
                dim.hide();
            });

            e.preventDefault();
        });

        pop.on('click', '.btnBox > div > button', function (e) {
            var target = $(e.currentTarget);
            var manySTRONG = target.parent().prev('strong');
            var manyText = manySTRONG.text();
            var reg = /\d+/i;
            var personnal = parseInt(manyText.match(reg));
            var idx = target.closest('li').index();
            var replaceText;

            if (!isNaN(personnal)) {
                if (target.hasClass('plus')) {
                    replaceText = manyText.replace(reg, Math.min(personnal + 1, 10) );
                } else if (target.hasClass('minus')) {
                    replaceText = manyText.replace(reg, Math.max(personnal - 1, (idx === 0 ? 1: 0)) ); //성인은 기본 1
                }

                if (replaceText !== undefined) {
                    manySTRONG.text(replaceText);
                    manySTRONG.toggleClass('zero', parseInt(replaceText) === 0);
                }
            }
        });
    }

    function initHrefPop() {
        var linkTag = $('a.popUpFull');

        linkTag.on('click', function (e) {
            var target = $(e.currentTarget);
            var loadURL = $(this).attr('href');
        
            DOTCOM.openLoadPop({
                target : target,
                url : loadURL,
                browserHeight : ($(window).width() / 9) * 16 //add 1.3.5
            });

            e.preventDefault();
        });

        //WTab을 target이 body 적용 보단 #overlayPanel 나을꺼 같아서 body 아래 미리 추가
        //$('body').append('<div id="overlayPanel"></div>');
    }

    //일정 - 관련영상, href 의 vimeo, youtube url 토대로 이미지 로드해서 넣기
    SCHEDULE.initVideo = function () {
        $('.swiperMov .swiper-slide > a').each(function () {
            var url = $(this).attr('href');
            var vurl;

            if (url.match('vimeo') !== null) {
            //비메오
                vurl = url.match(/vimeo.com[\/video|\/]+([0-9]+)/i);

                if (vurl !== null && vurl.length > 1) loadVimeoJson(vurl[1]);
            } else if (url.match('youtu') !== null) {
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

        //vimeo json 로드
        function loadVimeoJson(vid) {
            var ajaxUrl = 'http://vimeo.com/api/v2/video/' + vid + '.json';
            $.ajax({
                url: ajaxUrl,
                dataType: "jsonp",
                jsonp: "callback"
            }).done(function (data) {
                var img = data[0]['thumbnail_medium'];
                
                settingAtag(img, vid);
            }).fail(function (data) {}); 
        }

        //youtube 영상 섭네일 & 비디오 전용 url 치환
        function loadYoutubeThumbnail(vid, url) {
            var img = 'http://img.youtube.com/vi/' + vid + '/mqdefault.jpg';
            //var newUrl = url.replace(/youtu.*\//g, 'www.youtube.com/watch?v='); //영상만있는 url 로 치환

            var aTag = settingAtag(img, vid, url);
            aTag.attr('target', '_blank');
        }
        
        /**
         * 영상리스트 스와이프에 쓸 a 태그 생성
         *
         * @param img      ::: 섭네일 이미지
         * @param id       ::: 영상 id
         * @param url      ::: 비디오 url
         */
        function settingAtag(img, id, url) {
            var a = $('.swiperMov .swiper-slide a[href*="' + id + '"]:first');

            a.append('<span><img src="' + img + '"></span>');

            if (url !== undefined) a.attr('href', url);

            return a;
        }
    }

    //이미지 확대
    SCHEDULE.initZoom = function (targetContainer) {
        var container = targetContainer || $('.zoomBox').not(':hidden'); //보이는 것만, modify 1.2
        container.on('click', 'a', function (e) {
            $('.zoomWrap').remove();

            var zoomDIV = $('<div class="zoomWrap"></div>'); //div.zoomContainer 생성 하고 부모만 생성, modify 1.2
            var closeBtn = zoomDIV.find('.closeBtn');
            var parentTaget = ($('#overlayPanel').not(':hidden').length > 0) ? $('#overlayPanel') : $('#wrap');
            
            //div css 초기화
            zoomDIV.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 99
            }).data('st', $(window).scrollTop());

            container.find('img').clone().appendTo(zoomDIV); //이미지를 위 div에 추가
            $('body').append(zoomDIV);  //div body에 추가
            parentTaget.hide();         //내용 숨김
            
            //smartzoom 라이브러리 초기화
            zoomDIV.find('img').smartZoom({'containerClass':'zoomContainer'});

            zoomDIV.swipe({
                tap:function(event, target) {
                    //console.log('tab');
                    var st = parseInt(zoomDIV.data('st'));

                    zoomDIV.find('img').smartZoom('destroy'); //smartzoom 삭제
                    zoomDIV.off('.tap').remove();             //생성한 div 삭제

                    parentTaget.show();
                    $(document).scrollTop(st);
                },
                doubleTap:function(event, target) {
                    //console.log('doubleTab');
                },
                threshold:50
            });
        });
    }
    
    $('.zoomBox').each(function () {
        SCHEDULE.initZoom($(this));
    });
});

//http://www.jqueryscript.net/zoom/Smart-jQuery-Pan-Zoom-Plugin-Smart-jQuery-Zoom.html  
function transitionEnd(){var e=document.createElement("bootstrap");var t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in t){if(e.style[n]!==undefined){return{end:t[n]}}}return false}(function(e){e.fn.smartZoom=function(t){function r(e){}function s(e,t){var r=n.data("smartZoomData");if(r.currentWheelDelta*t<0)r.currentWheelDelta=0;r.currentWheelDelta+=t;i.zoom(r.mouseWheelDeltaFactor*r.currentWheelDelta,{x:e.pageX,y:e.pageY})}function o(e){e.preventDefault()}function u(){var e=n.data("smartZoomData");if(e.settings.mouseMoveEnabled!=true||e.settings.moveCursorEnabled!=true)return;var t=S();var r=t.width/e.originalSize.width;if(parseInt(r*100)>parseInt(e.adjustedPosInfos.scale*100))n.css({cursor:"move"});else n.css({cursor:"default"})}function a(e){m(e.pageX,e.pageY)}function f(t){t.preventDefault();e(document).on("mousemove.smartZoom",l);e(document).bind("mouseup.smartZoom",c);var r=n.data("smartZoomData");r.moveCurrentPosition=new A(t.pageX,t.pageY);r.moveLastPosition=new A(t.pageX,t.pageY)}function l(e){var t=n.data("smartZoomData");if(t.mouseMoveForPan||!t.mouseMoveForPan&&t.moveCurrentPosition.x!=e.pageX&&t.moveCurrentPosition.y!=e.pageY){t.mouseMoveForPan=true;v(e.pageX,e.pageY,0,false)}}function c(t){var r=n.data("smartZoomData");if(r.mouseMoveForPan){r.mouseMoveForPan=false;if(r.moveLastPosition.distance(r.moveCurrentPosition)>4){var i=r.moveLastPosition.interpolate(r.moveCurrentPosition,-4);v(i.x,i.y,500,true)}else{v(r.moveLastPosition.x,r.moveLastPosition.y,0,true)}}else if(r.settings.zoomOnSimpleClick){m(t.pageX,t.pageY)}e(document).unbind("mousemove.smartZoom");e(document).unbind("mouseup.smartZoom")}function h(t){t.preventDefault();e(document).unbind("touchmove.smartZoom");e(document).unbind("touchend.smartZoom");e(document).bind("touchmove.smartZoom",p);e(document).bind("touchend.smartZoom",d);var r=t.originalEvent.touches;var i=r[0];var s=n.data("smartZoomData");s.touch.touchMove=false;s.touch.touchPinch=false;s.moveCurrentPosition=new A(i.pageX,i.pageY);s.moveLastPosition=new A(i.pageX,i.pageY);s.touch.lastTouchPositionArr=new Array;var o;var u=r.length;for(var a=0;a<u;++a){o=r[a];s.touch.lastTouchPositionArr.push(new A(o.pageX,o.pageY))}}function p(e){e.preventDefault();var t=n.data("smartZoomData");var r=e.originalEvent.touches;var s=r.length;var o=r[0];if(s==1&&!t.touch.touchPinch&&t.settings.touchMoveEnabled==true){if(!t.touch.touchMove){var u=t.touch.lastTouchPositionArr[0];if(u.distance(new A(o.pageX,o.pageY))<3){return}else t.touch.touchMove=true}v(o.pageX,o.pageY,0,false)}else if(s==2&&!t.touch.touchMove&&t.settings.pinchEnabled==true){t.touch.touchPinch=true;var a=r[1];var f=t.touch.lastTouchPositionArr[0];var l=t.touch.lastTouchPositionArr[1];var c=new A(o.pageX,o.pageY);var h=new A(a.pageX,a.pageY);var p=c.distance(h);var d=f.distance(l);var m=p-d;if(Math.abs(m)<3)return;var g=new A((c.x+h.x)/2,(c.y+h.y)/2);var y=S();var b=t.originalSize;var w=y.width/b.width;var E=p/d;var x=y.width*E/b.width;i.zoom(x-w,g,0);t.touch.lastTouchPositionArr[0]=c;t.touch.lastTouchPositionArr[1]=h}}function d(t){t.preventDefault();var r=t.originalEvent.touches.length;if(r==0){e(document).unbind("touchmove.smartZoom");e(document).unbind("touchend.smartZoom")}var i=n.data("smartZoomData");if(i.touch.touchPinch)return;if(i.touch.touchMove){if(i.moveLastPosition.distance(i.moveCurrentPosition)>2){var s=i.moveLastPosition.interpolate(i.moveCurrentPosition,-4);v(s.x,s.y,500,true)}}else{if(i.settings.dblTapEnabled==true&&i.touch.lastTouchEndTime!=0&&(new Date).getTime()-i.touch.lastTouchEndTime<400){var o=i.touch.lastTouchPositionArr[0];m(o.x,o.y)}i.touch.lastTouchEndTime=(new Date).getTime()}}function v(e,t,i,s){g(r.PAN);var o=n.data("smartZoomData");o.moveLastPosition.x=o.moveCurrentPosition.x;o.moveLastPosition.y=o.moveCurrentPosition.y;var u=n.offset();var a=S();var f=u.left+(e-o.moveCurrentPosition.x);var l=u.top+(t-o.moveCurrentPosition.y);var c=y(f,l,a.width,a.height);x(r.PAN,r.START,false);E(n,c.x,c.y,a.width,a.height,i,s==true?function(){x(r.PAN,r.END,false)}:null);o.moveCurrentPosition.x=e;o.moveCurrentPosition.y=t}function m(e,t){var r=n.data("smartZoomData");var s=r.originalSize;var o=S();var u=o.width/s.width;var a=r.adjustedPosInfos.scale;var f=parseFloat(r.settings.dblClickMaxScale);var l;if(u.toFixed(2)>f.toFixed(2)||Math.abs(f-u)>Math.abs(u-a)){l=f-u}else{l=a-u}i.zoom(l,{x:e,y:t})}function g(t){var r=n.data("smartZoomData");if(r.transitionObject){if(r.transitionObject.cssAnimHandler)n.off(e.support.transition,r.transitionObject.cssAnimTimer);var i=r.originalSize;var s=S();var o=new Object;o[r.transitionObject.transition]="all 0s";if(r.transitionObject.css3dSupported){o[r.transitionObject.transform]="translate3d("+s.x+"px, "+s.y+"px, 0) scale3d("+s.width/i.width+","+s.height/i.height+", 1)"}else{o[r.transitionObject.transform]="translateX("+s.x+"px) translateY("+s.y+"px) scale("+s.width/i.width+","+s.height/i.height+")"}n.css(o)}else{n.stop()}u();if(t!=null)x(t,"",true)}function y(e,t,r,i){var s=n.data("smartZoomData");var o=Math.min(s.adjustedPosInfos.top,t);o+=Math.max(0,s.adjustedPosInfos.top+s.adjustedPosInfos.height-(o+i));var u=Math.min(s.adjustedPosInfos.left,e);u+=Math.max(0,s.adjustedPosInfos.left+s.adjustedPosInfos.width-(u+r));return new A(u.toFixed(2),o.toFixed(2))}function b(e){n.unbind("load.smartZoom");i.init.apply(n,[e.data.arguments])}function w(){var e=n.data("smartZoomData");var t=e.containerDiv;var r=e.originalSize;var i=t.parent().offset();var s=C(e.settings.left,i.left,t.parent().width());var o=C(e.settings.top,i.top,t.parent().height());t.offset({left:s,top:o});t.width(N(e.settings.width,t.parent().width(),s-i.left));t.height(N(e.settings.height,t.parent().height(),o-i.top));var a=L(t);var f=Math.min(Math.min(a.width/r.width,a.height/r.height),1).toFixed(2);var l=r.width*f;var c=r.height*f;e.adjustedPosInfos={left:(a.width-l)/2+i.left,top:(a.height-c)/2+i.top,width:l,height:c,scale:f};g();E(n,e.adjustedPosInfos.left,e.adjustedPosInfos.top,l,c,0,function(){n.css("visibility","visible")});u()}function E(t,r,i,s,o,u,a){var f=n.data("smartZoomData");var l=f.containerDiv.offset();var c=r-l.left;var h=i-l.top;if(f.transitionObject!=null){var p=f.originalSize;var d=new Object;d[f.transitionObject.transform+"-origin"]="0 0";d[f.transitionObject.transition]="all "+u/1e3+"s ease-out";if(f.transitionObject.css3dSupported)d[f.transitionObject.transform]="translate3d("+c+"px, "+h+"px, 0) scale3d("+s/p.width+","+o/p.height+", 1)";else d[f.transitionObject.transform]="translateX("+c+"px) translateY("+h+"px) scale("+s/p.width+","+o/p.height+")";if(a!=null){f.transitionObject.cssAnimHandler=a;t.one(e.support.transition.end,f.transitionObject.cssAnimHandler)}t.css(d)}else{t.animate({"margin-left":c,"margin-top":h,width:s,height:o},{duration:u,easing:f.settings.easing,complete:function(){if(a!=null)a()}})}}function S(e){var t=n.data("smartZoomData");var r=n.width();var i=n.height();var s=n.offset();var o=parseInt(s.left);var u=parseInt(s.top);var a=t.containerDiv.offset();if(e!=true){o=parseInt(o)-a.left;u=parseInt(u)-a.top}if(t.transitionObject!=null){var f=n.css(t.transitionObject.transform);if(f&&f!=""&&f.search("matrix")!=-1){var l;var c;if(f.search("matrix3d")!=-1){c=f.replace("matrix3d(","").replace(")","").split(",");l=c[0]}else{c=f.replace("matrix(","").replace(")","").split(",");l=c[3];o=parseFloat(c[4]);u=parseFloat(c[5]);if(e){o=parseFloat(o)+a.left;u=parseFloat(u)+a.top}}r=l*r;i=l*i}}return{x:o,y:u,width:r,height:i}}function x(e,t,i){var s=n.data("smartZoomData");var o="";if(i==true&&s.currentActionType!=e){o=s.currentActionType+"_"+r.END;s.currentActionType="";s.currentActionStep=""}else{if(s.currentActionType!=e||s.currentActionStep==r.END){s.currentActionType=e;s.currentActionStep=r.START;o=s.currentActionType+"_"+s.currentActionStep}else if(s.currentActionType==e&&t==r.END){s.currentActionStep=r.END;o=s.currentActionType+"_"+s.currentActionStep;s.currentActionType="";s.currentActionStep=""}}if(o!=""){var u=jQuery.Event(o);u.targetRect=S(true);u.scale=u.targetRect.width/s.originalSize.width;n.trigger(u)}}function T(){var t=document.body||document.documentElement;var n=t.style;var r=["transition","WebkitTransition","MozTransition","MsTransition","OTransition"];var i=["transition","-webkit-transition","-moz-transition","-ms-transition","-o-transition"];var s=["transform","-webkit-transform","-moz-transform","-ms-transform","-o-transform"];var o=r.length;var u;for(var a=0;a<o;a++){if(n[r[a]]!=null){var transformStr=s[a];var f=e('<div style="position:absolute;">Translate3d Test</div>');e("body").append(f);u=new Object;u[s[a]]="translate3d(20px,0,0)";f.css(u);var css3dSupported=f.offset().left-e("body").offset().left==20;f.empty().remove();if(css3dSupported){return{transition:i[a],transform:s[a],css3dSupported:css3dSupported}}}}return null}function N(e,t,n){if(e.search&&e.search("%")!=-1)return(t-n)*(parseInt(e)/100);else return parseInt(e)}function C(e,t,n){if(e.search&&e.search("%")!=-1)return t+n*(parseInt(e)/100);else return t+parseInt(e)}function k(){w()}function L(e){var t=e.offset();if(!t)return null;var n=t.left;var r=t.top;return{x:n,y:r,width:e.outerWidth(),height:e.outerHeight()}}function A(e,t){this.x=e;this.y=t;this.toString=function(){return"(x="+this.x+", y="+this.y+")"};this.interpolate=function(e,t){var n=t*this.x+(1-t)*e.x;var r=t*this.y+(1-t)*e.y;return new A(n,r)};this.distance=function(e){return Math.sqrt(Math.pow(e.y-this.y,2)+Math.pow(e.x-this.x,2))}}var n=this;r.ZOOM="SmartZoom_ZOOM";r.PAN="SmartZoom_PAN";r.START="START";r.END="END";r.DESTROYED="SmartZoom_DESTROYED";var i={init:function(t){if(n.data("smartZoomData"))return;var settings=e.extend({top:"0",left:"0",width:"100%",height:"100%",easing:"smartZoomEasing",initCallback:null,maxScale:3,dblClickMaxScale:1.8,mouseEnabled:true,scrollEnabled:true,dblClickEnabled:true,mouseMoveEnabled:true,moveCursorEnabled:true,adjustOnResize:true,touchEnabled:true,dblTapEnabled:true,zoomOnSimpleClick:false,pinchEnabled:true,touchMoveEnabled:true,containerBackground:"#FFFFFF",containerClass:""},t);var r=n.attr("style");var i="smartZoomContainer"+(new Date).getTime();var u=e('<div id="'+i+'" class="'+settings.containerClass+'"></div>');n.before(u);n.remove();u=e("#"+i);u.css({overflow:"hidden"});if(settings.containerClass=="")u.css({"background-color":settings.containerBackground});u.append(n);var l=new Object;l.lastTouchEndTime=0;l.lastTouchPositionArr=null;l.touchMove=false;l.touchPinch=false;n.data("smartZoomData",{settings:settings,containerDiv:u,originalSize:{width:n.width(),height:n.height()},originalPosition:n.offset(),transitionObject:T(),touch:l,mouseWheelDeltaFactor:.15,currentWheelDelta:0,adjustedPosInfos:null,moveCurrentPosition:null,moveLastPosition:null,mouseMoveForPan:false,currentActionType:"",initialStyles:r,currentActionStep:""});w();if(settings.touchEnabled==true)n.bind("touchstart.smartZoom",h);if(settings.mouseEnabled==true){if(settings.mouseMoveEnabled==true)n.bind("mousedown.smartZoom",f);if(settings.scrollEnabled==true){u.bind("mousewheel.smartZoom",s);u.bind("mousewheel.smartZoom DOMMouseScroll.smartZoom",o)}if(settings.dblClickEnabled==true&&settings.zoomOnSimpleClick==false)u.bind("dblclick.smartZoom",a)}document.ondragstart=function(){return false};if(settings.adjustOnResize==true)e(window).bind("resize.smartZoom",k);if(settings.initCallback!=null)settings.initCallback.apply(this,n)},zoom:function(e,t,i){var s=n.data("smartZoomData");var o;var a;if(!t){var f=L(s.containerDiv);o=f.x+f.width/2;a=f.y+f.height/2}else{o=t.x;a=t.y}g(r.ZOOM);var l=S(true);var c=s.originalSize;var h=l.width/c.width+e;h=Math.max(s.adjustedPosInfos.scale,h);h=Math.min(s.settings.maxScale,h);var p=c.width*h;var d=c.height*h;var v=o-l.x;var m=a-l.y;var b=p/l.width;var w=l.x-(v*b-v);var T=l.y-(m*b-m);var N=y(w,T,p,d);if(i==null)i=700;x(r.ZOOM,r.START,false);E(n,N.x,N.y,p,d,i,function(){s.currentWheelDelta=0;u();x(r.ZOOM,r.END,false)})},pan:function(e,t,i){if(e==null||t==null)return;if(i==null)i=700;var s=n.offset();var o=S();var u=y(s.left+e,s.top+t,o.width,o.height);if(u.x!=s.left||u.y!=s.top){g(r.PAN);x(r.PAN,r.START,false);E(n,u.x,u.y,o.width,o.height,i,function(){x(r.PAN,r.END,false)})}},destroy:function(){var t=n.data("smartZoomData");if(!t)return;g();var i=t.containerDiv;n.unbind("mousedown.smartZoom");n.bind("touchstart.smartZoom");i.unbind("mousewheel.smartZoom");i.unbind("dblclick.smartZoom");i.unbind("mousewheel.smartZoom DOMMouseScroll.smartZoom");e(window).unbind("resize.smartZoom");e(document).unbind("mousemove.smartZoom");e(document).unbind("mouseup.smartZoom");e(document).unbind("touchmove.smartZoom");e(document).unbind("touchend.smartZoom");n.css({cursor:"default"});i.before(n);E(n,t.originalPosition.left,t.originalPosition.top,t.originalSize.width,t.originalSize.height,5);n.removeData("smartZoomData");i.remove();n.attr("style",t.initialStyles);n.trigger(r.DESTROYED)},isPluginActive:function(){return n.data("smartZoomData")!=undefined}};if(i[t]){return i[t].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof t==="object"||!t){if(n[0].tagName.toLowerCase()=="img"&&!n[0].complete){n.bind("load.smartZoom",{arguments:arguments[0]},b)}else{i.init.apply(n,[arguments[0]])}}else{e.error("Method "+t+" does not exist on e-smartzoom jquery plugin")}}})(jQuery);(function(e){e.extend(e.easing,{smartZoomEasing:function(t,n,r,i,s){return e.easing["smartZoomOutQuad"](t,n,r,i,s)},smartZoomOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n}})})(jQuery);(function(e){function t(t){var n=t||window.event,r=[].slice.call(arguments,1),i=0,s=true,o=0,u=0;t=e.event.fix(n);t.type="mousewheel";if(n.wheelDelta){i=n.wheelDelta/120}if(n.detail){i=-n.detail/3}u=i;if(n.axis!==undefined&&n.axis===n.HORIZONTAL_AXIS){u=0;o=-1*i}if(n.wheelDeltaY!==undefined){u=n.wheelDeltaY/120}if(n.wheelDeltaX!==undefined){o=-1*n.wheelDeltaX/120}r.unshift(t,i,o,u);return(e.event.dispatch||e.event.handle).apply(this,r)}var n=["DOMMouseScroll","mousewheel"];if(e.event.fixHooks){for(var r=n.length;r;){e.event.fixHooks[n[--r]]=e.event.mouseHooks}}e.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var e=n.length;e;){this.addEventListener(n[--e],t,false)}}else{this.onmousewheel=t}},teardown:function(){if(this.removeEventListener){for(var e=n.length;e;){this.removeEventListener(n[--e],t,false)}}else{this.onmousewheel=null}}};e.fn.extend({mousewheel:function(e){return e?this.bind("mousewheel",e):this.trigger("mousewheel")},unmousewheel:function(e){return this.unbind("mousewheel",e)}})})(jQuery);$.fn.emulateTransitionEnd=function(e){var t=false,n=this;$(this).one($.support.transition.end,function(){t=true});var r=function(){if(!t)$(n).trigger($.support.transition.end)};setTimeout(r,e);return this};$(function(){$.support.transition=transitionEnd()})

/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.15
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var ret,event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null!==options.pinchThreshold?pinchDistance>=options.pinchThreshold:!0}function validateSwipeTime(){var result;return result=options.maxTimeThreshold?!(duration>=options.maxTimeThreshold):!0}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&DOUBLE_TAP_THRESHOLD>distance}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){return maximumsMap[direction]?maximumsMap[direction].distance:void 0}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return 1>pinchZoom?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return 0>angle&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return 45>=angle&&angle>=0?LEFT:360>=angle&&angle>=315?LEFT:angle>=135&&225>=angle?RIGHT:angle>45&&135>angle?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.15",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(this,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(this,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});