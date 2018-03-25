const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      src: app.globalData.serverHost + '/images/adminQR.jpg',
      imgList: [app.globalData.serverHost + '/images/adminQR.jpg']
  },

  tapQR: function(e) {
      console.log(e);
      var current = e.target.dataset.src;
      wx.previewImage({
          current: current,
          urls: this.data.imgList
      })
  },

  addAdmin: function() {
      /*wx.scanCode({
          success: (res) => {
              wx.showLoading({
                  title: '成功',
                  icon: 'loading',
              });
          },
          fail: (res) => {
              wx.showLoading({
                  title: '失败',
                  icon: 'loading',
              });
          },
      }) */
      wx.previewImage({
          current: app.globalData.serverHost + '/images/adminQR.png',
          urls: [app.globalData.serverHost + '/images/adminQR.png']
      }) 
  },

  copyWechatId: function() {
        wx.setClipboardData({
            data: 'donkey529696937',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showModal({
          title: "【入群方式】",
          content: "请添加管理员咖喱为微信好友，向其转账88元后，由他拉入群。\n【提示】：小程序不支持直接识别二维码，麻烦先截图或复制微信号添加",
          confirmText: "确认",
          success: function (res) {
          }
      });
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