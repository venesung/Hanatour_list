/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.05.27
 *
 * CF 방영 기념 이벤트
 */

$(document).ready(function () {

    //초기화
    initTab();
    initHint();
    initSwiper($('.cfmovieList > .swiper-container'), {slidesPerView: 2.6, spaceBetween: 12, slidesOffsetBefore: 12, slidesOffsetAfter: 12, freeMode: true});
    initCfMoveList();
    initSwiper($('.tab4_phone.swiper-container'), {loop: true, autoplay: 5000, autoplayDisableOnInteraction: false,
        onInit: function (data) {
            swiperChange(data);
        },
        onTransitionStart: function (data) {
            swiperChange(data);
        }
    });

    function swiperChange(data) {
        var act = parseInt($(data.container[0]).find('.swiper-slide-active').data('swiper-slide-index'));
        var total = $(data.container[0]).find('.swiper-slide').not('.swiper-slide-duplicate').length;

        $(data.container[0]).siblings('.phone_sTxt').find('> div').hide().clearQueue().eq(act).fadeIn(300);
    }

    initAppTip();

    //탭
    function initTab() {
        var tab = new WTab();
        tab.init({target: $('.tabCont'), selector: '> ul > li > a', onTag: 'li', content : $('.tabCont'), contentSelector: '> div', onChange: function (data) {
            resetSwiper(data.content);

            var topBannerH = ($('.topBannerApp').not(':hidden').length > 0) ? $('.topBannerApp').height() : 0; //상단 띠배너 높이
            moveScroll($('.tabCont').offset().top - $('.tabCont > cfTab').height() - $('#header').height() - topBannerH);
        }});
    }

    //힌트
    function initHint() {
        //힌트
        var hintBtn = $('a.hintBtn');
        hintBtn.each(function (idx) {
            $(this).data('idx', idx);
        }); 
        hintBtn.on('click.cf', function (e) {
            var target = $(e.currentTarget);
            var idx = parseInt(target.data('idx'));
            var pops = $('.hintImg');
            var dim = $('.hintdim');

            pops.hide().eq(idx).show();
            dim.show();

            pops.eq(idx).one('click.cf', 'a', function (e) {
                $(this).closest('.hintImg').hide();
                dim.hide();

                e.preventDefault();
            });

            e.preventDefault();
        });
    }

    function initCfMoveList() {
        $('.cfmovieList').on('click.cf', '.swiper-container .swiper-slide a', function (e) {
            var target = $(e.currentTarget);
            var idx = target.closest('.swiper-slide').index();

            $('.cfmovieList .swiper-container .swiper-slide a').removeClass('on');
            target.addClass('on');

            $('.cfmovieList > a').hide().eq(idx).show();

            e.preventDefault();
        });
    }

    function initAppTip() {
        var swiperContainer = $('.tab4_phone.swiper-container');
        
        swiperContainer.on('click.cf', '.nextBtn', function (e) {
            var swiper = swiperContainer[0].swiper;
            if (swiper !== undefined) swiper.slideNext();

            e.preventDefault();
        });

        swiperContainer.on('click.cf', '.prevBtn', function (e) {
            var swiper = swiperContainer[0].swiper;
            if (swiper !== undefined) swiper.slidePrev();

            e.preventDefault();
        });
    }

    //스와이프 
    function initSwiper (targetContainer, options) {
        var swiper;
        var opts;

        var defaults = {
            pagination: targetContainer.find('.swiper-pagination'),
            slidesPerView: 1,
            spaceBetween: 0,
            freeMode: false,
            roundLengths: true
        };
        
        targetContainer.each(function (idx) {
            opts = $.extend({}, defaults, options);
            swiper = new Swiper($(this), opts);
        });
    };

    //스와이프 리셋
    function resetSwiper (targetContainer) {
        targetContainer.find('.swiper-container-horizontal').each(function () {
            //swiper 초기화
            var swiper = $(this)[0].swiper;
            if (swiper !== undefined) {
                swiper.destroy(false, true);
                new Swiper(swiper.container, swiper.params);
            }
        });
    };

    //스크롤 이동
    function moveScroll(targetY) {
        $('html, body').stop().animate({
            scrollTop : targetY
        }, {queue: false, duration: 1000, easing: 'easeInOutQuart', complete: function () {
            $('body').off('touchstart.cf');
        }});

        $('body').one('touchstart.cf', function (e) {
            $('html, body').stop();
        });
    }

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
    $.easing.jswing=$.easing.swing;$.extend($.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return $.easing[$.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-$.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return $.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return $.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});
});

