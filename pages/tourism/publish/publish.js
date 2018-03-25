const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
    
        tourism: {
            title: '',
            participantCnt: '',
            contact: '',
            departureDate: '',
            duration: '',
            departureLocation: '',
            content: ''
        },

        showTopErrorTips: false,
        errorMsg: null

    },

    inputChange: function (e) {
        //var key = e.currentTarget.dataset.key;
        var key = "tourism." + e.currentTarget.dataset.key;
        this.setData({
            // ticket: {
            //     [key]: e.detail.value
            // }
            [key]: e.detail.value
        })
    },

    bindDateChange: function(e) {
        var tourism_departureDate = "tourism." + e.currentTarget.dataset.key;
        this.setData({
            [tourism_departureDate]: e.detail.value
        })
    },

    publishTourism: function() {
        var _this = this;
        var validated = this.validate();
        if (validated) {
            this.data.tourism.posterNickName = app.globalData.userInfo.nickName;
            this.data.tourism.posterAvatarUrl = app.globalData.userInfo.avatarUrl;
            wx.showLoading({
                title: '正在发布...',
                icon: 'loading',
            });
            wx.showNavigationBarLoading()
            wx.request({
                url: app.globalData.serverHost + '/tourism/publish/tourism?openid=' + app.globalData.openid,
                data: _this.data.tourism,
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

    validate: function() {
        var tourism = this.data.tourism;
        var validated = true
        if (!tourism.title || tourism.title.trim() == '') {
            this.showTopErrorTips('请输入标题');
            validated = false;
        } else if (!tourism.participantCnt || tourism.participantCnt.trim() == '') {
            this.showTopErrorTips('请输入结伴人数');
            validated = false;
        } else if (!tourism.contact || tourism.contact.trim() == '') {
            this.showTopErrorTips('请输入联系方式');
            validated = false;
        } else if (!tourism.departureDate || tourism.departureDate.trim() == '') {
            this.showTopErrorTips('请输入出发日期');
            validated = false;
        } else if (!tourism.duration || tourism.duration.trim() == '') {
            this.showTopErrorTips('请输入出行时间');
            validated = false;
        } else if (!tourism.departureLocation || tourism.departureLocation.trim() == '') {
            this.showTopErrorTips('请输入出发城市');
            validated = false;
        } else if (!tourism.arrivalLocation || tourism.arrivalLocation.trim() == '') {
            this.showTopErrorTips('请输入到达城市');
            validated = false;
        } 
        
        return validated;

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