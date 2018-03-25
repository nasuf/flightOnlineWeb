const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accuracy: 'month',
        customId: '',

        wechatId: '',
        departureDate: '',
        content: '',
        count: '',
        item: '',

        customSignUpMessage: {},

        showTopErrorTips: false,
        errorMsg: ''
    },

    switchDepartureDateAccuracy: function (e) {
        this.setData({
            accuracy: e.detail.value == true ? "day" : "month"
        })
    },

    bindDateChange: function (e) {
        var msg_departureDate = 'customSignUpMessage.departureDate';
        this.setData({
            [msg_departureDate]: e.detail.value
        })
    },

    inputChange: function (e) {
        var key = 'customSignUpMessage.' + e.currentTarget.dataset.key;
        this.setData({
            [key]: e.detail.value
        })
    },

    publish: function () {
        var validated = this.validate();
        if (validated == false)
            return;
        wx.showNavigationBarLoading();
        var customSignUpMessage = this.data.customSignUpMessage;
        wx.request({
            url: app.globalData.serverHost + '/custom/signUp?openid='+app.globalData.openid,
            method: 'POST',
            data: customSignUpMessage,
            success: function(res) {
                if (res.data.status == 'success') {
                    wx.showToast({
                        title: '报名成功',
                        icon: 'success',
                        duration: 1500,
                        success: function () {
                            setTimeout(function () {
                                wx.navigateBack({})
                            }, 1500);
                        }
                    });
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    validate: function() {
        var validatedFlag = true
        var msg = this.data.customSignUpMessage;
        if (!msg.wechatId || msg.wechatId.trim() == '') {
            this.showTopErrorTips('请输入微信号');
            validatedFlag = false;
        } else if (!msg.departureDate || msg.departureDate.trim() == '') {
            this.showTopErrorTips('请选择出行日期');
            validatedFlag = false;
        } else if (!msg.content || msg.content.trim() == '') {
            this.showTopErrorTips('请输入详情');
            validatedFlag = false;
        }
        return validatedFlag;

    },

    showTopErrorTips: function (errorMsg) {
        var that = this;
        this.setData({
            showTopErrorTips: true,
            errorMsg: errorMsg
        });
        setTimeout(function () {
            that.setData({
                showTopErrorTips: false
            });
        }, 1500);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var customId = 'customSignUpMessage.customId';
        var openid = 'customSignUpMessage.openid';
        var nickName = 'customSignUpMessage.nickName';
        var cType = 'customSignUpMessage.type';
        var title = 'customSignUpMessage.title';
        this.setData({
            [customId]: options.customId,
            [openid]: app.globalData.openid,
            [nickName]: app.globalData.userInfo.nickName,
            [cType]: options.type,
            [title]: options.title
        })
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