const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        vipPageNumber: 0,
        userPageNumber: 0,

        vips: [],
        users: [],
        vipCount: null,
        userCount: null,

        isVipFirstLoad: true,
        vipModuleDisplay: true,
        userModuleDisplay: false,

        isUserFirstLoad: true,


        vipSort: {
            beVipDate: 'DESC'
        },

        userSort: {
            registerDate: 'DESC'
        }
    },

    toggleVipModule: function () {

        if (this.data.isVipFirstLoad) {
            this.loadVips();
            this.setData({
                vipModuleDisplay: !this.data.vipModuleDisplay,
                isVipFirstLoad: false
            })
        } else {
            this.setData({
                vipModuleDisplay: !this.data.vipModuleDisplay,
            })
        }
    },

    toggleUserModule: function () {

        if (this.data.isUserFirstLoad) {
            this.loadUsers();
            this.setData({
                userModuleDisplay: !this.data.userModuleDisplay,
                isUserFirstLoad: false
            })
        } else {
            this.setData({
                userModuleDisplay: !this.data.userModuleDisplay,
            })
        }
    },

    loadUsers: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/users?role=USER&pageNumber=' + this.data.userPageNumber + '&pageSize=20&sort=' + encodeURIComponent(JSON.stringify(this.data.userSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var users = res.data.data.data;
                    var userCount = res.data.data.userCount;
                    var vipCount = res.data.data.vipCount
                    var userArr = _this.data.users;
                    for (var i in users) {
                        userArr.push(users[i])
                    }
                    _this.setData({
                        users: userArr,
                        userCount: userCount,
                        vipCount: vipCount,
                        userPageNumber: _this.data.userPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadVips: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/users?role=VIP&pageNumber=' + this.data.vipPageNumber + '&pageSize=20&sort=' + encodeURIComponent(JSON.stringify(this.data.vipSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var vips = res.data.data.data;
                    var userCount = res.data.data.userCount;
                    var vipCount = res.data.data.vipCount
                    var vipArr = _this.data.vips;
                    for (var i in vips) {
                        vipArr.push(vips[i])
                    }
                    _this.setData({
                        vips: vipArr,
                        vipCount: vipCount,
                        userCount: userCount,
                        vipPageNumber: _this.data.vipPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    openActionSheet: function (e) {
        var _this = this;
        var openid = e.currentTarget.dataset.openid;
        var nickName = e.currentTarget.dataset.nickname;
        nickName = (nickName && nickName.length <= 5) ? nickName : nickName.substr(0, 6) + '...';
        var value = e.detail.value;
        var currentRole = e.currentTarget.dataset.currentrole;
        wx.showActionSheet({
            itemList: currentRole == 'USER' ? ['授予【'+nickName+'】VIP会员权限'] : ['取消【'+nickName+'】VIP会员权限'],
            success: function (res) {
                if (!res.cancel) {
                    wx.showModal({
                        content: currentRole == 'USER' ? '确认授予该用户会员权限吗？' : '确认取消该用户会员权限吗？',
                        confirmText: "确认",
                        cancelText: "取消",
                        success: function (res) {
                            var value = currentRole == 'USER' ? true : false;
                            if (res.confirm) {
                                _this.grantAccess(openid, value );
                            }
                        }
                    });
                }
            }
        })
    },

    // roleChange: function (e) {
    //     var _this = this;
    //     var openid = e.currentTarget.dataset.openid;
    //     var value = e.detail.value;
    //     var currentRole = e.currentTarget.dataset.currentrole;
    //     wx.showModal({
    //         //title: '确认删除此内容吗？',
    //         content: '确认' + (value == false ? '取消该用户会员权限吗？' : '授予该用户会员权限吗？'),
    //         confirmText: "确认",
    //         cancelText: "取消",
    //         success: function (res) {
    //             console.log(res);
    //             if (res.confirm) {
    //                 _this.grantAccess(openid, value)
    //             }
    //         }
    //     });
    // },

    grantAccess: function (openid, value) {
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/access?openid=' + openid + '&value=' + value,
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    wx.showToast({
                        title: '操作成功',
                        icon: 'success',
                        duration: 1000,
                        success: function () {
                            setTimeout(function () {
                                _this.setData({
                                    vipPageNumber: 0,
                                    userPageNumber: 0,

                                    vips: [],
                                    users: [],

                                    isVipFirstLoad: true,
                                    vipModuleDisplay: true,
                                    userModuleDisplay: false,

                                    isUserFirstLoad: true
                                })
                                _this.loadVips();
                                _this.loadUsers();
                            }, 1500);
                        }
                    });
                }
            }
        })
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value,
            queryUsers: []
        });
        var keywords = this.data.inputVal;
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/admin/user/specific?keywords=" + keywords,
            method: "GET",
            success: function (res) {
                if (res.data.status == "success") {
                    var queryUsers = res.data.data;
                    _this.setData({
                        queryUsers: queryUsers
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadVips();
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