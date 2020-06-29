var swipeViewID = "swipeView";
var swipeViewArr = new Array();
var winWidth = 0;
/* 2015-04-17 추가 (선택된 주요도시명 정보) */
var majorCityNm = null;
/* //2015-04-17 추가 (선택된 주요도시명 정보) */

//=================================== 개발팀 공유 함수 ================================//
// 주요 도시 선택 layer click event
// $el : click된 도시 "a"테그 jquery 객체
function majorCityCallback($el){
	console.log($el.text());
}
//=================================== 개발팀 공유 함수 ================================//


$(function() {
	resize();
	makeSwipeViewId(".swipeView");
	winWidth = $(window).width();
});

$(document).ready(function () {
	$(window).resize(function(){
		if(winWidth == $(window).width())
			return;

		winWidth = $(window).width();
		resize();
	});


	/* 특가항공 : 도시 선택 버튼 화면 고정 */
	fixedPosition(".posFixed.loaded");

	/* 2015-04-17 삭제 (UI 변경) */
	/* 해외항공 : 항공권 탭 정렬순서 */
	//var sortTabHtml = new Array();
	//for(i = 0; i < $(".min_tab li").length; i++){
	//	sortTabHtml[i] = $(".min_tab li").eq(i).html();
	//}
	/* //2015-04-17 삭제 (UI 변경) */

	/* 2015-04-30 수정 (value 값 처리) */
	/* 해외항공 : 귀국미정 체류기간 선택 */
	$(".airinCont .redCheck").click(function(){
		var ck = $(this).is(":checked");
		if(ck){
			$(this).attr("value", "Y");
			$(".airdaySect .endCheckAfter").show();
			setTimeout(function(){
				$(".airdaySect .endCheckAfter").addClass("fadeIn").one(TRNEND_EV, function() {
					$(".airdaySect .endDate").hide();
				});
			}, 10);
		}
		else{
			$(this).attr("value", "N");
			$(".airdaySect .endDate").show();
			$(".airdaySect .endCheckAfter").removeClass("fadeIn").one(TRNEND_EV, function() {
				$(this).hide();
			});
		}
	});
	/* //2015-04-30 수정 (value 값 처리) */

	/* 국내항공 : 도시 선택 */
	$(".koreSelect select").change(function(){
		var val = $(this).val();
		$(this).parent().find("em").text(val);
	});

	/* 2015-05-20 수정 (페이지 이동) */
	/* 해외항공 : 왕복/편도/다구간 항공권 탭 */
	$(".min_tab li:not(.noneTab)").click(function(){
		var id = $(this).find("a").attr("href");
		$(".min_tab li.on").removeClass("on");
		$(this).addClass("on");
		$(".airmainCt01 .tabCont").hide();
		$(id).show();
		fnTabChange(id);

	});
	/* //2015-05-20 수정 (UI 변경) */


	/* 특가항공 : 주유 도시 선택 팝업 Open 이벤트 */
	$(document).on("click", ".majorCity", function(){
/* 2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */
		var url = $(this).attr("href");
		callAjax(url, function(data){
			$("#overlayPanel").html(data);

			var sTop = $(window).scrollTop();
			var winH = window.innerHeight;

			overlayPanelPos = $(window).scrollTop();
			mask(true, "#overlayPanel");

			if(majorCityNm != null){
				$("#overlayPanel .innerScroller a[data-nm="+majorCityNm+"]").addClass("on");
			}

			$("#overlayPanel").height(winH).css("min-height", winH).show();
			setTimeout(function(){
				$("#overlayPanel").addClass("slide slideUp").one(ANI_EV, function() {
					$("#wrap").hide();
					$(window).scrollTop(0);
					$("#overlayPanel").height("auto").addClass("show").removeClass("slideUp slide");
/* //2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */

					$("#overlayPanel .innerScroller a").one("click", function(){
						$("#overlayPanel .innerScroller a.on").removeClass("on"); 
						$(this).addClass("on");

						var idx = $(this).attr("data-idx");
						var name = $(this).attr("data-nm");
						/* 2015-04-17 추가 (선택된 주요도시명 정보) */
						majorCityNm = name;
						/* //2015-04-17 추가 (선택된 주요도시명 정보) */

						$(".majorCity").text(name);
						$(".mCon03_top .background").html("<img src='../images/main/img_main03_top_"+idx+".png' width='100%'>"); 
						closeMajorCityOverlayPanel("data", $(this));
					});

				});
			}, 50);

			$(".closeOverlayPanel").one("click", function(){
				closeOverlayPanel("close");
				return false;
			});
		});
		return false;
	});
});

/* 해외항공 : 이벤트 배너 resize */
function resize(){
	$(".swipeView").filter(function(){
		w = $(this).width();
		h = $(this).find(".page").eq(0).height();
		$(this).find(".slider .page").width(w);
	});
}

/* 특정영역 화면 고정 */
function fixedPosition(cls){
	$(cls).filter(function(){
		var scrolller = $(this).attr("data-scroller");
		new fixedPostiion(scrolller, $(this));
	});
}

/* 플리킹 영역 ID 동적 생성 */
function makeSwipeViewId(cls){
	var i = 0;
	$(cls).filter(function(){
		i++;
		var id = swipeViewID + "-" + i;
		$(this).attr("id", id);

		var indicator = "#" + id + " .indicator";
		var auto = false;
		swipeViewArr.push(makeSwipeView(id, indicator, auto));
	});
}

/* Swipe View 객체 생성 */
function makeSwipeView(wrap, indicator, auto) {
	var scroller = new iScrollCarousel(wrap, "hidden", {
		infinite: true,
		onBeforeScrollStart: function (e) {
			this.swipeView.clearTimeInterval();
		},
		onTouchEnd: function (x) {
			var directionX = 0;

			if(this.currentPage == undefined || this.currentPage < this.currPageX)
				directionX = -1;
			else if(this.currentPage > this.currPageX)
				directionX = 1;
			else
				return;

			if(this.currentPage == this.currPageX)
				return;

			this.swipeView.checkPosition(directionX);
			this.currentPage = this.currPageX;
			this.swipeView.setTimeInterval();
			sliderPage = this.currentPage;
		},
		onInit: function () {
			new SwipeView(this, wrap, indicator, auto);
		}
	});

	return scroller;
}

/* 주요도시 선택 팝업 닫기 */
/* action : 주요도시 정보가 있으면='data', el : 선택된 주요도시 element 객체 */
/* 2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */
function closeMajorCityOverlayPanel(action, el){
	var winH = window.innerHeight;
	mask(false, "#overlayPanel");
	$("#overlayPanel").height(winH).addClass("slide");
	$("#wrap").show();
	$(window).scrollTop(overlayPanelPos);

	$("#overlayPanel").addClass("slideDown").one(ANI_EV, function() {
		$("#overlayPanel").attr("style", "").removeClass("slideDown slide show").hide();
		if(action == "data"){
			majorCityCallback(el);
		}
	});
}
/* //2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */
