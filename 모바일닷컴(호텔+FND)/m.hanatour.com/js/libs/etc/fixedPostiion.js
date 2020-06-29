(function(window, doc){
	fixedPostiion = function (scroller, el, options) {
		var that = this;
		that.y = 0;
		that.startY = 0;
		that.duration = 0;
		that.position = "";
		that.oldDirect = "";

		if(scroller == "window")
			that.scroller = $(window);
		else
			that.scroller = $(scroller);

		that.obj = el;
		that.attach = that.obj.attr("data-attach");
		if(!that.attach)
			that.attach = "";
		else if($(that.attach + " div").size() > 0)
			that.isFixed = true;

		that.target = $(that.obj.attr("data-target"));

		that.direction = that.obj.attr("data-direction");
		that.marginH = $(that.obj.attr("data-margin")).height();
		that.position = that.obj.css("position");
		that.duration = that.obj.css(transitionDuration);
		if(!that.marginH)
			that.marginH = 0;


		var padding = 0
		try{
			padding = parseInt(that.obj.css("padding-top").replace("px", ""));
			padding += parseInt(that.obj.css("padding-bottom").replace("px", ""));
		}
		catch(e){}

		that.elHeight = that.obj.height() + padding;
		that.posTop = parseInt(that.obj.position().top);
		that.fixedPosT = that.posTop + that.elHeight;

		that.scroller.scroll(function(e){
			var sTop = that.scroller.scrollTop();
			if(Math.abs(that.startY  - sTop) > 5){
				that.setFixed(sTop);
			}
			that.y = sTop;
		});
	};

	fixedPostiion.prototype = {
		isFixed: false,
		lastScrollTop: 0,
		tmpDuration: this.duration,
		isFirst: true,
		posY: true,

		setFixed: function (sTop) {
			var that = this;
			var transY = 0;
			var scrollDirect = that.scrollDirection(sTop);

			if(that.direction == "fUpDown"){
				if(scrollDirect == "up")
					transY = 0;
				else
					transY = that.elHeight;
				if(that.oldDirect != scrollDirect){
					that.oldDirect = scrollDirect;
				}
			}
			else if(that.direction == "MUpDown"){
				if(scrollDirect == "up")
					that.posY = that.posTop - that.marginH;
				else{
					that.posY = that.posTop + that.elHeight - that.marginH;
				}

				if(that.posY <= sTop){
					that.tmpDuration = that.duration;
					if(!that.isFixed){
						that.obj.css("position", "fixed").addClass("fixed");
						//that.obj.css(transform,  "translateY("+that.marginH+"px)");
						that.isFixed = true;
						that.isFirst = true;
						that.tmpDuration = "0ms";
					}
					if(scrollDirect == "down" || that.isFirst)
						transY = "-"+that.elHeight;
					else
						transY = 0;

					that.isFirst = false;

					if(that.oldDirect != scrollDirect){
						that.obj.css(transitionDuration, that.tmpDuration);
						that.obj.css(transform,  "translateY("+transY+"px)");
						that.oldDirect = scrollDirect;
					}
				}
				else{
					if(that.isFixed){
						that.obj.css("position", that.position).removeClass("fixed");
						that.obj.css(transform,  "translateY(0px)");
						that.isFixed = false;
						that.isFirst = false;
						that.oldDirect = "";
					}
				}
			}
			else{
				if(scrollDirect == "up")
					that.posY = that.fixedPosT;
				else
					that.posY = that.fixedPosT;

				if(that.posY <= sTop){
					if(!that.isFixed){
						if(that.attach == ""){
							that.obj.css("position", "fixed").addClass("fixed");
							that.obj.css(transform,  "translateY("+that.marginH+"px)");
						}
						else{
							that.elattach(true);
						}
						that.isFixed = true;
					}
				}
				else{
					if(that.isFixed){
						that.isFixed = false;
						if(that.attach == ""){
							that.obj.css("position", that.position).removeClass("fixed");
							that.obj.css(transform,  "translateY(0px)");
						}
						else{
							console.log(0)
							that.elattach(false);
						}
					}
				}
			}
			that.startY = sTop;
		},
		scrollDirection: function(st){
			var val;
		   if (st > this.lastScrollTop){
			   val = "down";
		   } else {
			   val = "up";
		   }
		   this.lastScrollTop = st;
		   return val;
		},
		elattach: function(flag){
			var that = this;
			if(flag){
				var html = that.target.html();
				$(that.attach).append(html);
				setTimeout(function(){
					var h = $(that.attach).height()+"px";
					$(that.attach).css("top", "-"+h);
					$(that.attach).css(transform,  "translateY("+h+")");
				}, 10);
			}
			else{
				$(that.attach).html("");
				$(that.attach).css(transform,  "translateY(0px)");
			}
		}
	}

	if (typeof exports !== 'undefined') exports.fixedPostiion = fixedPostiion;
	else window.fixedPostiion = fixedPostiion;

})(window, document);


function getScrollMax ($target) {
	return $target.prop("scrollHeight") - $target.prop("clientHeight");
}
function getScrollPositions ($target) {
	return  $target.scrollTop();
}
function maxScrollPos(target){
	$target = typeof target == 'object' ? target : $(target);
	var max = getScrollMax($target);
	var pos = getScrollPositions($target);
	return max - pos;
}

