
const app = getApp();
const request = require('../../utils/request.js')
const api = require('../../api/index.js')
Page({
    data: {
        banner: {},
        state: {},
        swiperCurrent: 0,
        statusBarHeight: 0,
        titleBarHeight: 0
    },
    onLoad: function () {
        let _this = this;
        let skey = wx.getStorageSync('skey');
        let states = wx.getStorageSync('state');
        this.bindGetIndexData();
        if( skey ){
            this.setData({
                state: states
            })
        } else {
            app.ajaxSkey().then(function(res){
                let data = {
                    has_information: res.has_information,
                    has_mobile: res.has_mobile
                }
               _this.setData({
                   state: data
               })
            })
        }
    },
    onShow(){
        let that = this;
        wx.getSystemInfo({
            success: function(res) {
                let titleBarHeight = 0
                if (res.model.indexOf('iPhone') !== -1) {
                    titleBarHeight = 44
                } else {
                    titleBarHeight = 48
                }
                that.setData({
                    statusBarHeight: res.statusBarHeight,
                    titleBarHeight: titleBarHeight
                });
            },
            failure() {
                that.setData({
                    statusBarHeight: 0,
                    titleBarHeight: 0
                });
            }
        })
    },
    bindUserAuthorized(e){
        let { encryptedData, errMsg, iv } = e.detail;
        if( errMsg == 'getPhoneNumber:ok' ){
            let _this = this;
            console.log(e.detail);
            request(api.userLogin,{
                encryptedData: e.detail.encryptedData,
                iv:e.detail.iv
            },function(res){
                let { data, status_code } = res.data;
                if( status_code == 200 ){
                    let states = _this.data.state;
                    states.has_mobile = 1;
                    wx.setStorageSync('state',states);
                    _this.setData({
                        state: states
                    });
                    wx.setStorageSync('phoneNumber',data.phoneNumber)
                    wx.navigateTo({
                        url: '/pages/user/user?state=0'
                    })
                } else {
                    wx.showToast({
                        title: '登录失败请重新登录',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },function(){
                wx.showToast({
                    title: '登录失败请重新登录',
                    icon: 'none',
                    duration: 2000
                })
            });
        } else {
            wx.showToast({
                title: '获取手机号失败',
                icon: 'none',
                duration: 2000
            })
        }
    },
    bindGetIndexData(){
        let _this = this;
        wx.showLoading({
            title: 'loading'
        });
        request(api.index,{},function(res){
            let { data, status_code, message } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    banner: data.banners
                });
            } else {
                wx.showToast({
                    title: message,
                    icon: 'none',
                    duration: 2000
                })
            }
            wx.hideLoading();
        });
    },
    // bindHasLogin(){
    //     wx.showModal({
    //         title: '提示',
    //         content: '本次操作需要您进行授权登录',
    //         cancelColor: '#888888',
    //         confirmColor: '#4A73E6',
    //         success (res) {
    //             if (res.confirm) {
                    
    //             }
    //         }
    //     });
    // },
    bindHasUserInfo(){
        wx.showModal({
            title: '提示',
            content: '请完善您的个人资料',
            cancelColor: '#888888',
            confirmColor: '#4A73E6',
            success (res) {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/user/user?state=0'
                    })
                }
            }
        })
    },
    //跳转到进入登记
    bindScanCode(){
        let { has_mobile, has_information } = this.data.state;
        // if( has_mobile != 1 ){
        //     this.bindHasLogin();
        //     return false;
        // }
        if( has_information != 1){
            this.bindHasUserInfo();
            return false;
        }
        wx.scanCode({
            success (res) {
                let { path, errMsg } = res;
                if( errMsg == 'scanCode:ok' ){
                    let nPath = path.split('?')[0];
                    let index = path.indexOf('scene=')+6;
                    let scene = path.substr(index);
                    let params = decodeURIComponent(scene);
                    wx.navigateTo({
                        url: `/${nPath}?${params}&index=1`
                    })
                }
            }
        })
    },
    //跳转到体温上报
    bindTemperature(){
        let { has_mobile, has_information } = this.data.state;
        // if( has_mobile != 1 ){
        //     this.bindHasLogin();
        //     return false;
        // }
        if( has_information != 1){
            this.bindHasUserInfo();
            return false;
        }
        wx.navigateTo({
            url: '/pages/temperature/temperature'
        })
    },
    //跳转到离开登记
    bindLeaving(){
        let { has_mobile, has_information } = this.data.state;
        // if( has_mobile != 1 ){
        //     this.bindHasLogin();
        //     return false;
        // }
        if( has_information != 1){
            this.bindHasUserInfo();
            return false;
        }
        wx.scanCode({
            success (res) {
                let { path, errMsg } = res;
                if( errMsg == 'scanCode:ok' ){
                    let nPath = path.split('?')[0];
                    let index = path.indexOf('scene=')+6;
                    let scene = path.substr(index);
                    let params = decodeURIComponent(scene);
                    wx.navigateTo({
                        url: `/${nPath}?${params}&index=1`
                    })
                }
            }
        })
        
    },
    //跳转到出入记录
    bindRecord(){
        let { has_mobile, has_information } = this.data.state;
        // if( has_mobile != 1 ){
        //     this.bindHasLogin();
        //     return false;
        // }
        if( has_information != 1){
            this.bindHasUserInfo();
            return false;
        }
        wx.navigateTo({
            url: '/pages/record/record'
        })
    },
    //跳转到个人资料
    bindUserInfo(){
        let { has_mobile,has_information } = this.data.state;
        if( has_mobile != 1 ){
            this.bindHasLogin();
            return false;
        }
        wx.navigateTo({
            url: `/pages/user/user?state=${has_information}`
        })
    },
    bindSwiperChange(e){
        this.setData({
            swiperCurrent: e.detail.current
        })
    }
})
