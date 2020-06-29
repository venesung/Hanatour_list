/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0.3
 * @since : 2016.11.10
 *
 * history
 * 
 * 1.0   (2016.11.10) :
 * 1.0.1 (2017.04.05) : #searchMyBooking 팝업에 내부 인풋 포커스시 스크롤 튀는 문제 해결
 * 1.0.2 (2017.06.23) : 달력 다구간 추가
 * 1.0.3 (2017.10.24) : 언어 선택 로직 추가
 *
 */

(function (scope) {
    if (scope.GLOBALFLIGHT !== undefined) return;

    var GLOBALFLIGHT = {};

    scope.GLOBALFLIGHT = GLOBALFLIGHT;
})(window);

(function ($) {
    $(document).ready(function () {
        var wrapDIV = $('#wrap');
        var header = $('#header');
        var searchContainerDIV = $('.ht_listBox');
        var menuDIV = $('#userPanel');
        var dimedDIV = $('.mask');
        var footer = $('footer');

        initEvent();
        initToggle();           //공통 toggle
        initHrefPop();          //페이지 로드 팝업 초기화

        initHeader();           //해더
        //initTopMenu();          //상단 탭 메뉴 //개발에서 처리
        initFooter();           //푸터 

        initSearchResult();     //검색결과
        initPassengersInfo();   //여행자정보

        /**********************************************************************************************
         ********************************************* 공통 *******************************************
         **********************************************************************************************/

        //공통 toggle
        function initToggle() {
            var targetDIV = $('div.pb_toggle');

            var tab;
            targetDIV.each(function () {
                var target = $(this);

                if (typeof target.getInstance !== 'undefined' && target.getInstance() !== undefined) return;

                tab = new WToggle();
                tab.init({target: target, selector: '> .tabList > li > a', 'onTag': 'li', onClass: 'on', content: target, contentSelector: '> div.tabCont'});
            });
        }
        GLOBALFLIGHT.initToggle = initToggle;

        function initEvent() {
            //브라우저 높이 계산을 위한 이벤트
            $(window).on('resize.globalflight', function (e) {
                WDDO.browserHeight = $(window).height();
            }).triggerHandler('resize.globalflight');

            $(document).on('scroll.globalflight', function (e) {
                if (footer.length > 0 && !footer.is(':hidden')) { //푸터 플로딩 영역
                    //notic, top 플로딩 (공통)
                    var threshold = $(this).scrollTop() + WDDO.browserHeight - footer.find('.notics').height() + 1;
                    footer.find('> ul').toggleClass('static', footer.offset().top < threshold);

                    //퀵메뉴 플로딩
                    var quickMenuDIV = $('.btmQuickMenu');
                    if (quickMenuDIV.length > 0) {
                        var quickMenuUL = quickMenuDIV.find('> ul');
                        var callBtnA = quickMenuDIV.find('> a');

                        if ($(this).scrollTop() + WDDO.browserHeight - quickMenuUL.height() > callBtnA.offset().top + callBtnA.outerHeight()) {
                            quickMenuUL.addClass('static');
                        } else {
                            quickMenuUL.removeClass('static');
                        }
                    }
                }
            });


            //입력창
            //if ('ontouchstart' in window) {
                $(document).on('focusin.globalflight', 'input, textarea, select', function (e) {
                    $('body').addClass('fixfixed');
                });
                $(document).on('focusout.globalflight', 'input, textarea, select', function (e) {
                    $('body').removeClass('fixfixed');
                });
            //}
        }

        //페이지 로드 팝업
        function initHrefPop() {
            var linkTagA = $('a.popComeup');

            linkTagA.on('click', function (e) {
                var target = $(e.currentTarget);
                var loadURL = $(this).attr('href');
            
                DOTCOM.openLoadPop({
                    target : target,
                    url : loadURL,
                    parent : $('body > #wrap')
                });

                e.preventDefault();
            });

            $('body').on('open.loadpop', '#overlayPanel', function (e, data) {
                //달력 스크롤 이동
                var popupTarget = $('#overlayPanel');
                var datepickerTarget = $('.popContainer > .calenderCont');
                var selectMonthDIV = datepickerTarget.find('.ui-state-active').closest('.ui-datepicker-group');
                if (datepickerTarget.length > 0 && selectMonthDIV.length > 0) { //달력팝업인지 체크 
                    var ypos = selectMonthDIV.offset().top;
                    var distance = datepickerTarget.offset().top;

                    popupTarget.attr('data-scrolltop', ypos - distance);
                }
            });
        }

        //오른쪽 메뉴
        function initHeader() {
            header.on('click.globalflight', 'a.btnRight', function (e) {
                var target = $(e.currentTarget);

                menuDIV.addClass('slideIn');
                dimedDIV.show();

                dimedDIV.one('click.globalflight', function (e) {
                    menuDIV.removeClass('slideIn');
                    dimedDIV.hide();
                });

                e.preventDefault();
            });

            menuDIV.on('click.globalflight', 'a.booking', function (e) {
                var target = $(e.currentTarget);

                showLayerPopup($('#searchMyBooking'));

                e.preventDefault();
            });

            //언어 선택 //add 1.0.3
            menuDIV.on('click.globalflight', 'button.btnNation', function (e) {
                var target = $(e.currentTarget);
                var popup = $('#languageLayer');

                var idx = target.find('> .icoNation.on').index();
                popup.find('.languagePop > label:eq('+idx+') > input[name="nation"]').prop('checked', true);

                showLayerPopup(popup);

                e.preventDefault();
            });
        }

        //상단 탭 메뉴
        /*
        function initTopMenu() {
            var tab = new WToggle();
            tab.init({target: $('nav.mainTap'), selector: '> ul > li > a', onTag: 'li', content: $('#container'), contentSelector: '> .mainTabCont > div:not(".banner")'});
        }
        */

        //푸터
        function initFooter() {
            footer.on('click.globalflight', '.notics > a', function (e) {
                var target = $(e.currentTarget);
                var content = target.next('.noticsLayel');

                content.show().one('click.globalflight', 'a.noticsClose', function (e) {
                    $(this).closest('.noticsLayel').hide();

                    e.preventDefault();
                });

                e.preventDefault();
            });
        }

        //레이어팝업 열기
        function showLayerPopup(target) {
            target.show();
            wrapDIV.css('height', $(window).height()); //add 1.0.1

            target.one('click.globalflight', '.layerClose', function (e) {
                var target = $(e.currentTarget);
                var pop = target.closest('.layer_inner').parent();

                pop.hide();
                wrapDIV.css('height', ''); //add 1.0.1

                e.preventDefault();
            });
        }

        /**
         * 책갈피 효과
         * @param {Object} options
         */
        function setBookMark(options) {
            var opts = $.extend({
                target : $(jQuery.fn),      //스크롤 영역
                btnSelector : '',           //버튼
                contentSelector : '',       //컨텐츠
            }, options);

            var container = opts.target;

            container.each(function (i) {
                //$(this).find(opts.btnSelector).each(function (n) {
                //    $(this).attr('href', '#bookmark'+ i + '_' + n);
                //});

                //$(this).find(opts.contentSelector).each(function (n) {
                //    $(this).attr('id', 'bookmark' + i + '_' + n);
                //});
                //
                var that = $(this);

                that.on('click.bookmark', opts.btnSelector, function (e) {
                    var target = $(e.currentTarget);
                    var idx = target.parent().index();

                    var content = that.find(opts.contentSelector);

                    if (content.length > 0) {
                        content.eq(idx).get(0).scrollIntoView();
                        //content.eq(idx).focus();

                        //console.log(content.eq(idx).position().top, content.eq(idx).offset().top, container.scrollTop())
                        //var ypos = content.eq(idx).position().top + container.scrollTop() - content.parent().prevAll().outerHeight() - 30 - 10;
                        //container.scrollTop(ypos);
                    }

                    e.preventDefault();
                });
            });            
        }

        /**********************************************************************************************
         ****************************************** 검색 결과 *****************************************
         **********************************************************************************************/

        function initSearchResult() {
            var searchListContainerDIV = $('.searchSect');
            
            if (searchListContainerDIV.length === 0) return;

            searchListContainerDIV.on('click.globalflight', 'a.detailTog', function (e) {
                var target = $(e.currentTarget);

                target.toggleClass('on', !target.hasClass('on'));

                e.preventDefault();
            });

            searchListContainerDIV.on('click.globalflight', 'a.chSelect', function (e) {
                $(this).next('a.detailTog').trigger('click.globalflight');

                e.preventDefault();
            });
        }

        /**********************************************************************************************
         ***************************************** 여행자 정보 ****************************************
         **********************************************************************************************/

        function initPassengersInfo() {
            var passInfoContainerDIV = $('.pass_informaiton');

            passInfoContainerDIV.on('click.globalflight', '> dl > dt > a', function (e) {
                var target = $(e.currentTarget);

                target.closest('dt').toggleClass('open');

                e.preventDefault();
            });
        }

        /**********************************************************************************************
         **************************************** 외부 제공 함수 **************************************
         **********************************************************************************************/
        
        GLOBALFLIGHT.initCitySearch = function () {
            //console.log('initCitySearch');
        };

        GLOBALFLIGHT.initPeople = function () {
            var containerDIV = $('.slideUpPop').not(':hidden');
            var totalSTRONG = containerDIV.find('.numTxt > strong');
            var iconSPAN = containerDIV.find('.peopleNum > span');
            var max = 9;

            var checkTotal = function () {
                var num = 0;
                totalSTRONG.each(function () {
                    num += parseInt( $(this).text() );
                });

                return num
            };

            var checkIcon = function () {
                totalSTRONG.each(function (idx) {
                    var cls =  iconSPAN.eq(idx).attr('class');

                    iconSPAN.eq(idx).attr('class', cls.substr(0, cls.length - 1) + $(this).text());
                });
            };

            var checkBaby = function () {
                //성인이 줄어들면 같이 유아 줄어들어야 함, 유아가 성인 인원수 초과 할수 없음
                var adultNum = parseInt(totalSTRONG.eq(0).text());
                var babyNum = parseInt(totalSTRONG.eq(2).text());

                if (babyNum > adultNum){
                	totalSTRONG.eq(2).text(adultNum); //유아가 크면 성인과 같도록
                	//유아인원은 성인인원수를 초과하여 선택할 수 없습니다.
                	if(JLayerPopup.notification)JLayerPopup.notification(JMsg.main_validation_passenger_infants);
                }
            }

            containerDIV.on('click.globalflight', 'a.plusBtn, a.delBtn', function (e) {
                var target = $(e.currentTarget);
                var resultArea = target.siblings('.numTxt').find('> strong');
                var num = parseInt(target.siblings('.numTxt').find('> strong').text());
                var idx = target.closest('.peopleBtn').index();

                if (target.hasClass('plusBtn')) {
                    if (checkTotal() < max){
                    	num += 1;	
                    }else{
                    	//선택 가능한 인원수를 초과 하였습니다. 예약 인원은 9명을 넘을 수 없습니다.
                    	if(JLayerPopup.notification)JLayerPopup.notification(JMsg.main_validation_passenger_max);
                    }
                } else if (target.hasClass('delBtn')) {
                    if (checkTotal() > 0 && num > 0) num -= 1;
                }

                if (idx === 0 && num === 0) num = 1; //성인 1이하 제한

                resultArea.text(num);
                checkBaby();
                checkIcon();

                e.preventDefault();
            });

            checkIcon();
        };

        //information.html //Fare Rules 버튼 클릭 시 뜨는 팝업 
        GLOBALFLIGHT.initFareRules = function () {
            var containerDIV = $('.popFareRules');
            
            initToggle();

            setBookMark({
                target : containerDIV.find('.linksBox'),
                btnSelector : '> ul > li > a',
                contentSelector : '> .linksBoxTxt > p'
            });
        };

        //information.html //Fare Rules | Terms & Conditons 버튼 클릭 시 뜨는 팝업
        //mypage01.html //T&C 버튼 클릭 시 뜨는 팝업 
        GLOBALFLIGHT.initFareTerms = function () {
            var containerDIV = $('.popFareTerms');

            containerDIV.on('click.globalflight', 'a.btnTerms', function (e) {
                var target = $(e.currentTarget);
                var content = target.siblings('.linksBox');
                var content2 = target.siblings('.termsTxt');
                var isOpen = target.hasClass('on');
                
                target.toggleClass('on', !isOpen);
                content.toggle(!isOpen);
                content2.toggleClass('open', !isOpen);

                e.preventDefault();
            });

            setBookMark({
                target : containerDIV.find('.linksBox'),
                btnSelector : '> ul > li > a',
                contentSelector : '> .linksBoxTxt > p'
            });
        };
        
        //pop_qna.html //initPassengersInfo() 와 동일 로직
        GLOBALFLIGHT.initQna = function () {
            var passInfoContainerDIV = $('.popFareRules');
            
            initToggle();

            passInfoContainerDIV.on('click.globalflight', '.tabCont > dl > dt > a', function (e) {
                var target = $(e.currentTarget);

                target.closest('dt').toggleClass('open');

                e.preventDefault();
            });
        }

        //달력
        GLOBALFLIGHT.initCalendar = function (options) {
            if (typeof Hanatour_components_calendar === 'undefined') return;

            var JCode = window.JCode || {};

            var datepickerTarget = $('.popContainer > .calenderCont');

            var dayArr = JCode.weekDayVer3 || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var monthArr = JCode.month || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var dateFormat = JCode.dateFormat || 'DD, mm/dd/yy';
            var resultDIV = (document.frm !== undefined && document.frm.ItnrType.value != "OW") ? $('.header .cldHeadBox > div.calenderHead') : $('.header .cldHeadBox > div.calenderHead').not(':hidden');
            var isRange = resultDIV.length > 1;
            var middleCount = (isRange && resultDIV.length > 1) ? resultDIV.length - 2 : 0; //add 1.0.2
            var drawResult = function (data) {
                resultDIV.removeClass('on');

                if ($.isArray(data)) {
                    //인자가 array 형태
                    $(data).each(function (idx) {
                        if (data !== undefined && data.length > idx) resultDIV.eq(idx).addClass('on').find('> em').text(data[idx]);
                    });
                } else {
                    //인자가 date 객체
                    if (data !== undefined && data.length !== 0) resultDIV.eq(0).addClass('on').find('> em').text(data);
                }
            };

            var opts = $.extend({}, {
                numberOfMonths: [12, 1],
                minDate: '+0d',
                maxDate: '+1y',
                yearSuffix: ' ',
                dateFormat : dateFormat,
                dayNames: dayArr,
                dayNamesShort: dayArr,
                dayNamesMin: dayArr,
                showMonthAfterYear: false,
                range: isRange,
                rangeMiddleCount : middleCount, //다구간 시 0 이상의 값 //add 1.0.2
                onRange : function (dateArr) {
                    drawResult(dateArr);
                },
                onSelect : function (date) {
                    if (!isRange && middleCount === 0) { //기간설정과 다구간이 아닌경우 (편도)
                        drawResult(date);
                    }
                },
                addUpdate : function (container) {
                    var datepickers = container.container;
                    var titleDIV = datepickers.find('.ui-datepicker-title');
                    var dayTHEAD = datepickers.find('thead');
                    var yearSPAN = titleDIV.find('span.ui-datepicker-year');
                    var monthSPAN = titleDIV.find('span.ui-datepicker-month');

                    dayTHEAD.remove();

                    monthSPAN.each(function (idx) {
                        var month = parseInt($(this).text()) - 1;
                        $(this).text(monthArr[month]);
                    });
                },
                addEvent : function (container) {
                    //var datepickers = container.container;
                    //var calendarHeader = $('.popCalenderBox > .calenderTop');
                }
            }, options);

            datepickerTarget.on('complete.wddo', function (e, data) {
                var year = data.ins.selectedYear;
                var month = data.ins.selectedMonth;
                var day = data.ins.selectedDay;

                var formatDate = $.datepicker.formatDate(dateFormat, new Date(year, month, day), opts);
                drawResult(formatDate);
            });

            var calendar = new Hanatour_components_calendar();
            calendar.init(datepickerTarget, opts); //{} jquery ui 옵션 확장

            function getForce2Digits(value) {
                return (value < 10) ? '0' + value.toString() : value.toString();
            }
        };

        GLOBALFLIGHT.initFilter = function () {
            var popConatinerDIV = $('.slideUpPop');
            var filterHeaderDIV = popConatinerDIV.find('> .header > .filterTop');
            var filterContainerDIV = popConatinerDIV.find('> .popContainer > .filterCont');

            if (filterContainerDIV.length === 0) return;

            //ResetAll
            filterHeaderDIV.on('click.globalflight', '> a.black', function (e) {
                var content = filterContainerDIV.find('.ft_inCont');
                var slider = filterContainerDIV.find('.slider');

                filterContainerDIV.find('ul.ftList > li').addClass('on');
                filterContainerDIV.find('input[type="checkbox"]').prop('checked', true);
                
                if (slider.length > 0) {
                    slider.each(function () {
                        var min = $(this).slider('option', 'min');
                        var max = $(this).slider('option', 'max');

                        $(this).slider('values', [ min, max ]);
                    });
                }
                
                e.preventDefault();
            });
           
            //라운드 네모 토글
            filterContainerDIV.on('click.globalflight', 'ul.ftList > li > a', function (e) {
                $(this).closest('li').toggleClass('on');

                e.preventDefault();
            });

            //more 버튼
            filterContainerDIV.on('click.globalflight', 'a.btnLabel', function (e) {
                var target = $(e.currentTarget);

                if (!target.hasClass('on')) {
                    target.addClass('on').closest('.chekLabelList').addClass('open');
                } else {
                    target.removeClass('on').closest('.chekLabelList').removeClass('open');
                }
                

                e.preventDefault();
            });

            //doller slider
            var doller = $('.priceSlider > .sliderBtmTxt > span').text().substr(0, 1);

            var changePriceText = function (e, ui) {
                var target = $(e.target);
                var valueSPAN = target.next('.sliderBtmTxt').find('> span');

                var idx = $(ui.handle).index() - 1;
                var min = String(ui.values[0]).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
                var max = String(ui.values[1]).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

                valueSPAN.eq(0).text(doller + ' ' + min);
                valueSPAN.eq(1).text(doller + ' ' + max);
            };

            var priceSlider = filterContainerDIV.find('.priceSlider > .slider');
            priceSlider.each(function () {
                var sliderTarget = $(this);
                var min = parseInt(sliderTarget.next('.sliderBtmTxt').find('> span:eq(0)').text().replace(/[^\d]+/g, ''));
                var max = parseInt(sliderTarget.next('.sliderBtmTxt').find('> span:eq(1)').text().replace(/[^\d]+/g, ''));

                sliderTarget.slider({
                    range: true,
                    step: 10,
                    min: min,
                    max: max,
                    values: [min, max],
                    slide: function(e, ui) {
                        changePriceText(e, ui);
                    },
                    change: function (e, ui) {
                        changePriceText(e, ui);
                    }
                });
            });

            //hh:mm:ss to totalseconds
            function getTotalSeconds(time)
            {
                var ts = time.split(':');
                return Date.UTC(1970, 0, 1, ts[0], ts[1], ts[2]) / 1000;
            }

            var changeSecondsToTime = function (seconds) {
                return {
                    hh : Math.floor(seconds / 3600),
                    mm : Math.floor(seconds / 60) % 60,
                    ss : Math.floor(seconds) % 60,
                };
            };

            var changeTimeText = function (e, ui) {
                var target = $(e.target);
                var valueSPAN = target.next('.sliderBtmTxt').find('> span');
                var idx = $(ui.handle).index() - 1;

                //초를 hh mm ss 로 변환
                var seconds = ui.values[idx];

                var timeObj = changeSecondsToTime(seconds);

                //valueSPAN.eq(idx).text(hh + 'h' + ((mm === 0) ? '' : ' ' + mm + 'm' ));
                valueSPAN.eq(idx).text(force2Digits(timeObj.hh) + 'h ' + force2Digits(timeObj.mm) + 'm');
            };

            //time slider
            var timeSlider = filterContainerDIV.find('.departureSlider > .slider, .returnSlider > .slider');
            timeSlider.each(function () {
                var sliderTarget = $(this);

                var min = getTotalSeconds(sliderTarget.next('.sliderBtmTxt').find('> span:eq(0)').text().replace(/[^\d]+/g, ':') + '00')
                var max = getTotalSeconds(sliderTarget.next('.sliderBtmTxt').find('> span:eq(1)').text().replace(/[^\d]+/g, ':') + '00')
                
                sliderTarget.slider({
                    range: true,
                    step: 60 * 1,
                    min: min,
                    max: max,
                    values: [min, max],
                    slide: function(e, ui) {
                        changeTimeText(e, ui);
                    },
                    change: function (e, ui) {
                        changeTimeText(e, ui);
                    }
                });
            });
        };

        GLOBALFLIGHT.initGallerySwiper = (function () {return new SwiperTemplate().initGallerySwiper})(); 
        GLOBALFLIGHT.initFreeSwiper = (function () {return new SwiperTemplate().initFreeSwiper})(); 
        GLOBALFLIGHT.resetSwiper = (function () {return new SwiperTemplate().resetSwiper})(); 

        //GLOBALFLIGHT.initGallerySwiper($('.airevent01 .swiper-container'), {});    //호텔 - 메인 - 하단 기획전 //hotel_main01
        //GLOBALFLIGHT.initGallerySwiper($('.htDetailTop > .swiper-container:eq(0)'), {viewport: true});   //호텔 - 호텔상세 - 상단비주얼 //hotel_sub03
        //
        var matrixToArray = function(str){
            return str.split( '(')[ 1].split( ')')[ 0].split( ',') ;
        };

        var scheduleTimeId;
        var changeScheduleInfo = function () {
            var container = $('.swipeCityRarr').length > 0 ? $('.swipeCityRarr') : $('.tripCity_multi');
            var swiper = container[0].swiper;

            var bgWidth = container.find('.swipeBar').width();
            var bar = container.find('.swipeBar > .bar');

            //컨텐츠 넓이 정의
            var cw = 0;
            container.find('.swiper-slide').each(function () {
                cw += $(this).outerWidth();
            });

            //스크롤 전체 넓이
            var sw = swiper.width;

            //바넓이 정의
            var bh = Math.floor(getLinearFunction(0, cw, 0, sw, sw));
            bar.css('width', bh);

            //숨김 유무
            container.toggleClass('threeType', !(sw > bh));

            var trans = container.find('.swiper-wrapper').css('transform');

            if (trans && $.isArray(matrixToArray(trans)) && trans.length > 5) {
                var xpos = parseInt(matrixToArray(trans)[4]);
                var value = Math.floor(getLinearFunction(0, cw, 0, sw, xpos));
                
                bar.css('left', -value);
            }
        };

        //mypage02
        GLOBALFLIGHT.initFreeSwiper($('.swipeCityRarr'), {resistanceRatio:0, slidesPerView: 'auto', 
            onTransitionStart : function () {
                if (scheduleTimeId !== undefined) {
                    clearInterval(scheduleTimeId);
                    scheduleTimeId = undefined;
                }

                scheduleTimeId = setInterval(changeScheduleInfo, 10);
            },
            onTransitionEnd: function () {
                if (scheduleTimeId !== undefined) {
                    clearInterval(scheduleTimeId);
                    scheduleTimeId = undefined;
                }
            },
            onSliderMove : changeScheduleInfo,
            onInit : function (data) {
                $(window).on('orientationchange', function(){
                    changeScheduleInfo();
                });

                changeScheduleInfo();
            }
        });

        //search_list_multi
        GLOBALFLIGHT.initFreeSwiper($('.tripCity_multi'), {resistanceRatio:0, slidesPerView: 'auto', 
            onTransitionStart : function () {
                if (scheduleTimeId !== undefined) {
                    clearInterval(scheduleTimeId);
                    scheduleTimeId = undefined;
                }

                scheduleTimeId = setInterval(changeScheduleInfo, 10);
            },
            onTransitionEnd: function () {
                if (scheduleTimeId !== undefined) {
                    clearInterval(scheduleTimeId);
                    scheduleTimeId = undefined;
                }
            },
            onSliderMove : changeScheduleInfo,
            onInit : function (data) {
                $(window).on('orientationchange', function(){
                    changeScheduleInfo();
                });

                changeScheduleInfo();
            }
        });

    });

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

    /**
     * 숫자 1자릿수 앞에 0 붙이기
     */
    function force2Digits(value) {
        return (value < 10) ? '0' + value.toString() : value.toString();
    }

    /*!
     * @author : Jo Yun Ki (ddoeng@naver.com)
     * @version : 2.0
     * @since : 2015.11.09
     *
     * history
     *
     * 1.2   (2015.12.10) : setNext(), setPrev(), opts.onClass 추가 
     * 1.2.1 (2015.12.11) : getOptions() 추가
     * 1.3   (2016.04.18) : opts.onlyOpen = true 기본값 고정, otps.contentSelector 추가
     * 2.0   (2016.05.16) : init()시 opts.selector 가 없어도 초기화 될수 있도록 수정
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
     *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
     *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
     *   onChange:Function = fun(event)          //텝 변경 콜백함수
     *   onChangeParams:Array = []               //텝 변경 콜백함수 인자
     *   behavior:Boolean = false                //기본 비헤이비어 삭제 유무, 기본은 막음
     *
     * method
     *   .setCloseAll()                          //모두 닫기
     *   .setOpen(idx)                           //열기
     *   .setCallback(change, param)             //콜백 설정
     *   .setNext()                              //다음
     *   .setPrev()                              //이전
     *   .getOptions()                           //옵션객체 반환
     */
    ;var WToggle=(function(b){var a=function(r){var p,i,c,e=d(),o=function(s){c=b.extend(e,s);if(c.target.length>0&&c.target.data("scope")===undefined){if(c.target.data("scope")===undefined){c.target.data("scope",p)}h();q()}};function d(){return{target:b(b.fn),selector:"",onTag:"li",onClass:"on",onlyOpen:true,behavior:false,content:b(b.fn),contentSelector:"",onChange:undefined,onChangeParams:[]}}function h(){}function q(){if(c.selector===""){c.target.on("click.toggle",s)}else{c.target.on("click.toggle",c.selector,s)}function s(w){var v=b(w.currentTarget);l();i=j(c.content,c.contentSelector);var t=parseInt(v.data("toggle-idx"));var u=(c.onTag==="a")?v:v.closest(c.onTag);if(u.hasClass(c.onClass)){if(c.onlyOpen){}else{g(t);n(t)}}else{if(c.onlyOpen){g();n();k(t);f(t)}else{k(t);f(t)}}if(c.onChange!==undefined){c.onChange.apply(this,[{target:v,idx:t,content:i.eq(t),params:c.onChangeParams}])}c.target.trigger("change.toggle",[{target:v,idx:t,content:i.eq(t),params:c.onChangeParams}]);if(!c.behavior){w.preventDefault();w.stopPropagation()}}}function l(){j(c.target,c.selector).each(function(s){b(this).data("toggle-idx",s)})}function j(t,s){return(s!==""&&s!==undefined)?t.find(s):t}function k(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a")?u:u.closest(c.onTag);t.addClass(c.onClass)}function g(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a")?u:u.closest(c.onTag);t.removeClass(c.onClass)}function f(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.show()}function n(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.hide()}function m(s){return Math.max(Math.min(s,j(c.target,c.selector).length-1),0)}return{init:function(s){p=this;o(s)},setCloseAll:function(){g();n()},setOpen:function(s){k(s);f(s)},setCallback:function(t,s){c.onChange=t;if(s!==undefined){c.onChangeParams=s}},setNext:function(){var s=parseInt(j(c.target,c.selector).closest("."+c.onClass).data("toggle-idx"));var t=m(s+1);if(!isNaN(s)){j(c.target,c.selector).eq(t).trigger("click.toggle")}},setPrev:function(){var t=parseInt(j(c.target,c.selector).closest("."+c.onClass).data("toggle-idx"));var s=m(t-1);if(!isNaN(t)){j(c.target,c.selector).eq(s).trigger("click.toggle")}},getOptions:function(){return c}}};return a}(jQuery));

    /**
    * Swiper 템플릿
    *
    * @author : Jo Yun Ki (ddoeng@naver.com)
    * @version : 1.1
    * @since : 2016.11.11
    *
    * history
    *   1.0 (2016.11.11) : -
    *   1.1 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
    *                      resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
    *                      initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
    *
    *
    * PUBLIC.method = (function () {return new SwiperTemplate()})(); 
    */
    (function(b){if(b.SwiperTemplate!==undefined){return}var a=(function(d){var c=function(){var e,h;var k={};function g(p,o){var n=p.container;var m=n.find(".swiper-pagination > span").length;var l=n.find(".swiper-pagination .swiper-pagination-bullet-active").index();n.find(".swiper-pag-num").html("<span>"+(l+1)+"</span> / "+m);if(k.exChange!==undefined){k.exChange(p,o)}}function j(){if(h.length>0&&h.is(".swiper-container-horizontal")){e=h[0].swiper;if(e!==undefined){e.destroy(false,true)}}}function i(l,o){var n=new Image();n.src=o.src;if(n.height>n.width){var m=d(l);m.addClass("column");m.find("img").css("height","");var o=m.find("img");o.css("marginTop",-o.height()*0.5)}}function f(m){var l=m.container;var n=(d(window).width()/9)*16;l.find(".swiper-container .swiper-slide").css("height",n*0.32);l.find(".swiper-container .swiper-slide img").css("height",n*0.32)}return{initGallerySwiper:function(n,l){h=n;j();var m;var o={viewport:false,pagination:h.find(".swiper-pagination"),loop:((h.find(".swiper-slide").length>1)?true:false),preloadImages:false,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(r,p,q){i(p,q)},onSlideChangeStart:function(p){g(p,"onSlideChangeStart")},onSliderMove:function(p){g(p,"onSliderMove")},onTransitionEnd:function(p){g(p,"onTransitionEnd")},onInit:function(p){g(p,"onInit");if(m.viewport){f(p)}}};if(h.find(".swiper-slide").length===1){h.find(".swiper-pagination").hide()}h.each(function(p){m=d.extend({},o,l);e=new Swiper(d(this),m)});h.find("a.big5_prev").on("click.city",function(r){var q=d(r.currentTarget);var p=q.closest(".swiper-container")[0].swiper;p.slidePrev();g(p);r.preventDefault()});h.find("a.big5_next").on("click.city",function(r){var q=d(r.currentTarget);var p=q.closest(".swiper-container")[0].swiper;p.slideNext();g(p);r.preventDefault()})},initFreeSwiper:function(n,l){h=n;j();var m;var o={pagination:h.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true};h.each(function(p){m=d.extend({},o,l);e=new Swiper(d(this),m)})},resetSwiper:function(l){h=(l.hasClass("swiper-container-horizontal"))?l:l.find(".swiper-container-horizontal");h.each(function(){e=d(this)[0].swiper;if(e!==undefined){e.destroy(false,true);new Swiper(e.container,e.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);

    //DOCOM (common_new.js ver 2.0.4)
    !function(o){if(void 0===o.DOTCOM){if(void 0===o.ANI_EV){var e=document.createElement("div").style,i=function(){for(var o,i="t,webkitT,MozT,msT,OT".split(","),t=0,n=i.length;n>t;t++)if(o=i[t]+"ransform",o in e)return i[t].substr(0,i[t].length-1);return!1}();o.ANI_EV=function(){if(i===!1)return!1;var o={"":"webkitAnimationEnd",webkit:"webkitAnimationEnd",Moz:"AnimationEnd",O:"oAnimationEnd",ms:"MSAnimationEnd"};return o[i]}()}var t={setMask:function(o,e){o?"#overlayPanel"!==e&&($("body .ui-page").append('<div id="mask" class="mask"></div>'),void 0!==e&&WDDO.setDisableEvent(e.find(".innerScroller"))):($("#mask").remove(),WDDO.setEnableEvent($("body")))},fixedFixToggle:function(o,e){var i=o.find(".fixed");e?i.css({position:"absolute",top:o.scrollTop()}):i.css({position:"",top:""})},innerScrollToggle:function(o,e){var i=o.height()>WDDO.browserHeight;if(i)if(e){var t=o.attr("data-scrolltop");o.css({height:WDDO.browserHeight,"overflow-y":"auto"}),void 0!==t&&o.scrollTop(t)}else{var t=o.attr("data-scrolltop");o.css({height:"auto","overflow-y":""}).removeAttr("data-scrolltop"),void 0!==t&&$(window).scrollTop(t)}},openSlidePop:function(o,e){var i=$.extend({source:$(jQuery.fn),parent:$("#wrap"),browserHeight:WDDO.browserHeight},e);if(void 0!==o){var n=o;n.html(i.source.html()),n.css({"min-height":i.browserHeight,display:"block"}).data("st",$(window).scrollTop()),setTimeout(function(){t.innerScrollToggle(n,!0),t.fixedFixToggle(n,!0),n.addClass("slide slideUp").on(ANI_EV+".dotcom",function(){i.parent.hide(),$(window).scrollTop(0),n.css("height","auto").addClass("show").removeClass("slideUp slide").off(ANI_EV+".dotcom"),t.innerScrollToggle(n,!1),t.fixedFixToggle(n,!1)})},50)}},closeSlidePop:function(o,e){var i=$.extend({parent:$("#wrap")},e);if(void 0!==o){var n=o;if(n.attr("data-scrolltop",$(window).scrollTop()),t.innerScrollToggle(n,!0),t.fixedFixToggle(n,!0),i.parent.show(),n.css("height",WDDO.browserHeight).addClass("slide slideDown").one(ANI_EV+".dotcom",function(){t.innerScrollToggle(n,!1),t.fixedFixToggle(n,!1),n.attr("style","").removeClass("slideDown slide show").hide()}),void 0!==n.data("st")){var l=parseInt(n.data("st"));n.removeData("st"),setTimeout(function(){$(window).scrollTop(l)},1)}}},openLoadPop:function(o){function e(){return{url:void 0,effect:"slide"}}function i(){n(),l(),"slide"===c.effect&&t.openSlidePop(s,c),s.off("close.loadpop").trigger("open.loadpop",c)}function n(){s=$("#overlayPanel").length>0?$("#overlayPanel"):$('<div id="overlayPanel">'),$("body").append(s),void 0!==a&&s.html(a)}function l(){s.on("click",".closeOverlayPanel",function(o){$(o.currentTarget);"slide"===c.effect&&t.closeSlidePop(s,c),s.off("open.loadpop").trigger("close.loadpop",c)})}function r(){$.ajax({type:"GET",url:c.url,dataType:"text",success:function(o){a=o,i()},error:function(o,e,i){}})}var s,a,d=e(),c=$.extend({},d,o);r()}};o.DOTCOM=t}}(window);

    //WDDO ver 1.1.1
    !function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);
})(jQuery);

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };

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