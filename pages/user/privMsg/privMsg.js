const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        types: ["投诉", "建议", "提问", "勾搭"],
        typeValues: ["COMPLAIN", "SUGGESTION", "QUESTION", "SEDUCE"],
        typeIndex: 0,

        msg: {},

        showTopErrorTips: false,
        errorMsg: null
    },

    onLoad: function (options) {
    },

    bindTypeChange: function (e) {
        var key = "msg.type"
        this.setData({
            typeIndex: e.detail.value,
            [key]: this.data.typeValues[e.detail.value]
        })
    },

    inputChange: function (e) {
        var key = "msg." + e.currentTarget.dataset.key;
        this.setData({
            [key]: e.detail.value
        })
    },

    validate: function () {
        var msg = this.data.msg;
        var validated = true
        if (!msg.wechatId || msg.wechatId.trim() == '') {
            this.showTopErrorTips('请输入微信号');
            validated = false;
        } else if (!msg.content || msg.content.trim() == '') {
            this.showTopErrorTips('请输入内容');
            validated = false;
        }
        return validated;
    },

    showTopErrorTips: function (errorMsg) {
        var _this = this;
        this.setData({
            showTopErrorTips: true,
            errorMsg: errorMsg
        });
        setTimeout(function () {
            _this.setData({
                showTopErrorTips: false
            });
        }, 1500);
    },

    send: function () {
        var key = "msg.poster";
        this.setData({
            [key]: app.globalData.openid
        })
        var validated = this.validate();
        if (!this.data.msg.type) {
            var key = 'msg.type';
            this.setData({
                [key]: 'COMPLAIN'
            })
        }
        var _this = this;
        if (validated) {
            wx.showLoading({
                title: '正在发布...',
                icon: 'loading',
            });
            wx.showNavigationBarLoading()
            wx.request({
                url: app.globalData.serverHost + '/user/sent/privmsg',
                data: _this.data.msg,
                method: 'POST',
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.status == 'success') {

                        wx.hideNavigationBarLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            success: function () {
                                setTimeout(function () {
                                    wx.navigateBack({})
                                }, 1500);
                            }
                        });
                    } else {
                        _this.showTopErrorTips('发布失败，请重试');
                    }
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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