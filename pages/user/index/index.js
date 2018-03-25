const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

        authorized: false,
        hidden: true,
        adminLoginStatus: app.globalData.role == "ADMIN"
            && app.globalData.adminLoginStatus == true ? true : false,
        role: '',
        userInfo: '',

        ticketPageNumber: 0,
        tourismPageNumber: 0,
        questionPageNumber: 0,
        customPageNumber: 0,

        commentsSentPageNumber: 0,
        commentsReceivedPageNumber: 0,

        sort: {
            postDate: 'DESC'
        },

        ticketSort: {
            publishDate: 'DESC'
        },

        tickets: [],
        tourisms: [],
        questions: [],
        customs: [],

        commentsSent: [],
        commentsReceived: [],

        ticketsDisplay: true,
        tourismsDisplay: false,
        questionsDisplay: false,
        customsDisplay: false,

        topicDisplay: true,
        commentDisplay: false,
        storeDisplay: false,
        privateMessageDisplay: false,
        adminDisplay: false,

        commentsSentDisplay: true,
        commentsReceivedDisplay: false,

        topicBtnStyle: 'background-color: white !important;border-color: white !important;',
        commentBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
        storeBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
        privateMsgBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
        adminBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',

        isTicketFirstLoad: true,
        isTourismFirstLoad: true,
        isQuestionFirstLoad: true,
        isCustomFirstLoad: true,

        isCommentsSentFirstLoad: true,
        isCommentsReceivedFirstLoad: true,

        tourismSignUpSentMsgDisplay: true,
        tourismSignUpReceivedMsgDisplay: false,
        adminPrivMsgDisplay: false,

        isTourismSignUpSentMsgFirstLoad: true,
        isTourismSignUpReceivedMsgFirstLoad: true,
        isAdminPrivMsgFirstLoad: true,

        tourismSignUpMsgs: [],
        tourismSignUpSentMsgs: [],
        tourismSignUpReceivedMsgs: [],
        adminPrivMsgs: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            authorized: app.globalData.authorized
        })

        if (!this.data.authorized) {
            app.auth('/pages/user/index/index');
        }

        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
                role: app.globalData.role,
                adminLoginStatus: app.globalData.role == "ADMIN"
                    && app.globalData.adminLoginStatus == true ? true : false
            })
            if (app.globalData.openid) {
                wx.request({
                    url: app.globalData.serverHost + '/auth/info?openid=' + app.globalData.openid,
                    data: app.globalData.userInfo,
                    method: 'POST',
                    success: function (res) {
                        console.log("res:" + res)
                    }
                })
            }
        } /* else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        } */

        ///////LOAD TICKETS//////
        if (app.globalData.role == 'ADMIN') {
            this.loadTickets();
        } else {
            this.toggleTourismModule();
        }
        
    },

    userInfoHandler: function(e) {
        var userInfo = e.detail.userInfo;
        if (userInfo != undefined) {
            app.globalData.userInfo = userInfo
            app.globalData.authorized = true;
            wx.reLaunch({
                url: '../index/index',
            })
        } 
        
    },

    onModuleTap: function (e) {
        var moduleType = e.currentTarget.dataset.type;
        if (moduleType == 'TOPIC') {
            this.setData({
                topicDisplay: true,
                commentDisplay: false,
                storeDisplay: false,
                privateMessageDisplay: false,
                adminDisplay: false,

                tickets: [],
                ticketPageNumber: 0,
                isTicketFirstLoad: true,
                ticketsDisplay: true,

                customs: [],
                customPageNumber: 0,
                isCustomFirstLoad: true,
                customsDisplay: false,

                questions: [],
                questionPageNumber: 0,
                isQuestionFirstLoad: true,
                questionsDisplay: false,

                tourisms: [],
                tourismPageNumber: 0,
                isTourismFirstLoad: true,
                tourismsDisplay: false,

                topicBtnStyle: 'background-color: white !important;border-color: white !important;',
                commentBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                storeBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                privateMsgBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                adminBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;'
            })
            if (app.globalData.role == 'ADMIN') {
                this.loadTickets();
            } else {
                this.toggleTourismModule();
            }
        } else if (moduleType == 'COMMENT') {
            this.setData({
                topicDisplay: false,
                commentDisplay: true,
                storeDisplay: false,
                privateMessageDisplay: false,
                adminDisplay: false,

                commentsSent: [],
                commentsSentPageNumber: 0,
                isCommentsSentFirstLoad: true,
                commentsSentDisplay: true,

                commentsReceived: [],
                commentsReceivedPageNumber: 0,
                isCommentsReceivedFirstLoad: true,
                commentsReceivedDisplay: false,

                topicBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                commentBtnStyle: 'background-color: white !important;border-color: white !important;',
                storeBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                privateMsgBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                adminBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;'
            })
            this.loadCommentsSent();
        } else if (moduleType == 'PRIVATEMSG') {
            this.setData({
                topicDisplay: false,
                commentDisplay: false,
                storeDisplay: false,
                privateMessageDisplay: true,
                adminDisplay: false,

                tourismSignUpSentMsgDisplay: true,
                tourismSignUpReceivedMsgDisplay: false,
                adminPrivMsgDisplay: false,

                isTourismSignUpSentMsgFirstLoad: true,
                isTourismSignUpReceivedMsgFirstLoad: true,
                isAdminPrivMsgFirstLoad: true,

                tourismSignUpSentMsgs: [],
                tourismSignUpReceivedMsgs: [],
                adminPrivMsgs: [],

                topicBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                commentBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                storeBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                privateMsgBtnStyle: 'background-color: white !important;border-color: white !important;',
                adminBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;'
            })
            this.loadTourismSignUpSentMsg();
        } else if (moduleType == 'ADMIN') {
             if (app.globalData.adminLoginStatus == false) {
                 wx.navigateTo({
                     url: '../../adminLogin/adminLogin',
                 })
                 return;
             }
            this.setData({
                topicDisplay: false,
                commentDisplay: false,
                storeDisplay: false,
                privateMessageDisplay: false,
                adminDisplay: true,

                topicBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                commentBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                storeBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                privateMsgBtnStyle: 'background-color: #F5F5F5 !important;border-color: #F5F5F5 !important;',
                adminBtnStyle: 'background-color: white !important;border-color: white !important;'
            })
        }
    },

    toggleTicketModule: function () {

        if (this.data.isTicketFirstLoad) {
            this.loadTickets();
            this.setData({
                ticketsDisplay: !this.data.ticketsDisplay,
                isTicketFirstLoad: false
            })
        } else {
            this.setData({
                ticketsDisplay: !this.data.ticketsDisplay
            })
        }
    },

    loadTickets: function () {
        wx.showNavigationBarLoading();
        var _this = this;

        wx.request({
            url: app.globalData.serverHost + "/user/topics/tickets?openid=" + app.globalData.openid + "&pageNumber=" + this.data.ticketPageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.ticketSort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var tickets = res.data.data;
                    var ticketsArr = _this.data.tickets;
                    for (var i in tickets) {
                        tickets[i].publishDate = app.formatDate(tickets[i].publishDate);
                        ticketsArr.push(tickets[i]);
                    }
                    _this.setData({
                        tickets: ticketsArr,
                        ticketPageNumber: _this.data.ticketPageNumber + 1,
                        isTicketFirstLoad: false
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    toggleTourismModule: function () {

        if (this.data.isTourismFirstLoad) {
            this.loadTourisms();
            this.setData({
                tourismsDisplay: !this.data.tourismsDisplay,
                isTourismFirstLoad: false
            })
        } else {
            this.setData({
                tourismsDisplay: !this.data.tourismsDisplay
            })
        }
    },

    loadTourisms: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/user/topics/tourisms?openid=" + app.globalData.openid + "&pageNumber=" + this.data.tourismPageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var tourisms = res.data.data;
                    var tourismsArr = _this.data.tourisms;
                    for (var i in tourisms) {
                        tourisms[i].postDate = app.formatDate(tourisms[i].postDate);
                        tourismsArr.push(tourisms[i]);
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

    toggleQuestionModule: function () {

        if (this.data.isQuestionFirstLoad) {
            this.loadQuestions();
            this.setData({
                questionsDisplay: !this.data.questionsDisplay,
                isQuestionFirstLoad: false
            })
        } else {
            this.setData({
                questionsDisplay: !this.data.questionsDisplay
            })
        }
    },

    loadQuestions: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/user/topics/questions?openid=" + app.globalData.openid + "&pageNumber=" + this.data.questionPageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var questions = res.data.data;
                    var questionsArr = _this.data.questions;
                    for (var i in questions) {
                        questions[i].postDate = app.formatDate(questions[i].postDate);
                        questionsArr.push(questions[i]);
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

    toggleCustomModule: function () {

        if (this.data.isCustomFirstLoad) {
            this.loadCustoms();
            this.setData({
                customsDisplay: !this.data.customsDisplay,
                isCustomFirstLoad: false
            })
        } else {
            this.setData({
                customsDisplay: !this.data.customsDisplay
            })
        }
    },

    loadCustoms: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/user/topics/customs?openid=" + app.globalData.openid + "&pageNumber=" + this.data.customPageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var customs = res.data.data;
                    var customsArr = _this.data.customs;
                    for (var i in customs) {
                        customs[i].postDate = app.formatDate(customs[i].postDate);
                        customsArr.push(customs[i]);
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

    toggleCommentsSentModule: function () {

        if (this.data.isCommentsSentFirstLoad) {
            this.loadCommentsSent();
            this.setData({
                commentsSentDisplay: !this.data.commentsSentDisplay,
                isCommentsSentFirstLoad: false
            })
        } else {
            this.setData({
                commentsSentDisplay: !this.data.commentsSentDisplay
            })
        }
    },

    loadCommentsSent: function (e) {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/user/comments/sent?openid=" + app.globalData.openid + "&pageNumber=" + this.data.commentsSentPageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var commentsSent = res.data.data;
                    var commentsSentArr = _this.data.commentsSent;
                    for (var i in commentsSent) {
                        commentsSent[i].postDate = app.formatDate(commentsSent[i].postDate);
                        commentsSent[i].content = commentsSent[i].content.length > 8 ? commentsSent[i].content.substr(0, 8) + '...' : commentsSent[i].content;
                        commentsSent[i].subject = commentsSent[i].subject.toLowerCase();
                        commentsSentArr.push(commentsSent[i]);
                    }
                    _this.setData({
                        commentsSent: commentsSentArr,
                        commentsSentPageNumber: _this.data.commentsSentPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    toggleCommentsReceivedModule: function () {

        if (this.data.isCommentsReceivedFirstLoad) {
            this.loadCommentsReceived();
            this.setData({
                commentsReceivedDisplay: !this.data.commentsReceivedDisplay,
                isCommentsReceivedFirstLoad: false
            })
        } else {
            this.setData({
                commentsReceivedDisplay: !this.data.commentsReceivedDisplay
            })
        }
    },

    loadCommentsReceived: function (e) {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/user/comments/received?openid=" + app.globalData.openid + "&pageNumber=" + this.data.commentsReceivedPageNumber + "&sort=" + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var commentsReceived = res.data.data;
                    var commentsReceivedArr = _this.data.commentsReceived;
                    for (var i in commentsReceived) {
                        commentsReceived[i].postDate = app.formatDate(commentsReceived[i].postDate);
                        commentsReceived[i].content = commentsReceived[i].content.length > 8 ? commentsReceived[i].content.substr(0, 8) + '...' : commentsReceived[i].content;
                        commentsReceived[i].subject = commentsReceived[i].subject.toLowerCase();
                        commentsReceivedArr.push(commentsReceived[i]);
                    }
                    _this.setData({
                        commentsReceived: commentsReceivedArr,
                        commentsReceivedPageNumber: _this.data.commentsReceivedPageNumber + 1
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    toggleTourismSignUpSentMsgModule: function() {
        if (this.data.isTourismSignUpSentMsgFirstLoad) {
            this.loadTourismSignUpSentMsg();
            this.setData({
                tourismSignUpSentMsgDisplay: !this.data.tourismSignUpSentMsgDisplay,
                isTourismSignUpSentMsgFirstLoad: false
            })
        } else {
            this.setData({
                tourismSignUpSentMsgDisplay: !this.data.tourismSignUpSentMsgDisplay
            })
        }
    },

    loadTourismSignUpSentMsg: function() {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/user/user?openid=' + app.globalData.openid,
            method: 'GET',
            success: function(res) {
                if (res.data.status == 'success') {
                    var user = res.data.data;
                    var msgList = user.signUpTourismList;
                    for (var i in msgList) {
                        msgList[i].date = app.formatDate(msgList[i].date);
                    }
                    _this.setData({
                        tourismSignUpMsgs: msgList
                    })
                    
                    var list = []
                    for (var i in msgList) {
                        if (msgList[i].type == 'SENT') {
                            msgList[i].previousMsg = msgList[i].msg;
                            msgList[i].msg = msgList[i].msg.length > 8 ? msgList[i].msg.substr(0, 8) + '...' : msgList[i].msg;
                            list.push(msgList[i]);
                        }
                    }
                    app.globalData.tourismListSent = list;
                    _this.setData({
                        tourismSignUpSentMsgs: list
                    })
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    toggleTourismSignUpReceivedMsgModule: function () {
        if (this.data.isTourismSignUpReceivedMsgFirstLoad) {
            this.loadTourismSignUpReceivedMsg();
            this.setData({
                tourismSignUpReceivedMsgDisplay: !this.data.tourismSignUpReceivedMsgDisplay,
                isTourismSignUpReceivedMsgFirstLoad: false
            })
        } else {
            this.setData({
                tourismSignUpReceivedMsgDisplay: !this.data.tourismSignUpReceivedMsgDisplay
            })
        }
    },

    loadTourismSignUpReceivedMsg: function () {
        wx.showNavigationBarLoading();
        var msgList = this.data.tourismSignUpMsgs;
        var list = []
        for (var i in msgList) {
            if (msgList[i].type == 'RECEIVED') {
                msgList[i].previousMsg = msgList[i].msg;
                msgList[i].msg = msgList[i].msg.length > 8 ? msgList[i].msg.substr(0, 8) + '...' : msgList[i].msg;
                list.push(msgList[i]);
            }
        }
        app.globalData.tourismListReceived = list;
    this.setData({
            tourismSignUpReceivedMsgs: list
        })
        wx.hideNavigationBarLoading();
    },

    toggleAdminPrivMsgModule: function () {
        if (this.data.isAdminPrivMsgFirstLoad) {
            this.loadAdminPrivMsgs();
            this.setData({
                adminPrivMsgDisplay: !this.data.adminPrivMsgDisplay,
                isAdminPrivMsgFirstLoad: false
            })
        } else {
            this.setData({
                adminPrivMsgDisplay: !this.data.adminPrivMsgDisplay
            })
        }
    },

    loadAdminPrivMsgs: function () {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + '/user/user?openid=' + app.globalData.openid,
            method: 'GET',
            success: function (res) {
                if (res.data.status == 'success') {
                    var user = res.data.data;
                    var msgList = user.privMessageList;
                    for (var i in msgList) {
                        msgList[i].postDate = app.formatDate(msgList[i].postDate);
                        msgList[i].previousMsg = msgList[i].content;
                        msgList[i].content = msgList[i].content.length > 8 ? msgList[i].content.substr(0, 8) + '...' : msgList[i].content;
                        var msgType = msgList[i].type;
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
                        msgList[i].type = mType;
                    }
                    _this.setData({
                        adminPrivMsgs: msgList
                    })

                    app.globalData.adminPrivMsgsSent = msgList;
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },


    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },

    openAdminConfirmPage: function () {
        wx.navigateTo({
            url: '../../adminLogin/adminLogin'
        })
    },

    openActionSheet: function () {
        var _this = this;
        wx.showActionSheet({
            itemList: app.globalData.role == 'ADMIN' ? ['管理员登录', '刷新用户状态'] : ['刷新用户状态'],
            success: function (res) {
                if (!res.cancel) {
                    if (app.globalData.role == 'ADMIN' && res.tapIndex == 0) {
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
                                            app.globalData.adminLoginStatus = true;
                                            wx.navigateTo({
                                                url: '../index/index',
                                            })
                                        } else {
                                            app.globalData.adminLoginStatus = false;
                                            wx.navigateTo({
                                                url: '../../adminLogin/adminLogin',
                                            })
                                        }
                                    }
                                })
                            },
                            fail: function (res) {
                                app.globalData.adminLoginStatus = false;
                                wx.navigateTo({
                                    url: '../../adminLogin/adminLogin',
                                })
                            }
                        })
                    } else if ((app.globalData.role == 'ADMIN' && res.tapIndex == 1) ||
                        (app.globalData.role == 'USER' && res.tapIndex == 0) ||
                        (app.globalData.role == 'VIP' && res.tapIndex == 0)) {
                        wx.request({
                            url: app.globalData.serverHost + '/auth/getLatestUserRole?openid=' + app.globalData.openid,
                            method: 'GET',
                            success: function (res) {
                                var role = res.data.data;
                                app.globalData.role = role;
                                _this.setData({
                                    role: role
                                })
                            }
                        })
                    } 
                    /*else if (res.tapIndex == 2) {
                        wx.request({
                            url: app.globalData.serverHost + '/admin/switchRole?openid=' + app.globalData.openid + '&role=VIP',
                            method: 'GET',
                            success: function(res) {
                                console.log('switch to vip role');
                            }
                        })
                    } else if (res.tapIndex == 3) {
                        wx.request({
                            url: app.globalData.serverHost + '/admin/switchRole?openid=' + app.globalData.openid + '&role=USER',
                            method: 'GET',
                            success: function (res) {
                                console.log('switch to user role');
                            }
                        })
                    } else if (app.globalData.role != 'ADMIN' && res.tapIndex == 1) {
                        wx.request({
                            url: app.globalData.serverHost + '/admin/switchRole?openid=' + app.globalData.openid + '&role=ADMIN',
                            method: 'GET',
                            success: function (res) {
                                console.log('switch to admin role');
                            }
                        })
                    } */
                }
            }
        });
    },

    checkUserLoginStatus: function () {

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
        var _this = this;
        
        this.setData({
            userInfo: app.globalData.userInfo,
            role: app.globalData.role,
            adminLoginStatus: app.globalData.role == "ADMIN"
                && app.globalData.adminLoginStatus == true ? true : false,
        })
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

    sendPrivMsgBtn: function() {
        wx.navigateTo({
            url: '../privMsg/privMsg',
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})