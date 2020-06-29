/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.11.11
 *
 * 고객참여 기획전
 */

(function (scope) {
    if (scope.CP !== undefined) return;

    var CP = {};

    scope.CP = CP;
})(window);

(function ($) {
	var isMain;
	var selectBox;

	$(document).ready(function () {
		isMain = $('.top_intro').length > 0;

		initHrefPopup();

		if (isMain) {
			initMain();
		} else {

		}

		CP.setSwiper = (function () {return new SwiperTemplate()})(); 
		CP.initEventPopup = initEventPopup;
	});

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/
    
    //페이지 로드 슬라이드 팝업
    function initHrefPopup() {
        var linkTagA = $('a.InfoPop');

        linkTagA.on('click', function (e) {
            var target = $(e.currentTarget);
            var loadURL = $(this).attr('href');
        
            DOTCOM.openLoadPop({
                target : target,
                url : loadURL,
                browserHeight : window.innerHeight,
                parent : $('body > div.themeCustSect') //팝업 렬리면 div#wrap 숨김
            });

            e.preventDefault();
        });
    }

	//이벤트
	function initEvent() {
		
	}

    /**********************************************************************************************
     ********************************************* 메인 *******************************************
     **********************************************************************************************/

	function initMain() {
		var moreBtnA = $('.btnPeek');

		moreBtnA.on('click.cp', function (e) {
			var target = $(e.currentTarget);
			var listUL = target.siblings('ul.peekList');

			var isOpen = target.hasClass('on');

			target.toggleClass('on', !isOpen);
			listUL.toggleClass('open', !isOpen);

			e.preventDefault();
		});
	}

    function initEventPopup () {
    	var titleDIV = $('.header');

    	//응모하기
    	if (titleDIV.next('div').hasClass('pop_joinSect')) {
    		var locTabDIV = $('.cusJoinTop > .swipBtmTab');
    		var visualSwiperContainerDIV = $('.cusJoinTop > .swiper-container');
    		var visualTextDIV = visualSwiperContainerDIV.find('> .swipTopTxt');

    		var tempTranslate = 0;
    		//비주얼 스와이프
			new SwiperTemplate().initSwiper(visualSwiperContainerDIV, {loop:false, exChange: function (data, event) {
				var swiper = data.container[0].swiper;
				var idx = swiper.slides.eq(swiper.activeIndex).attr('data-swiper-slide-index') || swiper.activeIndex;

				locTabDIV.find('> li').removeClass('on').eq(idx).addClass('on');

				if (event === 'onTransitionEnd') {
					visualTextDIV.css({opacity: 1});
				}

				visualTextDIV.find('> p').hide().eq(idx).show();

			}, onProgress: function (data, progress) {
                var realIndex = parseInt(data.slides.eq(data.activeIndex).attr('data-swiper-slide-index') || data.activeIndex);
                var s = data.container[0].swiper;
                var direct = undefined;

				if (data.translate > tempTranslate) {
					direct = 'prev';
				} else if (data.translate < tempTranslate) {
					direct = 'next';
				}

				if (direct !== undefined) {
					var per = ((progress / 0.2) - 1 - realIndex).toFixed(3); //0~1 이동 거리

					var alpha;
					if (direct === 'next') {
						alpha = Math.max(0, getLinearFunction(-1, -0.5, 1, 0, per))
					} else if (direct === 'prev') {
						alpha = Math.max(0, getLinearFunction(-1, -1.5, 1, 0, per));
					}
				}

                tempTranslate = data.translate;

                if (!isNaN(per)) visualTextDIV.css('opacity', alpha);
            }});

			//이름으 지어 주세요
			var nameInputDIV = $('.joinContent > .cusJoin_input');
			nameInputDIV.on('keydown.cp focusin.cp focusout.cp', 'textarea', function (e) {
				var target = $(e.currentTarget);

				setTimeout(function () {target.next('span').toggle(target.val().length === 0);}, 100);
			});

			//비주얼 지역탭
			var locTab = new WToggle();
			locTab.init({target: locTabDIV, selector: '> li > a', onTag: 'li', onChange: function (data) {
				var swiper = locTabDIV.siblings('.swiper-container')[0].swiper;
				var idx = swiper.slides.eq(swiper.activeIndex).attr('data-swiper-slide-index') || swiper.activeIndex;

				swiper.slideTo(data.idx, Math.abs(data.idx - idx) > 1 ? 0 : undefined);
			}});

			//누구와 함께한
			var whoTab = new WToggle();
			whoTab.init({target: $('.joinContent > .cusJoinCont01'), selector: '> ul > li > a', onTag: 'li'});

			//여행기간은
			var periodTab = new WToggle();
			periodTab.init({target: $('.joinContent > .cusJoinCont02'), selector: '> ul > li > a', onTag: 'li'});

			//취소 버튼
			var closeBtnA = $('.fullBtn > a:first');
			closeBtnA.on('click.cp', function (e) {
				//$(this).closest('.popReserve01').find('a.closeOverlayPanel').trigger('click');

				e.preventDefault();
			});
    	}
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
}(jQuery));

/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.0
* @since : 2016.11.11
*
* history
*   1.0 (2016.11.11) : -
*/

(function (scope) {
    if (scope.SwiperTemplate !== undefined) return;

    var SwiperTemplate = (function ($) {
	    var wddoObj = function () {
			var swiper, targetContainer
			var opts = {};

		    //스와이프 변경
		    function swiperChange(data, event) {
		        var container = data.container;
		        var max = container.find('.swiper-pagination > span').length;
		        var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

		        container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);

		        if (opts.exChange !== undefined) opts.exChange(data, event);
		    }

		    //중복 방지 초기화
		    function checkSwiper() {
		        if (targetContainer.length > 0 && targetContainer.is('.swiper-container-horizontal')) {
		            swiper = targetContainer[0].swiper;
		            if (swiper !== undefined) swiper.destroy(false, true);    
		        }
		    }

		    //세로 모드 지원
		    function verticalMode(slide, img) {
		        var tImg = new Image();
		        tImg.src = img.src;

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
	        
	        return {
	            initSwiper : function (swiperContainer, options) {
					targetContainer = swiperContainer;

			        checkSwiper(); //중복 방지 초기화

			        var defaults = {
			    		viewport : false,
			            pagination: targetContainer.find('.swiper-pagination'),
			            loop: ((targetContainer.find('.swiper-slide').length > 1) ? true : false),
			            preloadImages: false,
			            lazyLoadingInPrevNext: true,
			            lazyLoading: true,
			            onLazyImageReady: function (swiper, slide, img) {
			                verticalMode(slide, img);
			            },
			            onSlideChangeStart: function (data) {
			                swiperChange(data, 'onSlideChangeStart');
			            },
			            onSliderMove: function (data) {
			                swiperChange(data, 'onSliderMove');
			            },
			            onTransitionEnd: function (data) {
			                swiperChange(data, 'onTransitionEnd');
			            },
			            onInit: function (data) {
			                swiperChange(data, 'onInit');

			                if (opts.viewport) viewportFix(data);
			            }
			        };

			        if (targetContainer.find('.swiper-slide').length === 1) targetContainer.find('.swiper-pagination').hide();

			        //targetContainer === .swiper-container
			        targetContainer.each(function (idx) {
			            opts = $.extend({}, defaults, options);
			            swiper = new Swiper($(this), opts);
			        });

			        targetContainer.find('a.big5_prev').on('click.city', function (e) {
			            var target = $(e.currentTarget);
			            var s = target.closest('.swiper-container')[0].swiper;

			            s.slidePrev();
			            swiperChange(s);

			            e.preventDefault();
			        });

			        targetContainer.find('a.big5_next').on('click.city', function (e) {
			            var target = $(e.currentTarget);
			            var s = target.closest('.swiper-container')[0].swiper;

			            s.slideNext();
			            swiperChange(s);

			            e.preventDefault();
			        });
				},

			    //프리모드 스와이프 1.0
			    initFreeSwiper : function (swiperContainer, options) {    
			    	targetContainer = swiperContainer;

			        checkSwiper(); //중복 방지 초기화
			        
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
			    },

				//스와이프 리셋
			    resetSwiper : function (swiperContainer) {
			    	targetContainer = swiperContainer;

			        targetContainer.find('.swiper-container-horizontal').each(function () {
			            //swiper 초기화
			            swiper = $(this)[0].swiper;

			            if (swiper !== undefined) {
			                swiper.destroy(false, true);
			                new Swiper(swiper.container, swiper.params);
			            }
			        });
			    }
	        };
	    };
	    return wddoObj;
	}(jQuery));

    scope.SwiperTemplate = SwiperTemplate;
})(window);