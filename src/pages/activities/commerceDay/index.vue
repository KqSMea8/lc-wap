<template>
  <app-layout id="commerceDay">
    <div class="top">
      <img src="/CRM/WeChat/App/static/img/commerceDay/banner.png" alt="">
      <img src="/CRM/WeChat/App/static/img/commerceDay/text.png" style="width:2.56rem" alt="">
      <!-- <a href="/wxwap?LechengLogin#/lottery?aid=601"> -->
      <div class="luck"  @click="goPage('carExhibition')">
        <img src="/CRM/WeChat/App/static/img/commerceDay/luck.png"   alt="">
        <img src="/CRM/WeChat/App/static/img/commerceDay/luck1.png" class="flicker" v-show="num%2==0" alt="">
        <img src="/CRM/WeChat/App/static/img/commerceDay/luck2.png"  class="flicker" v-show="num%2!=0" alt="">
      </div>
      <!-- </a> -->
    </div>
    <div class="bottom">
      <!-- <a href="/wxwap?#/newUser/1"> -->
      <img src="/CRM/WeChat/App/static/img/commerceDay/receive.png" alt="" @click="goPage('newUser')">
      <!-- </a> -->
      <!-- <a href="/mall/cargoods/1537"> -->
      <img src="/CRM/WeChat/App/static/img/commerceDay/goods1.png" alt="" @click="goPage('cargoods')">
      <!-- </a> -->
      <!-- <a href="/wxwap?#/carExhibition?aid=63"> -->
      <img src="/CRM/WeChat/App/static/img/commerceDay/goods2.png" alt="" @click="goPage('carExhibition')">
      <!-- </a> -->
      <!-- <a href="/wxwap?LechengLogin#/mall/seckill"> -->
      <img src="/CRM/WeChat/App/static/img/commerceDay/goods3.png" alt=""  @click="goPage('seckill')">
      <!-- </a> -->
      
      <img src="/CRM/WeChat/App/static/img/commerceDay/goods4.png" alt="" @click="goPage('meirong')">
      
    </div>
  </app-layout>
</template>
<script>
export default {
  data(){
    return{
      num:0,
      clear:null
    }
  },
  activated() {
    let shareData={
        share_title:'盈众电商好车节（第三届），111.1元定金20倍翻',
        share_desc:'盈众电商好车节（11.05-11.11），乐橙线上商城精品一折秒杀，安全座椅129.9元，等你抢，拼手速！',
        share_img:location.origin+'/CRM/WeChat/App/static/img/commerceDay/share_img.png',
        share_url:location.origin+'/wxwap?#'+this.$route.fullPath
    }
    this.$utils.shareConfig(shareData);
    this.clear=setInterval(()=>{
      this.num=this.num+1
    },1000)
  },

  deactivated() {
    clearInterval(this.clear)
    this.clear=null;
    
  },
  methods:{
    goPage(type){
      switch(type){
          case 'meirong':
              if(isLecheng){
                this.$utils.goNative('meirong','meirong529');
              }else{
                this.$router.push('/beauty/detail/meirong529');
              }
          break;
          
          case 'cargoods':
              if(isLecheng){
                  this.$utils.goNative('cargoods','1537');
              }else{
                  this.$router.push('/mall/cargoods/1537');
              }
          break; 
          case 'newUser':
              if(isLecheng){
                location.href="/wxwap?#/newUser/1"
              }else{
                  this.$router.push('/newUser/1');
              }
          break; 
          case 'carExhibition':
              if(isLecheng){
                location.href="/wxwap?#/carExhibition?aid=63"
              }else{
                  this.$router.push('/carExhibition?aid=63');
              }
          break; 
          case 'seckill':
              if(isLecheng){
                location.href="/wxwap?#/mall/seckill?key=&type=current"
              }else{
                  this.$router.push('/mall/seckill?key=&type=current');
              }
          break; 
          case 'lottery':
              if(isLecheng){
                location.href="/wxwap?#/lottery?aid=601"
              }else{
                  this.$router.push('/lottery?aid=601');
              }
          break; 
          
      }
    }
  }
}
</script>
<style lang="scss">
  @import "~assets/css/var.scss";
  #commerceDay{
    img{max-width: 100%;margin: auto}
    .top{background: #e85a55;text-align: center;
      .luck{
        width:3.56rem;padding:.2rem 0;position: relative;margin-left: .095rem;
        .flicker{position: absolute;top: 46.3%;left: 50.3%;transform: translate(-50%,-50%);width: 3.28rem;

        }
      }
    }
    .bottom{background: #fff;
      img{margin-top: .1rem;}
    }
  }
</style>

