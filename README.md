# wxCharts
微信小程序中的股票分时图、K线图

## 说明

* 本示例K线交易量（底部柱子）的颜色变化规则为：当前现价（收盘价） - 前一条现价（收盘价） 决定的，大于等于0为红（涨），小于0为绿（跌）。这里可能有的计算规则是以交易量来计算的。
* 数据为真实接口数据，处理后存储在模块里。由于使用者不同，接口数据格式肯定有不同，所以绘前的metadata1()和metadata2()方法为数据转化接口。
* js设置的canvas大小实际上是以px为单位的，100%宽度的可设置'auto'，如页面中要指定canvas大小，则在js里需按规则先计算绘图的canvas大小。具体规则可以参考官方文档：[WXSS尺寸单位](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxss.html?t=2017112)
* 正在施工中：在图上手势移动显示坐标线和数据明细。


## 文档

配置文档参考：[wiki](https://github.com/Shaman05/wxCharts/wiki)


## 效果展示

![image](https://github.com/Shaman05/wxCharts/blob/master/images/fs.png)
![image](https://github.com/Shaman05/wxCharts/blob/master/images/wr.png)
![image](https://github.com/Shaman05/wxCharts/blob/master/images/kll.png)
![image](https://github.com/Shaman05/wxCharts/blob/master/images/fsd.gif)

## 手势坐标(演示效果)

![image](https://github.com/Shaman05/wxCharts/blob/master/images/axis-show.gif)