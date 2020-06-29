var innerScroller = ".innerScroller";
var dblTap = false;
var ics = false;
/* 2015-04-22 */
var windowW = 0;
/* //2015-04-22 */


/**
 * string utils start 
 */
//trim string
String.prototype.trim = function(){
	return this.replace(/(^\s*)|(\s*$)/gi, "");
}

// replace all
String.prototype.replaceAll = function(str1, str2){
	var temp_str = "";
	if (this.trim() != "" && str1 != str2){
		temp_str = this.trim();
		while (temp_str.indexOf(str1) > -1){
			temp_str = temp_str.replace(str1, str2);
		}
	}
	return temp_str;
}
//replace all
String.prototype.replaceAll = function(str1, str2){
	var temp_str = "";
	if (this.trim() != "" && str1 != str2){
		temp_str = this.trim();
		while (temp_str.indexOf(str1) > -1){
			temp_str = temp_str.replace(str1, str2);
		}
	}
	return temp_str;
}

// startsWith
if ( typeof String.prototype.startsWith != 'function' ) {
	String.prototype.startsWith = function( str ) {
		return str.length > 0 && this.substring( 0, str.length ) === str;
	}
};

// endsWith
if ( typeof String.prototype.endsWith != 'function' ) {
	String.prototype.endsWith = function( str ) {
		return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
	}
};


$(function() {
	topBtnPosition();
});

$(document).ready(function () {
	//@wddo 퍼블 오류 방지용 추가
	if (window.isApp === undefined) window.isApp = '';
	if (window.isIos === undefined) window.isIos = '';
	if (window.isAndroid === undefined) window.isAndroid = '';

	/* 2015-05-20 */
	ics = isICS();
	/* //2015-05-20 */

	/* 2015-04-22  */
	$(window).resize(function(){
		if(windowW == $(window).width())
			return;

		windowW = $(window).width();
		winResize();
	});
	/* //2015-04-22  */

	/* //2016-05-24 삭제 common_new 에서 컨트롤
	$(".scrollTop").click(function(){
		moveScrollTop();
	});
	*/

	$("#btnMenu").click(function(){
		mask(true, "#menuPanel");
		var winH = window.innerHeight;
		$("#menuPanel .innerScroller").height(winH);
		$("#menuPanel").addClass("slideIn");
		$("#wrap").addClass("slideLeft");

		$("#mask, .closeSlide").one("click", function(){
			$("#menuPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideLeft");
			mask(false, "#menuPanel");
		});
		return false;
	});

	$("#btnMyhome").click(function(){
		mask(true, "#userPanel");
		var winH = window.innerHeight;
		$("#userPanel .innerScroller").height(winH);
		$("#userPanel").addClass("slideIn");
		$("#wrap").addClass("slideRight");
		
		// GET MILEAGE INFO
		/*
		var mileageSign = "<img src=\"/static/images/common/img_mailbig.png\" valign=\"middle\" alt=\"마일리지\"/></span>"
		if (isLogin=="Y")	{
			$.ajax({
				url: "/user/mileage.hnt",
				type: "POST",
				dataType: "json",
				success: function(data) {
					$("#currentMileage").html(data.CURRENT+mileageSign);
					$("#totalMileage").html(data.TOTAL+mileageSign);
				}	
			});
		} */

		$("#mask, .closeSlide").one("click", function(){
			$("#userPanel").removeClass("slideIn");
			$("#wrap").removeClass("slideRight");
			mask(false, "#userPanel");
		});
		return false;
	});
	
	$("#backBtn").click(function(){
		history.go(-1);
	});
	
	if (isApp == "N" && noMoreAppRecommendTop != "Y" && inputDv=="MDA") {
		$('#header').addClass('tBanTy');
		$('#gnb').addClass('tBanTy');
		var headerMargin = $('#header_margin_div').attr('class');
		if( headerMargin.indexOf('02') > -1 ){
			$('#header_margin_div').addClass('headerMargin04');
		} else if(headerMargin.indexOf('05') > -1 ){ // 호텔
			$('#header_margin_div').addClass('headerMargin06');
			$('#hotelSubNavigation').addClass('tBanTy');
		} else {
			$('#header_margin_div').addClass('headerMargin03');
		}
		$('#header_margin_div').attr('org_class',headerMargin);
		$('#header_margin_div').removeClass(headerMargin);
		$("#hdInstallBannerLayout").show();
	}

	// LEFT RIGHT BANNER RESIZE
	$("div[id=leftBanner] img").each(function(){
		this.setAttribute("width", "100%");
		$(this).removeAttr('height');
	});
	$("div[id=rightBanner] img").each(function(){
		this.setAttribute("width", "100%");
		$(this).removeAttr('height');
	});

	if (isApp == "Y") {
		$("div[id=leftBanner] a").each(function(){
			var url = this.getAttribute("href");
			if( url.indexOf('javascript:') == -1 ){
				this.setAttribute("href", "javascript:banner('"+url+"');");
			}
		});
		$("div[id=rightBanner] a").each(function(){
			var url = this.getAttribute("href");
			if( url.indexOf('javascript:') == -1 ){
				this.setAttribute("href", "javascript:banner('"+url+"');");
			}
		});
	}
	try {
		initHanaCodeOfWiseLog();
	} catch (e) {}
});

