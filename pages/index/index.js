//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    exector:[],
    openId:''
  },
  //判断属性值
  findElem(arrayToSearch, attr, val){
    for(var i = 0; i<arrayToSearch.length;i++){
      if (arrayToSearch[i][attr] == val) {
        return i;
      }
    }
    return -1;
  },
  //添加任务
  addMission(){
    this.getOpenid()
    // let openId = wx.getStorageSync('openId')
    let openId = this.data.openId
    // console.log(this.data.openId)
    var index = this.findElem(this.data.exector,"_openid",openId)
    // console.log('nmsl',openId)
    if(index == -1){                                    
      wx.showToast({
        title: '请先注册执行人',
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '请发布',
      })
     setTimeout(()=>{
       wx.navigateTo({
         url: '../addMission/addMission',
       })
     },2000)
    }
   
  },
  //添加执行人
  addExector(){
    let openId = this.data.openId
    // console.log(openId)
    var index = this.findElem(this.data.exector, "_openid", openId)
    if(index != -1){
      wx.showToast({
        title: '执行人已存在,请发布任务',
        icon:'none'
      })
    }else{
      wx.navigateTo({
        url: '../addexector/addexector',
      })
    }
  },
  //查看用户详情
  exectorInfo(e){
    console.log(e)
    var currentSelect = e.currentTarget.dataset.index
    let exectorList = this.data.exector
    this.setData({
      exectorIndex: currentSelect,
    })
    wx.navigateTo({
      url: '../exectorMessage/exectorMessage?_id=' + exectorList[currentSelect]._id,
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
        console.log('res',res)
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
  //事件处理函数
  onLoad: function () {
    console.log('this',this)
    this.getOpenid()
    var that = this
    const db = wx.cloud.database()
    db.collection('exectored')
    .get({
      success(res){
        // console.log(res)
        that.setData({
          exector:res.data
        })
        // console.log(that.data.exector)
      }
    })
  },
  onShow: function(){
   this.getOpenid()
    var that = this
    const db = wx.cloud.database()
    db.collection('exectored').get({
      success(res) {
        // console.log(res)
        that.setData({
          exector: res.data
        })
        // console.log(that.data.exector)
      }
    })
 },
})




