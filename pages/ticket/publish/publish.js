const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        flightType: ["直飞", "转机"],
        flightTypeIndex: 0,
        accuracy: "month",

        tag: ['国内','国际','东南亚','欧洲','美洲','澳洲','其他'],
        tagIndex: 0,

        tagValue: '',

        ticket: {
            title: null,
            isSingleFlight: true,
            airline: null,
            price: null,
            departureDateFrom: "",
            departureDateTo: "",
            departureCountry: null,
            departureCity: null,
            arrivalCountry: null,
            arrivalCity: null,
            isTurning: false,
            turningCity: null,
            info: null,
            publisher: null,
            tag: '国内',
            link: null
        },

        isSingleFlightInputDisabled: true,
        unSingleFlightPlaceholder: null,

        isNotOtherTag: true,
        otherTagPlaceHolder: null,

        showTopErrorTips: false,
        errorMsg: null,

        dateRangeStart: '',
        dateRangeEnd: ''

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var date = new Date();
        var year = date.getYear() + 1900;
        var month = date.getMonth() + 1;
        var day = date.getDate();
        this.setData({
            dateRangeStart: year + '-' + month + '-' + day,
            dateRangeEnd: year + '-' + month + '-' + day
        })
    },

    bindFlightTypeChange: function (e) {
        console.log('picker country code 发生选择改变，携带值为', e.detail.value);
        var ticket_isTurning = "ticket.isTurning";
        var ticket_turningCity = "ticket.turningCity";
        if (e.detail.value == 1) {
            // 转机
            this.setData({
                isSingleFlightInputDisabled: false,
                unSingleFlightPlaceholder: '请输入转机城市',
                [ticket_isTurning]: true,
            })
        } else {
            // 直飞
            this.setData({
                isSingleFlightInputDisabled: true,
                unSingleFlightPlaceholder: '',
                [ticket_isTurning]: false,
            })
        }
        var ticket_isSingleFlight = "ticket.isSingleFlight";
        this.setData({
            flightTypeIndex: e.detail.value
        })
    },

    bindTagChange: function (e) {
        var ticket_tag = "ticket.tag";
        var tags = this.data.tag;
        if (e.detail.value == 6) {
            // 其他
            this.setData({
                isNotOtherTag: false,
                otherTagPlaceHolder: '请输入标签内容'
            })
        } else {
            this.setData({
                isNotOtherTag: true,
                otherTagPlaceHolder: tags[e.detail.value],
                [ticket_tag]: tags[e.detail.value]
            })
        }
        this.setData({
            tagIndex: e.detail.value
        })
    },

    inputChange: function (e) {
        //var key = e.currentTarget.dataset.key;
        var key = "ticket." + e.currentTarget.dataset.key;
        this.setData({
            // ticket: {
            //     [key]: e.detail.value
            // }
            [key]: e.detail.value
        })
    },

    switchChange: function (e) {
        var ticket_isSingleFlight = "ticket.isSingleFlight";
        this.setData({
            [ticket_isSingleFlight]: e.detail.value == true ? true : false
        })
    },

    switchDepartureDateAccuracy: function(e) {
        this.setData({
            accuracy: e.detail.value == true ? "day" : "month"
        })
    },

    bindDateChange: function(e) {
        var ticket_departureDate = "ticket." + e.currentTarget.dataset.key;
        this.setData({
            [ticket_departureDate]: e.detail.value
        })
    },

    publishTicket: function() {
        var _this = this;
        var validated = this.validate();
        if (validated) {
            wx.showLoading({
                title: '正在发布...',
                icon: 'loading',
            });
            wx.showNavigationBarLoading()
            wx.request({
                url: app.globalData.serverHost + '/tickets/publish/ticket?openid=' + app.globalData.openid,
                data: _this.data.ticket,
                method: 'POST',
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.status == 'success') {

                        wx.hideNavigationBarLoading()
                        wx.showToast({
                            title: '发布成功',
                            icon: 'success',
                            success: function () {
                                setTimeout(function () {
                                    wx.redirectTo({
                                        url: '../ticket/ticket',
                                    })
                                }, 1500);
                            }
                        });
                       
                    } else {
                        _this.showTopErrorTips('发布失败，请重试');
                    }
                }
            })
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

    validate: function() {
        var ticket = this.data.ticket;
        var validated = true
        if (!ticket.title || ticket.title.trim() == '') {
            this.showTopErrorTips('请输入标题');
            validated = false;
        } else if (!ticket.airline || ticket.airline.trim() == '') {
            this.showTopErrorTips('请输入航空公司');
            validated = false;
        } else if (!ticket.price || ticket.price.trim() == '') {
            this.showTopErrorTips('请输入机票价格');
            validated = false;
        } else if (!ticket.tag || ticket.tag.trim() == '') {
            this.showTopErrorTips('请输入标签');
            validated = false;
        } else if (!ticket.departureDateFrom || ticket.departureDateFrom.trim() == '') {
            this.showTopErrorTips('请输入出发日期');
            validated = false;
        } else if (!ticket.departureCountry || ticket.departureCountry.trim() == '') {
            this.showTopErrorTips('请输入出发国家');
            validated = false;
        } else if (!ticket.departureCity || ticket.departureCity.trim() == '') {
            this.showTopErrorTips('请输入出发城市');
            validated = false;
        } else if (!ticket.arrivalCountry || ticket.arrivalCountry.trim() == '') {
            this.showTopErrorTips('请输入到达国家');
            validated = false;
        } else if (!ticket.arrivalCity || ticket.arrivalCity.trim() == '') {
            this.showTopErrorTips('请输入到达城市');
            validated = false;
        } else if (ticket.isTurning == true && 
            (!ticket.turningCity || ticket.turningCity.trim() == '')) {
            this.showTopErrorTips('请输入转机城市');
            validated = false;
        }
        
        return validated;

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