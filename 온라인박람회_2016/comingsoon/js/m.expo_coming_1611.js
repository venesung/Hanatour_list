/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.10.06
 *
 * 2016 온라인 박람회 MOBILE 커밍
 * 
 */
(function (scope) {
    if (scope.EXPOCOMING !== undefined) return;

    var EXPOCOMING = {};

    scope.EXPOCOMING = EXPOCOMING;
})(window);

(function ($) {
	
	$(document).ready(function () {
		//initSwiper($('.swipCommBanner > .swiper-container'), {}); //고객사 위 배너
		initFreeSwiper($('.sponsorship > .swiper-container'), {slidesPerView: 3.6, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 10});	//고객사
		//initSwiper($('.mainBanner > .swiper-container'), {}); //일반 배너
		
		initTab();
		initEvent();
		
		CountDown.setTime(new Date(), new Date(2016, 11-1, 8), {callback: function (data) {
			$('.timeBox > div:eq(0) > strong').text(data.d);
			$('.timeBox > div:eq(1) > strong').text(data.h);
	        $('.timeBox > div:eq(2) > strong').text(data.m);
	        $('.timeBox > div:eq(3) > strong').text(data.s);

	        //$('.txtTimer').text('메가세일 종료까지 ' + data.d + '일 ' + data.h + '시간 ' + data.m +'분 남았습니다.');	
		}});
	});

	//이벤트
	function initEvent() {
		//전문보기 
		$('.etcCol02').on('click.expocoming', '.inputBox > label:eq(0) > a', function (e) {
			$('.layerPop:eq(0)').show();

			e.preventDefault();
		});

		//전문보기 2
		$('.etcCol02').on('click.expocoming', '.inputBox > label:eq(1) > a', function (e) {
			$('.layerPop:eq(1)').show();

			e.preventDefault();
		});

		//공유하기
		$('.share').on('click.expocoming', function (e) {
			$('.layerPop:eq(2)').show();

			e.preventDefault();
		});

		//팝업 닫기
		$('.layerPop').on('click.expocoming', 'a.btn_y_Close', function (e) {
			$(this).closest('.layerPop').hide();

			e.preventDefault();
		});

		var iframe = $('iframe');
		$(window).on('resize.expocoming', function (e) {
            if (WDDO.browserWidth === $(window).width() && WDDO.browserHeight === $(window).height()) return false;
            WDDO.browserWidth = $(window).width();
            WDDO.browserHeight = $(window).height();

            iframe.css('height', getLinearFunction(0, 1920, 0, 1080, iframe.width()));
		}).trigger('resize.expocoming');
	}

	//셑렉트 박스.. sub_theme09, area01_ragion01
	function initSelect() {
		selectBox = $('select');

		//셀렉트 체인지 이벤트
        selectBox.each(function () {
            $(this).eq(0).on('change.expocoming', function (e) {
                var target = $(e.currentTarget);
                var idx = target[0].selectedIndex;

                target.nextAll('div.selectContent').children().hide().eq(idx).show();

                //타이틀 이미지 변경
                //target.closest('.recom_inCont').find('> div.contTop01').hide().eq(idx).show();
            });
        });

	    //초기 셀렉트
        selectBox.each(function () {
            var idx = $(this).find('> option:selected').index();

            $(this).find('option').eq(idx).prop("selected", true);
            $(this).trigger('change.expocoming');
        });
	}

	//공통 탭
	function initTab() {
		var tab = new WToggle();
		tab.init({target: $('.comingTapSect'), selector: '> ul.comTab > li > a', onTag: 'li', content: $('.comingTapSect'), contentSelector: 'div.tabCont', onChange: function (data) {
			//resetSwiper( data.content.find('.swiper-container-free-mode').not(':hidden') ); //오감만족 200% 스와이프 리셋
			moveScroll($('.comingTapSect').offset().top);
		}});
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

    //스크롤 이동
    function moveScroll(targetY) {
        $('html, body').stop().animate({
            scrollTop : targetY
        }, {queue: false, duration: 1000, easing: 'easeInOutQuart', complete: function () {
            $('body').off('touchstart.expocoming');
        }});

        $('body').one('touchstart.expocoming', function (e) {
            $('html, body').stop();
        });
    }

	/**
	* 카운트 다운
	*
	* @param options    ::: 설정 Object 값
	*
	* options
	*   callback:Function = function (data) {}       //이벤트까지 .. 의 까지 이전 문자열
	*
	* method
	*   CountDown.setTime(currentDate, endDate, options);    //카운트 설정
	*/
	var CountDown = (function ($) {
	    var currentDate,
	        endDate,
	        os,
	        cs,
	        sec,
	        countDown,
	        opts,
	        defaults = getDefaultOption(),
	        init = function (options) {
	            opts = $.extend({}, defaults, options);          

	            initLayout();
	            initEvent();
	        };

	    function initCountDown() {
	        var countDate = new Date();
	        cs = countDate.getSeconds();

	        if (cs === 0) sec += 60;
	        cs = cs + sec;
	        countDown = cs - os;

	        var interval = endDate.getTime() - currentDate.getTime() - (countDown * 1000);

	        if (interval < 0 && window.onlineCoundDownId !== undefined) {
	            clearInterval(window.onlineCoundDownId);
	            window.onlineCoundDownId = undefined;

	            return;
	        } 

	        var mescPerSecond = 1000;
	        var msecPerMinute = mescPerSecond * 60;          
	        var msecPerHour = msecPerMinute * 60; 
	        var msecPerDay = msecPerHour * 24;      //milliseconds -> day
	        var msecPerMonth = msecPerDay * 30;
	        var msecPerYear = msecPerMonth * 12;

	        var year = Math.floor(interval / msecPerYear);
	        interval = interval - (year * msecPerYear);

	        var month = Math.floor(interval / msecPerMonth);
	        interval = interval - (month * msecPerMonth);

	        var days = Math.floor(interval / msecPerDay);
	        interval = interval - (days * msecPerDay);

	        var hours = Math.floor(interval / msecPerHour);
	        interval = interval - (hours * msecPerHour);

	        var minutes = Math.floor(interval / msecPerMinute);
	        interval = interval - (minutes * msecPerMinute);

	        var seconds = Math.floor(interval / mescPerSecond);

	        //add
	        var d = force2Digits(days + month * 30 + year * 365);
	        var h = force2Digits(hours);
	        var m = force2Digits(minutes);
	        var s = force2Digits(seconds);

	        if (opts.callback !== undefined) opts.callback({d:d, h:h, m:m, s:s});

	        //console.log(year + '/' + month + '/' + days + ' ' + hours + ':' + minutes + ':' + seconds);
	    }

	    function getDefaultOption() {
	        return {
	            
	        };
	    }

	    function initLayout() {

	    }

	    function initEvent() {

	    }

	    return {
	        setTime: function (current, end, options) {
	            init(options);

	            currentDate = current;
	            endDate = end;

	            if (currentDate !== undefined && endDate !== undefined && window.onlineCoundDownId === undefined) {
	                countDown = 0;
	                sec = 0;
	                os = currentDate.getSeconds();
	                window.onlineCoundDownId = setInterval(initCountDown, 1000);
	                initCountDown();
	            }
	        }
	    };
	}(jQuery));

	function force2Digits(value) {
    	return (value < 10) ? '0' + value.toString() : value.toString();
	}

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

	//DOCOM (common_new.js ver 2.0.3)
	!function(a){if(void 0===a.DOTCOM){if(void 0===a.ANI_EV){var b=document.createElement("div").style,c=function(){for(var c,a="t,webkitT,MozT,msT,OT".split(","),d=0,e=a.length;d<e;d++)if(c=a[d]+"ransform",c in b)return a[d].substr(0,a[d].length-1);return!1}();a.ANI_EV=function(){if(c===!1)return!1;var a={"":"webkitAnimationEnd",webkit:"webkitAnimationEnd",Moz:"AnimationEnd",O:"oAnimationEnd",ms:"MSAnimationEnd"};return a[c]}()}var d={setMask:function(a,b){a?"#overlayPanel"!==b&&($("body").append('<div id="mask" class="mask"></div>'),void 0!==b&&WDDO.setDisableEvent(b.find(".innerScroller"))):($("#mask").remove(),WDDO.setEnableEvent($("body")))},openSlidePop:function(a,b){var c=$.extend({source:$(jQuery.fn),parent:$("#wrap"),browserHeight:WDDO.browserHeight},b);if(void 0!==a){var d=a;d.html(c.source.html()),d.css({"min-height":c.browserHeight,display:"block"}).data("st",$(window).scrollTop()),setTimeout(function(){d.addClass("slide slideUp").on(ANI_EV+".dotcom",function(){c.parent.hide(),$(window).scrollTop(0),d.css("height","auto").addClass("show").removeClass("slideUp slide").off(ANI_EV+".dotcom")})},50)}},closeSlidePop:function(a,b){var c=$.extend({parent:$("#wrap")},b);if(void 0!==a){var d=a;if(c.parent.show(),d.css("height",WDDO.browserHeight).addClass("slide slideDown").one(ANI_EV,function(){d.attr("style","").removeClass("slideDown slide show").hide()}),void 0!==d.data("st")){var e=parseInt(d.data("st"));d.removeData("st"),setTimeout(function(){$(window).scrollTop(e)},1)}}},openLoadPop:function(a){function g(){return{url:void 0,effect:"slide"}}function h(){i(),j(),"slide"===f.effect&&d.openSlidePop(b,f),b.trigger("open.loadpop",f)}function i(){b=$("#overlayPanel").length>0?$("#overlayPanel"):$('<div id="overlayPanel">'),$("body").append(b),void 0!==c&&b.html(c)}function j(){b.on("click",".closeOverlayPanel",function(a){$(a.currentTarget);"slide"===f.effect&&d.closeSlidePop(b,f),b.trigger("close.loadpop",f)})}function k(){$.ajax({type:"GET",url:f.url,dataType:"text",success:function(a){c=a,h()},error:function(a,b,c){}})}var b,c,e=g(),f=$.extend({},e,a);k()}};a.DOTCOM=d}}(window);

	//WDDO ver 1.1.1
	!function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);

	/**
	 * A jQuery plugin for sprite animation
	 *
	 * Version 1.0
	 * 2012-03-22
	 *
	 * Copyright (c) 2006 Luke Lutman (http://www.lukelutman.com)
	 * Dual licensed under the MIT and GPL licenses.
	 * http://www.opensource.org/licenses/mit-license.php
	 * http://www.opensource.org/licenses/gpl-license.php
	 *
	 * http://guny.kr
	 * http://ghophp.github.io/
	 */
	;(function($){$.fn.sprite=function(options){var base=this,opts=$.extend(true,{},$.fn.sprite.defaults,options||{}),w=opts.cellSize[0],h=opts.cellSize[1],ys=opts.cells[0],xs=opts.cells[1],row=opts.initCell[0],col=opts.initCell[1],offx=opts.offset[0],offy=opts.offset[1],timer=null;this.next=function(){var last=false;if(opts.vertical===true){last=row+1>ys-1;row=!last?row+1:ys-1}else{last=col+1>xs-1;col=!last?col+1:xs-1}_setSprite(base,row,col,last)};this.prev=function(){var last=false;if(opts.vertical===true){last=row-1<0;row=!last?row-1:0}else{last=col-1<0;col=!last?col-1:0}_setSprite(base,row,col,last)};this.go=function(){if(timer)base.stop();if(!timer)timer=setInterval(this.next,opts.interval)};this.revert=function(){if(timer)base.stop();if(!timer)timer=setInterval(this.prev,opts.interval)};this.stop=function(){if(timer){clearTimeout(timer);timer=null}};this.cell=function(r,c){row=r;col=c;_setSprite(base,row,col,false)};this.row=function(r){if(r>ys-1)r=(opts.wrap)?0:ys-1;if(r<0)r=(opts.wrap)?ys-1:0;this.cell(r,0)};this.col=function(c){if(c>xs-1)c=(opts.wrap)?0:xs-1;if(c<0)c=(opts.wrap)?xs-1:0;this.cell(row,c)};this.offset=function(x,y){offx=x;offy=y;_setSprite(0,0,false)};return this.each(function(index,el){var $this=$(this);$this.css({'width':w,'height':h});if($this.css('display')=='inline')$this.css('display','inline-block');_setSprite(this,row,col,false,(opts.offsInitial?true:false))});function _setSprite(el,row,col,last,initial){if(last){opts.complete();if(!opts.wrap){base.stop();return}}initial=typeof initial!=='undefined'?initial:true;var x=(-1*((w*col)+(initial?0:offx))),y=(-1*((h*row)+(initial?0:offy)));$(el).css('background-position',x+'px '+y+'px')}};$.fn.sprite.defaults={cellSize:[0,0],cells:[1,1],initCell:[0,0],offset:[0,0],interval:50,offsInitial:false,vertical:false,wrap:true,complete:function(){}}})(jQuery);
})(jQuery);