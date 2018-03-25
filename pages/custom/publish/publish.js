const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        types: ["长期优惠", "小众路线", "独享资源"],
        typeValues: ["DISCOUNT", "ROUTE", "RESOURCE"],
        typeIndex: 0,

        joinTypes: ["扫码咨询", "分享链接"],
        joinTypesValues: ["SCAN", "LINK"],
        joinTypeIndex: 0,

        urlCounts: [0,],
        urls: [],

        custom: {

        },

        showTopErrorTips: false,
        errorMsg: null
    },

    onLoad: function (options) {
        var custom_poster = "custom.poster";
        var custom_posterAvatarUrl = "custom.posterAvatarUrl";
        var custom_posterNickName = "custom.posterNickName";
        var custom_type = "custom.type";
        var custom_joinType = "custom.joinType";

        this.setData({
            [custom_poster]: app.globalData.openid,
            [custom_posterAvatarUrl]: app.globalData.userInfo.avatarUrl,
            [custom_posterNickName]: app.globalData.userInfo.nickName,
            [custom_type]: "DISCOUNT",
            [custom_joinType]: "SCAN"
        })
    },

    bindTypeChange: function (e) {
        var key = "custom.type"
        this.setData({
            typeIndex: e.detail.value,
            [key]: this.data.typeValues[e.detail.value]
        })
    },

    bindJoinTypeChange: function (e) {
        var key = "custom.joinType";
        this.setData({
            joinTypeIndex: e.detail.value,
            [key]: this.data.joinTypesValues[e.detail.value]
        })
    },

    addMoreUrl: function () {
        var counts = this.data.urlCounts;
        counts.push(counts[counts.length - 1] + 1);
        this.setData({
            urlCounts: counts
        })
    },

    inputChange: function (e) {
        var key = "custom." + e.currentTarget.dataset.key;
        this.setData({
            [key]: e.detail.value
        })
    },

    urlInputChange: function (e) {
        var urls = this.data.urls;
        var key =  "custom.urls";
        urls[e.currentTarget.dataset.urlindex] = e.detail.value;
        this.setData({
            [key]: urls
        })
    },

    validate: function () {
        var custom = this.data.custom;
        var validated = true
        if (!custom.title || custom.title.trim() == '') {
            this.showTopErrorTips('请输入标题');
            validated = false;
        } else if (custom.type == 'DISCOUNT' && (!custom.subType || custom.subType.trim() == '')) {
            this.showTopErrorTips('请输入子类');
            validated = false;
        } else if (custom.joinType == "LINK" && (!custom.urls || custom.urls.length == 0)) {
            this.showTopErrorTips('请输入链接');
            validated = false;
        } else if (!custom.content || custom.content.trim() == '') {
            this.showTopErrorTips('请输入详情');
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

    publish: function() {
        var urlArr = this.data.custom.urls;
        var urls = new Array();
        for (var i in urlArr) {
            if (urlArr[i] && urlArr[i].trim()) 
                urls.push(urlArr[i]);
        }
        var key = "custom.urls"
        this.setData({
            [key]: urls
        })
        var validated = this.validate();
        var _this = this;
        if (validated) {
            wx.showLoading({
                title: '正在发布...',
                icon: 'loading',
            });
            wx.showNavigationBarLoading()
            wx.request({
                url: app.globalData.serverHost + '/custom/custom',
                data: _this.data.custom,
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
                                    wx.redirectTo({
                                        url: '../custom/custom',
                                    })
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