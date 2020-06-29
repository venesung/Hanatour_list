/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2017.03.16
 *
 * Customer Information Intercommunication System (고객정보상호전달체계)
 * 
 * history
 * 
 * 1.0 (2017.03.16) : 
 * 
 */

/**
 * @version 1.1.2
 * @link https://github.com/gajus/orientationchangeend for the canonical source repository
 * @license https://github.com/gajus/orientationchangeend/blob/master/LICENSE BSD 3-Clause
 * 
 * @modifier wddo - off() 기능 없어서 추가
 */
! function n(e, t, o) {
    function i(u, f) {
        if (!t[u]) {
            if (!e[u]) {
                var a = "function" == typeof require && require;
                if (!f && a) return a(u, !0);
                if (r) return r(u, !0);
                throw new Error("Cannot find module '" + u + "'")
            }
            var d = t[u] = {
                exports: {}
            };
            e[u][0].call(d.exports, function(n) {
                var t = e[u][1][n];
                return i(t ? t : n)
            }, d, d.exports, n, e, t, o)
        }
        return t[u].exports
    }
    for (var r = "function" == typeof require && require, u = 0; u < o.length; u++) i(o[u]);
    return i
}({
    1: [function(n, e) {
        (function(n) {
            function t() {
                var n = {},
                    e = {};
                return n.on = function(n, t) {
                    var o = {
                        name: n,
                        handler: t
                    };
                    return e[n] = e[n] || [], e[n].unshift(o), o
                }, n.off = function(n) {
                	e[n].forEach(function (v, i, a){ //add @wddo
                		if (v.name === n) a.splice(i, 1);
                	});
                    //var t = e[n.name].indexOf(n); - 1 != t && e[n.name].splice(t, 1) //del @wddo
                }, n.trigger = function(n, t) {
                    var o, i = e[n];
                    if (i)
                        for (o = i.length; o--;) i[o].handler(t)
                }, n
            }
            n.gajus = n.gajus || {}, n.gajus.Sister = t, e.exports = t
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    2: [function(n, e) {
        (function(t) {
            var o, i = n("sister");
            o = function r(n) {
                var e, o, u;
                //add @wddo e.off = u.off,
                return this instanceof r ? (u = i(), e = this, e.on = u.on, e.off = u.off, n = n || {}, n.noChangeCountToEnd = n.noChangeCountToEnd || 100, n.noEndTimeout = 1e3, n.debug = n.debug || !1, void t.addEventListener("orientationchange", function() {
                    var e, i, r, f, a, d;
                    r = function(n) {
                        clearInterval(e), clearTimeout(i), e = null, i = null, n && u.trigger("orientationchangeend")
                    }, o && o(!1), o = r, e = setInterval(function() {
                        t.innerWidth === f && t.innerHeight === a ? (d++, d === n.noChangeCountToEnd && (n.debug && console.debug("setInterval"), r(!0))) : (f = t.innerWidth, a = t.innerHeight, d = 0)
                    }), i = setTimeout(function() {
                        n.debug && console.debug("setTimeout"), r(!0)
                    }, n.noEndTimeout)
                })) : new r(n)
            }, t.gajus = t.gajus || {}, t.gajus.orientationchangeend = o, e.exports = o
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        sister: 1
    }]
}, {}, [2]);

(function (scope) {
    if (scope.CIIS !== undefined) return;

    var CIIS = {};

    scope.CIIS = CIIS;
})(window);

(function ($) {
	var bottomBarDIV;	// 하단바
	var containerDIV;	// 컨테이너

	$(document).ready(function () {
		bottomBarDIV = $('.chatBtmBar');
		containerDIV = $('section.content');

		initLogin();
		initMain();
		initCustomer();
		initTerms();
		initEvent();

		//public

		/**
		 * 카드 스와이프 초기화
		 * @param  {jQuery Object} target : 적용 대상 
		 */
		/*
		CIIS.initCardSwiper = function (target) {
			initFreeSwiper(target, {spaceBetween: 7, slidesOffsetAfter: -110, slidesOffsetBefore: 50});
		};
		CIIS.resetSwiper = resetSwiper;
		*/
	
		//CIIS.callSignature = function () {} //서명 완료시 호출
	});

	//이벤트
	function initEvent() {
		$(window).on('resize.ciis', function (e) {
            if (WDDO.browserWidth === $(window).width() && WDDO.browserHeight === $(window).height()) return false;
            WDDO.browserWidth = $(window).width();
            WDDO.browserHeight = $(window).height();

		}).trigger('resize.ciis');
	}

	//로그인
	function initLogin() {
		$('.tcOrGuide').on('change.ciis', 'input', function (e) {
			var target = $(e.currentTarget);
			var idx = target.closest('label').index();

			$('.inputBox').find('> .corporate').toggle(idx === 1);
		});
	}

	//메인
	function initMain() {
		containerDIV.on('click.ciis', 'a.btnBar', function (e) {
			var target = $(e.currentTarget);
			target.next('div.inContBox').show(); //공동해상 열기

			e.preventDefault();
		});

		containerDIV.on('click.ciis', 'button.titToggleBtn', function (e) {
			var target = $(e.currentTarget);
			var content = target.closest('h2.pinkTit').next('div.inContBox');

			target.toggleClass('on');

			if (target.hasClass('on')) {
				content.show().next('a.btnBar').show(); //컨텐츠와 공동행사 버튼 활성화
			} else {
				content.hide().next('a.btnBar').hide().next('div.inContBox').not(':hidden').hide(); //컨텐츠와 공동행상 버튼 닫고 공통행사 열려있으면 닫음 
			}

			e.preventDefault();
		});

		//총평입력
		containerDIV.on('click.ciis', 'button.btn_evWrite', function (e) {
			var target = $(e.currentTarget);

			target.hide();

			//총평 내부 라디오 버튼
			target.next('div.evWriteCont').show().off('change.ciis').on('change.ciis', 'input[type="radio"][name="eventWrite"]', function (e) {
				var target = $(e.currentTarget);
				var idx = target.closest('label').index() - 1;
				var content = target.closest('.evWriteCont').find('> div[class^="evTab"]');

				content.hide().eq(idx).show();
			}).on('click.ciis', 'button.smallBtnWhite', function (e) {
				$(this).closest('li').addClass('on').siblings('li').removeClass('on');
			});

			e.preventDefault();
		});
	}
	
	//고객정보 .. //customer.html
	function initCustomer() {
		//아래 회색 화살표 공통 토글
		$('ul.personList').on('click.ciis', 'a.inToggle', function (e) {
			var target = $(e.currentTarget);
			var content = target.closest('tr').next('.inTogCont');

			if (!target.hasClass('on')) {
				target.addClass('on')
				content.show();
			} else {
				target.removeClass('on')
				content.hide();
			}
			
			e.preventDefault();
		});
		
		//팝업 내부 빨간 동그라미 토글
		var toggle = new WToggle();
		toggle.init({target: $('ul.personList'), selector: 'button.in_toggleBtn', onTag: 'button', onlyOpen: false});

		//팝업 내부 활성화 리스트
		$('ul.personList').on('click.ciis', '.in_detailBox > button:not(".in_toggleBtn")', function (e) {
			$(this).toggleClass('on');

			e.preventDefault();
		});
		$('ul.personList').on('click.ciis', '.inner_deList > button', function (e) {
			$(this).toggleClass('on');

			e.preventDefault();
		});

		//수정/삭제 중 수정 버튼.. 개발에서 하는게 좋을듯
		/*
		$('ul.personList').on('click.ciis', 'button.modifyBtn', function (e) {
			var target = $(e.currentTarget);
			var textarea = target.siblings('div.modifyText').find('textarea');
			var btns = target.siblings('div.modifyBtnBox');

			target.hide();

			var val = textarea.prop('readonly', false).val();
			textarea.focus().val('').val(val);

			//취소, 저장 버튼 
			btns.show().off('click.ciis').on('click.ciis', function (e) {
				var target = $(e.currentTarget);
				var textarea = target.siblings('div.modifyText').find('textarea');

				textarea.prop('readonly', true); //텍스트 박스 읽기 전용으로
				target.closest('.modifyBtnBox').hide().siblings('.modifyBtn').show(); //수정버튼 복구
			});
		});
		*/

		//핸드폰 > 수정 버튼
		//고객특성정보 선택 버튼
		//smallBtn... 버튼 공통 적용
		/*
		$('ul.personList').on('click.ciis', 'button[class^="smallBtn"]', function (e) {
			var target = $(e.currentTarget);
			var popup = target.nextAll('div.layerPop02');

			popup.show();

			popup.off('click.ciis').on('click.ciis', 'button.alertBtn', function (e) {
				$(this).closest('.layerPop02').hide();
			});

			e.preventDefault();
		});
		*/

		//위 로직 삭제하고 팝업 기준으로 공통 적용
		$('.layerPop02').each(function (e) {
			$(this).prevAll('button[class^="smallBtn"]').off('click.ciis').on('click.ciis', function (e) {
				var target = $(e.currentTarget);
				var popup = target.nextAll('div.layerPop02').eq(0);

				popup.show();

				if (popup.find('canvas.signBox').length > 0) { //서명 팝업 열때면
					var canvas = popup.find('canvas.signBox');

					initSignature(canvas);
				}

				if (WDDO !== undefined) WDDO.setDisableEvent(popup);

				popup.off('click.ciis').on('click.ciis', 'button.alertBtn', function (e) { //팝업 내 하단 버튼 [취소/확인..등]
					var popup = $(this).closest('.layerPop02');

					popup.hide();

					if (popup.find('canvas.signBox').length > 0) { //서명 팝업에서의 버튼 취소/입력 인 경우
						var canvas = popup.find('canvas.signBox');

						if (!$(this).hasClass('gray') && CIIS.callSignature !== undefined) CIIS.callSignature(canvas[0].toDataURL()); //서명 데이터 출력

						disposeSignature(canvas);
					}

					if (WDDO !== undefined) WDDO.setEnableEvent();
				});

				e.preventDefault();
			});
		}).on('change.ciis', 'input[type="radio"][name="addList"]', function (e) {
		//라디오 버튼
			var target = $(e.currentTarget);

			target.closest('label').next('div.in_detailBox').show();
			target.closest('li').siblings('li').find('div.in_detailBox').hide();
		});

		/*
		//플러스버튼
		$('ul.personList').on('click.ciis', 'a.phoneBtn', function (e) {
			var target = $(e.currentTarget);
			target.toggleClass('on');

			e.preventDefault();
		});

		//텍스트박스
		$('ul.personList').on('keydown.ciis', 'textarea[type="text"]', function (e) {
			var target = $(e.currentTarget);

			setTimeout(function(){
				var parentSPAN = target.closest('.inWriteBox').find('> span');

				//목표 초기화
				parentSPAN.css('height', '');

				//textarea 높이 셋팅
				target.css({
					'height': '100%',
					'padding' : 0
				}).css({
					'height': target[0].scrollHeight + 2,
					'padding' : 8
				});

				//실제 목표에 적용
				parentSPAN.css({
					'height': target[0].scrollHeight + 2
				});

				//textarea 초기화
				target.css({
					'height': '',
					'padding' : ''
				});
			}, 0);
		});

		//더보기
		$('ul.vocList').on('click.ciis', 'a.viewTxt', function (e) {
			var target = $(e.currentTarget);

			target.hide().prev('p').addClass('open');

			e.preventDefault();
		});
		*/
	}

	function initTerms() {
		var termsTab = new WToggle();
		termsTab.init({target: $('.termsSect'), selector : '> ul.inner_terms > li > button', onTag: 'button', onClass: 'open', onlyOpen: false});
	}

	function getLinearFunction(a, b, c, d, x) {
		return (d - c) / (b - a) * (x - a) + c
	}

	var OCE;
	function initSignature(canvas) {
		if (canvas.length > 0 && SignaturePad !== undefined) {
			var cw = canvas.width();
			canvas.data('default-width', cw);

			canvas[0].width = cw;
			canvas[0].height = cw * 0.5;

			var ctx = canvas[0].getContext('2d');

			var signaturePad = new SignaturePad(canvas[0], {
	            backgroundColor: 'rgba(255, 255, 255, 0)',
	            onBegin: function () {
	            	canvas.siblings('.signTxt').css('visibility', 'hidden');
	            }
	        });

	        canvas.data('scope', signaturePad);

			$(window).on('orientationchange.ciis', function(e){
				var ctx = canvas[0].getContext('2d');
				
				ctx.setTransform(1, 0, 0, 1, 0, 0);
            });


			// Start tracking the orientation change. 
			OCE = gajus.orientationchangeend({});

			// Attach event listener to the "orientationchangeend" event
			OCE.on('orientationchangeend', function () {
				var tcw = canvas.width();
				var ratio = Math.min(cw / tcw);

				ctx.scale(ratio, ratio);
			});
		}
	}

	function disposeSignature(canvas) {
		if (canvas.length > 0 && SignaturePad !== undefined) {
			var signaturePad = canvas.data('scope');

			if (signaturePad !== undefined) {
				signaturePad.clear();
				signaturePad.off();

				canvas.siblings('.signTxt').css('visibility', '');
				canvas.removeData('scope');

				$(window).off('orientationchange.ciis');
				OCE.off('orientationchangeend');
				OCE = undefined;
			}
		}
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

	//WDDO ver 1.1.1
	!function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);
})(jQuery);
