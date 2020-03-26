const app = getApp();
const request = require('../../utils/request.js')
const api = require('../../api/index.js')
Page({
    data: {
        state: {},
        travelArray: [{
            id: 1,
            name: '火车'
        },
        {
            id: 2,
            name: '飞机'
        },
        {
            id: 3,
            name: '汽车'
        },
        {
            id: 4,
            name: '其他'
        }],
        travel_type_txt: '',
        is_show_house: false,
        is_user_address: false,
        is_work_office: false,
        is_submit: true,
        realname: '',
        mobile: '',
        sex: '',
        age: '',
        id_card: '',
        travel_type: '',
        travel_ext: '',
        rent_house: '',
        house_owner_name: '',
        house_owner_mobile: '',
        input_1: '',
        input_2: '',
        input_3: '',
        input_4: '',
        changzhu: '',
        huji: '',
        company_name: '',
        plact_text: '请填写出行信息'
    },
    onLoad(params){
        let init_state = params.state;
        let phoneNumber = wx.getStorageSync('phoneNumber');
        if( init_state == 1 ){
            this.bindUserEdit()
        }
        let states = wx.getStorageSync('state') || {};
        if( Object.keys(states).length ){
            this.setData({
                state: states
            });
        }
        if( phoneNumber ){
            this.setData({
                mobile: phoneNumber
            })
        }
    },
    bindUserEdit(){
        let _this = this;
        wx.showLoading({
            title: 'loading'
        })
        request(api.userEdit,{},function(res){
            let { status_code, data } = res.data;
            if( status_code == 200 ){
                _this.setData({
                    realname: data.realname,
                    mobile: data.mobile,
                    sex: data.sex,
                    age: data.age,
                    id_card: data.id_card,
                    travel_type: data.travel_type,
                    travel_ext: data.travel_ext,
                    rent_house: data.rent_house,
                    house_owner_name: data.house_owner_name,
                    house_owner_mobile: data.house_owner_mobile,
                    input_1: data.input_1,
                    input_2: data.input_2,
                    input_3: data.input_3,
                    input_4: data.input_4,
                    changzhu: data.changzhu,
                    huji: data.huji,
                    company_name: data.company_name,
                    travel_type_txt: _this.data.travelArray[data.travel_type-1].name
                });
                // if( data.changzhu || data.huji){
                //     _this.setData({
                //         is_user_address: true
                //     })
                // }
                // if( data.company_name){
                //     _this.setData({
                //         is_work_office: true
                //     })
                // }
            }
            wx.hideLoading()
        })
    },
    bindPickerChange(e){
        let { value } = e.detail;
        let _this = this;
        let id =  _this.data.travelArray[value].id;
        this.setData({
            travel_type_txt: _this.data.travelArray[value].name,
            travel_type: _this.data.travelArray[value].id,
            travel_ext: ''
        });
        if( id == 1 ){
            this.setData({
                plact_text: '请输入火车出行信息'
            })
        }
        if( id == 2 ){
            this.setData({
                plact_text: '请输入航班出行信息'
            })
        }
        if( id == 3 ){
            this.setData({
                plact_text: '请输入车辆出行信息'
            })
        }
        if( id == 4 ){
            this.setData({
                plact_text: '请输入其他出行信息'
            })
        }
    },
    bindFormSubmit(e){
        let { value } = e.detail;
        let _this = this;
        let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if( !value.realname ){
            wx.showToast({
                title: '请填写您的姓名',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( value.sex == '' ){
            wx.showToast({
                title: '请选择您的性别',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !value.age ){
            wx.showToast({
                title: '请填写您的年龄',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !value.id_card ){
            wx.showToast({
                title: '请输入您的身份证号',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !regIdCard.test(value.id_card) ){
            wx.showToast({
                title: '请填写正确的身份证号',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !value.mobile ){
            wx.showToast({
                title: '请填写您的手机号',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !reg.test(value.mobile) ){
            wx.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        // if( !value.changzhu ){
        //     wx.showToast({
        //         title: '请填写您的常住地址',
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     return false;
        // }
        if( !value.huji ){
            wx.showToast({
                title: '请填写您的户籍地址',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        // if( !value.company_name ){
        //     wx.showToast({
        //         title: '请填写您所属公司',
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     return false;
        // }
        if( this.data.travel_type == '' ){
            wx.showToast({
                title: '请填写您的出行方式',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( !value.travel_ext ){
            wx.showToast({
                title: '请填写您的出行详细信息',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        // if( value.rent_house == '' ){
        //     wx.showToast({
        //         title: '请选择您是否租房',
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     return false;
        // }
        // if( value.rent_house == '1' && value.house_owner_name == '' ){
        //     wx.showToast({
        //         title: '请填写您的房主姓名',
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     return false;
        // }
        // if( value.rent_house == '1' && value.house_owner_mobile == '' ){
        //     wx.showToast({
        //         title: '请填写您的房主电话',
        //         icon: 'none',
        //         duration: 2000
        //     })
        //     return false;
        // }
        // if( value.rent_house == '1' && value.house_owner_mobile != '' ){
        //     if( !reg.test(value.house_owner_mobile )){
        //         wx.showToast({
        //             title: '请填写正确的房主电话',
        //             icon: 'none',
        //             duration: 2000
        //         })
        //         return false;
        //     }
        // }
        if( value.input_1 == '' ){
            wx.showToast({
                title: '请选择是否发热与确诊或疑似患者密切接触 ',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( value.input_2 == '' ){
            wx.showToast({
                title: '请选择是否在本地隔离14天',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( value.input_3 == '' ){
            wx.showToast({
                title: '请选择是否去过湖北武汉并与发热患者有过密切接触 ',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( value.input_4 == '' ){
            wx.showToast({
                title: '请选择是否去过湖北武汉以外的其他地区 ',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( this.data.is_user_address && value.changzhu == '' ){
            wx.showToast({
                title: '请填写常住地址',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( this.data.is_user_address && value.huji == '' ){
            wx.showToast({
                title: '请填写户籍地址',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if( this.data.is_work_office && value.company_name == '' ){
            wx.showToast({
                title: '请填写公司楼宇信息',
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        value.travel_type = this.data.travel_type;
        if( this.data.is_submit ){
            this.setData({
                is_submit: false
            });
            wx.showLoading({
                title:'loading'
            })
            request(api.userSubmit,value,function(res){
                let { status_code } = res.data;
                if( status_code == 200 ){
                    let states = _this.data.state;
                    states.has_information = 1;
                    wx.setStorageSync('state',states);
                    wx.showToast({
                        title: '提交成功！',
                        icon: 'success',
                        duration: 3000,
                        success:function(){
                            wx.redirectTo({
                                url: '/pages/index/index'
                            });
                        }
                    });
                    _this.setData({
                        is_submit: true
                    })
                } else {
                    wx.showLoading({
                        title: message
                    })
                }
                wx.hideLoading()
            },function(){
                _this.setData({
                    is_submit: true
                });
            });
        }
        
    },
    bindRadioGroup(e){
        if( e.detail.value == '1' ){
            this.setData({
                is_show_house: true
            })
        } else {
            this.setData({
                is_show_house: false
            })
        }
    },
    bindWorkOffice(){
        let _this = this;
        this.setData({
            is_work_office: !_this.data.is_work_office
        })
    },
    bindUserAddress(){
        let _this = this;
        this.setData({
            is_user_address: !_this.data.is_user_address
        });
    }
})