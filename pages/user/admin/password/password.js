const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prePwdValidated: null,
        newPwdValidated: null,
        password_new: null,
        password_new_again: null,

        showTopErrorTips: false,
        errorMsg: null,
    },

    pwdPreInputBlur: function (e) {
        var prePwd = e.detail.value;
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/validate/password?pwd=' + prePwd + '&openid=' + app.globalData.openid,
            success: function (res) {
                if (res.data.status == 'success') {
                    _this.setData({
                        prePwdValidated: res.data.data
                    })
                }
            }
        })
    },

    pwdNewInputBlur: function(e) {
        var newPwd = e.detail.value;
        var newPwdAgain = this.data.password_new_again;
        this.setData({
            password_new: newPwd
        })
        if (null != newPwdAgain) {
            if (newPwdAgain != newPwd) {
                this.showTopErrorTips('新密码两次输入不一致，请重新输入');
                this.setData({
                    newPwdValidated: false
                })
            } else {
                this.setData({
                    newPwdValidated: true
                })
            }
        }
    },

    pwdNewInputAgainBlur: function(e) {
        var newPwdAgain = e.detail.value;
        this.setData({
            password_new_again: newPwdAgain
        })
        var newPwd = this.data.password_new;
        if (newPwdAgain != newPwd) {
            this.showTopErrorTips('新密码两次输入不一致，请重新输入');
            this.setData({
                newPwdValidated: false
            })
        } else {
            this.setData({
                newPwdValidated: true
            })
        }
    },

    confirm: function() {
        var prePwdValidated = this.data.prePwdValidated;
        var newPwdValidated = this.data.newPwdValidated;
        var _this = this;
        if (null == prePwdValidated) {
            this.setData({
                prePwdValidated: false
            })
        }
        if (null == newPwdValidated) {
            this.setData({
                newPwdValidated: false
            })
        }
        if (this.data.prePwdValidated && this.data.newPwdValidated) {
            var newPwd = this.data.password_new;
            wx.showNavigationBarLoading();
            wx.showLoading({
                title: '更改中',
            })
            wx.request({
                url: app.globalData.serverHost + '/admin/password?openid=' + app.globalData.openid,
                data: newPwd,
                method: 'PUT',
                success: function(res) {
                    if (res.data.status == 'success') {
                        wx.hideNavigationBarLoading();
                        wx.showToast({
                            title: '更改成功',
                            icon: 'success',
                            duration: 1500,
                            success: function () {
                                setTimeout(function () {
                                    wx.navigateBack({})
                                }, 1500);
                            }
                        });
                    } else {
                        _this.showTopErrorTips("更改失败");
                    }
                }
            })
        }
    },

    cancel: function() {
        wx.navigateBack({})
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