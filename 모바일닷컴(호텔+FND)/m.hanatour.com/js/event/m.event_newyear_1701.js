/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.12.23
 *
 * 2017 HappyNew Tour
 */

(function (scope) {
    if (scope.EVENT !== undefined) return;

    var EVENT = {};

    scope.EVENT = EVENT;
})(window);

(function ($) {
    $(document).ready(function () {
        initFreeSwiper($('.nyContBefore > .swiper-container'), {slidesPerView: 2.3, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 5});   //특전
        
        initEvent();

        initHrefPopup();

        EVENT.initStep = initStep;
    });

    function initStep() {
        var stepContainerDIV = $('.popReserve01');
        var stepItemDIV = stepContainerDIV.find('.planBox > div');
        var input = stepItemDIV.find('.etcPoint > input[type="text"]');
        var checkbox = stepItemDIV.find('input[type="checkbox"]');
        var currentStep = 0;
        var chooseLocalNum = 0;

        //init
        stepContainerDIV.find('.planBtn').show().find('> a:first').hide();

        //public
        EVENT.prevStep = function () {
            var stepIdx = stepItemDIV.not(':hidden').index();
            currentStep = Math.max(0, stepIdx - 1);

            checkLayout();
            checkBtn();
        };

         EVENT.nextStep = function () {
            var stepIdx = stepItemDIV.not(':hidden').index();
            currentStep = Math.min(stepItemDIV.length - 1, stepIdx + 1);

            checkLayout();
            checkBtn();
        }

        //레이아웃 체크
        function checkLayout(idx) {
            var actStep = stepContainerDIV.find('.planBox > div').eq(currentStep);

            if (actStep.length > 0) {
                //높이 지정 & 스텝 변환
                var h = actStep.css('height')
                actStep.fadeIn(400, 'easeOutQuad').siblings().fadeOut(400, 'easeOutQuad');
                stepItemDIV.parent().css('height', h);    
            }

            //지역
            if (currentStep === 1) stepItemDIV.eq(currentStep).find('> ul').hide().eq(chooseLocalNum).show();

            //마지막 스텝
            if (currentStep === stepItemDIV.length - 1) {
                //똑똑한 여행정보/닫기
                stepContainerDIV.find('.planBtn').hide();
                stepContainerDIV.find('.planBtn02').show();
            } else {
                // < >
                stepContainerDIV.find('.planBtn').show().find('> a').show();
                stepContainerDIV.find('.planBtn02').hide();

                if (currentStep === 0) stepContainerDIV.find('.planBtn').show().find('> a:first').hide();
            }
        }

        //버튼 활성화 체크
        function checkBtn() {
            var actStep = stepItemDIV.eq(currentStep);
            var onItem = actStep.find('li').filter('.on');

            switch (currentStep) {
                case 0:
                     chooseLocalNum = onItem.index();
                case 1:
                    var chooseLocalText = stepItemDIV.eq(currentStep).find('li.on > a > span').text();
                    stepItemDIV.filter(':last').find('> div > strong').html( '&quot;'+chooseLocalText+'&quot' );
                case 2:
                case 3:
                case 4:
                case 5:
                    stepContainerDIV.find('.planBtn > a:last').toggleClass('on', onItem.length > 0); //선택 박스가 있으면 다음 버튼 활성화 

                    var input = actStep.find('.etcPoint > input[type="text"]');
                    if (onItem.length === 0 && input.length > 0) { //활성화는 없지만 input이 있을경우 
                        stepContainerDIV.find('.planBtn > a:last').toggleClass('on', input.val().length > 0); //인풋에 값이 있을경우 다음 버튼 활성화
                    }
                    break;
                case 6:
                    var checkbox = actStep.find('input[type="checkbox"]');
                    if (checkbox.length > 0) stepContainerDIV.find('.planBtn > a:last').toggleClass('on', checkbox.prop('checked'));
                    break;
                default :     
            }
        }

        //박스 클릭 이벤트
        stepContainerDIV.on('click.event', 'ul[class^="chPlan"] > li > a', function (e) {
            var target = $(e.currentTarget);
            var li = target.closest('li');
            var isMulti = currentStep === 5;

            if (!isMulti) {
                li.addClass('on').siblings('li').removeClass('on');
            } else {
                li.toggleClass('on');
            }

            checkBtn();

            e.preventDefault();
        });

        //input 이벤트
        input.on('keyup.event', function (e) {
            checkBtn();
        });

        //checkbox 이벤트
        checkbox.on('change.event', function (e) {
            checkBtn();
        });

        //전문보기
        stepItemDIV.eq(6).find('> a').on('click.event', function (e) {
            $('.layerSmallPop').show().one('click.event', 'a.btnSmPop', function (e) {
                $(this).closest('.layerSmallPop').hide();
            });
        });

        //닫기
        stepContainerDIV.find('.planBtn02 > a.next').on('click.event', function (e) {
            $('a.closeOverlayPanel').trigger('click');
        });
    }

    //이벤트
    function initEvent() {
        $(window).on('resize.event', function (e) {
            if (WDDO.browserWidth === $(window).width() && WDDO.browserHeight === $(window).height()) return false;
            WDDO.browserWidth = $(window).width();
            WDDO.browserHeight = $(window).height();
        }).trigger('resize.event');

        $('.snsList .shared > a:last').on('click', function (e) {
            var span = $(this).next('span');
            var retVal = prompt(span.attr('title'), span.text());
            //if (retVal !== null) alert('복사되었습니다.')
            e.preventDefault();
        });
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
                parent : $('body > div#wrap') //팝업 렬리면 div#wrap 숨김
            });

            e.preventDefault();
        });
    }

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
})(jQuery);

