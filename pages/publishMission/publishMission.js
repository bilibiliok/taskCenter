// pages/mymissionUp/mymissionUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //未完成的
    unfinishMissionList: [],
    unfinishMissionListTotal: '',
    unfinishMissionListPage: 1,
    unfinishMissionListPageSize: 10,
    //接受的
    acceptmissionList: [],
    acceptmissionListTotal: '',
    acceptmissionListPage: 1,
    acceptmissionListPageSize: 10,

    //已完成的
    finishMission: [],
    finishMissionTotal: '',
    finishMissionPage: 1,
    finishMissionPageSize: 10,

    _openid: '',
    finish: 0
  },
  //选择选项
  missionType: function (e) {
    console.log(e)
    let ffdf = this.data._openid
    console.log(ffdf)
    var index = e.currentTarget.dataset.current
    // this.getUnfinishMissionList()
    // this.getAcceptmissionList()
    // this.getfinishMission()
    this.setData({
      finish: index
    })
  },
  //未完成任务跳转
  openunfinishMission: function (e) {
    var currentSelect = e.currentTarget.dataset.index
    let missionData = this.data.unfinishMissionList
    // console.log(missionData)
    console.log(e)
    this.setData({
      unMisIndex: currentSelect,
    })
    wx.navigateTo({
      url: '../missionInfo/missionInfo?_id=' + missionData[currentSelect]._id,
    })
    // wx.navigateTo({
    //   url: '../itemDetail/itemDetail?id=' + e.currentTarget.dataset.id,
    // })
  },

  //已接受任务
  openAcceptMission: function (e) {
    var currentSelect = e.currentTarget.dataset.index
    let missionData = this.data.acceptmissionList
    // console.log(missionData)
    console.log(e)
    this.setData({
      acceptMisIndex: currentSelect,
    })
    wx.navigateTo({
      url: '../missionInfo/missionInfo?_id=' + missionData[currentSelect]._id,
    })
    // wx.navigateTo({
    //   url: '../itemDetail/itemDetail?id=' + e.currentTarget.dataset.id,
    // })
  },
  openFinishMission: function (e) {
    var currentSelect = e.currentTarget.dataset.index
    let missionData = this.data.finishMission
    // console.log(missionData)
    // console.log(e)
    this.setData({
      finishMisIndex: currentSelect,
    })
    wx.navigateTo({
      url: '../missionInfo/missionInfo?_id=' + missionData[currentSelect]._id,
    })
    // wx.navigateTo({
    //   url: '../itemDetail/itemDetail?id=' + e.currentTarget.dataset.id,
    // })
  },


  //获取openid
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
        console.log('云函数获取到的openid: ', that.data._openid)
        // console.log(this.data.openId)
        // wx.setStorage({
        //   key: "openId",
        //   data: "openid"
        // })
        // wx.setStorageSync('openId', openid)
      }
    })
  },


  //获取未完成的任务
  getUnfinishMissionList(page) {
    var that = this;
    console.log("page--->" + page);
    const db = wx.cloud.database();
    // 获取总数
    db.collection('mission').where({
      done: 0,
      _openid: that.data._openid
    }).count({
      success(res) {
        console.log('qqqq', res)
        that.setData({
          unfinishMissionListTotal: res.total
        })
      }
    })
    try {
      db.collection('mission')
        .where({
          done: 0,
          _openid: that.data._openid // 填入当前用户 openid
        })
        .limit(that.data.unfinishMissionListPageSize) // 限制返回数量为 10 条
        .orderBy('exectorName', 'desc')
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            // console.log(res.data)
            that.data.unfinishMissionList = res.data;
            that.setData({
              unfinishMissionList: that.data.unfinishMissionList,
            })
          

          },
          fail: function (event) {
          
          }
        })
    } catch (e) {
    
      console.error(e);
    }
    // db.collection('mission').where({
    //   done:0,
    //   exectorNameId:that.data._openid
    // }).get({
    //   success(res) {
    //     // console.log(res)
    //     that.setData({
    //       unfinishMissionList:res.data
    //     })
    //   }
    // })
  },
  //获取已经接受的任务
  getAcceptmissionList(page) {
    let that = this
    const db = wx.cloud.database()

    db.collection('mission').where({
      done: 1,
      _openid: that.data._openid
    }).count({
      success(res) {
        console.log('1231', res)
        that.setData({
          acceptmissionListTotal: res.total
        })
      }
    })
    //获取10条数据
    try {
      db.collection('mission')
        .where({
          done: 1,
          _openid: that.data._openid
        })
        .limit(that.data.acceptmissionListPageSize) // 限制返回数量为 10 条
        .orderBy('exectorName', 'desc')
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            // console.log(res.data)
            that.data.acceptmissionList = res.data;
            that.setData({
              acceptmissionList: that.data.acceptmissionList,
            })
          

          },
          fail: function (event) {
          
          }
        })
    } catch (e) {
   
      console.error(e);
    }
    //   db.collection('mission').where({
    //     done: 1,
    //     exectorNameId: that.data._openid
    //   }).get({
    //     success(res) {
    //       console.log(res)
    //       that.setData({
    //         acceptmissionList: res.data
    //       })
    //     }
    //   })
  },

  //获取已完成的任务
  getfinishMission(page) {
    let that = this
    const db = wx.cloud.database()

    db.collection('mission').where({
      done: 2,
      _openid: that.data._openid
    }).count({
      success(res) {
        console.log('finish', res)
        that.setData({
          finishMissionTotal: res.total
        })
      }
    })

    // db.collection('mission').where({
    //   done: 2,
    //   exectorNameId: that.data._openid
    // }).get({
    //   success(res) {
    //     // console.log(res)
    //     that.setData({
    //       finishMission: res.data
    //     })
    //   }
    // })
    try {
      db.collection('mission')
        .where({
          done: 2,
          _openid: that.data._openid
        })
        .limit(that.data.finishMissionPageSize) // 限制返回数量为 10 条
        .orderBy('exectorName', 'desc')
        .get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组
            // console.log(res.data)
            that.data.finishMission = res.data;
            that.setData({
              finishMission: that.data.finishMission,
            })
          

          },
          fail: function (event) {
          
          }
        })
    } catch (e) {
    
      console.error(e);
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getUnfinishMissionList(this.data.unfinishMissionListPage)
    // this.getAcceptmissionList(this.data.acceptmissionListPage)
    // this.getfinishMission(this.data.finishMissionPage)
    this.getOpenid()
    // let openId = wx.getStorageSync("openId")
    // this.setData({
    //   _openid:openId
    // })
    console.log(this.data._openid)
    let that = this
    const db = wx.cloud.database()
    db.collection('mission').get({
      success(res) {
        console.log(res)
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
    wx.showNavigationBarLoading()
    setTimeout(() => {
      this.getUnfinishMissionList(this.data.unfinishMissionListPage)
      this.getAcceptmissionList(this.data.acceptmissionListPage)
      this.getfinishMission(this.data.finishMissionPage)
    }, 2000)
    wx.hideNavigationBarLoading();//隐藏加载
    wx.stopPullDownRefresh();
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
    var that = this;
    var unfinishTemp = [];
    var acceptTemp = []
    var finishTemp = []
    //未完成的数据
    // 获取后面十条
    if (this.data.unfinishMissionList.length < this.data.unfinishMissionListTotal) {
      try {
        const db = wx.cloud.database();
        db.collection('mission')
          .skip(5)
          .limit(that.data.unfinishMissionList) // 限制返回数量为 5 条
          .orderBy('exectorName', 'desc')	// 排序
          .where({
            done: 0,
            _openid: that.data._openid
          })
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var unfinishTempTopic = res.data[i];
                  console.log(unfinishTempTopic);
                  unfinishTemp.push(unfinishTempTopic);
                }

                var unFinishTotalTopic = {};
                unFinishTotalTopic = that.data.unfinishMissionList.concat(unfinishTemp);

                console.log(unFinishTotalTopic);
                that.setData({
                  unfinishMissionList: unFinishTotalTopic,
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
    //已接受的数据
    if (this.data.acceptmissionList.length < this.data.acceptmissionList) {
      try {
        const db = wx.cloud.database();
        db.collection('mission')
          .skip(5)
          .limit(that.data.acceptmissionList) // 限制返回数量为 5 条
          .orderBy('exectorName', 'desc')	// 排序
          .where({
            done: 1,
            _openid: that.data._openid
          })
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var acceptTempTopic = res.data[i];
                  console.log(acceptTempTopic);
                  acceptTempTopic.push(acceptTempTopic);
                }

                var acceptTotalTopic = {};
                acceptTotalTopic = that.data.acceptmissionList.concat(acceptTemp);

                console.log(acceptTotalTopic);
                that.setData({
                  acceptmissionList: acceptTotalTopic,
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
    //已完成的数据
    if (this.data.finishMission.length < this.data.finishMission) {
      try {
        const db = wx.cloud.database();
        db.collection('mission')
          .skip(5)
          .limit(that.data.finishMission) // 限制返回数量为 5 条
          .orderBy('exectorName', 'desc')	// 排序
          .where({
            done: 2,
            _openid: that.data._openid
          })
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var finishTempTopic = res.data[i];
                  console.log(finishTempTopic);
                  finishTempTopic.push(finishTempTopic);
                }

                var finishTotalTopic = {};
                finishTotalTopic = that.data.finishMission.concat(finishTemp);

                console.log(finishTotalTopic);
                that.setData({
                  finishMission: finishTotalTopic,
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