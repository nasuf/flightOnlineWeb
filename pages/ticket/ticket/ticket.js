const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        role: null,
        adminLoginStatus: false,
        announcement_hidden: false,

        showTopErrorTips: false,
        errorMsg: "",

        pageNumber: 0,

        ticket: {
            title: null,
            isSingleFlight: false,
            airline: null,
            price: null,
            departureDateFrom: null,
            departureDateTo: null,
            departureCountry: null,
            departureCity: null,
            arrivalCountry: null,
            arrivalCity: null,
            isTurning: false,
            turningCity: null,
            info: null
        },
         
        tickets: [],
        announcement: null,

        style: '',

        sort: {
            publishDate: 'DESC'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            role: app.globalData.role,
            announcement_hidden: app.globalData.role == 'VIP' ? true : false,
            pageNumber: 0,
            tickets: []
        })
        this.loadAnnouncement();
        this.checkAdminLoginStatus();
        this.loadData();
    },

    onShow: function() {
        var toBeRemovedTopicId = app.globalData.toBeRemovedTopicId;
        if (null != toBeRemovedTopicId && this.data.tickets) {
            var filteredTickets = []
            var tickets = this.data.tickets;
            for (var i in tickets) {
                if (toBeRemovedTopicId != tickets[i].id) {
                    filteredTickets.push(tickets[i])
                }
            }
            this.setData({
                tickets: filteredTickets
            })
        }
        app.globalData.toBeRemovedTopicId = null;
    },

    /*onShow: function () {
        this.setData({
            role: app.globalData.role,
            pageNumber: 0,
            tickets: []
        })
        this.checkAdminLoginStatus();
        this.loadData();
    }, */

    loadAnnouncement: function() {
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/tickets/announcement',
            method: 'GET',
            success: function(res) {
                if (res.data.status == 'success') {
                    _this.setData({
                        announcement: res.data.data
                    })
                }
            }
        })
    },

    onPullDownRefresh: function () {
        //wx.showNavigationBarLoading() //在标题栏中显示加载
        console.log("loading")
        this.loadData();
        //模拟加载
        /*setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500); */
    },

    publishBtnClick: function () {
        if (app.globalData.adminLoginStatus == true) {
            wx.navigateTo({
                url: '../publish/publish',
            })
        } else {
            wx.navigateTo({
                url: '../../adminLogin/adminLogin?part=ticket&target=publish',
            })
        }
    },

    requestJoin: function() {
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
                url: '../qr/qr',
            })
        }
    },

    checkAdminLoginStatus: function() {
        if (app.globalData.role == 'ADMIN') {
            var _this = this;
            // check adminLoginKey
            wx.getStorage({
                key: 'adminLoginKey',
                success: function (res) {
                    console.log("adminLoginKey: " + res.data);
                    var adminLoginKey = res.data;
                    wx.request({
                        url: app.globalData.serverHost + '/auth/validate/adminOnlineStatus?openid=' + app.globalData.openid + '&adminLoginKey=' + adminLoginKey,
                        method: 'GET',
                        success: function (res) {
                            console.log("adminLoginStatus:" + res.data.data.adminLoginStatus);
                            var adminLoginStatus = res.data.data.adminLoginStatus;
                            if (adminLoginStatus == true) {
                                _this.setData({
                                    adminLoginStatus: true
                                })
                                app.globalData.adminLoginStatus = true;
                            } else {
                                _this.setData({
                                    adminLoginStatus: false
                                })
                                app.globalData.adminLoginStatus = false;
                            }
                        }
                    })
                },
                fail: function (res) {
                    app.globalData.adminLoginStatus = false;
                    _this.setData({
                        adminLoginStatus: false
                    })
                }
            })
        }
    },

    loadData: function() {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/tickets/tickets?pageNumber=' + this.data.pageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == "success") {
                    var tickets = res.data.data;
                    var ticketsArr = _this.data.tickets;
                    for (var i in tickets) {
                        var ticket = tickets[i];
                        ticket.publishYear = new Date(ticket.publishDate).getYear() + 1900;
                        ticket.publishDate = app.formatDate(ticket.publishDate);
                        // if (ticket.publishDate) {
                        //     ticket.publishDate = ticket.publishDate.split(' ')[0] + ' ' + ticket.publishDate.split(' ')[1]
                        //     if (ticket.publishDate.split('-')[0] == (new Date().getYear() + 1900)) {
                        //         ticket.publishDate = ticket.publishDate.substr(5)
                        //     }
                        // }
                        ticketsArr.push(tickets[i])
                    }
                    _this.setData({
                        tickets: ticketsArr,
                        pageNumber: _this.data.pageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                    wx.hideLoading();
                }
            }
        })
    },

    onCheckDetail: function(e) {
        console.log("to check detail, id:" + e.currentTarget.dataset.id);
        if (this.data.role == "ADMIN" || this.data.role == "VIP") {
            wx.navigateTo({
                url: '../ticketDetail/ticketDetail?ticketId=' + e.currentTarget.dataset.id
            })
        } else {
            this.showTopErrorTips("请先加群")
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

    redirectToInputWechatId: function() {
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
                url: '../oldMember/oldMember',
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log("onReady")
    },

    /**
     * 生命周期函数--监听页面显示
     */

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("onHide")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log("onUnload")
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

    },

    checkAll: function () {
        console.log("check all")
    }
})

