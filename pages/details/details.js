const app = getApp();
const request = require('../../utils/request.js')
const api = require('../../api/index.js')
Page({
    data: {
        result: null
    },
    onLoad(opts){
        let id = opts.id;
        let _this = this;
        wx.showLoading({
            title: 'loading'
        });
        request(api.visitLogDetail,{id},function(res){
            let { data, status_code } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    result: data
                })
            } else {
                wx.showLoading({
                    title: '加载失败，请刷新'
                });
            }
            wx.hideLoading()
        })
    }
})