
const request = (url,data,success,fail,complete) =>{
    let skey = wx.getStorageSync('skey');
    wx.request({
        url: `https://yq.daodaokeji.cn/${url}`,
        data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "skey": skey
        },
        method: 'POST',
        success,
        fail,
        complete
    })

}
module.exports = request;