/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.1.0
 * @since : 2017.01.09
 *
 * 항공앱 챗봇
 * 
 * history
 * 
 * 1.0 (2017.01.09) : 
 * 1.1.0 (2018.06.20) : 닷컴 챗봇 1.0 토대로 복사
 * 
 */

(function (scope) {
    if (scope.CHATBOT !== undefined) return;

    var CHATBOT = {};

    scope.CHATBOT = CHATBOT;
})(window);

(function ($) {
	var bottomBarDIV;	// 하단바

	$(document).ready(function () {
		bottomBarDIV = $('.chatBtmBar');

		initEvent();

		//public
		//인원선택
		CHATBOT.initPeople = function () {
			
		};
		
		//도시 탭 
		CHATBOT.initCity = function () {
			var tab = new WToggle();
			tab.init({target: $('.popReserve01 .cityListNew'), selector: '> ul > li > a', onTag: 'a', content: $('.popReserve01 .cityListNew'), contentSelector: '> ul > li > div'});
		};

		/**
		 * 카드 스와이프 초기화
		 * @param  {jQuery Object} target : 적용 대상 
		 */
		CHATBOT.initCardSwiper = function (target) {
			new SwiperTemplate().initFreeSwiper(target, {spaceBetween: 7, slidesOffsetAfter: -0, slidesOffsetBefore: 50});
		};

		/**
		 * 카드 스와이프 리셋
		 * @param  {jQuery Object} target : 적용 대상 
		 */
		CHATBOT.resetSwiper = new SwiperTemplate().resetSwiper;

		/**
		 * 유도창 토글
		 * @param  {Boolean} toggle : 유도창 열지 유무
		 */
		CHATBOT.toggleHint = function (toggle) {
			var content = bottomBarDIV.find('div.quickSwipe');

			if (toggle) {
				content.slideDown(300);
				$('#chatContainer').addClass('calc02');
			} else {
				content.slideUp(300);
				$('#chatContainer').removeClass('calc02');
			}

			new SwiperTemplate().initFreeSwiper($('.chatBtmBar div.quickSwipe .swiper-container'), {spaceBetween: 5, slidesOffsetAfter: 12, slidesOffsetBefore: 12});
		};

		//
		/*
		CHATBOT.openHrefPop = function (url) {
            DOTCOM.openLoadPop({
                url : url,
                browserHeight : window.innerHeight,
                parent : $('body > div#wrap') //팝업 렬리면 div#wrap 숨김
            });
		};
		*/

		//
		CHATBOT.initCalendar = function (options) {
            if (typeof Hanatour_components_calendar === 'undefined') return;

            var datepickerTarget = $('.popReserve01 #datepicker');
            var isRange = true;

            var opts = $.extend({}, {
                numberOfMonths: [12, 1],
                minDate: '+3d',
                maxDate: '+1y',
                yearSuffix: ' ',
                monthSuffix: '월',
                showMonthAfterYear: false,
                range: isRange,
                rangeSelect: $('.popReserve01 .selBox > select'),
                onRange : function (dateArr) {
                	//type_range 용
                    var checkin = dateArr[0] || '';
                    var checkout = dateArr[1] || '';
                
               		$('.twoType > .dayCell:eq(0) strong').text(checkin);
                	$('.twoType > .dayCell:eq(1) strong').text(checkout);
                },
                onSelect : function (date) {
                	//type_single 용
                	if ($('.popReserve01').hasClass('type_single'))  $('.twoType > .dayCell:eq(0) strong').text(date);
                	//if ($('.popReserve01').hasClass('type_single')) $('#overlayPanel a.closeOverlayPanel').trigger('click');
                },
                addUpdate : function (container) {
	                var datepickers = container.container;
	                var titleDIV = datepickers.find('div.ui-datepicker-title');
	                var dayTHEAD = datepickers.find('thead');
	                var nextBtnA = datepickers.find('a.ui-datepicker-next');
	                var prevBtnA = datepickers.find('a.ui-datepicker-prev');
	                var yearSPAN = titleDIV.find('span.ui-datepicker-year');
	                var monthSPAN = titleDIV.find('span.ui-datepicker-month');

	                nextBtnA.hide();
	                prevBtnA.hide();

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

            datepickerTarget.on('complete.wddo', function (e, data) {
            	//
            });

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

	        //미정
	        $('.popReserve01 input.redCheck').on('change.chatbot', function (e) {
	        	var target = $(e.currentTarget);

	        	datepickerTarget.getInstance().setPlan(!target.prop('checked'));
	        	target.closest('.dayCell').find('.selBox').toggle(target.prop('checked'));
	        });
		};
	});

	//이벤트
	function initEvent() {
		$(window).on('resize.chatbot', function (e) {
            if (WDDO.browserWidth === $(window).width() && WDDO.browserHeight === $(window).height()) return false;
            WDDO.browserWidth = $(window).width();
            WDDO.browserHeight = $(window).height();

		}).trigger('resize.chatbot');

		//달력 열림 & 닫힘 완료 이벤트
        $('body').on('open.loadpop', '#overlayPanel', function (e, data) {
            //달력 스크롤 이동
            var popupTarget = $('#overlayPanel');
            var datepickerTarget = $('.popReserve01 #datepicker');
            var selectMonthDIV = datepickerTarget.find('.ui-state-active').closest('.ui-datepicker-group');
            if (datepickerTarget.length > 0 && selectMonthDIV.length > 0) { //달력팝업인지 체크 
                var ypos = selectMonthDIV.offset().top;
                var distance = datepickerTarget.offset().top;

                popupTarget.attr('data-scrolltop', ypos - distance);
            }

   			$('#chatContainer').css('padding-bottom', '85px'); //예외
        }).on('close.loadpop', '#overlayPanel', function (e, data) {
	   		$('#chatContainer').css('padding-bottom', ''); //예외

	   		$('.swiper-container.cardSwipe').not(':hidden').each(function () {
	   			CHATBOT.initCardSwiper($(this));
	   			//$(this)[0].swiper.slideTo(0, 0);
	   		});
	   	});

		//플러스 버튼
		bottomBarDIV.on('click.chatbot', 'a.plus', function (e) {
			var target = $(e.currentTarget);
			var content = bottomBarDIV.find('.quickMenu');

			target.toggleClass('on');

			if (target.hasClass('on')) {
				content.slideDown(300);
				$('#chatContainer').addClass('calc01');
			} else {
				content.slideUp(300);
				$('#chatContainer').removeClass('calc01');
			}

			e.preventDefault();
		});
		
		//?버튼
		bottomBarDIV.on('click.chatbot', 'a.tip', function (e) {
			var target = $(e.currentTarget);
			var content = bottomBarDIV.find('div.tipTxt');

			target.toggleClass('on');

			if (target.hasClass('on')) {
				content.slideDown(300);
			} else {
				content.slideUp(300);
			}
			
			e.preventDefault();
		}).on('click.chatbot', 'a.tipClose', function (e) {
			bottomBarDIV.find('a.tip').trigger('click.chatbot');

			e.preventDefault();
		});
	}

})(jQuery);