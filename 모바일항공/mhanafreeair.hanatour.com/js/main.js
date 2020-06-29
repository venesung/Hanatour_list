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
 * 1.1.0 (2018.06.19) : 퀵메뉴 initQuickBtn() 추가
 *  
 */

var swipeViewID = "swipeView";
var swipeViewArr = new Array();
var winWidth = 0;
/* 2015-04-17 추가 (선택된 주요도시명 정보) */
var majorCityNm = null;
/* //2015-04-17 추가 (선택된 주요도시명 정보) */
var checkKoreaAirPortFlag = true;

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

	$("#fare_sch_btn").on("click", function(){
		var params;
		var tmp = {};
		
		if($("[name=startArea]:checked").val()=="depKor"){
			// 검색조건 유효성 체크
			if( fnValidateCheck(now_itinType) ){
				if ( now_itinType == "RT" ){
					var openYn = $("#ckUnset").is(":checked"); //귀국미정 여부
					
					params = $("#tab01").serializeJsonObject();
					params.ItinList = [];
					
					depapo1 = $("#rt_depApo1").val(); //출국편의 출발 공항
					arrapo1 = $("#rt_arrApo1").val(); //출국편의 도착 공항
					
					depapo2 = $("#rt_depApo2").val(); //귀국편의 출발 공항 
					arrapo2 = $("#rt_arrApo2").val(); //귀국편의 도착 공항
					
					//귀국미정일 경우 체류기간은 공백으로 설정
					if(!openYn) {
						params.LengthOfStay = "";
					}else{
						params.RtnOpenInd = "Y";
					}
					for(var i=0; i < 2; i++){
						tmp = {};
						
						if( (arrapo1 == depapo2 && depapo1 == arrapo2) || openYn){
							tmp.DepApo = $("#tab01 input[name='DepApo']").eq(i).val();
							tmp.ArrApo  = $("#tab01 input[name='ArrApo']").eq(i).val();	
							tmp.DepDate = $("#tab01 input[name='DepDate']").val();
							
							if(openYn){
								tmp.ArrDate = "";		
							}else{
								tmp.ArrDate = $("#tab01 input[name='ArrDate']").val();
							}
							
							tmp.DepApoNm = $("#tab01 #rt_depapoNm"+(i+1)).text();
							tmp.ArrApoNm = $("#tab01 #rt_arrapoNm"+(i+1)).text();
							params.ItinList[i] = tmp;
							
							i =2;
						}else{
							//출국편의 도착 공항과, 귀국편의 출발 공항이 다를경우 , 출발편의 출발공항과 귀국편의 도착 공항이 다를 경우 다구간 처리
							params.ItinType = "MD";
							tmp.DepApo = $("#tab01 input[name='DepApo']").eq(i).val();
							tmp.ArrApo  = $("#tab01 input[name='ArrApo']").eq(i).val();	
							tmp.DepApoNm = $("#tab01 #rt_depapoNm"+(i+1)).text();
							tmp.ArrApoNm = $("#tab01 #rt_arrapoNm"+(i+1)).text();
							
							if( i == 0 ){
								tmp.DepDate = $("#tab01 input[name='DepDate']").eq(0).val();
								tmp.ArrDate = "";
							}else{
								tmp.DepDate = $("#tab01 input[name='ArrDate']").eq(0).val();
								tmp.ArrDate = "";
							}
							params.ItinList[i] = tmp;
						}	
					}
				}else if ( now_itinType == "OW" ){
					tmp = {};
					params = $("#tab02").serializeJsonObject();
					
					tmp.DepApo = $("#tab02 input[name='DepApo']").val();
					tmp.ArrApo  = $("#tab02 input[name='ArrApo']").val();
					tmp.DepDate = $("#tab02 input[name='DepDate']").val();
					tmp.ArrDate = "";
					tmp.DepApoNm = $("#tab02 #ow_depapoNm1").text();
					tmp.ArrApoNm = $("#tab02 #ow_arrapoNm1").text();
					params.ItinList = [];
					params.ItinList[0] = tmp;
					
				}else if ( now_itinType == "MD" ){
					params = $("#tab03").serializeJsonObject();
					params.ItinList = [];
					for(var i=0; i < 3; i++){
						tmp = {};
						tmp.DepApo = $("#tab03 input[name='DepApo']").eq(i).val();
						tmp.ArrApo  = $("#tab03 input[name='ArrApo']").eq(i).val();
						tmp.DepDate = $("#tab03 input[name='DepDate']").eq(i).val();
						tmp.ArrDate = "";
						tmp.DepApoNm = $("#tab03 #md_depapoNm"+(i+1)).text();
						tmp.ArrApoNm = $("#tab03 #md_arrapoNm"+(i+1)).text();
						params.ItinList[i] = tmp;
					}
				}
				
				for(var key in params)	{
					if(params[key] == null || params[key] == ""){
						delete params[key];
					}
				}	
				delete params.DepApo;
				delete params.ArrApo;
				delete params.DepDate;
				delete params.ArrDate;
				
				params.depType="depKor";
				params.NewComp="Y";
				params.FareCnt="2000";
				params.CRuleType = "A";
				params.FareType = "";
				//params.GscCode = 'HANATOUR'
				//params.CBFare = "NN";
				//params.SeatStatus = "OK";
				
				//20160422 SeatStatus ok start
				var filter_op = {};
				filter_op.SeatStatus = "OK";
				filter_op.ViaCnt = "";
				filter_op.FareType = "";
				filter_op.ExpDate = "";
				filter_op.MkAirCode = "";
				filter_op.FareCondition = "";
				sessionStorage.setItem("fare_sch_option", JSON.stringify(filter_op));
				// 20160422 SeatStatus ok end
				jsonString = JSON.stringify(params);
				jsonString = "{\"FareSearchRQ\":" + jsonString + "}";
				
				sessionStorage.setItem("FareSearchRQ", jsonString);
				localStorage.setItem("currentSearchInfo", jsonString);
				
				location.href="/search/fare_list.hnt?bookableDate="+bookableDate;
			}
		}else{	//해외출발
			$("#global_forward").children().remove();
			checkKoreaAirPortFlag = true;
			if( fnValidateCheck(now_itinType) ){
                  if ( now_itinType == "RT" && checkKoreaAirport($("#for_rt_depApo1").val())){
                        
//                      params = $("#tab001").serializeJsonObject();
//                      params.ItinList = [];
                        
                        depapo1 = $("#for_rt_depApo1").val(); //출국편의 출발 공항
                        arrapo1 = $("#for_rt_arrApo1").val(); //출국편의 도착 공항
                        
                        depapo2 = $("#for_rt_depApo2").val(); //귀국편의 출발 공항
                        arrapo2 = $("#for_rt_arrApo2").val(); //귀국편의 도착 공항
                        
                        var getValues1 = "";
                        var getValues2 = "";
                        var getValues3 = "";
                        var getValues4 = "";
                        var getValues5 = "";
                        var getValues6 = "";
                        var getDates = "";
                        var AdultCnt = "";
                        var ChildCnt = "";
                        var InfantCnt = "";
                        var ClassType = "";
                        
                        
                        for(var i=0; i < 2; i++)
                        {
                              tmp = {};
                              if((arrapo1 == depapo2 && depapo1 == arrapo2))
                              {
                                    if(i==0){
                                          $("#global_forward").append("<input type='hidden' name='ItnrType' value='"+now_itinType+"'/>");
                                    }
                                    getValues1 = $("#tab001 input[name='DepApo']").eq(i).val();
                                    getValues2 = $("#tab001 input[name='DepApoType']").eq(i).val();
                                    getValues3 = $("#tab001 input[name='DepApoName']").eq(i).val();
                                    
                                    getValues4 = $("#tab001 input[name='ArrApo']").eq(i).val();
                                    getValues5 = $("#tab001 input[name='ArrApoType']").eq(i).val();
                                    getValues6 = $("#tab001 input[name='ArrApoName']").eq(i).val();
                                    
//                                  tmp.DepApo = getValues1;
//                                  tmp.DepApoType = getValues2;
//                                  tmp.DepApoName = getValues3;
//                                  
//                                  tmp.ArrApo  = getValues4;
//                                  tmp.ArrApoType = getValues5;
//                                  tmp.ArrApoName = getValues6;
                                    
//                                  var getDepDate = "";
                                    if(i==0){
                                          getDates = $("#tab001 input[name='DepDate']").eq(0).val();
                                          $("#global_forward").append("<input type='hidden' name='DeptDate' value='"+getDates+"'/>");
//                                        tmp.DepDate = getDates;
                                    }else{
                                          getDates =$("#tab001 input[name='ArrDate']").eq(0).val()
                                          $("#global_forward").append("<input type='hidden' name='DeptDate' value='"+getDates+"'/>");
//                                        tmp.ArrDate = getDates;
                                    }
//                                  params.ItinList[i] = tmp;
                                    
                                    $("#global_forward").append("<input type='hidden' name='DeptAirportCode' value='"+getValues1+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='DeptAirportType' value='"+getValues2+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='DeptAirportName' value='"+getValues3+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='ArrvAirportCode' value='"+getValues4+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='ArrvAirportType' value='"+getValues5+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='ArrvAirportName' value='"+getValues6+"'/>");
                              }
                              else
                              {
                                    if(i==0){
                                          $("#global_forward").append("<input type='hidden' name='ItnrType' value='MD'/>");
//                                        params.ItinType = "MD";
                                    }
                                    //출국편의 도착 공항과, 귀국편의 출발 공항이 다를경우 , 출발편의 출발공항과 귀국편의 도착 공항이 다를 경우 다구간 처리
                                    getValues1 = $("#tab001 input[name='DepApo']").eq(i).val();
                                    getValues2 = $("#tab001 input[name='DepApoType']").eq(i).val();
                                    getValues3 = $("#tab001 input[name='DepApoName']").eq(i).val();
                                    getValues4 = $("#tab001 input[name='ArrApo']").eq(i).val();
                                    getValues5 = $("#tab001 input[name='ArrApoType']").eq(i).val();
                                    getValues6 = $("#tab001 input[name='ArrApoName']").eq(i).val();
                                    
//                                  tmp.DepApo = getValues1;
//                                  tmp.DepApoType = getValues2;
//                                  tmp.DepApoName = getValues3;
//                                  
//                                  tmp.ArrApo  = getValues4;
//                                  tmp.ArrApoType = getValues5
//                                  tmp.ArrApoName = getValues6;
                                    
                                    var getDepDate = "";
                                    if(i==0){
                                          getDates = $("#tab001 input[name='DepDate']").eq(0).val();
                                          $("#global_forward").append("<input type='hidden' name='DeptDate' value='"+getDates+"'/>");
//                                        tmp.DepDate = getDates;
                                    }else{
                                          getDates =$("#tab001 input[name='ArrDate']").eq(0).val()
                                          $("#global_forward").append("<input type='hidden' name='DeptDate' value='"+getDates+"'/>");
//                                        tmp.ArrDate = getDates;
                                    }
//                                  params.ItinList[i] = tmp;
                                    
                                    $("#global_forward").append("<input type='hidden' name='DeptAirportCode' value='"+getValues1+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='DeptAirportType' value='"+getValues2+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='DeptAirportName' value='"+getValues3+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='ArrvAirportCode' value='"+getValues4+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='ArrvAirportType' value='"+getValues5+"'/>");
                                    $("#global_forward").append("<input type='hidden' name='ArrvAirportName' value='"+getValues6+"'/>");
                              }
                        }
                        AdultCnt = $("#for_rt_noAdtPax").val();
                        ChildCnt = $("#for_rt_noChdPax").val();
                        InfantCnt =$("#for_rt_noIntPax").val();
                        ClassType = $("#for_rt_cabinClass").val();      
                        if(ClassType=="P"){
                              ClassType = "W";
                        }
                  }
                  else if ( now_itinType == "OW" && checkKoreaAirport($("#tab002 input[name='DepApo']").eq(0).val()) )
                  {
//                      params = $("#tab002").serializeJsonObject();
//                      params.ItinList = [];
                        
                        getValues1 = $("#tab002 input[name='DepApo']").eq(0).val();
                        getValues2 = $("#tab002 input[name='DepApoType']").eq(0).val();
                        getValues3 = $("#tab002 input[name='DepApoName']").eq(0).val();
                        getValues4 = $("#tab002 input[name='ArrApo']").eq(0).val();
                        getValues5 = $("#tab002 input[name='ArrApoType']").eq(0).val();
                        getValues6 = $("#tab002 input[name='ArrApoName']").eq(0).val();
                        getDates = $("#tab002 input[name='DepDate']").eq(0).val();
                        
//                      tmp.DepApo = getValues1;
//                      tmp.DepApoType = getValues2;
//                      tmp.DepApoName = getValues3;
//                      tmp.DepDate = getDates;
//                      tmp.ArrApo  = getValues4;
//                      tmp.ArrApoType = getValues2;
//                      tmp.ArrApoName = getValues3;
//                      tmp.ArrDate = "";
                        
                        $("#global_forward").append("<input type='hidden' name='ItnrType' value='"+now_itinType+"'/>");
                        $("#global_forward").append("<input type='hidden' name='DeptAirportCode' value='"+getValues1+"'/>");
                        $("#global_forward").append("<input type='hidden' name='DeptAirportType' value='"+getValues2+"'/>");
                        $("#global_forward").append("<input type='hidden' name='DeptAirportName' value='"+getValues3+"'/>");
                        $("#global_forward").append("<input type='hidden' name='DeptDate' value='"+getDates+"'/>");
                        $("#global_forward").append("<input type='hidden' name='ArrvAirportCode' value='"+getValues4+"'/>");
                        $("#global_forward").append("<input type='hidden' name='ArrvAirportType' value='"+getValues5+"'/>");
                        $("#global_forward").append("<input type='hidden' name='ArrvAirportName' value='"+getValues6+"'/>");
                        
                        AdultCnt =  $("#for_ow_noAdtPax").val();
                        ChildCnt =  $("#for_ow_noChdPax").val();
                        InfantCnt = $("#for_ow_noIntPax").val();
                        ClassType = $("#for_ow_cabinClass").val();      
                        if(ClassType=="P"){
                              ClassType = "W";
                        }
                  }
                  else if ( now_itinType == "MD" && checkKoreaAirport($("#tab003 input[name='DepApo']").eq(0).val()) ){
                        
//                      params = $("#tab003").serializeJsonObject();
//                      params.ItinList = [];
                        
                        var schdCnt = parseInt($("#foreignDep .dagugan .airdaySect02").attr("data-mode").split("range")[1]);
                        $("#global_forward").append("<input type='hidden' name='ItnrType' value='"+now_itinType+"'/>");
                        for(var i=0; i<schdCnt; i++)
                        {
                              getValues1 = $("#tab003 input[name='DepApo']").eq(i).val();
                              getValues2 = $("#tab003 input[name='DepApoType']").eq(i).val();
                              getValues3 = $("#tab003 input[name='DepApoName']").eq(i).val();
                              
                              getValues4 = $("#tab003 input[name='ArrApo']").eq(i).val();
                              getValues5 = $("#tab003 input[name='ArrApoType']").eq(i).val();
                              getValues6 = $("#tab003 input[name='ArrApoName']").eq(i).val();
                              getDates = $("#tab003 input[name='DepDate']").eq(i).val();
                        
//                            tmp = {};
//                            tmp.DepApo = getValues1;
//                            tmp.DepApoType = getValues2;
//                            tmp.DepApoName = getValues3;
//                            tmp.DepDate = getDates;
//                            tmp.ArrApo  = getValues4;
//                            tmp.ArrApoType = getValues5;
//                            tmp.ArrApoName = getValues6;
//                            params.ItinList[i] = tmp;
                              
                              $("#global_forward").append("<input type='hidden' name='DeptAirportCode' value='"+getValues1+"'/>");
                              $("#global_forward").append("<input type='hidden' name='DeptAirportType' value='"+getValues2+"'/>");
                              $("#global_forward").append("<input type='hidden' name='DeptAirportName' value='"+getValues3+"'/>");
                              $("#global_forward").append("<input type='hidden' name='ArrvAirportCode' value='"+getValues4+"'/>");
                              $("#global_forward").append("<input type='hidden' name='ArrvAirportType' value='"+getValues5+"'/>");
                              $("#global_forward").append("<input type='hidden' name='ArrvAirportName' value='"+getValues6+"'/>");
                              
                              $("#global_forward").append("<input type='hidden' name='DeptDate' value='"+getDates+"'/>");
                        }
                        AdultCnt =  $("#for_md_noAdtPax").val();
                        ChildCnt =  $("#for_md_noChdPax").val();
                        InfantCnt = $("#for_md_noIntPax").val();
                        ClassType = $("#for_md_cabinClass").val();      
                        if(ClassType=="P"){
                              ClassType = "W";
                        }
                  }
                  
//                for(var key in params)  {
//                      if(params[key] == null || params[key] == ""){
//                            delete params[key];
//                      }
//                }     
//                delete params.DepApo;
//                delete params.ArrApo;
//                delete params.DepDate;
//                delete params.ArrDate;
//                delete params.SchdCnt;
//                for(var i=schdCnt; i < 6;i++){
//                      delete params.DepApoType[i];
//                      delete params.DepApoName[i];
//                      delete params.ArrApoName[i];
//                      delete params.ArrApoType[i];
//                      params.DepApoName.length = schdCnt;
//                      params.DepApoType.length = schdCnt;
//                      params.ArrApoName.length = schdCnt;
//                      params.ArrApoType.length = schdCnt;
//                }
                  
//                params.depType="depFor";
//                params.NewComp="Y";
//                params.FareCnt="2000";
//                params.CRuleType = "A";
//                params.FareType = "";
//                params.SiteCode = "C00001S005";
//                var filter_op = {};
//                filter_op.SeatStatus = "";
//                filter_op.ViaCnt = "";
//                filter_op.FareType = "";
//                filter_op.ExpDate = "";
//                filter_op.MkAirCode = "";
//                filter_op.FareCondition = "";
//                sessionStorage.setItem("fare_sch_option", JSON.stringify(filter_op));
//                jsonString = JSON.stringify(params);
//                jsonString = "{"FareSearchRQ":" + jsonString + "}";
                  
//                sessionStorage.setItem("FareSearchRQ", jsonString);
//                localStorage.setItem("currentSearchInfo", jsonString);
                  
                  if(checkKoreaAirPortFlag){
                	  $("#global_forward").append("<input type='hidden' name='AdultCnt' value='"+AdultCnt+"'/>");
                      $("#global_forward").append("<input type='hidden' name='ChildCnt' value='"+ChildCnt+"'/>");
                      $("#global_forward").append("<input type='hidden' name='InfantCnt' value='"+InfantCnt+"'/>");
                      $("#global_forward").append("<input type='hidden' name='ClassType' value='"+ClassType+"'/>");
                      $("#global_forward").append("<input type='hidden' name='lang' value='ko_KR' data-role='none'/>");
                      $("#global_forward").append("<input type='hidden' name='siteCode' value='C00001S005' data-role='none'/>");
                      
                      var landingUrl = "http://mglobalflight.hanatour.com/schedule/scheduleSearch.hnt?hanafreeYn=Y&langCode=ko_KR&"+$("#global_forward").serialize();
                      openWindow(landingUrl);
                  }
//                $("#global_forward").attr("action","http://mglobalflightdev.hanatour.com/schedule/scheduleSearch.hnt").submit();
            }
		}
	});
	
	$("[name=startArea]").on("click",function(){
		if($("[name=startArea]:checked").val()=="depKor"){
			$("#depFor").attr("checked",false);
			$("#depKor").attr("checked",true);
			$("#koreanDep").show().next().hide();
			$("#foreignDep > .tabCont").hide();
			$("#koreanDep > .tabCont").hide();
			var id = $(this).parent().parent().next().find("a").attr("href");
			$("#koreanDep > .min_tab li.on").removeClass("on");
			$(this).parent().parent().next().find('li:eq(0)').addClass("on");
			$("#koreanDep > .airmainCt01 .tabCont").hide();
			$(id).show();
			fnTabChange(id);
		}else{
			$("#depKor").attr("checked",false);
			$("#depFor").attr("checked",true);
			$("#foreignDep").show().prev().hide();
			$("#koreanDep > .tabCont").hide();
			$("#foreignDep > .tabCont").hide();
			var id = $(this).parent().parent().next().next().find("a").attr("href");
			$("#foreignDep > .min_tab li.on").removeClass("on");
			$(this).parent().parent().next().next().find('li:eq(0)').addClass("on");
			$("#foreignDep > .airmainCt01 .tabCont").hide();
			$(id).show();
			fnTabChange(id);
		}
	});
	//tab click callback event
	function fnTabChange(tabNo){
		if( tabNo == "#tab01" || tabNo == "#tab001"){
			now_itinType = "RT";
		}else if( tabNo == "#tab02" || tabNo == "#tab002"){
			now_itinType = "OW";
		}else if( tabNo == "#tab03" || tabNo == "#tab003"){
			now_itinType = "MD";
		}
	}
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

	//2018-06-05 추가 wddo //common.js에 SwiperTemplate 추가하고 쿠폰 스와이프 적용 
	new SwiperTemplate().initGallerySwiper($('.airCouponSwiperCont.swiper-container'), {autoplay: 5000});
});
//검색 조건 유효성 체크
function fnValidateCheck(now_itinType){
	var depType = $("[name=startArea]:checked").val();
	if(depType == "depKor"){
		if( now_itinType == "RT" ){
			var openYn = $("#ckUnset").is(":checked"); //귀국미정 여부
			if( openYn ){
				$("#rt_arrDate").attr("input-valid", "");
			}else{
				$("#rt_arrDate").prop("input-valid", "hdfield");
			}
			if ( inputValidate($("#tab01")) ){
				return true;	
			}
		}else if( now_itinType == "OW" ){
			if ( inputValidate($("#tab02")) ){
				return true;	
			}
		}else if( now_itinType == "MD" ){
			if ( inputValidate($("#tab03")) ){
				return true;	
			}
		}			
	}else{
		if( now_itinType == "RT" ){
			$("#for_rt_arrDate").attr("input-valid", "");
			if ( inputValidate($("#tab001")) ){
				return true;	
			}
		}else if( now_itinType == "OW" ){
			if ( inputValidate($("#tab002")) ){
				return true;	
			}
		}else if( now_itinType == "MD" ){
			if ( inputValidate($("#tab003")) ){
				return true;
			}		
		}
	}
}
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

/* 해외출발 한국공항 제어 */
function checkKoreaAirport(airport){
	
	for(var i = 0; i < airlineDomesticCity.length; i++ ){
		
		var apcd = airlineDomesticCity[i].ApCtLclCode;
		
		if(airport == apcd){
			checkKoreaAirPortFlag = false;
			customAlert("한국출발 스케줄은 조회가 불가합니다. 해외출발 스케줄로 변경해 주십시오.");
	      	return false;
	    }
	}
	return true;
	
}
/* 플리킹 영역 ID 동적 생성 */
function makeSwipeViewId(cls){
	var i = 0;
	try{
		$(cls).filter(function(){
			i++;
			var id = swipeViewID + "-" + i;
			$(this).attr("id", id);

			var indicator = "#" + id + " .indicator";
			var auto = false;
			swipeViewArr.push(makeSwipeView(id, indicator, auto));
		});
	}catch(e){
		console.log(e);
	}
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

/********************************************************************************************/
/******************************************* wddo *******************************************/
/********************************************************************************************/

$(document).ready(function () {
	initQuickBtn();
});

//메인,패키지 - 오른하단 플로팅 메뉴 + 버튼
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

/********************************************************************************************/
/****************************************** Method ******************************************/
/********************************************************************************************/

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
