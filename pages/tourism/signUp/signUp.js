const app = getApp()
Page({

    data: {
        wechatId: null,
        showTopErrorTips: false,
        errorMsg: null,
        tourismId: '',
        personalMsg: '',
        tourismPoster: ''
    },

    wechatIdInput: function (e) {
        this.setData({
            wechatId: e.detail.value
        })
    },

    personalMsgInput: function(e) {
        this.setData({
            personalMsg: e.detail.value
        })
    },

    showTopErrorTips: function (errorMsg) {
        var that = this;
        this.setData({
            showTopErrorTips: true,
            errorMsg: errorMsg,
            wechatId: null
        });
        setTimeout(function () {
            that.setData({
                showTopErrorTips: false
            });
        }, 1500);
    },

    confirm: function () {

        if (!this.data.wechatId || "" == this.data.wechatId.trim()) {
            this.showTopErrorTips("微信号不能为空！");
            return;
        }
        wx.showLoading({
            title: '校验中...',
            icon: 'loading',
        });
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/tourism/tourism/signUp?openid=' + app.globalData.openid + "&wechatId=" + this.data.wechatId + '&tourismId=' + this.data.tourismId + '&personalMsg=' + this.data.personalMsg + '&tourismPoster=' + this.data.tourismPoster,
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    console.log(res);
                    wx.hideLoading();
                    wx.showLoading({
                        title: '提交成功',
                        icon: 'success',
                        duration: 1500,
                        success: function () {
                            setTimeout(function () {
                                wx.navigateBack({})
                            }, 1500);
                        }
                    });
                }
            }
        })
    },

    cancel: function () {
        wx.navigateBack({

        })
    },

    onLoad: function (options) {
        console.log(options.target)
        this.setData({
            tourismId: options.tourismId,
            tourismPoster: options.tourismPoster
        })
    }
})