/*!
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 4.0.0
 * @since : 2015.12.04
 *
 * history
 * 
 * 1.0   (2015.12.04) : -
 * 1.0.1 (2015.12.16) : 외부 레이아웃 수정 가능한 addUpdate, addEvent 옵션 추가
 * 1.0.2 (2016.02.11) : instacne 생성 형태로 변경
 * 2.0   (2016.03.07) : range 형태 추가
 * 2.1   (2016.03.30) : 옵션 rangeDay, rangeLimit, rangeSelect 추가, 박수 셀렉트박스 연동 추가
 * 2.1.1 (2016.04.14) : setDate() setSelect() 외부 함수 호출시 2번째 인자 target 제공(range:true 인 경우 대비)
 * 2.2   (2016.04.15) : jquery-ui.custom.js 에 _changeDateDatepicker 함수 추가하여 내부에서 datepicker('setDate' 사용하지 않도록 수정, datepicker('changeDate' 로 호출
 * 2.2.1 (2016.04.18) : opts.autoValue 추가
 * 2.2.2 (2016.05.02) : 체크인 변경 시 체크아웃 변경 안되는 경우가 있어 rangeSelect 동기화를 위해 체크인도 이벤트 등록
 * 2.2.3 (2016.05.20) : 체크인, 아웃 input 중 하나라도 보이지 않는다면 range형 디자인 요소들 잠시 숨겨놓음
 * 2.2.4 (2016.06.03) : 중복 생성 체크인 .hasDatepicker 클래스 로는 부족하여 target.data('datepicker') undefined 체크
 * 2.2.5 (2016.06.29) : setRange -> changeRange 로 수정 하고 내부에서 호출 하는 함수로 변경
 *                      기존 setRange 는 박수 셀렉특 박스가 없으면 changeRange 로 호출하도록 하고 있으면 박수 셀렉트의 val() 변경토록 분기처리
 * 2.2.6 (2016.06.30) : 중복체크 강화
 * 3.0   (2016.08.10) : rangeDate -> getRangeClass 로 변경, inline 형태의 range 달력 추가
 * 3.0.1 (2016.08.11) : 3.0에서 추가된 getPicker() 따른 소스정리, 인라인에서 외부로 체크인&아웃 date 반환 함수 받을 opts.onRange 추가
 * 3.0.2 (2016.08.18) : opts.positionSync 추가, 한 페이지에 range 형태와 비range 형태 존재할 경우를 대비한 #ui-datepicker-div 의 클래스 초기화.. opts.divClass 로는 구별 어려움
 * 3.0.3 (2016.08.24) : inline range 형태 달력 1개 이상 들어가는 경우 opts.monthSuffix 중복 출력 수정
 * 3.0.4 (2016.08.30) : minDate(체크인), maxDate(체크아웃) 변수 startDate, stopDate 로 통일, changeDate(), changeRange() 함수에서 inline range 달력 체크인, 체크아웃 외부 설정 대응 수정
 *                      getMinDateObject(), getMaxDateObject(), getMinMaxDate() 함수 추가
 *                      changeRangeDay() 함수 인자 변경
 * 3.0.5 (2016.09.20) : inline range 형태에서 setDate() 외부 함수 호출 시 draw 시작월이 변경되는 문제해결을 위해 'changeDate' 를 'refresh' 이벤트로 대체
 *                      ins.setSelect() 와 같은 기능을 selectDate() 내부함수로 생성하고 기존 ins.setSelect()에서 사용하도록 수정
 *                      scrollToSelectMonth() 함수 추가
 * 3.0.6 (2016.09.22) : opts.startMaxDay 추가, 체크인&아웃 동일 날짜 선택 가능하도록 수정, 2.2.6 중복체크 강화에 의해 remove() 했더니 ui-state-hover 적용 안되어 empty() 로 변경
 * 3.0.7 (2016.10.11) : opts.dynamicRange 추가하여 체크아웃 선택 가능 날짜가 기존 체크인 기준을 체크아웃과 같이 현재 날짜로 제한하도록 함
 * 3.0.8 (2016.11.01) : 1개짜리 달력시 autoValue 적용토록 수정
 * 3.0.9 (2016.11.15) : ins.setRange(), ins.setDate() 에서 호출 하던 3.0.5에서 추가한 scrollToSelectMonth() 제거하고 data-scrolltop 속성 활용하여 외부에서 선언
 *                      changeDate() 내부 인라인 형태에서 onRange 발생 시킴
 * 3.1.0 (2017.01.10) : inline 형태의 달력에서 '미정' 적용을 위해 ins.setPlan(boolean) 추가, inline 달력 opts.startMaxDay:0 시 동일 날짜 선택 가능토록 수정
 *                      inline 형태의 opts.autoValue 영향 받도록 수정
 * 3.1.1 (2017.03.14) : inline, opts.range:false 형태에서 ins.setDate()시 jqui 내부_setDate > ins.drawMonth이 변경되어 이전달이 출력안되는 문제로 changeDate()함수내부에 if문에 opts.range 조건을 triggerRange()에만 적용
 * 3.1.2 (2017.04.07) : ins.getOptions() 추가, 미정의 체류기간 select를 위한 initStay() 추가, 그에따른 checkout에 대한 'unplan' 클래스 추가, ins.setPlan(boolean) 내용 수정
 * 3.1.3 (2017.06.21) : opts.onlyCheckout 추가하여 inline 형태의 달력에서 checkout 만 선택할 수 있도록 수정
 * 4.0.0 (2017.06.23) : 다구간 기능 추가로 opts.rangeMiddleCount 추가, inline 싱글형 달력 정리(다중 changeDate 이벤트 발생 문제 해결), isComplete 변수 추가 
 *                      기존 inline 형태 onRange 인자로 넘기던 배열 '' 빈문자열 없이 갯수만큼 반환토록 수정
 *
 **********************************************************************************************
 ************************************* jQuery UI 기반 달력 ************************************
 **********************************************************************************************
 *
 * 1. update.wddo 와 complete.wddo 발생시켜 달력 변경 시점과 완료 시점 받음 (jquery-ui.js 수정함)
 * 2. selectDate.wddo 이용하여 나만의 날짜 선택 이벤트 받을 수 있음 (range 추가하면 jquery-ui.js 에 추가함)
 * 3. inline 형태의 range:true 는 물리적 1개의 달력에 여러 활성화를 표시하므로 data('') 를 통해 값을 저장하며 반환은 onRange : function (dateArr) 를 통하여 한다.
 * 4. input 기반의 달력에선 opts.rangeSelect가 박수를 의미 하지만 div 기반의 inline 달력에선 미정 체류(unplan) 날짜를 의미함
 * 5. inline 형태의 range:true 와 opts.rangeMiddleCount > 0 이면 다구간 선택가능.. 선택일자 저장 시 checkin, checkout 함께 middleDateArr 사용 (middleDateArr 처음과 마지막이 checkin, checkout 같음)
 *
 * var instance = new Hanatour.components.calendar();
 * instance.init(target, options);
 *
 * @param target             ::: datepicker 타깃 설정
 * @param options            ::: 설정 Object 값
 *
 * options                   ::: jquery ui datepicker 옵션 기반
 *   monthSuffix:String                                  //타이틀에 월 뒤에 붙는 텍스트
 *   selectText:String                                   //타이틀 셀렉트 화살표 텍스트
 *   divClass:String                                     //달력 컨테이너 div 클래스명 (input 베이스 인경우 필요)
 *   selectbox:Boolean                                   //디자인 셀렉트 박스
 *   extendBeforeShowDay:Function = function (date) {}   //beforeShowDay 옵션 확장
 *   range:Boolean                                       //range 형태 유무
 *   rangeSelect:Object                                  //range 달력과 연동되는 박수 변경 select 태그 jQueryObject
 *   rangeDay:Number                                     //기본 박수 [default 2]
 *   rangeLimit:Number                                   //선택할 수 있는 range 길이 [default 30]
 *   rangeMiddleCount:Number                             //다구간 갯수 (range: true 인 경우에만 적용) [default 0]
 *   startMaxDay:number                                  //체크아웃 달력 체크인 보다 몇일 뒤부터 선택할지 [default 1], 0 시 체크인과 체크아웃 동일날짜 선택가능
 *   dynamicRange:Boolean                                //체크인 선택날이 체크아웃 선택 범위에 영향을 주는지 여부 [default true], false 시 (현재 날짜 + rangeLimit) 으로 선택가능
 *   positionSync:Boolean                                //체크아웃 달력 위치를 체크인에 맞힐지 유무
 *   autoValue:Boolean                                   //자동을 오늘날짜(minDate) 기준으로 input에 value 값 셋팅
 *   plan:Boolean                                        //미정 유무 (inline 전용)
 *   onlyCheckout:Boolean                                //체크인 변경없이 체크아웃만 설정할수 있도록(inline 전용)
 *   addUpdate:Function = function (container) {}        //레이아웃 업데이트 확장 함수
 *   addEvent:Function = function (container) {}         //이벤트 확장 함수
 *   onRange:Function = function (dateArr) {}            //인라인 스타일 체크인 & 아웃 선택 콜백 함수
 *
 *   - range:true 시 내부에서 컨트롤 하는 jquery UI 함수 (사용에 주의)
 *
 *   beforeShow:Function = function (date) {}            //달력이 보여지기 직전 콜백 함수
 *   minDate:String or Number = '1d+'                    //최소 날짜
 *   maxDate:String or Number = null                     //최대 날짜
 *   showCurrentAtPos:Number = 0                         //숫자만큼 달력 이동
 *
 * method
 *   .init(target, options);     //초기화
 *   .dispose();                 //파괴
 *   .setDate(date, input);      //달력 날짜 변경
 *   .setSelect(date, input);    //일 선택 변경 
 *   .setSelectAll(date);        //일 모두 선택
 *   .getSelectBox();            //셀렉트박스 반환
 *   .setRange(value);           //range 간격 수정
 *   .getRange();                //range 간격 반환
 *   .setPlan(boolean);          //미정 유무 변경 (inline 전용)
 *   .getOptions();              //옵션 반환
 */
