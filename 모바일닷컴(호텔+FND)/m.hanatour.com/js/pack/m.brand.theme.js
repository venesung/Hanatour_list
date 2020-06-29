/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0.1
 * @since : 2017.03.30
 * 
 * 닷컴 - 해외 - 하나팩 - 브랜드 - 테마
 * 
 * history
 * 
 * 1.0   (2017.03.30) : 
 * 1.0.1 (2018.04.05) : 서브메뉴 셀렉트 삭제되고 버튼형태 유지, SwiperTemplate 삭제
 *
 */

(function (scope) {
    if (scope.BRAND_THEME !== undefined) return;

    var BRAND_THEME = {};

    scope.BRAND_THEME = BRAND_THEME;
})(window);

$(document).ready(function () {
    var containerDIV = $('.mainTheme2018');
    var topDistance = $('.headerMargin').outerHeight();// = $('nav#gnb > ul.gnb-wrapper');
    var tabContainerDIV = containerDIV.find('> div.pb_toggle');      //탭 컨테이너
    var tabUL = tabContainerDIV.find('> ul.tabList');           //탭 내부 UL
    var tabIns = tabContainerDIV.getInstance();                 //toggle 인스턴트
    //var selectSPAN = tabUL.next('span.bestTabFixed');           //셀렉트 wrap  //del 1.0.1
    //var tabSELECT = selectSPAN.find('> select');                //셀렉트 태그  //del 1.0.1
    var visualSwiperContainerDIV = containerDIV.find('> .swiper-container.homeBannerSl'); //add 1.0.1

    var isTabOver; //스크롤이 탭을 넘여서는지 유무

    //lazy
    $("img[data-original].lazy").parent().addClass('lazy_loading');

    $("img.lazy").lazyload({
        threshold : $(window).height(),
        placeholder : null,
        load : function (idx) {
            var parent = $(this).parent();
            if (parent.hasClass('lazy_loading')) parent.removeClass('lazy_loading');

            verticalMode($(this));
        }
    });

    //세로 모드 지원
    function verticalMode(img) {
        var parent = img.parent();
        img.css('marginTop', (parent.height() * .5) + (-img.height() * .5));
    }

    //스크롤 위치에 따라 셀렉트 스위칭
    $(window).on('scroll.brandtheme', function (e) {
        if (tabUL.length > 0) {
            isTabOver = visualSwiperContainerDIV.offset().top + parseInt(visualSwiperContainerDIV.css('paddingBottom')) - topDistance < WDDO.scrollYpos;

            //selectSPAN.toggle(isTabOver); //del 1.0.1
            tabUL.toggleClass('fixed', isTabOver);
        }
    });

    //탭변경되면
    if (tabIns !== undefined && tabIns.setCallback !== undefined) {
        tabIns.setCallback(function (data) {
            changeTab(data);
        });
    } else {
        tabContainerDIV.on('change.toggle', function (e, data) {
            changeTab(data);
        });
    }

    function changeTab(data) {
        //if (tabSELECT.length > 0) tabSELECT.find('> option').eq(data.idx).prop('selected', true); // 셀릭트 변경 //del 1.0.1
        new SwiperTemplate().resetSwiper($('.themeSubSlideWrapper .swiper-container')); //스와이프 재정의

        $(window).triggerHandler('scroll');

        //add 1.0.1
        if (tabUL.length > 0 && tabUL.hasClass('fixed')) $(window).scrollTop(visualSwiperContainerDIV.offset().top + parseInt(visualSwiperContainerDIV.css('paddingBottom')) - topDistance + 1);
    }

    //셀렉트 변경되면 탭변경 
    //del 1.0.1
    /*
    tabSELECT.on('change.brandtheme', function (e) {
        var target = $(e.currentTarget);

        if (tabIns !== undefined) {
            tabIns.setCloseAll();
            tabIns.setOpen(target.get(0).selectedIndex);
            new SwiperTemplate().resetSwiper($('.themeSubSlideWrapper .swiper-container')); //스와이프 재정의
            
            $(window).triggerHandler('scroll');
            if (tabUL.length > 0) $(window).scrollTop(tabUL.offset().top - topDistance - 60);
        }
    });
    */

    new SwiperTemplate().initFreeSwiper($('.themeSubSlideWrapper .swiper-container'), {slidesPerView: 2.22, slidesOffsetBefore: 8, slidesOffsetAfter: 8, spaceBetween: 10});

    BRAND_THEME.SwiperTemplate = (function () {return new SwiperTemplate()})();
});