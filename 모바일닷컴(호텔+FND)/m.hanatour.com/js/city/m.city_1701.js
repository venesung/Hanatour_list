/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2015.12.27
 */

$(document).ready(function () {
    //추천여행지
    City.init();
});

/**
* 추천여행지 - 알버타
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
        defaults = getDefaultOption(),
        init = function (options) {
            opts = $.extend(defaults, options);

            if ($('.thisMonthCont').length > 0) {
                /*
                selectBox = $('.recom_inCont select');

                initLayout();
                initEvent();

                //초기 셀렉트
                selectBox.each(function () {
                    var idx = $(this).find('> option:selected').index();

                    $(this).find('option').eq(idx).prop("selected", true);
                    $(this).trigger('change.city');
                });

                //스와이프 초기화
                initSwiper();
                */

                //상단 스크롤바 스와이프
                initFreeScrollSwiper($('.thisMonthCont .thisMonthTop .cityInfoList'));

            }
        };

    function getDefaultOption() {
        return {
            
        };
    }

    function initLayout() {
        
    }

    function initEvent() {
        /*
        selectBox.each(function () {
            $(this).eq(0).on('change.city', function (e) {
                var target = $(e.currentTarget);
                var idx = target[0].selectedIndex;

                target.nextAll('div').hide().eq(idx).show();

                //타이틀 이미지 변경
                target.closest('.recom_inCont').find('> div.contTop01').hide().eq(idx).show();

                //스와이프 재초기화
                initSwiper($('.recom_inCont').not(':hidden'));
            });
        });
        */
    }

    function initFreeScrollSwiper(siwpeContainer) {
        var timeId;

        var changeFun = function() {
            var container = siwpeContainer;
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

        var topSwiper = new Swiper(siwpeContainer, {
            slidesPerView: 'auto',
            freeMode: true,
            onTransitionStart : function () {
                if (timeId!== undefined) {
                    clearInterval(timeId);
                    timeId = undefined;
                }

                timeId = setInterval(changeFun, 10);
            },
            onTransitionEnd: function () {
                if (timeId !== undefined) {
                    clearInterval(timeId);
                    timeId = undefined;
                }
            },
            onSliderMove : changeFun,
            onInit : function (data) {
                $(window).on('orientationchange', function(){
                    changeFun();
                });

                changeFun();
            }

        });
    }

    function initSwiper(contentContainer) {
        var swiper;

        contentContainer.find('.global_swiper').each(function (idx) {
            if ($(this).hasClass('swiper-container-horizontal')) {
                var swiper = $(this)[0].swiper;
                swiper.destroy(false, true);
                new Swiper(swiper.container, swiper.params);

                return;
            }

            swiper = new Swiper($(this), {
                pagination: $(this).find('.swiper-pagination'),
                loop: (($(this).find('.swiper-slide').length > 1) ? true : false),
                onSlideChangeStart : changeGlobalSwiper,
                onTransitionEnd : changeGlobalSwiper
            });

            if ($(this).find('.swiper-slide').length === 1) $(this).find('.swiper-pagination').hide();

            $(this).find('a.big5_prev').on('click.city', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slidePrev();
                changeGlobalSwiper(s);

                e.preventDefault();
            });

            $(this).find('a.big5_next').on('click.city', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slideNext();
                changeGlobalSwiper(s);

                e.preventDefault();
            });
        });

        function changeGlobalSwiper(e) {
            var container = e.container;
            var max = container.find('.swiper-pagination > span').length;
            var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

            container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);
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


    function matrixToArray(str){
        return str.split( '(')[ 1].split( ')')[ 0].split( ',') ;
    }

    return {
        init: function (options) {
            init(options);
        }
   };
}(jQuery));

/**
* GlobalTab - 공통 탭
*
* var instance = new GlobalTab(_target, options);
*
* @param options    ::: 설정 Object 값
*
* options
*   target:Object = $('selector')           //텝 메뉴 버튼 jQuery Object
*   onTag:String = 'li'                     //on 클래스를 적용 할 태그 셀렉션 String
*   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
*   onChange:Function = fun(event)          //텝 변경 콜백함수
*   onChangeParams:Array = []               //텝 변경 콜백함수 인자
*
* instance.init(options);             //초기화
*
*/
var GlobalTab = (function ($) {
    var wddoObj = function (options) {
        var targetA,
            content,
            opts,
            defaults = getDefaultOption(),
            init = function (options) {
                opts = $.extend(defaults, options);

                targetA = opts.target;
                content = opts.content;

                if (targetA.length > 0) {
                    initLayout();
                    initEvent();
                }
            };

        function getDefaultOption() {
            return {
                target : $(jQuery.fn),
                onTag : 'li',
                content : $(jQuery.fn),
                onChange : undefined,
                onChangeParams : []
            };
        }
         
        function initLayout() {
            targetA.each(function (idx) {
                $(this).data('idx', idx);
            });
        }

        function initEvent() {
            targetA.on('click.GlobalTab', function (e) {
                var target = $(e.currentTarget);
                var idx = parseInt(target.data('idx'));

                if (target.siblings('a').length !== 0) { //a태그 on
                    target.addClass('on').siblings('a').removeClass('on');
                } else {
                    targetA.closest(opts.onTag).removeClass('on').eq(idx).addClass('on');
                }
                
                content.hide().eq(idx).show();

                if (opts.onChange !== undefined) opts.onChange.apply(this, [{target: target, idx: idx, content: content.eq(idx), params: opts.onChangeParams}]);

                e.preventDefault();
                e.stopPropagation();
            });
        }

        return {
            init: function (options) {
                init(options);
            }
        };
    };

    return wddoObj;
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
