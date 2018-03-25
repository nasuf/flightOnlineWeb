const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        role: "",
        isQuestionLoaded: false,
        isRepliesLoaded: false,
        question: {},
        questions: [],
        pageNumber: 0,
        userInfo: '',
        style: '',
        isSignUp: false,
        showSetBestAnsBtn: false,
        openid: '',
        sort: {
            postDate: 'ASC'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var question_id = "question.id";
        this.setData({
            [question_id]: options.questionId,
            openid: app.globalData.openid,
            role: app.globalData.role,
            userInfo: app.globalData.userInfo
        })
    },

    fixStyle: function() {
        var question = this.data.question;
        var userInfo = this.data.userInfo;
        var style_padding = app.globalData.role == "USER" ? "padding-right: 0;" : "";
        var style_border = (question.isFixed || (!question.isFixed && question.poster != app.globalData.openid && this.data.role != 'ADMIN')) ? " border-left: 0px solid;" : "";
        var style = style_padding + style_border;
        this.setData({
            style: style
        })
    },

    onSignUpClick: function (e) {
        wx.navigateTo({
            url: '../signUp/signUp?tourismId=' + e.currentTarget.dataset.tourismid,
        })
    },

    onDeleteAction: function (e) {
        // if (app.globalData.adminLoginStatus == false) {
        //     wx.navigateTo({
        //         url: '../../adminLogin/adminLogin',
        //     })
        //     return
        // }
        // console.log("to be deleted, id:" + e.target.dataset.id);
        var _this = this;
        wx.showModal({
            content: '确认删除此内容吗？',
            //content: '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('删除')
                    _this.deleteAction(e.target.dataset.id, e.target.dataset.subject, e.target.dataset.msgtype)
                } else {
                    console.log('取消')
                }
            }
        });
    },

    deleteAction: function (id, subject, msgtype) {
        var _this = this;
        var url = "";
        if (subject == 'QUESTION' && msgtype == 'TOPIC') {
            url = app.globalData.serverHost + '/question/question/' + id;
        } else if (msgtype == "REPLY") {
            url = app.globalData.serverHost + '/message/reply/' + id;
        }
        wx.request({
            url: url,
            method: 'DELETE',
            success: function (res) {
                if (res.data.status == "success") {
                    wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 1500,
                        success: function () {
                            if (msgtype == 'TOPIC') {
                                app.globalData.toBeRemovedTopicId = id;
                                wx.navigateBack({});
                            } else {
                                _this.loadReplies();
                            }
                        }
                    });
                }
            }
        })
    },

    onSetBestAnswer: function(e) {
        var questionId = e.currentTarget.dataset.questionid;
        var msgId = e.currentTarget.dataset.msgid;
        var _this = this;

        wx.showModal({
            //title: '确认设为最佳答案吗？',
            content: '确认设为最佳答案吗？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
                console.log(res);
                if (res.confirm) {
                    console.log('删除')
                    _this.setBestAns(questionId, msgId)
                } else {
                    console.log('取消')
                }
            }
        });
    },

    setBestAns: function(questionId, msgId) {
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/message/bestAnswer?questionId=" + questionId + "&msgId=" + msgId,
            method: "GET",
            success: function (res) {
                if (res.data.status == "success") {
                    wx.showLoading({
                        title: '标记成功',
                        icon: 'success',
                        duration: 1500,
                        success: function () {
                            setTimeout(function () {
                                _this.loadData();
                                _this.loadReplies();
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
        this.setData({
            pageNumber: 0,
            replies: []
        })
        this.loadData();
        while(this.data.question) {
            this.loadReplies();
            break;
        }
    },

    loadData: function () {
        var _this = this;
        wx.showNavigationBarLoading()
        wx.request({
            url: app.globalData.serverHost + '/question/question?questionId=' + this.data.question.id,
            method: 'GET',
            success: function (res) {
                if (res.data.status == "success") {
                    _this.setData({
                        isQuestionLoaded: true
                    })
                    wx.hideNavigationBarLoading()
                    var question = res.data.data
                    if (question.postDate) {
                        //question.postDate = app.formatDate(question.postDate);
                        question.formatedPostDate = app.formatDate(question.postDate);
                        // question.postDate = question.postDate.split(' ')[0] + ' ' + question.postDate.split(' ')[1]
                        // if (question.postDate.split('-')[0] == (new Date().getYear() + 1900)) {
                        //     question.postDate = question.postDate.substr(5)
                        // }
                        _this.setData({
                            question: question
                        })
                        //_this.fixStyle();
                        var role = _this.data.role;
                        var openid = app.globalData.openid;
                        var question = _this.data.question;
                        _this.setData({
                            showSetBestAnsBtn: (role == "ADMIN" || question.poster == openid) && question.isFixed == false ? true : false
                        })
                    }
                }
            }
        })
    },

    loadReplies: function (loadMore) {
        var _this = this;
        this.setData({
            pageNumber: loadMore == true ? this.data.pageNumber + 1 : 0
        })

        wx.showNavigationBarLoading();
        wx.request({
            url: app.globalData.serverHost + '/message/replies?beRepliedTopicId=' + this.data.question.id + "&pageNumber=" + this.data.pageNumber + "&subject=QUESTION" + '&sort=' + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function (res) {
                if (res.data.status == "success") {
                    
                    var replies = res.data.data;
                    var repliesArr = loadMore ? _this.data.replies : [];
                    for (var i in replies) {
                        var reply = replies[i];
                        if (reply.replyMessage.postDate) {
                            //reply.replyMessage.postDate = app.formatDate(reply.replyMessage.postDate);
                            reply.replyMessage.formatedPostDate = app.formatDate(reply.replyMessage.postDate);
                            reply.replyMessage.beRepliedPostDate = app.formatDate(reply.replyMessage.beRepliedPostDate); 
                            var question = _this.data.question;
                            var borderStyle = (question.isFixed || (!question.isFixed && question.poster != app.globalData.openid && _this.data.role != 'ADMIN')) ? " border-left: 0px solid;" : "";
                            reply.replyMessage.commentStyle = borderStyle + ((app.globalData.role != 'ADMIN' && app.globalData.openid != reply.replyMessage.poster) ? "padding-right: 0" : null);
                        }
                         if (reply.replyMessage.isDeleted == false) {
                             repliesArr.push(reply)
                         }
                    }
                    _this.setData({
                        replies: repliesArr,
                        isRepliesLoaded: true
                    });
                    wx.hideNavigationBarLoading();
                }
            }
        })
    },

    onCommentAction: function (e) {
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
            return;
        }
        if (e.target.dataset.subject == "QUESTION" && e.target.dataset.msgtype == "TOPIC") {
            app.globalData.beRepliedContent = this.data.question.content;
            wx.navigateTo({
                url: "../../comment/comment?beRepliedPostDate=" + this.data.question.postDate + "&beRepliedTopicId=" + this.data.question.id + "&beRepliedTopicTitle=" + this.data.question.title 
                + "&type=REPLY&subject=QUESTION"
            })
        } else if (e.target.dataset.subject == "QUESTION" && e.target.dataset.msgtype == "REPLY") {
            app.globalData.beRepliedContent = e.target.dataset.content;
            wx.navigateTo({
                url: "../../comment/comment?beRepliedPostDate=" + e.target.dataset.postdate + "&beRepliedTopicId=" + this.data.question.id
                + "&type=REPLY&subject=QUESTION" + "&beRepliedMessageId=" + e.target.dataset.id
                + "&beRepliedPoster=" + e.target.dataset.berepliedposter + "&beRepliedPosterNickName=" + e.target.dataset.posternickname + "&beRepliedTopicTitle=" + this.data.question.title 
            })
        }

    },

    loadMore: function () {
        console.log("end");
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
        this.loadReplies(true)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})