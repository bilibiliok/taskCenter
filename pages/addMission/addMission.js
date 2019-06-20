// pages/addMission/addMission.js
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
//获取年
for (let i = 2019; i <= date.getFullYear() + 20; i++) {
  years.push("" + i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
//获取日期
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //时间选择
    missionList:[],
    exectorList:[],
    checkList:[],
    time: '',
    multiArray: [years, months, days, hours, minutes],
    multiIndex: [0, 9, 16, 10, 17],
    choose_year: '',
    // bigIndex:'',
    // smallIndex:'',
    indexTitle:'',
    cloudPath:'',
    images:[],
    _openid:'',
    title:'',
    mainBody:'',
    exectorName:'',
    exectorNameId:'',
    checkPerson:'',
    checkPersonId:'',
    endTime:'',
    publishTime:new Date(),
    //获取毫秒数
    secondTime:''
  },
  //标题绑定
  inputTitle:function(e){
    // console.log('时间',this.data.publishTime)
      var bigTitle = e.detail.value
      this.setData({
        title:bigTitle
      })
      this.getOpenid()
      console.log(this.data._openid)
    // console.log(this.data.title)   
  },
  //内容绑定
  inputmainbody(e){
    // console.log(e)
    var missionBody = e.detail.value
    this.setData({
      mainBody: e.detail.value
    })
    // console.log('111',this.data.mainBody)
  },
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
  //获取用户openId
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

//选择图片
  chooseImage(e) {
    var that = this
    // console.log(e)
      wx.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: function (res) {
          wx.showLoading({
            title: '上传中',
          })
          console.log('wqwer',res)
          const tempFilePaths = res.tempFilePaths
          // that.setData({
          //   images: tempFilePaths
          // })
        
          //获取毫秒数
          // var startDate = that.formatTime(new Date())
          // console.log('startDate', startDate)
          // startDate = startDate.replace(new RegExp("-", "gm"), "/");
          var startDateM = (new Date()).getTime(); //得到毫秒数
          console.log('eeee',startDateM)
          
          that.setData({
            secondTime: startDateM
          })
          console.log('dsds',that.data.secondTime)
          wx.cloud.uploadFile({
            cloudPath: that.data.secondTime + '.png',
            filePath: res.tempFilePaths[0],
            success(res) {
              console.log('1111', res)
              // console.log('33'.res.fileID)
              that.setData({
                images: [res.fileID]
              })
              console.log('test', that.data.images)


            },
            complete: () => {
              wx.hideLoading()
            }
          })
        },

      })
    
   
  },
  // 显示图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    // console.log(e)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.images // 需要预览的图片http链接列表  
    })
  },   
  //提交任务
  addMission(){
    this.getOpenid()
    let that =this
    // console.log('32123',that.data.publishTime)
    // let openid = wx.getStorageSync('openId')
    // that.setData({
    //   _openid:openid
    // })
    if(that.data.title == ''){
      wx.showToast({
        title: '请输入标题',
        icon:'none'
      })
    } else if (that.data.mainBody == ''){
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    } else if (that.data.exectorName == ''){
      wx.showToast({
        title: '请输入执行人',
        icon: 'none'
      })
    } else if (that.data.checkPerson == ''){
      wx.showToast({
        title: '请输入检查人',
        icon: 'none'
      })
    }else if(that.data.endTime == ''){
      wx.showToast({
        title: '请输入时间',
        icon: 'none'
      })
    } else if (that.data.title.length>=20){
      wx.showToast({
        title: '标题不得超过20字符',
        icon: 'none'
      })
    } else if (that.data.mainBody.length>=255) {
      wx.showToast({
        title: '内容不得超过255字符',
        icon: 'none'
      })
    } else {
      wx.cloud.callFunction({
        name: 'addMission',
        data: {
          _openid: that.data._openid,
          title: that.data.title,
          mainBody: that.data.mainBody,
          exectorName: that.data.exectorName,
          exectorNameId: that.data.exectorNameId,
          images: that.data.images,
          checkPerson: that.data.checkPerson,
          checkPersonId: that.data.checkPersonId,
          endTime: that.data.endTime,
          done: 0,
          publishTime: that.data.publishTime
        },
        complete: res => {
          // console.log('dasdsa',res)
          this.setData({
            time: '',
            indexTitle: '',
            images: '',
            bigIndex: '',
            smallIndex: '',
          })
          setTimeout(() => {
            wx.showToast({
              title: '添加成功',
            })    
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '../taskCenter/taskCenter',
            })
          },3000)
        }
      })
    }
   
    
  },
  // 删除图片
  delete:function(){
    this.setData({
      images:''
    })
  },
 
  bindPickerChange(e) {
    // console.log(e)
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      bigIndex: e.detail.value
    })
    this.data.exectorName = this.data.exectorList[e.detail.value].exectorName
    this.data.exectorNameId = this.data.exectorList[e.detail.value]._openid
    // console.log('1321', this.data.exectorName)
  },
  //检查人绑定
  bindPickerChange2(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      smallIndex: e.detail.value
    })
    this.data.checkPerson = this.data.checkList[e.detail.value].exectorName
    this.data.checkPersonId = this.data.checkList[e.detail.value]._openid
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //时间转换
    this.data.publishTime = this.formatTime(new Date())
    // console.log('当前时间', this.data.publishTime)
    //获取所有的任务
    const db = wx.cloud.database()
    db.collection('mission').get({
      success(res) {
        // console.log(res)
        that.setData({
          missionList: res.data
        })
        // console.log(that.data.missionList)
      }
    })
    //获取执行人
    let that = this
    // console.log('ee', that.data.exectorName)
    db.collection('exectored').get({
      success(res) {
        // console.log(res)
        that.setData({
          exectorList: res.data,
          checkList:res.data
        })
        // console.log(that.data.exectorList)
        // console.log(that.data.checkList)
       
      }
    })
    //设置默认的年份
    this.setData({
      choose_year: this.data.multiArray[0][0]
    })
  },
  //获取时间日期
  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    const minute = this.data.multiArray[4][index[4]];
    // console.log(`${year}-${month}-${day}-${hour}-${minute}`);
    this.setData({
      time: year + '-' + month + '-' + day + ' ' + hour + ':' + minute,
    
    })
    this.data.endTime = this.data.time
    // console.log('123213',this.data.endTime)
    
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      // console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        // console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      // console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },


 
})