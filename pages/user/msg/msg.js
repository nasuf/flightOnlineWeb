const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      subject:'',
    msg: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = options.index;
    var sentMsgs = app.globalData.tourismListSent;
    var receivedMsgs = app.globalData.tourismListReceived;
    var adminPrivMsgsSent = app.globalData.adminPrivMsgsSent;
    var adminPrivMsgsReceived = app.globalData.adminPrivMsgsReceived;
    var customSignUpMessages = app.globalData.customSignUpMessages;
    var subject = options.subject;
    this.setData({
        subject: subject
    })
    var msgType = options.msgType;
    var message = null;
    switch (subject) {
        case 'TOURISM_SENT':
            message = sentMsgs[index];
            break;
        case 'TOURISM_RECEIVED':
            message = receivedMsgs[index];
            break;
        case 'PRIVADMIN_SENT':
            message = adminPrivMsgsSent[index];
            break;
        case 'PRIVADMIN_RECEIVED':
            message = adminPrivMsgsReceived[index];
            break;
        case 'CUSTOM_SIGNUP_MSG':
            message = customSignUpMessages[index];
    }
    this.setData({
        msg: message
    })
  },

  copy: function() {
      wx.setClipboardData({
          data: this.data.msg.wechatId,
          success: function (res) {
              wx.showToast({
                  title: '复制成功',
                  icon: 'success',
                  duration: 1500
              })
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})