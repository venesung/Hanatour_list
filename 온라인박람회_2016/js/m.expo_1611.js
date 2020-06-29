/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.1
 * @since : 2016.10.06
 *
 * 2016 온라인 박람회 MOBILE
 * 
 * history
 * 
 * 1.0 (2016.10.06) : 
 * 1.1 (2016.11.07) : lazy 로딩시 완료시점에 부모 display:none; 때문에 이미지 높이 못받아 세로정렬 못시키는 문제 수정
 * 
 */

(function (scope) {
    if (scope.EXPO !== undefined) return;

    var EXPO = {};

    scope.EXPO = EXPO;
})(window);

(function ($) {
	var isMain;
	var selectBox;

	$(document).ready(function () {

		$("img.lazy").lazyload({
			skip_invisible : false,
			threshold : Math.floor($(window).height() / 3),
			placeholder : "data:image/gif;base64,R0lGODlhkAGQAfelAP39/f7+/ufn5+7u7t/f3/z8/PX19fPz8+3t7c/Pz/v7+87Ozvj4+PDw8Obm5u/v76+vr/Ly8uzs7Ovr6/b29vn5+aCgoPf395CQkPT09Pr6+sDAwOjo6Glpab+/v8PDw/Hx8d7e3tDQ0IGBgXBwcOHh4dra2p+fn6qqquTk5MzMzODg4Orq6sHBwZKSkqGhoba2tsLCwunp6d3d3cXFxZ6entvb24qKimFhYa6urmBgYLu7u5mZmWZmZoaGhqioqHh4eL6+vo6OjrW1teLi4rCwsH5+fpqamm5ubpSUlJOTk21tbbKysmhoaNnZ2by8vNPT06Ojo9bW1q2trdHR0YiIiGVlZYODg83NzYeHh6urq19fX9fX18nJybS0tKSkpNLS0o+Pj+Xl5djY2H9/f8fHx8bGxp2dnaenp3JycqysrHl5eV1dXV5eXmtra4CAgNXV1ePj49zc3Li4uHFxcXR0dLOzs7GxsY2NjZycnKmpqWxsbMjIyIyMjL29vbe3t2NjY4WFhXp6etTU1IKCgouLi8vLy7m5uVdXV2RkZMTExFhYWJubm4mJiWdnZ5iYmKKiopGRkZaWlqampm9vb6WlpVVVVVZWVnNzc3x8fHV1dcrKynd3d1xcXJeXl3t7e3Z2dmpqaoSEhGJiYv///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpDNTAxRjM0OUVDQTNFNjExOEFGQUE1OTIwMjQ5QzdCNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1ODAxM0MzOEEzRUMxMUU2Qjg2Q0IyRDFDRDQ1QTZEMiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1ODAxM0MzN0EzRUMxMUU2Qjg2Q0IyRDFDRDQ1QTZEMiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDNjAxRjM0OUVDQTNFNjExOEFGQUE1OTIwMjQ5QzdCNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDNTAxRjM0OUVDQTNFNjExOEFGQUE1OTIwMjQ5QzdCNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1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",
			load : function (max, options) {
				lazyVerticalMode($(this))
			}
		});

		//modify 1.1
        function lazyVerticalMode(img) {
            var tImg = new Image();
           	tImg.src = $(img).attr('data-original');

           	if (tImg.src !== undefined) {
           		var sourceImgTAG = $(tImg); //소스이미지 jquery 객체
           		sourceImgTAG.data('original', $(img)); //원래위치를 찾기위해 저장

           		//컨테이너 생성
           		if ($('.imageLoad-container').length === 0) $('body').append('<div class="imageLoad-container" style="visibility:hidden;height:0;overflow:hidden;">');	

           		//컨테이너에 삽입
	        	$('.imageLoad-container').append(sourceImgTAG);
	        	sourceImgTAG.css({
	        		'width' : '100%'
	        	});

	        	//로드완료되면
	        	sourceImgTAG.imagesLoaded(function() {
	        		var image = $(this.elements);
	        		var originalImage = image.data('original');
	        		var w = image.width();
	        		var h = image.height();

					image.remove(); //소스삭제

					//세로가 크면 정렬 
		            if (h > w && originalImage !== undefined) {
		                var containerDIV = originalImage.closest('.img');
		                originalImage.css('marginTop', (containerDIV.height() - h) / 2);
		            }
				});
           	}
        }

		initHeader();
		initLnb();
		initTotalMenu();
		initQuickBtn();

		isMain = $('.mainTopBox').length > 0;

		if (isMain) {
			//메인
			initSwiper($('.mainSwipCont > .swiper-container'), {exChange: function (data) {
				var swiperContainer = $('.mainSwip_img > .swiper-container');
				var swiper = swiperContainer[0].swiper;

				if (swiper !== undefined && data.activeIndex !== swiper.activeIndex) swiper.slideTo(data.activeIndex);
			}});
			initSwiper($('.mainSwip_img > .swiper-container'), {effect: 'fade'});
			initFreeSwiper($('.mainCont01 > .swiper-container'), {slidesPerView: 2.25, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 10});	//특전
			initFreeSwiper($('.mainCont02 > .swiper-container'), {slidesPerView: 4.6, slidesOffsetBefore: 12, slidesOffsetAfter: 27, spaceBetween: 10});	//지역관
			initFreeSwiper($('.mainCont03 > .swiper-container'), {slidesPerView: 5.1, slidesOffsetBefore: 12, slidesOffsetAfter: 27, spaceBetween: 10});	//테마관 
			initFreeSwiper($('.mainCont05 > .swiper-container'), {slidesPerView: 2.65, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 10});	//자유
			
			initVR();
			
			CountDown.setTime(now, endOfExpo, {callback: function (data) {
				$('.timeBox > div:eq(0) > span').text(data.d);
				$('.timeBox > div:eq(1) > span').text(data.h);
				$('.timeBox > div:eq(2) > span').text(data.m);
			}});

		} else {
			initSelect(); //서브 컨텐츠의 셀렉트 박스
			initTab(); //공통 탭

			initTheme(); //테마관
			
			initRegionMain(); //지역관 메인
			initRegion(); //지역관 

			initAirMain(); //항공 메인

			initTravelMain(); //트렐블TV 메인

			initEnd(); //박람회 종료
		}
		
		initSwiper($('.swipCommBanner > .swiper-container'), {}); //고객사 위 배너
		initFreeSwiper($('.sponsorship > .swiper-container'), {slidesPerView: 3.6, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 10});	//고객사
		initSwiper($('.mainBanner:eq(0) > .swiper-container'), {}); //일반 배너
		initSwiper($('.mainBanner:eq(1) > .swiper-container'), {}); //일반 배너
		
		initEvent();
		
		initHrefPopup();

		//EXPO.setNavigation(3); //네비 활성화 변경방법
		if (EXPO.setNavigation !== undefined) EXPO.setNavigation( $('.swiper-container').eq(0).find('.swiper-slide.on').index(), 0 );
	});

	function emptyProduct() {
		alert('상품준비중입니다.');
	}

	//이벤트
	function initEvent() {
		$(window).on('resize.expo', function (e) {
            if (WDDO.browserWidth === $(window).width() && WDDO.browserHeight === $(window).height()) return false;
            WDDO.browserWidth = $(window).width();
            WDDO.browserHeight = $(window).height();

			if (isMain) {
				$('.mainCont03 > .swiper-container .swiper-slide').each(function () {
					$(this).css('height', $(this).css('width'));
				});
			}
		}).trigger('resize.expo');

		var pop01 = $('.layerPop:eq(0)');
		var pop02 = $('.layerPop:eq(1)');

		//전문보기 
		$('.smsWriteCont').on('click.expo', '.chBox > label:eq(0) > a', function (e) {
			pop01.show().one('click', 'a.btn_y_Close', function (e) {
				pop01.hide();

				e.preventDefault();
			});

			e.preventDefault();
		});

		//전문보기 2
		$('.smsWriteCont').on('click.expo', '.chBox > label:eq(1) > a', function (e) {
			pop02.show().one('click', 'a.btn_y_Close', function (e) {
				pop02.hide();

				e.preventDefault();
			});

			e.preventDefault();
		});
	}

	//셑렉트 박스.. sub_theme09, area01_ragion01
	function initSelect() {
		selectBox = $('select').not('.form-control');

		//셀렉트 체인지 이벤트
        selectBox.each(function () {
            $(this).eq(0).on('change.expo', function (e) {
                var target = $(e.currentTarget);
                var idx = target[0].selectedIndex;

                var content = target.nextAll('div.selectContent').children();
                content.hide().eq(idx).show();
                
                if (content.eq(idx).length === 0) emptyProduct(); //컨텐츠 없으면 준비중

                //타이틀 이미지 변경
                //target.closest('.recom_inCont').find('> div.contTop01').hide().eq(idx).show();
            });
        });

	    //초기 셀렉트
        selectBox.each(function () {
            var idx = $(this).find('> option:selected').index();

            $(this).find('option').eq(idx).prop("selected", true);
            $(this).trigger('change.expo');
        });
	}

	//공통 탭.. sub_free03, area01_ragion01
	function initTab() {
		var grayTab; //회색 탭
		$('ul.tabSmall').each(function () {
			grayTab = new WToggle();
			grayTab.init({target: $(this), selector: '> li > a', onTag: 'li', content: $(this).next('.tabSmCont').children(), onChange: function (data) {
				resetSwiper( data.content.find('.swiper-container-free-mode').not(':hidden') ); //오감만족 200% 스와이프 리셋

				if (data.content.children().length === 0) emptyProduct(); //컨텐츠 없으면 준비중 (data.content 는 있지만 내부 리스트가 없을때)
				data.content.find('> select').eq(0).trigger('change.expo'); //컨텐츠 없으면 준비중 (컨텐츠 바로 아래 select 가 있는 경우)
			}});
		});
	}

	//헤더
	function initHeader() {
		var sharedPopDIV = $('.layerPop:last');
		$('header > a.shared').on('click.expo', function (e) {
			var target = $(e.currentTarget);

			sharedPopDIV.show().one('click', 'a.btn_y_Close', function (e) {
				sharedPopDIV.hide();

				e.preventDefault();
			});

			e.preventDefault();
		});
	}

    //로케이션 네비게이션 바
    function initLnb() {
    	var lnb = $('nav.navDep');
    	lnb.find('> .swiper-container').css('width', '100%');

        var swiper = new Swiper('.navDep > .swiper-container', {
            slidesPerView: 'auto',
            simulateTouch: false,
            spaceBetween: 0,
            freeMode: true,
            slidesOffsetBefore: 12,
            slidesOffsetAfter: 45,
            /*resistanceRatio: 0,*/
            onInit: function () {
                //$('#gnb').addClass('nextShadow');
            },
            onProgress: function (data, progress) {
                if (progress <= 0) {
                    //$('#gnb').removeClass('prevShadow').addClass('nextShadow');
                } else if (progress >= 1) {
                    //$('#gnb').removeClass('nextShadow').addClass('prevShadow');
                } else {
                    //$('#gnb').addClass('nextShadow prevShadow');
                }
            }
        });

        lnb.on('click', '.swiper-container .swiper-slide > a', function (e) {
            var target = $(e.currentTarget);
            var idx = target.parent().index();

            EXPO.setNavigation(idx);

            e.preventDefault();
        });

        var totalMenuDIV = $('div.allDepBox');
        $('a.btn_navAll').on('click.expo', function (e) {
        	var target = $(e.currentTarget);

        	target.toggleClass('on');
        	totalMenuDIV.toggle();

        	e.preventDefault();
        });

        //활성화 변경 jQuery 확장
        EXPO.setNavigation = function (idx, spd) {
			var speed = spd;

            lnb.find('.swiper-slide').removeClass('on').eq(idx).addClass('on');

            if (lnb.find('.swiper-container').length > 0) {
                var swiper = lnb.find('.swiper-container')[0].swiper; //인스턴트 반환

                swiper.slideTo(Math.max(idx - 1, 0), speed); //왼쪽에 그림자 때문에 첫번째로 이동하면 가리므로 활성화 idx -1 로 slideTo()

                totalMenuDIV.find('ul > li').removeClass('on').eq(idx).addClass('on');
            }
	    };
    }

    //전체메뉴
    function initTotalMenu() {
        var totalMenuDIV = $('#expoMenuPanel');  //이전 구버전 토탈메뉴
        var contentWrapperDIV = $('#wrap');    //컨텐츠 전체 컨테이너

        //전체메뉴 열기
        $('a.allMenu').on('click.expo', function (e) {
        	totalMenuDIV.css('display', 'block').find('.innerScroller').scrollTop(0); //스크롤 상단으로 초기화
            
            setTimeout(function () {
                totalMenuDIV.addClass('open');
            }, 5);

            DOTCOM.setMask(true, totalMenuDIV); //마스킹
            
            //닫기
            $('#mask, .closeSlide').one('click.expo', function (e) {
                if (totalMenuDIV.length > 0) totalMenuDIV.removeClass('open');
   
                DOTCOM.setMask(false);

                e.preventDefault();
            });

            e.preventDefault();
        });

        //닫히는 모션 끝나면 숨기기
        totalMenuDIV.on('transitionend webkitTransitionEnd', function (e) {
            if (!totalMenuDIV.hasClass('open')) {
                totalMenuDIV.css('display', 'none');
            }
        });
    }

    //+ 플로딩 메뉴 
	function initQuickBtn() {
	    var googleOpts = {
	        cellSize: [55, 55],
	        cells: [15, 15],
	        initCell: [0, 0],
	        wrap: false,
	        interval: 20
	    };
	    
	    var defaultSubYpos = -70;
	    var speed = 310;
	    var quickDIV = $('div.quickDimBox');
	    var btn = quickDIV.find('> .dimbtnToggle');
	    var sub = quickDIV.find('> .dimBtnQuick');
	    var subLI = sub.find('li');
	    var plusBtn = btn.sprite(googleOpts);

	    function init() {
	        subLI.each(function (idx) {
	            var li = $(this);

	            li.data('dy', Math.abs(idx - (subLI.length - 1)) * 58);
	            li.css('bottom', defaultSubYpos);
	        });
	    }

	    function addEvent() {
	        btn.on('click.expo', function (e) {
	            var target = $(e.currentTarget);

	            if (!sub.hasClass('on')) {
	                sub.addClass('on');
	                setTimeout(open, 100);
	            } else {
	                close();
	            }

	            e.preventDefault();
	        });

	        sub.on('click.expo', function (e) {
	            var target = $(e.currentTarget);

	            if (target.is('div')) {
	                close();
	            }

	            e.preventDefault();
	        });     

	        subLI.on('click.expo', 'a', function (e) {
	        	var target = $(e.currentTarget);
	        	var idx = target.closest('li').index();

	        	close();

	        	switch (idx) {
	        		case 0 :
	        			$('h1 > a').trigger('click');
	        			break;
	        		case 1 :
	        			$('a.allMenu').trigger('click.expo');
	        			break;
	        		default :
	        	}
	        });
	    }

	    function open() {
	        subLI.each(function (idx) {
	            $(this).animate({
	                'bottom' : parseInt($(this).data('dy'))
	            }, {queue:false, duration: 310, easing: 'easeOutBack'});

	            $(this).find('.txt').animate({
	                'right' : -18
	            }, {queue:false, duration: 410, easing: 'easeOutQuart'});
	        });
	        plusBtn.go();

	        btn.css('z-index', 150);
	        sub.css('z-index', 140);
	        DOTCOM.setMask(true, quickDIV.selector);
	    }

	    function close() {
	        subLI.each(function (idx) {
	            $(this).animate({
	                'bottom' : defaultSubYpos
	            }, {queue:false, duration: speed, easing: 'easeOutQuint'});

	            $(this).find('.txt').animate({
	                'right' : -$(this).find('.txt').width() - 25
	            }, {queue:false, duration: speed, easing: 'easeOutQuart', complete: ((idx === (subLI.length - 1)) ? function () {
	                sub.removeClass('on');
	                sub.find('.txt').css('right', '');
	            }: function () {} )});
	        });
	        plusBtn.revert();

	        btn.css('z-index', 50);
	        sub.css('z-index', 40);
	        DOTCOM.setMask(false, quickDIV.selector);
	    }

	    init();
	    addEvent();
	}

	//VR 동영상
	function initVR() {
		var vrContainerDIV = $('.mainCont07 > .vrMovie');

		initFreeSwiper(vrContainerDIV.find('> .swiper-container'), {slidesPerView: 2.8, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 12}); //VR

		vrContainerDIV.on('click.expo', '.swiper-slide > a', function (e) {
			var target = $(e.currentTarget);
			var slide = target.closest('div.swiper-slide');
			var idx = slide.index();

			target.addClass('on').closest('div.swiper-slide').siblings().find('> a').removeClass('on');
			vrContainerDIV.find('> a').hide().eq(idx).show();

			e.preventDefault();
		});
	}

	//지역관 메인
	function initRegionMain() {
		if ($('.zoneAreaTop').length === 0) return;

		initFreeSwiper($('.zoneAreaTop > .swiper-container'), {slidesPerView: 4.3, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 4}); //국기
		initFreeSwiper($('.newCityMenu > .swiper-container'), {slidesPerView: 'auto', slidesOffsetBefore: 0, slidesOffsetAfter: 0, spaceBetween: 0}); //지역

		var regionTab = new WToggle();
		regionTab.init({target: $('.newCityBox'), selector: '.newCityMenu .swiper-slide > a', onTag: 'div.swiper-slide', content: $('.newCityBox'), contentSelector: '.newCityList > ul'});
	}

	//지역관
	function initRegion() {
		if ($('.tabRagion').length === 0) return;
		
		//검은색 탭 
		var reginonBlackTab = new WToggle();
		reginonBlackTab.init({target: $('.tabContSect'), selector: '> ul > li > a', onTag: 'li', content: $('.tabContSect'), contentSelector: ' > ul ~ div.tabCont', onChange: function (data) {
			resetSwiper( data.content.find('.swiper-container-free-mode').not(':hidden') ); //오감만족 200% 스와이프 리셋
		}});

		//상품평 토글
		var productDIV = $('.productList01');
		productDIV.on('click.expo', '.btnToggle', function (e) {
			var target = $(e.currentTarget);
			var content = target.next('div.txtTogBox');
			var sw = target.hasClass('on');

			target.toggleClass('on', !sw);
			content.toggle(!sw);

			e.preventDefault();
		});

		initFreeSwiper($('.honeyTip > .swiper-container'), {slidesPerView: 1.08, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 5}); //오감만족 200% 내부 스와이프 
	}

	//테마관
	function initTheme() {
		if ($('.themeTopCont').length === 0) return;

		//태마관 서브 공통
		//탭
		var themeTab = new WToggle();
		themeTab.init({target: $('.tabContSect'), selector: '> ul > li > a', onTag: 'li', content: $('.tabContSect'), contentSelector: '> .tabCont'});

		var themeInTabSwiepr = $('.tabCont > .tabNation_swipe');
		var themeInTab = new WToggle(); //내부 탭

		if (themeInTabSwiepr.length > 0) {
		//스와이프 형태이면
			initFreeSwiper(themeInTabSwiepr.find('.swiper-container'), {
				slidesPerView: 5, slidesOffsetBefore: 0, slidesOffsetAfter: 0, spaceBetween: 0,
	 			onInit: function () {
	                themeInTabSwiepr.addClass('nextShadow');
	            },
	            onProgress: function (data, progress) {
	                if (progress <= 0) {
	                    themeInTabSwiepr.removeClass('prevShadow').addClass('nextShadow');
	                } else if (progress >= 1) {
	                    themeInTabSwiepr.removeClass('nextShadow').addClass('prevShadow');
	                } else {
	                    themeInTabSwiepr.addClass('nextShadow prevShadow');
	                }
	            }
			});

			themeInTab.init({target: $('.tabCont'), selector: '.swiper-slide > a', onTag: 'div.swiper-slide', content: $('.tabCont'), contentSelector: '> div:not(".tabNation_swipe")'});
		} else {
		//스와이프 형태가 아니면
			themeInTab.init({target: $('.tabCont'), selector: '> ul > li > a', onTag: 'li', content: $('.tabCont'), contentSelector: '> ul ~ div'});
		}

		//그랜드 투어 .. sub_theme01
		if ($('.themeTopCont').hasClass('grand')) {
			var themeGrandSwiper = $('.grandTab_swipe');

			initFreeSwiper(themeGrandSwiper.find('.swiper-container'), {
				slidesPerView: 3, slidesOffsetBefore: 0, slidesOffsetAfter: 0, spaceBetween: 0,
	 			onInit: function () {
	                themeGrandSwiper.addClass('nextShadow');
	            },
	            onProgress: function (data, progress) {
	                if (progress <= 0) {
	                    themeGrandSwiper.removeClass('prevShadow').addClass('nextShadow');
	                } else if (progress >= 1) {
	                    themeGrandSwiper.removeClass('nextShadow').addClass('prevShadow');
	                } else {
	                    themeGrandSwiper.addClass('nextShadow prevShadow');
	                }
	            }
			});

			themeInTab.init({target: themeGrandSwiper, selector: '.swiper-slide > a', onTag: 'div.swiper-slide', content: $('.topSwipeTabCont'), contentSelector: '> div'});
		}
	}

	//항공 메인.. submain_air
	function initAirMain() {
		if ($('.subMain_air').length === 0) return;

		var ticketEventDIV = $('.todaySwiperCont');
		var bestAirComDIV = $('.bestAirCom');

		//주 항공티켓
		ticketEventDIV.on('click.expo', '> ul > li > a', function (e) {
			var target = $(e.currentTarget);
			var idx = target.closest('li').index();
			var swiper = ticketEventDIV.find('> .swiper-container')[0].swiper;

			if (swiper !== undefined) swiper.slideTo(idx);
			
			e.preventDefault();
		});

		//주 항공티켓 스와이프
		initSwiper(ticketEventDIV.find('> .swiper-container'), {
			spaceBetween: 8, slidesPerView: 1.1,
			centeredSlides: true,
			loop: false,
			exChange: function (data) {
				var swiperContainerDIV = $(data.container);
				var swiper = swiperContainerDIV[0].swiper;
				var idx = swiper.activeIndex;

				swiperContainerDIV.prev('ul').find('li').removeClass('on').eq(idx).addClass('on');
			}
		});

		//추천 항공사
		initFreeSwiper(bestAirComDIV.find('> .swiper-container'), {slidesPerView: 1.58, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 10});

		//알짜항공권
		//initAirSpecial();
		$('.todaySwiperCont > .swiper-container')[0].swiper.slideTo(new Date().getDay()-1); // 요일 활성화
	}
	
	//알짜항공권
	/*
	function initAirSpecial() {
		var specialContainerDIV = $('div.todaySwiperCont');
		var specialBtnA = specialContainerDIV.find('> ul > li > a');
		var specialItem = specialContainerDIV.find('.swiper-container .swiper-slide');
		
		var today = new Date();
		var sournceDate = new Date(today);

		var swiper = specialContainerDIV.find('.swiper-container')[0].swiper;

		var force2Digits = function(value) {
		    return (value < 10) ? '0' + value.toString() : value.toString();
		};

		//주말 시 금요일로 셋팅
		if (sournceDate.getDay() === 0) { //일 
			sournceDate.setDate(sournceDate.getDate() - 2);
		} else if (sournceDate.getDay() === 6) { //토
			sournceDate.setDate(sournceDate.getDate() - 1);
		} else {
			//평일중 오전은 전날로 셋팅
			if (sournceDate.getHours() < 11 && sournceDate.getDay() !== 1) {
				sournceDate.setDate(sournceDate.getDate() - 1);
			} else if (sournceDate.getHours() < 11 && sournceDate.getDay() === 1) {
				//평일 월요일 오전이면 금요일로
				sournceDate.setDate(sournceDate.getDate() - 3);
			}
		}

		var eachDate = new Date(sournceDate); //가공 데이트
		eachDate.setDate(sournceDate.getDate() - (eachDate.getDay() - 1)); //월요일부터 시작 

		var dayArr = ['', 	specialBtnA.eq(0).text(), 
							specialBtnA.eq(1).text(), 
							specialBtnA.eq(2).text(), 
							specialBtnA.eq(3).text(), 
							specialBtnA.eq(4).text(), '']; //일월화수목금토

		var dateStr, dayStr;
		specialItem.each(function (idx) {
			var target = $(this);
			dateStr = eachDate.getFullYear() + '.' + force2Digits(eachDate.getMonth() + 1) + '.' + force2Digits(eachDate.getDate());
			dayStr = dayArr[eachDate.getDay()];

			target.find('strong[class^="day0"]').text(dateStr + '('+ dayStr +')');
			target.find('.todayCont .label > span').text(dateStr + ' ' + dayStr + '요일');

			target.find('.todayCont').addClass('coming'); //기본 커밍순

			if (eachDate.getTime() < new Date(2016, 11-1, 7).getTime() || eachDate.getTime() >= new Date(2016, 11-1, 26).getTime()) {
				//이벤트 시작 이전 & 이벤트 마감 이후
				target.find('.todayCont').removeClass('coming').addClass('p_end');
			} else {
				//이벤트 기간 중
				if (eachDate.getDay() < sournceDate.getDay()) {
					//지난
					target.find('.todayCont').removeClass('coming').addClass('end');
				} else if (eachDate.getDay() === sournceDate.getDay() && !sournceDate.getHours() < 11) {
					//오늘 11 시 이후면 활성화
					target.find('.todayCont').removeClass('coming');
				}
			}

			eachDate.setDate(eachDate.getDate() + 1);
		});

		swiper.slideTo(sournceDate.getDay() - 1, 0); //스와이프 이동
	}
	*/

	//트래블TV 메인.. submain_travel
	function initTravelMain() {
		if ($('.subMain_travel').length === 0) return;

		initFreeSwiper($('.travelCityMenu > .swiper-container'), {slidesPerView: 'auto', slidesOffsetBefore: 0, slidesOffsetAfter: 0, spaceBetween: 0}); //지역
		initFreeSwiper($('.hotClipCont > .swiper-container'), {slidesPerView: 2.25, slidesOffsetBefore: 12, slidesOffsetAfter: 12, spaceBetween: 5});	//HOT CLIP

		var regionTab = new WToggle();
		regionTab.init({target: $('.travelCityBox'), selector: '.travelCityMenu .swiper-slide > a', onTag: 'div.swiper-slide', content: $('.travelCityBox'), contentSelector: '.travelCityCont > div', onChange: function (data) {
			resetSwiper( data.content.find('.swiper-container-free-mode').not(':hidden') ); //오감만족 200% 스와이프 리셋
		}});

		var moreBtn = $('.stillCutCont .btnPlus');
		moreBtn.on('click.expo', function (e) {
			var target = $(e.currentTarget);
			var list = target.siblings('ul');
			var isOpen = target.hasClass('on');

			target.toggleClass('on', !isOpen);
			list.toggleClass('open', !isOpen);

			e.preventDefault();
		});
	}

	//박람회 종료
	function initEnd() {
		if ($('.finishCont').length === 0) return;

		var popup = $('.layerPop.finish');
		var dimed = popup.next('.dim');

		$('.mainBanner.finish > .mbTitle > a').on('click.expo', function (e) {
			var oldScrollY = $(document).scrollTop();

			$(document).scrollTop(0);

			popup.show().css({
				'marginTop' : oldScrollY + WDDO.browserHeight
			}).animate({
				'marginTop' : 0
			}, {queue: false, duration: 800, easing: 'easeOutQuart', complete: function () {
			}}).one('click.expo', '.btn_y_Close', function (e) {
				var ypos = parseInt(popup.data('ypos'));

				popup.hide().removeData('ypos');
				dimed.hide();

				setTimeout(function () {
					if (!isNaN(ypos)) $(document).scrollTop(ypos);
				}, 1);				
			}).data('ypos', oldScrollY);

			dimed.show();

			e.preventDefault();
		});
	}

    //스와이프
    function initSwiper(targetContainer, options) {
        var swiper;

        //중복 방지 초기화
        if (targetContainer.length > 0 && targetContainer.is('.swiper-container-horizontal')) {
            swiper = targetContainer[0].swiper;
            if (swiper !== undefined) swiper.destroy(false, true);    
        }

        var opts;
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
                swiperChange(data);
            },
            onSliderMove: function (data) {
                swiperChange(data);
            },
            onTransitionEnd: function (data) {
                swiperChange(data);
            },
            onInit: function (data) {
                swiperChange(data);

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

        function swiperChange(data) {
            var container = data.container;
            var max = container.find('.swiper-pagination > span').length;
            var idx = container.find('.swiper-pagination .swiper-pagination-bullet-active').index();

            container.find('.swiper-pag-num').html('<span>' + (idx+1) + '</span>' + ' / ' + max);

            if (opts.exChange !== undefined) opts.exChange(data);
        }
    };

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

    EXPO.initPopup = function () {
		//console.log('initpopup');
	};

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

	/*
	 * Lazy Load - jQuery plugin for lazy loading images
	 *
	 * Copyright (c) 2007-2013 Mika Tuupola
	 *
	 * Licensed under the MIT license:
	 *   http://www.opensource.org/licenses/mit-license.php
	 *
	 * Project home:
	 *   http://www.appelsiini.net/projects/lazyload
	 *
	 * Version:  1.9.3
	 *
	 */
	!function(e,t,i,o){var n=e(t);e.fn.lazyload=function(r){function f(){var t=0;l.each(function(){var i=e(this);if(!h.skip_invisible||i.is(":visible"))if(e.abovethetop(this,h)||e.leftofbegin(this,h));else if(e.belowthefold(this,h)||e.rightoffold(this,h)){if(++t>h.failure_limit)return!1}else i.trigger("appear"),t=0})}var a,l=this,h={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:t,data_attribute:"original",skip_invisible:!0,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};return r&&(o!==r.failurelimit&&(r.failure_limit=r.failurelimit,delete r.failurelimit),o!==r.effectspeed&&(r.effect_speed=r.effectspeed,delete r.effectspeed),e.extend(h,r)),a=h.container===o||h.container===t?n:e(h.container),0===h.event.indexOf("scroll")&&a.bind(h.event,function(){return f()}),this.each(function(){var t=this,i=e(t);t.loaded=!1,(i.attr("src")===o||i.attr("src")===!1)&&i.is("img")&&i.attr("src",h.placeholder),i.one("appear",function(){if(!this.loaded){if(h.appear){var o=l.length;h.appear.call(t,o,h)}e("<img />").bind("load",function(){var o=i.attr("data-"+h.data_attribute);i.hide(),i.is("img")?i.attr("src",o):i.css("background-image","url('"+o+"')"),i[h.effect](h.effect_speed),t.loaded=!0;var n=e.grep(l,function(e){return!e.loaded});if(l=e(n),h.load){var r=l.length;h.load.call(t,r,h)}}).attr("src",i.attr("data-"+h.data_attribute))}}),0!==h.event.indexOf("scroll")&&i.bind(h.event,function(){t.loaded||i.trigger("appear")})}),n.bind("resize",function(){f()}),/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)&&n.bind("pageshow",function(t){t.originalEvent&&t.originalEvent.persisted&&l.each(function(){e(this).trigger("appear")})}),e(i).ready(function(){f()}),this},e.belowthefold=function(i,r){var f;return f=r.container===o||r.container===t?(t.innerHeight?t.innerHeight:n.height())+n.scrollTop():e(r.container).offset().top+e(r.container).height(),f<=e(i).offset().top-r.threshold},e.rightoffold=function(i,r){var f;return f=r.container===o||r.container===t?n.width()+n.scrollLeft():e(r.container).offset().left+e(r.container).width(),f<=e(i).offset().left-r.threshold},e.abovethetop=function(i,r){var f;return f=r.container===o||r.container===t?n.scrollTop():e(r.container).offset().top,f>=e(i).offset().top+r.threshold+e(i).height()},e.leftofbegin=function(i,r){var f;return f=r.container===o||r.container===t?n.scrollLeft():e(r.container).offset().left,f>=e(i).offset().left+r.threshold+e(i).width()},e.inviewport=function(t,i){return!(e.rightoffold(t,i)||e.leftofbegin(t,i)||e.belowthefold(t,i)||e.abovethetop(t,i))},e.extend(e.expr[":"],{"below-the-fold":function(t){return e.belowthefold(t,{threshold:0})},"above-the-top":function(t){return!e.belowthefold(t,{threshold:0})},"right-of-screen":function(t){return e.rightoffold(t,{threshold:0})},"left-of-screen":function(t){return!e.rightoffold(t,{threshold:0})},"in-viewport":function(t){return e.inviewport(t,{threshold:0})},"above-the-fold":function(t){return!e.belowthefold(t,{threshold:0})},"right-of-fold":function(t){return e.rightoffold(t,{threshold:0})},"left-of-fold":function(t){return!e.rightoffold(t,{threshold:0})}})}(jQuery,window,document);

	/*!
	 * imagesLoaded PACKAGED v4.1.1
	 * JavaScript is all like "You images are done yet or what?"
	 * MIT License
	 */

	!function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=0,o=i[n];e=e||[];for(var r=this._onceEvents&&this._onceEvents[t];o;){var s=r&&r[o];s&&(this.off(t,o),delete r[o]),o.apply(this,e),n+=s?0:1,o=i[n]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define(["ev-emitter/ev-emitter"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter")):t.imagesLoaded=e(t,t.EvEmitter)}(window,function(t,e){function i(t,e){for(var i in e)t[i]=e[i];return t}function n(t){var e=[];if(Array.isArray(t))e=t;else if("number"==typeof t.length)for(var i=0;i<t.length;i++)e.push(t[i]);else e.push(t);return e}function o(t,e,r){return this instanceof o?("string"==typeof t&&(t=document.querySelectorAll(t)),this.elements=n(t),this.options=i({},this.options),"function"==typeof e?r=e:i(this.options,e),r&&this.on("always",r),this.getImages(),h&&(this.jqDeferred=new h.Deferred),void setTimeout(function(){this.check()}.bind(this))):new o(t,e,r)}function r(t){this.img=t}function s(t,e){this.url=t,this.element=e,this.img=new Image}var h=t.jQuery,a=t.console;o.prototype=Object.create(e.prototype),o.prototype.options={},o.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)},o.prototype.addElementImages=function(t){"IMG"==t.nodeName&&this.addImage(t),this.options.background===!0&&this.addElementBackgroundImages(t);var e=t.nodeType;if(e&&d[e]){for(var i=t.querySelectorAll("img"),n=0;n<i.length;n++){var o=i[n];this.addImage(o)}if("string"==typeof this.options.background){var r=t.querySelectorAll(this.options.background);for(n=0;n<r.length;n++){var s=r[n];this.addElementBackgroundImages(s)}}}};var d={1:!0,9:!0,11:!0};return o.prototype.addElementBackgroundImages=function(t){var e=getComputedStyle(t);if(e)for(var i=/url\((['"])?(.*?)\1\)/gi,n=i.exec(e.backgroundImage);null!==n;){var o=n&&n[2];o&&this.addBackground(o,t),n=i.exec(e.backgroundImage)}},o.prototype.addImage=function(t){var e=new r(t);this.images.push(e)},o.prototype.addBackground=function(t,e){var i=new s(t,e);this.images.push(i)},o.prototype.check=function(){function t(t,i,n){setTimeout(function(){e.progress(t,i,n)})}var e=this;return this.progressedCount=0,this.hasAnyBroken=!1,this.images.length?void this.images.forEach(function(e){e.once("progress",t),e.check()}):void this.complete()},o.prototype.progress=function(t,e,i){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!t.isLoaded,this.emitEvent("progress",[this,t,e]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,t),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&a&&a.log("progress: "+i,t,e)},o.prototype.complete=function(){var t=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(t,[this]),this.emitEvent("always",[this]),this.jqDeferred){var e=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[e](this)}},r.prototype=Object.create(e.prototype),r.prototype.check=function(){var t=this.getIsImageComplete();return t?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),void(this.proxyImage.src=this.img.src))},r.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},r.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.img,e])},r.prototype.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},r.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},r.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},r.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype=Object.create(r.prototype),s.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url;var t=this.getIsImageComplete();t&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},s.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},s.prototype.confirm=function(t,e){this.isLoaded=t,this.emitEvent("progress",[this,this.element,e])},o.makeJQueryPlugin=function(e){e=e||t.jQuery,e&&(h=e,h.fn.imagesLoaded=function(t,e){var i=new o(this,t,e);return i.jqDeferred.promise(h(this))})},o.makeJQueryPlugin(),o});
})(jQuery);

