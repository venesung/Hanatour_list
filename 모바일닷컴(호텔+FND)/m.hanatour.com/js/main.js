/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 2.0.3
 * @since : -
 *
 * 모바일 닷컴 메인 (홈, 패키지)
 *
 * history
 * 
 * 1.0 (-) : 기존 작성 되어 있는 스크립트 수정, 신규는 * wddo * 부터 작성중
 *
 * 1.1 	 (2016.02.12) : 100만 이벤트 퀵메뉴 initQuickBtn() 추가
 * 1.2 	 (2016.03.09) : 모바일 개편, initThemeSwiper() 추가
 * 2.0 	 (2016.05.23) : 모바일 개편 오픈 버전, makeCarousel(), mainTopBtnPosition() 삭제, top 버튼 common_new 에서 컨트롤
 * 2.0.1 (2016.06.02) : 홈 비주얼 영역 복제 swiper 아이템에 대한 클릭 이벤트 setLink() 호출로 재 등록
 *						lazy 영역 수정
 * 2.0.2 (2016.06.20) : 바둑판 형태메뉴 더보기 버튼 기능 변경
 * 2.0.3 (2017.05.31) : 홈 비주얼 swiper 페이드인 효과 추가
 *  
 */

var swipeViewID = "swipeView";
var swipeViewArr = new Array();
var carouselScroller;
var scrollTimeout = null;
var sliderPage;
var currentScroller;
var isTopBtnOn = false;
var gnbBtnEvent = false;
var winWidth = 0;
var mainSectionIdx = 0;
var isDataload = false;


//=================================== 개발팀 공유 함수 ================================//
// 주요 도시 선택 layer click event
// $el : click된 도시 "a"테그 jquery 객체
function majorCityCallback($el){
	//console.log($el.text());
}
//=================================== 개발팀 공유 함수 ================================//

$(function() {
	resize();
	//makeCarousel("mainSlider"); //del 2.0
	//makeSwipeViewId(".swipeView"); //del 2.0
	//mainTopBtnPosition(); //del 2.0
	winWidth = $(window).width();

});

$(document).ready(function () {
	imageLazy(1);

	$(window).resize(function(){
		if(winWidth == $(window).width())
			return;

		winWidth = $(window).width();
		resize();
	});

	//top 버튼 fixed
	fixedPosition(".posFixed.loaded");

	/* 2015-04-13 추가 */
	//국내여행 - 더보기 버튼
	$(document).on("tap", ".m5_linkBox .plusBtn", function(e){
		e.preventDefault();
		$(this).parent().parent().addClass("open");
	});
	$(document).on("tap", ".m5_linkBox .closeBtn", function(e){
		e.preventDefault();
		$(this).parent().parent().removeClass("open");
	});	

	/*// del 2.0.1
	$("#openProd").on('tap',function(e){
		e.preventDefault();
		$(".prodList").addClass("open");
	});
	$("#closeProd").on('tap',function(e){
		e.preventDefault();
		$(".prodList").removeClass("open");
	});
	*/

	$(document).on("click", "#page_03 .majorCity", function(){
		var url = $(this).attr("href");
		callAjax(url, function(data){
			$("#overlayPanel").append(data);

			var header = $("#overlayPanel").find(".fullLayer .header");
			var h = window.innerHeight;
			var padding = 0
			try{ padding = header.css("padding-top").replace("px", ""); }
			catch(e){}

			var mar = header.height() + parseInt(padding);
			if(!mar)
				mar = 0;

			$("#overlayPanel").show();
			$("#overlayPanel").find(".innerScroller").scrollTop(0).height(h-mar);
			setTimeout(function(){
				$("#overlayPanel").css(transform,  "translateY(-"+h+"px)").one(TRNEND_EV, function() {
					$("#overlayPanel .innerScroller a").one("click", function(){
						$("#overlayPanel .innerScroller a.on").removeClass("on"); 
						$(this).addClass("on");

						var idx = $(this).attr("data-idx");
						var name = $(this).attr("data-nm");

						$(".majorCity").text(name);
						$(".mCon03_top .background").html("<img src='/static/images/main/img_main03_top_"+idx+".png' width='100%'>"); 
						closeOverlayPanel("data", $(this));
					});
				});
			}, 50);

			$(".closeOverlayPanel").one("click", function(){
				closeOverlayPanel("close");
			});
		});
		return false;
	});

	/*
	//del 2.0
	$(document).on("tap", ".scrollTop", function(e){
		e.preventDefault();
		scrollerTop();
	});
	*/
	
	// NATIVE BANNER LINK RETOUCH
	if (isApp == "Y") {
		$("div[id=centerBanner] a").each(function(){
			var url = this.getAttribute("href");
			if( url.indexOf('javascript:') == -1 ){
				this.setAttribute("href", "javascript:banner('"+url+"');");					
			}
		});
	}
});

