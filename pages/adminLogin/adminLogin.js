const app = getApp()

Page({

    data: {
        password: null,
        showTopErrorTips: false,
        errorMsg: null,
        target: null,
        part: null
    },

    pwdInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },

    showTopErrorTips: function (errorMsg) {
        var that = this;
        this.setData({
            showTopErrorTips: true,
            errorMsg: errorMsg,
            password: null
        });
        setTimeout(function () {
            that.setData({
                showTopErrorTips: false
            });
        }, 1500);
    },

    confirm: function () {
        
        if (!this.data.password || "" == this.data.password.trim()) {
            this.showTopErrorTips("密码不能为空！");
            return;
        }
        wx.showLoading({
            title: '校验中...',
            icon: 'loading',
        });
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/auth/admin/login/?openid=' + app.globalData.openid,
            data: this.data.password,
            method: 'POST',
            success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.data.data.adminLoginStatus == false) {
                    _this.showTopErrorTips("密码错误，请重新输入");
                } else {
                    app.globalData.adminLoginStatus = true;
                    wx.setStorage({
                        key: 'adminLoginKey',
                        data: res.data.data.adminLoginKey,
                    })
                    wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1500,
                        success: function () {
                            setTimeout(function () {
                                if (null != _this.data.target) {
                                    wx.redirectTo({
                                        url: '../' + _this.data.part + "/" + _this.data.target + "/" + _this.data.target,
                                    })
                                } else {
                                    wx.navigateBack({})
                                }
                                
                            }, 1500);
                        }
                    });
                }

            }
        })
    },

    cancel: function () {
        wx.navigateBack({

        })
    },

    onLoad: function(options) {
        console.log(options.target)
        this.setData({
            target: options.target,
            part: options.part
        })
    }
});