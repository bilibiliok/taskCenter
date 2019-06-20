// pages/taskCenter/taskCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionList: [],
    //显示初始页面
    page: 1,
    pageSize:10,
    totalCount:'',
    topics:[],
  },
  getData:function(){
    
    
  },

 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload');
    this.getData(this.data.page);    

  },
  getData: function (page) {
    var that = this;
    console.log("page--->" + page);
    const db = wx.cloud.database();
    // 获取总数
    db.collection('mission').count({
      success: function (res) {
        that.data.totalCount = res.total;
      }
    })
    // 获取前十条
    try {
      db.collection('mission')
        .limit(that.data.pageSize) // 限制返回数量为 10 条
        .orderBy('exectorName', 'desc')
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            // console.log(res.data)
            that.data.topics = res.data;
            that.setData({
              topics: that.data.topics,
            })
            console.log('topics', that.data.topics)
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();

          },
          fail: function (event) {
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
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
    wx.showNavigationBarLoading()
    let that = this
    const db = wx.cloud.database()
    db.collection('mission').get({
      success(res) {
        console.log(res)
        that.setData({
          missionList: res.data,
        })
        console.log(that.data.missionList)
      }
    })
    db.collection('mission').count({
      success(res) {
        console.log(res)
        that.setData({
         
          totalCount: res.total
        })
        console.log(that.data.totalCount)
      }
    })
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading() //完成停止加载


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
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var temp = [];
    // 获取后面十条
    if (this.data.topics.length < this.data.totalCount) {
      try {
        const db = wx.cloud.database();
        db.collection('mission')
          .skip(5)
          .limit(that.data.pageSize) // 限制返回数量为 5 条
          .orderBy('exectorName', 'desc')	// 排序
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  console.log(tempTopic);
                  temp.push(tempTopic);
                }

                var totalTopic = {};
                totalTopic = that.data.topics.concat(temp);

                console.log(totalTopic);
                that.setData({
                  topics: totalTopic,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
              }


            },
            fail: function (event) {
              console.log("======" + event);
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }
  
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})