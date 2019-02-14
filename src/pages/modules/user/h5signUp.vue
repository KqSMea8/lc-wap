<template>
  <app-layout>
    <div class="login-con">
      <img class="login-logo" src="~assets/img/login_logo.png">
      <ul class="login-switch">
        <li @click="select=1" :class="select==1?'on':''">验证码登录<div class="line" v-if="select==1"></div></li>
        <li @click="select=2" :class="select==2?'on':''">密码登录<div class="line" v-if="select==2"></div></li>
        
      </ul>
      <div v-show="select==1">
        <div class="text-box">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#icon-account'"></use>
          </svg>
          <input  type="tel" placeholder="手机号码" v-model="phone">
        </div>
        <div class="text-box" style="border:0">
          <div class="code-left">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-message1'"></use>
            </svg>
            <input type="tel" placeholder="验证码" v-model="code" style="width:1rem">
          </div>
          
          <div id="getCode" :class="coundDown!=='获取验证码'&&'dis'"  ref="sendcode">{{coundDown}}</div>
        </div>
        <div class="video-code" @click="sendVideo">收不到短信？使用<span>语音验证</span></div>
        <button class="next" v-on:click="next">登 录</button>
        <div class="protocol">新用户登录即注册完成，代表同意<router-link :to="`/protocol?actUrl=${encodeURIComponent('/CRM/static/pages/others/lecheng_serviceProtocol.html')}`">《乐橙会员注册协议》</router-link>。</div>
      </div>
      <div v-show="select==2">
        <div class="text-box">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#icon-account'"></use>
          </svg>
          <input  type="tel" placeholder="手机号码" v-model="phone">
        </div>
        <div class="text-box" style="border:0">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#icon-password'"></use>
          </svg>
          <input  type="password" placeholder="密码" v-model="password">

        </div>
        <router-link to="/resetPwd">
          <div class="video-code" >忘记密码</div>
        </router-link>
        
        <button class="next" v-on:click="next">登 录</button>
 
      </div>
    </div>
  </app-layout>
