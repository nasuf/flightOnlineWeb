const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNumber: 0,
        msgs: [],
        sort: {
            signUpDate: 'DESC'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadMessages();
    },

    loadMessages: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/custom/signUp/msg?pageNumber=' + this.data.pageNumber + '&pageSize=20' + '&sort=' + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var msgs = res.data.data;
                    var msgArr = _this.data.msgs;
                    for (var i in msgs) {
                        msgs[i].signUpDate = app.formatDate(msgs[i].signUpDate);
                        msgs[i].previousContent = msgs[i].content;
                        msgs[i].content = msgs[i].content.length > 20 ? msgs[i].content.substr(0, 20) + '...' : msgs[i].content;
                        msgArr.push(msgs[i]);
                    }
                    _this.setData({
                        msgs: msgArr,
                        pageNumber: _this.data.pageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                    app.globalData.customSignUpMessages = msgArr;
                }
            }
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
        this.loadPrivMsgs();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})