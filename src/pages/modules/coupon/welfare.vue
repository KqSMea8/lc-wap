<template>
  <app-layout id="coupon_welfare">
        <div class="preview" v-if="preview==1">页面效果预览</div>
        <div class="content" :style="{'background-image':`url(${content.bannerImg})`}">
            <div class="voucher" :style="content.isShowAmt==2?'padding-top:2.15rem':''">
                <p>恭喜您获得</p>
                <div>{{content.couponName}}</div>
                <div v-if="content.isShowAmt!=2"><span>{{content.deductMoney}}</span>元</div>
            </div>
            <img class="red" src="/CRM/WeChat/App/static/img/coupon/red.png" alt="">
        </div>
        <div class="receive-box" v-show="content!=''">
            <div v-show="!isLogin">
                <input type="tel" placeholder="输入手机号" v-model="phone">
                <div class="code">
                    <input type="tel" placeholder="输入手机验证码" v-model="code">
                    <div class="btn" :class="coundDown!=='获取验证码'&&'dis'" ref="sendcode">{{coundDown}}</div>
                </div>
            </div>
            
            <div class="receive" @click="next">马上领取</div>
            <template v-if="isLogin">
                <div v-if="preview==1"  class="coupon-link">我的卡券 ></div>
                <router-link v-else :to="type==1?'/myCoupons/1?key=2':'/myCoupons/1?key=1'" class="coupon-link">我的卡券 ></router-link>
            </template>
            
        </div>
        <div class="explain-box">
            <div class="gift-bag">
                <template v-if="content.couponCenterList">
                    <div class="title-box">
                        <ul class="spot-ul">
                            <li class="one"></li> <li class="two"></li> <li class="three"></li> <li class="one"></li> <li class="two"></li> <li class="three"></li>
                        </ul> 
                        <span class="title ">{{content.couponName}}</span>  
                        <ul class="spot-ul">
                            <li class="three"></li> <li class="two"></li> <li class="one"></li> <li class="three"></li> <li class="two"></li> <li class="one"></li>
                        </ul>
                    </div>
                
                    <div class="money-title">（包含总金额为{{content.deductMoney}}元的优惠券）</div>
                    <ul class="gift-ul">
                        <li v-for="(item,index) in content.couponCenterList">
                            <div class="type-money">
                                <div class="money" v-if="item.isShowAmt!=2" >¥<span>{{item.deductMoney}}</span></div>
                                <div class="type" :style="item.isShowAmt==2?'margin-top:.17rem':''">{{item.couponName}}</div>
                            </div>
                            
                            <p>{{item.condition}}</p>
                        </li>
                    </ul>
                </template>
                
            </div>
            <div class="explain">
                <div class="title">活动说明</div>
                <p>{{content.receiveNotice}}</p>
                <!-- <p>1.点击“马上领取”按钮，领取成功后购买商品或线下门店消费项目时使用，即可享受优惠。</p>
                <p>2.在盈众乐橙汇-我的优惠券，可查看已领取的优惠券。</p>
                <p>3.因商品参与其他活动等原因，付款时优惠券可能无法使用，此时商品最终成交价以您实际付款时提示金额为准</p>
                <p>4.线下使用券请到指定门店消费使用。</p>
                <p>5.获取、或使用优惠券时存在违规行为，将取消用户领取资格、撤销违规交易且收回全部优惠券，必要时追究法律责任。</p> -->
            </div>
            <div class="choose">
                <img src="/CRM/WeChat/App/static/img/coupon/pic_liyou.png" alt="">
            </div>
            <a  id="appwelfare">
                <img class="download" src="~assets/img/coupon/button_download.png" alt="">
            </a>
            
            <img class="erweima" src="/CRM/WeChat/App/static/img/coupon/erweima.png" alt="">
        </div>

  </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                preview:this.$route.query.preview==1?1:null,
                type:this.$route.query.type,
                content:'',
                isShared:this.$route.query.isShared,
                schemeId:this.$route.params.id,

                code:'',
                coundDown: '获取验证码',
                phone:'',
                isLogin:true,
                mobParams:{mlKey:'home',mId:''},
                mlink:'ABc3?mlKey=home',
            }
        },
        watch: {
            coundDown(val) {
                if (this.coundDown > 0) {
                    setTimeout(() => {
                        this.coundDown -= 1;
                    }, 1000);
                }else{
                    this.coundDown='获取验证码';
                }
            },
        },
        mounted(){
            if(!isLecheng){
                // new Mlink({
                //     mlink:this.mlink,
                //     button:document.querySelector('a#appwelfare')
                // })
                // MobLink([
                //     {
                //         el: "#appwelfare",
                //         path: "lecheng",
                //         params: this.mobParams
                //     }, 
                // ])
            }
            
            if(!this.$cache.user.name){
                this.isLogin=false
                this.jiyanCode()
            }
        },
        activated(){
            //分享内容
            this.getData()
        },
        methods:{
            async jiyanCode(){
                let data={
                    source:'web',
                    ts:new Date().getTime(),
                    actionType:1
                }
                let res = await this.$get("/CRM/wechatGeeTest/validatInit.json",data);
                if(res.errcode==0&&res.content.success==1){ 
                    initGeetest({
                        gt: res.content.gt,
                        challenge: res.content.challenge,
                        new_captcha:true,
                        product: "bind", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: !res.content.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                    },  (captchaObj)=>{
                        this.$refs.sendcode.addEventListener("click", ()=>{
                            if (!this.hasNull('sendCode')) {
                                var validate = captchaObj.getValidate(); 
                                if (!validate) {
                                    captchaObj.verify()
                                }
                            }
                        });
                        captchaObj.onSuccess(async  ()=> {
                            var validate = captchaObj.getValidate();
                            this.sendCode(res.content.reqId,validate.geetest_challenge,validate.geetest_seccode,validate.geetest_validate)
                            captchaObj.reset()
                        })
                    });
                }
            },
            hasNull(type) {
                if (this.phone === '') {
                    this.$toast('请输入手机号码');
                    return true;
                } else if (!/^1[3456789]\d{9}$/.test(this.phone.replace(/\s/g,''))){
                    this.$toast('手机号码格式有误，请检查');
                    return true;
                }
                if (type === 'next' && this.code === '') {
                    this.$toast('请输入验证码');
                    return true;
                }

                return false;
            },
            async sendCode(reqId,geetest_challenge,geetest_seccode,geetest_validate) {
                if (!this.hasNull('sendCode')) {
                    this.coundDown = 60;
                    let data = this.$sign({
                        content: this.$utils.encrypt(JSON.stringify({
                            source:'web',
                            ts:new Date().getTime(),
                            userId:this.phone,
                            reqId:reqId,
                            challenge:geetest_challenge,
                            seccode:geetest_seccode,
                            validate:geetest_validate
                        })),
                    },'sms');
                    let res=await this.$post('/CRM/wechatGeeTest/secondValidat.json', data);
                    if (res.errcode != 0) {
                        this.coundDown = '获取验证码';
                    }
                }
            },
            async next() {
                if(this.preview==1&&this.type==2){
                    this.$router.push('/myCoupons/detail/'+this.schemeId+'?preview=1')
                    return
                }else if(this.preview==1){
                    return
                }

                if(!this.isLogin){
                    if (!this.hasNull('next')) {
                        if(isWechat){
                            let data = {
                                content: {
                                    openid:this.$utils.getCookie('openid'),
                                    mobilephone:this.phone,
                                    code: this.code
                                }
                            };

                            let res=await this.$post('/CRM/wechatcfg/regcust.json',data);
                            if (res.errcode == 0) {
                                this.$cache.token = res.content.userToken;
                                this.$cache.user.memberId=res.content.memberId
                                this.receive(this.content.couponId)
                                this.commitInfo()
                            } 
                        }else{
                            let data = {
                                content: {
                                    mobilePhone:this.phone,
                                    verifyCode: this.code,
                                    password:'',
                                    loginType:'sms'
                                }
                            };
                            let res=await this.$post('/CRM/appcustlogin/custLogin.json',data);
                            if (res.errcode == 0) {
                                if(res.content.type==0){
                                    this.$cache.token = res.userToken;
                                    this.$utils.addCookie('userToken', res.userToken,'d30');
                                    this.$cache.user.memberId=res.content.memberId
                                    this.$utils.addCookie('mbeId', res.content.memberId,'d30');
                                    this.receive(this.content.couponId)
                                }else if(res.content.type==2){
                                    this.custReg()
                                }
                            }
                        }
                        
                    }
                }else{
                    this.receive(this.content.couponId)
                }
                
            },
            async custReg() {
                let data = {
                    content: {
                        mobilePhone:this.phone,
                        userId:'',
                        source:'web'
                    }
                };

                let res=await this.$post('/CRM/appcustlogin/custReg.json',data);
                
                if(!res.content.existPwd){
                    this.$cache.token = res.userToken;
                    this.$utils.addCookie('userToken', res.userToken,'d30');
                    this.$cache.user.memberId=res.content.memberId
                    this.$utils.addCookie('mbeId', res.content.memberId,'d30');
                    this.receive(this.content.couponId)
                    this.commitInfo()
                }

            },
            async commitInfo(){
                const value = this.$utils.activityRecord(this.$route,this.$cache.activityInfo)
                let data = {
                    content: {
                        value:value,
                        source:7
                    }
                };

                let res=await this.$post('/CRM/appChannelInfo/commitInfo.json',data);
                if (res.errcode == 0) {

                }
                
            },
            async getData(){
                let data = {
                    content: {
                        couponId:this.$route.params.id,
                        apiType:this.type==1?'GET_COUPON_DETAIL_ONLINE':this.type==2?'GET_COUPON_DETAIL_OFFLINE':this.type==3?'GET_COUPON_DETAIL_OUTPLATFORM':this.type==4?'GET_COUPON_DETAIL_PACKAGE':''
                    }
                }
                let res = await this.$post('/couponSys/appcoupon/getDetail.json', data);
                if(res.errcode==0){
                    this.content=res.content.couponCenter;
                    if(this.isShared==1&&this.preview!=1){
                        let shareData = {
                            share_title: this.content.couponName,
                            share_desc: '点击领取即可使用，下载“盈众乐橙汇”APP领取更多神券',
                            share_img: location.origin + '/CRM/WeChat/App/static/img/coupon/icon_coupon_pic_general.png',
                            share_url: location.origin+'/wxwap?#'+this.$route.fullPath
                        }
                        this.$utils.shareConfig(shareData);
                    }
                    
                }else{
                    this.$toast(res.msg)
                }
            },
            async receive(id){
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        id:id,
                        apiType:this.type==1?'RECEIVE_ONLINE':this.type==2?'RECEIVE_OFFLINE':this.type==3?'RECEIVE_OUTPLATFORM':this.type==4?'RECEIVE_PACKAGE':'',
                        receiveType:1
                    },
                };
                let res = await this.$post('/couponSys/appcoupon/receiveOrRedeem.json',d,true);

                if(res.errcode==0){
                    if(isLecheng){
                        this.$toast('恭喜，领取成功！')
                    }else{
                        this.$appDownLoad.show({
                            title:'恭喜，领取成功！',
                            details:' ',
                            mobParams:this.mobParams,
                            mlink:this.mlink,
                            wechat:true
                        })

                        this.isLogin=true
                    }
                    
                }else{
                    if(isLecheng){
                        this.$toast(res.msg)
                    }else{
                        this.$appDownLoad.show({
                            title:res.msg,
                            details:' ',
                            mobParams:this.mobParams,
                            mlink:this.mlink,
                            wechat:true
                        })
                        this.isLogin=true
                    }
                    
                }
                
                
            },
   
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #coupon_welfare{
        font-size: .12rem;
        .preview{height: .3rem;line-height: .3rem;background: rgba(0,0,0,.5);position: fixed;top: 0;left: 0;text-align: center;font-size: .12rem;color: #fff;width: 100%;z-index: 1}
        .content{
            // background: url('/CRM/WeChat/App/static/img/coupon/welfare_bg.png') no-repeat;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-color: #fae4cd;
            width: 100%;
            height: 3.75rem;
            position: relative;
            .voucher{
                font-size: .15rem;
                color: #cc0c01;
                text-align: center;
                padding-top:2rem;
                width: 1.8rem;
                margin: auto;
                z-index: 1;
                position: relative;
                @include txtOverflow;
                p{
                    color: #000;
                    letter-spacing: .01rem;
                }
                div{
                    margin-top: .05rem;
                    span{
                        font-size: .4rem;
                    }
                }
                
            }
            .red{
                width: 100%;
                position: absolute;
                bottom: 0;
            }
            
        }
        .receive-box{
            background: #fae4cd;
            width: 90%;
            padding:.15rem 5% .2rem;
            font-size: .15rem;
            input{
                height: .4rem;
                box-sizing: border-box;
                background: #fff;
                border-radius: .06rem;
                width: 100%;
                padding:0 .13rem;
                border: 1px solid #dfdfdf;
            }
            .code{
                margin-top: .1rem;
                margin-bottom: .2rem;
                @include box(nowrap);
                .btn{
                    color: #e94816;
                    width: 1.8rem ;
                    box-sizing: border-box;
                    text-align: center;
                    background: #fff;
                    border-radius: .06rem;
                    border: 1px solid #dfdfdf;
                    line-height: .4rem;
                    height: .4rem;
                    margin-left: .1rem;
                    &.dis{color:lightgray;}
                }
            }
            .receive{
                height: .4rem;
                line-height: .4rem;
                text-align: center;
                color: #fff;
                background: #d43339;
                border-radius: .06rem;
                
            }
            .coupon-link{
                color: #cc0c01;
                font-size: .13rem;
                text-align: center;
                text-decoration: underline;
                display: block;
                text-align: center;
                margin-top: .1rem;
            }
        }
        .explain-box{
            width: 90%;
            padding: .15rem 5%;
            background: #d43339;
            
            .gift-bag{
                .money-title{
                    color: #ffea9e;
                    font-size: .12rem;
                    text-align: center;
                    margin: .05rem 0;
                }
                .title-box{
                    text-align: center;
                    .spot-ul{
                        display: inline-block;
                        width: .24rem;
                        height: .2rem;
                        font-size: 0;
                        box-sizing: border-box;
                        padding: .02rem 0;
                        li{
                            margin: .02rem;
                            display: inline-block;
                            width: .04rem;
                            height: .04rem;
                            border-radius: 99%;
                            &.one{background: rgba(255, 255, 255, 0.2);}
                            &.two{background: rgba(255, 255, 255, 0.4);}
                            &.three{background: rgba(255, 255, 255, 0.6);}
                        }
                    }
                    span{
                        line-height: .2rem;
                        vertical-align: top;
                        color: #fff;
                        font-size: .15rem;
                        font-weight: 600;
                        margin: 0 .12rem;
                    }
                }
                .gift-ul{
                    padding: 0 6.5%;
                    margin-bottom:.3rem;
                    overflow: auto;
                    li{
                        float: left;
                        background: url('~assets/img/coupon/bg_coupons_pack.png');
                        width: 1.4rem;
                        height: 1.05rem;
                        background-size: 100% 100%;
                        margin-top: .1rem;
                        color: #cc0c01;
                        font-size: .12rem;
                        text-align: center;
                        @include txtOverflow;
                        .type-money{
                            height: .65rem;
                            padding: .13rem .1rem 0;
                            box-sizing: border-box;
                           
                            .money{
                                font-weight: 600;
                                
                                span{
                                    font-size: .25rem;
                                }
                            }
                            .type{
                                 @include txtOverflow;
                            }
                        }
                        
                        p{
                            @include txtOverflow;
                            padding: 0 .1rem ;
                            color: #000;
                            line-height: .28rem;
                        }
                        
                    }
                    li:nth-child(2n){
                        float: right;
                    }
                }
            }
            .explain{
                position: relative;
                width: 100%;
                color: #fff;
                border:1px solid #fff;
                box-sizing: border-box;
                border-radius: 10px;
                margin-top: .1rem;
                padding: .17rem .13rem;
                .title{
                    font-weight: 500;
                    
                    font-size: .15rem;
                    width: .9rem;
                    text-align: center;
                    background: #d43339;
                    position: absolute;
                    left: 50%;
                    top: -.11rem;
                    transform: translateX(-50%);
                }
                p{
                    line-height: .2rem;
                    white-space: pre-wrap;
                }
            }
            .choose{
                background: #fae4cd;
                padding: .15rem;
                border-radius: .1rem;
                margin: .3rem 0;
                img{width: 100%;}
            }
            .download{
                width: 100%;
            }
            .erweima{
                width: 100%;
                margin-top: .1rem;
                margin-bottom: .6rem
            }
        }
        
    }
</style>
