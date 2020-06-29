/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.01.09
 *
 * 챗봇
 * 
 * history
 * 
 * 1.0 (2017.01.09) : 
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
			initFreeSwiper(target, {spaceBetween: 7, slidesOffsetAfter: -110, slidesOffsetBefore: 50});
		};
		CHATBOT.resetSwiper = resetSwiper;

		/**
		 * 유도창 토글
		 * @param  {Boolean} toggle : 유도창 열지 유무
		 */
		CHATBOT.toggleHint = function (toggle) {
			var content = bottomBarDIV.find('div.quickSwipe');

			if (toggle) {
				content.slideDown(300);
			} else {
				content.slideUp(300);
			}

			initFreeSwiper($('.chatBtmBar div.quickSwipe .swiper-container'), {spaceBetween: 5, slidesOffsetAfter: -27});
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
				$('#chatContainer').addClass('calc02');
			} else {
				content.slideUp(300);
				$('#chatContainer').removeClass('calc02');
			}
			
			e.preventDefault();
		}).on('click.chatbot', 'a.tipClose', function (e) {
			bottomBarDIV.find('a.tip').trigger('click.chatbot');

			e.preventDefault();
		});

		//입력창
		//if ('ontouchstart' in window) {
		/*
			var focusin = false;
			$(document).on('focusin.chatbot', 'input[type="text"], textarea, select', function (e) {
				$('body#chatbotWrap').addClass('fixfixed');

				setTimeout(function() { 
	    			$('html, body').scrollTop($(document).height());
	    			focusin = true;
				}, 50);
			});
			$(document).on('focusout.chatbot', 'input[type="text"], textarea, select', function (e) {
				$('body#chatbotWrap').removeClass('fixfixed2');
				focusin = false;
			});
			$(document).on('touchstart.chatbot', function (e) {
				setTimeout(function() {
			    	$('body#chatbotWrap').removeClass('fixfixed');
			    	if (focusin) $('body#chatbotWrap').addClass('fixfixed2');
			    }, 1);
			});
		*/
		//}
	}
	
    //프리모드 스와이프
    function initFreeSwiper(targetContainer, options) {        
        var swiper;

        //중복 방지 초기화
        if (targetContainer.length > 0 && targetContainer.is('.swiper-container-horizontal')) {
            swiper = targetContainer[0].swiper;
            if (swiper !== undefined) swiper.destroy(false, true);    
        }
        
        var opts;
        var defaults = {
            pagination: targetContainer.find('.swiper-pagination'),
            slidesPerView: 'auto',
            spaceBetween: 0,
            freeMode: true,
            roundLengths: true,
            watchSlidesVisibility: true,
            preloadImages: false,
            lazyLoading: true,
            lazyLoadingInPrevNext: true,
            onLazyImageReady: function (swiper, slide, img) {
                verticalMode(slide, img);
            },
        };

        targetContainer.each(function (idx) {
            opts = $.extend({}, defaults, options);

            //if (!isNaN(parseInt(opts.slidesPerView)) && opts.slidesPerView > $(this).find('.swiper-slide').length) return true; //보여지는 아이템 보다 실제 아이템이 작으면 적용 안함

            swiper = new Swiper($(this), opts);
        });
    };

    //세로 모드 지원
    function verticalMode(slide, img) {
        var tImg = new Image();
        tImg.src = img.src;

        //if (tImg.height > tImg.width) {
        if (true) {
            var slideDIV = $(slide);
            slideDIV.addClass('column'); //position: absolute; left: 0; top: 50%; margin-top: -91px; height: auto;
            slideDIV.find('img').css('height', ''); //vh설정 해제

            var img = slideDIV.find('img');
            var parent = img.parent();
            img.css('marginTop', (parent.height() * 0.5) + (-img.height() * .5));
        }
    }

    //리셋
	function resetSwiper(targetContainer, options) {
        targetContainer.each(function () {
            var swiper = $(this)[0].swiper;

            if (swiper !== undefined) {
                swiper.update();
                swiper.slideTo(0, 0);
            }
        });
    };

	//확장
	if ($.fn.getInstance === undefined) $.fn.getInstance = function () { return this.data('scope'); }

	//easing
	$.easing.jswing=$.easing.swing;$.extend($.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return $.easing[$.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-$.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return $.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return $.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

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

    //DOCOM (common_new.js ver 2.0.4)
    !function(o){if(void 0===o.DOTCOM){if(void 0===o.ANI_EV){var e=document.createElement("div").style,i=function(){for(var o,i="t,webkitT,MozT,msT,OT".split(","),t=0,n=i.length;n>t;t++)if(o=i[t]+"ransform",o in e)return i[t].substr(0,i[t].length-1);return!1}();o.ANI_EV=function(){if(i===!1)return!1;var o={"":"webkitAnimationEnd",webkit:"webkitAnimationEnd",Moz:"AnimationEnd",O:"oAnimationEnd",ms:"MSAnimationEnd"};return o[i]}()}var t={setMask:function(o,e){o?"#overlayPanel"!==e&&($("body .ui-page").append('<div id="mask" class="mask"></div>'),void 0!==e&&WDDO.setDisableEvent(e.find(".innerScroller"))):($("#mask").remove(),WDDO.setEnableEvent($("body")))},fixedFixToggle:function(o,e){var i=o.find(".fixed");e?i.css({position:"absolute",top:o.scrollTop()}):i.css({position:"",top:""})},innerScrollToggle:function(o,e){var i=o.height()>WDDO.browserHeight;if(i)if(e){var t=o.attr("data-scrolltop");o.css({height:WDDO.browserHeight,"overflow-y":"auto"}),void 0!==t&&o.scrollTop(t)}else{var t=o.attr("data-scrolltop");o.css({height:"auto","overflow-y":""}).removeAttr("data-scrolltop"),void 0!==t&&$(window).scrollTop(t)}},openSlidePop:function(o,e){var i=$.extend({source:$(jQuery.fn),parent:$("#wrap"),browserHeight:WDDO.browserHeight},e);if(void 0!==o){var n=o;n.html(i.source.html()),n.css({"min-height":i.browserHeight,display:"block"}).data("st",$(window).scrollTop()),setTimeout(function(){t.innerScrollToggle(n,!0),t.fixedFixToggle(n,!0),n.addClass("slide slideUp").on(ANI_EV+".dotcom",function(){i.parent.hide(),$(window).scrollTop(0),n.css("height","auto").addClass("show").removeClass("slideUp slide").off(ANI_EV+".dotcom"),t.innerScrollToggle(n,!1),t.fixedFixToggle(n,!1)})},50)}},closeSlidePop:function(o,e){var i=$.extend({parent:$("#wrap")},e);if(void 0!==o){var n=o;if(n.attr("data-scrolltop",$(window).scrollTop()),t.innerScrollToggle(n,!0),t.fixedFixToggle(n,!0),i.parent.show(),n.css("height",WDDO.browserHeight).addClass("slide slideDown").one(ANI_EV+".dotcom",function(){t.innerScrollToggle(n,!1),t.fixedFixToggle(n,!1),n.attr("style","").removeClass("slideDown slide show").hide()}),void 0!==n.data("st")){var l=parseInt(n.data("st"));n.removeData("st"),setTimeout(function(){$(window).scrollTop(l)},1)}}},openLoadPop:function(o){function e(){return{url:void 0,effect:"slide"}}function i(){n(),l(),"slide"===c.effect&&t.openSlidePop(s,c),s.off("close.loadpop").trigger("open.loadpop",c)}function n(){s=$("#overlayPanel").length>0?$("#overlayPanel"):$('<div id="overlayPanel">'),$("body").append(s),void 0!==a&&s.html(a)}function l(){s.on("click",".closeOverlayPanel",function(o){$(o.currentTarget);"slide"===c.effect&&t.closeSlidePop(s,c),s.off("open.loadpop").trigger("close.loadpop",c)})}function r(){$.ajax({type:"GET",url:c.url,dataType:"text",success:function(o){a=o,i()},error:function(o,e,i){}})}var s,a,d=e(),c=$.extend({},d,o);r()}};o.DOTCOM=t}}(window);

	//WDDO ver 1.1.1
	!function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);
})(jQuery);