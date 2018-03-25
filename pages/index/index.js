//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        imgUrls: [
            app.globalData.serverHost + '/images/1.jpeg',
            app.globalData.serverHost + '/images/2.jpeg',
            app.globalData.serverHost + '/images/3.jpeg'
        ],
        imgWidth: '',
        swiperHeight: ''
    },

    /*imageLoad: function (e) {
        //获取图片真实宽度  
        var imgwidth = e.detail.width,
            imgheight = e.detail.height,
            //宽高比  
            ratio = imgwidth / imgheight;
        //console.log(imgwidth, imgheight);
        //计算的高度值  

        var viewHeight = parseInt(this.data.scrollWidth) / ratio;
        var imgheight = viewHeight.toFixed(0);
        var imgheightarray = this.data.imgheights;
        //把每一张图片的高度记录到数组里
        imgheightarray.push(imgheight);

        this.setData({
            imgheights: imgheightarray,
        });
    },
    swiperChange: function (e) {
        //console.log(e.detail.current);    
        this.setData({
            currentNavtab: e.detail.current
        })
    }, */

  //事件处理函数
  bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    navigate: function (e) {
        var subject = e.currentTarget.dataset.subject;
        wx.navigateTo({
            url: '../' + subject + '/' + subject + '/' + subject,
        })
    },

    onLoad: function () {
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                var windowWidth = res.windowWidth;
                var windowHeight = res.windowHeight;
                _this.setData({
                    imgWidth: windowWidth*0.98,
                    swiperHeight: windowHeight*0.30
                })
            },
        })
    },

    onShow: function () {
        /*if (!app.globalData.authorized) {
          app.auth();
        } */
    }

})
