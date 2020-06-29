/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.06.14
 */

$(document).ready(function () {
    //console.log('ready');
    //플러스기획전
    Plus.init();
});

/**
* 플러스기획전 - 일본
*
* Plus.init(options);
*
* @param options    ::: 설정 Object 값
*
* options
*   key:type = value        //설명
*
* method
*   Plus.init(options);     //초기화
*/
var Plus = (function ($) {
    var selectBox,
        opts,
        defaults = getDefaultOption(),
        init = function (options) {
            opts = $.extend(defaults, options);

            if ($('.plusContent').length > 0) {
                selectBox = $('select');

                initLayout();
                initEvent();

                //초기 셀렉트
                selectBox.each(function () {
                    var idx = $(this).find('> option:selected').index();

                    $(this).find('option').eq(idx).prop("selected", true);
                    $(this).trigger('change.plus');
                });

                //전체탭
                var tab = new WTab();
                tab.init( {target: $('ul.plusTabList > li > a'), onTag: 'li', content: $('ul.plusTabList').nextAll('div'), onChange: function () {
                    initSwiper($('.plusContent').not(':hidden')); //스와이프 재초기화
                }});
                tab.setOpen(0);

                var tab2_1, tab2_2;
                $('ul.plusTabList').nextAll('div').each(function () {
                    tab2_1 = new WTab();
                    tab2_1.init( {target: $(this).find('div.topSect > ul[class$="_inTab"] > li > a'), onTag: 'li', content: $(this).find('div.tab1_intabCont > div'), onChange: function (data) {
                        initSwiper($('.plusContent').not(':hidden')); //스와이프 재초기화

                        //배경변경 예외
                        $('.tab1_cont2 > .topSect').removeClass('bgCont1 bgCont2 bgCont3').addClass('bgCont' + (data.idx+1))
                    }});

                    tab2_2 = new WTab();
                    tab2_2.init( {target: $(this).find('ul.tab4_list > li > a'), onTag: 'li', content: $(this).find('div.tab4_cont'), onChange: function () {
                        initSwiper($('.plusContent').not(':hidden')); //스와이프 재초기화
                    }});
                });
                
                //스와이프 초기화
                initSwiper($('.plusContent').not(':hidden'));
            }
        };

    function getDefaultOption() {
        return {
            
        };
    }

    function initLayout() {

    }

    function initEvent() {
        selectBox.on('change.plus', function (e) {
            var target = $(e.currentTarget);
            var idx = target[0].selectedIndex;

            target.next('div').children().hide().eq(idx).show();
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

            $(this).find('a.big5_prev').on('click.plus', function (e) {
                var target = $(e.currentTarget);
                var s = target.closest('.swiper-container')[0].swiper;

                s.slidePrev();
                changeGlobalSwiper(s);

                e.preventDefault();
            });

            $(this).find('a.big5_next').on('click.plus', function (e) {
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

            //내용변경 예외
            $(container).siblings('.cont2_btmTxt').hide().eq(idx).show();
        }
    }

    return {
        init: function (options) {
            init(options);
        }
   };
}(jQuery));