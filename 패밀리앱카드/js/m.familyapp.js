/**
 * @author : Jo Yun Ki (ddoeng@naver.com)
 * @version : 1.0
 * @since : 2016.09.12
 *
 * family 앱
 */

$(document).ready(function (e) {
	var bottomContainerDIV = $('.benefitSection');
	var bottomContentDIV = $('.benefitcont');
	var dimedDIV = bottomContainerDIV.nextAll('.dim');
	var btnA = bottomContainerDIV.find('.btnToggle > a');

	btnA.on('click.familyapp', function (e) {
		var target = $(e.currentTarget);

		var sw = !bottomContainerDIV.hasClass('open');

		bottomContainerDIV.toggleClass('open', sw);
		dimedDIV.toggle(sw);
	});
});