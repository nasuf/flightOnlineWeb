const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ticketPageNumber: 0,
        tourismPageNumber: 0,
        questionPageNumber: 0,
        customPageNumber: 0,

        tickets: [],
        tourisms: [],
        questions: [],
        customs: [],

        isTicketFirstLoad: true,
        isTourismFirstLoad: true,
        isQuestionFirstLoad: true,
        isCustomFirstLoad: true,

        ticketModuleDisplay: true,
        tourismModuleDisplay: false,
        questionModuleDisplay: false,
        customModuleDisplay: false,

        ticketSort: {
            deletedDate: 'DESC'
        },

        tourismSort: {
            deletedDate: 'DESC'
        },

        questionSort: {
            deletedDate: 'DESC'
        },

        customSort: {
            deletedDate: 'DESC'
        }
    },

    toggleTicketModule: function () {
        if (this.data.isTicketFirstLoad) {
            this.loadTickets();
            this.setData({
                ticketModuleDisplay: !this.data.ticketModuleDisplay,
                isTicketFirstLoad: false
            })
        } else {
            this.setData({
                ticketModuleDisplay: !this.data.ticketModuleDisplay,
            })
        }
    },

    toggleTourismModule: function () {
        if (this.data.isTourismFirstLoad) {
            this.loadTourisms();
            this.setData({
                tourismModuleDisplay: !this.data.tourismModuleDisplay,
                isTourismFirstLoad: false
            })
        } else {
            this.setData({
                tourismModuleDisplay: !this.data.tourismModuleDisplay
            })
        }
    },

    toggleQuestionModule: function () {
        if (this.data.isQuestionFirstLoad) {
            this.loadQuestions();
            this.setData({
                questionModuleDisplay: !this.data.questionModuleDisplay,
                isQuestionFirstLoad: false
            })
        } else {
            this.setData({
                questionModuleDisplay: !this.data.questionModuleDisplay
            })
        }
    },

    toggleCustomModule: function () {
        if (this.data.isCustomFirstLoad) {
            this.loadCustoms();
            this.setData({
                customModuleDisplay: !this.data.customModuleDisplay,
                isCustomFirstLoad: false
            })
        } else {
            this.setData({
                customModuleDisplay: !this.data.customModuleDisplay
            })
        }
    },

    loadTickets: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/topics/deleted?subject=TICKET&pageNumber=' + this.data.ticketPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.ticketSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var tickets = res.data.data;
                    var ticketsArr = _this.data.tickets;
                    for (var i in tickets) {
                        if (tickets[i].deletedDate && (new Date().getTime() - tickets[i].deletedDate < 1000*3600*24*7)) {
                            ticketsArr.push(tickets[i])
                        }
                    }
                    _this.setData({
                        tickets: ticketsArr,
                        ticketPageNumber: _this.data.ticketPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadTourisms: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/topics/deleted?subject=TOURISM&pageNumber=' + this.data.tourismPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.tourismSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var tourisms = res.data.data;
                    var tourismsArr = _this.data.tourisms;
                    for (var i in tourisms) {
                        if (tourisms[i].deletedDate && (new Date().getTime() - tourisms[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            tourismsArr.push(tourisms[i])
                        }
                        
                    }
                    _this.setData({
                        tourisms: tourismsArr,
                        tourismPageNumber: _this.data.tourismPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadQuestions: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/topics/deleted?subject=QUESTION&pageNumber=' + this.data.questionPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.questionSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var questions = res.data.data;
                    var questionsArr = _this.data.questions;
                    for (var i in questions) {
                        if (questions[i].deletedDate && (new Date().getTime() - questions[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            questionsArr.push(questions[i])
                        }
                    }
                    _this.setData({
                        questions: questionsArr,
                        questionPageNumber: _this.data.questionPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    loadCustoms: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/admin/topics/deleted?subject=CUSTOM&pageNumber=' + this.data.customPageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.customSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var customs = res.data.data;
                    var customsArr = _this.data.customs;
                    for (var i in customs) {
                        if (customs[i].deletedDate && (new Date().getTime() - customs[i].deletedDate < 1000 * 3600 * 24 * 7)) {
                            customsArr.push(customs[i])
                        }
                    }
                    _this.setData({
                        customs: customsArr,
                        customPageNumber: _this.data.customPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    openActionSheet: function (e) {
        var _this = this;
        var id = e.currentTarget.dataset.id;
        var subject = e.currentTarget.dataset.subject;
        wx.showActionSheet({
            itemList: ['查看原帖', '撤销删除'],
            success: function (res) {
                if (!res.cancel) {
                    if (res.tapIndex == 0) {
                        wx.navigateTo({
                            url: '../../../' + subject + '/' + subject + 'Detail/' + subject + 'Detail?' + subject + 'Id=' + id,
                        })
                    } else {
                        wx.showModal({
                            content: '确认恢复该帖子吗？',
                            confirmText: "确认",
                            cancelText: "取消",
                            success: function (res) {
                                if (res.confirm) {
                                    _this.recoverTopic(id, subject)
                                }
                            }
                        });
                    }
                }
            }
        })
    },

    recoverTopic: function (id, subject) {
        var _this = this;
        subject = subject.toUpperCase();
        wx.request({
            url: app.globalData.serverHost + '/admin/topic/recover/deleted?id=' + id + '&subject=' + subject.toUpperCase(),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    wx.showToast({
                        title: '恢复成功',
                        icon: 'success',
                        duration: 1000,
                        success: function () {
                            setTimeout(function () {
                                if (subject == 'TICKET') {
                                    _this.setData({
                                        ticketPageNumber: 0,
                                        tickets: [],
                                        isTicketFirstLoad: true,
                                        ticketModuleDisplay: true
                                    })
                                    _this.loadTickets();
                                } else if (subject == 'TOURISM') {
                                    _this.setData({
                                        tourismPageNumber: 0,
                                        tourisms: [],
                                        isTourismFirstLoad: true,
                                        tourismModuleDisplay: true
                                    })
                                    _this.loadTourisms();
                                } else if (subject == 'QUESTION') {
                                    _this.setData({
                                        questionPageNumber: 0,
                                        questions: [],
                                        isQuestionFirstLoad: true,
                                        questionModuleDisplay: true
                                    })
                                    _this.loadQuestions();
                                } else if (subject == 'CUSTOM') {
                                    _this.setData({
                                        customPageNumber: 0,
                                        customs: [],
                                        isCustomFirstLoad: true,
                                        customModuleDisplay: true
                                    })
                                    _this.loadCustoms();
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
        this.loadTickets();
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