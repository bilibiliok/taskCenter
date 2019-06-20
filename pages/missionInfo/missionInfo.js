// pages/missionInfo/missionInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainBody:'',
    title:'',
    exectorName:'',
    exectorNameId:'',
    images:[],
    _id:'',
    userOpenid:'',
    done:'',
    checkName:'',
    checkNameId:'',
    //当前用户id
    _openid:'',
    //任务发起者id
    openId:''
  },
  
  //接受任务
  getmission(){
    let that = this
    if (that.data.exectorNameId != that.data._openid) {
      wx.showToast({
        title: '当前执行人非本人',
        icon: 'none'
      })
    } else { 
      wx.showModal({
        title: '提示',
        content: '确定接受任务？',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            wx.cloud.callFunction({
              name: 'getMission',
              data: {
                _id: that.data._id._id,
              }
            }).then(res => {
              // console.log(res)
              wx.showToast({
                title: '接收成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            }).catch(err => {
              // handle error
            })
            console.log('用户点击确定')

          } else {//这里是点击了取消以后
            console.log('用户点击取消')
          }
        }
      })
   
    }
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
        console.log('云函数获取到的openid: ',that.data._openid)
        // console.log(this.data.openId)
        // wx.setStorage({
        //   key: "openId",
        //   data: "openid"
        // })
        // wx.setStorageSync('openId', openid)


      }
    })

  },

  //检查任务
  checkMission(){
    let that = this
    if (that.data.checkNameId != that.data._openid) {
      wx.showToast({
        title: '当前检查人非本人',
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定任务已完成？',
        success: function (res) {
          if (res.confirm) {//这里是点击了确定以后
            wx.cloud.callFunction({
              name: 'checkMission',
              data: {
                _id: that.data._id._id,
              }
            }).then(res => {
              wx.showToast({
                title: '检查成功',
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            }).catch(err => {
              // handle error
            })
          } else {//这里是点击了取消以后
           
          }
        }
      })
    }
  },
  //删除任务
  deleteData(){
    let that = this
    if(that.data._openid != that.data.openId){
      wx.showToast({
        title: '非当前用户发布,无法删除',
        icon:'none'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '一旦删除无法恢复，是否删除',
        success:function(res){
          if(res.confirm){
            const db = wx.cloud.database()
            db.collection('mission').doc(that.data._id._id).remove({
              success(res) {
                console.log(res)
                wx.showToast({
                  title: '删除成功',
                })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
          }else{

          }
        }
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this
   let aaa = options
    this.setData({
      _id: aaa
    })
    const db = wx.cloud.database()
    db.collection('mission').where({
      _id: options._id
    }).get({
      success(res){
        console.log('res',res)
        that.setData({
          openId:res.data[0]._openid,
          mainBody:res.data[0].mainBody,
          title:res.data[0].title,
          images:res.data[0].images,
          exectorName:res.data[0].exectorName,
          exectorNameId:res.data[0].exectorNameId,
          done:res.data[0].done,
          checkName: res.data[0].checkPerson,
          checkNameId:res.data[0].checkPersonId
        })
        
      }
    })
    
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    // console.log(e)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.images // 需要预览的图片http链接列表  
    })
  },   
  //获取用户ID

  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getOpenid()
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