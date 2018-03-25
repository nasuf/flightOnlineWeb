const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tourisms: [],
        pageNumber: 0,
        sort: {
            postDate: 'DESC'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            pageNumber: 0,
            tourisms: []
        })
        this.loadData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var toBeRemovedTopicId = app.globalData.toBeRemovedTopicId;
        if (null != toBeRemovedTopicId && this.data.tourisms) {
            var filteredTourisms = []
            var tourisms = this.data.tourisms;
            for (var i in tourisms) {
                if (toBeRemovedTopicId != tourisms[i].id) {
                    filteredTourisms.push(tourisms[i])
                }
            }
            this.setData({
                tourisms: filteredTourisms
            })
        }
        app.globalData.toBeRemovedTopicId = null;
    },

    publishTap: function () {
        if (!app.globalData.authorized) {
            wx.showModal({
                title: '用户未授权',
                content: '如需正常使用该小程序的全部功能，请允许我们获取您的已公开的微信用户信息（如微信昵称，头像等）。请在个人中心页面中点击授权。谢谢配合！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.switchTab({
                            url: '/pages/user/index/index',
                        })
                    }
                }
            })
        } else {
            wx.navigateTo({
                url: '../publish/publish',
            })
        }
    },

    loadData: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/tourism/tourisms?pageNumber=' + this.data.pageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == "success") {
                    var tourisms = res.data.data;
                    var tourismArr = _this.data.tourisms;
                    for (var i in tourisms) {
                        var tourism = tourisms[i];
                        if (tourism.postDate) {
                            tourism.postDate = app.formatDate(tourism.postDate);
                            // tourism.postDate = tourism.postDate.split(' ')[0] + ' ' + tourism.postDate.split(' ')[1]
                            // if (tourism.postDate.split('-')[0] == (new Date().getYear() + 1900)) {
                            //     tourism.postDate = tourism.postDate.substr(5)
                            // }
                        }
                        tourismArr.push(tourisms[i])
                    }
                    _this.setData({
                        tourisms: tourismArr,
                        pageNumber: _this.data.pageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                    wx.hideLoading();
                }
            }
        })
    },

    onCheckDetail: function(e) {
        wx.navigateTo({
            url: '../tourismDetail/tourismDetail?tourismId=' + e.currentTarget.dataset.tourismid,
        })
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
        this.loadData();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})