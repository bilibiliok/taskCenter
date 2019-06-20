// miniprogram/pages/addexector/addexector.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exectorName:'',
    exectorTelephone:'',
    exectorDepartment:'',
    exectorJob:'',
    exectorEmail:'',
    exector:[],
    inputdex:'',
    _openid:''
  },
  //判断属性值
  findElem(arrayToSearch, attr, val) {
    for (var i = 0; i < arrayToSearch.length; i++) {
      if (arrayToSearch[i][attr] == val) {
        return i;
      }
    }
    return -1;
  },
  //获取执行人
  addName(e){
    console.log(e)
    var exectored = e.detail.value
    this.setData({
      exectorName: exectored
    })
    // console.log('13312',this.data.exectorName)
  },
   //获取部门
  addDepartMent(e){
    var exectorDepartment = e.detail.value
    this.setData({
      exectorDepartment: exectorDepartment
    })
    // console.log('13312', this.data.exectorDepartment)
  },
  //获取职务
  addJob(e){
    var exectorJob = e.detail.value
    this.setData({
      exectorJob: exectorJob
    })
    // console.log('13312', this.data.exectorJob)
  },
  //获取电话
  addTelephone(e){
    var exectorTelephone = e.detail.value
    this.setData({
      exectorTelephone: exectorTelephone
    })
    // console.log('13312', this.data.exectorTelephone)
  },
 //获取邮箱地址
  addEmail(e){
    var exectorEmail = e.detail.value
    this.setData({
      exectorEmail: exectorEmail
    })
    // console.log('13312', this.data.exectorEmail)
  },
  getOpenid() {
    let that = this;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        var openid = res.result.openId;
        that.setData({
          _openid: openid
        })
      }
    })

  },
  //添加执行人
  add(){
    let that = this
    console.log('111',that.data.exectorName)
    var index = that.findElem(that.data.exector, "exectorName", that.data.exectorName)
    let openid = that.data._openid
    that.setData({
      _openid:openid
    })

    console.log('res',that.data._openid)
      if(index == -1){
        if (that.data.exectorName == ''){
          wx.showToast({
            title: '请输入执行人',
            icon:'none'
          })
        }else{
        //调用云函数
          wx.cloud.callFunction({
            name:'addExector',
            data:{
              exectorName: that.data.exectorName,
              exectorDepartment:that.data.exectorDepartment,
              exectorJob:that.data.exectorJob,
              exectorTelephone:that.data.exectorTelephone,
              exectorEmail:that.data.exectorEmail,
              _openid: that.data._openid
            },
            complete:res=>{
              wx.showToast({
                title: '添加成功',
              })
              // that.data.exectorName = ''
              // that.data._openid = ''
              that.onLoad()
              that.setData({
                inputdex:''
              })
              wx.switchTab({
                url: '../index/index',
              })
            }
          })
        }
      }else{
        wx.showToast({
          title: '已存在执行人，请发布',
          icon:'none'
        })
        that.setData({
          inputdex: ''
        })
      }
      
      
    
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenid()
    let that = this
    console.log('ee', that.data.exectorName)
    const db = wx.cloud.database()
    db.collection('exectored').get({
      success(res) {
        console.log(res)
        that.setData({
          exector: res.data
        })
        console.log(that.data.exector)
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