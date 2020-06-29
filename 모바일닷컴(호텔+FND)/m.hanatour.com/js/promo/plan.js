/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2015.11.03
 *
 * 여행 기획전
 */

$(document).ready(function(){
	// 메인 swiper .. event_main
	var swiper;
	$('.event_slider').each(function (idx) {
	    swiper = new Swiper($(this), {
	        pagination: $(this).find('.swiper-pagination'),
	        loop: (($(this).find('.swiper-slide').length > 1) ? true : false),
	        setWrapperSize: true
	    });
	});

	//메인 텝
	var mainTab = new WTab();
	mainTab.init({target: $('ul.e_listTab > li > a'), onTag: 'a', content: $('ul.e_listTab').nextAll('div.e_tabCont')});

	// 기획전 상세 .. event_detail
	var tabUL = $('ul.tabEventSub');
	var contentUL = $('ul.eventCard');

	tabUL.on('click', 'li > a', function (e) {
		var target = $(e.currentTarget);

		target.addClass('on').closest('li').siblings('li').find('a').removeClass('on');
	});

	contentUL.on('click', 'li a', function () {
		contentUL.find('.cardLayer').prev('a').removeClass('on');
		$(this).addClass('on');
	});

	contentUL.on('click', '.cardLayer', function (e) {
		$(this).prev('a').removeClass('on');
	});

	$('.shaerdbox').click(function(){
		$('.yellowPop').show();
	});

	$('.btn_y_Close').click(function(){
		$('.yellowPop').hide();
	});

	// 이용안내 아코디언
	$('.popLabelAco h4').click(function (e) {
		$(this).toggleClass('on');
	});

	// 기획전 빠른검색 - 슬라이드 팝업
	$('a.alAdd').on('click', function (e) {
		var target = $(this).attr('href');
		var popTarget = $('#overlayPanel');

		DOTCOM.openSlidePop(popTarget, {source:$(target)});

		popTarget.one('click', '.closeOverlayPanel', function (e) {
			DOTCOM.closeSlidePop(popTarget);

			e.preventDefault();
		});

		e.preventDefault();
	});
});