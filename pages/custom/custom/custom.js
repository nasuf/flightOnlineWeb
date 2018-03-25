const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        role: null,
        customs: [],
        pageNumber: 0,
        type: 'DISCOUNT',
        backgdNormalStyle: 'background-color: white !important;border-color: white !important;',
        backgdFocusStyle: 'background-color: gainsboro !important;border-color: gainsboro !important;',
        discountStyle: '',
        routeStyle: '',
        resourceStyle: '',
        sort: {
            postDate: 'DESC'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            role: app.globalData.role,
            discountStyle: this.data.backgdFocusStyle,
            pageNumber: 0,
            customs: []
        })
        this.loadData();
    },

    onShow: function () {
        var toBeRemovedTopicId = app.globalData.toBeRemovedTopicId;
        if (null != toBeRemovedTopicId && this.data.customs) {
            var filteredCustoms = []
            var customs = this.data.customs;
            for (var i in customs) {
                if (toBeRemovedTopicId != customs[i].id) {
                    filteredCustoms.push(customs[i])
                }
            }
            this.setData({
                customs: filteredCustoms
            })
        }
        app.globalData.toBeRemovedTopicId = null;
    },

    onPublishTap: function () {
        if (app.globalData.adminLoginStatus == true) {
            wx.navigateTo({
                url: '../publish/publish',
            })
        } else {
            wx.navigateTo({
                url: '../../adminLogin/adminLogin?part=custom&target=publish',
            })
        }
    },

    onTypeTap: function (e) {
        this.setData({
            pageNumber: 0,
            type: e.currentTarget.dataset.type,
            customs: []
        });
        
        var type = e.currentTarget.dataset.type;
        if (type == 'DISCOUNT') {
            this.setData({
                discountStyle: this.data.backgdFocusStyle,
                routeStyle: this.data.backgdNormalStyle,
                resourceStyle: this.data.backgdNormalStyle
            })
        } else if (type == 'ROUTE') {
            this.setData({
                discountStyle: this.data.backgdNormalStyle,
                routeStyle: this.data.backgdFocusStyle,
                resourceStyle: this.data.backgdNormalStyle
            })
        } else {
            this.setData({
                discountStyle: this.data.backgdNormalStyle,
                routeStyle: this.data.backgdNormalStyle,
                resourceStyle: this.data.backgdFocusStyle
            })
        }
        if (type == 'RESOURCE' && this.data.role != 'ADMIN' && this.data.role != 'VIP') {
            wx.showModal({
                content: '只有入群会员才有资格查看本版块内容哦！如需入群请与管理员咖喱微信详询哦！',
                confirmText: "我要加群",
                cancelText: "取消",
                success: function (res) {
                    console.log(res);
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../../ticket/qr/qr'
                        })
                    }
                }
            });
        } else {
            this.loadData();
        }
    },

    

    loadData: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/custom/customs?type=' + this.data.type + '&pageNumber=' + this.data.pageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var customs = res.data.data;
                    var customsArr = _this.data.customs;
                    for (var i in customs) {
                        var custom = customs[i];
                        if (custom.postDate) {
                            custom.postDate = app.formatDate(custom.postDate);
                            // custom.postDate = custom.postDate.split(' ')[0] + ' ' + custom.postDate.split(' ')[1]
                            // if (custom.postDate.split('-')[0] == (new Date().getYear() + 1900)) {
                            //     custom.postDate = custom.postDate.substr(5)
                            // }
                        }
                        customsArr.push(customs[i])
                    }
                    wx.hideNavigationBarLoading();
                    _this.setData({
                        customs: customsArr,
                        pageNumber: _this.data.pageNumber + 1
                    })
                }
            }
        })
    },

    onCheckDetail: function (e) {
        wx.navigateTo({
            url: '../customDetail/customDetail?customId=' + e.currentTarget.dataset.customid,
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