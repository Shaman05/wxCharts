/**
 * Created by ChenChao on 2016/9/27.
 */

var app = getApp();
var storage = require('../../utils/storage');
var kl = require('../../utils/wxChart/k-line');
var getOptionKline1 = function (type) {
    return {
        name: type || 'dk',
        width: 'auto',
        height: 160,
        average: [5, 10, 20],
        axis: {
            row: 4,
            col: 5,
            showX: false,
            showY: true,
            showEdg: true,
            paddingTop: 0,
            paddingBottom: 1,
            paddingLeft: 0,
            paddingRight: 0,
            color: '#cdcdcd'
        },
        xAxis: {
            data: [],
            averageLabel: []
        },
        yAxis: [],
        callback: function (time) {
            var page = getCurrentPages();
            page = page[page.length - 1];
            page.setData({
                kl1RenderTime: time
            });
        }
    };
};
var getOptionKline2 = function (type) {
    return {
        name: type || 'dk',
        width: 'auto',
        height: 80,
        average: [5, 10, 20],
        axis: {
            row: 1,
            col: 5,
            showX: false,
            showY: true,
            showEdg: true,
            paddingTop: 0,
            paddingBottom: 14,
            paddingLeft: 0,
            paddingRight: 0,
            color: '#cdcdcd'
        },
        xAxis: {
            times: [],
            data: [],
            averageLabel: []
        },
        yAxis: [],
        callback: function (time) {
            var page = getCurrentPages();
            page = page[page.length - 1];
            page.setData({
                kl2RenderTime: time
            });
        }
    };
};
var kLine, kLineB;
var ma5Arr, ma10Arr, ma20Arr,
    ma5bArr, ma10bArr, ma20bArr;

Page({
    data: {
        ma5: '',
        ma10: '',
        ma20: '',
        ma5b: '',
        ma10b: '',
        ma20b: '',
        tabName: '',
        stock: '',
        code: '',
        time: '',
        yc: '',
        kl1RenderTime: 0,
        kl2RenderTime: 0,
        minIndex: 3,
        minArray: ['5分钟', '15分钟', '30分钟', '60分钟']
    },
    onLoad: function () {
        //默认切换到日K
        this.tabChart({
            target: {
                dataset: {
                    type: 'dk'
                }
            }
        });
    },
    tabChart: function (e) {
        var type = e.target.dataset.type;
        var getDataByType = function (type) {
            return {
                'dk': function () {
                    return storage.getDkData();
                },
                'wk': function () {
                    return storage.getWkData();
                },
                'mk': function () {
                    return storage.getMkData();
                }
            }[type]();
        };
        var data = getDataByType(type);
        this.setData({
            tabName: type,
            stock: data.name,
            code: data.code,
            time: data.info.time,
            yc: data.info.yc
        });
        this.draw(data, type);
    },
    tabMinChart: function (e) {
        var type = 'mink';
        var index = e.detail.value;
        index = index=== '' ? 3 : index;
        var getDataByType = function (type) {
            return {
                'mink-5': function () {
                    return storage.getMin5Data();
                },
                'mink-15': function () {
                    return storage.getMin15Data();
                },
                'mink-30': function () {
                    return storage.getMin30Data();
                },
                'mink-60': function () {
                    return storage.getMin60Data();
                }
            }[type]();
        };
        var typeList = [5, 15, 30, 60];
        var minType = type + '-' + typeList[index];
        var data = getDataByType(minType);
        this.setData({
            tabName: type,
            minIndex: index,
            stock: data.name,
            code: data.code,
            time: data.info.time,
            yc: data.info.yc
        });
        this.draw(data, minType);
    },
    draw: function (data, type) {
        kLine = kl('k-line').init(getOptionKline1(type));
        kLine.metaData1(data, getOptionKline1(type));
        kLine.draw();

        kLineB = kl('k-line-b').init(getOptionKline2(type));
        kLineB.metaData2(data, getOptionKline2(type));
        kLineB.draw();

        var yAxis1 = kLine.options.yAxis;
        var yAxis2 = kLineB.options.yAxis;
        ma5Arr = yAxis1[1].dataShow;
        ma10Arr = yAxis1[2].dataShow;
        ma20Arr = yAxis1[3].dataShow;
        ma5bArr = yAxis2[1].dataShow;
        ma10bArr = yAxis2[2].dataShow;
        ma20bArr = yAxis2[3].dataShow;
        this.showLastAverage();
    },
    showLastAverage: function () {
        this.setData({
            ma5: ma5Arr[ma5Arr.length - 1],
            ma10: ma10Arr[ma10Arr.length - 1],
            ma20: ma20Arr[ma20Arr.length - 1],
            ma5b: ma5bArr[ma5bArr.length - 1],
            ma10b: ma10bArr[ma10bArr.length - 1],
            ma20b: ma20bArr[ma20bArr.length - 1]
        });
    }
});
