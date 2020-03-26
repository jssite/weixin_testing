const app = getApp();
const request = require('../../utils/request.js')
const api = require('../../api/index.js')
Page({
    data: {
        lists:[],
        point: '',
        isValue: false,
        totalPages: 0,
        curr_page: 1,
        is_nodata: 3
    },
    onLoad(){
        let curr_page = this.data.curr_page;
        let _this = this;
        wx.showLoading({
            title: 'loading'
        });
        request(api.temperatureLists,{page:curr_page},function(res){
            let { data, status_code } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    lists:[...data.data],
                    totalPages: data.last_page
                });
                if( data.data.length ){
                    _this.setData({
                        is_nodata: 1
                    })
                } else {
                    _this.setData({
                        is_nodata: 2
                    })
                }
            }
            wx.hideLoading()
        })
    },
    onReachBottom(){
        if( this.data.curr_page >= this.data.totalPages) return false;
        let _this = this;
        this.setData({
            curr_page: _this.data.curr_page+1
        });
        let curr_page = this.data.curr_page;
        let lists = this.data.lists;
        wx.showLoading({
            title: 'loading'
        });
        request(api.temperatureLists,{page:curr_page},function(res){
            let { data, status_code } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    lists:[...lists,...data.data]
                });
            }
            wx.hideLoading()
        })
    },
    bindFormSubmit(e){
        let { value } = e.detail;
        let lists = this.data.lists;
        let _this = this;
        wx.showToast({
            title: '提交',
            icon: 'loading',
            duration: 2000
        });
        request(api.temperatureSubmit,value,function(res){
            let { data, status_code } = res.data;
            if( status_code == 200 ){
                wx.showToast({
                    title: '提交成功',
                    icon: 'success'
                });
                _this.setData({
                    lists:[data,...lists],
                    point: '',
                    isValue: false
                });
                if( _this.data.is_nodata == 2 ){
                    _this.setData({
                        is_nodata: 1
                    })
                }
            }
        })
    },
    bindInputChange(e){
        let { value } = e.detail;
        if( value != '' ){
            this.setData({
                isValue: true
            })
        } else {
            this.setData({
                isValue: false
            })
        }
        this.setData({
            point: value
        });
    }
})