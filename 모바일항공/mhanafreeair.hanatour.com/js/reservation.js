
$(function() {
});

$(document).ready(function () {
	/* 2015-04-17 추가 */
	/* 로그인 : 예약하기/예약확인 */
	$(".login_body .loginRadi label").click(function(){
		var idx = $(this).index();
		//var txt = $(this).text();
		//$(".m_btnRed").text(txt);

		if(idx == 0)
			$("#scTab_02 .login_inp").hide();
		else
			$("#scTab_02 .login_inp").show();
	});
	/* //2015-04-17 추가 */

	/* 컨텐츠 섹션 열기/닫기 */
	$(".payTit01").click(function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$("dl.qnaBox").hide();
		}
		else{
			$(this).addClass("on");
			$("dl.qnaBox").show();
		}
	});

	/*검색결과 : 정렬순서 팝업 */
	$(".rslistBtn").click(function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$("#container").css("z-index" ,"1");
		}
		else{
			$(this).addClass("on");
			$("#container").css("z-index" ,"1000");
		}
	});

	/*검색결과 : 정렬순서 선택 */
	$(".footRsList a").click(function(){
		$(".footRsList li").removeClass("on");
		$(".rslistBtn").removeClass("on");
		$(this).parent().addClass("on");
		var txt = $(this).text();
		$(".rslistBtn").text(txt);
		$("#container").css("z-index" ,"1");
	});

	/*검색결과 : 정렬순서 팝업 닫기 */
	$(".footDim").click(function(){
		$(".rslistBtn").removeClass("on");
		$("#container").css("z-index" ,"1");
	});

	/* 항공 스케쥴 조회 : 상세일정 열기/닫기 */
	$(".scTab .detailBox, .scTab .sc2_Inner").click(function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
		}
		else{
			$(this).addClass("on");
		}
	});

	/* 약관동의 : 약관내용 열기/닫기 */
	$(".termsBox dt a").click(function(){
		var id = $(this).attr("href");
		if($(id).hasClass("open")){
			$(this).parent().removeClass("open");
			$(id).removeClass("open");
		}
		else{
			$(this).parent().addClass("open");
			$(id).addClass("open");
		}
		return false;
	});

	/* 약관동의 : 약관내용 열기/닫기 */
	$(".termsBox dd").click(function(){
		var id = $(this).attr("id");
		if($(this).hasClass("open")){
			$(this).parent().find("a[href=#"+id+"]").parent().removeClass("open");
			$(this).removeClass("open");
		}
		else{
			$(this).parent().find("a[href=#"+id+"]").parent().addClass("open");
			$(this).addClass("open");
		}
		return false;
	});

	/* 약관동의 : 약관동의 checkbox 전체 체크 */
	$(".termsbtn01").click(function(){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$(".garyBox01 .termsBox dt input").prop("checked", false);
		}
		else{
			$(this).addClass("on");
			$(".garyBox01 .termsBox dt input").prop("checked", true);
		}
		return false;
	});

	/* 2015-04-17 추가 (전체선택 checked/unchecked) */
	/* 약관동의 : checkbox checked */
	$(".garyBox01 .termsBox dt input[type=checkbox]").click(function(){
		var ck = true;
		$(".garyBox01 .termsBox dt input[type=checkbox]").filter(function(){
			if(!$(this).is(":checked")){
				ck = false;
			}
		});
		if(ck)
			$(".termsbtn01").addClass("on");
		else
			$(".termsbtn01").removeClass("on");
	});
	/* //2015-04-17 추가 (전체선택 checked/unchecked) */

	/* 예약취소 : checkbox 전체선택 */
	$(".cancleBox h2 input").click(function(){
		if(!$(this).is(":checked")){
			$(this).parent().parent().find("ul li input[type=checkbox]").prop("checked", false);
		}
		else
			$(this).parent().parent().find("ul li input[type=checkbox]").prop("checked", true);
	});

	/* 2015-04-17 추가 (전체선택 checked/unchecked) */
	/* 예약취소 : checkbox checked */
	$(".cancleBox ul li input[type=checkbox]").click(function(){
		var ck = true;
		$(this).parent().parent().parent().find("ul li input[type=checkbox]").filter(function(){
			if(!$(this).is(":checked")){
				ck = false;
			}
		});
		if(ck)
			$(".cancleBox h2 input").prop("checked", true);
		else
			$(".cancleBox h2 input").prop("checked", false);
	});
	/* //2015-04-17 추가 (전체선택 checked/unchecked) */

	/*검색결과 : 검색적용 - checkbox 전체선택 */
	$(document).on("click", ".popLabelAco input.all, .popLabelBox input.all", function(){
		if(!$(this).is(":checked")){
			$(this).parent().parent().find("input[type=checkbox]").prop("checked", false);
		}
		else
			$(this).parent().parent().find("input[type=checkbox]").prop("checked", true);
	});

	/*검색결과 : 검색적용 - checkbox checked */
	$(document).on("click", ".popLabelAco input:not(.all), .popLabelBox input:not(.all)", function(){
		if(!$(this).is(":checked")){
			$(this).parent().parent().find(".all").prop("checked", false);
		}
		else{
			var ckAll = true;
			$(this).parent().parent().find("input:not(.all)").filter(function(){
				if(!$(this).is(":checked")){
					ckAll = false;
				}
			});
			if(ckAll)
				$(this).parent().parent().find(".all").prop("checked", true);
		}
	});

	/*검색결과 : 검색적용 - 열기/닫기 */
	$(document).on("click", ".popLabelAco h4", function(){ //20150423 수정
		var ckEl = $(this).parent().find(".all");
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			if(ckEl.is(":checked")){
				sel = "전체";
			}
			else {
				var cnt = 0;
				var sel = "";
				$(this).parent().find("input").filter(function(){
					if(!$(this).hasClass("all")){
						if($(this).is(":checked")){
							cnt++;
							if(cnt == 1)
								sel = $(this).parent().find("span").text();
						}
					}
				});

				if(cnt > 1){
					sel += "외 " + (cnt-1) + "개";
				}
			}
		}
		else{
			$(this).addClass("on");
		}
		$(this).find("span").text(sel);

		return false;
	});

	/* 정보입력 : 정보수정 팝업 Open */
	$(document).on("click", ".InfoPop", function(){
/* 2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */
		var url = $(this).attr("href");
		var data = $(url).html();
		$("#overlayPanel").html(data);

		var sTop = $(window).scrollTop();
		var winH = window.innerHeight;

		overlayPanelPos = $(window).scrollTop();
		mask(true, "#overlayPanel");

		$("#overlayPanel").height(winH).css("min-height", winH).show();
		setTimeout(function(){
			$("#overlayPanel").addClass("slide slideUp").one(ANI_EV, function() {
				$("#wrap").hide();
				$(window).scrollTop(0);
				$("#overlayPanel").height("auto").addClass("show").removeClass("slideUp slide");
/* //2015-04-17 keypad open시 스크롤 버그 수정 (header/footer/scroll 영역 계산방식 변경) */

				try{
					afterInfoPop();
				}
				catch(e){}
			});
		}, 50);

		$(".closeOverlayPanel").one("click", function(){
			closeOverlayPanel("close");
			return false;
		});

		return false;
	});

	//2016-05-23 추가 //항공 검색 카드 하단 화살표 이벤트
	$('.resultList01').on('click', 'a.csTogBtn', function (e) {
		$(this).closest('.cardSumBox').toggleClass('open');
	});

	//2016-06-16 추가 wddo //상세검색 - 숨은 경유지란? 이벤트
	$('#overlayPanel').on('click', '.popReserve01 .hideAirbox > a', function (e) {
		var target = $(e.currentTarget);
        var tip = target.next('div.qnaPopTxt');

        //열는 상황이면 
        if (!target.hasClass('on')) {
            //기존 있으면 닫기
            if ($('.qnaPopTxt').not(':hidden').length > 0) $('.qnaPopTxt').not(':hidden').prev('a.on').removeClass('on');

            target.addClass('on');

            //열기
            tip.find('> a').on('click.tip', function (e) {
                $(this).closest('div').prev('a.on').removeClass('on');
            });

            //그외 영역 터치 시 팝업 닫기
            $(document).on('touchstart.tip', function (e) {
                var target = $(e.target)

                if (target.closest('.qnaPopTxt').length === 0 && !target.hasClass('qna_second')) {
                    $('.qnaPopTxt').not(':hidden').prev('a.on').removeClass('on');    
                }
            });
        } else {
            target.removeClass('on');
            tip.find('> a').off('click.tip');
            $(document).off('touchstart.tip');
        }

        e.preventDefault();
	});
});
