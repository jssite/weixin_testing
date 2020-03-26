Page({
    data: {
        result: null
    },
    onLoad(){
        let data = wx.getStorageSync('successInfo');
        if( data.status == 3 ){
            wx.setNavigationBarTitle({
                title: '超过限制'
            })
        }
        this.setData({
            result: data
        });
    },
    bindGoToindex(){
        wx.navigateTo({
            url: '/pages/index/index',
            success: function(){
                wx.removeStorageSync('successInfo')
            }
        });
    }
})