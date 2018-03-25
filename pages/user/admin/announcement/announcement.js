const app = getApp()
Page({

    data: {
        announcement: {}
    },

    inputChange: function (e) {
        var key = "announcement.content";
        this.setData({
            [key]: e.detail.value
        })
    },

    showTopErrorTips: function (errorMsg) {
        var that = this;
        this.setData({
            showTopErrorTips: true,
            errorMsg: errorMsg,
        });
        setTimeout(function () {
            that.setData({
                showTopErrorTips: false
            });
        }, 1500);
    },

    confirm: function () {

        if (!this.data.announcement.content || "" == this.data.announcement.content.trim()) {
            this.showTopErrorTips("公告内容不能为空！");
            return;
        }
        wx.showLoading({
            title: '发布中...',
            icon: 'loading',
        });
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/publish/announcement',
            data: this.data.announcement,
            method: 'POST',
            success: function (res) {
                if (res.data.status == 'success') {
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 1000,
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
    }
})