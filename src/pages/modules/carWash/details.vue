<template>
    <app-layout id="carWash_details" >
      <div class="store" >
        <img class="pic" data-src="https://img.lechengclub.com/test56/5e81a5f8d4334c4aaec33fe5c843f925.png" src="https://img.lechengclub.com/test56/5e81a5f8d4334c4aaec33fe5c843f925.png" lazy="loaded">
        <h1>第三方的手法</h1>
          <lc-rate disabled v-model="4.8"></lc-rate>
          <div class="addr clearfix"><p>11</p><span>{{getDistance(118.003619,24.495859)}}</span></div>

      </div>
      <div id="details_map" style="width: 100%;height: 100%;">
        <div v-if="error" class="lc-error">
          <img src="~assets/img/error-map.png">
          <p>无法加载地图</p>
        </div>   
        <div :class="error?'hide':''" id="allmap"></div>
      </div>
      
      <div class="pupop-bottom" slot="aside">
        <ul class="choose-car">
          <li>
            <svg class="icon fill" aria-hidden="true">
                <use xlink:href="#icon-success_fill"></use>
            </svg>
            <label>斯蒂芬</label>
            <span>￥23</span>
          </li>
          <li>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-success_fill"></use>
            </svg>
            <label>斯蒂芬</label>
            <span>￥23</span>
          </li>
        </ul>
        <div class="coupon-popup" >
            <div class="arrow-link switch" @click="showCoupon=true">
                <img src="~assets/img/mall/icon_detail_list_coupon.png" alt="">
                <h1>使用优惠券</h1>
                <div><span :class="{red:coupon.len}">{{coupon.desc||''}}</span></div>
            </div>
        </div>
        <use-coupon slot="aside"  @close="showCoupon=false" :switch="showCoupon" :goods="goods" v-model="coupon"></use-coupon>
      </div>

      <div  slot="footer" class="btns">
        <div class="middle"><span>￥{{1}}</span>(全城共<span style="margin:0">23</span>家服务门店)</div>

        <div class="right">
          <button class="orange" >去支付</button>
        </div>
      </div>
    </app-layout>
</template>

<script>
import UseCoupon from 'components/coupon/use'
    export default {
      name:'ex-map',
      components:{
          'use-coupon':UseCoupon,
      },
      data() {
        return {
          showCoupon:false,
          error:false,
          myLocation:'',
          goods:[],
          coupon:{}
        };
      },
      mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
        this.draw();
      },
      methods: {
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        },
        draw(){
            let map = new BMap.Map("details_map"),
                point=new BMap.Point(this.$route.query.lng,this.$route.query.lat);
            
            map.centerAndZoom(point, 15);
            map.addOverlay(new BMap.Marker(point));
        }
      }
    }
</script>

<style lang="scss">
@import "~assets/css/var.scss";
    #carWash_details{
      .switch{img{height: .13rem;margin-right: .05rem}}
      .coupon-popup{margin:.05rem 0}
      .page-content{position: relative}
      .pupop-bottom{position: absolute;bottom:.45rem;width: 100%;background: #f2f2f2;
        .choose-car{
          li{background: #fff;height:.44rem;line-height:.44rem;padding:0 .2rem;margin-bottom:.01rem;
            .icon{width:.2rem;color: #d7d7d7}
            .fill{color: #aace52}
            label{vertical-align: middle;margin-left: .05rem;}
            span{float: right;color: $red}
          }
        }
      }
      #allmap{ width: 100%;height: 100%;overflow: hidden;margin:0;font-family:"微软雅黑";}
      #allmap.hide{visibility: hidden;}
      .btns{height:.45rem;background:#fff;overflow: hidden;zoom:1;
        button{box-sizing: border-box;height:.45rem;}
        
        .middle{width:2.55rem;line-height: .45rem;float: left;text-indent:.2rem;font-size:.12rem;
          span{color:$red;margin-right: .1rem;}
        }

        .right{width:1.2rem;float:right;@include box;
            button{@include flex;color:#fff;
              &.yellow{background:#f29600;}
              &.orange{background:$red;}
              &.dis{background:#c9c9c9;width:2.25rem;line-height: .45rem;color:#fff;text-align:center;}
            }
        }
      }
      .store{display:block;position: absolute;padding:.14rem .2rem .14rem 1.05rem;background: #fff;border-bottom:$border;min-height:.7rem;top: 0;width: 100%;z-index: 1;box-sizing: border-box;
          .pic{position:absolute;left:.2rem;top:.14rem;width:.7rem;height:.7rem;
      border-radius: .04rem;}
          h1{color:$black;line-height: .18rem;height: .36rem;@include txtlineOverflow(2);width:70%;}
          .addr{font-size:$h4;color:$gray;text-indent:.14rem;background: url('~assets/img/icon-addr.png') no-repeat left center;background-size:.09rem .11rem;margin-top:.02rem;
              p{width:70%;@include txtOverflow;float: left;}
              span{float:right;line-height: .16rem}
          }
    
      }
    }
</style>