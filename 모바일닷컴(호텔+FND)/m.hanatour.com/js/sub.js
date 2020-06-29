var swipeViewID = "swipeView";
var swipeViewArr = new Array();
var isTopBtnOn = false;
var scrollT = 0;
var subWindowW = 0;

$(function() {
	resize();
	windowW = $(window).width();
	makeSwipeViewId(".swipeView");
});

/* 2015-05-12 삭제 
$(document).ready(function () {
	$(window).resize(function(){
		if(subWindowW == $(window).width())
			return;

		resize();
		subWindowW = $(window).width();
	});

	$(".allTheme").click(function(){
		$(".themeLayer").show();
		$(".popDim02").show();

		scrollT = $(window).scrollTop();
		$("#container").css("position", "fixed").css("top", "-"+scrollT+"px");
		$(window).scrollTop(0);
	
	});
	$(".themeClose").click(function(){
		$(".themeLayer").hide();
		$(".popDim02").hide();
		$("#container").attr("style", "");
		$(window).scrollTop(scrollT);
	});
});
2015-05-12 삭제 */

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

function makeSwipeView(wrap, indicator, auto) {
	var scroller = new iScrollCarousel(wrap, "hidden", {
		infinite: true,
		onBeforeScrollStart: function (e) {
			this.swipeView.clearTimeInterval();
		},
		onScrollEnd: function (x) {
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

function resize(){
	var w = $(window).width();
	$(".slider .page").width(w);
}
