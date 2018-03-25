const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wechatId: '',
        errorMsg: '',
        showTopErrorTips: ''
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
            title: '提交中...',
            icon: 'loading',
        });
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/tickets/oldMember/validate?openid=' + app.globalData.openid + "&wechatId=" + this.data.wechatId,
            method: 'GET',
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.status == "failure") {
                    _this.showTopErrorTips("提交失败，请重新提交");
                } else {
                    wx.showLoading({
                        title: '提交成功！',
                        icon: 'success',
                        duration: 2000,
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
        wx.navigateBack({})
    },

    wechatIdInput: function (e) {
        this.setData({
            wechatId: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})