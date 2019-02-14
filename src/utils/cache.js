export default {
    token:'',
    user: {},
    // user: { memberId: '325100' },//锦霞
    // user:{memberId:'486354'},//秀霞
    // user:{memberId:'551366'},//秀霞
    entry:'',
    history: ['/'],
    page: {},

    city:'厦门市',
    location:{},
    weather:{},

    car: {},
    fourS: {},
    server: {},
    brand: {},
    salesConsultant:{},
    usedCarStore:{},
    date: {},

    peccancy: { content: {}, other: {} },

    cart:[],
    itemLink: {
        'channel_car': '/mall/carCategory/',
        'channel_cargoods': '/mall/cargoodsCategory/',

        'car':'/mall/car/',
        'salecar':'/mall/salecar/',
        'cargoods':'/mall/cargoods/',
        
        'meirong':'/beauty/detail/',
        'xubao':'/mall/cargoods/',
        'yiye':'/mall/cargoods/'
    },
    //arr[0]:channel渠道类型  arr[1]:targetId目标id  arr[2]:staffId员工号  arr[3] inviterMbeId邀请会员id  arr[4]券类型
    activityInfo:{
        'recommendBuyers':[3,null,null,'params_id',null],
        'discovery':[4,'params_aid','query_sid','query_osid',null],
        'welfare':[5,'params_id',null,null,'query_type'],
        'lottery':[6,'query_aid','query_sid','query_osid',null],
        'helpRed':[7,'params_aid','query_sid','query_osid'],
        'carExhibition':[8,'query_aid','query_sid','query_osid',null],
        'newUser':[9,'params_id','query_sid','query_icode',null]
    },

    urlquery:{},
    badgeList:[],
    appVersion:'2.9.0',
    isAccess:1,  //0:注册完成页面   1：不跳转 
}
