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

	/* 우측메뉴 열기 */
	/*
	$("#btnMyhome").click(function(){
		mask(true, "#userPanel");
		var winH = window.innerHeight;
		$("#userPanel .innerScroller").height(winH);
		$("#userPanel").addClass("slideIn");
		$("#wrap").addClass("slideRight");

		/* 우측메뉴 닫기 /
		$("#mask").one("click", function(){
			$("#userPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideRight");
			mask(false, "#userPanel");
		});
		return false;
	});
	*/
	/* 우측메뉴 열기 */
	/*
	$("#btnMyhome").click(function(){
		mask(true, "#userPanel");
		var winH = window.innerHeight;
		$("#userPanel .innerScroller").height(winH);
		$("#userPanel").addClass("slideIn");
		$("#wrap").addClass("slideRight");

		//우측메뉴 닫기 
		$("#mask").one("click", function(){
			$("#userPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideRight");
			mask(false, "#userPanel");
		});
		return false;
	});
	*/
	
	/* 우측메뉴 열기 event bind를 id 에서 class 로 변경 */
	$(".rightMenu_btn").click(function(){
		mask(true, "#userPanel");
		var winH = window.innerHeight;
		$("#userPanel .innerScroller").height(winH);
		$("#userPanel").addClass("slideIn");
		$("#wrap").addClass("slideRight");

		/* 우측메뉴 닫기 */
		$("#mask, .closeSlide").one("click", function(){ // 20150526 .closeSlide 추가 
			$("#userPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideRight");
			mask(false, "#userPanel");
		});
		return false;
	});

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

/* 팝업 닫기 */
/* 2015-04-27 2차 팝업 처리 */
function closeOverlayPanel(state, target){
	var winH = window.innerHeight;
	if(target == "" || target == undefined)
		target = "#overlayPanel";

	$(target).height(winH).addClass("slide");

	if(target == "#overlayPanel") {
		$("#wrap").show();
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
	else if(mode == "range3"){
		$(".oneType").hide();
		$(".twoType").hide();
		$(".threeType").show();
		$(".datepickerTit .tit").text("출국/중간/귀국일 선택");
	}
	else{
		$(".oneType").show();
		$(".twoType").hide();
		$(".threeType").hide();
		$(".datepickerTit .tit").text("출국일 선택");
	}

	//귀국미정 선택
	$("#overlayPanel .daylabel .redCheck").click(function(){
		var ck = $(this).is(":checked");
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
			if(oldDateMode == "range"){	
				 eDate = mDate;
				 mDate = "";
			}
			$("#detepicker-form input[name=dateS]").attr("value", sDate)
			$("#detepicker-form input[name=dateM]").attr("value", mDate)
			$("#detepicker-form input[name=dateE]").attr("value", eDate)
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
/* flag : true(loading 출력), false(loading 삭제) */
function loadingMask(flag){
	var html = "<div class='pageLoding'><span><img src='../images/common/loading_page1.gif' alt=''></span></div>";
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


/* 2015-05-24 추가 */
function showAlert(id, msg, callback){
	id = "#" + id;
	$(id).show().css("opacity", "0").css("z-index", "10001");
	$(id + " .alertMsg").text(msg);
	var h = $(id).height();
	$(id).css("top", "50%").css("margin-top",  "-" + (h/2) + "px").css("opacity", "1");
	$("body").append("<div class='modalBg'></div>");
	$(".modalBg").css("z-index", "10000");

	$(id + " .confirm").one("click", function(){
		try{
			callback();
		}
		catch(e){}
	});
}

function hideAlert(id){
	id = "#" + id;
	$(id).hide().css("opacity", "0");
	$(id + " .confirm").unbind("click");
	$(".modalBg").remove();
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
