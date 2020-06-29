/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.09.12
 * 
 * 닷컴 - 해외 - 하나팩 - 견적(단체 맞춤여행)
 * 
 * history
 * 
 * 1.0   (2017.09.12) : 
 *
 */

(function (scope) {
    if (scope.ESTIMATE_GROUP !== undefined) return;

    var ESTIMATE_GROUP = {};

    scope.ESTIMATE_GROUP = ESTIMATE_GROUP;
})(window);

//페이지 진입 후 hash 따라 팝업 생성
$(window).on('load', function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') DOTCOM.locationHashChanged();
});

$(document).ready(function () {
    if (DOTCOM !== undefined && typeof DOTCOM.locationHashChanged !== 'undefined') window.addEventListener('hashchange', DOTCOM.locationHashChanged);

    var wrapDIV = $('#wrap');

    $('body').on('open.slidepop', '#overlayPanel', completePopup); //팝업모션 완료후 실행 함수 정의 
    $('body').on('open.loadpop', '#overlayPanel', initPopup); //팝업로드 완료후 실행 함수 정의 

    initTab();          //탭
    initRequest();      //의뢰페이지

    function initRequest() {
        //목적지 추가
        wrapDIV.on('click.estimate_group', '.reserv_content > .reservInnerMultiple~a.btn_write', function (e) {
            var target = $(e.currentTarget);
            var parent = target.closest('.reserv_content');
            var source = parent.find('h3:first, .reservInnerMultiple:first');
            var cloneItem;

            var select = source.find('ul.inputCell > li:eq(0) select.selectBox');

            if (parent.find('h3').length === 1 && select.find('> option:selected').index() === 0) {
                //경고 메세지
                if (target.attr('data-msg-error') !== undefined) alert(target.attr('data-msg-error'));
                select.focus();
            } else {
                cloneItem = source.clone(); //복제
                var select = cloneItem.find('ul.inputCell > li:eq(0) select.selectBox');
                var inputA = cloneItem.find('ul.inputCell > li:eq(1) .normalCellRight > a');

                select.find('> option').removeAttr('selected').eq(0).prop('selected', true); //대륙 셀렉트 초기화
                if (inputA.attr('data-placeholder') !== undefined) inputA.text(inputA.attr('data-placeholder')); //대륙 셀렉트 초기화//여행도시 초기화
                
                cloneItem.filter('h3').find('> button').show().prev('sup').hide();

                parent.find('.reservInnerMultiple:last').after(cloneItem);
            }

            if (parent.find('h3').length === 3) target.hide();

            e.preventDefault();
        });

        //목적지 삭제
        wrapDIV.on('click.estimate_group', 'h3.tit_reserv > button.btnDelInputCell', function (e) {
            var target = $(e.currentTarget);
            var h3 = target.closest('h3.tit_reserv');

            h3.nextAll('a.btn_write').show();

            h3.next('div.reservInnerMultiple').remove();
            h3.remove();

            e.preventDefault();
        });

        //직접입력
        wrapDIV.find('input.selectBoxTxt').prev('select').on('change.estimate_group', function (e) {
            var target = $(e.currentTarget);
            var input = target.next('input.selectBoxTxt');

            input.toggle(target.find('option').length - 1 === target.find('option:selected').index());
        }).triggerHandler('change.estimate_group');
    }

    /**********************************************************************************************
     ********************************************* 공통 *******************************************
     **********************************************************************************************/

    //탭
    function initTab() {
        if (typeof WToggle !== 'undefined') {
            var tabIns = wrapDIV.find('.customMadeTabSect.pb_toggle').getInstance();

            if (tabIns !== undefined) {
                tabIns.setOptions({
                    onChange: function (data) {
                        if (data.idx === 1) {
                            new SwiperTemplate().initGallerySwiper($('.cmEventSwiper.swiper-container'), {
                                nextButton : '.cmEventSwiper .rarr',
                                prevButton : '.cmEventSwiper .larr'
                            });
                        }//end if

                        if (data.idx === 3) {
                            new SwiperTemplate().initGallerySwiper($('.cmUseSwiper.swiper-container'), {
                                nextButton : '.cmUseSwiper .rarr',
                                prevButton : '.cmUseSwiper .larr'
                            });
                        }//end if
                    }
                });
            }//end if
        }
    }

    //팝업로드 완료후 실행 함수 정의 
    function initPopup() {
        var popInner = $('#overlayPanel div.fullPopCommon');

        if (popInner.length > 0) {
            DOTCOM.initToggle(popInner);

            var cityTab = new WTab();
            cityTab.init({target: popInner.find('.cityListNew'), selector: '> ul > li > a', onTag: 'a', content: popInner.find('.cityListNew'), contentSelector: '> ul > li > div', onChange: function (data) {
                
            }});
        } //end if
    }

    //팝업모션 완료후 실행 함수 정의 
    function completePopup() {
        var popInner = $('#overlayPanel div.fullPopCommon');

        if (popInner.length > 0) {
            //줌
            if (popInner.find('.certIntroPaper').length > 0) {
                var container = popInner.find('.certIntroPaper').filter('.zoomBox');
                container.on('click', 'a', function (e) {
                    $('.zoomWrap').remove();

                    var zoomDIV = $('<div class="zoomWrap"></div>'); //div.zoomContainer 생성 하고 부모만 생성, modify 1.2
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
        }
    }

    new SwiperTemplate().initGallerySwiper($('.customMadeTop .swiper-container'), {effect: 'fade', loop: true, autoplay: 4500, speed: 1500, touchAngle: -1});

    /**********************************************************************************************
     **************************************** 외부 제공 함수 **************************************
     **********************************************************************************************/

    //달력
    function initCalendar(options, pickerTarget) {
        if (typeof Hanatour_components_calendar === 'undefined') return;

        var datepickerTarget = pickerTarget || $('#datepicker');

        var opts = $.extend({}, {
            numberOfMonths: [12, 1],
            minDate: '+1d',
            maxDate: '+3y',
            yearSuffix: '',
            monthSuffix: '월',
            range: true,
            onRange : function (dateArr) {
                var checkin = dateArr[0] || '';
                var checkout = dateArr[1] || '';
                
                $('.twoType > .dayCell:eq(0) > strong').text(checkin);
                $('.twoType > .dayCell:eq(1) > strong').text(checkout);
            },
            onSelect : function (date) {
                
            },
            addUpdate : function (container) {
                var datepickers = container.container;
                var titleDIV = datepickers.find('.ui-datepicker-title');
                var dayTHEAD = datepickers.find('thead');
                var yearSPAN = titleDIV.find('span.ui-datepicker-year');
                var monthSPAN = titleDIV.find('span.ui-datepicker-month');

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
    };

    ESTIMATE_GROUP.initCalendar = initCalendar;
    ESTIMATE_GROUP.initPopup = initPopup;
    ESTIMATE_GROUP.SwiperTemplate = (function () {return new SwiperTemplate()})();
});

/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1
* @since : 2016.11.11
*
* history
*   1.0   (2016.11.11) : -
*   1.1.0 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
*                        resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
*                        initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
*   1.1.1 (2017.05.19) : verticalMode 에서 가로형 이미지도 모두 적용토록 수정하고 opts.vertical 생성하여 필요시에만 적용, verticalMode() 간소화
*                        loop, lazy 조합 시 div.swiper-slide-duplicate 에 .swiper-lazy 대상이 .swiper-lazy-loading 상황일때 복제되어 lazy 재로드 못하는 문제 해결 
*                        watchSlidesVisibility:true 기본으로 추가되도록 수정
*
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
(function(b){if(b.SwiperTemplate!==undefined){return}var a=(function(d){var c=function(){var e,h;var k={};var l=false;function g(q,p){var o=q.container;var n=o.find(".swiper-pagination > span").length;var m=o.find(".swiper-pagination .swiper-pagination-bullet-active").index();o.find(".swiper-pag-num").html("<span>"+(m+1)+"</span> / "+n);if(k.loop&&k.lazyLoading){o.find(".swiper-slide-visible.swiper-slide-duplicate .swiper-lazy").removeClass("swiper-lazy-loading")}if(k.exChange!==undefined){k.exChange(q,p)}}function j(){h.each(function(m){if(d(this).is(".swiper-container-horizontal")){e=d(this)[0].swiper;if(e!==undefined){e.destroy(false,true)}}})}function i(m,o){var n=d(m);var o=n.find("img");o.css("marginTop",(o.parent().height()-o.height())*0.5)}function f(n){var m=n.container;var o=(d(window).width()/9)*16;m.find(".swiper-container .swiper-slide").css("height",o*0.32);m.find(".swiper-container .swiper-slide img").css("height",o*0.32)}return{initGallerySwiper:function(n,m){var o;h=n;j();if(h.find(".swiper-slide").length===1){h.find(".swiper-pagination").hide()}h.each(function(p){o={viewport:false,vertical:false,pagination:d(this).find(".swiper-pagination"),loop:((d(this).find(".swiper-slide").length>1)?true:false),preloadImages:false,watchSlidesVisibility:true,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(s,q,r){if(k.vertical){i(q,r)}},onSlideChangeStart:function(q){g(q,"onSlideChangeStart")},onSliderMove:function(q){g(q,"onSliderMove")},onTransitionEnd:function(q){g(q,"onTransitionEnd")},onInit:function(q){g(q,"onInit");if(k.viewport){f(q)}}};k=d.extend({},o,m);e=new Swiper(d(this),k)});h.find("a.big5_prev").on("click.city",function(r){var q=d(r.currentTarget);var p=q.closest(".swiper-container")[0].swiper;p.slidePrev();g(p);r.preventDefault()});h.find("a.big5_next").on("click.city",function(r){var q=d(r.currentTarget);var p=q.closest(".swiper-container")[0].swiper;p.slideNext();g(p);r.preventDefault()})},initFreeSwiper:function(n,m){h=n;j();var o={pagination:h.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true};h.each(function(p){k=d.extend({},o,m);e=new Swiper(d(this),k)})},resetSwiper:function(m){h=(m.hasClass("swiper-container-horizontal"))?m:m.find(".swiper-container-horizontal");h.each(function(){e=d(this)[0].swiper;if(e!==undefined){e.destroy(false,true);new Swiper(e.container,e.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);

//http://www.jqueryscript.net/zoom/Smart-jQuery-Pan-Zoom-Plugin-Smart-jQuery-Zoom.html  
//custom : if (s.settings.zoomCallback !== undefined) s.settings.zoomCallback(h); //@wddo
function transitionEnd(){var b=document.createElement("bootstrap");var a={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in a){if(b.style[c]!==undefined){return{end:a[c]}}}return false}(function(a){a.fn.smartZoom=function(J){function O(b){}function K(d,b){var c=U.data("smartZoomData");if(c.currentWheelDelta*b<0){c.currentWheelDelta=0}c.currentWheelDelta+=b;Y.zoom(c.mouseWheelDeltaFactor*c.currentWheelDelta,{x:d.pageX,y:d.pageY})}function R(b){b.preventDefault()}function H(){var d=U.data("smartZoomData");if(d.settings.mouseMoveEnabled!=true||d.settings.moveCursorEnabled!=true){return}var b=j();var c=b.width/d.originalSize.width;if(parseInt(c*100)>parseInt(d.adjustedPosInfos.scale*100)){U.css({cursor:"move"})}else{U.css({cursor:"default"})}}function af(b){V(b.pageX,b.pageY)}function ab(b){b.preventDefault();a(document).on("mousemove.smartZoom",W);a(document).bind("mouseup.smartZoom",ad);var c=U.data("smartZoomData");c.moveCurrentPosition=new P(b.pageX,b.pageY);c.moveLastPosition=new P(b.pageX,b.pageY)}function W(c){var b=U.data("smartZoomData");if(b.mouseMoveForPan||!b.mouseMoveForPan&&b.moveCurrentPosition.x!=c.pageX&&b.moveCurrentPosition.y!=c.pageY){b.mouseMoveForPan=true;G(c.pageX,c.pageY,0,false)}}function ad(c){var d=U.data("smartZoomData");if(d.mouseMoveForPan){d.mouseMoveForPan=false;if(d.moveLastPosition.distance(d.moveCurrentPosition)>4){var b=d.moveLastPosition.interpolate(d.moveCurrentPosition,-4);G(b.x,b.y,500,true)}else{G(d.moveLastPosition.x,d.moveLastPosition.y,0,true)}}else{if(d.settings.zoomOnSimpleClick){V(c.pageX,c.pageY)}}a(document).unbind("mousemove.smartZoom");a(document).unbind("mouseup.smartZoom")}function Z(f){f.preventDefault();a(document).unbind("touchmove.smartZoom");a(document).unbind("touchend.smartZoom");a(document).bind("touchmove.smartZoom",Q);a(document).bind("touchend.smartZoom",ac);var h=f.originalEvent.touches;var d=h[0];var g=U.data("smartZoomData");g.touch.touchMove=false;g.touch.touchPinch=false;g.moveCurrentPosition=new P(d.pageX,d.pageY);g.moveLastPosition=new P(d.pageX,d.pageY);g.touch.lastTouchPositionArr=new Array;var k;var c=h.length;for(var b=0;b<c;++b){k=h[b];g.touch.lastTouchPositionArr.push(new P(k.pageX,k.pageY))}}function Q(al){al.preventDefault();var C=U.data("smartZoomData");var N=al.originalEvent.touches;var L=N.length;var T=N[0];if(L==1&&!C.touch.touchPinch&&C.settings.touchMoveEnabled==true){if(!C.touch.touchMove){var v=C.touch.lastTouchPositionArr[0];if(v.distance(new P(T.pageX,T.pageY))<3){return}else{C.touch.touchMove=true}}G(T.pageX,T.pageY,0,false)}else{if(L==2&&!C.touch.touchMove&&C.settings.pinchEnabled==true){C.touch.touchPinch=true;var ap=N[1];var ak=C.touch.lastTouchPositionArr[0];var ah=C.touch.lastTouchPositionArr[1];var an=new P(T.pageX,T.pageY);var ai=new P(ap.pageX,ap.pageY);var S=an.distance(ai);var am=ak.distance(ah);var ag=S-am;if(Math.abs(ag)<3){return}var aj=new P((an.x+ai.x)/2,(an.y+ai.y)/2);var i=j();var ao=C.originalSize;var n=i.width/ao.width;var A=S/am;var k=i.width*A/ao.width;Y.zoom(k-n,aj,0);C.touch.lastTouchPositionArr[0]=an;C.touch.lastTouchPositionArr[1]=ai}}}function ac(c){c.preventDefault();var f=c.originalEvent.touches.length;if(f==0){a(document).unbind("touchmove.smartZoom");a(document).unbind("touchend.smartZoom")}var b=U.data("smartZoomData");if(b.touch.touchPinch){return}if(b.touch.touchMove){if(b.moveLastPosition.distance(b.moveCurrentPosition)>2){var d=b.moveLastPosition.interpolate(b.moveCurrentPosition,-4);G(d.x,d.y,500,true)}}else{if(b.settings.dblTapEnabled==true&&b.touch.lastTouchEndTime!=0&&(new Date).getTime()-b.touch.lastTouchEndTime<400){var g=b.touch.lastTouchPositionArr[0];V(g.x,g.y)}b.touch.lastTouchEndTime=(new Date).getTime()}}function G(k,r,g,v){aa(O.PAN);var b=U.data("smartZoomData");b.moveLastPosition.x=b.moveCurrentPosition.x;b.moveLastPosition.y=b.moveCurrentPosition.y;var p=U.offset();var n=j();var h=p.left+(k-b.moveCurrentPosition.x);var d=p.top+(r-b.moveCurrentPosition.y);var m=B(h,d,n.width,n.height);D(O.PAN,O.START,false);I(U,m.x,m.y,n.width,n.height,g,v==true?function(){D(O.PAN,O.END,false)}:null);b.moveCurrentPosition.x=k;b.moveCurrentPosition.y=r}function V(h,m){var b=U.data("smartZoomData");var n=b.originalSize;var c=j();var k=c.width/n.width;var i=b.adjustedPosInfos.scale;var g=parseFloat(b.settings.dblClickMaxScale);var d;if(k.toFixed(2)>g.toFixed(2)||Math.abs(g-k)>Math.abs(k-i)){d=g-k}else{d=i-k}Y.zoom(d,{x:h,y:m})}function aa(c){var f=U.data("smartZoomData");if(f.transitionObject){if(f.transitionObject.cssAnimHandler){U.off(a.support.transition,f.transitionObject.cssAnimTimer)}var b=f.originalSize;var d=j();var g=new Object;g[f.transitionObject.transition]="all 0s";if(f.transitionObject.css3dSupported){g[f.transitionObject.transform]="translate3d("+d.x+"px, "+d.y+"px, 0) scale3d("+d.width/b.width+","+d.height/b.height+", 1)"}else{g[f.transitionObject.transform]="translateX("+d.x+"px) translateY("+d.y+"px) scale("+d.width/b.width+","+d.height/b.height+")"}U.css(g)}else{U.stop()}H();if(c!=null){D(c,"",true)}}function B(h,d,g,c){var f=U.data("smartZoomData");var k=Math.min(f.adjustedPosInfos.top,d);k+=Math.max(0,f.adjustedPosInfos.top+f.adjustedPosInfos.height-(k+c));var b=Math.min(f.adjustedPosInfos.left,h);b+=Math.max(0,f.adjustedPosInfos.left+f.adjustedPosInfos.width-(b+g));return new P(b.toFixed(2),k.toFixed(2))}function ae(b){U.unbind("load.smartZoom");Y.init.apply(U,[b.data.arguments])}function F(){var m=U.data("smartZoomData");var u=m.containerDiv;var b=m.originalSize;var h=u.parent().offset();var v=M(m.settings.left,h.left,u.parent().width());var d=M(m.settings.top,h.top,u.parent().height());u.offset({left:v,top:d});u.width(q(m.settings.width,u.parent().width(),v-h.left));u.height(q(m.settings.height,u.parent().height(),d-h.top));var p=z(u);var k=Math.min(Math.min(p.width/b.width,p.height/b.height),1).toFixed(2);var g=b.width*k;var n=b.height*k;m.adjustedPosInfos={left:(p.width-g)/2+h.left,top:(p.height-n)/2+h.top,width:g,height:n,scale:k};aa();I(U,m.adjustedPosInfos.left,m.adjustedPosInfos.top,g,n,0,function(){U.css("visibility","visible")});H()}function I(E,b,n,L,k,C,A){var w=U.data("smartZoomData");var m=w.containerDiv.offset();var y=b-m.left;var v=n-m.top;if(w.transitionObject!=null){var g=w.originalSize;var x=new Object;x[w.transitionObject.transform+"-origin"]="0 0";x[w.transitionObject.transition]="all "+C/1000+"s ease-out";if(w.transitionObject.css3dSupported){x[w.transitionObject.transform]="translate3d("+y+"px, "+v+"px, 0) scale3d("+L/g.width+","+k/g.height+", 1)"}else{x[w.transitionObject.transform]="translateX("+y+"px) translateY("+v+"px) scale("+L/g.width+","+k/g.height+")"}if(A!=null){w.transitionObject.cssAnimHandler=A;E.one(a.support.transition.end,w.transitionObject.cssAnimHandler)}E.css(x)}else{E.animate({"margin-left":y,"margin-top":v,width:L,height:k},{duration:C,easing:w.settings.easing,complete:function(){if(A!=null){A()}}})}}function j(m){var w=U.data("smartZoomData");var b=U.width();var h=U.height();var x=U.offset();var d=parseInt(x.left);var v=parseInt(x.top);var p=w.containerDiv.offset();if(m!=true){d=parseInt(d)-p.left;v=parseInt(v)-p.top}if(w.transitionObject!=null){var k=U.css(w.transitionObject.transform);if(k&&k!=""&&k.search("matrix")!=-1){var g;var n;if(k.search("matrix3d")!=-1){n=k.replace("matrix3d(","").replace(")","").split(",");g=n[0]}else{n=k.replace("matrix(","").replace(")","").split(",");g=n[3];d=parseFloat(n[4]);v=parseFloat(n[5]);if(m){d=parseFloat(d)+p.left;v=parseFloat(v)+p.top}}b=g*b;h=g*h}}return{x:d,y:v,width:b,height:h}}function D(g,d,c){var f=U.data("smartZoomData");var h="";if(c==true&&f.currentActionType!=g){h=f.currentActionType+"_"+O.END;f.currentActionType="";f.currentActionStep=""}else{if(f.currentActionType!=g||f.currentActionStep==O.END){f.currentActionType=g;f.currentActionStep=O.START;h=f.currentActionType+"_"+f.currentActionStep}else{if(f.currentActionType==g&&d==O.END){f.currentActionStep=O.END;h=f.currentActionType+"_"+f.currentActionStep;f.currentActionType="";f.currentActionStep=""}}}if(h!=""){var b=jQuery.Event(h);b.targetRect=j(true);b.scale=b.targetRect.width/f.originalSize.width;U.trigger(b)}}function e(){var v=document.body||document.documentElement;var g=v.style;var b=["transition","WebkitTransition","MozTransition","MsTransition","OTransition"];var h=["transition","-webkit-transition","-moz-transition","-ms-transition","-o-transition"];var w=["transform","-webkit-transform","-moz-transform","-ms-transform","-o-transform"];var d=b.length;var p;for(var m=0;m<d;m++){if(g[b[m]]!=null){var k=w[m];var l=a('<div style="position:absolute;">Translate3d Test</div>');a("body").append(l);p=new Object;p[w[m]]="translate3d(20px,0,0)";l.css(p);var c=l.offset().left-a("body").offset().left==20;l.empty().remove();if(c){return{transition:h[m],transform:w[m],css3dSupported:c}}}}return null}function q(c,b,d){if(c.search&&c.search("%")!=-1){return(b-d)*(parseInt(c)/100)}else{return parseInt(c)}}function M(c,b,d){if(c.search&&c.search("%")!=-1){return b+d*(parseInt(c)/100)}else{return b+parseInt(c)}}function X(){F()}function z(d){var b=d.offset();if(!b){return null}var f=b.left;var c=b.top;return{x:f,y:c,width:d.outerWidth(),height:d.outerHeight()}}function P(c,b){this.x=c;this.y=b;this.toString=function(){return"(x="+this.x+", y="+this.y+")"};this.interpolate=function(g,d){var h=d*this.x+(1-d)*g.x;var f=d*this.y+(1-d)*g.y;return new P(h,f)};this.distance=function(d){return Math.sqrt(Math.pow(d.y-this.y,2)+Math.pow(d.x-this.x,2))}}var U=this;O.ZOOM="SmartZoom_ZOOM";O.PAN="SmartZoom_PAN";O.START="START";O.END="END";O.DESTROYED="SmartZoom_DESTROYED";var Y={init:function(f){if(U.data("smartZoomData")){return}var g=a.extend({top:"0",left:"0",width:"100%",height:"100%",easing:"smartZoomEasing",initCallback:null,maxScale:3,dblClickMaxScale:1.8,mouseEnabled:true,scrollEnabled:true,dblClickEnabled:true,mouseMoveEnabled:true,moveCursorEnabled:true,adjustOnResize:true,touchEnabled:true,dblTapEnabled:true,zoomOnSimpleClick:false,pinchEnabled:true,touchMoveEnabled:true,containerBackground:"#FFFFFF",containerClass:""},f);var h=U.attr("style");var d="smartZoomContainer"+(new Date).getTime();var c=a('<div id="'+d+'" class="'+g.containerClass+'"></div>');U.before(c);U.remove();c=a("#"+d);c.css({overflow:"hidden"});if(g.containerClass==""){c.css({"background-color":g.containerBackground})}c.append(U);var b=new Object;b.lastTouchEndTime=0;b.lastTouchPositionArr=null;b.touchMove=false;b.touchPinch=false;U.data("smartZoomData",{settings:g,containerDiv:c,originalSize:{width:U.width(),height:U.height()},originalPosition:U.offset(),transitionObject:e(),touch:b,mouseWheelDeltaFactor:0.15,currentWheelDelta:0,adjustedPosInfos:null,moveCurrentPosition:null,moveLastPosition:null,mouseMoveForPan:false,currentActionType:"",initialStyles:h,currentActionStep:""});F();if(g.touchEnabled==true){U.bind("touchstart.smartZoom",Z)}if(g.mouseEnabled==true){if(g.mouseMoveEnabled==true){U.bind("mousedown.smartZoom",ab)}if(g.scrollEnabled==true){c.bind("mousewheel.smartZoom",K);c.bind("mousewheel.smartZoom DOMMouseScroll.smartZoom",R)}if(g.dblClickEnabled==true&&g.zoomOnSimpleClick==false){c.bind("dblclick.smartZoom",af)}}document.ondragstart=function(){return false};if(g.adjustOnResize==true){a(window).bind("resize.smartZoom",X)}if(g.initCallback!=null){g.initCallback.apply(this,U)}},zoom:function(ah,u,L){var x=U.data("smartZoomData");var A;var al;if(!u){var ag=z(x.containerDiv);A=ag.x+ag.width/2;al=ag.y+ag.height/2}else{A=u.x;al=u.y}aa(O.ZOOM);var E=j(true);var aj=x.originalSize;var S=E.width/aj.width+ah;S=Math.max(x.adjustedPosInfos.scale,S);S=Math.min(x.settings.maxScale,S);if(x.settings.zoomCallback!==undefined){x.settings.zoomCallback(S)}var y=aj.width*S;var ai=aj.height*S;var r=A-E.x;var C=al-E.y;var ak=y/E.width;var n=E.x-(r*ak-r);var g=E.y-(C*ak-C);var k=B(n,g,y,ai);if(L==null){L=700}D(O.ZOOM,O.START,false);I(U,k.x,k.y,y,ai,L,function(){x.currentWheelDelta=0;H();D(O.ZOOM,O.END,false)})},pan:function(g,d,c){if(g==null||d==null){return}if(c==null){c=700}var f=U.offset();var h=j();var b=B(f.left+g,f.top+d,h.width,h.height);if(b.x!=f.left||b.y!=f.top){aa(O.PAN);D(O.PAN,O.START,false);I(U,b.x,b.y,h.width,h.height,c,function(){D(O.PAN,O.END,false)})}},destroy:function(){var c=U.data("smartZoomData");if(!c){return}aa();var b=c.containerDiv;U.unbind("mousedown.smartZoom");U.bind("touchstart.smartZoom");b.unbind("mousewheel.smartZoom");b.unbind("dblclick.smartZoom");b.unbind("mousewheel.smartZoom DOMMouseScroll.smartZoom");a(window).unbind("resize.smartZoom");a(document).unbind("mousemove.smartZoom");a(document).unbind("mouseup.smartZoom");a(document).unbind("touchmove.smartZoom");a(document).unbind("touchend.smartZoom");U.css({cursor:"default"});b.before(U);I(U,c.originalPosition.left,c.originalPosition.top,c.originalSize.width,c.originalSize.height,5);U.removeData("smartZoomData");b.remove();U.attr("style",c.initialStyles);U.trigger(O.DESTROYED)},isPluginActive:function(){return U.data("smartZoomData")!=undefined}};if(Y[J]){return Y[J].apply(this,Array.prototype.slice.call(arguments,1))}else{if(typeof J==="object"||!J){if(U[0].tagName.toLowerCase()=="img"&&!U[0].complete){U.bind("load.smartZoom",{arguments:arguments[0]},ae)}else{Y.init.apply(U,[arguments[0]])}}else{a.error("Method "+J+" does not exist on e-smartzoom jquery plugin")}}}})(jQuery);(function(a){a.extend(a.easing,{smartZoomEasing:function(c,f,e,b,d){return a.easing.smartZoomOutQuad(c,f,e,b,d)},smartZoomOutQuad:function(f,c,g,d,b){return -d*(c/=b)*(c-2)+g}})})(jQuery);(function(c){function a(g){var l=g||window.event,j=[].slice.call(arguments,1),f=0,h=true,k=0,e=0;g=c.event.fix(l);g.type="mousewheel";if(l.wheelDelta){f=l.wheelDelta/120}if(l.detail){f=-l.detail/3}e=f;if(l.axis!==undefined&&l.axis===l.HORIZONTAL_AXIS){e=0;k=-1*f}if(l.wheelDeltaY!==undefined){e=l.wheelDeltaY/120}if(l.wheelDeltaX!==undefined){k=-1*l.wheelDeltaX/120}j.unshift(g,f,k,e);return(c.event.dispatch||c.event.handle).apply(this,j)}var d=["DOMMouseScroll","mousewheel"];if(c.event.fixHooks){for(var b=d.length;b;){c.event.fixHooks[d[--b]]=c.event.mouseHooks}}c.event.special.mousewheel={setup:function(){if(this.addEventListener){for(var f=d.length;f;){this.addEventListener(d[--f],a,false)}}else{this.onmousewheel=a}},teardown:function(){if(this.removeEventListener){for(var f=d.length;f;){this.removeEventListener(d[--f],a,false)}}else{this.onmousewheel=null}}};c.fn.extend({mousewheel:function(f){return f?this.bind("mousewheel",f):this.trigger("mousewheel")},unmousewheel:function(f){return this.unbind("mousewheel",f)}})})(jQuery);$.fn.emulateTransitionEnd=function(c){var a=false,d=this;$(this).one($.support.transition.end,function(){a=true});var b=function(){if(!a){$(d).trigger($.support.transition.end)}};setTimeout(b,c);return this};$(function(){$.support.transition=transitionEnd()});

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