<template>
  <app-layout id="signSuc">
    <div class="signSuc-con">
      <div class="title">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="'#icon-success_fill'"></use>
        </svg>
        <span>恭喜您，注册成功！</span>
      </div>
      <div class="welcome">欢迎成为乐橙会员，尽享精彩车生活</div>
      <img src="/CRM/WeChat/App/static/img/user/pic_signup_result.png" alt="">
      <div class="info"><span>完善车辆信息</span>以便为您提供更好的服务<br/>同时<span>可获得500成长值</span></div>
      <div class="btn" @click="goBindCar">去绑定</div>
      
      <div class="goback" @click="goback">先逛逛，稍后绑定</div>
    </div>
  </app-layout>
</template>
<script>
export default {
  data(){
    return{

    }
  },
  mounted() {
    this.updateaccess()
  },
  // beforeRouteLeave (to, from, next) {
  //     this.updateaccess()
  //     next()
  // },
  methods:{
    goBindCar(){
      // this.updateaccess()
      this.$cache.history.pop();
      this.$router.replace('/bindCar');
    },
    goback(){
      // this.updateaccess()
      if(this.$cache.history.length>2){
        this.$router.go(-1)
      }else{
        this.$cache.history.pop();
        this.$router.replace('/home');
      }
      
    },
    
    async updateaccess(){
      let data = {
        content: {
          memberId:this.$cache.user.memberId,
        }
      };
      let res=await this.$post('/CRM/appmembermgcust/updateaccess.json',data); 
      if (res.errcode == 0) {
      }
    }
  }
}
</script>
<style lang="scss" >
@import "~assets/css/var.scss";
  #signSuc{background: #fff;font-size: .13rem;
    .signSuc-con{margin:.82rem .55rem .3rem;;text-align:center;
      .title{
        .icon{color: #92cc53;width: .3rem;height: .3rem;vertical-align: center}
        span{font-size: .18rem;line-height: .3rem;display: inline-block;vertical-align: middle;}
      }
      .welcome{margin-top: .05rem;}
      img{width: 76%;margin: .5rem 12%}
      .info{
        line-height: .2rem;
        span{color: $red}
      }
      .btn{height: .4rem;color: #fff;font-size: .15rem;background: $red;line-height: .4rem;border-radius: .06rem;margin: .2rem 0;}
      .goback{color: $red;text-decoration: underline;}
    }
  }
</style>

