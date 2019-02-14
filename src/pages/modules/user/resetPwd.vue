<template>
  <app-layout>
    <div class="login-con">
      <ul class="login-switch" >
        <li>重置密码</li>  
      </ul>
      
      <div class="text-box">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-account'"></use>
        </svg>
        <input  type="tel" placeholder="手机号码" v-model="phone">
      </div>
      <div class="text-box">
        <div class="code-left">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#icon-message1'"></use>
          </svg>
          <input type="tel" placeholder="验证码" v-model="code" style="width:1rem">
        </div>
        <div id="getCode" :class="coundDown!=='获取验证码'&&'dis'"  ref="sendcode">{{coundDown}}</div>
      </div>
      <div class="text-box"  style="border:0">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-password'"></use>
        </svg>
        <input  type="password" placeholder="设置密码" v-model="password">
      </div>
      <div class="video-code" @click="sendVideo">收不到短信？使用<span>语音验证</span></div>
      <button class="next" v-on:click="next">提 交</button>
        
    </div>
  </app-layout>
</template>
<script>
import MD5 from 'js-md5'
export default {
  data() {
    return {
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
      if (type == 'next' && this.code == '') {
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
    async next() {
      if (!this.hasNull('next')) {
        let data = {
          content: {
            mobilePhone:this.phone,
            password:MD5(this.password).toLowerCase(),
            verifyCode:this.code
          }
        };

        let res=await this.$post('/CRM/appcustlogin/setPwd.json',data);
        if (res.errcode == 0) {
          this.$toast('重置成功');
          this.$router.go(-1);
          
        } 
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
    .login-switch{height: .33rem;line-height:.33rem;@include box;@include flexJustify(space-around);color: $gray;margin-bottom:.2rem;padding-top:1rem;
      li{ @include flex;text-align:center;position: relative;
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
  }
  
</style>


