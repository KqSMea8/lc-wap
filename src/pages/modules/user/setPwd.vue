<template>
  <app-layout>
    <div class="login-con">
      <ul class="login-switch" >
        <li>设置登录密码</li>  
      </ul>
      <div class="text-box" >
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-password'"></use>
        </svg>
        <input  type="password" placeholder="设置密码" v-model="password">
      </div>
      <button class="next" v-on:click="next">完 成</button>
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
    }
  },
  computed: {
    
  },
  activated() {

  },
  methods:{
    hasNull(type) {
      if (this.password == '') {
        this.$toast('请输入密码');
        return true;
      }
      return false;
    },
    async next() {
      if (!this.hasNull('next')) {
        let data = {
          content: {
            mobilePhone:this.$cache.user.phone,
            password:MD5(this.password).toLowerCase(),
          }
        };
        let res=await this.$post('/CRM/appcustlogin/setPwd.json',data);
        if (res.errcode == 0) {
          this.$utils.addCookie('userToken', this.$cache.token,'d30');
          this.$utils.addCookie('mbeId', this.$cache.user.memberId,'d30');
          if(this.$cache.isAccess==0){
            this.$cache.history.pop();
            this.$router.replace('/signSuc');
          }else{
            this.$router.go(-1);
          }
          this.$toast('设置成功');
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
    .next{display:block;color:#fff;width:100%;box-sizing:initial;font-size:.15rem;border-radius:4px;margin:.3rem auto 0;line-height:.4rem;text-align:center;background:$red;}
  }
  
</style>