</template>
<script>
import MD5 from 'js-md5'
import axios from 'axios'
export default {
  data() {
    return {
      select:1,
      phone:'',
      password:'',
      code:'',
      coundDown:'获取验证码',
    }
  },
  computed: {
    
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
    this.jiyanCode()
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
      if (this.phone == '') {
        this.$toast('请输入手机号码');
        return true;
      } else if (!/^1[3456789]\d{9}$/.test(this.phone.replace(/\s/g,''))){
        this.$toast('手机号码格式有误，请检查');
        return true;
      }
      if (type == 'next' && this.code == '' && this.select==1) {
        this.$toast('请输入验证码');
        return true;
      }
      if (type == 'next' && this.password == '' && this.select==2) {
        this.$toast('请输入密码');
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
    async sendVideo(){
      if (!this.hasNull('sendCode')) {
        let d = this.$sign({
            
            content: this.$utils.encrypt(JSON.stringify({
                mobilephone:this.phone,
                status:2
            })),

        },'sms');
        let res = await this.$post('/CRM/appcustlogin/sendVoiceVerify.json',d);
        if(res.errcode==0){
            this.$toast('发送成功');
            
        } 
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
        this.$cache.user.phone=this.phone;
        this.$cache.token = res.userToken;
        this.$cache.user.memberId=res.content.memberId
        
        if(this.$route.query.from){
          if(this.$route.query.value){
            this.commitInfo()
          }
          
          this.$cache.isAccess=1
          this.updateaccess(res.content.memberId)
        }else{
          if(res.content.isAccess==0){
            this.$cache.isAccess=0
          }
        }

        this.$cache.history.pop();
        this.$router.replace('/setPwd');
        eventBus.$emit('userInfoUpdated');
        
      }
      
    },
    async commitInfo(){
      let data = {
        content: {
          value:this.$route.query.value,
          source:7
        }
      };

      let res=await this.$post('/CRM/appChannelInfo/commitInfo.json',data);
      if (res.errcode == 0) {
          
      }
      
    },
    // async recommendReg(){
    //   let data = {
    //     content: {
    //       mobilePhone:this.phone,
    //       userId:'',
    //       source:'web',
    //       remark: 'YQYL:'+this.$route.query.mbeId,
    //     }
    //   };

    //   let res=await this.$post('/CRM/appcustlogin/custRegForInvite.json',data);
    //   if (res.errcode == 0) {
        
    //     if(res.content.isAccess==0){
    //       this.$cache.isAccess=1
    //       this.updateaccess(res.content.memberId)
    //       this.$cache.history.pop();
    //       this.$router.replace('/setPwd');
    //       eventBus.$emit('userInfoUpdated');
    //     }
       
        
        
    //   }
    // },
    async commonLogin(){
      let data = {
        content: {
          mobilePhone:this.phone,
          verifyCode: this.select==1?this.code:'',
          password:MD5(this.password).toLowerCase(),
          loginType:this.select==1?'sms':'normal'
        }
      };

      let res=await this.$post('/CRM/appcustlogin/custLogin.json',data);

      if (res.errcode == 0) {
        if(res.content.type==0){
          if(this.select==1){
            if(!res.content.existPwd){
              this.$cache.user.phone=this.phone
              this.$cache.token = res.userToken;
              this.$cache.user.memberId=res.content.memberId

              if(res.content.isAccess==0){
                if(this.$route.query.from){
                  this.$cache.isAccess=1
                  this.updateaccess(res.content.memberId)
                }else{
                  this.$cache.isAccess=0
                }
                
              }
              this.$cache.history.pop();
              this.$router.replace('/setPwd');

            }else{
              this.$cache.token = res.userToken;
              this.$utils.addCookie('userToken', res.userToken,'d30');
              this.$cache.user.memberId=res.content.memberId
              this.$utils.addCookie('mbeId', res.content.memberId,'d30');

              if(res.content.isAccess==0){
                if(this.$route.query.from){
                  this.$cache.isAccess=1
                  this.updateaccess(res.content.memberId)
                  this.$router.go(-1);
                }else{
                  this.$cache.isAccess=1
                  this.$cache.history.pop();
                  this.$router.replace('/signSuc');
                }
                
              }else{
                this.$router.go(-1);
              }

            }
          }else{
            this.$cache.token = res.userToken;
            this.$utils.addCookie('userToken', res.userToken,'d30');
            this.$cache.user.memberId=res.content.memberId
            this.$utils.addCookie('mbeId', res.content.memberId,'d30');

            if(res.content.isAccess==0){
              if(this.$route.query.from){
                this.$cache.isAccess=1
                this.updateaccess(res.content.memberId)
                this.$router.go(-1);
              }else{
                this.$cache.isAccess=1
                this.$cache.history.pop();
                this.$router.replace('/signSuc');
              }
              
            }else{
              this.$router.go(-1);
            }
          }
          eventBus.$emit('userInfoUpdated');
        }else if(res.content.type==2){
          if(this.select==1){
             this.custReg()  
          }else{
            this.$toast(res.msg)
          }
          
        }else if(res.content.type==3){
          if(this.select==1){
            
            if(!res.content.existPwd){
              this.$cache.user.phone=this.phone
              this.$cache.token = res.userToken;
              this.$cache.user.memberId=res.content.memberId
              if(this.$route.query.value){
                this.commitInfo()
              }
              if(res.content.isAccess==0){
                if(this.$route.query.from){
                  this.$cache.isAccess=1
                  this.updateaccess(res.content.memberId)
                }else{
                  this.$cache.isAccess=0
                }
                
              }
              this.$cache.history.pop();
              this.$router.replace('/setPwd');

            }
             
          }else{
            this.$toast(res.msg)
          }
        }
      }
    },
    async next() {
      if (!this.hasNull('next')) {

          this.commonLogin()   
      }
    },

    async updateaccess(memberId){
      let data = {
        content: {
          memberId:memberId,
        }
      };
      let res=await this.$post('/CRM/appmembermgcust/updateaccess.json',data); 
      if (res.errcode == 0) {

      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~assets/css/var.scss";
  .container{background: #fff;}
  .login-con{margin:0 .55rem;
    .login-logo{display:block;width:.58rem;padding:.57rem 0 .5rem;margin: 0 auto }
    .login-switch{height: .33rem;line-height:.33rem;@include box;@include flexJustify(space-around);color: $gray;margin-bottom:.2rem;
      li{ @include flex;text-align:center;position: relative;
        &.on{color: $red}
        .line{width: .5rem;height: .02rem;background: $red;position: absolute;bottom:0;left: 50%;transform: translateX(-50%)}
      }
      
    }
    .text-box{
      height: .5rem;width: 100%;border-bottom:1px solid #dfdfdf;@include box(nowrap);@include flexAlign;
      .icon{margin-right: .14rem;width: .19rem;}
      input{height: .3rem;}
      .code-left{@include flex;width: 60%;@include box;@include flexAlign}
    }
    .video-code{float: right;font-size:.12rem;margin:.1rem 0;
      span{color: $red}
    }
    
    #getCode{float:right;width:1.02rem;font-size:.13rem;line-height:.22rem;color:$red;text-align:center;font-size: .15rem;border-left: 1px solid #dfdfdf}
    #getCode.dis{color:lightgray;}
    .next{display:block;color:#fff;width:100%;box-sizing:initial;font-size:.15rem;border-radius:4px;margin:.5rem auto 0;line-height:.4rem;text-align:center;background:$red;}
    .protocol{
      font-size: .12rem;margin-top:.15rem;line-height:.2rem;
      a{color:$red}
    }
  }
  
</style>


