// pages/taskCenter/taskCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    missionList:[],
    page: 1, 
    pageSize: 10,
    totalCount: '',
    nowTime:'',
    state:[]
  },
  //date1:小日期   date2:大日期
  // dateMinus(sDate1, sDate2) {
  //   var aDate, oDate1, oDate2, iDays
  //   aDate = sDate1.split("-")
  //   oDate1 = new Date(parseInt(aDate[0]), parseInt(aDate[1]) - 1, parseInt(aDate[2]));    //创建新的日期对象
  //   aDate = sDate2.split("-")
  //   oDate2 = new Date(parseInt(aDate[0]), parseInt(aDate[1]) - 1, parseInt(aDate[2]));
  //   iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
  //   return iDays
  // },
  //时间转换
  formatTime(time) {
    var now = time
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒
    var clock = year + "-";
    if (month < 10)
      clock += "0";
    clock += month + "-";
    if (day < 10)
      clock += "0";
    clock += day + " ";
    if (hh < 10)
      clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return (clock);
  },
  //比较日期大小
  compareTime(){
    let newTime = this.formatTime(new Date())
    this.setData({
      nowTime:newTime
    })
  },
  //进入任务详情
  openMission:function(e){
    var currentSelect = e.currentTarget.dataset.index
    let missionData = this.data.missionList
    // console.log(missionData)
    console.log(e)
    this.setData({
      misIndex: currentSelect,
    })
    wx.navigateTo({
      url: '../missionInfo/missionInfo?_id=' + missionData[currentSelect]._id,
    })
    // wx.navigateTo({
    //   url: '../itemDetail/itemDetail?id=' + e.currentTarget.dataset.id,
    // })
  },

  //获取任务
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
        .orderBy('mainBody', 'desc')
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            // console.log(res.data)
            that.data.missionList = res.data;
            that.setData({
              missionList: that.data.missionList,
            })
            let arr = res.data
            // arr.forEach((r,item,index)=>{
            //  if(that.dateMinus(item.endTime,that.data.nowTime)<0){
            //    r.show = '未逾期'
            //  }else{
            //    r.show = '已逾期'
            //  }
              
            // })
            that.setData({
              missionList:arr
            })
            console.log('missionList', that.data.missionList)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.compareTime()
    console.log('onload');
    this.getData(this.data.page);    
    
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
    wx.showNavigationBarLoading()
    wx.stopPullDownRefresh() //停止下拉刷新
    wx.hideNavigationBarLoading() //完成停止加载
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var temp = [];
    // 获取后面十条
    if (this.data.missionList.length < this.data.totalCount) {
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
                totalTopic = that.data.missionList.concat(temp);

                console.log(totalTopic);
                
                that.setData({
                  missionList: totalTopic,
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