function imageLazy(num){
	//2015-05-20 수정
	$("#page_0"+num+" img.lazy").lazyload({
		threshold : Math.floor($(window).height() / 3), /*10,*/ //modify wddo :: 2015-12-08
		placeholder : "data:image/gif;base64,R0lGODlhkAGQAfeKAO/v7+Dg4Ojo6MLCwtHR0ZSUlKOjo4WFhW5ubrKysnV1dWZmZv7+/vf39/X19fr6+uvr6/v7+/Hx8f39/fDw8Pz8/NbW1vj4+OLi4vT09O7u7unp6fLy8tfX1/n5+c3NzePj4/b29uzs7MTExLOzs9PT07m5ubi4uKGhod/f3/Pz86SkpOXl5eHh4XZ2dqampuTk5LCwsObm5tra2tzc3K2trdDQ0MXFxaCgoMzMzNTU1JmZmZycnNnZ2e3t7WdnZ56enry8vLu7u29vb9vb28/Pz7a2tq+vr4aGhqmpqerq6svLy66ursnJycfHx+fn587OzpOTk8bGxqurq39/f4uLi7W1tZqamtXV1crKyt3d3b29vaqqqpiYmKysrHh4eLe3t6enp3x8fMPDw3R0dKWlpX19fW1tbdLS0qioqMHBwcjIyI+Pj76+vrS0tI6OjoyMjLq6ur+/v3p6enNzc97e3oCAgJ+fn52dnZWVlYiIiNjY2MDAwIqKiomJiY2NjbGxsXl5eXt7e5eXl5CQkHd3d3BwcIKCgpubm////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ZDZmOWU0NS1kZjE3LWE5NGMtYmZhYy0yNjNkODJjN2E5ZjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUExMjQ1MEI5RDQ3MTFFNUI4NjVBNjNGQTZFNDhBRDkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUExMjQ1MEE5RDQ3MTFFNUI4NjVBNjNGQTZFNDhBRDkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzM0OGU4ZmMtMDI3YS0yYzQ4LTk5ZDItZTA0NzdiMDY2ZTg3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDhmNzFkMzgtZTE5Ny0xMWU0LTkyNmUtOWMwNjExMzVkZjFiIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEBQQAigAsAAAAAJABkAEACP8AEwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrSp06dQo0qdSrWq1atYs2rdyrWr169gw4odS7as2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4seTbq06dOoU6tezbq169ewY8ueTbu27du4c+vezbu379/AgwsfTry48ePIkytfzry58+fQo0ufTr269evYs2vfzr279+/gw4v/H0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiy26OKLMMYo44w01mjjjTjmqOOOPPbo449ABinkkEQWaeSRSCap5JJMNunkk1BGKeWUVFZp5ZVYZqnlllx26eWXYIYp5phklmnmmWimqeaabLap3AQOUCCBAxO4udEEEgCgJwAS1GknRg3suWcDfy7UwB4YKOSAoHo6oFAEHjDQZglDLLDAHyEgtCijjh7EgAYCCLDBBWs6gICllt6hKaMAdGqQBKGG/7qBpGnagKqlPwRw0KaCukrQA7HGSmqaHdxqqR+0EsTrnr4OBGqwAnigZgRfGLvAEgYt26hBDUArAATJormEtYE8UJC2rRbEAATeEromA35Ya8W5rDabgbcauJnCD8aeQYGy9RI0wQbemusmENbiADCnBMEKrQR/AnCGsT8kKhC6rkbg7QZ+itmADj1EkJAb1k4x0AOsGpwIB95mkBADDYTQMZUWuIAAAlR8EO5AHlR76woEhSBopgOxHCy4CGUAQwABYED0lA3YfPPNb6RwUBPGQlFQBRdcUEFB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" //add wddo :: 2015-12-08
	});
	//2015-05-20 수정
}

