<template>
  <div class="order-li">
    <div class="top">{{data.createTime}}<span>{{data.statusInfo.text}}</span></div>
    <div class="middle" @click="next(data.statusInfo.orderType,data.no)">
        <img :src="data.icon">
        <h1>{{data.title}}</h1>
        <p style="line-height: .2rem;">{{data.subtitle}}</p>
    </div>
    <div class="bottom" v-html="getBottom(data.otherText,data.statusInfo.orderType)"></div>
    <order-action-bar v-if="(![5,6,7].includes(data.statusInfo.status)&&!(data.statusInfo.status===2&&['XC','MG'].includes(data.statusInfo.orderType))&&data.statusInfo.state!==39)||(data.statusInfo.deliveryCode===1&&data.statusInfo.status===5)" :data="data" :nowtime="nowtime"></order-action-bar>
  </div>
</template>

<script>
export default {
  name:'order-li',

  props:{
    data:{type:Object},
    nowtime:{type:Number},
    index:{type:Number}
  },
  watch:{
    nowtime(val){
      if(this.data.miaosha&&this.data.miaosha.second==val){
        this.$emit('changeStatus',this.index);
      }
      
    }
  },
  methods:{
      next(type,no){
        if(['WB','SJ','MR','CP','NC','YY','MG','TJ','FX','CZ','JF'].includes(type)){
          this.$router.push('/orders/'+no);
        }else{
          this.$appDownLoad.show()
        }
      },
      getBottom(txt,orderType){
        if(/：/.test(txt)){
          let txtArr=txt.split('：');
          if(orderType==='JF'){
            return '<em>'+txtArr[0]+'</em>：<span><svg class="icon" aria-hidden="true" style="width:.13rem;"><use xlink:href="#icon-icon_integral"></use></svg><em>'+txtArr[1]+'</em></span>'
          }else{
            return txtArr[0]+'：<span>'+txtArr[1]+'</span>'
          }
          
        }else{
          return txt
        }
      }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-li{background:#fff;margin-top:.05rem;color:$black;font-size:.12rem;
        
        .top{padding:0 .2rem;line-height: .4rem;border-bottom:$border;
          span{font-size:.15rem;color:$gray;float:right;}
        }
        .middle{padding:.15rem .2rem 0 .9rem;position: relative;min-height:.65rem;display: block;
        h1{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;}
          img{width:.6rem;height: .6rem;position: absolute;left:.2rem;top:.15rem;}
          p{color:$gray;}
        }
        .bottom{font-size: .15rem;line-height:.25rem;text-align:right;padding:0 .2rem;
          span{color:$red;}
          em{font-style:normal;vertical-align: middle;}
        }
    }
</style>