function attachFastClick() {
	FastClick.attach(document.getElementById("header"));
	FastClick.attach(document.getElementById("menuPanel"));
	FastClick.attach(document.getElementById("userPanel"));
	FastClick.attach(document.getElementById("topBtn01"));
}

/* 2015-04-21 */
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
/* //2015-04-21 */

function disableTouchEvent(el) {
	var isScroller = false;
	var startY = 0;
	var direction = "";
	var target;
	el = el.replace("#", "");

	$('body').on({
		touchstart: function(e) {
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			startY = touch.pageY;
		
			var t = $(e.target);
			var flag = getParent(t, el);
			target = el;
			isScroller = false;
			if(flag){
				isScroller = true;
				target = $("#"+target+" .innerScroller");
			}
		},
		touchmove: function(e) {
			if(!isScroller){
				e.preventDefault();
				return false;
			}

			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			var deltaY = touch.pageY - startY;
			var absDistY = m.abs(deltaY);
			if(absDistY < 4){
				return false;
			}

			var max = maxScrollPos(target);
			var pos = getScrollPositions(target);

			if(deltaY > 0 && pos <= 0 ){
				direction = "up";
				e.preventDefault();
				return false;
			}
			else if(deltaY < 0 && max <= 0){
				direction = "down";
				e.preventDefault();
				return false;
			}
		}
	});
}

function getParent(el, id){
	while(true){
		el = el.parent();
		if(el.length > 0){
			if(el.attr("id") == id){
				return true;
				break;
			}
		}
		else{
			return false;
			break;
		}
	}
}
/* 2015-05-07 ( sub page scroll ) */
function topBtnPosition(){
	var isOn = false;
	var isMain = $("#mainSlider").size() > 0 ? true : false;
	var topObj = $("#topBtn01");
	var quickObj = $(".quickDimBox");
	var scroller = $(window);

	if(topObj.length == 0)
		return;
	var footer = $(".newFoot");
	var fHeight = footer.height();
	var scrollHeight = $(document).height() - 100	;

	scroller.scroll(function(e){
		var t = scroller.scrollTop();
		var scrollPosition = $(window).height() + t;
		if ((scrollHeight - scrollPosition) / scrollHeight <= 0 || t == 0) {
			if(!isOn)
				return;
			topObj.removeClass("on");
			quickObj.removeClass("topPosi");
			isOn = false;
		}
		else {
			if(isOn)
				return;
			topObj.addClass("on");
			quickObj.addClass("topPosi");
			isOn = true;
		}
	});
}
/* //2015-05-07 ( sub page scroll ) */

function enableTouchEvent(el) {
	$('body').off("touchstart touchmove");
}