function closeOverlayPanel(action, el){
	$("#overlayPanel .fullLayer li a").off("click");
	$("#overlayPanel").css(transform,  "translateY(0px)").one(TRNEND_EV, function() {
		$("#overlayPanel").hide();
		if(action == "data"){
			majorCityCallback(el);
		}
	});
}

function bgTransScale(target){
	setTimeout(function(){
		$(".mCon03_top .background > div").removeClass("on");
		$(".mCon03_top .background ."+target).addClass("on");
	}, 300);
}

/*
//del 2.0
function makeCarousel(wrap){
	var currentPageX = 0;
	carouselScroller = new iScrollCarousel(wrap, "hidden", {
		bounce: false,
		onBeforeScrollStart: function (e) {
			currentPageX = this.x;
		},

		onScrollEnd: function (){	
			var scroller = $("#mainSlider .scroller > .page").eq(this.currPageX);
			$("#topBtn01").removeClass("on");
			isTopBtnOn = false;

			var direct = "right";
			if(mainSectionIdx > this.currPageX)
				direct = "left";

			if(!gnbBtnEvent){
				currentScroller = scroller;
				loadSubPage(this.currPageX, direct);
			}
			mainSectionIdx = this.currPageX;
		}	
	});
}
*/

function loadSubPage(pageX, direct, callback){
	var loadPageIdx = pageX+1;
	if(direct == "left"){
		loadPageIdx -= 2;
	}

	var sectionEl = $("#mainSlider .scroller > .page").eq(loadPageIdx);
	var loaded = sectionEl.hasClass("loaded");
	var pageLen = $("#gnb li").length;

	if(pageX > 0 && (pageX+ 1) < pageLen){
		if(!loaded){
			
			var url = getGNBUrl(loadPageIdx);
			callAjax(url, function(data){
				sectionEl.addClass("loaded");
				sectionEl.find(".scrollArea").html(data);
				slideIni();

				imageLazy(loadPageIdx+1);

				if(callback) callback();
			});
		}
		else{
			slideIni();
			if(callback) callback();
		}
	}
	else{
		slideIni();
		if(callback) callback();
	}
}

/*
//del 2.0
function makeSwipeViewId(cls){
	var i = 0;
	$(cls).filter(function(){
		i++;
		var id = swipeViewID + "-" + i;
		$(this).attr("id", id);

		var indicator = "#" + id + " .indicator";
		var auto = false;

		//2015-05-12 추가/수정
		var len = $(this).find(".page").length;
		if(len > 1 )
			swipeViewArr.push(makeSwipeView(id, indicator, auto));
		else
			$(indicator).hide();
 		//2015-05-12 추가/수정
	});
}
*/

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

function fixedPosition(cls){
	$(cls).filter(function(){
		var scrolller = $(this).attr("data-scroller");
		new fixedPostiion(scrolller, $(this));
	});
}

function scrollerTop(){
	if(mainSectionIdx >= 0){
		$("#mainSlider .scroller > .page").eq(mainSectionIdx).find(".scrollArea").scrollTop(0);
	}
	else
		$(window).scrollTop(0);
}

function resize(){
	var len = 0;
	var w = $(window).width();
	var h = window.innerHeight;
	var headerH = $("#header").height();
	var sBarW = 0;
	var gnbH = $("#gnb").height(); // 2015-05-08 추가
	var scrollH = h-headerH-gnbH+1; // 2015-05-08 수정

	if(!isMobile){
		sBarW = 90;
	}
	else if(isAndroid){
		scrollH -= 1;
	}

	len = $("#mainSlider section.page").size();
	$("#mainSlider .scroller").width((w * len) + sBarW);
	$("#mainSlider .scroller > .page").width(w);
	//$("#mainSlider .scroller .page .scrollArea").height(scrollH);

	//2015-05-12 수정
	$(".swipeView").filter(function(){
		var len = $(this).find(".page").length;
		if(len > 1){
			w = $(this).width();
			h = $(this).find(".page").eq(0).height();
			$(this).find(".slider .page").width(w);
		}
	});
	//2015-05-12 수정
}