var Hanatour_components_calendar = (function ($) {
    'use strict';
    
    var wddoObj = function (options) {
        var scope,
            datepickerTarget,
            input,
            container,
            holidays = ['1-1', '3-1', '5-1', '5-5', '6-6', '8-15', '10-3', '10-9', '12-25'],
            lunardays = ['2014-1-30', '2014-1-31', '2014-2-1', '2014-5-6', '2014-9-7', '2014-9-8', '2014-9-9', '2015-2-18', '2015-2-19', '2015-2-20', '2015-5-25', '2015-8-14', '2015-9-26', '2015-9-27', '2015-9-28', '2016-2-8', '2016-2-9', '2016-5-14', '2016-2-10', '2016-9-14', '2016-9-15', '2016-9-16', '2017-1-27', '2017-1-28', '2017-1-29', '2017-5-3', '2017-10-3', '2017-10-4', '2017-10-5', '2018-2-15', '2018-2-16', '2018-2-17', '2018-5-22', '2018-9-23', '2018-9-24', '2018-9-25', '2019-2-4', '2019-2-5', '2019-2-6', '2019-5-12', '2019-9-12', '2019-9-13', '2019-9-14', '2020-1-24', '2020-1-25', '2020-1-26', '2020-4-30', '2020-9-30', '2020-10-1', '2020-10-2'],
            rangeDayCount,   //range 날짜 수
            viewNum,         //노출되는 달력 월 갯수
            isMulti = false, //달력월 노출 1개 이상 유무
            selectBox,
            datepickerData,
            isComplete = false,      //초기 생성 or 실데이터 입력 시 실행해야할 update.wddo 내부 로직 구별을 위해
            middleDateArr = [],      //일 선택할때 Date 객체 담을 배열 //add 4.0.0
            middleCounter = 0,       //beforeShowDay 내부에서 다구간 체크를 위한 카운터 //add 4.0.0
            opts,
            defaults = getDefaultOption(),
            init = function (target, options) {
                opts = $.extend({}, defaults, options);

                datepickerTarget = target;
                rangeDayCount = opts.rangeDay;
                viewNum = ($.isArray(opts.numberOfMonths)) ? Math.max(opts.numberOfMonths[0], opts.numberOfMonths[1] || 0) : opts.numberOfMonths;
                isMulti = (viewNum > 1);

                if (target.is('div')) {
                    container = target;
                } else {
                    input = target; //container 가 initCallback() 에서 #ui-datepicker-div 로 설정됨
                }

                if (target.length > 0) {
                    if (target.hasClass('hasDatepicker') && target.data('datepicker') === undefined) target.removeClass('hasDatepicker'); //클래스만 존재하는 경우 클래스만 삭제 //add 2.2.6
                    if (target.data('datepicker') !== undefined) scope.dispose(); //존재하면 삭제 //modify 2.2.4 //modify 2.2.6
                    if ($('#ui-datepicker-div').length > 0) $('#ui-datepicker-div').empty(); //div 가 존재하면 삭제 //add 2.2.6 //remove() -> empty() 수정 //modify 3.0.6

                    if (target.data('scope') === undefined) target.data('scope', scope);

                    initCallback(); //updateTitle(), settingInlineRange(), settingRange() 함수 내부에서 호출
                    
                    initLayout();
                    initEvent();
                    
                    if (datepickerTarget.is('input')) {
                        if (input.length > 1) {  //인풋에 체크인&아웃 인 경우.. add 2.2.1
                            if (opts.rangeSelect !== undefined && opts.rangeSelect.length > 0) { //박수있은 경우
                                initNight(); //박수 //opts.autoValue 는 함수 내부 처리
                            }
                        } else if (input.length === 1) { //한개짜리 달력 autoValue 적용.. add 3.0.8
                            if (opts.autoValue) getPicker('checkin').datepicker('changeDate', new Date()); //opts.autoValue 설정(changeRange() 추출)
                        }
                    } else if (datepickerTarget.is('div')) {
                        if (opts.range) {
                            initStay(); //미정 체류기간 셀렉트 //add 3.1.2
                        } else {
                            //changeDate(new Date()); // 일반 인라인 달력 //add 4.0.0 달력 생성 시 opts.minDate 를 통해 자체적으로 1회 실행 되므로 삭제
                        }
                    }
                }
            };

        function getDefaultOption() {
            return {
                //numberOfMonths: [4, 1],
                //minDate: '+1d',
                //maxDate: null,
                dateFormat: 'yy-mm-dd(DD)',
                showMonthAfterYear: true,
                monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                dayNames: ['일', '월', '화', '수', '목', '금', '토'],          //yy-mm-dd(DD) 에서의 DD
                dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],     //dayNames 축약형
                dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],       //달력 해더 아래 표시
                yearSuffix: '.',
                changeYear: false,
                changeMonth: false,
                beforeShowDay: function (date, show) { //jquery-ui-custom 수정으로 보이는 일인지 구분하는 show 인자 받음
                    var holiday = (checkHoliday(date) || checkLunarday(date))? 'holiday' : '';
                    var range = getRangeClass(date) || '';
                    var middle = ((show) ? getMiddleClass(date) : '') || ''; //add 4.0.0

                    return [showDate(date), holiday + weekendday(date) + range + middle];
                },
                /* datepicker 없는 옵션*/
                extendBeforeShowDay: undefined,
                monthSuffix: '',
                selectText: '달선택',
                divClass: undefined,
                selectbox: false,
                range: false,
                rangeSelect: undefined,
                rangeDay: 2,
                rangeLimit: 30,
                rangeMiddleCount: 0,        //add 4.0.0 //다구간 갯수(체크인,아웃갯수 제외 갯수), 다구간 시 필수
                rangeMiddleOverlapMax: 2,   //add 4.0.0 //다구간 같은날 중복 갯수
                startMaxDay: 1,
                dynamicRange: true,
                positionSync: true,
                autoValue: true,
                plan: true,
                onlyCheckout: false,
                addUpdate: undefined,
                addEvent: undefined,
                onRange: undefined
            };
        }

        //beforeShowDay 확장, 확장 없으면 true 무조건 반환하여 진행
        function showDate(date) {
            return (opts.extendBeforeShowDay !== undefined) ? opts.extendBeforeShowDay(date) : true;
        }

        //주말 체크
        function weekendday(date) {
            var returnValue = '';

            switch (date.getDay()) {
                case 0: //일요일
                    returnValue = ' sun';
                    break;
                case 6: //토요일
                    returnValue = ' sat';
                    break;
                default:
            }

            return returnValue;
        }

        //명절 체크
        function checkLunarday(date) {
            var day = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

            return $.inArray(day, lunardays) > -1;
        }

        //공휴일 체크
        function checkHoliday(date) {
            var day = (date.getMonth() + 1) + '-' + date.getDate();
            
            return $.inArray(day, holidays) > -1;
        }

        //range 형태의 경우 range 활성화 변경 (beforeShowDay 함수에서 호출)
        function getRangeClass(date) {
            var returnValue, startDate, stopDate, isShow;

            if (opts.range) {
                var thisTime = date.getTime();
                var startDate = getPickerDate('checkin');
                var stopDate = getPickerDate('checkout');

                if (datepickerTarget.length === 2 && datepickerTarget.is('input')) {
                    var checkin = getPicker('checkin');
                    var checkout = getPicker('checkout');

                    isShow = (!checkin.is(':hidden') && !checkout.is(':hidden')); //add 2.2.3

                    if (startDate !== null && stopDate !== null && isShow) {
                        if (thisTime > startDate.getTime() && thisTime < stopDate.getTime()) {
                            returnValue = ' ui-datepicker-range';
                        } else if (thisTime === startDate.getTime()) {
                            returnValue = ' ui-checkin-state-active';

                            //체크인과 아웃 같은 날짜 체크 시 //add 3.0.6
                            if (startDate.getTime() === stopDate.getTime()) returnValue = ' ui-checkinout-state-active';
                        } else if (thisTime === stopDate.getTime()) {
                            returnValue = ' ui-checkout-state-active';
                        }
                    }
                } else if (datepickerTarget.length === 1 && datepickerTarget.is('div')) {
                    //인라인 타입에 대한 opts.range 적용 //add 3.0
                    if (startDate !== null) {
                        if (thisTime === startDate.getTime()) { //체크인
                            returnValue = (opts.plan) ? ' ui-checkin-state-active' : ' ui-checkin-state-active unplan'; //(opts.plan) 추가 modify 3.1.0
                        } else {
                            if (stopDate !== null) {
                                if (thisTime > startDate.getTime() && thisTime < stopDate.getTime() && opts.plan) { //&& opts.plan 추가 modify 3.1.0
                                    //체크인 아웃 사이
                                    returnValue = ' ui-datepicker-range';
                                } else if (thisTime === stopDate.getTime()) {
                                    //체크아웃
                                    returnValue = (opts.plan) ? ' ui-checkout-state-active' : ' ui-checkout-state-active unplan'; //(opts.plan) ? 추가 modify 3.1.2
                                } else {}
                            }
                        }

                        //체크인과 아웃 같은 날짜 체크 시 //modify 4.0.0 조건 opts.rangeMiddleCount === 0 추가로 다구간시 checkinout 사용안하고 middle[1|2|3|4|5|6] 사용
                        if (stopDate !== null && thisTime === startDate.getTime() && thisTime === stopDate.getTime() && opts.rangeMiddleCount === 0) returnValue = ' ui-checkinout-state-active'; //add 3.1.0
                    }
                }
            }

            return returnValue;
        }

        //range 다구간 형태의 경우 다구간 활성화 변경 .ui-middle-state-active.middle[1|2|3|4|5|6] (beforeShowDay 함수에서 호출)
        function getMiddleClass(compareDate) {
            var returnValue = '';
            var middleDate;
            
            if (opts.range && middleDateArr.length > 0) {
                var thisTime = compareDate.getTime();
                
                if (datepickerTarget.length === 2 && datepickerTarget.is('input')) {
                    //input 다구간 미적용
                } else if (datepickerTarget.length === 1 && datepickerTarget.is('div')) {
                    if (middleDateArr.length > 0) {
                        var numStr = '';

                        do {
                            middleDate = middleDateArr[middleCounter];

                            if (middleDate !== undefined && thisTime === middleDate.getTime()) { //저장한 데이터가 그리는 달력일과 같으면
                                if (numStr.length === 0) returnValue += ' ui-middle-state-active middle';
                                numStr += (middleCounter + 1).toString(); //1234

                                middleCounter += 1; //다음배열 지정위해 + 1
                            } else {
                                break;
                            }
                        } while (middleDateArr.length > middleCounter) //총 갯수 미도달 시 다음일비교 do{} 계속

                        returnValue += numStr;
                    }
                }//end if
            }//end if

            return returnValue;
        }

        function initCallback() {
            //feb. mar. apr. may. jun. jul. aug. sep. oct. nov. dec

            //월만 바꿔도 callback, datepickerTarget.datepicker('option') 변경도 발생
            datepickerTarget.on('update.wddo', function (e, data) {
                //console.log('update.wddo');
                datepickerData = data;

                if (container === undefined) container = $('#ui-datepicker-div'); //input 베이스 이면 container 정의
                if (opts.divClass !== undefined) container.addClass(opts.divClass); //달력 container 클래스 정의, 하나의 div 로 사용하기 때문에 상황에 맞게 여러 클래스를 넣을 수 없으니 주의

                //한 페이지에 range 형태와 비range 형태 존재할 경우를 대비한 클래스 초기화 //add 3.0.2
                if (!opts.range) container.removeClass('datepicker-check-in-active datepicker-check-out-active');

                updateTitle(data);
                ie7Fix();

                if (datepickerTarget.is('div') && opts.range && isComplete) triggerRange(); //인라인 전용 외부 호출 함수 //add 3.0.4

                if (opts.addUpdate !== undefined) opts.addUpdate({container: container, input: input});
            });

            if (datepickerTarget.is('div') && datepickerTarget.length === 1) {
                //inline 형태 1회 발생
                datepickerTarget.on('complete.wddo', function (e, data) {
                    //console.log('complete.wddo');
                    isComplete = true;

                    if (opts.range) { //add 4.0.0 minDate에 의해 생성된 .ui-state-active 가 clearDateActive()에 의해 싱글형에서 삭제 되므로 range 형태일때만 진행 하도록
                        clearDateActive(); //선택 전부 삭제 
                        settingInlineRange(data); //add 3.0    
                    }
                });
            } else if (opts.range && datepickerTarget.length === 2 && datepickerTarget.is('input')) {
                //range 형태 1회 발생, :last 는 2개의 input 모두 초기화 되었을 때를 위해
                datepickerTarget.filter(':last').on('complete.wddo', function (e, data) {
                    settingRange(data); //range 형태 셋팅
                });
            } else {}
        }

        function initLayout() {
            if (datepickerTarget.datepicker !== undefined) datepickerTarget.datepicker(opts);
        }

        function initEvent() {
            if (opts.addEvent !== undefined) opts.addEvent({container: container, input: input});

            //달력 아이콘 이벤트
            if (input !== undefined && input.next('button').length > 0) {
                var icon = input.next('button');
                icon.on('click.calendar', function (e) {
                    var currentInput = $(this).prev('input');
                    currentInput.focus();

                    e.preventDefault();
                });
            }

            //년월 선택 박스
            if (container !== undefined) {
                container.on('click.calendar', '.this_month a.sel_m', function (e) {
                    var target = $(e.currentTarget);
                    var dropDiv = target.closest('.this_month').next('div');

                    if (dropDiv.is(':hidden') && !target.hasClass('on')) {
                        target.addClass('on');
                        dropDiv.show();
                    } else {
                        target.removeClass('on');
                        dropDiv.hide();
                    }

                    e.preventDefault();
                });
            }
        }

        //박수 셀렉트 초기화
        function initNight() {
            //체크인 & 아웃 변경되면.. 체크아웃만 변경했었는데 체크인 변경 시 체크아웃 변경 안되는 경우가 있어 rangeSelect 동기화를 위해 체크인도 이벤트 등록
            datepickerTarget.on('selectDate.wddo', function (e, data) { //add 2.2.2
            //체크아웃 변경되면
            //datepickerTarget.eq(1).on('selectDate.wddo', function (e, data) {
                //박수 셀렉트 같이 변경, options에 value 가 있을 때
                if (opts.rangeSelect.find('> option[value="' + rangeDayCount + '"]').length > 0) opts.rangeSelect.val(rangeDayCount).trigger('change');
            });

            //박수 변경하면 달력 range 변경
            opts.rangeSelect.on('change', function (e) {
                changeRange($(this).val());
            });

            //최초 1회 자동 value 인 경우 셀렉트박스 토대로 달력 range 변경하도록 함
            if (opts.autoValue) changeRange(opts.rangeSelect.val()); // modify 2.2.1
        }

        //체류기간 셀렉트 초기화 //add 3.1.2
        function initStay() {
            datepickerTarget.on('selectDate.wddo', function (e, data) {
                if (!opts.plan && opts.rangeSelect.find('> option[value="' + rangeDayCount + '"]').length > 0) opts.rangeSelect.val(rangeDayCount).trigger('change');
            });

            if (opts.rangeSelect !== undefined && opts.rangeSelect.length > 0) {
                opts.rangeSelect.on('change', function (e) {
                    if (!opts.plan) changeRange($(this).val());
                });
            }
        }

        //달력 상단부 레이아웃 변경
        function updateTitle(data) {
            var datepicker = (isMulti) ? container.find('.ui-datepicker-group') : container;
            var titleContainer = datepicker.find('.ui-datepicker-title');

            if (opts.changeYear && opts.changeMonth) {
                //년월 셀렉트 박스형태
                var year = titleContainer.find('.ui-datepicker-year');
                var month = titleContainer.find('.ui-datepicker-month');
                var viewLen = 5;
                var optionsHeight = 18;

                titleContainer.contents().eq(1).remove();

                year.attr('size', viewLen).css({
                    'height': viewLen * optionsHeight,
                    'overflow-y': 'auto'
                });
                month.attr('size', viewLen).css('height', viewLen * optionsHeight);
                //month.scrollTop(month.find(':selected').position().top - parseInt(titleContainer.css('paddingTop')) - parseInt(titleContainer.parent().css('paddingTop')) - 1);

                if (opts.selectbox) {
                    //디자인 셀렉트 박스 형태이면
                    initSelectBox(data);
                } else {
                    titleContainer.children().wrapAll('<div class="inner_year_layer" style="display:none;">');
                    titleContainer.prepend('<div class="this_month">' + year.val() + opts.yearSuffix + Util.getForce2Digits(parseInt(month.val()) + 1) + opts.monthSuffix + '<a href="#" class="sel_m" title="' + opts.selectText + '"><span class="ir">' + opts.selectText + '</span></a></div>');
                }
            } else {
                titleContainer.each(function (idx) {
                    var target = $(this);

                    target.contents().eq(1).replaceWith(opts.yearSuffix); //타이틀에 연월 간격 삭제 //modify 3.0.3

                    //add 3.0.3;
                    target.contents().eq(3).remove();  //월 비우고
                    target.append(opts.monthSuffix);   //월 추가
                });
            }
        }

        //<!-- input 전용 함수
        //range 초기 셋팅
        function settingRange(data) {
            //인풋 같은 형제로 위치 변경
            var dpDiv = $('#ui-datepicker-div'); //새로 찾아 정의
            var min = data.obj._getMinMaxDate(data.ins, "min");
            
            //초기 2박3일 셋팅
            if (data !== undefined && min !== null && opts.autoValue) changeRangeDay(min, true);  //modify 2.2.1        
            
            //체크인 날짜 선택 시 최우선 호출 콜백
            getPicker('checkin').on('selectDay.wddo', function (e, data) {
                //checkout 으로 자동 전환시 모션속도 0으로
                getPicker('checkin').data('datepicker').settings.duration = 0; //체크인 사라짐 용
                getPicker('checkout').data('datepicker').settings.duration = 0; //체크아웃 등장 용
            });

            //체크인 날짜 선택 시 최하단 호출 콜백
            getPicker('checkin').on('selectDate.wddo', function (e, data) {
                //체크아웃 선택에서 비활성화된 날짜 복구
                var checkinDate = new Date(getPickerDate('checkin'));
                var checkoutDate = new Date(getPickerDate('checkout'));
                changeRangeDay(checkinDate, (checkoutDate.getTime() - checkinDate.getTime() < 0)); //체크아웃보다 이후 날짜 이면 checkout까지 변경

                //체크아웃이 숨겨져 있지 않으면 (항공 "미정" 예외를 위해)
                if (!getPicker('checkout').is(':hidden') && !getPicker('checkout').prop('disabled')) {
                    getPicker('checkout').data('auto-open', true).datepicker('show');
                    
                    getPicker('checkin').data('datepicker').settings.duration = (opts.duration !== undefined) ? opts.duration : 'fast'; //속도 복구
                    getPicker('checkout').data('datepicker').settings.duration = (opts.duration !== undefined) ? opts.duration : 'fast'; //속도 복구    
                }
            });

            //체크아웃 날짜 선택 시 최하단 호출 콜백
            getPicker('checkout').on('selectDate.wddo', function (e, data) {
                //range 길이 결정하고
                changeRangeCount();

                //체크인 달력 기준으로 체크아웃 변경
                var checkinDate = new Date(getPickerDate('checkin'));
                changeRangeDay(checkinDate, true);
            });

            //체크인 달력 열리기 직전 이벤트
            getPicker('checkin').datepicker('option', 'beforeShow', function (input, inst) {
                if (opts.beforeShow !== undefined) opts.beforeShow(input, inst);
                
                //datepickerTarget.eq(0).parent().append(dpDiv);

                var checkinInput = getPicker('checkin');
                var checkoutInput = getPicker('checkout');

                //체크아웃 달력 체크인 달력과 같은 위치에 달력 표시
                changePosition();

                //30일 해제
                checkoutInput.datepicker('option', 'maxDate', null);
                
                //마우스 오버효과를 위한 css 변경
                dpDiv.removeClass('datepicker-check-in-active datepicker-check-out-active');
                if (!checkinInput.is(':hidden') && !checkoutInput.is(':hidden')) dpDiv.addClass('datepicker-check-in-active'); //add 2.2.3 if 추가
            });

            //체크아웃 달력 열리기 직전 이벤트
            getPicker('checkout').datepicker('option', 'beforeShow', function (input, inst) {
                if (opts.beforeShow !== undefined) opts.beforeShow(input, inst);

                var checkinInput = getPicker('checkin');
                var checkoutInput = getPicker('checkout');

                //체크아웃 달력 체크인 달력과 같은 위치에 달력 표시
                changePosition();
                
                //체크아웃 선택 완료되면 체크인 이전 날짜 비활성화
                var checkinDate = new Date(getPickerDate('checkin'));

                //30일 제한
                var thirtyDate = ((opts.dynamicRange) ? new Date(checkinDate) : new Date());
                thirtyDate.setDate(thirtyDate.getDate() + opts.rangeLimit);
                checkoutInput.datepicker('option', 'maxDate', thirtyDate); //체크아웃 달력 변경됨

                //jquery ui 의 onSelect 콜백 발생시키는 로직 추출 수정
                //체크인 수정시 자동으로 체크아웃 수정되는 부분에서 체크아웃 수정 이벤트 강제 발생시켜 변경된 range를 알림
                if (checkoutInput.data('auto-open')) {
                    checkoutInput.removeData('auto-open');
                    if (opts.onSelect) {
                        var checkoutDate = $.datepicker.formatDate(opts.dateFormat, getPickerDate('checkout'), opts);
                        opts.onSelect.apply((inst.input ? inst.input[0] : null), [checkoutDate, inst]);
                    } else if (inst.input) {
                        inst.input.trigger('change'); // fire the change event
                    }
                }

                //최종 변경된 체크아웃 date 받기
                var checkoutDate = new Date(getPickerDate('checkout'));
                var sourceDate = new Date(checkinDate);
                sourceDate.setDate(sourceDate.getDate() + opts.startMaxDay);
                checkoutInput.datepicker('option', 'minDate', sourceDate); //체크인 포함한 이전날짜 비활성화

                //월이 넘어간 달력 체크인 기준으로 돌려놓기
                var showCurrentAtPos;
                if (checkinDate.getFullYear() === checkoutDate.getFullYear()) { //연도가 같으면 월로 비교
                    showCurrentAtPos = (checkinDate.getMonth() === checkoutDate.getMonth()) ? 0 : getMonthDistance(); //시작 월 관련
                } else { //연도가 다르면 비교할거 없음
                    showCurrentAtPos = 1;
                }
                checkoutInput.datepicker('option', 'showCurrentAtPos', showCurrentAtPos);

                //마우스 오버효과를 위한 css 변경
                dpDiv.removeClass('datepicker-check-in-active datepicker-check-out-active');
                if (!checkinInput.is(':hidden') && !checkoutInput.is(':hidden')) dpDiv.addClass('datepicker-check-out-active'); //add 2.2.3 if 추가
            });
        }

        //<!-- inline 전용 함수
        //inline range 초기 셋팅 //add 3.0
        function settingInlineRange(data) {
            var min = data.obj._getMinMaxDate(data.ins, 'min');

            if (opts.autoValue) { //add 3.1.0
                //최초 1회 셋팅
                datepickerTarget.data('checkin', min);

                //rangeDayCount 토대로 체크아웃 변경
                changeRange(rangeDayCount);
            }

            //날짜 선택 최상위 이벤트, beforeShowDay() 이전
            datepickerTarget.on('selectDay.wddo', function (e, data) {
                var year = parseInt(data.obj.getAttribute('data-year'));
                var month = parseInt(data.obj.getAttribute('data-month'));
                var date = parseInt(data.obj.textContent);

                var startDate = getPickerDate('checkin');
                var stopDate = getPickerDate('checkout');
                var clickDate = new Date(year, month, date);

                if (opts.onlyCheckout) stopDate = null; //add 3.1.3
                var isRangeMiddle = opts.rangeMiddleCount > 0 && opts.range; //add 4.0.0

                if (!isRangeMiddle) {
                    //1. 미정 이라 체크인만 있거나 || 체크인, 체크아웃 모두 존재하여 새로 설정하거나
                    //2. 체크인 고정인 opts.onlyCheckout 면 타지않음
                    if ((!opts.plan || startDate !== null && stopDate !== null) && !opts.onlyCheckout) {
                        //체크인 설정
                        datepickerTarget.data('checkin', clickDate).removeData('checkout');
                    } else if (startDate !== null && stopDate === null) { //체크인 존재
                        var distanceTime = startDate.getTime() - clickDate.getTime();

                        if (distanceTime > 0) { //체크인보다 이전날짜 선택 시 다시설정 루트 타도록 checkout 삭제
                            //체크인 설정
                            datepickerTarget.data('checkin', clickDate).removeData('checkout');
                        } else if (distanceTime < 0) {
                            //체크아웃 설정
                            datepickerTarget.data('checkout', clickDate);    
                        } else { //distanceTime === 0
                            //동일날 설정
                            if (opts.startMaxDay === 0) datepickerTarget.data('checkin', clickDate).data('checkout', clickDate); //add 3.1.0
                        }
                    } else if (startDate === null && stopDate === null) { //체크인 체크아웃 미설정 시
                        //range형
                        if (opts.range) {
                            datepickerTarget.data('checkin', clickDate);
                        } else {
                            //single형 //.ui-datepicker-current-day > .ui-state-active 에 의한 활성화 
                        }
                    }
                } else { //다구간 //add 4.0.0
                    middleCounter = 0; //getMiddleClass() 에서 체크를 위해 초기화 

                    var lastMiddleDate = getLastMiddleDate();
                    
                    if (lastMiddleDate === undefined) { //첫선택이면
                        addMiddelData(clickDate); //다구간 첫 설정        
                    } else { 
                        var distanceTime = lastMiddleDate.getTime() - clickDate.getTime();

                        if (
                            (distanceTime > 0) || //마지막 선택한 여정보다 앞 선택
                            (distanceTime <= 0 && middleDateArr.length >= opts.rangeMiddleCount + 2) || //마지막 선택한 여정보다 뒤이거나 같은 날선택 && 다구간 설정 갯수 오버시 
                            (distanceTime === 0 && getOverlapCountMiddleDate(clickDate) >= opts.rangeMiddleOverlapMax) // 다구간 같은날 중복갯수 오버시
                        ) {
                            removeMiddleData(); //다구간 삭제 
                        }

                        addMiddelData(clickDate); //다구간 설정
                    }
                }
            });
        }

        //마지막 설정한 다구간 date 반환 함수 //add 4.0.0
        function getLastMiddleDate() {
            var returnDate;

            if (middleDateArr.length > 0) {
                returnDate = middleDateArr[middleDateArr.length - 1];
            }

            return returnDate;
        }

        //인자로 받은 date 객체와 같은 날짜가 다구간배열에 몇개인지 갯수 반환하는 함수 //add 4.0.0
        function getOverlapCountMiddleDate(date) {
            return middleDateArr.reduce(function (obj, val, idx, array) {
                obj[val] = ++obj[val] || 1;

                return obj;
            }, {})[date];
        }

        //다구간배열 middleDateArr 에 date 추가 (middleDateArr 처음과 마지막이 checkin, checkout 같음)
        //getRangeClass() 에서의 .datepicker-check-in-active .datepicker-check-out-active 설정을 위해 data('checkin'), data('checkout') 설정
        function addMiddelData(date) { //add 4.0.0
            middleDateArr.push(date);
            datepickerTarget.data('middle' + middleDateArr.length, date);

            if (middleDateArr.length === 1) datepickerTarget.data('checkin', middleDateArr[0]);
            if (middleDateArr.length > 1) datepickerTarget.data('checkout', middleDateArr[middleDateArr.length - 1]);
        }

        //다구간 설정된 배열, data 삭제 //add 4.0.0
        function removeMiddleData() {
            var i = 0;
            var count = middleDateArr.length;

            while (count--) {
                datepickerTarget.removeData('middle' + (count + 1));
                middleDateArr.pop();
            }

            datepickerTarget.removeData('checkin').removeData('checkout');

            middleCounter = 0;
        }

        //체크아웃 달력 체크인 달력과 같은 위치에 달력 표시
        function changePosition() {
            if (opts.positionSync && !getPicker('checkin').is(':hidden') && !getPicker('checkout').is(':hidden')) { //add 2.2.3 //modify 3.0.2
                $.datepicker._pos = [getPicker('checkin').offset().left, getPicker('checkout').offset().top];
                $.datepicker._pos[1] += datepickerTarget.get(1).offsetHeight;    
            }
        }

        /**
         * 체크인 변경하고 isTogether 인자를 통해 startDate + rangeDayCount 만큼 더하여 체크아웃 변경
         * 
         * @param  {Date} startDate - 체크인 설정할 Date 객체
         * @param  {Boolean} isTogether - checkout 함께 변경 유무, false 이면 체크인만 변경
         */
        function changeRangeDay(startDate, isTogether) { //modify 3.0.4
            var sourceDate = new Date(startDate);

            getPicker('checkin').datepicker('changeDate', startDate);

            //초기셋팅(undefined)면 무조건 실행, 체크인이면 체크아웃 달력 변경 안함
            if (isTogether) {
                sourceDate.setDate(startDate.getDate() + rangeDayCount); //기본 2 (2박 3일), rangeDayCount 는 changeRangeCount()에 의해 변경
                getPicker('checkout').datepicker('changeDate', sourceDate);
            }
        }
        
        //월의 간격 반환
        function getMonthDistance() {
            var startDate = getPickerDate('checkin');
            var stopDate = getPickerDate('checkout');

            var year1 = startDate.getFullYear();
            var year2 = stopDate.getFullYear();
            var month1 = startDate.getMonth();
            var month2 = stopDate.getMonth();

            return 12 * (year2 - year1) + (month2 - month1);
        }
        //--> input 전용 함수

        /**
         * 목표 Date 객체 반환
         * 
         * @param  {Date} sourceDate - 기준날짜
         * @param  {String | Number} value - 목표날짜
         * @return {Date}
         */
        function getTargetDate(sourceDate, value) {
            var pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;
            var matches = pattern.exec(value); //["11m", "11", "m", index: 0, input: "11m"] , ["1", "1", undefined, index: 0, input: "1"]

            if (matches === null) return;

            var year = sourceDate.getFullYear(),
                month = sourceDate.getMonth(),
                day = sourceDate.getDate();

            switch (matches[2] || 'd') { //undefined 이면 기본 'd', value가 number 면 일수로 증가
                case 'd' : case 'D' :
                    day += parseInt(matches[1]);
                    break;
                case 'w' : case 'W' :
                    day += parseInt(matches[1]) * 7;
                    break;
                case 'm' : case 'M' :
                    month += parseInt(matches[1]);
                    day = Math.min(day, datepickerData.obj._getDaysInMonth(year, month));
                    break;
                case 'y': case 'Y' :
                    year += parseInt(matches[1]);
                    day = Math.min(day, datepickerData.obj._getDaysInMonth(year, month));
                    break;
                default :
            }

            return new Date(year, month, day);
        }
        
        /**
         * @return {Date} - datepicker 옵션 minDate 의 Date 객체 반환 ( data.obj._getMinMaxDate 대체 ) //add 3.0.4
         */
        function getMinDateObject() {
            return getTargetDate(new Date(), datepickerTarget.datepicker('option', 'minDate'));
        }

        /**
         * @return {Date} - datepicker 옵션 maxDate 의 Date 객체 반환 ( data.obj._getMinMaxDate 대체 ) //add 3.0.4
         */
        function getMaxDateObject() {
            return getTargetDate(new Date(), datepickerTarget.datepicker('option', 'maxDate'));
        }

        /**
         * 목표 Date 객체를 현재 설정된 minDate, maxDate 벋어나지 않도록 체크하야 Date 객체 반환 //add 3.0.4
         * 
         * @param  {String} ['min' | 'max'] - 설정할 한계 종류
         * @param  {Date} targetDate - 설정하고자 하는 Date
         * @return {Date} returnDate - 설정된 한계 Date
         */
        function getMinMaxDate(kind, targetDate) {
            var limitDate; //한계 date
            var returnDate; //반환 date

            if (kind === 'min') {
                limitDate = getMinDateObject();

                //minDate 보다 작으면
                returnDate = (limitDate !== undefined && targetDate.getTime() - limitDate.getTime() < 0) ? limitDate : targetDate;
            } else if (kind === 'max') {
                limitDate = getMaxDateObject();

                //maxDate 보다 크면
                returnDate = (limitDate !== undefined && targetDate.getTime() - limitDate.getTime() > 0) ? limitDate : targetDate;
            }

            return returnDate;
        }

        //Date 객체인지 유무반환 //add 4.0.0
        function checkDate(value) {
            return (value instanceof Date && !isNaN(value.valueOf()));
        }

        //배열값들 Date 객체만 남겨 새로운 배열 반환 //add 4.0.0
        function checkDateformArray(arr) {
            var newArr = [];
            arr.forEach(function(currentValue, index, array) {
                if (checkDate(currentValue)) newArr.push(currentValue);
            });

            return newArr;
        }

        //달력 박수 변경(셀렉트 변경 아님)
        function changeRange(value) {
            var startDate = getPickerDate('checkin');

            //range 변경을 요하는데 startDate 가 autoValue:false 로 인해 정의가 안되어 있다면 오늘날로 임시 셋팅 후 startDate 변수에 반환 저장 //add 2.2.1
            if (startDate === null) {
                getPicker('checkin').datepicker('changeDate', new Date());
                startDate = getPickerDate('checkin');
            }

            var stopDate; //체크아웃 date

            //체크아웃 Date 객체 정의 
            if (!$.isArray(value)) { //배열 형태가 아니면 //add 4.0.0
                if (checkDate(value)) { //date 형태이면 //date 형태 인지 유무 //add 3.0.4
                    stopDate = value; //maxDate 한계에 넘지 않는 선에서 Date 선택 //add 3.0.4
                } else {
                    stopDate = getTargetDate(startDate, value); //value에 맞는 Date 객체 설정 //modify 3.0.4 //modify 4.0.0 getMinMaxDate() 체크
                }
            } else { //배열 행태 이면
                value = checkDateformArray(value);
                value.sort(function(a, b) { //날짜 오름차순으로 정렬
                    return a - b;
                });

                stopDate = value[value.length - 1];
            }

            stopDate = getMinMaxDate('max', stopDate);

            if (startDate.getTime() > stopDate.getTime()) return; //range 는 startDate 이전 날짜 설정 불가
            
            //다구간 인지 구분하여 다구간 배열에 저장 후 stopDate 지정 //add 4.0.0
            if (opts.rangeMiddleCount > 0) {
                middleCounter = 0;

                if ($.isArray(value)) { //배열형태로 value 전달 받았을 때
                    middleDateArr = value;
                    middleDateArr.unshift(startDate);
                } else { //Date
                    middleDateArr = [startDate, stopDate];
                }

                //xxx
                //배열안 Date 값들이 날짜 순서가 꼬였을때 정렬
                //배열안 값이 Date 값이 아닐때 처리
            }

            //달력에 체크아웃 설정
            if (datepickerTarget.is('input')) { //input 타입
                getPicker('checkout').datepicker('changeDate', stopDate);    
            } else {//inline 타입
                getPicker('checkout').data('checkout', stopDate);    
            }

            //rangeDayCount 업데이트
            changeRangeCount(); //opts.rangeDay 기본값을 변경된 stopDate 값을 토대로 range 길이 다시 결정하고

            if (datepickerTarget.is('input')) {
                changeRangeDay(startDate, true); //체크인 달력 기준으로 체크아웃 변경
            } else {
                selectDate(stopDate, datepickerTarget); //체크아웃 날짜를 달력 선택 날짜로 변경 (datepicker('getDate') 하면 체크아웃 날짜가 반환) //add 3.0.5
            }
        }

        //range 길이를 결정하는 rangeDayCount 계산하는 함수
        function changeRangeCount() {
            var startDate = getPickerDate('checkin');
            var stopDate = getPickerDate('checkout');

            if (startDate !== null && stopDate !== null) {
                var day = 60 * 60 * 24 * 1000; // 하루의 밀리초단위 값 
                var gapTime = Math.floor((stopDate.getTime() - startDate.getTime()) / day);

                rangeDayCount = gapTime;
            }
        }

        //디자인 셀렉트박스 정의
        function initSelectBox(data) {
            //셀렉트 박스가 만들어 졌으니 update.wddo 가 발생해도 container.find('.pb_select').length > 0 으로 접근 금지
            if (container.find('.pb_select').length > 0) return;

            if (selectBox !== undefined) {
                selectBox.getTarget().off('change.selectbox');
                selectBox.dispose();
            }

            var min = data.obj._getMinMaxDate(data.ins, 'min'); //datepicker 달력 에서 minDate 받기
            var max = data.obj._getMinMaxDate(data.ins, 'max'); //datepicker 달력 에서 maxDate 받기

            var sourceDate = (min !== null) ? new Date(min) : new Date(); //datepicker 에서 받온 minDate 로 설정하거나, 오늘 날짜 기준
            var maxDate, targetDate;
            if (max !== null) {
                targetDate = new Date(max); //datepicker에서 받다온 maxDate 로 설정
                targetDate.setMonth(max.getMonth() + 1);
            } else {
                targetDate = new Date(sourceDate);
                targetDate.setMonth(sourceDate.getMonth() + 12);  //maxDate 설정 없으면 1년
                
            }

            maxDate = targetDate; //위에서 계산된 maxDate 설정

            //새로운 select 그리기
            var year = container.find('.ui-datepicker-year');
            var month = container.find('.ui-datepicker-month');
            var selectBoxDiv = $('<div class="pb_select"><select></select></div>');

            var select = selectBoxDiv.find('select');
            var yearValue, monthValue, selected;

            do {
                //value 값 결정
                yearValue = sourceDate.getFullYear();
                monthValue = sourceDate.getMonth();
                
                //selected 결정, datepicker 에서 draw 시킨 기준으로 selected 속성 적용
                selected = (data.ins.drawYear === sourceDate.getFullYear() && data.ins.drawMonth === sourceDate.getMonth()) ? 'selected' : ''

                //결정된 정보 토대로 그리기
                select.append('<option value="' + yearValue + opts.yearSuffix + monthValue + '" ' + selected + '>' + yearValue + opts.yearSuffix + Util.getForce2Digits(monthValue + 1) + '</option>');

                //월 +1 시켜 반복문 순환
                sourceDate.setMonth(sourceDate.getMonth() + 1);
            } while (!(sourceDate.getFullYear() === maxDate.getFullYear() && sourceDate.getMonth() === maxDate.getMonth()))
         
            month.after(selectBoxDiv);

            //option 변경으로 update.wddo 이벤트가 발생되지만 함수 상위 length > 0 return 으로 접근 못함
            //maxDate 미 설정시 12개월 한정 지었으니 달력 maxDate 설정 변경
            if (max === null) datepickerTarget.datepicker('option', 'maxDate', '11m');

            //기준 셀렉트 숨김
            year.hide();
            month.hide();

            //디자인 셀렉트 박스 생성
            var defaultSelectedIndex;
            selectBox = new Selectbox(select, {height:200, multiText: '/sp/', disabledClass: 'disable', chooseClass: 'on', complete: function () {
                defaultSelectedIndex = selectBox.getIndex();
            }});
            selectBox.init();

            //디자인 selectbox 변경 이벤트
            selectBox.getTarget().on('change.selectbox', function (e, param) {
                var arr = [];

                if (param.value !== undefined && typeof param.value === 'string') {
                    arr = param.value.split(opts.yearSuffix); //년월 분리
                }

                //년월이 정상적으로 있으면
                if (arr.length > 1) {
                    //console.log(parseInt(arr[0]), parseInt(arr[1]));
                    
                    //jquery ui의 _selectMonthYear()를 수정하여 호출
                    data.ins.selectedYear = data.ins.drawYear = parseInt(arr[0]);
                    data.ins.selectedMonth = data.ins.drawMonth = parseInt(arr[1]);

                    data.obj._notifyChange(data.ins);
                    data.obj._adjustDate(datepickerTarget);
                }
            });
        }

        //ie7 대응
        function ie7Fix() {
            var table = container.find('.ui-datepicker-calendar');

            table.attr({
                'border' : 0,
                'cellspacing' : 0,
                'cellpadding' : 0
            });
        }

        //일 선택 변경
        function selectDay(_date, _target) {
            var target = _target || datepickerTarget;
            var ins = target.data('datepicker');

            ins.currentYear = _date.getFullYear();
            ins.currentMonth = _date.getMonth();
            ins.currentDay = _date.getDate();
        }

        //월 전체 선택
        function selectMonthActive(group) {
            clearDateActive(); //일 활성화 전부 삭제

            container.find('td.on').removeClass('on'); //멀티 달력끼리 중복 on 방지
            group.find('a').parent().addClass('on'); //해당 달력 모두 활성화 
        }

        //일 활성화 전부 삭제
        function clearDateActive() {
            container.find('.ui-datepicker-current-day').removeClass('ui-datepicker-current-day').find('> a').removeClass('ui-state-active ui-state-highlight ui-state-hover');
        }

        //달력 date 변경
        function changeDate(_date, _target) {
            var target = _target || datepickerTarget;
            var startDate = _date;

            //add 3.0.4
            if (target.is('div')/* && opts.range*/) {  //인라인 형태 체크인 설정  //&& 'opts.range' 삭제 del 3.1.1
                startDate = getMinMaxDate('min', startDate); //minDate 한계치 안에서 startDate 설정

                if (opts.rangeMiddleCount === 0) { 
                    target.data('checkin', startDate).removeData('checkout'); //inline 전용 data('checkin') 설정 및 기존 data('checkout') 삭제 
                } else {
                    removeMiddleData();
                    addMiddelData(startDate);
                }

                selectDate(_date, _target); //체크인 날짜를 달력 선택 날짜로 변경 (datepicker('getDate') 하면 체크인 날짜가 반환) //add 3.0.5
                
                if (opts.range) triggerRange(); //인라인 전용 외부 호출 함수 //add 3.0.9 //(opts.range) 추가 modify 3.1.1
            } else {
                target.datepicker('changeDate', startDate); //전체 달력 상태 변경
            }
        }

        //인라인 전용 체크인 & 아웃 date 외부로 던져줄 opts.onRange 발생 시키는 함수
        function triggerRange() {
            if (opts.onRange !== undefined) {
                var arr = [];

                if (opts.rangeMiddleCount === 0) { 
                    //modify 4.0.0 //저장되있는 Date 객체만큼 반환하도록 수정
                    [getPickerDate('checkin'), getPickerDate('checkout')].forEach(function (value) {
                        if (value !== null) arr.push($.datepicker.formatDate(opts.dateFormat,value, opts));
                    });
                } else {
                    //add 4.0.0 //저장되이었는 middle Date 객체 배열 저장하여 반환
                    arr = middleDateArr.map(function (value) {
                        return $.datepicker.formatDate(opts.dateFormat, value, opts);
                    });
                }

                //인라인 전용 외부 호출 함수
                opts.onRange(arr);
            }
        }

        //달력 .datepicker('getDate' 시 반환할 date 객체의 값을 바꿔주는 함수, ui-datepicker-current-day, ui-state-active 삭제되었다가 'refresh' 에 의해 update.wddo 이벤트 다시타 재정의 됨
        function selectDate(_date, _target) {
            var target = _target || datepickerTarget;
            selectDay(_date, _target);

            clearDateActive();
            target.datepicker('refresh');
        }

        //대상 반환 //add 3.0
        function getPicker(kind) {
            var returnTarget;

            switch (kind) {
                case 'checkin' :
                    returnTarget = (datepickerTarget.is('input') && datepickerTarget.length > 0) ? datepickerTarget.filter(':first') : datepickerTarget;
                    break;
                case 'checkout' :
                    returnTarget = (datepickerTarget.is('input') && datepickerTarget.length > 1) ? datepickerTarget.filter(':last') : datepickerTarget;
                    break;
                default :
            }

            return returnTarget;
        }

        function getPickerDate(kind) {
            var target = getPicker(kind);
            
            return (target.is('input')) ? target.datepicker('getDate') : (target.data(kind)) || null;
        }

        return {
            init : function (target, options) {
                scope = this;

                init(target, options);
            },

            dispose : function () {
                datepickerTarget.datepicker('destroy').off('.wddo .calendar').removeAttr('id');
                datepickerTarget.removeData('scope').removeData('checkin').removeData('checkout');
            },

            setDate : function (_date, _target) {
                changeDate(_date, _target);
            },

            setSelect : function (_date, _target) {
                selectDate(_date, _target);
            },

            setSelectAll : function (_date) {
                container.find('.ui-datepicker-group').each(function () {
                    var yearStr = $(this).find('.ui-datepicker-year').text();
                    var monthStr = parseInt($(this).find('.ui-datepicker-month').text()).toString();
                    
                    if (yearStr === String(_date.getFullYear()) &&  monthStr === String(_date.getMonth()+1)) {
                        selectDay(_date);

                        selectMonthActive($(this));
                    }
                });
            },

            setRange : function (value) {
                if (opts.rangeSelect !== undefined && opts.rangeSelect.length > 0) {
                    //박수 셀렉트가 있는 경우 셀렉트 변경하여 checkout 달력 변경
                    if (opts.rangeSelect.find('> option[value="' + value + '"]').length > 0) opts.rangeSelect.val(value).trigger('change');
                } else {
                    //박수가 없는경우 직접 checkout 달력 변경
                    changeRange(value);
                }
            },

            getRange : function () {
                return rangeDayCount;
            },

            getSelectBox : function () {
                return selectBox;
            },

            setPlan : function (value) { //미정 유무 변경 (inline 전용) //add 3.1.0
                opts.plan = value;

                if (value) {
                    datepickerTarget.removeData('checkout'); //미정 체류기간을 해제하면 출국일 선택 상태로 변경을 위해 //add 3.1.2     
                } else {
                    if (opts.rangeSelect.length > 0) opts.rangeSelect.trigger('change'); 
                }
                
                selectDate(getPickerDate('checkin'), datepickerTarget);
            },

            getOptions : function () {
                return opts;
            },

            package: 'Hanatour.jq.ui.calendar'
        };
    };

    return wddoObj;
}(jQuery));

//get instance
if (jQuery.fn.getInstance === undefined) jQuery.fn.getInstance = function () { return this.data('scope'); };