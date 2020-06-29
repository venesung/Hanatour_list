/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.1.0
 * @since : -
 *
 * 모바일 항공앱 공통js
 *
 * history
 * 
 * 1.0 (-) : 기존 작성 되어 있는 스크립트 수정, 신규는 * wddo * 부터 작성중
 * 1.1.0 (2018.06.19) : 탑메뉴, 챗봇 추가
 *  
 */

var overlayPanelPos = 0;
var overlayPanelPos02 = 0;
var isDataload = false;
var windowW = 0;
/* 2015-04-30 추가 (달력 상태)*/
var oldDateMode = "";
/* //2015-04-30 추가 (달력 상태)*/

$(function() {
	topBtnPosition();
	/* 2015-05-28 추가 */
	bottomBtnPosition();
	/* //2015-05-28 추가 */
});

$(document).ready(function () {
	/* 2015-06-04 추가 (iOS position fixed keyboard bug) */
	$("input[type='text'], input[type='password'], input[type='tel'], input[type='number'], input[type='email'], input[type='date']").each(function(){
		$(this).bind("focus", function(){
			$("#header").css("position", "absolute");
		});
		$(this).bind("blur", function(){
			$("#header").css("position", "fixed");
		});
	});
	
	/* 2015-04-23 추가 (좌우측 메뉴 Resize) */
	$(window).resize(function(){
		if(windowW == $(window).width())
			return;

		windowW = $(window).width();
		winResize();
	});
	/* //2015-04-22 추가 */
	
	/* Tab 배튼 클릭 이벤트 */
	$(document).on("click", ".scTab01 a", function(){
		$(".scTab01 li.on").removeClass("on");
		$(".scTab").hide();
		var target = $(this).attr("href");
		$(target).show();
		$(this).parent().addClass("on");
	});
	
	/* input text 삭제 */
	$("#clearId,#clearId02").off("click").on("click", function() {
		$(".clearTxt").val("");
	});

	/* 공통 레이어 팝업 Open 이벤트 */
	/* 2015-04-17 수정 (인라인 스크립트로 처리할 대응)*/
	$(document).on("click", ".slideUpPop:not('.localEvent')", function(){
		openOverlayPanel($(this));
		return false;
	});
	/* //2015-04-17 수정 (인라인 스크립트로 처리할 대응)*/

	/* 달력 : 귀국미정 체류기간 선택 */
	$(document).on("change", "#overlayPanel .daylabel select", function(){
		$(this).parent().find(".redCheck").prop("checked", true);
	});

	/* 도시검색 : 검색 history 열기 */
	$(document).on("click", ".inpSearBox01.cityTy input", function(){
		$(".cityEnd").show();
	});

	/* 도시검색 : 검색 history 닫기 */
	$(document).on("click", ".cityEndCl", function(){
		$(".cityEnd").hide();
	});

	/* 인원선택 : + 버튼 클릭 이벤트 */
	/*
	$(document).on("click", ".peopleBtn .plusBtn", function(){
		var numEl = $(this).parent().find(".num");
		var num = parseInt(numEl.text());
		numEl.parent().removeClass("zero");
		numEl.text(num+1);
		return false;
	});
	*/

	/* 인원선택 : - 버튼 클릭 이벤트 */
	/*
	$(document).on("click", ".peopleBtn .delBtn", function(){
		var numEl = $(this).parent().find(".num");
		var num = parseInt(numEl.text());

		if(numEl.hasClass("adult") && num == 1)
			return false;

		if(num == 0)
			return false;

		num--;
		numEl.text(num);
		if(num == 0){
			numEl.parent().addClass("zero");
		}
		return false;
	});
	*/
	
	/* 최상단 이동 버튼 클릭 이벤트 */
	$(".scrollTop").click(function(){
		moveScrollTop();
	});

	/* 전체메뉴 열기 */
	$("#btnMenu").click(function(){
		mask(true, "#menuPanel");
		var winH = window.innerHeight;
		$("#menuPanel .innerScroller").height(winH);
		$("#menuPanel").addClass("slideIn");
		$("#wrap").addClass("slideLeft");

		/* 전체메뉴 닫기 */
		$("#mask").one("click", function(){
			$("#menuPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideLeft");
			mask(false, "#menuPanel");
		});
		return false;
	});
	
	/* 우측메뉴 열기 event bind를 id 에서 class 로 변경 */
	
	$(".rightMenu_btn").click(function(){
		
		//이미 생성되어 있는 빈 화면(userPanel)을 지운다.어짜피 우측메뉴 클릭할때 다시 HTML을 생성하기 때문
		$("#userPanel").remove();
		
		$.ajax({
			url : "/userPanelAjax.hnt",
			data: null,
			dataType: "html",
			type: "POST",
			contentType: "application/json; charset=utf-8",
			success: function (data){
				$("body").append(data);
				//아이폰일 경우 네이티브 콜
				//alert(App.isHanafreeairapp() + ":"+ App.getDeviceOS() +":"+App.getVersion() +":"+(App.getDeviceOS() == App.agent.IOS && App.getVersion() == App.version.IOS[0].value) || (App.getDeviceOS() == App.agent.ANDROID && App.getVersion() == App.version.ANDROID[0].value));
				if(App.isHanafreeairapp()){
					if((App.getDeviceOS() == App.agent.IOS && App.getVersion() == App.version.IOS[0].value) || (App.getDeviceOS() == App.agent.ANDROID && App.getVersion() == App.version.ANDROID[0].value)){
						location.href="toursoft://menu";
						return ;
					}
				}
				mask(true, "#userPanel");
				var winH = window.innerHeight;
				$("#userPanel .innerScroller").height(winH);
				$("#userPanel").addClass("slideIn");
				$("#wrap").addClass("slideRight");
				
				 //우측메뉴 닫기 
				$("#mask, .closeSlide").one("click", function(){ // 20150526 .closeSlide 추가 
					$("#userPanel").removeClass("slideIn");
					$("#wrap").removeClass("slideRight");
					mask(false, "#userPanel");
				});
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
		
		return false;
	});
	

	/* 우측메뉴 열기 event bind를 id 에서 class 로 변경 */
	/*
	$(".rightMenu_btn").click(function(){
		//아이폰일 경우 네이티브 콜
		//alert(App.isHanafreeairapp() + ":"+ App.getDeviceOS() +":"+App.getVersion() +":"+(App.getDeviceOS() == App.agent.IOS && App.getVersion() == App.version.IOS[0].value) || (App.getDeviceOS() == App.agent.ANDROID && App.getVersion() == App.version.ANDROID[0].value));
		if(App.isHanafreeairapp()){
			if((App.getDeviceOS() == App.agent.IOS && App.getVersion() == App.version.IOS[0].value) || (App.getDeviceOS() == App.agent.ANDROID && App.getVersion() == App.version.ANDROID[0].value)){
				location.href="toursoft://menu";
				return ;
			}
		}
		mask(true, "#userPanel");
		var winH = window.innerHeight;
		$("#userPanel .innerScroller").height(winH);
		$("#userPanel").addClass("slideIn");
		$("#wrap").addClass("slideRight");

		 우측메뉴 닫기 
		$("#mask, .closeSlide").one("click", function(){ // 20150526 .closeSlide 추가 
			$("#userPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideRight");
			mask(false, "#userPanel");
		});
		return false;
	});
*/
	/* TEXTAREA 입력 글자수 제한 */
	$(document).on("keyup", "textarea", function(){
		var txt = $(this).val();
		if(txt.length > 150){
			txt = txt.substring(0, 150);
			$(this).val(txt);
			return false;
		}
		$(this).parent().find(".c_red").text(txt.length);
	});
});

/* 레이어 팝업 Open */
function openOverlayPanel(that){
/* 2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */
	var url = that.attr("href");

	callAjax(url, function(data){
		$("#overlayPanel").html(data);

		var sTop = $(window).scrollTop();
		var winH = window.innerHeight;

		overlayPanelPos = $(window).scrollTop();
		mask(true, "#overlayPanel");

		var callback = that.attr("data-callback");
		if(callback != "" && callback != undefined){
			callback = callback + "(that)";
			eval(callback);
		}

		$("#overlayPanel").height(winH).css("min-height", winH).show();
		setTimeout(function(){
			$("#overlayPanel").addClass("slide slideUp").one(ANI_EV, function() {
				$("#wrap .swiper-container.swiper-container-horizontal").each(function () {
					var swiper = $(this)[0].swiper;
					if (swiper !== undefined && swiper.autoplaying) swiper.stopAutoplay();
				});// add @wddo
				$("#wrap").hide();
				$(window).scrollTop(0);
				$("#overlayPanel").height("auto").addClass("show").removeClass("slideUp slide");
/* //2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */

				try{
					afterSlideUpPop();
				}
				catch(e){}
			});
		}, 50);

		$(".closeOverlayPanel").one("click", function(){
			closeOverlayPanel("close");
			return false;
		});
	});
}

/* <!-- 2016-10-13 추가 일반 딤 레이어 팝업 */
function openNormalOverlayPanel() {
	var headerHeight = 50;

	var popContainer = $("#layerpopPanel");
	var pop = popContainer.find(".smallPop");
	var dimed = popContainer.find(".modalBg");

	var sTop = $(window).scrollTop();

	$(document).scrollTop(sTop);
	pop.css("top", sTop + headerHeight);

	popContainer.show();
	dimed.show();

	pop.find(".closePop").on("click", function(e) {
		closeNormalOverlayPanel();
		e.preventDefault();
	});


}

function closeNormalOverlayPanel() {
	var popContainer = $("#layerpopPanel");
	var pop = popContainer.find(".smallPop");
	var dimed = popContainer.find("div.modalBg");

	popContainer.hide();
	dimed.hide().off("click");
	pop.find(".closePop").off("click");
}
/* 2016-10-13 추가 일반 딤 레이어 팝업 --> */

/* 팝업 닫기 */
/* 2015-04-27 2차 팝업 처리 */
function closeOverlayPanel(state, target){
	var winH = window.innerHeight;
	if(target == "" || target == undefined)
		target = "#overlayPanel";

	$(target).height(winH).addClass("slide");

	if(target == "#overlayPanel") {
		$("#wrap").show();
		$("#wrap .swiper-container.swiper-container-horizontal").each(function () {
			var swiper = $(this)[0].swiper;
			if (swiper !== undefined && !swiper.autoplaying) swiper.startAutoplay();
		});// add @wddo
		$(window).scrollTop(overlayPanelPos);
		mask(false, target);
	}
	else{
		$("#overlayPanel").show();
		$(window).scrollTop(overlayPanelPos02);
	}

	$(target).addClass("slideDown").one(ANI_EV, function() {
		$(target).attr("style", "").removeClass("slideDown slide show").hide();
	});
}
/* //2015-04-27 2차 팝업 처리 */

/* 전체 화면 Dim 처리 */
/* 2015-04-17 (전체메뉴 열기 터치 이벤트 제어 수정 )*/
function mask(flag, target){
	if(flag){
		if(target != "#overlayPanel"){
			$("body .ui-page").append("<div id='mask' class='mask'></div>");
			disableTouchEvent(target);
		}
	}
	else{
		enableTouchEvent(target);
		$("#mask").remove();
	}
}
/* //2015-04-17 (전체메뉴 열기 터치 이벤트 제어 수정 )*/

/* 팝업 스크롤 제어 터치 이벤트 등록 */
function disableTouchEvent(el) {
	var startY = 0;
	var direction = "";
	var target = $(el+" .innerScroller");
	var id = "";

	$('body').on({
		touchstart: function(e) {
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			startY = touch.pageY;
		
			var t = $(e.target);
			id = t.attr("id");
		},
		touchmove: function(e) {
			if(id == "mask"){
				e.preventDefault();
				return false;
			}
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			var deltaY = touch.pageY - startY;
			var absDistY = m.abs(deltaY);
			var max = maxScrollPos(target);
			var pos = getScrollPositions(target);

			if(deltaY > 0 && pos <= 0 ){
				e.preventDefault();
				return false;
			}
			else if(deltaY < 0 && max <= 0){
				e.preventDefault();
				return false;
			}
		}
	});
}

/* 터치 이벤트 해제 */
function enableTouchEvent(el) {
	$('body').off("touchstart touchmove");
}

/* TOP 버튼 transition */
function topBtnPosition(){
	var isOn = false;
	var isMain = $("#mainSlider").size() > 0 ? true : false;
	var topObj = $("#topBtn01");
	var scroller = $(window);
	if(isMain || topObj.length == 0)
		return;

	scroller.scroll(function(e){
		var max = maxScrollPos(scroller);
		var t = scroller.scrollTop();
		if(t == 0){
			if(!isOn)
				return;

			topObj.removeClass("on");
			isOn = false;
		}
		else {
			if(isOn)
				return;

			topObj.addClass("on");
			isOn = true;
		}
	});
}

/* 최상단으로 이동 */
function moveScrollTop(){
	var isMain = $("#mainSlider").size() > 0 ? true : false;
	if(isMain)
		scroller = currentScroller.find(".scrollArea");
	else
		scroller = $(window);

	scroller.scrollTop(0);
}

/* 공통 AJAX */
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


/* 도시 검색(슬라이드 팝업 콜백 함수) */
function callCityListNew(el) {
	$('.cityListNew').on('click', '> ul > li > a', function (e) {
		var target = $(e.currentTarget);

		$('.cityListNew').find('> ul > li > a').removeClass('on');
		target.addClass('on');
	});
}


/* 달력 생성 */
/* 2015-05-04 수정 (귀국미정 disabled ) */
function datePicker(el){
	if($('#datePicker .datepicker').size() > 0){
		if(reset)
			$('#datePicker').DatePickerClear();
		return;
	}
	var mode = el.attr("data-mode");
	var setDate =  el.attr("data-set");	// 예약가능 시작일
	oldDateMode = mode;
	// 편도/왕복/다구간 UI 생성
	if(mode == "range"){
		$(".oneType").hide();
		$(".twoType").show();
		$(".threeType").hide();
		$(".datepickerTit .tit").text("출국/귀국일 선택");
	}
	else if(mode == "range2"){
		$(".oneType").hide();
		$(".twoType").hide();
		$(".threeType").show();
		$(".datepickerTit .tit").text("여정 선택");
	}
	else if(mode == "range3"){
		$(".oneType").hide();
		$(".twoType").hide();
		$(".threeType").show();
		$(".datepickerTit .tit").text("여정 선택");
	}
	else if(mode == "range4"){
		$(".oneType").hide();
		$(".twoType").hide();
		$(".threeType").show();
		$(".datepickerTit .tit").text("여정 선택");
	}
	else if(mode == "range5"){
		$(".oneType").hide();
		$(".twoType").hide();
		$(".threeType").show();
		$(".datepickerTit .tit").text("여정 선택");
	}
	else if(mode == "range6"){
		$(".oneType").hide();
		$(".twoType").hide();
		$(".threeType").show();
		$(".datepickerTit .tit").text("여정 선택");
	}
	else{
		$(".oneType").show();
		$(".twoType").hide();
		$(".threeType").hide();
		$(".datepickerTit .tit").text("출국일 선택");
	}

	//귀국미정 선택
	$("#overlayPanel .daylabel .redCheck").click(function(){
		var depType = $("[name=startArea]:checked").val();
		var ck = depType=="depKor" ? $(this).is(":checked") : false;
		if(ck){
			if(oldDateMode == "range"){
				datePicker.DatePickerSetMode("single");
			}

			$(this).attr("value", "Y");
			$(".twoType .selBox").show();
			setTimeout(function(){
				$(".twoType .selBox").addClass("fadeIn").one(TRNEND_EV, function() {
					$(".twoType .txtBox").hide();
				});
			}, 10);
			$(".datepickerTit .tit").text("출국일 선택");
		}
		else{
			if(oldDateMode == "range"){
				datePicker.DatePickerSetMode("range");
			}

			$(this).attr("value", "N");
			$(".twoType .txtBox").show();
			$(".twoType .selBox").removeClass("fadeIn").one(TRNEND_EV, function() {
				$(this).hide();
			});
			$(".datepickerTit .tit").text("출국/귀국일 선택");
		}
		datePicker.resetDefaultDate();
	});

/* 2015-05-20 수정 */
	if(oldDateMode == "range"){
		setTimeout(function(){
			var ck = $("#ckUnset").val();
			if(ck == "Y"){
				var val = $("#secFocus").val();
				$("#overlayPanel .selBox select option").filter(function(){
					if($(this).val() == val){
						$(this).prop("selected", true);
					}
				});
				$("#overlayPanel .daylabel .redCheck").trigger("click");
				$(".datepickerTit .tit").text("출국일 선택");
			}

			var edit = $("#editMode").val();
			if(edit == "N"){
				mode = "single";
				/* 2015-06-08 수정 :: 왕복으로 진입한 검색결과의 달력에서 '미정'이라는 텍스트와 체크박스영역 삭제 */
				$("#overlayPanel .daylabel").hide();
				$("#overlayPanel .daylabel .redCheck").attr("readonly", true).attr("disabled", true);
				$("#overlayPanel .selBox select").attr("readonly", true).attr("disabled", true);
				/* //2015-06-08 수정 */
			}
			if(ck == "Y" && edit == "N"){
				$("#overlayPanel .twoType .return").addClass("lastPr0");
				$("#overlayPanel .twoType .selBox em").text("최대 체류기간");
			}

		}, 100);
	}
/* //2015-05-20 수정 */

	if(setDate == "" || setDate == undefined)
		setDate = null;

	//선택한 날짜 초기값 세팅
	var date = el.attr("data-date");
	var dates;
	if(date == undefined)
		dates = [];
	else{
		temp = date.split(",");
		str = "[";
		for(i = 0; i < temp.length; i++){
			str += "'"+ temp[i].replaceAll(" " , "") +"'";
			if(i < temp.length-1)
				str += ",";
		}
		str += "]";
		dates = eval(str);
	}

	// 날짜 UI 생성
	/* 2015-05-14 수정 */
	var datePicker = $('#datePicker').DatePicker({
		format:'Y-m-d',
		flat: true,
		defaultDate: dates,
		date: dates,
		calendars: 12,
		mode: mode,
		starts: 0,
		setDate: setDate,
		onChange: function(formated, dates){
			var sDate = formated[0];
			var mDate = formated[1];
			var eDate = formated[2];
			var eDate1 = formated[3];
			var eDate2 = formated[4];
			var eDate3 = formated[5];
			if(oldDateMode == "range"){	
				 eDate = mDate;
				 mDate = "";
			}
			$("#detepicker-form input[name=dateS]").attr("value", sDate)
			$("#detepicker-form input[name=dateM]").attr("value", mDate)
			$("#detepicker-form input[name=dateE]").attr("value", eDate)
			$("#detepicker-form input[name=dateE1]").attr("value", eDate1)
			$("#detepicker-form input[name=dateE2]").attr("value", eDate2)
			$("#detepicker-form input[name=dateE3]").attr("value", eDate3)
		},
		onAfterRender: function(){
			var tmp = new Date(dates[0]);
			var y = tmp.getFullYear();
			var m = tmp.getMonth()+1;	
/* 2015-05-20 수정 */
			m = m <= 9 ? "0"+m : m;
			var posMonth = y + "" + m + "01";
			setTimeout(function(){
				try{
					var pos = $("#" + posMonth).position().top;
					$(window).scrollTop(pos);
				}
				catch(e){}
			}, 100);
		}
	});
	/* //2015-05-14 수정 */
}
/* //2015-05-04 수정 (귀국미정 disabled ) */



/* 2015-04-17 추가 (동적 페이지 데이터 처리 클래스 ) */
var loading = '<div class="loadingBar"><img src="../images/main/img_loadingbar.gif" alt=""></div>';
var dynamicDataLoad = (function (window, document) {
	dynamicDataLoad = function (el, options) {
		var that = this, isDataload = false;
		that.selector = $(el);
		that.scroller = $(window);
		that.options = {
			loading: true,
			enabled: true,
			onLoadPosition: null
		};
		for (i in options) that.options[i] = options[i];

		that.scrollTopPos();
	};
	dynamicDataLoad.prototype = {
		scrollTopPos: function(){
			var that = this;
			var footer = $(".newFoot");
			var winH = window.innerHeight;
			var headH = $("#header").height();
			that.scroller.scroll(function(e){
				if(!that.options.enabled)
					return;

				var fHeight = footer.height();
				var wrap = $("#wrap").css("display");
				if(wrap == "none")
					return;

				var scrollHeight = $(document).height() - fHeight;
				var scrollPosition = $(window).height() + $(window).scrollTop();
				if ((scrollHeight - scrollPosition) / scrollHeight <= 0) {
					if(!that.isDataload){
						if (that.options.onLoadPosition) that.options.onLoadPosition.call(that, that.selector);
						that.isDataload = true;
						that.showLoading(that.options.loading);
						if(!that.options.loading)
							that.options.loading = true;
					}
				}
			});
		},
		showLoading: function(flag){
			var that = this;
//			if(!that.options.enabled)
//				return;

			if(flag){
				that.selector.parent().append(loading);
			}
			else{
				setTimeout(function(){
					that.selector.parent().find(".loadingBar").remove();
				}, 10);
			}
		},
		appendData: function (stop, html) {
			var that = this;
			if(!that.options.enabled)
				return;

			if(stop){
				//that.scroller.unbind("scroll");
				that.options.enabled = false;
				that.isDataload = false;
				that.showLoading(false);
				return;
			}
			that.selector.append(html);
			that.isDataload = false;
			that.showLoading(false);
		},
		disable: function(){
			this.options.enabled = false;
		},
		enable: function(){
			this.options.enabled = true;
		}
		
	};
	return dynamicDataLoad;
})(window, document);
/* //2015-04-17 추가 (동적 페이지 데이터 처리 클래스 ) */


/* 2015-04-27 2차 팝업 처리 */
/* 팝업 열기 플러그인 */
/* 사용방법
// 대상 Tag Class에 'localEvent' 추가 
$(document).ready(function () {
	// 주요도시 팝업 열기
	$('.majorCity').overlayPanelOpener({
		eventName: "click",					// 이벤트 이름
		dynamicData: true,					// 동적으로 data가 불러와지는 경우 : true
		onBeforeRender: function(that){		// ajax가 call되기 전 호출
			console.log("onBeforeRender")
		},
		onAfterRender: function(that){		// data가 로딩되고 DOM이 만들어진 후
			console.log("onAfterRender")
		},
		onSlideUp: function(that){			// slide up transitions 완료된 후
			console.log("onSlideUp")
		}
	});
});
*/
(function ($) {
	var overlayPanelOpener = function () {
		var defaults = {
				target: "#overlayPanel",
				eventName: "click",
				cover: false,
				dynamicData: false,
				onBeforeRender: function(){return {};},
				onAfterRender: function(){return {};},
				onSlideUp: function(){return {};}
			},
			that = null,

			loadData = function (that, options) {
				options.onBeforeRender.apply(that);
				var url = that.attr("href");
				callAjax(url, function(data){
					$(options.target).html(data);
					var sTop = $(window).scrollTop();
					var winH = window.innerHeight;

					if(!options.cover){
						overlayPanelPos = $(window).scrollTop();
						mask(true, options.target);
					}
					else
						overlayPanelPos02 = $(window).scrollTop();

					var callback = that.attr("data-callback");
					if(callback != "" && callback != undefined){
						callback = callback + "(that)";
						eval(callback);
					}
					
					$(options.target).height(winH).css("min-height", winH).show();

					options.onAfterRender.apply(that);
					setTimeout(function(){
						$(options.target).addClass("slide slideUp").one(ANI_EV, function() {
							if(!options.cover){
								$("#wrap").hide();
							}
							else{
								$("#overlayPanel").hide();
							}
							$(window).scrollTop(0);
							$(options.target).height("auto").addClass("show").removeClass("slideUp slide");

							options.onSlideUp.apply(that);
						});
					}, 50);

					$(options.target + " .closeOverlayPanel").one("click", function(){
						closeOverlayPanel("close", options.target);
					});
				});
			};

		return {
			init: function(options){
				that = $(this);
				options = $.extend({}, defaults, options||{});
				if(options.dynamicData){
					$(document).on(options.eventName, that.selector, function(){
						that = $(this);
						loadData(that, options);
						return false;
					});
				}
				else{
					$(that.selector).click(function(){
						that = $(this);
						loadData(that, options);
						return false;
					});
				}
			}
		};
	}();
	$.fn.extend({
		overlayPanelOpener: overlayPanelOpener.init
	});
})(jQuery);
/* //2015-04-27 2차 팝업 처리 */


/* 2015-04-22 추가 (loading wrap 추가) */
/* 2018-04-19 로딩바 위 안내문구 확장성을 위해 add 추가 */
/* flag : true(loading 출력), false(loading 삭제) */
function loadingMask(flag, add){
	var addMarkup = add || ''
	var html = "<div class='pageLoding'>" + addMarkup + "<span><img src='../images/common/loading_page1.gif' alt=''></span></div>";
	if(flag){
		$("body").append(html);
	}
	else{
		$(".pageLoding").remove();
	}
}


/* 2015-04-22 추가 (좌우측 메뉴 Resize) */
function winResize(){
	var winH = window.innerHeight;
	$("#menuPanel .innerScroller").height(winH);
	$("#userPanel .innerScroller").height(winH);
}
/* //2015-04-22 추가 */


/* 2015-05-04 추가 (alert 레이터 띄우기) */
/* 샘플 코드 */
/*
$(document).ready(function () {
	var type = "alert_01";	// type은 pop_alertstyle.html 페이지를 참고하세요
	var tpl = {"{NAME}": "김길동"};		// 변환할 택스트: {"변경할 문자열 1": "새로운 문자열 1", "변경할 문자열 2": "새로운 문자열 2" ... }
	var msg = new alertMessage(type, tpl, {
		onClickConfirm: function(){		// 확인버튼 클릭했을때 호출
			alert("확인");
			this.hide();
		},
		onClickCancel: function(){		// 취소버튼 클릭했을때 호출
			alert("취소");
			this.hide();
		}
	});
});
*/

var alertMessageUrl = "pop_alertstyle.html";
var alertMessage = (function (window, document) {
	alertMessage = function (type, tpl, options) {
		var that = this;
		that.options = {
			onClickConfirm: null,
			onClickCancel: null
		};
		for (i in options) that.options[i] = options[i];

		callAjax(alertMessageUrl, function(data){
			that.show($(data), type, tpl);
		});
	};
	alertMessage.prototype = {
		tplReplace: function(tpl, data, calback){
			for (key in tpl) {
				data = data.replace(key, tpl[key]);
			}
			calback(data);
		},
		show: function($el, type, tpl){
			var that = this;

			var html = $el.find("#" + type).html();
			that.tplReplace(tpl, html, function(data){
				$("body").append("<div id='alert'>"+data+"</div>");
				setTimeout(function(){
					mask(true, "#alert");
					var alertEl = $("#alert > div");
					var h = alertEl.height();
					$("#alert").css("margin-top", "-" + (h/2) + "px").addClass("show");

					$("#alert .btnConfirm").click(function(){
						if (that.options.onClickConfirm) that.options.onClickConfirm.call(that);
					});
					$("#alert .btnCancel").click(function(){
						if (that.options.onClickCancel) that.options.onClickCancel.call(that);
					});
				}, 10);
			});
		},
		hide: function(){
			$("#alert .btnConfirm").unbind("click");
			$("#alert .btnCancel").unbind("click");
			$("#alert").removeClass("show").one(TRNEND_EV, function() {
				$(this).remove();
			});
			mask(false, "#alert");
		}
	};
	return alertMessage;
})(window, document);
/* //2015-05-04 추가 (alert 레이터 띄우기) */


/* 2015-05-24 추가 
 *  type = alert, confirm 2가지중 하나 
 *  msg = 화면에 보여줄 메세지 text
 *  callback  = 팝업레이어를 닫으 후 수행하려는 action
 * */

function showAlert(type, msg, callback){
	var layerId = "#alert";
	if(type == "alert"){
		if($("#alertBtn_area").hasClass("twoBtnBox")){
			$("#alertBtn_area").removeClass("twoBtnBox");
			$("#alertBtn_area").addClass("oneBtnBox");
		}
		$(".alert_cancelBtn").hide();
		
	}else if ( type == "confirm" ){
		if($("#alertBtn_area").hasClass("oneBtnBox")){
			$("#alertBtn_area").removeClass("oneBtnBox");
			$("#alertBtn_area").addClass("twoBtnBox");
		}
		$(".alert_cancelBtn").show();
		$(layerId + " .alert_cancelBtn").one("click", function(){
			hideAlert();
		});
	}
	$(layerId).show().css("opacity", "0").css("z-index", "10001");
	$(layerId + " .alertMsg").html(msg);
	var h = $(layerId).height();
	$(layerId).css("top", "50%").css("margin-top",  "-" + (h/2) + "px").css("opacity", "1");
	$("body").append("<div class='modalBg2'></div>");
	$(".modalBg2").css("z-index", "10000");

	$(layerId + " .confirm").one("click", function(){
		try{
			callback();
		}
		catch(e){}
	});
}

function hideAlert(){
	$("#alert").hide().css("opacity", "0");
	$("#alert" + " .confirm").unbind("click");
	$("#alert" + " .alert_cancelBtn").unbind("click");
	$(".modalBg2").remove();
}
/* //2015-05-24 추가 */

/* 2015-05-28 추가 */
function bottomBtnPosition(){
	var isOn = false;
	var btnObj = $(".fixSdBtn");
	var scroller = $(window);
	if(btnObj.length == 0)
		return;

	scroller.scroll(function(e){
		var scrollHeight = $(document).height() - 310;
		var scrollPosition = $(window).height() + $(window).scrollTop();
		if ((scrollHeight - scrollPosition) / scrollHeight <= 0) {
			if(!isOn)
				return;

			btnObj.addClass("hide");
			isOn = false;
		}
		else {
			if(isOn)
				return;

			btnObj.removeClass("hide");
			isOn = true;
		}
	});
}
/* //2015-05-28 추가 */

/* 푸터 약관동의 Tab 배튼 클릭 이벤트 */
$(document).on("click", ".scTab03 a", function(){
	$(".scTab03 li.on").removeClass("on");
	$(".scTab_footer").hide();
	var target = $(this).attr("href");
	$(target).show();
	$(this).parent().addClass("on");
});


/* 2015-08-17 추가 (loadingMask 추가) */
/* flag : true(loading 출력), false(loading 삭제) */
function loadingSchMask(flag){
	var agentACode = getCookieValue("agentAdditionalCode");
	var inflowRoute = getCookieValue("inflowRoute");
	var loadClass = ".pageLoding02.bgCp";
	
	if( agentACode != "" || inflowRoute != "" ){
		//제휴채널 랜딩일 경우
		loadClass = "pageLoding02"
	}else{
		//하나투어항공, 닷컴 항공일 경우
		loadClass = "pageLoding02 bgCp"
	}
	
	var html = "<div class='"+loadClass+"'><span><img src='http://image1.hanatour.com/mobile/common/air/airsearch_loading_ani.gif' alt='실시간으로 최저가 항공권 요금을 조회중입니다.'></span></div>";
	if(flag){
		$("body").append(html);
	}
	else{
		$(".pageLoding02").remove();
	}
}

/********************************************************************************************/
/******************************************* wddo *******************************************/
/********************************************************************************************/

$(document).ready(function () {
	initHrefPopup();
	
	initEvent();
	initTopBtn();

    //공통 페이지 로드 슬라이드 팝업 //add 2.0.2
    function initHrefPopup(container) {
        var con = container || $('body'); //add 2.0.9
        var linkTagA = con.find('a.pb_hrefpopup');

        linkTagA.on('click', function (e) {
            var target = $(e.currentTarget);
            var loadURL = $(this).attr('href');
        
            HT.openLoadPop({
                target : target,
                url : loadURL,
                parent : ($('body > div[data-role="page"]').length > 0) ? $('body > div[data-role="page"]') : undefined
                //data-role='page' 인 div 가 팝업 열리면 display:none 처리 의미, 기본값 #wrap //modify 2.1.4
            });

            e.preventDefault();
        });
    }

	//이벤트 초기화
	function initEvent() {
	    try {
	        $(document).on('scroll.freeair', function (e) {
	            try {
	                WDDO.scrollYpos = (document.documentElement.scrollTop !== 0) ? document.documentElement.scrollTop : document.body.scrollTop;

	                WDDO.docWidth = $.documentWidth();      //add 2.1.3
	                WDDO.docHeight = $.documentHeight();    //
	            } catch (e) {}
	        }).triggerHandler('scroll.freeair');

	        $(window).on('resize.freeair', function (e) {
	            if (WDDO.browserWidth === $.windowWidth() && WDDO.browserHeight === $.windowHeight()) return false;

	            WDDO.browserWidth = $.windowWidth();        //modify 2.1.3 $(window).width() -> $.windowWidth()
	            WDDO.browserHeight = $.windowHeight();      //

	            resize();
	        }).triggerHandler('resize.freeair');

	        $('.scrollTop').on('click.freeair', function (e) {
	            $(window).scrollTop(0);
	        });

	    } catch (e) {}
	}

	//홈, 패키지, 국내여행 - 오른 하단 플로팅메뉴 탑버튼
	function initTopBtn() {
	    var topBtn = $('#topBtn01');
	    var quickObj = $('.quickDimBox');

	    if (topBtn.length === 0) return;
	    
	    var footer = $('.newFoot');
	    if (footer.length == 0)  {
	        footer = $('.common_copyright_btmMenu'); // 구버전 Footer
	    }
	    if (footer.length == 0)  {
	        footer = $('#commonArea_footer'); // 통합 Footer
	    }
	    var fHeight = footer.height();
	    var topBtnAreaHeight = /*topBtn.height()*/47 + parseInt(topBtn.css('bottom'));

	    $(window).on('scroll.topbtn', function(e) {
	        $(window).trigger('scroll.freeair');

	        var st = WDDO.scrollYpos;
	        var scrollPosition = $(window).height() + st;

	        //브라우저 높이 + 스크롤위치 > 하단 영역 + 동동이상단부터 여백높이
	        if (st <= 0 || WDDO.browserHeight + st > footer.offset().top + topBtnAreaHeight) {
	            topBtn.removeClass('on');
	            quickObj.removeClass("topPosi");
	        } else {
	            topBtn.addClass('on');
	            quickObj.addClass("topPosi");
	        }
	    });
	}

})

/********************************************************************************************/
/****************************************** Method ******************************************/
/********************************************************************************************/


/*!
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 2.0.7
 * @since : 2015.11.09
 *
 * history
 *
 * 1.2   (2015.12.10) : setNext(), setPrev(), opts.onClass 추가 
 * 1.2.1 (2015.12.11) : getOptions() 추가
 * 1.3   (2016.04.18) : opts.onlyOpen = true 기본값 고정, otps.contentSelector 추가
 * 2.0   (2016.05.16) : init()시 opts.selector 가 없어도 초기화 될수 있도록 수정
 * 2.0.1 (2017.01.25) : addIdx() 1회 최소실행 추가, setNext(), setPrev() idx 반환 수정, opts.repeat 추가
 * 2.0.2 (2017.05.16) : btnListener()에 onClass 삽입 전 상황을 전달할 콜백 함수 opts.onChangeStart 추가
 *                      opts.setCallback 삭제하고 확정성을 위해 opts.getOptions 추가, opts.onChangeParams 삭제
 * 2.0.3 (2017.08.11) : opts.mustClose 추가
 * 2.0.4 (2017.09.01) : opts.onTag 의 자신이 버튼구별 기준을 a 태그를 뿐만아니라 button 도 포함
 *                      setInstance() 적용
 * 2.0.5 (2017.09.05) : ins.getIndex() 추가
 * 2.0.6 (2017.10.23) : opts.event 옵션 추가하여 마우스 오버 컨트롤에 대한 대응
 * 2.0.7 (2018.03.19) : ins.setChange() 추가
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
 *   event:String = 'click.toggle'           //마우스 이벤트명
 *   onTag:String = 'li'                     //on 클래스를 적용 할 태그 셀렉션 String
 *   onClass:String = 'on'                   //on 클래스 명
 *   onlyOpen:Boolean = true                 //비 중복 활성화 유무
 *   mustClose:Boolean = false               //onlyOpen:true에 활성화 클릭시 닫을지 유무
 *   content:Object = $('selector')          //적용할 컨텐츠 jQuery Object
 *   contentSelector:String = ''             //content 에 대한 세부 셀렉터
 *   onChange:Function = fun(event)          //텝 변경 콜백함수
 *   onChangeStart:Function = fun(event)     //텝 변경 직전 콜백함수 
 *   behavior:Boolean = false                //기본 비헤이비어 삭제 유무, 기본은 막음
 *   repeat:Boolean = false                  //setNext(), setPrev() 시 무한 반복 유무
 *
 * method
 *   .setCloseAll()                          //모두 닫기
 *   .setOpen(idx)                           //열기
 *   .setNext()                              //다음 메뉴 활성화
 *   .setPrev()                              //이전 메뉴 활성화
 *   .setChange()                            //해당 메뉴 활성화
 *   .setOptions()                           //옵션 변경
 *   .getOptions()                           //옵션 반환
 *   .getIndex()                             //인덱스 반환
 */
;var WToggle=(function(b){var a=function(r){var p,i,c,e=d(),o=function(s){c=b.extend(e,s);if(c.target.length>0){if(b.fn.setInstance!==undefined){c.target.setInstance(p)}h();q()}};function d(){return{target:b(b.fn),selector:"",event:"click.toggle",onTag:"li",onClass:"on",onlyOpen:true,mustClose:false,behavior:false,repeat:false,content:b(b.fn),contentSelector:"",onChange:undefined,onChangeStart:undefined}}function h(){}function q(){if(c.selector===""){c.target.on(c.event,s)}else{c.target.on(c.event,c.selector,s)}l();function s(w){var v=b(w.currentTarget);l();i=j(c.content,c.contentSelector);var t=parseInt(v.data("toggle-idx"));var u=(c.onTag==="a"||c.onTag==="button")?v:v.closest(c.onTag);if(c.onChangeStart!==undefined){c.onChangeStart.apply(this,[{target:v,idx:t,content:i.eq(t)}])}c.target.trigger("changestart.toggle",[{target:v,idx:t,content:i.eq(t)}]);if(u.hasClass(c.onClass)){if(c.onlyOpen){if(c.mustClose){g(t);n(t)}}else{g(t);n(t)}}else{if(c.onlyOpen){g();n();k(t);f(t)}else{k(t);f(t)}}if(c.onChange!==undefined){c.onChange.apply(this,[{target:v,idx:t,content:i.eq(t)}])}c.target.trigger("change.toggle",[{target:v,idx:t,content:i.eq(t)}]);if(!c.behavior){w.preventDefault();w.stopPropagation()}}}function l(){j(c.target,c.selector).each(function(s){b(this).data("toggle-idx",s)})}function j(t,s){return(s!==""&&s!==undefined)?t.find(s):t}function k(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a"||c.onTag==="button")?u:u.closest(c.onTag);t.addClass(c.onClass)}function g(s){var u=(s===undefined)?j(c.target,c.selector):j(c.target,c.selector).eq(s);var t=(c.onTag==="a"||c.onTag==="button")?u:u.closest(c.onTag);t.removeClass(c.onClass)}function f(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.show()}function n(s){var t=(s===undefined)?j(c.content,c.contentSelector):j(c.content,c.contentSelector).eq(s);t.hide()}function m(s){return Math.max(Math.min(s,j(c.target,c.selector).length-1),0)}return{init:function(s){p=this;o(s)},setCloseAll:function(){g();n()},setOpen:function(s){k(s);f(s)},setNext:function(){var s=parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"));var t=(c.repeat&&s+1>j(c.target,c.selector).length-1)?0:m(s+1);if(!isNaN(s)){j(c.target,c.selector).eq(t).trigger("click.toggle")}},setPrev:function(){var t=parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"));var s=(c.repeat&&t-1<0)?j(c.target,c.selector).length-1:m(t-1);if(!isNaN(t)){j(c.target,c.selector).eq(s).trigger("click.toggle")}},setChange:function(s){if(s!==undefined){j(c.target,c.selector).eq(s).trigger("click.toggle")}},setOptions:function(s){b.extend(c,s)},getOptions:function(){return c},getIndex:function(){return parseInt(j(c.target,c.selector).filter(function(){return b(this).closest(c.onTag).hasClass(c.onClass)}).data("toggle-idx"))}}};return a}(jQuery));


/**
* Swiper 템플릿
*
* @author : Jo Yun Ki (ddoeng@naver.com)
* @version : 1.1.7
* @since : 2016.11.11
*
* history
*   1.0   (2016.11.11) : -
*   1.1.0 (2016.01.18) : verticalMode() 의 > img 를 img로 변경하여 마크업 제약 완화, initSwiper 명 initGallerySwiper 로 변경
*                        resetSwiper() 의 첫번째 인자를 swiperContainer 가 .swiper-container-horizontal 이면 그 하나의 swiper 에 대한 리셋
*                        initFreeSwiper() 의 opts.slidesPerView 기본값 'auto' 로 변경
*   1.1.1 (2017.05.19) : verticalMode 에서 가로형 이미지도 세로정렬 적용토록 수정하고 opts.vertical 생성하여 필요시에만 적용, verticalMode() 간소화
*                        loop, lazy 조합 시 div.swiper-slide-duplicate 에 .swiper-lazy 대상이 .swiper-lazy-loading 상황일때 복제되어 lazy 재로드 못하는 문제 해결 
*                        watchSlidesVisibility:true 기본으로 추가되도록 수정
*   1.1.2 (2017.08.29) : initFreeSwiper에 change 이벤트 확장, orientationchange 이벤트 적용, data.position 추가 하여 이동 포지션 참조 가능
*   1.1.3 (2017.10.25) : transform = 'none' 값 반환시 matrixToArray 함수 오류 방지 
*   1.1.4 (2017.12.08) : next, prev 버튼 기능 부여할 selector 지정(확장) 필요하여 opts.nextSelector, opts.prevSelector 옵션 추가 
*   1.1.5 (2018.03.12) : verticalMode 제거, applyArea() 생성하여 WPreLoad 통하여 'vertical', 'horizontal' 클래스 처리, opts.vertical 를 opts.areaClass 로 변경
*   1.1.6 (2018.04.23) : swiper 라이브러리 4.x.x 대응
*   1.1.7 (2018.06.18) : opts.autoplayDisableOnInteraction 적용(autoplay 시 사용자 인터렉션 이후 계속 재생되도록 기본값 false 설정) 
*
* PUBLIC.method = (function () {return new SwiperTemplate()})(); 
*/
(function(b){if(b.SwiperTemplate!==undefined){return}if(b.WPreLoad===undefined){b.WPreLoad=function(j,g){var m,k=$.extend({},{done:function(){},complete:function(){}},g),h=j.length,d=0,l=[];if(void 0!==j.jquery){j.each(function(c){f(j.eq(c))})}else{for(m in j){f(j[m])}}function f(i){var c=void 0!==i.jquery?i.attr("src"):i;l.push($("<img />").load(function(){d+=1;var n=Math.round(d/h*100);k.done({source:this,element:$(this).data("element"),percent:n}),d===h&&k.complete(l.map(function(o){return o.get(0)}))}).attr("src",c).data("element",i))}}}var a=(function(d){var c=function(){var k,h;var e={};var i=false;function m(t,s){var q=t.container||t.$el;var p=q.find(".swiper-pagination > span").length;var o=q.find(".swiper-pagination .swiper-pagination-bullet-active").index();q.find(".swiper-pag-num").html("<span>"+(o+1)+"</span> / "+p);if(e.loop&&e.lazyLoading){q.find(".swiper-slide-visible.swiper-slide-duplicate .swiper-lazy").removeClass("swiper-lazy-loading")}var r=q.find(".swiper-wrapper").css("transform");if(r!==undefined&&r!=="none"&&d.isArray(g(r))&&r.length>5){t.position={x:parseInt(g(r)[4])}}if(e.exChange!==undefined){e.exChange(t,s)}}function j(){h.each(function(o){if(d(this).is(".swiper-container-horizontal")){k=d(this)[0].swiper;if(k!==undefined){k.destroy(false,true)}}})}function l(o){var p=d(o);var q=p.find("img");var r=new WPreLoad(q,{done:function(v){var u=v.source;var s=d(u).data("element");var t=s.closest("."+e.areaClass);t.removeClass("vertical horizontal");if(u.width<u.height){t.addClass("vertical")}else{if(u.width>u.height){t.addClass("horizontal")}}}})}function n(p){var o=p.container;var q=(d(window).width()/9)*16;o.find(".swiper-container .swiper-slide").css("height",q*0.32);o.find(".swiper-container .swiper-slide img").css("height",q*0.32)}function g(o){return o.split("(")[1].split(")")[0].split(",")}function f(o){o.on={lazyImageLoad:o.onLazyImageReady,transitionStart:o.onTransitionStart,sliderMove:o.onSliderMove,slideChangeTransitionStart:o.onSlideChangeStart,transitionEnd:o.onTransitionEnd,init:o.onInit};o.lazy=o.lazyLoading;o.loadPrevNext=o.lazyLoadingInPrevNext;if(o.pagination.length>0){o.pagination={el:".swiper-pagination"}}if(o.autoplay.length>0){o.autoplay={disableOnInteraction:o.autoplayDisableOnInteraction}}return o}return{initGallerySwiper:function(p,o){var q;h=p;j();if(h.find(".swiper-slide").length===1){h.find(".swiper-pagination").hide()}h.each(function(r){q={viewport:false,areaClass:undefined,pagination:d(this).find(".swiper-pagination"),loop:((d(this).find(".swiper-slide").length>1)?true:false),preloadImages:false,watchSlidesVisibility:true,lazyLoadingInPrevNext:true,lazyLoading:true,autoplayDisableOnInteraction:false,onLazyImageReady:function(x,w,v){var u=(x!==undefined)?x:this;var s=(x!==undefined)?d(w):d(x);var t=(x!==undefined)?d(v):d(w);if(e.areaClass&&!s.hasClass("vertical")&&!s.hasClass("horizontal")&&s.find("."+e.areaClass).length>0){l(s)}},onSlideChangeStart:function(s){var t=s||this;m(t,"onSlideChangeStart")},onSliderMove:function(s){var t=(s.type===undefined)?s:s.target.closest(".swiper-container").swiper;m(t,"onSliderMove")},onTransitionEnd:function(s){var t=s||this;m(t,"onTransitionEnd")},onInit:function(t){var u=t!==undefined?t:this;d(window).on("orientationchange",function(){setTimeout(function(){m(u,"orientationchange")},50)});m(u,"onInit");if(!e.lazyLoading&&e.preloadImages&&e.areaClass){var s;d(u.slides).each(function(){s=d(this);if(e.areaClass&&!s.hasClass("vertical")&&!s.hasClass("horizontal")&&s.find("."+e.areaClass).length>0){l(s)}})}if(e.viewport){n(u)}},prevSelector:"a.big5_prev",nextSelector:"a.big5_next"};e=d.extend({},q,o);if(Swiper.prototype.init!==undefined){e=f(e)}k=new Swiper(d(this),e)});h.find(e.prevSelector).on("click.swipertemplate",function(u){var t=d(u.currentTarget);var r=t.closest(".swiper-container")[0].swiper;r.slidePrev();m(r);u.preventDefault()});h.find(e.nextSelector).on("click.swipertemplate",function(u){var t=d(u.currentTarget);var r=t.closest(".swiper-container")[0].swiper;r.slideNext();m(r);u.preventDefault()})},initFreeSwiper:function(q,o){h=q;j();var p;var r={areaClass:undefined,pagination:h.find(".swiper-pagination"),slidesPerView:"auto",spaceBetween:0,freeMode:true,roundLengths:true,preloadImages:false,watchSlidesVisibility:true,lazyLoadingInPrevNext:true,lazyLoading:true,onLazyImageReady:function(x,w,v){var u=(x!==undefined)?x:this;var s=(x!==undefined)?d(w):d(x);var t=(x!==undefined)?d(v):d(w);if(e.areaClass&&!s.hasClass("vertical")&&!s.hasClass("horizontal")&&s.find("."+e.areaClass).length>0){l(s)}},onTransitionStart:function(s){var t=s||this;if(p!==undefined){clearInterval(p);p=undefined}p=setInterval(function(){m(t,"onTransitionStart")},10)},onSliderMove:function(s){var t=(s.type===undefined)?s:s.target.closest(".swiper-container").swiper;m(t,"onSliderMove")},onTransitionEnd:function(s){var t=s||this;if(p!==undefined){clearInterval(p);p=undefined}},onInit:function(t){var u=t!==undefined?t:this;d(window).on("orientationchange",function(){setTimeout(function(){m(u,"orientationchange")},50)});m(u,"onInit");if(!e.lazyLoading&&e.preloadImages&&e.areaClass){var s;d(u.slides).each(function(){s=d(this);if(e.areaClass&&!s.hasClass("vertical")&&!s.hasClass("horizontal")&&s.find("."+e.areaClass).length>0){l(s)}})}}};h.each(function(s){e=d.extend({},r,o);if(Swiper.prototype.init!==undefined){e=f(e)}k=new Swiper(d(this),e)})},resetSwiper:function(o){h=(o.hasClass("swiper-container-horizontal"))?o:o.find(".swiper-container-horizontal");h.each(function(){k=d(this)[0].swiper;if(k!==undefined){k.destroy(false,true);new Swiper(k.container,k.params)}})}}};return c}(jQuery));b.SwiperTemplate=a})(window);

//DOCOM (common_new.js ver 2.1.8)
!function(o){if(void 0!==o.DOTCOM||void 0!==o.HT)return void 0===o.HT&&(o.HT=o.DOTCOM),void(void 0===o.DOTCOM&&(o.DOTCOM=o.HT));if(void 0===o.ANI_EV){var e=document.createElement("div").style,t=function(){for(var o="t,webkitT,MozT,msT,OT".split(","),t=0,i=o.length;t<i;t++)if(o[t]+"ransform"in e)return o[t].substr(0,o[t].length-1);return!1}();o.ANI_EV=function(){if(!1===t)return!1;return{"":"webkitAnimationEnd",webkit:"webkitAnimationEnd",Moz:"AnimationEnd",O:"oAnimationEnd",ms:"MSAnimationEnd"}[t]}()}var i={isBlockingHash:!1,setMask:function(o,e,t){var i=$.extend({},{parent:$("body .ui-page")},t);o?"#overlayPanel"!==e&&(i.parent.append('<div id="mask" class="mask"></div>'),void 0!==e&&WDDO.setDisableEvent(e.find(".innerScroller"))):($("#mask").remove(),WDDO.setEnableEvent($("body")))},openSlidePop:function(o,e){var t=$.extend({source:$(jQuery.fn),parent:$("#wrap"),browserHeight:WDDO.browserHeight},e);if(void 0!==o){var i=o;t.source.length>0&&i.html(t.source.html()),t.parent.attr("data-parenttop",$(window).scrollTop()),setTimeout(function(){i.addClass("slide slideUp").on(ANI_EV+".dotcom",function(o){t.parent.hide(),$(window).scrollTop(0),i.css("height","auto").addClass("show").removeClass("slideUp slide").off(ANI_EV+".dotcom"),n(i,!1),a(i,!1),r(i,!1),i.trigger("open.slidepop",t)}),n(i,!0),a(i,!0),r(i,!0)},50)}},closeSlidePop:function(o,e){var t=$.extend({parent:$("#wrap"),remove:!1},e);if(void 0!==o){var i=o;i.attr("data-scrolltop",$(window).scrollTop()),t.parent.show(),i.css("height",WDDO.browserHeight).addClass("slide slideDown").on(ANI_EV+".dotcom",function(){n(i,!1),a(i,!1),l(i,t.parent,!1),i.attr("style","").removeClass("slideDown slide show").off(ANI_EV+".dotcom"),i.trigger("close.slidepop",t),(t.remove||"overlayPanel"!==i.attr("id"))&&i.remove()}),n(i,!0),a(i,!0),l(i,t.parent,!0),i.off("click.closeBtn")}},openLoadPop:function(o){if(!i.isBlockingHash){var e,t,a,n={class:"slidepopup",url:void 0,effect:"slide"},r=$.extend({},n,o);$.ajax({type:"GET",url:r.url,dataType:"text",success:function(o){var n,l;t=o,a=$("."+r.class).not(":hidden").filter(":last"),e=$("#overlayPanel"+(0===a.length?"":a.length)).length>0?$("#overlayPanel"):$('<div id="overlayPanel'+(0===a.length?"":a.length)+'" class="'+r.class+'">'),r.remove&&$("."+r.class).not("#overlayPanel").remove(),$("body").append(e),n=r.url,l=e.attr("data-url"),n!==l&&e.removeAttr("data-scrolltop"),e.attr("data-url",n),void 0!==t&&e.html(t),e.on("click.closeBtn",".closeOverlayPanel",function(o){if($(o.currentTarget),"slide"===r.effect&&i.closeSlidePop(e,r),void 0!==e.attr("data-oldpop")){var t=$("#"+e.attr("data-oldpop"));t.length>0&&(t.addClass("show"),r.parent.hide(),i.isBlockingHash=!0,location.hash="#"+t.attr("data-url"),setTimeout(function(){i.isBlockingHash=!1},50))}else location.hash="#";e.trigger("close.loadpop",r)}),a.length>0&&(e.attr("data-oldpop",a.attr("id")),e.one(ANI_EV+".dotcom",function(o){a.removeClass("show")})),"slide"===r.effect&&i.openSlidePop(e,r),e.trigger("open.loadpop",r)},error:function(o,e,t){}})}},locationHashChanged:function(){var o=$(".slidepopup[data-url]").not(":hidden");if(window.location.hash.length>1){var e=window.location.hash.substring(1);if(o.length>0&&o.attr("data-url")===e)return!1;void 0!==i&&void 0!==i.openLoadPop&&i.openLoadPop({target:$(document.activeElement),url:e,parent:$(document.querySelector("body > #wrap")),remove:!0})}else o.filter(":last").find(".closeOverlayPanel").trigger("click.closeBtn")}};function a(o,e){if(o.height()>=WDDO.browserHeight)if(e){var t,i=o.find("div[data-fixedfix]").filter(function(){return"fixed"===$(this).css("position")}),a=parseInt(o.attr("data-scrolltop"))||0;i.each(function(){t=$(this).offset().top,$(this).css({position:"absolute",top:o.hasClass("slideUp")?t-WDDO.browserHeight-$(window).scrollTop()+a:t})}).addClass("slidePop-fixed").removeAttr("data-fixedfix")}else o.find(".slidePop-fixed").css({position:"",top:""}).removeClass("slidePop-fixed").attr("data-fixedfix")}function n(o,e){o.height()>=WDDO.browserHeight&&(e?o.css({height:WDDO.browserHeight,"overflow-y":"auto"}):o.css({height:"auto","overflow-y":""}))}function r(o,e){var t=o.attr("data-scrolltop");void 0!==t&&(e?o.scrollTop(t):($(window).scrollTop(t),o.removeAttr("data-scrolltop")))}function l(o,e,t){var i=e.attr("data-parenttop");void 0!==i&&(t?(o.scrollTop($(window).scrollTop()),setTimeout(function(){$(window).scrollTop(i)},1)):e.removeAttr("data-parenttop"))}o.HT=o.DOTCOM=i}(window);

//WDDO ver 1.1.1
!function(a){if(void 0===a.WDDO){var b={browserWidth:0,browserHeight:0,docWidht:0,docHeight:0,scrollYpos:void 0,setEnableEvent:function(a){var b=void 0===a?$("body"):a;void 0!==b.data("overflowY")&&b.css({"overflow-y":b.data("overflowY")}).removeData("overflowY"),b.off("touchstart.WDDO touchmove.WDDO")},setDisableEvent:function(a,b){function f(a){return a.prop("scrollHeight")-a.prop("clientHeight")}function g(a){return a.scrollTop()}function h(a){var a="object"==typeof a?a:$(a),b=f(a),c=g(a);return b-c}var d,c=0,e=void 0===b?$("body"):b;"hidden"!==e.css("overflow-y")&&(e.data({overflowY:e.css("overflow-y")}).css({"overflow-y":"hidden"}),e.on("touchstart.WDDO",function(b){var e=b.originalEvent.touches[0]||b.originalEvent.changedTouches[0],f=$(b.target),g=f.closest(a).length>0;c=e.pageY,d=g?$(a):void 0}),e.on("touchmove.WDDO",function(a){if(void 0!==d){var b=a.originalEvent.touches[0]||a.originalEvent.changedTouches[0],e=b.pageY-c,f=h(d),i=g(d);e>0&&i<=0?a.cancelable&&a.preventDefault():e<0&&f<=0&&a.cancelable&&a.preventDefault()}else a.cancelable&&a.preventDefault()}))}};a.WDDO=b}}(window);

//get instance
void 0===$.fn.getInstance&&($.fn.getInstance=function(){return this.data("scope")}),void 0===$.fn.setInstance&&($.fn.setInstance=function(e){function a(e){var a=!1;for(var i in t)if(i===e){a=!0;break}return a}function i(e){return void 0!==e?e.substr(e.lastIndexOf(".")+1):void 0}var n=this.data("scope")||void 0;if(void 0===n)this.data("scope",e);else{var t,o=i(e["package"]),s={};if(void 0!==n["package"])t={},t[i(n["package"])]=n,t[o]=e;else if(t=this.data("scope"),a(o)){var c=t[o];$.isPlainObject(c)&&(t[o]=[c]),$.isArray(t[o])&&t[o].push(e)}else void 0!==e["package"]&&(s[o]=e),$.extend(t,s);this.data("scope",t)}}),void 0===$.fn.removeInstance&&($.fn.removeInstance=function(e,a){var i=this.data("scope")||void 0;if(void 0!==i&&void 0!==e)if(void 0!==i["package"])this.removeData("scope");else if(void 0===i["package"]&&void 0!==i[e]){var n=i[e];void 0!==a&&$.isArray(n)&&n.length>a?(n.splice(a,1),1===n.length&&(i[e]=n[0])):delete i[e]}}),void 0===$.fn.searchInstance&&($.fn.searchInstance=function(e,a){var i,n=this.data("scope")||void 0;return void 0!==n&&void 0!==e&&(void 0!==n["package"]&&n["package"].split(".").pop()===e?i=n:void 0===n["package"]&&void 0!==n[e]&&(i=n[e],void 0!==a&&$.isArray(i)&&i.length>a&&(i=i[a]))),i});

//https://github.com/hashchange/jquery.documentsize#window-size
(function(g){var k,F,l,x,h,q=!!window.getComputedStyle;g.documentWidth=function(H){var I;H||(H=document);try{if(x===undefined){D()}I=H[x].scrollWidth}catch(J){I=s("Width",H)}return I};g.documentHeight=function(I){var H;I||(I=document);try{if(x===undefined){D()}H=I[x].scrollHeight}catch(J){H=s("Height",I)}return H};g.windowWidth=function(H,I){var e=v(arguments);return y("Width",e)};g.windowHeight=function(H,I){var e=v(arguments);return y("Height",e)};g.pinchZoomFactor=function(e){return j(e)};g.scrollbarWidth=C;function y(P,J){var Q,M,I,N,L,S,e=J.window,H=C()!==0,O=J.useLayoutViewport&&P==="Width",K=H||!t()||O,R=K?e.document.documentElement["client"+P]:w(P,e);if(J.useLayoutViewport&&!K){M=R;I=j(e,{asRange:true});R=Math.round(M*I.calculated);if(!c()){Q=e.document.documentElement.clientHeight;L=(M-1)*I.min;S=(M+1)*I.max;N=(R<=Q+3&&R>=Q-3)||(L<=Q&&S>=Q&&S<Q+30);if(N){R=Q}}}return R}function j(N,e){var M,I,H=e&&e.asRange,K=(N||window).visualViewport&&(N||window).visualViewport.scale,L={calculated:K||1,min:K||1,max:K||1},J=C()!==0||!t()||K;if(!J){N||(N=window);M=N.document.documentElement.clientWidth;I=G(N);L.calculated=M/I;if(H){if(c()){L.min=L.max=L.calculated}else{L.min=M/(I+1);L.max=M/(I-1)}}}return H?L:L.calculated}function v(J){var e,I,H,L=window,K=true;if(J&&J.length){J=Array.prototype.slice.call(J);e=A(J[0]);if(!e){J[0]=E(J[0])}I=!e&&J[0];if(!I){J[1]=E(J[1])}H=!I&&J[1];if(e){L=J[0];if(H&&J[1].viewport){K=f(J[1].viewport)}}else{if(I){if(J[0].viewport){K=f(J[0].viewport)}if(A(J[1])){L=J[1]}}else{if(!J[0]&&J[1]){if(H&&J[1].viewport){K=f(J[1].viewport)}else{if(A(J[1])){L=J[1]}}}}}}return{window:L,useVisualViewport:K,useLayoutViewport:!K}}function f(H){var e=n(H)&&H.toLowerCase();if(H&&!e){throw new Error("Invalid viewport option: "+H)}if(e&&e!=="visual"&&e!=="layout"){throw new Error("Invalid viewport name: "+H)}return e==="visual"}function E(e){return(n(e)&&e!=="")?{viewport:e}:e}function t(){if(F===undefined){F=G()>10}return F}function C(){var e;if(k===undefined){e=document.createElement("div");e.style.cssText="width: 100px; height: 100px; overflow: scroll; position: absolute; top: -500px; left: -500px; margin: 0px; padding: 0px; border: none;";document.body.appendChild(e);k=e.offsetWidth-e.clientWidth;document.body.removeChild(e)}return k}function D(){var J,I,M,H,K=B(),e=K&&K.contentDocument||document,L=e.body,N=e!==document;I=e.createElement("div");I.style.cssText="width: 1px; height: 1px; position: relative; top: 0px; left: 32000px;";if(!N){J=d()}M=L.scrollWidth;L.appendChild(I);H=M!==L.scrollWidth;L.removeChild(I);if(!N){p(J)}x=H?"documentElement":"body";if(K){document.body.removeChild(K)}}function B(){var H=document.createElement("iframe"),e=document.body;H.style.cssText="position: absolute; top: -600px; left: -600px; width: 500px; height: 500px; margin: 0px; padding: 0px; border: none; display: block;";H.frameborder="0";e.appendChild(H);H.src="about:blank";if(!H.contentDocument){return}H.contentDocument.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title></title><style type="text/css">html, body { overflow: hidden; }</style></head><body></body></html>');return H}function d(){var H,M,Q=document.documentElement,K=document.body,L=q?window.getComputedStyle(Q,null):Q.currentStyle,O=q?window.getComputedStyle(K,null):K.currentStyle,I=(L.overflowX||L.overflow||"visible").toLowerCase(),P=(O.overflowX||O.overflow||"visible").toLowerCase(),J=P!=="hidden",N=I==="visible",e={documentElement:{modified:N},body:{modified:J}};if(N){H=Q.style;e.documentElement.styleOverflowX=H.overflowX;H.overflowX="auto"}if(J){M=K.style;e.body.styleOverflowX=M.overflowX;M.overflowX="hidden"}return e}function p(e){if(e.documentElement.modified){document.documentElement.style.overflowX=e.documentElement.styleOverflowX}if(e.body.modified){document.body.style.overflowX=e.body.styleOverflowX}}function s(I,e){var H=e.documentElement;return Math.max(H.body["scroll"+I],e["scroll"+I],H.body["offset"+I],e["offset"+I],e["client"+I])}function G(e){return w("Width",e)}function i(e){return w("Height",e)}function w(H,I){var e=(I||window).visualViewport?(I||window).visualViewport[H.toLowerCase()]:(I||window)["inner"+H];if(e){a(e)}return e}function a(e){if(!l&&b(e)){l=true}}function c(){return !!l}function A(e){return e!=null&&e.window==e}function n(e){return typeof e==="string"||e&&typeof e==="object"&&Object.prototype.toString.call(e)==="[object String]"||false}function o(H){var e=typeof H==="number"||H&&typeof H==="object"&&Object.prototype.toString.call(H)==="[object Number]"||false;return e&&H===+H}function b(e){return e===+e&&e!==(e|0)}function m(){var H,e;if(h===undefined){h=false;H=navigator&&navigator.userAgent;if(navigator&&navigator.appName==="Microsoft Internet Explorer"&&H){e=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");if(e.exec(H)!=null){h=parseFloat(RegExp.$1)}}}return h}function u(){var e=m();return e&&e<8}function r(){return m()===9}if(typeof g==="function"&&!u()&&!r()){try{g(function(){if(x===undefined){D()}C()})}catch(z){}}}(typeof jQuery!=="undefined"?jQuery:typeof Zepto!=="undefined"?Zepto:$));
