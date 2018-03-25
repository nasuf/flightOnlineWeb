const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        privPageNumber: 0,
        oldPageNumber: 0,
        msgs: [],
        oldMembers: [],
        isPrivMsgFirstLoad: true,
        isOldMemberFirstLoad: true,
        privMsgModuleDisplay: true,
        oldMemberModuleDisplay: false,
        privSort: {
            postDate: 'DESC'
        },
        oldSort: {
            requestVipDate: 'DESC'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadPrivMsgs();
    },

    togglePrivModule: function() {
        if (this.data.isPrivMsgFirstLoad) {
            this.loadPrivMsgs();
            this.setData({
                privMsgModuleDisplay: !this.data.privMsgModuleDisplay,
                isPrivMsgFirstLoad: false
            })
        } else {
            this.setData({
                privMsgModuleDisplay: !this.data.privMsgModuleDisplay,
            })
        }
    },

    toggleOldMemberModule: function() {
        if (this.data.isOldMemberFirstLoad) {
            this.loadUnVipedOldMembers();
            this.setData({
                oldMemberModuleDisplay: !this.data.oldMemberModuleDisplay,
                isOldMemberFirstLoad: false
            })
        } else {
            this.setData({
                oldMemberModuleDisplay: !this.data.oldMemberModuleDisplay,
            })
        }
    },

    loadUnVipedOldMembers: function() {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/oldMember/unViped?pageNumber=' + this.data.oldPageNumber + '&pageSize=20&sort=' + encodeURIComponent(JSON.stringify(this.data.oldSort)),
            method: 'GET',
            success: function(res) {
                if(res.data.status == 'success') {
                    var members = res.data.data;
                    var memberArr = _this.data.oldMembers;
                    for (var i in members) {
                        members[i].requestVipDate = app.formatDate(members[i].requestVipDate);
                        memberArr.push(members[i]);
                    }
                    _this.setData({
                        oldMembers: memberArr,
                        oldPageNumber: _this.data.oldPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadPrivMsgs: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/privMessage?pageNumber=' + this.data.privPageNumber + '&pageSize=20' + '&sort=' + encodeURIComponent(JSON.stringify(this.data.privSort)),
            method: 'GET',
            success: function(res) {
                if (res.data.status == 'success') {
                    var msgs = res.data.data;
                    var msgArr = _this.data.msgs;
                    for (var i in msgs) {
                        msgs[i].postDate = app.formatDate(msgs[i].postDate);
                        var msgType = msgs[i].type;
                        var mType = '';
                        switch (msgType) {
                            case 'SUGGESTION':
                                mType = '建议';
                                break;
                            case 'COMPLAIN':
                                mType = '投诉';
                                break;
                            case 'QUESTION':
                                mType = '提问';
                                break;
                            case 'SEDUCE':
                                mType = '勾搭';
                                break;
                        }
                        msgs[i].type = mType;
                        msgs[i].previousContent = msgs[i].content;
                        msgs[i].content = msgs[i].content.length > 20 ? msgs[i].content.substr(0, 20) + '...' : msgs[i].content;
                        msgArr.push(msgs[i]);
                    }
                    _this.setData({
                        msgs: msgArr,
                        privPageNumber: _this.data.privPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                    app.globalData.adminPrivMsgsReceived = msgArr;
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
        wx.showActionSheet({
            itemList: ['授予【'+nickName+'】VIP会员权限'],
            success: function (res) {
                if (!res.cancel) {
                    wx.showModal({
                        content: '确认授予该用户会员权限吗？',
                        confirmText: "确认",
                        cancelText: "取消",
                        success: function (res) {
                            var value =  true;
                            if (res.confirm) {
                                _this.grantAccess(openid, value);
                            }
                        }
                    });
                }
            }
        })
    },

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
                                    oldPageNumber: 0,

                                    oldMembers: [],

                                    isOldMemberFirstLoad: true,
                                    oldMemberModuleDisplay: true,
                                })
                                _this.loadUnVipedOldMembers();
                            }, 1500);
                        }
                    });
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