/**
 *
 * Date picker
 * Author: Stefan Petre www.eyecon.ro
 * 
 * Dual licensed under the MIT and GPL licenses
 * 
 */
 var stTooltip = "<div class='startTooltip tooltip'>출발일</div>";
 var stTooltip = "<div class='startTooltip tooltip'>출발일</div>";
 var mdTooltip = "<div class='mdTooltip tooltip'>중간일</div>";
 var enTooltip = "<div class='endTooltip tooltip'>귀국일</div>";
 var tooltip = "<div class='tooltip'></div>";
(function ($) {
	var DatePicker = function () {
		var	ids = {},
			views = {
				years: 'datepickerViewYears',
				moths: 'datepickerViewMonths',
				days: 'datepickerViewDays'
			},
			tpl = {
				wrapper: '<div class="datepicker"><div class="datepickerContainer"><table cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></table></div></div>',
				head: [
					'<tr><td>',
					'<table cellspacing="0" cellpadding="0">',
						'<thead>',
							'<tr>',
								'<th class="datepickerGoPrev"></th>',
								'<th colspan="7" class="datepickerMonth"><span class="month"></span><span class="year"></span></th>',
								'<th class="datepickerGoNext"></th>',
							'</tr>',
							'<tr class="datepickerDoW">',
								'<th><span><%=week%></span></th>',
								'<th><span><%=day1%></span></th>',
								'<th><span><%=day2%></span></th>',
								'<th><span><%=day3%></span></th>',
								'<th><span><%=day4%></span></th>',
								'<th><span><%=day5%></span></th>',
								'<th><span><%=day6%></span></th>',
								'<th><span><%=day7%></span></th>',
							'</tr>',
						'</thead>',
					'</table></td></tr>'
				],
				space : '<td class="datepickerSpace"><div></div></td>',
				days: [
					'<tbody class="datepickerDays">',
						'<tr>',
							'<th class="datepickerWeek"><a href="#"><span><%=weeks[0].week%></span></a></th>',
							'<td id="<%=weeks[0].days[0].date%>" class="<%=weeks[0].days[0].classname%>"><a href="#"><span data-val="<%=weeks[0].days[0].val%>"><%=weeks[0].days[0].text%></span></a></td>',
							'<td id="<%=weeks[0].days[1].date%>" class="<%=weeks[0].days[1].classname%>"><a href="#"><span data-val="<%=weeks[0].days[1].val%>"><%=weeks[0].days[1].text%></span></a></td>',
							'<td id="<%=weeks[0].days[2].date%>" class="<%=weeks[0].days[2].classname%>"><a href="#"><span data-val="<%=weeks[0].days[2].val%>"><%=weeks[0].days[2].text%></span></a></td>',
							'<td id="<%=weeks[0].days[3].date%>" class="<%=weeks[0].days[3].classname%>"><a href="#"><span data-val="<%=weeks[0].days[3].val%>"><%=weeks[0].days[3].text%></span></a></td>',
							'<td id="<%=weeks[0].days[4].date%>" class="<%=weeks[0].days[4].classname%>"><a href="#"><span data-val="<%=weeks[0].days[4].val%>"><%=weeks[0].days[4].text%></span></a></td>',
							'<td id="<%=weeks[0].days[5].date%>" class="<%=weeks[0].days[5].classname%>"><a href="#"><span data-val="<%=weeks[0].days[5].val%>"><%=weeks[0].days[5].text%></span></a></td>',
							'<td id="<%=weeks[0].days[6].date%>" class="<%=weeks[0].days[6].classname%>"><a href="#"><span data-val="<%=weeks[0].days[6].val%>"><%=weeks[0].days[6].text%></span></a></td>',
						'</tr>',
						'<tr>',
							'<th class="datepickerWeek"><a href="#"><span><%=weeks[1].week%></span></a></th>',
							'<td id="<%=weeks[1].days[0].date%>" class="<%=weeks[1].days[0].classname%>"><a href="#"><span data-val="<%=weeks[1].days[0].val%>"><%=weeks[1].days[0].text%></span></a></td>',
							'<td id="<%=weeks[1].days[1].date%>" class="<%=weeks[1].days[1].classname%>"><a href="#"><span data-val="<%=weeks[1].days[1].val%>"><%=weeks[1].days[1].text%></span></a></td>',
							'<td id="<%=weeks[1].days[2].date%>" class="<%=weeks[1].days[2].classname%>"><a href="#"><span data-val="<%=weeks[1].days[2].val%>"><%=weeks[1].days[2].text%></span></a></td>',
							'<td id="<%=weeks[1].days[3].date%>" class="<%=weeks[1].days[3].classname%>"><a href="#"><span data-val="<%=weeks[1].days[3].val%>"><%=weeks[1].days[3].text%></span></a></td>',
							'<td id="<%=weeks[1].days[4].date%>" class="<%=weeks[1].days[4].classname%>"><a href="#"><span data-val="<%=weeks[1].days[4].val%>"><%=weeks[1].days[4].text%></span></a></td>',
							'<td id="<%=weeks[1].days[5].date%>" class="<%=weeks[1].days[5].classname%>"><a href="#"><span data-val="<%=weeks[1].days[5].val%>"><%=weeks[1].days[5].text%></span></a></td>',
							'<td id="<%=weeks[1].days[6].date%>" class="<%=weeks[1].days[6].classname%>"><a href="#"><span data-val="<%=weeks[1].days[6].val%>"><%=weeks[1].days[6].text%></span></a></td>',
						'</tr>',
						'<tr>',
							'<th class="datepickerWeek"><a href="#"><span><%=weeks[2].week%></span></a></th>',
							'<td id="<%=weeks[2].days[0].date%>" class="<%=weeks[2].days[0].classname%>"><a href="#"><span data-val="<%=weeks[2].days[0].val%>"><%=weeks[2].days[0].text%></span></a></td>',
							'<td id="<%=weeks[2].days[1].date%>" class="<%=weeks[2].days[1].classname%>"><a href="#"><span data-val="<%=weeks[2].days[1].val%>"><%=weeks[2].days[1].text%></span></a></td>',
							'<td id="<%=weeks[2].days[2].date%>" class="<%=weeks[2].days[2].classname%>"><a href="#"><span data-val="<%=weeks[2].days[2].val%>"><%=weeks[2].days[2].text%></span></a></td>',
							'<td id="<%=weeks[2].days[3].date%>" class="<%=weeks[2].days[3].classname%>"><a href="#"><span data-val="<%=weeks[2].days[3].val%>"><%=weeks[2].days[3].text%></span></a></td>',
							'<td id="<%=weeks[2].days[4].date%>" class="<%=weeks[2].days[4].classname%>"><a href="#"><span data-val="<%=weeks[2].days[4].val%>"><%=weeks[2].days[4].text%></span></a></td>',
							'<td id="<%=weeks[2].days[5].date%>" class="<%=weeks[2].days[5].classname%>"><a href="#"><span data-val="<%=weeks[2].days[5].val%>"><%=weeks[2].days[5].text%></span></a></td>',
							'<td id="<%=weeks[2].days[6].date%>" class="<%=weeks[2].days[6].classname%>"><a href="#"><span data-val="<%=weeks[2].days[6].val%>"><%=weeks[2].days[6].text%></span></a></td>',
						'</tr>',
						'<tr>',
							'<th class="datepickerWeek"><a href="#"><span><%=weeks[3].week%></span></a></th>',
							'<td id="<%=weeks[3].days[0].date%>" class="<%=weeks[3].days[0].classname%>"><a href="#"><span data-val="<%=weeks[3].days[0].val%>"><%=weeks[3].days[0].text%></span></a></td>',
							'<td id="<%=weeks[3].days[1].date%>" class="<%=weeks[3].days[1].classname%>"><a href="#"><span data-val="<%=weeks[3].days[1].val%>"><%=weeks[3].days[1].text%></span></a></td>',
							'<td id="<%=weeks[3].days[2].date%>" class="<%=weeks[3].days[2].classname%>"><a href="#"><span data-val="<%=weeks[3].days[2].val%>"><%=weeks[3].days[2].text%></span></a></td>',
							'<td id="<%=weeks[3].days[3].date%>" class="<%=weeks[3].days[3].classname%>"><a href="#"><span data-val="<%=weeks[3].days[3].val%>"><%=weeks[3].days[3].text%></span></a></td>',
							'<td id="<%=weeks[3].days[4].date%>" class="<%=weeks[3].days[4].classname%>"><a href="#"><span data-val="<%=weeks[3].days[4].val%>"><%=weeks[3].days[4].text%></span></a></td>',
							'<td id="<%=weeks[3].days[5].date%>" class="<%=weeks[3].days[5].classname%>"><a href="#"><span data-val="<%=weeks[3].days[5].val%>"><%=weeks[3].days[5].text%></span></a></td>',
							'<td id="<%=weeks[3].days[6].date%>" class="<%=weeks[3].days[6].classname%>"><a href="#"><span data-val="<%=weeks[3].days[6].val%>"><%=weeks[3].days[6].text%></span></a></td>',
						'</tr>',
						'<tr>',
							'<th class="datepickerWeek"><a href="#"><span><%=weeks[4].week%></span></a></th>',
							'<td id="<%=weeks[4].days[0].date%>" class="<%=weeks[4].days[0].classname%>"><a href="#"><span data-val="<%=weeks[4].days[0].val%>"><%=weeks[4].days[0].text%></span></a></td>',
							'<td id="<%=weeks[4].days[1].date%>" class="<%=weeks[4].days[1].classname%>"><a href="#"><span data-val="<%=weeks[4].days[1].val%>"><%=weeks[4].days[1].text%></span></a></td>',
							'<td id="<%=weeks[4].days[2].date%>" class="<%=weeks[4].days[2].classname%>"><a href="#"><span data-val="<%=weeks[4].days[2].val%>"><%=weeks[4].days[2].text%></span></a></td>',
							'<td id="<%=weeks[4].days[3].date%>" class="<%=weeks[4].days[3].classname%>"><a href="#"><span data-val="<%=weeks[4].days[3].val%>"><%=weeks[4].days[3].text%></span></a></td>',
							'<td id="<%=weeks[4].days[4].date%>" class="<%=weeks[4].days[4].classname%>"><a href="#"><span data-val="<%=weeks[4].days[4].val%>"><%=weeks[4].days[4].text%></span></a></td>',
							'<td id="<%=weeks[4].days[5].date%>" class="<%=weeks[4].days[5].classname%>"><a href="#"><span data-val="<%=weeks[4].days[5].val%>"><%=weeks[4].days[5].text%></span></a></td>',
							'<td id="<%=weeks[4].days[6].date%>" class="<%=weeks[4].days[6].classname%>"><a href="#"><span data-val="<%=weeks[4].days[6].val%>"><%=weeks[4].days[6].text%></span></a></td>',
						'</tr>',
						'<tr>',
							'<th class="datepickerWeek"><a href="#"><span><%=weeks[5].week%></span></a></th>',
							'<td id="<%=weeks[5].days[0].date%>" class="<%=weeks[5].days[0].classname%>"><a href="#"><span data-val="<%=weeks[5].days[0].val%>"><%=weeks[5].days[0].text%></span></a></td>',
							'<td id="<%=weeks[5].days[1].date%>" class="<%=weeks[5].days[1].classname%>"><a href="#"><span data-val="<%=weeks[5].days[1].val%>"><%=weeks[5].days[1].text%></span></a></td>',
							'<td id="<%=weeks[5].days[2].date%>" class="<%=weeks[5].days[2].classname%>"><a href="#"><span data-val="<%=weeks[5].days[2].val%>"><%=weeks[5].days[2].text%></span></a></td>',
							'<td id="<%=weeks[5].days[3].date%>" class="<%=weeks[5].days[3].classname%>"><a href="#"><span data-val="<%=weeks[5].days[3].val%>"><%=weeks[5].days[3].text%></span></a></td>',
							'<td id="<%=weeks[5].days[4].date%>" class="<%=weeks[5].days[4].classname%>"><a href="#"><span data-val="<%=weeks[5].days[4].val%>"><%=weeks[5].days[4].text%></span></a></td>',
							'<td id="<%=weeks[5].days[5].date%>" class="<%=weeks[5].days[5].classname%>"><a href="#"><span data-val="<%=weeks[5].days[5].val%>"><%=weeks[5].days[5].text%></span></a></td>',
							'<td id="<%=weeks[5].days[6].date%>" class="<%=weeks[5].days[6].classname%>"><a href="#"><span data-val="<%=weeks[5].days[6].val%>"><%=weeks[5].days[6].text%></span></a></td>',
						'</tr>',
					'</tbody>'
				],
				months: [
					'<tbody class="<%=className%>">',
						'<tr>',
							'<td colspan="2"><a href="#"><span><%=data[0]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[1]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[2]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[3]%></span></a></td>',
						'</tr>',
						'<tr>',
							'<td colspan="2"><a href="#"><span><%=data[4]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[5]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[6]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[7]%></span></a></td>',
						'</tr>',
						'<tr>',
							'<td colspan="2"><a href="#"><span><%=data[8]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[9]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[10]%></span></a></td>',
							'<td colspan="2"><a href="#"><span><%=data[11]%></span></a></td>',
						'</tr>',
					'</tbody>'
				]
			},
			defaults = {
				flat: false,
				starts: 1,
				prev: '&#9664;',
				next: '&#9654;',
				lastSel: false,
				mode: 'single',
				view: 'days',
				calendars: 1,
				format: 'Y-m-d',
				position: 'bottom',
				eventName: 'click',
				setDate: null,
				isSel: false,
				onRender: function(){return {};},
				onAfterRender: function(){},
				onChange: function(){return true;},
				onShow: function(){return true;},
				onBeforeShow: function(){return true;},
				onHide: function(){return true;},
				locale: {
					days: ["일", "월", "화", "수", "목", "금", "토", "일"],
					daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
					daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
					months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
					monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
					weekMin: 'wk'
				}
			},
			fillRang = function(el){
				var options = $(el).data('datepicker');

				var tmp = new Date(options.date[0]);
				var sDate = parseInt(formatDate(tmp, "Ymd"));

				tmp = new Date(options.date[1]);
				var mDate = parseInt(formatDate(tmp, "Ymd"));
				for(i = sDate; i <= mDate; i++){
					$("#"+i).addClass("datepickerSelected");
				}


				if(options.mode == "range3"){
					tmp = new Date(options.date[2]);
					var eDate = parseInt(formatDate(tmp, "Ymd"));
					for(i = mDate; i <= eDate; i++){
						$("#"+i).addClass("datepickerSelected");
					}
				}
				
				options.onChange.apply(this, prepareDate(options));
			},
			fill = function(el) {
				var currDate, nowDate, dimCls;
				var options = $(el).data('datepicker');
				var cal = $(el);
				var currentCal = 0, date, data, dow, month, cnt = 0, week, days, indic, indic2, html, tblCal;
				cal.find('td>table tbody').remove();
				date = new Date();
				currDate = formatDate(date, "Ymd");
				if(options.setDate != null){
					var cDate = parseDate(options.setDate, options.format);
					currDate = formatDate(new Date(cDate), "Ymd");
				}

				for (var i = 0; i < options.calendars; i++) {
					date = new Date(options.current);
					date.addMonths(-currentCal + i);
					tblCal = cal.find('table').eq(i+1);
					switch (tblCal[0].className) {
						case 'datepickerViewDays':
							dow = formatDate(date, 'B, Y');
							break;
						case 'datepickerViewMonths':
							dow = date.getFullYear();
							break;
						case 'datepickerViewYears':
							dow = (date.getFullYear()-6) + ' - ' + (date.getFullYear()+5);
							break;
					} 
					if(i == 0){
						tblCal.find('thead tr:first .datepickerMonth').addClass("first");
						tblCal.find('thead tr:first th:eq(1) span.year').addClass("first").text(date.getFullYear());
						tblCal.find('thead tr:first th:eq(1) span.month').addClass("first").text(formatDate(date, 'm'));
					}
					else{
						tblCal.find('thead tr:first th:eq(1) span.year').text(date.getFullYear());
						tblCal.find('thead tr:first th:eq(1) span.month').text(formatDate(date, 'm'));
					}
					dow = date.getFullYear()-6;
					data = {
						data: [],
						className: 'datepickerYears'
					}
					for ( var j = 0; j < 12; j++) {
						data.data.push(dow + j);
					}
					html = tmpl(tpl.months.join(''), data);
					date.setDate(1);
					data = {weeks:[], test: 10};
					month = date.getMonth();
					var dow = (date.getDay() - options.starts) % 7;
					date.addDays(-(dow + (dow < 0 ? 7 : 0)));
					week = -1;
					cnt = 0;
					while (cnt < 42) {
						indic = parseInt(cnt/7,10);
						indic2 = cnt%7;
						if (!data.weeks[indic]) {
							week = date.getWeekNumber();
							data.weeks[indic] = {
								week: week,
								days: []
							};
						}

						
						dimCls = "";
						nowDate = formatDate(date, "Ymd");
						if(nowDate < currDate)
							dimCls = "dim";


						var disMonth = "";
						if(dimCls != "dim" && date.getDate() == 1){
							var m = date.getMonth()+1;
							disMonth = m+"월";
							disMonth = "<div class='disMonth'><div>"+disMonth+"</div></div>";
						}

						data.weeks[indic].days[indic2] = {
							text: date.getDate()+disMonth,
							classname: [dimCls],
							date: nowDate,
							val: date.getDate()
						};



						if (month != date.getMonth()) {
							data.weeks[indic].days[indic2].classname.push('datepickerNotInMonth');
							data.weeks[indic].days[indic2].date = '';
						}
						if (date.getDay() == 0) {
							data.weeks[indic].days[indic2].classname.push('datepickerSunday');
						}
						if (date.getDay() == 6) {
							data.weeks[indic].days[indic2].classname.push('datepickerSaturday');
						}
						var fromUser = options.onRender(date);
						var val = date.valueOf();
						if (fromUser.selected || options.date == val 
							|| $.inArray(val, options.date) > -1 
							|| (options.mode == 'range' && val >= options.date[0] && val <= options.date[1])) {
							data.weeks[indic].days[indic2].classname.push('datepickerSelected');

						}

						var tmpDate = new Date();
						var tmpToday = formatDate(tmpDate, "Ymd");
								
						if (nowDate == tmpToday) {
							data.weeks[indic].days[indic2].classname.push('datepickerToday');
						}
						if (fromUser.disabled) {
							data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
						}
						if (fromUser.className) {
							data.weeks[indic].days[indic2].classname.push(fromUser.className);
						}
						data.weeks[indic].days[indic2].classname = data.weeks[indic].days[indic2].classname.join(' ');
						cnt++;
						date.addDays(1);
					}
					html = tmpl(tpl.days.join(''), data) + html;
					data = {
						data: options.locale.monthsShort,
						className: 'datepickerMonths'
					};
					html = tmpl(tpl.months.join(''), data) + html;
					tblCal.append(html);
				}

			},
			parseDate = function (date, format) {
				if (date.constructor == Date) {
					return new Date(date);
				}
				var parts = date.split(/\W+/);
				var against = format.split(/\W+/), d, m, y, h, min, now = new Date();
				for (var i = 0; i < parts.length; i++) {
					switch (against[i]) {
						case 'd':
						case 'e':
							d = parseInt(parts[i],10);
							break;
						case 'm':
							m = parseInt(parts[i], 10)-1;
							break;
						case 'Y':
						case 'y':
							y = parseInt(parts[i], 10);
							y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
							break;
						case 'H':
						case 'I':
						case 'k':
						case 'l':
							h = parseInt(parts[i], 10);
							break;
						case 'P':
						case 'p':
							if (/pm/i.test(parts[i]) && h < 12) {
								h += 12;
							} else if (/am/i.test(parts[i]) && h >= 12) {
								h -= 12;
							}
							break;
						case 'M':
							min = parseInt(parts[i], 10);
							break;
					}
				}
				return new Date(
					y === undefined ? now.getFullYear() : y,
					m === undefined ? now.getMonth() : m,
					d === undefined ? now.getDate() : d,
					h === undefined ? now.getHours() : h,
					min === undefined ? now.getMinutes() : min,
					0
				);
			},
			formatDate = function(date, format) {
				var m = date.getMonth();
				var d = date.getDate();
				var y = date.getFullYear();
				var wn = date.getWeekNumber();
				var w = date.getDay();
				var s = {};
				var hr = date.getHours();
				var pm = (hr >= 12);
				var ir = (pm) ? (hr - 12) : hr;
				var dy = date.getDayOfYear();
				if (ir == 0) {
					ir = 12;
				}
				var min = date.getMinutes();
				var sec = date.getSeconds();
				var parts = format.split(''), part;
				for ( var i = 0; i < parts.length; i++ ) {
					part = parts[i];
					switch (parts[i]) {
						case 'a':
							part = date.getDayName();
							break;
						case 'A':
							part = date.getDayName(true);
							break;
						case 'b':
							part = date.getMonthName();
							break;
						case 'B':
							part = date.getMonthName(true);
							break;
						case 'C':
							part = 1 + Math.floor(y / 100);
							break;
						case 'd':
							part = (d < 10) ? ("0" + d) : d;
							break;
						case 'e':
							part = d;
							break;
						case 'H':
							part = (hr < 10) ? ("0" + hr) : hr;
							break;
						case 'I':
							part = (ir < 10) ? ("0" + ir) : ir;
							break;
						case 'j':
							part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
							break;
						case 'k':
							part = hr;
							break;
						case 'l':
							part = ir;
							break;
						case 'm':
							part = (m < 9) ? ("0" + (1+m)) : (1+m);
							break;
						case 'mm':
							part = (1+m);
							break;
						case 'M':
							part = (min < 10) ? ("0" + min) : min;
							break;
						case 'p':
						case 'P':
							part = pm ? "PM" : "AM";
							break;
						case 's':
							part = Math.floor(date.getTime() / 1000);
							break;
						case 'S':
							part = (sec < 10) ? ("0" + sec) : sec;
							break;
						case 'u':
							part = w + 1;
							break;
						case 'w':
							part = w;
							break;
						case 'y':
							part = ('' + y).substr(2, 2);
							break;
						case 'Y':
							part = y;
							break;
					}
					parts[i] = part;
				}
				return parts.join('');
			},
			extendDate = function(options) {
				if (Date.prototype.tempDate) {
					return;
				}
				Date.prototype.tempDate = null;
				Date.prototype.months = options.months;
				Date.prototype.monthsShort = options.monthsShort;
				Date.prototype.days = options.days;
				Date.prototype.daysShort = options.daysShort;
				Date.prototype.getMonthName = function(fullName) {
					return this[fullName ? 'months' : 'monthsShort'][this.getMonth()];
				};
				Date.prototype.getDayName = function(fullName) {
					return this[fullName ? 'days' : 'daysShort'][this.getDay()];
				};
				Date.prototype.addDays = function (n) {
					this.setDate(this.getDate() + n);
					this.tempDate = this.getDate();
				};
				Date.prototype.addMonths = function (n) {
					if (this.tempDate == null) {
						this.tempDate = this.getDate();
					}
					this.setDate(1);
					this.setMonth(this.getMonth() + n);
					this.setDate(Math.min(this.tempDate, this.getMaxDays()));
				};
				Date.prototype.addYears = function (n) {
					if (this.tempDate == null) {
						this.tempDate = this.getDate();
					}
					this.setDate(1);
					this.setFullYear(this.getFullYear() + n);
					this.setDate(Math.min(this.tempDate, this.getMaxDays()));
				};
				Date.prototype.getMaxDays = function() {
					var tmpDate = new Date(Date.parse(this)),
						d = 28, m;
					m = tmpDate.getMonth();
					d = 28;
					while (tmpDate.getMonth() == m) {
						d ++;
						tmpDate.setDate(d);
					}
					return d - 1;
				};
				Date.prototype.getFirstDay = function() {
					var tmpDate = new Date(Date.parse(this));
					tmpDate.setDate(1);
					return tmpDate.getDay();
				};
				Date.prototype.getWeekNumber = function() {
					var tempDate = new Date(this);
					tempDate.setDate(tempDate.getDate() - (tempDate.getDay() + 6) % 7 + 3);
					var dms = tempDate.valueOf();
					tempDate.setMonth(0);
					tempDate.setDate(4);
					return Math.round((dms - tempDate.valueOf()) / (604800000)) + 1;
				};
				Date.prototype.getDayOfYear = function() {
					var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
					var then = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
					var time = now - then;
					return Math.floor(time / 24*60*60*1000);
				};
			},
			layout = function (el) {
				var options = $(el).data('datepicker');
				var cal = $('#' + options.id);
			},
			click = function(ev) {
				if ($(ev.target).is('span')) {
					ev.target = ev.target.parentNode;
				}
				var el = $(ev.target);
				if (el.is('a')) {
					var parentEl = el.parent();
					if (parentEl.hasClass('datepickerNotInMonth')) {
						return false;
					}
					if (parentEl.hasClass('dim')) {
						return false;
					}

					ev.target.blur();
					if (el.hasClass('datepickerDisabled')) {
						return false;
					}
					var options = $(this).data('datepicker');
					var tblEl = parentEl.parent().parent().parent();
					var tblIndex = $('table', this).index(tblEl.get(0)) - 1;
					var tmp = new Date(options.current);
					var changed = false;
					var fillIt = false;
					if (parentEl.is('th')) {
						if (parentEl.hasClass('datepickerWeek') && options.mode == 'range' && !parentEl.next().hasClass('datepickerDisabled')) {
							var val = parseInt(parentEl.next().text(), 10);
							tmp.addMonths(tblIndex - 0);
							//if (parentEl.next().hasClass('datepickerNotInMonth')) {
							//	tmp.addMonths(val > 15 ? -1 : 1);
							//}
							tmp.setDate(val);
							options.date[0] = (tmp.setHours(0,0,0,0)).valueOf();
							tmp.setHours(23,59,59,0);
							tmp.addDays(6);
							options.date[1] = tmp.valueOf();
							fillIt = true;
							changed = true;
							options.lastSel = false;
						}
						else if (parentEl.hasClass('datepickerWeek') && options.mode == 'range3' && !parentEl.next().hasClass('datepickerDisabled')) {
							var val = parseInt(parentEl.next().text(), 10);
							tmp.addMonths(tblIndex - 0);
							//if (parentEl.next().hasClass('datepickerNotInMonth')) {
							//	tmp.addMonths(val > 15 ? -1 : 1);
							//}
							tmp.setDate(val);
							options.date[0] = (tmp.setHours(0,0,0,0)).valueOf();
							tmp.setHours(23,59,59,0);
							tmp.addDays(6);
							options.date[1] = tmp.valueOf();
							fillIt = true;
							changed = true;
							options.lastSel = false;
						} else if (parentEl.hasClass('datepickerMonth')) {
							tmp.addMonths(tblIndex - 0);
							switch (tblEl.get(0).className) {
								case 'datepickerViewDays':
									tblEl.get(0).className = 'datepickerViewMonths';
									el.find('span').text(tmp.getFullYear());
									break;
								case 'datepickerViewMonths':
									tblEl.get(0).className = 'datepickerViewYears';
									el.find('span').text((tmp.getFullYear()-6) + ' - ' + (tmp.getFullYear()+5));
									break;
								case 'datepickerViewYears':
									tblEl.get(0).className = 'datepickerViewDays';
									el.find('span').text(formatDate(tmp, 'B, Y'));
									break;
							}
						} else if (parentEl.parent().parent().is('thead')) {
							switch (tblEl.get(0).className) {
								case 'datepickerViewDays':
									options.current.addMonths(parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
									break;
								case 'datepickerViewMonths':
									options.current.addYears(parentEl.hasClass('datepickerGoPrev') ? -1 : 1);
									break;
								case 'datepickerViewYears':
									options.current.addYears(parentEl.hasClass('datepickerGoPrev') ? -12 : 12);
									break;
							}
							fillIt = true;
						}
					} else if (parentEl.is('td') && !parentEl.hasClass('datepickerDisabled')) {
						switch (tblEl.get(0).className) {
							case 'datepickerViewMonths':
								options.current.setMonth(tblEl.find('tbody.datepickerMonths td').index(parentEl));
								options.current.setFullYear(parseInt(tblEl.find('thead th.datepickerMonth span').text(), 10));
								options.current.addMonths(0 - tblIndex);
								tblEl.get(0).className = 'datepickerViewDays';
								break;
							case 'datepickerViewYears':
								options.current.setFullYear(parseInt(el.text(), 10));
								tblEl.get(0).className = 'datepickerViewMonths';
								break;
							default:
								var val = parseInt(el.find("span").attr("data-val"), 10);
								tmp.addMonths(tblIndex - 0);
								//if (parentEl.hasClass('datepickerNotInMonth')) {
								//	tmp.addMonths(val > 15 ? -1 : 1);
								//}
								tmp.setDate(val);
								var isDefault = el.attr("data-trigger");
								if(isDefault != "Y")
									options.isSel = true;

								el.attr("data-trigger", "");

								switch (options.mode) {
									case 'multiple':
										val = (tmp.setHours(0,0,0,0)).valueOf();
										if ($.inArray(val, options.date) > -1) {
											$.each(options.date, function(nr, dat){
												if (dat == val) {
													options.date.splice(nr,1);
													return false;
												}
											});
										} else {
											options.date.push(val);
										}
										break;
									case 'single':
										singleDateSet($(this), tmp, parentEl)
										break;
									case 'range':
										rangeDateSet($(this), tmp, parentEl)
										break;
									case 'range3':
										range3DateSet($(this), tmp, parentEl);
										break;
									default:
										options.date = tmp.valueOf();
										break;
								}
								break;
						}
						fillIt = true;
						changed = true;
					}
					if (fillIt) {
						fillRang(this);
					}
					if (changed) {
					}
				}
				return false;
			},
			resetSelect = function(options){
				options.date = [];
				$("#datePicker .both").removeClass("both");
				$("#datePicker .brLeft").removeClass("brLeft");
				$("#datePicker .brMiddle").removeClass("brMiddle");
				$("#datePicker .brRight").removeClass("brRight");
				$("#detepicker-form input[name=dateS]").attr("value", "")
				$("#detepicker-form input[name=dateM]").attr("value", "")
				$("#detepicker-form input[name=dateE]").attr("value", "")
				$(".date-middle").text("");
				$(".date-end").text("");
			},
			singleDateSet = function(that, tmp, parentEl){
				var options = that.data('datepicker');
				val = (tmp.setHours(0,0,0,0)).valueOf();
				options.date[0] = val;

				var w = parentEl.index();
				w = options.locale.daysMin[w-1];
				var selDate = parentEl.attr("id");
				var selDateY = selDate.substr(0, 4);
				var selDateM = selDate.substr(4, 2);
				var selDateD = selDate.substr(6, 2);

				$("#datePicker .datepickerSelected").removeClass("datepickerSelected");
				$("#datePicker .tooltip").remove();
				parentEl.append("<div class='tooltip'>출국일</div>");
				parentEl.addClass("both");
				$(".date-start").text(selDateY+"."+selDateM+"."+selDateD+"("+w+")");
				parentEl.addClass("datepickerSelected");
			},
			rangeDateSet = function(that, tmp, parentEl){
				var options = that.data('datepicker');
				if(options.date.length == 2){
					options.date = [];
					$("#datePicker .brLeft").removeClass("brLeft");
					$("#datePicker .brMiddle").removeClass("brMiddle");
					$("#datePicker .brRight").removeClass("both");
					$("#detepicker-form input[name=dateM]").attr("value", "");
					$("#detepicker-form input[name=dateE]").attr("value", "");
					$(".date-end").text("");
					$("#datePicker .tooltip").remove();
				}
				val = (tmp.setHours(23,59,59,0)).valueOf();
				$("#datePicker .datepickerSelected").removeClass("datepickerSelected");

				if (options.date.length == 0 || val < options.date[0]) {
					options.date = [];
					options.date[0] = val;
				} else {
					options.date[1] = val;
					options.lastSel = !options.lastSel;
				}

				var w = parentEl.index();
				w = options.locale.daysMin[w-1];
				var selDate = parentEl.attr("id");
				var selDateY = selDate.substr(0, 4);
				var selDateM = selDate.substr(4, 2);
				var selDateD = selDate.substr(6, 2);

				if (options.date.length == 1) {
					$("#datePicker .both").removeClass("both");
					$("#datePicker .brLeft").removeClass("brLeft");
					$("#datePicker .brRight").removeClass("brRight");
					$(".date-start").text(selDateY+"."+selDateM+"."+selDateD+"("+w+")");
					$("#detepicker-form input[name=dateM]").attr("value", "");
					$("#detepicker-form input[name=dateE]").attr("value", "");

					parentEl.addClass("brLeft");
					$("#datePicker .tooltip").remove();
					parentEl.append("<div class='tooltip'>출국일</div>");
				}
				else{
					$("#datePicker .brMiddle").removeClass("brMiddle");
					$("#datePicker .brRight").removeClass("brRight");
					$(".date-end").text(selDateY+"."+selDateM+"."+selDateD+"("+w+")");
					$("#detepicker-form input[name=dateE]").attr("value", "");

					parentEl.addClass("brRight");
					if(parentEl.hasClass("brLeft")){
						parentEl.addClass("both");
						$("#datePicker .tooltip").remove();
						parentEl.append("<div class='tooltip'>출/귀국일</div>");
					}
					else{
						parentEl.append("<div class='tooltip'>귀국일</div>");
					}
				}

				parentEl.addClass("datepickerSelected");

			},
			range3DateSet  = function(that, tmp, parentEl){
				var options = that.data('datepicker');
				if(options.date.length == 3){
					options.date = [];
					$("#datePicker .both").removeClass("both");
					$("#datePicker .brLeft").removeClass("brLeft");
					$("#datePicker .brMiddle").removeClass("brMiddle");
					$("#datePicker .brRight").removeClass("brRight");
					$("#detepicker-form input[name=dateS]").attr("value", "")
					$("#detepicker-form input[name=dateM]").attr("value", "")
					$("#detepicker-form input[name=dateE]").attr("value", "")
					$(".date-middle").text("");
					$(".date-end").text("");
				}

				var len = options.date.length <= 1 ? 0 : 1;
				options.date[options.date.length] = (tmp.setHours(0,0,0,0)).valueOf();

				val = (tmp.setHours(23,59,59,0)).valueOf();
				if (val < options.date[len]) {
					options.date = [];
					options.date[0] = val;
					$("#datePicker .brLeft").removeClass("brLeft");
					$("#datePicker .brMiddle").removeClass("brMiddle");
					$("#datePicker .brRight").removeClass("brRight");
				} else {
					options.date[options.date.length-1] = val;
				}

				var w = parentEl.index();
				w = options.locale.daysMin[w-1];
				var selDate = parentEl.attr("id");
				var selDateY = selDate.substr(0, 4);
				var selDateM = selDate.substr(4, 2);
				var selDateD = selDate.substr(6, 2);
				if (options.date.length == 1) {
					$("#datePicker .both").removeClass("both");
					$("#datePicker .datepickerSelected").removeClass("datepickerSelected");
					$(".date-start").text(selDateY+"."+selDateM+"."+selDateD+"("+w+")");
					$(".date-middle").text("");
					$(".date-end").text("");

					parentEl.addClass("brLeft");
					$("#datePicker .tooltip").remove();
					parentEl.append("<div class='tooltip'>출국일</div>");

					$("#detepicker-form input[name=dateM]").attr("value", "")
					$("#detepicker-form input[name=dateE]").attr("value", "")
				}
				else if (options.date.length == 2) {
					$(".date-middle").text(selDateY+"."+selDateM+"."+selDateD+"("+w+")");
					$(".date-end").text("");
					$("#detepicker-form input[name=dateE]").attr("value", "");

					parentEl.addClass("brMiddle");
					if(parentEl.hasClass("brLeft")){
						parentEl.addClass("both");
						that.find(".tooltip").remove();
						parentEl.append("<div class='tooltip'>출/중간일</div>");
					}
					else{
						parentEl.append("<div class='tooltip'>중간일</div>");
					}

				}
				else{
					$(".date-end").text(selDateY+"."+selDateM+"."+selDateD+"("+w+")");

					parentEl.addClass("brRight");
					if(parentEl.hasClass("brLeft") && parentEl.hasClass("brMiddle")){
						parentEl.addClass("both");
						parentEl.find(".tooltip").remove();
						parentEl.append("<div class='tooltip'>출/중/귀</div>");
					}
					else if(parentEl.hasClass("brMiddle")) {
						parentEl.addClass("both");
						parentEl.find(".tooltip").remove();
						parentEl.append("<div class='tooltip'>중/귀국일</div>");
					}
					else{
						parentEl.append("<div class='tooltip'>귀국일</div>");
					}
				}

				parentEl.addClass("datepickerSelected");

				options.lastSel = options.date.length > 3 ? true : false;
			}
			prepareDate = function (options) {
				var tmp;
				if (options.mode == 'single1') {
					tmp = new Date(options.date);
					return [formatDate(tmp, options.format), tmp, options.el];
				} else {
					tmp = [[],[], options.el];
					$.each(options.date, function(nr, val){
						var date = new Date(val);
						tmp[0].push(formatDate(date, options.format));
						tmp[1].push(date);
					});
					return tmp;
				}
			},
			getViewport = function () {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while(prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			show = function (ev) {
				var cal = $('#' + $(this).data('datepickerId'));
				if (!cal.is(':visible')) {
					var calEl = cal.get(0);
					fill(calEl);
					var options = cal.data('datepicker');
					options.onBeforeShow.apply(this, [cal.get(0)]);
					var pos = $(this).offset();
					var viewPort = getViewport();
					var top = pos.top;
					var left = pos.left;
					var oldDisplay = $.curCSS(calEl, 'display');
					cal.css({
						visibility: 'hidden',
						display: 'block'
					});
					layout(calEl);
					switch (options.position){
						case 'top':
							top -= calEl.offsetHeight;
							break;
						case 'left':
							left -= calEl.offsetWidth;
							break;
						case 'right':
							left += this.offsetWidth;
							break;
						case 'bottom':
							top += this.offsetHeight;
							break;
					}
					if (top + calEl.offsetHeight > viewPort.t + viewPort.h) {
						top = pos.top  - calEl.offsetHeight;
					}
					if (top < viewPort.t) {
						top = pos.top + this.offsetHeight + calEl.offsetHeight;
					}
					if (left + calEl.offsetWidth > viewPort.l + viewPort.w) {
						left = pos.left - calEl.offsetWidth;
					}
					if (left < viewPort.l) {
						left = pos.left + this.offsetWidth
					}
					cal.css({
						visibility: 'visible',
						display: 'block',
						top: top + 'px',
						left: left + 'px'
					});
					if (options.onShow.apply(this, [cal.get(0)]) != false) {
						cal.show();
					}
					$(document).bind('mousedown', {cal: cal, trigger: this}, hide);
				}
				return false;
			},
			hide = function (ev) {
				if (ev.target != ev.data.trigger && !isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('datepicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
						ev.data.cal.hide();
					}
					$(document).unbind('mousedown', hide);
				}
			},
			defaultSet = function(options, reset){
				var dates = options.defaultDate;
				if(options.isSel){
					dates = options.date;
				}
				resetSelect(options);
				if(dates[0] != "" && dates[0] != null && dates[0] != undefined){
					tmp = new Date(dates[0]);
					var mDate1 = parseInt(formatDate(tmp, "Ymd"));
					$("#"+mDate1+" a").attr("data-trigger", "Y").trigger("click");
				}
				if(dates[1] != "" && dates[1] != null && dates[1] != undefined){
					tmp = new Date(dates[1]);
					var mDate2 = parseInt(formatDate(tmp, "Ymd"));
					var ck = $(".daylabel .redCheck").is(":checked");
					if((options.mode == 'range' || options.mode == 'single' ) && ck){
						return;
					}
					else{
						setTimeout(function(){
							$("#"+mDate2+" a").attr("data-trigger", "Y").trigger("click");
						}, 100);
					}
				}
				if(options.mode == 'range3' && dates[2] != "" && dates[2] != null && dates[2] != undefined){
					tmp = new Date(dates[2]);
					var mDate3 = parseInt(formatDate(tmp, "Ymd"));
					setTimeout(function(){
						$("#"+mDate3+" a").attr("data-trigger", "Y").trigger("click");
					}, 200);
				}

			};
		return {
			init: function(options){
				options = $.extend({}, defaults, options||{});
				extendDate(options.locale);
				options.calendars = Math.max(1, parseInt(options.calendars,10)||1);
				options.mode = /single|multiple|range|range3/.test(options.mode) ? options.mode : 'single';
				return this.each(function(){
					if (!$(this).data('datepicker')) {
						options.el = this;
						if (options.date.constructor == String) {
							options.date = parseDate(options.date, options.format);
							options.date.setHours(0,0,0,0);
						}
						if (options.mode != 'single') {
							if (options.date.constructor != Array) {
								options.date = [options.date.valueOf()];
								if (options.mode == 'range') {
									options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
								}
								if (options.mode == 'range3') {
									options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
								}
							} else {
								for (var i = 0; i < options.date.length; i++) {
									if(options.date[i] != undefined)
										options.date[i] = (parseDate(options.date[i], options.format).setHours(0,0,0,0)).valueOf();
								}
							}
						} else {
							options.date = options.date.valueOf();
						}
						if (!options.current) {
							options.current = new Date();
						} else {
							options.current = parseDate(options.current, options.format);
						} 
						options.current.setDate(1);
						options.current.setHours(0,0,0,0);
						var id = 'datepicker_' + parseInt(Math.random() * 1000), cnt;
						options.id = id;
						$(this).data('datepickerId', options.id);
						var cal = $(tpl.wrapper).attr('id', id).bind('click', click).data('datepicker', options);
						if (options.className) {
							cal.addClass(options.className);
						}
						var html = '';
						for (var i = 0; i < options.calendars; i++) {
							cnt = options.starts;
							if (i > 0) {
								html += tpl.space;
							}
							html += tmpl(tpl.head.join(''), {
									week: options.locale.weekMin,
									prev: options.prev,
									next: options.next,
									day1: options.locale.daysMin[(cnt++)%7],
									day2: options.locale.daysMin[(cnt++)%7],
									day3: options.locale.daysMin[(cnt++)%7],
									day4: options.locale.daysMin[(cnt++)%7],
									day5: options.locale.daysMin[(cnt++)%7],
									day6: options.locale.daysMin[(cnt++)%7],
									day7: options.locale.daysMin[(cnt++)%7]
								});
						}
						cal
							.find('tbody:first').append(html)
								.find('table').addClass(views[options.view]);
						fill(cal.get(0));
						if (options.flat) {
							cal.appendTo(this).show().css('position', 'relative');
							layout(cal.get(0));
						} else {
							cal.appendTo(document.body);
							$(this).bind(options.eventName, show);
						}
					}



					defaultSet(options, false);

					datepickerScrollPos(options);
				});
			},
			showPicker: function() {
				return this.each( function () {
					if ($(this).data('datepickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function () {
					if ($(this).data('datepickerId')) {
						$('#' + $(this).data('datepickerId')).hide();
					}
				});
			},
			setDate: function(date, shiftTo){
				return this.each(function(){
					if ($(this).data('datepickerId')) {
						var cal = $('#' + $(this).data('datepickerId'));
						var options = cal.data('datepicker');
						options.date = date;
						if (options.date.constructor == String) {
							options.date = parseDate(options.date, options.format);
							options.date.setHours(0,0,0,0);
						}
						if (options.mode != 'single') {
							if (options.date.constructor != Array) {
								options.date = [options.date.valueOf()];
								if (options.mode == 'range') {
									options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
								}
								if (options.mode == 'range3') {
									options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
								}
							} else {
								for (var i = 0; i < options.date.length; i++) {
									options.date[i] = (parseDate(options.date[i], options.format).setHours(0,0,0,0)).valueOf();
								}
								if (options.mode == 'range') {
									options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
								}
								if (options.mode == 'range3') {
									options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
								}
							}
						} else {
							options.date = options.date.valueOf();
						}
						if (shiftTo) {
							options.current = new Date (options.mode != 'single' ? options.date[0] : options.date);
						}
						fill(cal.get(0));
					}
				});
			},
			getDate: function(formated) {
				if (this.size() > 0) {
					return prepareDate($('#' + $(this).data('datepickerId')).data('datepicker'))[formated ? 0 : 1];
				}
			},
			setMode: function(val){
				if ($(this).data('datepickerId')) {
					var cal = $('#' + $(this).data('datepickerId'));
					var options = cal.data('datepicker');
					options.mode = val;
				}
			},
			clear: function(){
				return this.each(function(){
					if ($(this).data('datepickerId')) {
						var cal = $('#' + $(this).data('datepickerId'));
						var options = cal.data('datepicker');
						if (options.mode != 'single') {
							options.date = [];
							fill(cal.get(0));
						}
					}
				});
			},
			resetDefault: function(state){
				if ($(this).data('datepickerId')) {
					var cal = $('#' + $(this).data('datepickerId'));
					var options = cal.data('datepicker');
					setTimeout(function(){
						defaultSet(options, true);
					},100);
				}
			},
			fixLayout: function(){
				return this.each(function(){
					if ($(this).data('datepickerId')) {
						var cal = $('#' + $(this).data('datepickerId'));
						var options = cal.data('datepicker');
						if (options.flat) {
							layout(cal.get(0));
						}
					}
				});
			}
		};
	}();
	$.fn.extend({
		DatePicker: DatePicker.init,
		resetDefaultDate: DatePicker.resetDefault,
		DatePickerHide: DatePicker.hidePicker,
		DatePickerShow: DatePicker.showPicker,
		DatePickerSetDate: DatePicker.setDate,
		DatePickerGetDate: DatePicker.getDate,
		DatePickerClear: DatePicker.clear,
		DatePickerSetMode: DatePicker.setMode,
		DatePickerLayout: DatePicker.fixLayout
	});
})(jQuery);

(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };


})();

function datepickerScrollPos(options){
	var monthPos = new Array();
	var monthStr = new Array();
	var i = 0;
	var date = new Date();
	var m = date.getMonth()+1;	
	var d = date.getDate();
	var y = date.getFullYear();

	var interval = setInterval(function(){
		if($("#wrap").css("display") == "none"){
			options.onAfterRender.apply();
			clearInterval(interval);
		}
	}, 100);

	m = (m < 10) ? ("0" + m) : m;

	$(".firstMonth").text(y +"."+ m);

	i = $(".datepickerMonth").length;
	setTimeout(function(){
		$(".datepickerMonth").filter(function(){
			i--;
			monthPos[i] = $(this).position().top;
			monthStr[i] = $(this).find(".year").text() + "." + $(this).find(".month").text();
		});

		var scroller = $(window);
		scroller.scroll(function(e){
			var t = scroller.scrollTop();
			for(var i=0; i < monthPos.length; i++){
				if(monthPos[i] < t){
					$(".firstMonth").text(monthStr[i]);
					break;
				}
			}
		});
	}, 100);
}
String.prototype.trim = function()
{
	return this.replace(/(^\s*)|(\s*$)/gi, "");
}
String.prototype.replaceAll = function(str1, str2)
{
	var temp_str = this.trim();
	temp_str = temp_str.replace(eval("/" + str1 + "/gi"), str2);
	return temp_str;
}