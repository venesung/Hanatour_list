/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.07.25
 */

$(document).ready(function () {
    //추천여행지
    City.init();
});

/**
* 추천여행지 - 캘리포니아
*
* City.init(options);
*
* @param options    ::: 설정 Object 값
*
* options
*   key:type = value        //설명
*
* method
*   City.init(options);     //초기화
*/
var City = (function ($) {
    var selectBox,
        opts,
        container,
        defaults = getDefaultOption(),
        init = function (options) {
            opts = $.extend(defaults, options);
            container = $('.thisMonthCont');

            if (container.length > 0) {
                selectBox = $('.recom_inCont select');

                initLayout();
                initEvent();

                //초기 셀렉트
                selectBox.each(function () {
                    var idx = $(this).find('> option:selected').index();

                    $(this).find('option').eq(idx).prop('selected', true);
                    $(this).trigger('change.city');
                });

                //스와이프 초기화
                new SwiperTemplate().initGallerySwiper(container.find('.swiper-container'));

                new SwiperTemplate().initFreeSwiper($('.thisMonthCont .thisMonthTop .cityInfoList'), {exChange: function (data, event) {
                    var container = $(data.container[0]);
                    var swiper = container[0].swiper;

                    var bar = container.find('.swipeBar > .bar');

                    //컨텐츠 넓이 정의
                    var cw = 0;
                    container.find('.swiper-slide').each(function () {
                        cw += $(this).outerWidth();
                    });

                    //스와이프 영역 넓이
                    var sw = swiper.width;

                    //바넓이 정의
                    var bh = Math.floor(getLinearFunction(0, cw, 0, sw, sw));
                    bar.css('width', bh);

                    //숨김 유무
                    container.toggleClass('threeType', !(sw > bh));

                    if (data.position !== undefined) {
                        var xpos = data.position.x || 0;
                        var value = Math.floor(getLinearFunction(0, cw, 0, sw, xpos));
                        bar.css('left', -value);
                    }
                }});

                //텝
                //pb_toggle (common_new.js 에서 컨트롤)

                //2중 텝
                if (typeof WToggle !== 'undefined') {
                    var innerTab
                    $('.month_inner_tab_wrap').each(function () {
                        innerTab = new WToggle();
                        innerTab.init({target: $(this), selector: 'ul.month_inner_tab > li > a', onTag: 'a', onClass: 'month_inner_tab_link_on', content: $(this).parent(), contentSelector: '> div.productCont'});
                    });
                }
            }
        };

    function getDefaultOption() {
        return {
            
        };
    }

    function initLayout() {
        
    }

    function initEvent() {
        selectBox.each(function () {
            $(this).eq(0).on('change.city', function (e) {
                var target = $(e.currentTarget);
                var idx = target[0].selectedIndex;

                target.nextAll('div').hide().eq(idx).show();

                //타이틀 이미지 변경
                target.closest('.recom_inCont').find('> div.contTop01').hide().eq(idx).show();

                //스와이프 재초기화
                new SwiperTemplate().initGallerySwiper($('.recom_inCont').not(':hidden').find('.swiper-container-horizontal'));
            });
        });
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

    /**
    * Swiper 템플릿
    *
    * @author : Jo Yun Ki (ddoeng@naver.com)
    * @version : 1.1.2
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
    *   1.1.2 (2017.08.29) : initFreeSwiper에 change 이벤트 확장, orientationchange 이벤트 적용, data.position 추가 하여 이동 포지션 참조 가능
    *
    *
    * PUBLIC.method = (function () {return new SwiperTemplate()})(); 
    */
    (function(b){if(b.SwiperTemplate!==undefined){return}var a=(function(d){var c=function(){var j,g;var e={};var h=false;function k(s,r){var p=s.container;var o=p.find(".swiper-pagination > span").length;var n=p.find(".swiper-pagination .swiper-pagination-bullet-active").index();p.find(".swiper-pag-num").html("<span>"+(n+1)+"</span> / "+o);if(e.loop&&e.lazyLoading){p.find(".swiper-slide-visible.swiper-slide-duplicate .swiper-lazy").removeClass("swiper-lazy-loading")}var q=p.find(".swiper-wrapper").css("transform");if(q!==undefined&&q!=="none"&&d.isArray(f(q))&&q.length>5){s.position={x:parseInt(f(q)[4])}}if(e.exChange!==undefined){e.exChange(s,r)}}function i(){g.each(function(n){if(d(this).is(".swiper-container-horizontal")){j=d(this)[0].swiper;if(j!==undefined){j.destroy(false,true)}}})}function m(n,p){var o=d(n);var p=o.find("img");p.css("marginTop",(p.parent().height()-p.height())*0.5)}function l(o){var n=o.container;var p=(d(window).width()/9)*16;n.find(".swiper-container .swiper-slide").css("height",p*0.32);n.find(".swiper-container .swiper-slide img").css("height",p*0.32)}function f(n){return n.split("(")[1].split(")")[0].split(",")}return{initGallerySwiper:function(o,n){var p;g=o;i();if(g.find(".swiper-slide").length===1){g.find(".swiper-pagination").hide()}g.each(function(q){p={viewport:false,vertical:false,pagination:d(this).find(".swiper-pagination"),loop:((d(this).find(".swiper-slide").length>1)?true:false),preloadImages:false,watchSlidesVisibility:true,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(t,r,s){if(e.vertical){m(r,s)}},onSlideChangeStart:function(r){k(r,"onSlideChangeStart")},onSliderMove:function(r){k(r,"onSliderMove")},onTransitionEnd:function(r){k(r,"onTransitionEnd")},onInit:function(r){d(window).on("orientationchange",function(){setTimeout(function(){k(r,"orientationchange")},50)});k(r,"onInit");if(e.viewport){l(r)}}};e=d.extend({},p,n);j=new Swiper(d(this),e)});g.find("a.big5_prev").on("click.city",function(t){var r=d(t.currentTarget);var q=r.closest(".swiper-container")[0].swiper;q.slidePrev();k(q);t.preventDefault()});g.find("a.big5_next").on("click.city",function(t){var r=d(t.currentTarget);var q=r.closest(".swiper-container")[0].swiper;q.slideNext();k(q);t.preventDefault()})},initFreeSwiper:function(p,n){g=p;i();var o;var q={pagination:g.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true,onTransitionStart:function(r){if(o!==undefined){clearInterval(o);o=undefined}o=setInterval(function(){k(r,"onTransitionStart")},10)},onSliderMove:function(r){k(r,"onSliderMove")},onTransitionEnd:function(r){if(o!==undefined){clearInterval(o);o=undefined}},onInit:function(r){d(window).on("orientationchange",function(){setTimeout(function(){k(r,"orientationchange")},50)});k(r,"onInit")}};g.each(function(r){e=d.extend({},q,n);j=new Swiper(d(this),e)})},resetSwiper:function(n){g=(n.hasClass("swiper-container-horizontal"))?n:n.find(".swiper-container-horizontal");g.each(function(){j=d(this)[0].swiper;if(j!==undefined){j.destroy(false,true);new Swiper(j.container,j.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);

    return {
        init: function (options) {
            init(options);
        }
   };
}(jQuery));


/********************************************************************************************/
/***************************************** Extends ******************************************/
/********************************************************************************************/

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };


/********************************************************************************************/
/***************************************** Library ******************************************/
/********************************************************************************************/

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */
