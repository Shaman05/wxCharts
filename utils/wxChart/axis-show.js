/**
 * Created by ChenChao on 2017/4/12.
 * 坐标轴显示
 */

module.exports = function init(canvasId, options) {
    console.log(canvasId, options);
    var _ctx = null;
    var _cw = options.width;
    var _ch = options.height;
    var _x = 0;
    var _y = 0;
    return {
	init: function () {
	    _ctx = wx.createCanvasContext(canvasId);
	    if(_cw === 'auto') {
		wx.getSystemInfo({
		    success: function (result) {
			_cw = result.windowWidth;
		    }
		});
	    }
	    if(_ch === 'auto'){
		_ch = 225;
	    }
	},
	start: function (x, y) {
	    _x = x;
	    _y = y;
	    this.draw(x, y);
	},
	move: function (x, y) {
	    if(x !== _x || y !== _y){
		if(x < 0 || x > _cw || y < 0 || y > _ch){
		    return;
		}
		_x = x;
		_y = y;
		this.draw(x, y);
	    }
	},
	stop: function () {
	    this.clear();
	},
	draw: function (x, y) {
	    this.clear();
	    _ctx.setStrokeStyle('#ffffff');
	    _ctx.beginPath();
	    _ctx.setLineWidth(1);
	    //x
	    _ctx.moveTo(0, y);
	    _ctx.lineTo(_cw, y);
	    _ctx.stroke();
	    //y
	    _ctx.moveTo(x, 0);
	    _ctx.lineTo(x, _ch);
	    _ctx.stroke();

	    _ctx.closePath();
	    _ctx.draw();
	},
	clear: function () {
	    _ctx.clearRect(0, 0, _cw, _ch);
	    _ctx.draw();
	}
    };
};