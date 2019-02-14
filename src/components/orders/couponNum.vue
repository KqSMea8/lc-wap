<template>
  <div class="order-coupon-num">
    <div>券号：<span>{{data.couponValue}}</span></div>
    <div class="see" @click="goCoupon(data.couponType)" >查看</div>
  </div>
</template>
<script>
export default {
  name:'coupon-num',
  
  props:{
    data:{type:Object},
  },
  methods:{
    goCoupon(num){
      if(num==1){
        this.$router.push('/myCoupons/1?key=2')
      }else{
        this.$router.push('/myCoupons/1?key=1') 
      }
    } 
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-coupon-num{background:#fff;height: .6rem;padding:0 .2rem;@include box;@include flexAlign;@include flexJustify(space-between);color:$black;
      div{span{font-size: .18rem;vertical-align: middle;margin-left: .15rem;}}
      .see{color:$red;height: .19rem;line-height:.19rem;border:1px solid $red;padding:0 .1rem;border-radius: .2rem;font-size: .14rem;}
    }
</style>