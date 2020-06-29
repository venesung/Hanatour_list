/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2018.04.03
 *
 * 닷컴 - 해외 - 하나팩 - 상품상세검색
 * 
 * history
 * 
 * 1.0   (2018.04.03) : 
 *
 */

(function (scope) {
    if (scope.PRODUCT !== undefined) return;

    var PRODUCT = {
        //
    };

    scope.PRODUCT = PRODUCT;
})(window);

//페이지 진입 후 hash 따라 팝업 생성
$(window).on('load', function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') DOTCOM.locationHashChanged();
});

$(document).ready(function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);

    var header = $('#header');
    var wrapDIV = $('#wrap');
    var productContainerDIV = wrapDIV.find('#container');
    var isMain = $('.newPackMain_top').length > 0;

    var priceSliderTarget;
    var doller = '';
    var wonReg = new RegExp(/(\d)(?=(\d{3})+(?!\d))/, 'g');

    $('body').on('open.slidepop', '#overlayPanel', completePopup); //팝업모션 완료후 실행 함수 정의 
    $('body').on('open.loadpop', '#overlayPanel', initPopup); //팝업로드 완료후 실행 함수 정의 

    if ($.fn.lazyload) {
        $('img.lazy').lazyload({
            skip_invisible : true,
            threshold : Math.floor($(window).height() / 3),
            placeholder : null,
            load : function (max, options) {
                applyArea($(this).closest('.fullarea').find('img'));
            }
        });
    }

    if (isMain) {
        initMain();
    } else {
        initSort();         //정렬
        initTermsList();    //조건 리스트

        initTab();          //탭
        addEvent();         //이벤트
    }

    /**********************************************************************************************
     ********************************************* 메인 *******************************************
     **********************************************************************************************/

    function initMain() {
        //테마상품 BEST 3
        var bestTab = $('.tabList.packTab_theme').parent().getInstance();

        if (bestTab !== undefined) {
            bestTab.setOptions({
                onChange: function (data) {
                    new SwiperTemplate().resetSwiper(data.content.find('> .swiper-container'));
                }
            });
        }

        $('.newPackMain_btm > .pb_toggle > .tabCont').each(function () {
            new SwiperTemplate().initFreeSwiper($(this).find('> .swiper-container'), {preloadImages:true, slidesPerView: 1.75, slidesOffsetBefore: 15, slidesOffsetAfter: 15, spaceBetween: 10, areaClass: 'fullarea'});    
        });

        //하나팩 프리미엄
        //지역 탭 스와이프
        var menuSwiperTabContainer = $('.packMainPremium_swipe > .packMainPremium_tab.swiper-container');
        new SwiperTemplate().initFreeSwiper(menuSwiperTabContainer, {slidesPerView: 'auto', slidesOffsetBefore: 0, slidesOffsetAfter: 0, spaceBetween: 0});

        //지역 탭 클릭
        var regionTab = new WToggle();
        regionTab.init({target: $('.packMainPremium_swipe'), selector: '.swiper-container li.swiper-slide > a', onTag: 'li', onChange: function (data) {
            if (menuSwiperTabContainer.length > 0) {
                var tabSwiper = menuSwiperTabContainer[0].swiper;

                if (tabSwiper !== undefined) tabSwiper.slideTo(data.idx, 0);
            }

            if (menuSwiperContContainer.length > 0) {
                var contSwiper = menuSwiperContContainer[0].swiper;

                if (contSwiper !== undefined) contSwiper.slideTo(data.idx, 0);
            }
        }});

        //지역 컨텐츠 스와이프
        var menuSwiperContContainer = $('.packMainPremium_swipe > .packMainPremium_cont.swiper-container');
        new SwiperTemplate().initGallerySwiper(menuSwiperContContainer, {loop: false, resistance:true, resistanceRatio:0, exChange: function (data, event) {
            var idx = $(data.container).find('.' + data.params.bulletActiveClass).index();

            if (regionTab !== undefined) {
                regionTab.setCloseAll();
                regionTab.setOpen(idx);
            }

            if (menuSwiperTabContainer.length > 0) {
                var tabSwiper = menuSwiperTabContainer[0].swiper;

                if (tabSwiper !== undefined) tabSwiper.slideTo(idx, 0);
            }
        }});

        console.log( $('.packMainPremium_swipe > .packMainPremium_cont.swiper-container')[0].swiper );
    }

    /**********************************************************************************************
     ******************************************* 상품검색 *****************************************
     **********************************************************************************************/
    
    function addEvent() {
        $(document).on('scroll.product', function (e) {
            //
        });
    }

    //탭
    function initTab() {
        if (typeof WToggle !== 'undefined') {
            //var pinkArrow = new WToggle();
        }
    }

    //정렬
    function initSort() {
        //정렬 버튼 
        productContainerDIV.on('click.product', '.stTabBtn a.bg_ico02', function (e) {
            var target = $(e.currentTarget);
            var content = target.next('div.st_inBox');
            var txt = target.contents().eq(0).text();

            //버튼명에 따라 활성화
            content.find('> ul > li').removeClass('on').find('> a').filter(function () {return $(this).text() === txt}).closest('li').addClass('on');

            target.toggleClass('on');
            content.toggle(target.hasClass('on'));

            wrapDIV.toggleClass('zi_none02', target.hasClass('on'));

            e.preventDefault();
        });

        //정렬 종류 버튼
        productContainerDIV.on('click.product', 'div.st_inBox > ul > li > a', function (e) {
            var target = $(e.currentTarget);
            var txt = target.text();
            var content = target.closest('.st_inBox');
            var btn = content.prev('a.bg_ico02');

            target.closest('li').addClass('on').siblings('li.on').removeClass('on');
            btn.contents().eq(0).replaceWith(txt);
            if (!content.is(':hidden')) btn.trigger('click.product'); //닫기

            e.preventDefault();
        });
    }

    //조건리스트
    function initTermsList() {
        new SwiperTemplate().initFreeSwiper(productContainerDIV.find('.quickBtn_swiper .swiper-container'), {slidesPerView: 'auto', slidesOffsetBefore: 0, slidesOffsetAfter: 0, spaceBetween: 0});    

        //리스트옆 "초기화" 버튼
        productContainerDIV.on('click.product', '.btn_initialize > button', function (e) {
            var target = $(e.currentTarget);

            clearTermsList();

            if (PRODUCT.removeListItem !== undefined) PRODUCT.removeListItem({});

            e.preventDefault();
        });

        //x버튼
        productContainerDIV.find('.quickBtn_swiper').on('click.product', '.swiper-slide > button', function (e) {
            var target = $(e.currentTarget);
            var slideDiv = target.closest('.swiper-slide');
            var idx = slideDiv.index() - 1;

            if (PRODUCT.removeListItem !== undefined) PRODUCT.removeListItem({item: slideDiv});

            slideDiv.remove();

            var listSwiperContainer = productContainerDIV.find('.quickBtn_swiper .swiper-container');
            new SwiperTemplate().resetSwiper(listSwiperContainer);

            var swiper = listSwiperContainer[0].swiper;
            swiper.slideTo(idx, 0);

            checkClearList();
        });
    }

    //조건 팝업 내 컨텐츠
    function initTerms(detailDIV) {
        initPriceSlider(detailDIV);
        listToTerms(detailDIV);

        //조건 버튼들
        detailDIV.find('.pop_accodianBox > div').on('click.product', 'ul.pop_btnList > li > button', function (e) {
            var target = $(e.currentTarget);
            var li = target.closest('li');
            var lis = li.siblings().andSelf();

            if (li.index() !== 0) {
                li.toggleClass('on'); //활성화 토글

                lis.eq(0).removeClass('on'); //하나이상 선택되어 전체버튼 해제

                checkDefaultTerms(li);
            } else {
                //전체버튼 클릭 시
                li.siblings().filter('.on').find('> button').trigger('click.product');
            }

            e.preventDefault();
        });

        //상세검색 플로팅 버튼
        detailDIV.find('.pop_fixedBtn').on('click.product', '> a', function (e) {
            var target = $(e.currentTarget);

            if (target.index()) {
                //검색 적용
                applyTerms($(this).closest('.popReserve01'));
            } else {
                //초기화
                detailDIV.find('.pop_accodianBox > div > ul.pop_btnList').each(function () {
                    $(this).find('> li:first').find('> button').trigger('click.product');
                });

                changeSlider(priceSliderTarget);

                detailDIV.find('input.redCheck').prop('checked', false);

                if (PRODUCT.clearDetailSearch !== undefined) PRODUCT.clearDetailSearch({});
            }

            e.preventDefault();
        });
    }

    function initPriceSlider(detailDIV) {
        priceSliderTarget = detailDIV.find('#slider');

        if (priceSliderTarget.length > 0) {
            var currentPrice = priceSliderTarget.siblings('.slider_money').find('> span'); //html에서 설정값 얻기

            var minData = currentPrice.eq(0).text().match(/\d+/g); //12,000,000 -> ["12", "000", "000"]
            var maxData = currentPrice.eq(1).text().match(/\d+/g);
            var currentMin = (minData !== null) ? parseInt(minData.join('')) : 0; // ["12", "000", "000"] -> 12000000
            var currentMax = (maxData !== null) ? parseInt(maxData.join('')) : 99990000;

            doller = priceSliderTarget.siblings('.slider_money').find('> span').text().substr(0, 1);

            priceSliderTarget.slider({
                range: true,
                step: 10000,
                min: currentMin,
                max: currentMax,
                values: [currentMin, currentMax],
                slide: function(e, ui) {
                    changePrice(e, ui);
                }
            });

            function changePrice(e, ui) {
                var target = $(e.target);
                var valueSPAN = target.siblings('.slider_money').find('> span');

                var idx = $(ui.handle).index() - 1;

                changePriceText(target, ui.values[0], ui.values[1]);

                valueSPAN.eq(idx).addClass('on');
            }
        }
    }

    //슬라이드 변경
    function changeSlider(target, min, max) {
        if (target.length > 0) {
            var minValue = min || target.slider('option', 'min');
            var maxValue = max || target.slider('option', 'max');

            target.slider('option', 'values', [minValue, maxValue]);   //슬라이드 위치 변경 
            
            changePriceText(target, minValue, maxValue); //가격 텍스트 변경
        }
    }

    //슬라이드 값을 텍스트으로 변경
    function changePriceText(target, min, max) {
        var span = target.siblings('.slider_money').find('> span');
        span.removeClass('on');

        var minPrice = String(min).replace(wonReg, '$1,');
        var maxPrice = String(max).replace(wonReg, '$1,');

        span.eq(0).text(doller + ' ' + minPrice);
        span.eq(1).text(doller + ' ' + maxPrice);
    }

    function getPriceStatus() {
        if (priceSliderTarget.length > 0) {
            var defaultMinValue = priceSliderTarget.slider('option', 'min');
            var defaultMaxValue = priceSliderTarget.slider('option', 'max');
            var span = priceSliderTarget.siblings('.slider_money').find('> span');

            var minData = span.eq(0).text().match(/\d+/g); //12,000,000 -> ["12", "000", "000"]
            var maxData = span.eq(1).text().match(/\d+/g); 

            var minValue = '';
            var maxValue = '';

            if (minData !== null) minValue = minData.join(''); //["12", "000", "000"] -> 12000000
            if (maxData !== null) maxValue = maxData.join('');

            //console.log('min', defaultMinValue, parseInt(minValue));
            //console.log('max', defaultMaxValue, parseInt(maxValue));

            return {
                same : (defaultMinValue === parseInt(minValue) && defaultMaxValue === parseInt(maxValue)), 
                min: minValue.match(/\d+(?=0000)/g).toString().replace(wonReg, '$1,'),  //12000000 -> 1200 -> 1,200
                max: maxValue.match(/\d+(?=0000)/g).toString().replace(wonReg, '$1,'),
                wmin: minValue,
                wmax: maxValue
            };
        }
    }

    //리스트 조건으로 전환
    function listToTerms(detailDIV) {
        var listContainer = productContainerDIV.find('.quickBtn_swiper > .swiper-container > .swiper-wrapper');
        var termsGroup = detailDIV.find('.pop_accodianBox');
        var titleArr = [];

        //타이틀 배열에 모음
        termsGroup.find('> h4').filter(function () {
            titleArr.push(setRemoveSpace($(this).contents().eq(0).text()));
        });

        var idx, title, value;
        var reg;
        listContainer.find('> div.swiper-slide > a').each(function () { //리스트 토대로 조건 활성화
            var targetA = $(this);
            value = targetA.text();
            title = targetA.attr('title');

            if (title !== undefined && value.length > 0) {
                value = value.replace(new RegExp(title + ' ', 'i'), ''); //타이틀이 앞에 들어간 값들 타이틀 빼고 비교를 위한 치환
                idx = $.inArray($(this).attr('title'), titleArr);

                //console.log(value, idx);

                if (termsGroup.eq(idx).find('#slider').length > 0) {
                    //상품가격 슬라이드
                    
                    var priceArr = value.match(/[(\d|,)]+/g); //200~1,200만원 -> ["200", "1,200"]
                    if (priceArr !== null && priceArr.length >= 2) {
                        changeSlider(priceSliderTarget, priceArr[0].match(/\d+/g).join('') + '0000', priceArr[1].match(/\d+/g).join('') + '0000'); //"1,200" -> 12000000
                    }
                } else {
                    //해당하는 그룹의 '전체' 를 비활성화고 text 비교하여 활성화
                    termsGroup.eq(idx).find('ul.pop_btnList > li:first').removeClass('on').siblings().each(function () {
                        var targetLI = $(this);
                        var txt = targetLI.text();

                        if (txt === value) { //일치하는것 활성화
                            targetLI.addClass('on');
                        }
                    });
                }
            }
        });

        //직항
        termsGroup.find('input[type="checkbox"].redCheck').prop('checked', productContainerDIV.find('.quickBtn_swiper').hasClass('direct_air'));
    }

    //조건&리스트 추가
    function addTermsList(group) {
        var listContainer = productContainerDIV.find('.quickBtn_swiper > .swiper-container > .swiper-wrapper');

        //group.each(function () {
            var groupTarget = group;
            var titleAttr = setRemoveSpace(groupTarget.find('> h4').contents().eq(0).text()) || '';
            var txt = '';
            var title = '';
            var code = '';

            if (groupTarget.find('#slider').length > 0) {
                //상품가격 슬라이드
                var priceStatus = getPriceStatus();

                if (!priceStatus.same) { //차이가 있으면 리스트에 쌓기
                    txt = priceStatus.min + '~' + priceStatus.max + '만원';
                    code = 'pakcageAdultAmtMin="' + priceStatus.wmin + '"  pakcageAdultAmtMax="' + priceStatus.wmax + '"';

                    listContainer.append('<div class="swiper-slide" ' + code + '><a href="#" title="' + titleAttr + '">'+ title + txt +'</a><button type="button" title="삭제"></button></div>'); //리스트에 추가    
                }
            } else {
                groupTarget.find('> div > ul > li.on').each(function () {
                    var activateLi = $(this);
                    var ul = activateLi.closest('ul.pop_btnList');

                    if (activateLi.index() !== 0) {
                        if (ul.hasClass('option')) title = titleAttr + ' '; //추가경비, 자유일정, 쇼핑 선문구
                        
                        txt = activateLi.text();
                        code = getAttrValueWithName(activateLi.find('> button'), 'package');

                        if (txt.length > 0) {
                            listContainer.append('<div class="swiper-slide" ' + code + '><a href="#" title="' + titleAttr + '">'+ title + txt +'</a><button type="button" title="삭제"></button></div>'); //리스트에 추가
                        }
                    }
                });
            }
        //});

        //직항
        var directInput = group.find('input[type="checkbox"].redCheck');
        productContainerDIV.find('.quickBtn_swiper').toggleClass('direct_air', directInput.prop('checked'));
    }

    //특정 속성이름으로 시작하는 속성="값" 반환
    function getAttrValueWithName(target, name) {
        var attrStr = '';

        if (target.length > 0) {
            var i = 0;
            var atts = target.get(0).attributes;
            var max = atts.length;

            for (; i < max; i+= 1){
                if (atts[i].nodeName.indexOf(name) === 0) {
                    attrStr = atts[i].nodeName + '="' + atts[i].nodeValue + '" ';
                }
            }
        }
        
        return attrStr;
    }

    //문자열 전체 공백(텝 엔터 포함) 제거
    function setRemoveSpace(str) {
        return str.replace(/\s+/g, '');
    }

    //'전체' 로 초기화
    function checkDefaultTerms(termli) {
        var lis = termli.siblings().andSelf();

        //아무것도 선택 안되어있거나 & 모두 선택되어 있으면
        if (lis.filter('.on').length === 0 || lis.not(':eq(0)').not('.on').length === 0) {
            lis.removeClass('on').eq(0).addClass('on');
        }
    }

    //리스트 갯수 체크하여 영역 숨김
    function checkClearList() {
        var listContainer = productContainerDIV.find('.quickBtn_swiper > .swiper-container > .swiper-wrapper');

        productContainerDIV.find('.quickBtn_swiper').toggle(listContainer.find('> div.swiper-slide').length !== 0);
    }

    //조건팝업을 토대로 리스트 적용
    function applyTerms(detailDIV) {
        //리스트 삭제
        clearTermsList();

        //활성화 조건 돌면서 리스트에 추가 삭제
        detailDIV.find('div.pop_accodianBox').each(function (idx) {
            addTermsList($(this)); //리스트 추가      
        });

        //리스트 갯수 체크하여 영역 숨김
        checkClearList();

        //팝업 닫기
        detailDIV.find('a.closeOverlayPanel').trigger('click.closeBtn');

        var listSwiperContainer = productContainerDIV.find('.quickBtn_swiper .swiper-container');
        if (listSwiperContainer.length > 0 && listSwiperContainer[0].swiper !== undefined) {
            var swiper = listSwiperContainer[0].swiper;
            //추가된 .swiper-slide 토대로 리셋
            new SwiperTemplate().resetSwiper(listSwiperContainer);
        }

        if (PRODUCT.checkDetailSearch !== undefined) PRODUCT.checkDetailSearch({});
    }

    //리스트 초기화
    function clearTermsList() {
        //조건 리스트 스와이프 파괴
        var listSwiperContainer = productContainerDIV.find('.quickBtn_swiper > .swiper-container');
        if (listSwiperContainer.length > 0) {
            var swiper = listSwiperContainer[0].swiper;
            swiper.destroy(false, false);

            listSwiperContainer.find('.swiper-wrapper').empty();
        }

        checkClearList();

        //직항 삭제
        productContainerDIV.find('.quickBtn_swiper').removeClass('direct_air');
    }

    //달력
    function initCalendar(options, pickerTarget) {
        if (typeof Hanatour_components_calendar === 'undefined') return;

        var datepickerTarget = pickerTarget || $('#datepicker');
        var slidePopupDIV = datepickerTarget.closest('.popReserve01');
        var currentDateA = (isMain) ? $('.newPackMain_top > ul > li:eq(2) > a > span') : productContainerDIV.find('.newPackTop > .topBtm_inner > a:eq(1)');
        var bottomDIV = slidePopupDIV.find('.pickerBtm');
        var selectDateArea = bottomDIV.find('.oneType > .dayCell:eq(0) > strong');

        var opts = $.extend({}, {
            numberOfMonths: [12, 1],
            minDate: '+1d',
            maxDate: '+3y',
            yearSuffix: '년 ',
            monthSuffix: '월',
            dateFormat: 'yy.mm.dd(DD)',
            onSelect : function (date) {
                selectDateArea.text(date);  //팝업내 하단에 선택일 날짜 변경
            },
            addUpdate : function (container) {
                var datepickers = container.container;
                var titleDIV = datepickers.find('.ui-datepicker-title');
                var dayTHEAD = datepickers.find('thead');
                var yearSPAN = titleDIV.find('span.ui-datepicker-year');
                var monthSPAN = titleDIV.find('span.ui-datepicker-month');

                //월 전체 마크업 추가
                var titleAddElm = datepickerTarget.nextAll('.ui-datepicker-title-add').eq(0).children();
                if (titleAddElm.length) titleDIV.append(titleAddElm.clone());

                //titleDIV.eq(0).hide(); //del 1.0.3
                dayTHEAD.remove();

                //yearSPAN.hide(); //del 1.0.3
                monthSPAN.each(function () {
                    $(this).text(parseInt($(this).text()));
                });
            },
            addEvent : function (container) {
                //var datepickers = container.container;
            }
        }, options);
        
        var calendar = new Hanatour_components_calendar();
        calendar.init(datepickerTarget, opts); //{} jquery ui 옵션 확장

        var date = new Date(currentDateA.text());

        //확인 버튼
        bottomDIV.on('click.product', '> a', function (e) {
            var target = $(e.currentTarget);

            currentDateA.addClass('on').text(selectDateArea.text().replace(/\(.\)/g, ''));    //비주얼 영역 달력 여는 버튼에 날짜 변경

            slidePopupDIV.find('a.closeOverlayPanel').trigger('click.closeBtn');

            e.preventDefault();
        });

        //월 전체 체크
        datepickerTarget.on('change.product', '.allMonth_check > input', function (e) {
            var target = $(e.currentTarget);
            var year = parseInt(target.parent().prevAll('.ui-datepicker-year').text());
            var month = parseInt(target.parent().prevAll('.ui-datepicker-month').text());
            var otherInput = target.closest('.ui-datepicker-group').siblings().find('.allMonth_check > input');

            otherInput.prop('checked', false);

            if (!isNaN(year) && !isNaN(month)) {
                var date = new Date(year, month - 1, 1);

                if (target.prop('checked')) {
                    calendar.setSelectAll(date); //전체 선택

                    //해당월 말일 계산
                    /*var lastMonthDate = new Date(year, month, 1);
                    lastMonthDate.setDate(lastMonthDate.getDate() - 1);*/

                    //selectDateArea.text($.datepicker.formatDate(opts.dateFormat, date, calendar.getOptions()) + ' ~ ' + $.datepicker.formatDate(opts.dateFormat, lastMonthDate, calendar.getOptions()));
                    
                    selectDateArea.text($.datepicker.formatDate(opts.dateFormat, date, calendar.getOptions()).replace(/\.\d+\(.\)/g, '')); // 월까지만 표현 
                } else {
                    calendar.setDate(date); //전체선택 해제 되며 해당 1일로 셋팅

                    selectDateArea.text($.datepicker.formatDate(opts.dateFormat, date, calendar.getOptions())); //datepicker onSelect 발생 안하므로 실행
                } 
            }
        });

        //생성시 1회 설정
        if (date instanceof Date && !isNaN(date.valueOf())) {
            calendar.setDate(date); //달력 날짜 셋팅
            selectDateArea.text($.datepicker.formatDate(opts.dateFormat, date, calendar.getOptions())); //하단 날짜 셋팅    

            //활성화 월 위치로 이동
            var pop = slidePopupDIV.closest('.slidepopup');
            pop.css('display', 'block').attr('data-scrolltop', calendar.getInfo().inline.currentMonthPos.top);

            //월 전체 선택이었 다면
            if (currentDateA.text().match(/\./g) !== null) {
                if (currentDateA.text().match(/\./g).length === 1) {
                    var allSelInput = datepickerTarget.find('.ui-datepicker-current-day').closest('.ui-datepicker-group').find('.allMonth_check > input');

                    allSelInput.prop('checked', true).trigger('change.product');
                }
            }
        }
    }

    //출발 도시 검색
    function initStartCity(popInner) {
        var cityContainerUL = popInner.find('ul.pack_cityList');

        cityContainerUL.on('click.product', '> li > a', function (e) {
            var target = $(e.currentTarget);
            var currentCityA = (isMain) ? $('.newPackMain_top > ul > li:eq(0) > a > span') : productContainerDIV.find('.newPackTop > .topBtm_inner > a:eq(0)');

            currentCityA.addClass('on').text(target.text());

            popInner.find('a.closeOverlayPanel').trigger('click.closeBtn');

            e.preventDefault();
        });
    }

    //도시검색
    function initCitySearch(popInner) {
        //왼쪽영역 나라 선택 시
        var cityTab = new WToggle();
        cityTab.init({target: popInner.find('.cityListNew'), selector: '> ul > li > button', onTag: 'button', content: popInner.find('.cityListNew'), contentSelector: '> ul > li > div', onChange: function (data) {
        }});

        //오른영역 지역 선택 시
        popInner.find('.cityListNew').on('click.product', '> ul > li > div > ul > li > a', function (e) {
            var target = $(e.currentTarget);

            $('.newPackMain_top > ul > li:eq(1) > a > span').addClass('on').text(target.text());
        });
    }

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/

    //팝업로드 완료후 실행 함수 정의 
    function initPopup() {
        var popInner = $('.slidepopup:last').find('div.popReserve01');

        if (popInner.length > 0) {
            DOTCOM.initToggle(popInner);

            //상세검색
            if (popInner.find('.pop_accodianBox').length > 0) {
                initTerms(popInner);
            }

            //달력
            if (popInner.find('#datepicker').length > 0) {
                initCalendar();
            }

            //출발 도시검색
            if (popInner.find('.pack_cityList').length > 0) {
                initStartCity(popInner);
            }

            //여행도시
            if (popInner.find('.cityListNew').length > 0) {
                initCitySearch(popInner);
            }
        } //end if
    }

    //팝업모션 완료후 실행 함수 정의 
    function completePopup() {
        var popInner = $('.slidepopup:last').find('div.popReserve01');

        if (popInner.length > 0) {

        }
    }

    /**********************************************************************************************
     **************************************** 외부 제공 함수 **************************************
     **********************************************************************************************/

    //PRODUCT.initCalendar = initCalendar;
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