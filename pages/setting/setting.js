/**
 * Created by ChenChao on 2016/9/27.
 */

var app = getApp();

Page({
    data: {
    },
    onLoad: function () {
        for(var prop in wx){
            if(wx.hasOwnProperty(prop)){
                console.log(prop, typeof wx[prop])
            }
        }
        // 报错！没有此方法？
        // wx.openSetting({
        //     success: function (res) {
        //         console.log(res);
        //     }
        // });
    }
});