function isICS(){
	var agent = navigator.userAgent;
	var index = agent.indexOf('Android');
	var and_v = agent.substr(index+8,3);
	/* 2015-05-20 */
	if(and_v == "4.1" || and_v == "4.2" || and_v == "4.3"){
		$("body").addClass("nonTrans");
		return true;
	}
	/* //2015-05-20 */
	return false;
}

function moveScrollTop(){
	var isMain = $("#mainSlider").size() > 0 ? true : false;
	if(isMain)
		scroller = currentScroller.find(".scrollArea");
	else
		scroller = $(window);

	scroller.scrollTop(0);
}

/* 2015-04-22  Resize) */
function winResize(){
	var winH = window.innerHeight;
	$("#menuPanel .innerScroller").height(winH);
	$("#userPanel .innerScroller").height(winH);
}
/* //2015-04-22 */

/***
 * ajax ȣ�� function �� start
 */
function ajaxCall(url, data, callback,opAsync, opDataType, opType){
	var networkFlag = false;
	var reqTimeout;
	isLoad = true;
	if( opType == undefined || opType == null || opType == '' ){
		opType = 'POST';
	}
	if( opAsync == undefined || opAsync == null || opAsync == '' ){
		opAsync = true;
	}
	if( opDataType == undefined || opDataType == null || opDataType == '' ){
		opDataType = 'text';
	}		

	$.ajax({
		type: opType,
		url: url,
		async: opAsync,
		dataType: opDataType,
		data : data,
		contentType : 'application/json; charset=utf-8',
		beforeSend: function(){
		},
		success: function(data){
			if( data != null && data != undefined && data != '' && typeof data == 'string'){
				if(data.substring(0,1) == '{' ){
					data = JSON.parse(data);
					if( data.d != undefined){
						data = JSON.parse(data.d);
					}
				}else if( data.indexOf('<?xml') > -1 && data.indexOf('<string xmlns') > -1){
					var xmlDocument = $.parseXML(data);
					var xmlObj = $(xmlDocument);
				    var string = xmlObj.find("string");
					var jsonData = string.text();
					data = JSON.parse(jsonData.replace(/[\n\t]/g,''));
				}
			}
			if(callback){
				callback(data); 
			}
		},
		error: function(xhr, option, error){
		}
	});
}

function sendRequest(url,data,handler){
	if(url.indexOf("http://") > -1 || url.indexOf("https://") > -1){
		//alert(url);
	}else{
		if( mobileWebserviceDomain == undefined || mobileWebserviceDomain == null || mobileWebserviceDomain == '' ){
			mobileWebserviceDomain = 'http://mwebservice.hanatour.com/';
		}

		if(url.indexOf("/") == 0)
			url = mobileWebserviceDomain + url;	// mobileWebserviceDomain --> http://mwebservice.hanatour.com
		else
			url = mobileWebserviceDomain + "/" + url;	// mobileWebserviceDomain --> http://mwebservice.hanatour.com
	}
	ajaxCall(url,data,handler);
}
function sendRequestHtmlContent(url,data,handler){
	if(url.indexOf("http://") > -1 || url.indexOf("https://") > -1){
		//alert(url);
	}else{
		if( mobileWebserviceDomain == undefined || mobileWebserviceDomain == null || mobileWebserviceDomain == '' ){
			mobileWebserviceDomain = 'http://mwebservice.hanatour.com/';
		}
		if(url.indexOf("/") == 0)
			url = mobileWebserviceDomain + url;	// mobileWebserviceDomain --> http://mwebservice.hanatour.com
		else
			url = mobileWebserviceDomain + "/" + url;	// mobileWebserviceDomain --> http://mwebservice.hanatour.com
	}
	ajaxCall(url,data,handler,true,'html','POST');
}
/***
 * ajax ȣ�� function �� end
 */

 //from common_ui.js
/************************************/
/*	DATA STORAGE OF SESSION	STORAGE	*/
/************************************/
// set data
function setData(key, value){
	sessionStorage.setItem(key, value);
}

// get data
function getData(key){
	var data = sessionStorage.getItem(key);
	if(data == null)
		data = "";

	return data;
}

// remove data
function removeData(key){
	try {
		sessionStorage.removeItem(key);
	} catch (e) {}
}