function callAjax(url, callback){
	var networkFlag = false;
	var reqTimeout;
	isLoad = true;

	$.ajax({
		type: "GET",
		url: url,
		async: true,
		dataType: "text",
		beforeSend: function(){
		},
		success: function(data){
			if(callback) callback(data);
		},
		error: function(xhr, option, error){
		}
	});
}

function slideIni(){
	if(currentScroller.hasClass("view"))
		return;

	var idx = currentScroller.index();
	currentScroller.addClass("view");

	if(idx == 1){
		counting(80);
	}
	else if(idx == 2){
		fixedPosition("#page_03 .posFixed.loaded");
	}
	else if(idx == 3){
		counting(30);
	}
	else if(idx == 4){
		counting(40);
	}
}

function counting(speen){
	var max = 0;
	var countEl = currentScroller.find(".countNum");
	countEl.filter(function(){
		var num = parseInt($(this).attr("data-num"));
		if(max < num)
			max = num;
	});

	var i = 0;
	var timeInterval = setInterval(function(){
		countEl.filter(function(){
			var num = parseInt($(this).attr("data-num"));

			if(i <= num)
				$(this).text(i);
		});
		i++;
		if(i > max)
			clearInterval(timeInterval);
	}, speen);
}

/*
//del 2.0
function mainTopBtnPosition(){
	var topObj = $("#topBtn01");
	var quickObj = $('.quickDimBox');

	$("#mainSlider > .scroller > .page").filter(function(){
		$(this).find(".scrollArea").scroll(function(e){
			var t = $(this).scrollTop();
			var max = maxScrollPos($(this))-250;
			if(t == 0 || max <= 0){
				if(!isTopBtnOn)
					return;

				topObj.removeClass("on");
				quickObj.removeClass("topPosi");

				isTopBtnOn = false;
			}
			else {
				if(isTopBtnOn)
					return;

				topObj.addClass("on");
				quickObj.addClass("topPosi");

				isTopBtnOn = true;
			}
		});
	});
}
*/

function loading(scroller, flag){
	if(flag){
		scroller.find(".loading").show();
	}
	else{
		scroller.find(".loading").hide();
	}
}

$(document).ready(function(){

	filterArea($('#page_01 .rangking .rangkTop .areaCont .graySelectBox'));
	
	$(document).on('tap','[name=newFooter_pcweb_btn]',function(e){
		e.preventDefault();
		pc();
	});
	
	$('#showTicket').off('click');
	$('#showTicket').unbind('click');
	$('#showTicket').off('tap');
	$('#showTicket').unbind('tap');
	$('#showTicket').on('tap',function(e){
		//alert('click');
		//e.preventDefault();
		moveSubPageHandler('showTicket');
	});
	
	//session data clear
	clearData();

});


function filterArea(obj){
	var area = $(obj).val();
	var isAddClass = false;
	if( area == '' ){
		$('#page_01 .areaList').removeClass('add');
		$('[data-catename^=area_]').show();
	}else{
		$('[data-catename^=area_]').hide();
		if( $('[data-catename="area_'+area+'"]').eq(0).attr('addclass') == 'add'){
			$('#page_01 .areaList').addClass('add');
		}else{
			$('#page_01 .areaList').removeClass('add');
		}
		$('[data-catename="area_'+area+'"]').show();
	}
	//적용한 image lazyload plugin이 scroll 이벤트에서만 동작 하므로 scroll 이벤트 강제 호출
	$('.scrollArea').trigger('scroll');
}


// TAB2 - PACKAGE
function detailPackage(obj){//
	writeWiseLog(hanaCodeArray["MAIN_PACKAGE"]);
	var landingUrl = getScheduleInfoURL($(obj).attr("pkgCode"));
	location.href = landingUrl;
	//setData("packageScheduleCode", $(obj).attr("pkgCode"));
	//anchor("/application/package/package_schedule.jsp");
}

