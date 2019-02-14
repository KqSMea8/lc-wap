<template>
  <app-layout class="signUp">
    <div class="login-con">
      <img class="login-logo" src="/CRM/WeChat/App/static/img/login_logo.png">
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
        
        <div id="getCode" :class="coundDown!=='获取验证码'&&'dis'" ref="sendcode">{{coundDown}}</div>
      </div>
      <div class="video-code" @click="sendVideo">收不到短信？使用<span>语音验证</span></div>
      <button class="next" v-on:click="next">登 录</button>
      <div class="protocol">新用户登录注册完成，代表同意<router-link :to="`/protocol?actUrl=${encodeURIComponent('/CRM/static/pages/others/lecheng_serviceProtocol.html')}`">《乐橙会员注册协议》</router-link>。</div>
    </div>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      code: '',
      coundDown: '获取验证码'
    };
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
  methods: {
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
            openid:this.$utils.getCookie('openid'),
            mobilephone:this.phone,
            code: this.code,
            // remark: this.$route.query.mbeId?'YQYL:'+this.$route.query.mbeId:''
          }
        };

        let res=await this.$post('/CRM/wechatcfg/regcust.json',data);
        if (res.errcode == 0) {
          this.$cache.user.phone=this.phone;
          this.$cache.token = res.content.userToken;
          this.$cache.user.memberId=res.content.memberId
          if(res.content.isAccess==0){
            if(this.$route.query.from){
              if(this.$route.query.value){
                this.commitInfo()
              }
              this.$cache.isAccess=1
              this.updateaccess(res.content.memberId)
              if (res.content.isMbe) {
                let entry=this.$cache.entry;
                if(entry){
                  this.$cache.history.pop();
                  this.$router.replace(entry);
                }else{
                  this.$router.go(-1);
                }
              } else {
                this.$router.go(-1);
              }
            }else{
              this.$cache.isAccess=1
              this.$cache.history.pop();
              this.$router.replace('/signSuc');
            }
            
          }else{
            if (res.content.isMbe) {
              let entry=this.$cache.entry;
              if(entry){
                this.$cache.history.pop();
                this.$router.replace(entry);
              }else{
                this.$router.go(-1);
              }
            } else {
              this.$router.go(-1);
            }
          }
          
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
    next() {
      if (!this.hasNull('next')) {
        this.custReg()
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
