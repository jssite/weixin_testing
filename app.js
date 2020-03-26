//app.js
const request = require('./utils/request.js')
const api = require('./api/index.js')
App({
    ajaxSkey(){
        return new Promise((resolve,reject) => {
            let skey = wx.getStorageSync('skey');
            if( !skey ){
                wx.checkSession({
                    success(){
                        console.log('login success!');
                    },
                    fail(){
                        console.log('login fail!');
                        wx.login({
                            success(res){
                                if (res.code) {
                                    request(api.login,{
                                        code:res.code
                                    },function(res){
                                        let { data:{data,message,status_code} } = res
                                        if( status_code == 200 ){
                                            let result = {
                                                has_information: data.has_information,
                                                has_mobile: data.has_mobile
                                            }
                                            wx.setStorageSync('state',result);
                                            wx.setStorageSync('skey',data.skey);
                                        }
                                        resolve(data); 
                                    })
                                }
                            }
                        });
                    }
                })
            }
        })
    },
    globalData: {
        userInfo: null
    }
})