// TAB3 - AIR
function detailAir(obj){
	writeWiseLog(hanaCodeArray["MAIN_AIR"]);
	var jsonStr = $(obj).parent().find('input[name=json]').val();
	location.href = airDomain + "/event/specialprice_detail.hnt?param="+encodeURIComponent(jsonStr);
}

// TAB4
function detailHotel(id){
	var imageNo = $("#"+id+" img").attr("src");
	imageNo = imageNo.substring(imageNo.indexOf('.jpg')-8,imageNo.indexOf('.jpg')-2);

	setData("overseasHotelHotelCode", id);
	setData("overseasHotelHotelRedirectWebYN","Y");
	setData("overseasHotelHotelImageNo",imageNo);

	writeWiseLog(hanaCodeArray["MAIN_HOTEL"]);

	//anchor("/application/overseasHotel/overseasHotel_hotelInfo.jsp");
	anchor("/hotel/info.hnt");
}


// TAB 5 
function domesticAnchor(section){
	if ($(section).attr('region') == "") {
		if ($(section).attr('id') == "airlineDomesticTab") {//항공
			anchor(domesticAirDomain+"/partner/ht/air_main_02.asp", "MAIN_DOMESTIC_01");
		} else if ($(section).attr('id') == "domesticLodgeTab") {//숙박
			anchor(domesticAirDomain+"/dh/dh_index.asp", "MAIN_DOMESTIC_02");
		} else if ($(section).attr('id') == "busTourTab") {//내륙여행
			anchor(domesticAirDomain+"/dg/dg_index.asp");
		} else if ($(section).attr('id') == "jejuTourTab") {//제주여행
			anchor(domesticAirDomain+"/dgj/dg_index.asp");
		} else if ($(section).attr('id') == "jejuMakeTab") {//제주만들기
			anchor(domesticAirDomain+"/dm/dm.asp");
		} else if ($(section).attr('id') == "spaTab") {//입장권
			anchor(domesticAirDomain+"/dt/dt_index.asp");
		} else if ($(section).attr('id') == "rentalcarTab") {//렌터카
			anchor(domesticAirDomain+"/dr/dr_index.asp");
		} 
	} else {
		setData('isPackageInit', "Y");
		setData('packageDomesticRegionName', $(section).attr('region'));		
		if ($(section).attr('id') == "busTour") {
			anchor("/application/package/package_domesticTour.jsp", "MAIN_DOMESTIC_03");
		} else if ($(section).attr('id') == "jejuTour") {
			anchor("/application/package/package_domesticTour.jsp", "MAIN_DOMESTIC_04");
		} else if ($(section).attr('id') == "localTour") {
			anchor("/application/package/package_domesticTour.jsp", "MAIN_DOMESTIC_05");
		}else{
			anchor("/application/package/package_domesticTour.jsp");
		}
	}
}



//광고 배너 카피
function setAdBannerUi(){

	$('[banner1]').each(function(i,obj){
		if( $(obj).html() == '' ){
			var doc1 = $('#centerBanner').html();
			doc1 = removeScriptTagFromHtmlStr(doc1);
			$(obj).html(doc1);
		}
	});
	$('[banner2]').each(function(i,obj){
		if( $(obj).html() == '' ){
			var doc1 = $('#centerBanner2').html();
			doc1 = removeScriptTagFromHtmlStr(doc1);
			$(obj).html(doc1);
		}
	});
}


//레이어 팝업 띄우기
function openPopupLayer(id){
	var winH = window.innerHeight;
	$("#wrap").css("position", "fixed");
	$("#mainSlider .scroller section div.scrollArea").css("overflow", "hidden");
	$("#"+id).show();
	$(".popDim").show();

	$("#"+id +" .btnClose").click(function(){
		hidePopupLayer(id);
	});
}

function hidePopupLayer(id){
	$("#"+id).hide();
	$(".popDim").hide();
	$("#wrap").attr("style", "");
	$("#mainSlider .scroller section div.scrollArea").css("overflow-y", "scroll");
}

