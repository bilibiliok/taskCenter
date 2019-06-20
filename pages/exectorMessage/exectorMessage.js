// miniprogram/pages/exectorMessage/exectorMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id:'',
    exectorName:'',
    exectorDepartment:'',
    exectorEmail:'',
    exectorJob:'',
    exectorTelephone:'',
    _openid:'',
    openId:'',

  },
  //修改信息
  changeMessage(){
    //判断是否为本人信息
    if(this.data.openId == this.data._openid){
      let that = this
      const db = wx.cloud.database()
      db.collection('exectored').doc(that.data._id).update({
        data:{
          exectorName: that.data.exectorName,
          exectorDepartment:that.data.exectorDepartment,
          exectorJob:that.data.exectorJob,
          exectorTelephone:that.data.exectorTelephone,
          exectorEmail:that.data.exectorEmail
        },
        success(res){
          console.log('res',res)
        }
      })
      wx.showToast({
        title: '修改成功'
      })
    }else{
      // console.log('1', this.data.openId)
      // console.log('2', this.data._openid)
      wx.showToast({
        title: '非本人信息，无法修改',
        icon:'none'
      })
      let that = this
      const db = wx.cloud.database()
      db.collection('exectored').where({
        _id: that.data._id
      }).get({
        success(res) {
          console.log('res', res)
          that.setData({
            exectorName: res.data[0].exectorName,
            exectorDepartment: res.data[0].exectorDepartment,
            exectorJob: res.data[0].exectorJob,
            exectorTelephone: res.data[0].exectorTelephone,
            exectorEmail: res.data[0].exectorEmail,
            _openid: res.data[0]._openid
          })
        }
      })
    }
  },
//获取姓名
  changeName(e){
    console.log('11',e)
    var name = e.detail.value
    this.setData({
      exectorName:name
    })
  },
  // 获取部门
  changeDepartment(e){
    var depart = e.detail.value
    this.setData({
      exectorDepartment:depart
    })
  },
  //获取职务
  changeJob(e){
    var job = e.detail.value
    this.setData({
      exectorJob:job
    })
  },
  //获取电话
  changeNumber(e){
    var number = e.detail.value
    this.setData({
      exectorTelephone: number
    })
  },
  //获取邮箱
  changeEmail(e){
    var email = e.detail.value
    this.setData({
      exectorEmail:email
    })
  },

  //获取openid
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        // console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        console.log('res', res)
        that.setData({
          openId: openid
        })
        // console.log(this.data.openId)
        wx.setStorage({
          key: "openId",
          data: "openid"
        })
        wx.setStorageSync('openId', openid)


      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
    let that = this
    console.log(options)
    that.setData({
      _id:options._id
    })
    let id = options
    const db = wx.cloud.database()
    db.collection('exectored').where({
      _id:options._id
    }).get({
      success(res){
        console.log('res',res)
        that.setData({
          exectorName: res.data[0].exectorName,
          exectorDepartment: res.data[0].exectorDepartment,
          exectorJob: res.data[0].exectorJob,
          exectorTelephone: res.data[0].exectorTelephone,
          exectorEmail: res.data[0].exectorEmail,
          _openid: res.data[0]._openid
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