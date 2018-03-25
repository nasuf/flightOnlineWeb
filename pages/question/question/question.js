const app = getApp()
Page({

    data: {
        questions: [],
        results: [], //如何,
        pageNumber: 0,
        sort: {
            isFixed: 'ASC',
            postDate: 'DESC'
        }
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        this.setData({
            pageNumber: 0,
            questions: []
        });
        this.loadData();

    },

    onShow: function () {
        this.clearInput();
        this.hideInput();
        var toBeRemovedTopicId = app.globalData.toBeRemovedTopicId;
        if (null != toBeRemovedTopicId && this.data.questions) {
            var filteredQuestions = []
            var questions = this.data.questions;
            for (var i in questions) {
                if (toBeRemovedTopicId != questions[i].id) {
                    filteredQuestions.push(questions[i])
                }
            }
            this.setData({
                questions: filteredQuestions
            })
        }
        app.globalData.toBeRemovedTopicId = null;
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
            result: []
        });
        var keywords = this.data.inputVal;
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/question/search?keywords=" + keywords,
            method: "GET",
            success: function (res) {
                if (res.data.status == "success") {
                    var results = res.data.data;
                    if (results.length > 0) {
                        for (var i in results) {
                            if (results[i].title.indexOf(keywords) != -1) {
                                results[i].isTitleHint = true;
                            }
                            if (results[i].content.indexOf(keywords) != -1) {
                                results[i].isContentHint = true;
                                var content = results[i].content
                                var index = content.indexOf(keywords);
                                if (index - 10 > 0)
                                    content = '...' + content.substr(index - 5);
                                if (index + 30 < content.length - 1)
                                    content = content.substr(0, index + keywords.length + 30) + '...'
                                results[i].content = content;
                            } else {
                                var content = results[i].content;
                                var endIndex = (content.length > 30 ? 30 : content.length);
                                content = content.substr(0, endIndex) + '...';
                                results[i].content = content;
                            }
                        }
                    }
                    _this.setData({
                        results: results
                    })
                }
            }
        })
       

        
    },

    onRaiseQuestion: function() {
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
                url: '../raiseQues/raiseQues',
            })
        }
    },

    loadData: function() {
        wx.showNavigationBarLoading();
        var _this = this;
        wx.request({
            url: app.globalData.serverHost + "/question/questions?pageNumber=" + this.data.pageNumber + '&sort=' + encodeURIComponent(JSON.stringify(this.data.sort)),
            method: 'GET',
            success: function(res) {
                if (res.data.status == "success") {
                    var questions = res.data.data;
                    var questionsArr = _this.data.questions;
                    for (var i in questions) {
                        var question = questions[i];
                        if (question.postDate) {
                            question.postDate = app.formatDate(question.postDate);
                            // question.postDate = question.postDate.split(' ')[0] + ' ' + question.postDate.split(' ')[1]
                            // if (question.postDate.split('-')[0] == (new Date().getYear() + 1900)) {
                            //     question.postDate = question.postDate.substr(5)
                            // }
                        }
                        questionsArr.push(questions[i])
                    }
                    wx.hideNavigationBarLoading()
                    _this.setData({
                        questions: questionsArr,
                        pageNumber: _this.data.pageNumber + 1
                    })
                }
            }
        })
    },

    onCheckDetail: function(e) {
        wx.navigateTo({
            url: '../questionDetail/questionDetail?questionId=' + e.currentTarget.dataset.questionid,
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
        this.loadData()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})