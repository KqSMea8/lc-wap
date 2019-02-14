<template>
    <div class="coupon-popup">
        <mt-popup v-model="popupSwitch" position="bottom" style="width:100%;">
            <div class="coupons">
                <h1>领取优惠券</h1>

                <div class="page-content">
                    <div class="li" v-if="coupons.length>0" v-for="(item,index) in coupons">
                        <div class="top">
                            <div class="title">{{item.couponName}}</div>
                            <div class="money">
                                <div><span>¥</span>{{item.deductMoney}}</div>
                                <span>{{item.condition}}</span>
                            </div>
                        </div>

                        <div class="bottom">
                            <p class="time"><span style="flex:1;-webkit-flex:1">{{item.time}}</span></p>
                            <p class="desc"><span>{{item.couponDesc}}</span></p>
                            
                            <img v-if="item.hasGetNum>=item.userlimitQuantity" src="~assets/img/mall/icon_card_have.png">
                            <button v-else @click="takeCoupon(item.couponId,index)">立即领取</button>
                        </div> 
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
  name:'take-coupon',
  
  props:{
      value:{type:Boolean},
      gid:{type:String},
      coupons:{type:Array}
  },
  watch:{
      value(val){
        
        this.popupSwitch=val;
        
      },
      popupSwitch(val){
          if(!val){
              this.$emit('input',val);
          }
      }
  },
  data: function () {
    return { 
        popupSwitch:false
    }
  },
  methods:{
        
        async takeCoupon(id,index){
            let d={
                content: {
                    memberId: this.$cache.user.memberId,
                    id:id,
                    apiType:'RECEIVE_ONLINE',
                    receiveType:5
                },
                
            };
            let res = await this.$post('/couponSys/appcoupon/receiveOrRedeem.json',d);
            if (res.errcode === 0) {
                this.coupons[index].hasGetNum+=1;
                this.$toast(res.msg);
            }
        }
    }
}
</script>

<style lang="scss">
 @import "~assets/css/coupon/popup.scss";
</style>


    