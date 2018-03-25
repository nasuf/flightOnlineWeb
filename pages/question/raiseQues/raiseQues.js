const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        showTopErrorTips: false,
        errorMsg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var question_poster = "question.poster";
        var question_posterAvatarUrl = "question.posterAvatarUrl";
        var question_posterNickName = "question.posterNickName";

        this.setData({
            [question_poster]: app.globalData.openid,
            [question_posterAvatarUrl]: app.globalData.userInfo.avatarUrl,
            [question_posterNickName]: app.globalData.userInfo.nickName
        })
    },

    inputChange: function (e) {
        var question_item = "question." + e.currentTarget.dataset.type;
        this.setData({
            [question_item]: e.detail.value
        })
    },

    post: function () {

        if (!this.data.question.title || this.data.question.title.trim() == "") {
            this.showTopErrorTips("标题不能为空")
            return;
        } else if (!this.data.question.content || this.data.question.content.trim() == "") {
            this.showTopErrorTips("内容不能为空")
            return;
        } else {
            var _this = this;
            wx.showNavigationBarLoading();
            wx.request({
                url: app.globalData.serverHost + "/question/question",
                method: "POST",
                data: _this.data.question,
                success: function (res) {
                    console.log(res.data);
                    if (res.data.status == "success") {
                        wx.showToast({
                            title: '提问成功',
                            icon: 'success',
                            success: function () {
                                setTimeout(function () {
                                    wx.hideLoading();
                                    wx.hideNavigationBarLoading();
                                    wx.navigateBack({})
                                }, 1500);
                            }
                        });
                    }
                }
            })
        }
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