// clear data
function clearData(){
	try {
		sessionStorage.clear();
	} catch (e) {}
}

// html string 중에서 <script></script> 를 모두 제거
function removeScriptTagFromHtmlStr(strHtml){
	var scriptIdx = strHtml.indexOf('<script');
	while(scriptIdx > -1 ){
		if( scriptIdx == 0 ){
			strHtml = strHtml.substring(strHtml.indexOf('\</script\>') + 9);
		}else{
			strHtml = strHtml.substring(0,scriptIdx) + strHtml.substring(strHtml.indexOf('\</script\>') + 9);
		}
		scriptIdx = strHtml.indexOf('<script');
	}  
	return strHtml;
}


// App install banner shortcut close
function hideAppRecommendTop(){
	$('#header').removeClass('tBanTy');
	$('#gnb').removeClass('tBanTy');
	var headerMargin = $('#header_margin_div').attr('org_class');
	$('#header_margin_div').removeAttr('class');
	$('#header_margin_div').removeAttr('org_class');
	$('#header_margin_div').addClass(headerMargin);
	
	$.cookie("isInstallShortCut", "false", {expires:90, path:"/", domain:"hanatour.com", secure:false});
	$.cookie("noMoreAppRecommendTop", "Y", {expires:90, path:"/", domain:"hanatour.com", secure:false});
	$("#hdInstallBannerLayout").hide();	

	$(window).scroll();
}


function callNumber(phoneNumber) {
	if(isApp == "Y"){
		if(isIos=="Y") {
			document.location = "callNumber?" + phoneNumber;
		} else if (isAndroid=="Y") {
			window.htmlEventHandler.callNumber(phoneNumber);
		}
	}else{
		location.href = "tel:" + phoneNumber;
	}
}


/*
 * SNS공유
 * hnkim@hanatour.com
 */
JSns = {
	kakaotalkKey : "7d5d42cad617662638dff87c67e36554",
	facebook : function(url){
		anchorExternal("http://m.facebook.com/sharer.php?u="+ encodeURIComponent(url));
	},
	kakaotalk : function(purl, plabel, pimage, image_width, image_height){
		if(image_width == undefined){
			image_width == 414;
			image_height == 216;
		}
		try{
			if(Kakao)Kakao.init(JSns.kakaotalkKey);
		}catch(e){console.log(e);}
        Kakao.Link.sendTalkLink({
        	label: plabel,
			image:{
				src:pimage,
				width : image_width,
				height : image_height
			},
			webLink : {
				text: purl,
				url : purl
			}
		});
	},
	kakaostory : function(pUrl, pText){
		try{
			if(Kakao)Kakao.init(JSns.kakaotalkKey);
		}catch(e){console.log(e);}
		Kakao.Story.share({
			text: pText,
			url : pUrl
		});
	},
	band : function(text, route){
		var uAgent = navigator.userAgent.toLowerCase();
		if(uAgent.indexOf("iphone") > -1 || uAgent.indexOf("ipad") > -1){
			var clickedAt = new Date();
			setTimeout(function(){
				if(new Date() - clickedAt < 1500){
					location.href = "itms-apps://itunes.apple.com/app/id542613198?mt=8";
				}
			}, 500);
			location.href = "bandapp://create/post?text="+encodeURIComponent(text)+"&route="+ encodeURIComponent(route);
		}else{
			//안드로이드에서 bandapp스키마 허용하지 않음 업데이트해야함
			anchorExternal("http://www.band.us/plugin/share?body="+encodeURIComponent(text)+"&route="+ encodeURIComponent(route));
		}		
	},
	twitter : function(url, text){
		anchorExternal("http://twitter.com/intent/tweet?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(text));
	},
	me2day : function(url){
		//검증안됨
		anchorExternal("http://me2day.net/posts/new?new_post[body]=" + encodeURIComponent(url));
	},
	cyworld : function(url){
		//검증안됨
		anchorExternal("http://csp.cyworld.com/bi/bi_recommend_pop.php?url=" + encodeURIComponent(url));
	}
}