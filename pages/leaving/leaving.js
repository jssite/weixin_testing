const app = getApp();
const request = require('../../utils/request.js')
const utils = require('../../utils/util.js')
const api = require('../../api/index.js')
Page({
    data: {
        cursor: 0,
        place_id: 0,
        area_type: 1, //1住宅 2楼宇
        userInfo: {},
        peers: [],
        currIndex: 1, //楼宇1业务2访客
        is_submit: true,
        travelArray: [{
            id: 1,
            name: '户主本人'
        },
        {
            id: 2,
            name: '租客'
        },
        {
            id: 3,
            name: '丈夫'
        },
        {
            id: 4,
            name: '妻子'
        },
        {
            id: 5,
            name: '子女'
        },
        {
            id: 6,
            name: '父母'
        },
        {
            id: 7,
            name: '祖父母'
        },
        {
            id: 8,
            name: '其他'
        }],
        travel_type_txt: '',
        travel_type: '',
        check_info: null,
        focus: false,
        search_text: '',
        companyLists: [],
        company_name: '',
        company_id: '',
        tartget_company_name: '',
        tartget_lists: [],
        tartget_id: '',
        is_click: true
    },
    bindCheckTartagetChange(e){
        let { value } = e.detail;
        let _this = this;
        this.setData({
            tartget_company_name: value
        });
        request(api.companyLists,{
            keywords: value,
            place_id: _this.data.place_id
        },function(res){
            let { status_code, data } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    tartget_lists: data
                })
            }
        },function(){
            wx.showToast({
                title: '网络错误请刷新此页面',
                icon: 'none'
            })
        })
    },
    bindCheckTartagetTxt(e){
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let _this = this;
        this.setData({
            tartget_lists: [],
            tartget_company_name: _this.data.tartget_lists[index].name,
            tartget_id: id
        })
    },
    bindTabInput(){
        this.setData({
            is_click: true
        })
    },
    bindFunVisitor(e){
        this.setData({
            currIndex: e.currentTarget.dataset.variable
        })
    },
    onLoad(opts){
        let skey = wx.getStorageSync('skey');
        let states = wx.getStorageSync('state') || {};
        let scene = null;
        let params = null;
        if( opts.index ){
            params = opts;
        } else {
            scene = decodeURIComponent(opts.scene)
            params = utils.formatJson(scene)
        }
        if( !params.place_id ){
            wx.showModal({
                title: '地址码错误',
                content: '请扫描正确的地址信息',
                confirmColor: '#4A73E6',
                showCancel: false,
                success (res) {
                    if (res.confirm) {
                        wx.redirectTo({
                            url: '/pages/index/index'
                        })
                    }
                }
            });
            return false;
        }
        this.setData({
            place_id: params.place_id,
            area_type: params.area_type
        });
        if( skey ){
            if( states.has_mobile != 1 ){
                wx.showModal({
                    title: '提示',
                    content: '本次操作需要您进行授权登录',
                    confirmColor: '#4A73E6',
                    showCancel: false,
                    success (res) {
                        if (res.confirm) {
                            wx.redirectTo({
                                url: '/pages/index/index'
                            })
                        }
                    }
                });
                return false;
            }
            if(states.has_information != 1){
                wx.showModal({
                    title: '提示',
                    content: '请完善您的个人资料再进行登记',
                    confirmColor: '#4A73E6',
                    showCancel: false,
                    success (res) {
                        if (res.confirm) {
                            wx.redirectTo({
                                url: '/pages/user/user'
                            })
                        }
                    }
                });
                return false;
            }
            this.bindCheckInformation()
            this.bindGetUserInfo();
        } else {
            wx.showModal({
                title: '提示',
                content: '本次操作需要您进行授权登录',
                cancelColor: '#888888',
                confirmColor: '#4A73E6',
                showCancel: false,
                success (res) {
                    if (res.confirm) {
                        wx.redirectTo({
                            url: '/pages/index/index'
                        })
                    }
                }
            });
        }
    },
    bindTabs(e){
        this.setData({
            currIndex: e.currentTarget.dataset.variable
        })
    },
    bindGetUserInfo(){
        let _this = this;
        wx.showLoading({
            title: 'loading'
        })
        request(api.userEdit,{},function(res){
            let { status_code, data } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    userInfo: data
                });
            }
            wx.hideLoading()
        })
    },
    bindFormSubmit(e){
        let _this = this;
        let { value } = e.detail;
        let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if(value.point == ''){
            wx.showToast({
                title: '请填写您的体温',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if(value.tartget_name == ''){
            wx.showToast({
                title: '请填写受访人姓名',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if(value.tartget_mobile == ''){
            wx.showToast({
                title: '请填写受访人手机号',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( value.tartget_mobile ){
            if( !reg.test(value.tartget_mobile) ){
                wx.showToast({
                    title: '受访人手机格式不正确',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            }
        }
        if(value.tartget_company_name == ''){
            wx.showToast({
                title: '请填写受访人公司名称',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( this.data.tartget_id == '' ){
            wx.showToast({
                title: '您输入的公司不存在',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        let isname = this.data.peers.every((element,index,attry) => {
            return element.name != ''
        });
        let ismobile = this.data.peers.every((element,index,attry) => {
            return element.mobile != ''
        });
        let ispoint = this.data.peers.every((element,index,attry) => {
            return element.point != ''
        });
        if( !isname ){
            wx.showToast({
                title: '请填写同行人姓名',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !ispoint ){
            wx.showToast({
                title: '请填写同行人体温',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !ismobile ){
            wx.showToast({
                title: '请填写同行人手机号',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        let result = this.data.peers.map(function(element,index,array){
            return JSON.stringify(element)
        });
        value.peers = `[${result.toString()}]`;
        value.place_id = this.data.place_id;
        if(this.data.currIndex == '2' ){
            value.tartget_company_id = this.data.tartget_id;
        }
        if( this.data.is_submit ){
            this.setData({
                is_submit: false
            })
            wx.showLoading({
                title: 'loading'
            })
            request(api.visitLogStore,value,function(res){
                let { status_code, data, message} = res.data;
                if( status_code == 200 ){
                    wx.setStorageSync('successInfo',data)
                    wx.navigateTo({
                        url: '/pages/success/success'
                    });
                } else{
                    wx.showToast({
                        title: '数据提交失败',
                        icon: 'none'
                    })
                }
                wx.hideLoading()
                _this.setData({
                    is_submit: true
                });
            },function(){
                _this.setData({
                    is_submit: true
                });
            })
        }
        
    },
    bindAddPeers(){
        let data = {
            name: '',
            mobile: '',
            point: ''
        }
        let _this = this;
        this.setData({
            peers: [..._this.data.peers,data]
        })
    },
    bindInputChange(e){
        let { attr, currindex } = e.currentTarget.dataset;
        let { value } = e.detail
        let data = this.data.peers;
        data[currindex][attr] = value;
        this.setData({
            peers: data
        });
    },
    bindClearItem(e){
        let idx = e.currentTarget.dataset.currindex;
        let arr = this.data.peers;
        arr.splice(idx,1);
        this.setData({
            peers: arr
        })
    },
    bindPickerChange(e){
        let { value } = e.detail;
        let _this = this;
        let id =  _this.data.travelArray[value].id;
        this.setData({
            travel_type_txt: _this.data.travelArray[value].name,
            travel_type: _this.data.travelArray[value].id
        });
    },
    /*检查是否需要补充信息*/
    bindCheckInformation(){
        let params = {
            place_id: this.data.place_id
        }
        let _this = this;
        request(api.checkInformation,params,function(res){
            let { data,status_code } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    check_info: data
                });
            }
        },function(err){
            wx.showToast({
                title: '网络错误请刷新此页面',
                icon: 'none'
            })
        })
    },
    bindInputFocus(){
        this.setData({
            focus: true
        })
    },
    bindInputBlur(){
        this.setData({
            focus: false
        });
    },
    bindCheckInputChange(e){
        if(e.detail.cursor != this.data.cursor) {
            let { value } = e.detail;
            let _this = this;
            this.setData({
                cursor: e.detail.cursor,
                company_id: '',
                company_name: value
            });
            request(api.companyLists,{
                keywords: value,
                place_id: _this.data.place_id
            },function(res){
                let { status_code, data } = res.data;
                if( status_code == 200 ){
                    _this.setData({
                        companyLists: data
                    })
                }
            },function(){
                wx.showToast({
                    title: '网络错误请刷新此页面',
                    icon: 'none'
                })
            })
        }
    },
    bindCheckTxt(e){
        let id = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let _this = this;
        this.setData({
            companyLists: [],
            company_name: _this.data.companyLists[index].name,
            company_id: id,
            is_click: false
        })
    },
    bindAddInformation(e){
        let { value } = e.detail;
        let _this = this;
        let travel_type = this.data.travel_type;
        let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if( value.building_number == '' ){
            wx.showToast({
                title: '请输入社区楼号',
                icon: 'none'
            })
            return false;
        }
        if( value.unit_number == '' ){
            wx.showToast({
                title: '请输入单元号',
                icon: 'none'
            })
            return false;
        }
        if( value.room_number == '' ){
            wx.showToast({
                title: '请输入房间号',
                icon: 'none'
            })
            return false;
        }
        // if( value.registered_place == '' ){
        //     wx.showToast({
        //         title: '请输入户籍地',
        //         icon: 'none'
        //     })
        //     return false;
        // }
        if( this.data.area_type == '1' && travel_type == '' ){
            wx.showToast({
                title: '请选择与户主之间的关系',
                icon: 'none'
            })
            return false;
        }
        if(this.data.travel_type == '2' && value.house_owner_name == '' ){
            wx.showToast({
                title: '请输入房东姓名',
                icon: 'none'
            })
            return false;
        }
        if(this.data.travel_type == '2' && value.house_owner_mobile == '' ){
            wx.showToast({
                title: '请输入房东手机号',
                icon: 'none'
            })
            return false;
        }
        if(this.data.travel_type == '2' && value.house_owner_mobile != '' ){
            if( !reg.test(value.house_owner_mobile )){
                wx.showToast({
                    title: '请填写正确的房主电话',
                    icon: 'none',
                    duration: 2000
                })
                return false;
            }
        }
        if( this.data.area_type == '2' && this.data.company_id == '' ){
            wx.showToast({
                title: '您输入的公司不存在',
                icon: 'none'
            })
            return false;
        }
        if(this.data.area_type == 1 ){
            value.community_area_id = this.data.check_info.community_area_id;
            value.household_relation = this.data.travel_type;
        } else {
            value.company_area_id = this.data.check_info.company_area_id;
            value.company_id = this.data.company_id;
        }
        wx.showLoading({
            title: 'loading'
        })
        request(api.addInformation,value,function(res){
            let { status_code, data } = res.data;
            let result = _this.data.check_info;
            if( status_code == 200 ){
                result.status = 1;
                _this.setData({
                    check_info: result
                })
                _this.bindGetUserInfo();
            }
            wx.hideLoading()
        },function(err){
            wx.showToast({
                title: '网络错误请刷新此页面',
                icon: 'none'
            })
        },function(){
            wx.hideLoading()
        })
    }
})