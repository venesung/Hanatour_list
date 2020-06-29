/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2018.06.18
 *
 * 여권 자동등록 서비스
 *
 * history
 *
 * 1.0 (2018.06.18) : 
 */

(function (scope) {
    if (scope.APIS !== undefined) return;

    var APIS = {};

    scope.APIS = APIS;
})(window);

(function ($) {
    //페이지 진입 후 hash 따라 팝업 생성
    $(window).on('load', function () {
        if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') DOTCOM.locationHashChanged();

    });

    $(document).ready(function () {
        if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);

        $('body').on('open.slidepop', '#overlayPanel', completePopup); //팝업모션 완료후 실행 함수 정의 
        $('body').on('open.loadpop', '#overlayPanel', initPopup); //팝업로드 완료후 실행 함수 정의 

        var wrapDIV = $('#wrap');

        initLogin();

        addEvent();

        function initLogin() {
            //예약코드 x버튼
            wrapDIV.on('click.apis', '.txtDelBtn', function () {
                var input = $(this).prev('input');
                input.val('');
                setTimeout(function () {input.select();}, 10);
            });

            //공유
            wrapDIV.find('.sharedBox').on('click.apis', '> button', function (e) {
                var pop = $(this).next('.share_popUp');

                pop.fadeIn(200);
                pop.on('click.apis', function (e) {
                    var target = $(e.target);

                    if (target.hasClass('share_popUp')) {
                        $(e.currentTarget).off('.apis').hide();
                        WDDO.setEnableEvent();

                        e.preventDefault();
                    } else if (target.is('a')) {
                        $(e.currentTarget).off('.apis').hide();
                        WDDO.setEnableEvent();
                    }
                });

                WDDO.setDisableEvent();

                e.preventDefault();
            });
        }

        function addEvent() {
            $(document).on('scroll.apis', function (e) {
                WDDO.scrollYpos = (document.documentElement.scrollTop !== 0) ? document.documentElement.scrollTop : document.body.scrollTop;
            });
        }

        /**********************************************************************************************
         ********************************************* 공통 *******************************************
         **********************************************************************************************/

        //팝업로드 완료후 실행 함수 정의 
        function initPopup() {
            var popInner = $('#overlayPanel div.popReserve01');

            if (popInner.length > 0) {
                var moreBtn = popInner.find('button.btn_titRig');

                if (moreBtn.length > 0) {
                    //자세히보기
                    var termsArrowTab = new WToggle();
                    termsArrowTab.init({target: moreBtn, onTag: 'button', onClass: 'on', onlyOpen:false, onChange: function (data) {
                        data.target.parent().next('div.insur_img').toggle(data.target.hasClass('on'));
                    }});
                }
                
            } //end if
        }

        //팝업모션 완료후 실행 함수 정의 
        function completePopup() {
            var popInner = $('#overlayPanel div.popReserve01');

            if (popInner.length > 0) {
                
            } //end if
        }
    });

    /*!
     * @author : Jo Yun Ki (ddoeng@naver.com)
     * @version : 2.0.7
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
     * 2.0.6 (2017.10.23) : opts.event 옵션 추가하여 마우스 오버 컨트롤에 대한 대응
     * 2.0.7 (2018.03.19) : ins.setChange() 추가
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
     *   event:String = 'click.toggle'           //마우스 이벤트명
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
     *   .setChange()                            //해당 메뉴 활성화
     *   .setOptions()                           //옵션 변경
     *   .getOptions()                           //옵션 반환
     *   .getIndex()                             //인덱스 반환
     */
    ;var WToggle=(function(b){var a=function(r){var p,i,c,e=d(),o=function(s){c=b.extend(e,s);if(c.target.length>0){if(b.fn.setInstance!==undefined){c.target.setInstance(p)}h();q()}};function d(){return{target:b(b.fn),selector:"",event:"click.toggle",onTag:"li",onClass:"on",onlyOpen:true,mustClose:false,behavior:false,repeat:false,content:b(b.fn),contentSelector:"",onChange:undefined,onChangeStart:undefined}}function h(){}function q(){if(c.selector===""){c.target.on(c.event,s)}else{c.target.on(c.event,c.selector,s)}l();function s(w){var v=b(w.currentTarget);l();i=j(c.content,c.contentSelector);var t=parseInt(v.data("toggle-idx"));var u=(c.onTag==="a"||c.onTag==="button")?v:v.closest(c.onTag);if(c.onChangeStart!==undefined){c.onChangeStart.apply(this,[{target:v,idx:t,content:i.eq(t)}])}c.target.trigger("changestart.toggle",[{target:v,idx:t,content:i.eq(t)}]);if(u.hasClass(c.onClass)){if(c.onlyOpen){if(c.mustClose){g(t);n(t)}}else{g(t);n(t)}}else{if(c.onlyOpen){g();n();k(t);f(t)}else{k(t);f(t)}}if(c.onChange!==undefined){c.onChange.apply(this,[{target:v,idx:t,content:i.eq(t)}])}c.target.trigger("change.toggle",[{target:v,idx:t,content:i.eq(t)}]);if(!c.behavior){w.preventDefault();w.stopPropagation()}}}function l(){j(c.target,c.selector).each(function(s){b(this).data("toggle-idx",s)})}function j(t,s){return(s!==""&&s!==undefined)?t.find(s):t}function k(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a"||c.onTag==="button")?u:u.closest(c.onTag);t.addClass(c.onClass)}function g(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a"||c.onTag==="button")?u:u.closest(c.onTag);t.removeClass(c.onClass)}function f(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.show()}function n(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.hide()}function m(s){return Math.max(Math.min(s,j(c.target,c.selector).length-1),0)}return{init:function(s){p=this;o(s)},setCloseAll:function(){g();n()},setOpen:function(s){k(s);f(s)},setNext:function(){var s=parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"));var t=(c.repeat&&s+1>j(c.target,c.selector).length-1)?0:m(s+1);if(!isNaN(s)){j(c.target,c.selector).eq(t).trigger("click.toggle")}},setPrev:function(){var t=parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"));var s=(c.repeat&&t-1<0)?j(c.target,c.selector).length-1:m(t-1);if(!isNaN(t)){j(c.target,c.selector).eq(s).trigger("click.toggle")}},setChange:function(s){if(s!==undefined){j(c.target,c.selector).eq(s).trigger("click.toggle")}},setOptions:function(s){b.extend(c,s)},getOptions:function(){return c},getIndex:function(){return parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"))}}};return a}(jQuery));

    //DOCOM (common_new.js ver 2.1.8)
    !function(o){if(void 0!==o.DOTCOM||void 0!==o.HT)return void 0===o.HT&&(o.HT=o.DOTCOM),void(void 0===o.DOTCOM&&(o.DOTCOM=o.HT));if(void 0===o.ANI_EV){var e=document.createElement("div").style,t=function(){for(var o="t,webkitT,MozT,msT,OT".split(","),t=0,i=o.length;t<i;t++)if(o[t]+"ransform"in e)return o[t].substr(0,o[t].length-1);return!1}();o.ANI_EV=function(){if(!1===t)return!1;return{"":"webkitAnimationEnd",webkit:"webkitAnimationEnd",Moz:"AnimationEnd",O:"oAnimationEnd",ms:"MSAnimationEnd"}[t]}()}var i={isBlockingHash:!1,setMask:function(o,e,t){var i=$.extend({},{parent:$("body .ui-page")},t);o?"#overlayPanel"!==e&&(i.parent.append('<div id="mask" class="mask"></div>'),void 0!==e&&WDDO.setDisableEvent(e.find(".innerScroller"))):($("#mask").remove(),WDDO.setEnableEvent($("body")))},openSlidePop:function(o,e){var t=$.extend({source:$(jQuery.fn),parent:$("#wrap"),browserHeight:WDDO.browserHeight},e);if(void 0!==o){var i=o;t.source.length>0&&i.html(t.source.html()),t.parent.attr("data-parenttop",$(window).scrollTop()),setTimeout(function(){i.addClass("slide slideUp").on(ANI_EV+".dotcom",function(o){t.parent.hide(),$(window).scrollTop(0),i.css("height","auto").addClass("show").removeClass("slideUp slide").off(ANI_EV+".dotcom"),n(i,!1),a(i,!1),r(i,!1),i.trigger("open.slidepop",t)}),n(i,!0),a(i,!0),r(i,!0)},50)}},closeSlidePop:function(o,e){var t=$.extend({parent:$("#wrap"),remove:!1},e);if(void 0!==o){var i=o;i.attr("data-scrolltop",$(window).scrollTop()),t.parent.show(),i.css("height",WDDO.browserHeight).addClass("slide slideDown").on(ANI_EV+".dotcom",function(){n(i,!1),a(i,!1),l(i,t.parent,!1),i.attr("style","").removeClass("slideDown slide show").off(ANI_EV+".dotcom"),i.trigger("close.slidepop",t),(t.remove||"overlayPanel"!==i.attr("id"))&&i.remove()}),n(i,!0),a(i,!0),l(i,t.parent,!0),i.off("click.closeBtn")}},openLoadPop:function(o){if(!i.isBlockingHash){var e,t,a,n={class:"slidepopup",url:void 0,effect:"slide"},r=$.extend({},n,o);$.ajax({type:"GET",url:r.url,dataType:"text",success:function(o){var n,l;t=o,a=$("."+r.class).not(":hidden").filter(":last"),e=$("#overlayPanel"+(0===a.length?"":a.length)).length>0?$("#overlayPanel"):$('<div id="overlayPanel'+(0===a.length?"":a.length)+'" class="'+r.class+'">'),r.remove&&$("."+r.class).not("#overlayPanel").remove(),$("body").append(e),n=r.url,l=e.attr("data-url"),n!==l&&e.removeAttr("data-scrolltop"),e.attr("data-url",n),void 0!==t&&e.html(t),e.on("click.closeBtn",".closeOverlayPanel",function(o){if($(o.currentTarget),"slide"===r.effect&&i.closeSlidePop(e,r),void 0!==e.attr("data-oldpop")){var t=$("#"+e.attr("data-oldpop"));t.length>0&&(t.addClass("show"),r.parent.hide(),i.isBlockingHash=!0,location.hash="#"+t.attr("data-url"),setTimeout(function(){i.isBlockingHash=!1},50))}else location.hash="#";e.trigger("close.loadpop",r)}),a.length>0&&(e.attr("data-oldpop",a.attr("id")),e.one(ANI_EV+".dotcom",function(o){a.removeClass("show")})),"slide"===r.effect&&i.openSlidePop(e,r),e.trigger("open.loadpop",r)},error:function(o,e,t){}})}},locationHashChanged:function(){var o=$(".slidepopup[data-url]").not(":hidden");if(window.location.hash.length>1){var e=window.location.hash.substring(1);if(o.length>0&&o.attr("data-url")===e)return!1;void 0!==i&&void 0!==i.openLoadPop&&i.openLoadPop({target:$(document.activeElement),url:e,parent:$(document.querySelector("body > #wrap")),remove:!0})}else o.filter(":last").find(".closeOverlayPanel").trigger("click.closeBtn")}};function a(o,e){if(o.height()>=WDDO.browserHeight)if(e){var t,i=o.find("div[data-fixedfix]").filter(function(){return"fixed"===$(this).css("position")}),a=parseInt(o.attr("data-scrolltop"))||0;i.each(function(){t=$(this).offset().top,$(this).css({position:"absolute",top:o.hasClass("slideUp")?t-WDDO.browserHeight-$(window).scrollTop()+a:t})}).addClass("slidePop-fixed").removeAttr("data-fixedfix")}else o.find(".slidePop-fixed").css({position:"",top:""}).removeClass("slidePop-fixed").attr("data-fixedfix")}function n(o,e){o.height()>=WDDO.browserHeight&&(e?o.css({height:WDDO.browserHeight,"overflow-y":"auto"}):o.css({height:"auto","overflow-y":""}))}function r(o,e){var t=o.attr("data-scrolltop");void 0!==t&&(e?o.scrollTop(t):($(window).scrollTop(t),o.removeAttr("data-scrolltop")))}function l(o,e,t){var i=e.attr("data-parenttop");void 0!==i&&(t?(o.scrollTop($(window).scrollTop()),setTimeout(function(){$(window).scrollTop(i)},1)):e.removeAttr("data-parenttop"))}o.HT=o.DOTCOM=i}(window);

    //WDDO ver 1.1.1
    !function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);
})(jQuery);