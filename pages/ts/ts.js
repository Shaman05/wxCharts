/**
 * Created by ChenChao on 2016/9/27.
 */

var app = getApp();
var storage = require('../../utils/storage');
var ts = require('../../utils/wxChart/time-sharing');
var axisShow = require('../../utils/wxChart/axis-show');
var ts1, ts2;     //分时
var tsd51, tsd52; //五日
var tsAxisShow;   //分时手势坐标
var getOptionTimeSharing1 = function (type, width) {
    return {
        name: type || 'time-sharing',
        width: width || 'auto',
        height: 200,
        axis: {
            row: 4,
            col: 4,
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            color: '#cdcdcd'
        },
        xAxis: {
            data: []
        },
        yAxis: [
            {
                type: 'line',
                lineColor: '#2F6098',
                background: 'rgba(53,125,222,0.1)',
                /*background: function () {  //渐变背景在IOS上会影响均线颜色，这个应该是小程序canvas的bug
                    return ['rgba(53,125,222,0.3)', 'rgba(0,0,0,0)'];
                },*/
                data: []
            },
            {
                type: 'line',
                lineColor: '#A96F3E',
                data: []
            }
        ],
        callback: function (time) {
            var page = getCurrentPages();
            page = page[page.length - 1];
            page.setData({
                ts1RenderTime: time
            });
        }
    };
};
var getOptionTimeSharing2 = function (type, width) {
    return {
        name: type || 'time-sharing-b',
        width: width || 'auto',
        height: 80,
        axis: {
            row: 2,
            col: 4,
            showEdg: true,
            showX: true,
            showY: true,
            paddingTop: 5,
            paddingBottom: 14,
            paddingLeft: 0,
            paddingRight: 0,
            color: '#cdcdcd'
        },
        xAxis: {
            times: ['09:30', '15:00'],
            data: []
        },
        yAxis: [
            {
                type: 'bar',
                color: [],
                data: [],
                showMax: true
            }
        ],
        callback: function (time) {
            var page = getCurrentPages();
            page = page[page.length - 1];
            page.setData({
                ts2RenderTime: time
            });
        }
    };
};
var getOptionTimeSharingAxis = function () {
    return {

    };
};
var timer = null;

Page({
    data: {
        tabName: '',
        ts: {},
        ts5: {},
        stock: '',
        code: '',
        time: '',
        yc: '',
        dataIndex: 0,
        ts1RenderTime: 0,
        ts2RenderTime: 0,
        timerIndex: 4,
        timerArray: ['50ms', '100ms', '200ms', '500ms', '1000ms'],
        isShowAxis: false
    },
    onLoad: function () {
        var tsData = storage.getTsData();
        var ts5Data = storage.getTs5Data();
        this.setData({
            dataIndex: 0,
            ts: tsData,
            ts5: ts5Data
        });
        this.tabChart({
            target: {
                dataset: {
                    type: 'ts'
                }
            }
        });
    },
    onHide: function() {
        clearInterval(timer);
    },
    tabChart: function (e) {
        this.clearTimer();
        var type = e.target.dataset.type;
        var data = this.data[type];
        this.setData({
            tabName: type,
            stock: data.name,
            code: data.code,
            time: data.info.time,
            yc: data.info.yc
        });
        this['init-' + type]();
    },
    'init-ts': function () {
        var data = this.data.ts;
        ts1 = ts('time-sharing').init(getOptionTimeSharing1());
        this.renderTs1(data);
        ts2 = ts('time-sharing-b').init(getOptionTimeSharing2());
        this.renderTs2(data);
        tsAxisShow = axisShow('time-sharing-axis', {
            //todo: 配置项
            type: 'ts',
            height: 280,
            width: 'auto',
            maxY: 100,
            minY: 0
        });
        tsAxisShow.init();
    },
    'init-ts5': function () {
        var data = this.data.ts5;
        tsd51 = ts('time-sharing-5day').init(getOptionTimeSharing1('time-sharing-5day'));
        tsd52 = ts('time-sharing-5day-b').init(getOptionTimeSharing2('time-sharing-5day'));
        tsd51.metaData1(data, getOptionTimeSharing1('time-sharing-5day'));
        tsd51.draw();
        tsd52.metaData2(data, getOptionTimeSharing2('time-sharing-5day'));
        tsd52.draw();
    },
    renderTs1: function (data) {
        ts1.metaData1(data, getOptionTimeSharing1());
        ts1.draw();
    },
    renderTs2: function (data) {
        ts2.metaData2(data, getOptionTimeSharing2());
        ts2.draw();
    },
    clearTimer: function () {
        clearInterval(timer);
        this.setData({
            dataIndex: 0
        });
    },
    reset: function () {
        this.clearTimer();

        var data = storage.getTsData();
        this.renderTs1(data);
        this.renderTs2(data);
    },
    dynamic: function () {
        var that = this;
        var data = storage.getTsData();
        var origin = data.data.slice(0);
        var index = 0;
        var times = [50, 100, 200, 500, 1000];
        clearInterval(timer);
        timer = setInterval(function () {
            index += 1;
            if(index > 241 + 16){
                clearInterval(timer);
                return;
            }
            data.data = origin.slice(0, index);
            that.renderTs1(data);
            that.renderTs2(data);
            that.setData({
                dataIndex: index
            });
        }, times[this.data.timerIndex]);
    },
    bindTimeChange: function (e) {
        var index = e.detail.value;
        this.setData({
            timerIndex: index === '' ? 4 : index
        });
        this.dynamic();
    },
    axisStart: function (e) {
        var x = e.touches[0].x;
        var y = e.touches[0].y;
        this.data.isShowAxis = true;
        tsAxisShow.start(x, y);
    },
    axisMove: function (e) {
        if(this.data.isShowAxis){
            var x = e.touches[0].x;
            var y = e.touches[0].y;
            tsAxisShow.move(x, y);
        }
    },
    axisStop: function () {
        this.data.isShowAxis = false;
        tsAxisShow.stop();
    }
});
