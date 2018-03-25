const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        beRepliedContent: '',
        beRepliedPosterNickName: '',
        message: {
            poster: '',
            posterAvatarUrl: '',
            posterNickName: '',
            content: '',
            beRepliedTopicId: '',
            beRepliedMessageId: '',
            type: '',
            subject: ''
        },
        showTopErrorTips: false,
        errorMsg: '',
        placeholder: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var message_beRepliedTopicId = "message.beRepliedTopicId";
        var message_beRepliedTopicTitle = "message.beRepliedTopicTitle";
        var message_beRepliedMessageId =  "message.beRepliedMessageId";
        var message_beRepliedPoster = "message.beRepliedPoster";
        var message_beRepliedPostDate = "message.beRepliedPostDate";

        var message_type = "message.type";
        var message_subject = "message.subject";
        var message_avatarUrl = "message.posterAvatarUrl";
        var message_poster_nickname = "message.posterNickName";
        
        this.setData({
            beRepliedContent: app.globalData.beRepliedContent,//options.beRepliedContent,
            beRepliedPostDate: options.beRepliedPostDate,
            beRepliedPosterNickName: options.beRepliedPosterNickName,
            placeholder: options.beRepliedPosterNickName ? "回复给" + options.beRepliedPosterNickName : "在此输入回复内容",
            [message_beRepliedTopicId]: options.beRepliedTopicId,
            [message_beRepliedTopicTitle]: options.beRepliedTopicTitle,
            [message_beRepliedMessageId]: options.beRepliedMessageId,
            [message_beRepliedPoster]: options.beRepliedPoster,
            [message_beRepliedPostDate]: options.beRepliedPostDate,
            [message_type]: options.type,
            [message_subject]: options.subject,
            [message_avatarUrl]: app.globalData.userInfo.avatarUrl,
            [message_poster_nickname]: app.globalData.userInfo.nickName
        })

        this.data.message.formatedBeRepliedPostDate = app.formatDate(this.data.message.beRepliedPostDate)
    },

    inputChange: function(e) {
        var message_poster = "message.poster";
        var message_content = "message.content";
        this.setData({
            [message_poster]: app.globalData.openid,
            [message_content]: e.detail.value
        })
    },

    post: function() {
        
        if (!this.data.message.content || this.data.message.content.trim() == "") {
            this.showTopErrorTips("评论不能为空")
            return;
        } else {
            var _this = this;
            wx.showNavigationBarLoading();
            //this.revertDateFormat(this.data.message.beRepliedPostDate);
            wx.request({
                url: app.globalData.serverHost + "/message/message",
                method: "POST",
                data: _this.data.message,
                success: function(res) {
                    console.log(res.data);
                    if (res.data.status == "success") {
                        wx.showToast({
                            title: '评论成功',
                            icon: 'success',
                            duration: 1500,
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

    revertDateFormat: function(strDate) {
        if (strDate) {
            if (strDate.split('-')[0].length != 4) {
                strDate = new Date().getYear() + 1900 + '-' + strDate;
            }
            this.data.message.beRepliedPostDate = new Date(strDate).getTime();
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