// **********************************************************************************************
// **************************************** wddo 신규 *******************************************
// **********************************************************************************************
$(document).ready(function () {
	initGridMenu();
	initQuickBtn();
	initVisualSwiper();
	initThemeSwiper();

	//홈 - 바둑판 형태의 메뉴
	function initGridMenu() {
		//홈 - 전체보기, 버튼 클릭(해더-전체보기 기능과 동일)
		$('.prodList02 > li.plus').on('click', function (e) {
			$('#header #btnMenu').trigger('click');

			e.preventDefault();
		});

		//닫기 //add 2.0.2
		$('.prodList02 > li.close').on('click', function (e) {
			$(this).closest('ul').removeClass('open');

			e.preventDefault();
		});
	}

	//홈 - 최상단 비주얼 스와이프
	function initVisualSwiper() {
		var pageDIV = $('.homeBannerSl .swiper-pag-num');
		var allEventDiv = $('.allEventBox');
		var closeBtn = allEventDiv.find('h3 > a');
		var closeFixedBtn = allEventDiv.find('.evfixBtn');

	    var swiper = new Swiper('.homeBannerSl', {
			loop: true,
			preloadImages: false,
			lazyLoadingInPrevNext: true,
			lazyLoading: true,
			pagination: '.homeBannerSl .swiper-pag',
			onInit: function (data) { // add 2.0.1
				var swiperSlide = $(data.container[0]).find('.swiper-slide');
				if (typeof setLink !== 'undefined' && swiperSlide.find('a[link="simple"], a[link="app"]').length > 0) setLink();
			},
			onLazyImageReady: function (swiper, slide, image) {
				//modify 2.0.3
				if ($(slide).is('.swiper-slide-active')) $('.homeBannerSl .swiper-wrapper').animate({opacity: 1}, {queue:false, duration: 800});
			},
			onSlideChangeStart: function (data) {
                swiperChange(data);
            },
            onSliderMove: function (data) {
                swiperChange(data);
            },
            onTransitionEnd: function (data) {
                swiperChange(data);
            }
		});

		function swiperChange(data) {
			var act = parseInt($(data.container[0]).find('.swiper-slide-active').data('swiper-slide-index'));
			var total = $(data.container[0]).find('.swiper-slide').not('.swiper-slide-duplicate').length;

			$(data.container[0]).find('.swiper-pag-num').html('<span>'+ (act + 1) +'</span>/' + total);
		}
	}

	//패키지 - 최하단 테마별 여행 스와이프
	function initThemeSwiper() {
        var swiper = new Swiper('.graySpace > .theme_nBox > .swiper-container', {
        	pagination: '.graySpace > .theme_nBox .swiper-pagination',
			slidesPerView: 2,
        	centeredSlides: true,
        	wrapperClass: 'themeNewList',
        	setWrapperSize: true,
        	roundLengths: true,
        	spaceBetween: 0,
        	loop: true,
        	loopAdditionalSlides: 2,
			onSlideChangeStart: function (data) {
                swiperChange(data);
            },
            onSliderMove: function (data) {
                swiperChange(data);
            },
            onTransitionEnd: function (data) {
                swiperChange(data);
            }
        });

        function swiperChange(data) {
            //var act = $(data.paginationContainer[0]).find('.swiper-pagination-bullet-active').index();
            //$(data.wrapper[0]).find('> div').removeClass('on').eq(act).addClass('on');
        }
	}

	//홈,패키지 - 오른하단 플로팅 메뉴 + 버튼
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
	        btn.on('click', function (e) {
	            var target = $(e.currentTarget);

	            if (!sub.hasClass('on')) {
	                sub.addClass('on');
	                setTimeout(open, 100);
	            } else {
	                close();
	            }

	            e.preventDefault();
	        });

	        sub.on('click', function (e) {
	            var target = $(e.currentTarget);

	            if (target.is('div')) {
	                close();
	            }

	            e.preventDefault();
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
	        mask(true, quickDIV.selector);
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
	        mask(false, quickDIV.selector);
	    }

	    init();
	    addEvent();
	}

	// BANNER RESIZE
	$("div[id=mainBanner] img").each(function(){
		this.setAttribute("width", "100%");
		$(this).removeAttr('height');
	});

});

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
