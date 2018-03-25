const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ticketMsgPageNumber: 0,
        tourismMsgPageNumber: 0,
        questionMsgPageNumber: 0,
        customMsgPageNumber: 0,

        ticketsMsg: [],
        tourismsMsg: [],
        questionsMsg: [],
        customsMsg: [],

        isTicketMsgFirstLoad: true,
        isTourismMsgFirstLoad: true,
        isQuestionMsgFirstLoad: true,
        isCustomMsgFirstLoad: true,

        ticketMsgModuleDisplay: true,
        tourismMsgModuleDisplay: false,
        questionMsgModuleDisplay: false,
        customMsgModuleDisplay: false,

        ticketMsgSort: {
            deletedDate: 'DESC'
        },

        tourismMsgSort: {
            deletedDate: 'DESC'
        },

        questionMsgSort: {
            deletedDate: 'DESC'
        },

        customMsgSort: {
            deletedDate: 'DESC'
        }
    },

    toggleTicketMsgModule: function () {
        if (this.data.isTicketMsgFirstLoad) {
            this.loadTicketsMsg();
            this.setData({
                ticketMsgModuleDisplay: !this.data.ticketMsgModuleDisplay,
                isTicketMsgFirstLoad: false
            })
        } else {
            this.setData({
                ticketMsgModuleDisplay: !this.data.ticketMsgModuleDisplay,
            })
        }
    },

    toggleTourismMsgModule: function () {
        if (this.data.isTourismMsgFirstLoad) {
            this.loadTourismsMsg();
            this.setData({
                tourismMsgModuleDisplay: !this.data.tourismMsgModuleDisplay,
                isTourismMsgFirstLoad: false
            })
        } else {
            this.setData({
                tourismMsgModuleDisplay: !this.data.tourismMsgModuleDisplay
            })
        }
    },

    toggleQuestionMsgModule: function () {
        if (this.data.isQuestionMsgFirstLoad) {
            this.loadQuestionsMsg();
            this.setData({
                questionMsgModuleDisplay: !this.data.questionMsgModuleDisplay,
                isQuestionMsgFirstLoad: false
            })
        } else {
            this.setData({
                questionMsgModuleDisplay: !this.data.questionMsgModuleDisplay
            })
        }
    },

    toggleCustomMsgModule: function () {
        if (this.data.isCustomMsgFirstLoad) {
            this.loadCustomsMsg();
            this.setData({
                customMsgModuleDisplay: !this.data.customMsgModuleDisplay,
                isCustomMsgFirstLoad: false
            })
        } else {
            this.setData({
                customMsgModuleDisplay: !this.data.customMsgModuleDisplay
            })
        }
    },

    loadTicketsMsg: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/messages/deleted?subject=TICKET&pageNumber=' + this.data.ticketMsgPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.ticketMsgSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var ticketsMsg = res.data.data;
                    var ticketsMsgArr = _this.data.ticketsMsg;
                    for (var i in ticketsMsg) {
                        if (ticketsMsg[i].deletedDate && (new Date().getTime() - ticketsMsg[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            ticketsMsg[i].postDate = app.formatDate(ticketsMsg[i].postDate)
                            ticketsMsgArr.push(ticketsMsg[i])
                        }
                        
                    }
                    _this.setData({
                        ticketsMsg: ticketsMsgArr,
                        ticketMsgPageNumber: _this.data.ticketMsgPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadTourismsMsg: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/messages/deleted?subject=TOURISM&pageNumber=' + this.data.tourismMsgPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.tourismMsgSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var tourismsMsg = res.data.data;
                    var tourismsMsgArr = _this.data.tourismsMsg;
                    for (var i in tourismsMsg) {
                        if (tourismsMsg[i].deletedDate && (new Date().getTime() - tourismsMsg[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            tourismsMsg[i].postDate = app.formatDate(tourismsMsg[i].postDate);
                            tourismsMsgArr.push(tourismsMsg[i])
                        }
                    }
                    _this.setData({
                        tourismsMsg: tourismsMsgArr,
                        tourismMsgPageNumber: _this.data.tourismMsgPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadQuestionsMsg: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/messages/deleted?subject=QUESTION&pageNumber=' + this.data.questionMsgPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.questionMsgSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var questionsMsg = res.data.data;
                    var questionsMsgArr = _this.data.questionsMsg;
                    for (var i in questionsMsg) {
                        if (questionsMsg[i].deletedDate && (new Date().getTime() - questionsMsg[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            questionsMsg[i].postDate = app.formatDate(questionsMsg[i].postDate)
                            questionsMsgArr.push(questionsMsg[i])
                        }
                    }
                    _this.setData({
                        questionsMsg: questionsMsgArr,
                        questionMsgPageNumber: _this.data.questionMsgPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadCustomsMsg: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/messages/deleted?subject=CUSTOM&pageNumber=' + this.data.customMsgPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.customMsgSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var customsMsg = res.data.data;
                    var customsMsgArr = _this.data.customsMsg;
                    for (var i in customsMsg) {
                        if (customsMsg[i].deletedDate && (new Date().getTime() - customsMsg[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            customsMsg[i].postDate = app.formatDate(customsMsg[i].postDate);
                            customsMsgArr.push(customsMsg[i])
                        }
                    }
                    _this.setData({
                        customsMsg: customsMsgArr,
                        customMsgPageNumber: _this.data.customMsgPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    openActionSheet: function (e) {
        var _this = this;
        var msgId = e.currentTarget.dataset.id;
        var subject = e.currentTarget.dataset.subject.toLowerCase();
        var topicId = e.currentTarget.dataset.topicid;
        wx.showActionSheet({
            itemList: ['查看原帖', '撤销删除'],
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        wx.navigateTo({
                            url: '../../../' + subject + '/' + subject + 'Detail/' + subject + 'Detail?' + subject + 'Id=' + topicId,
                        })
                    } else {
                        wx.showModal({
                            content: '确认恢复该评论吗？',
                            confirmText: "确认",
                            cancelText: "取消",
                            success: function (res) {
                                if (res.confirm) {
                                    _this.recoverMessage(msgId, subject)
                                }
                            }
                        });
                    }
                }
            }
        })
    },

    recoverMessage: function (id, subject) {
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/message/recover/deleted?id=' + id,
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    wx.showToast({
                        title: '恢复成功',
                        icon: 'success',
                        duration: 1000,
                        success: function () {
                            setTimeout(function () {
                                if (subject == 'ticket') {
                                    _this.setData({
                                        ticketMsgPageNumber: 0,
                                        ticketsMsg: [],
                                        isTicketMsgFirstLoad: true,
                                        ticketMsgModuleDisplay: true
                                    })
                                    _this.loadTicketsMsg();
                                } else if (subject == 'tourism') {
                                    _this.setData({
                                        tourismMsgPageNumber: 0,
                                        tourismsMsg: [],
                                        isTourismMsgFirstLoad: true,
                                        tourismMsgModuleDisplay: true
                                    })
                                    _this.loadTourismsMsg();
                                } else if (subject == 'question') {
                                    _this.setData({
                                        questionMsgPageNumber: 0,
                                        questionsMsg: [],
                                        isQuestionMsgFirstLoad: true,
                                        questionMsgModuleDisplay: true
                                    })
                                    _this.loadQuestionsMsg();
                                } else if (subject == 'custom') {
                                    _this.setData({
                                        customMsgPageNumber: 0,
                                        customsMsg: [],
                                        isCustomMsgFirstLoad: true,
                                        customMsgModuleDisplay: true
                                    })
                                    _this.loadCustomsMsg();
                                }
                            }, 1500);
                        }
                    });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadTicketsMsg();
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