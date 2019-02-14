<template>
  <div v-if="entity" >
    <div class="gift-bag">
      <img src="/CRM/WeChat/App/static/img/orders/banner.png" alt="">
      <div class="left">
        <p >交车大礼包</p>
        <div v-if="entity.issueStatus==1">感谢您选择盈众汽车，评价完成</div>
        <div v-if="entity.issueStatus==1">即可获得一份<span>{{entity.couponAmt}}元</span>交车大礼包</div>
        <div v-if="entity.issueStatus==2">您已获得一份<span>{{entity.couponAmt}}元</span>交车大礼包</div>
        <div v-if="entity.issueStatus==2" @click="getData">点击查看>></div>
      </div>
      <div class="right" v-if="entity.issueStatus==1" @click="$appDownLoad.show({
                        title:'该礼包限App用户领取',
                        details:'请下载盈众乐橙汇App即可成功领取',
                        mlink:mlink,
                        mobParams:mobParams
                    })" :style="{'background-image':'url('+require('assets/img/orders/button_banner_connect_goon.png')+')'}"></div>
      <div class="right"  v-if="entity.issueStatus==2" :style="{'background-image':'url('+require('assets/img/orders/button_banner_connect_past.png')+')'}"></div>
    </div>
    <div class="dialog-bg" v-if="showGift&&couponCenter">
      <div class="gift-popup">
        <div class="close" @click="showGift=false" style="margin-right:.07rem">×</div>
        <div class="top">
          <p>恭喜，礼包领取成功</p>
          <p>共获得<span>{{couponCenter.couponCenterList.length}}</span>张总价值<span>{{couponCenter.deductMoney}}元</span>的礼券</p>
          <ul class="gift-ul">
            <li v-for="(item,index) in couponCenter.couponCenterList">
              <div class="type-money">
                <div class="money" v-if="item.isShowAmt!=2">¥<span>{{item.deductMoney}}</span></div>
                <div class="type" :style="item.isShowAmt==2?'margin-top:.17rem':''">{{item.couponName}}</div>
              </div>
              <p>{{item.condition}}</p>
            </li>

          </ul>
        </div>
        <div class="bottom">
          <router-link to="/recommendBuyers"><div>邀请好友购车享养车礼包</div></router-link>
          
        </div>
        
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name:'order-gift',
  data() {
    return {
      showGift:false,
      isreceive:false,
      entity:null,
      couponCenter:null,
      mobParams:'',
      mlink:''
    }
  },
  props:['orderNo'],
  mounted() {
    this.mlink='ABas?mId='+this.orderNo+'&mlKey=orderDetail'
    this.mobParams={mlKey:'orderDetail',mId:this.orderNo}
    this.getCarGift()
  },
  methods:{
    async getCarGift(){
        let d={
            content: {
                memberId: this.$cache.user.memberId,
                actType:2,
                orderNo:this.orderNo
            }
        };

        let res = await this.$post('/CRM/appActivityUnion/queryActivity.json',d);
        if(res.errcode==0){
          this.entity = res.content.entity
        }
    },
    async getData(){
        let data = {
            content: {
                couponId:this.entity.couponId,
                apiType:'GET_COUPON_DETAIL_PACKAGE'
            }
        }
        let res = await this.$post('/couponSys/appcoupon/getDetail.json', data);
        if(res.errcode==0){
          this.showGift=true
          this.couponCenter = res.content.couponCenter
        }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "~assets/css/var.scss";
  .gift-bag{
      position: relative;
      margin-top: .05rem;
      font-size: 0;
      img{width: 100%}
      .left{position: absolute;width: 1.8rem;height: .58rem;top: .1rem;left: .95rem;text-align:left;margin:.07rem 0;
        p{color: #fff;height: 20px;font-size: .15rem;font-weight: 700;margin-bottom: .02rem;text-align: center}
        div{width: 100%;font-size: .12rem;color: #ffef01;
        span{color: #fff}}
      }
      .right{position: absolute;width: .625rem;height: .625rem;top: .1rem;right: .22rem;background-size:100% 100%;margin: .05rem }
  }
  .gift-popup{
    width: 3.31rem;
    left: 50%;
    top: 50%;
    position: relative;
    transform: translate(-50%,-50%);
    .top{
      margin-left: .055rem;
      box-sizing: border-box;
      width: 3.2rem;
      background: #fff;
      border-radius: .06rem;
      padding:.15rem .06rem;
      font-size: .13rem;
      color: #000;
      
      p{
        margin-bottom: .04rem;
        span{color: #cc0c01}
      }
      .gift-ul{
        max-height: 2.3rem;
        overflow: auto;
        // @include box;
        // justify-content: space-around;
        padding: 0 .08rem;
        li{
          
            float: left;
            background: url('~assets/img/coupon/bg_coupons_pack.png');
            width: 1.4rem;
            height: 1.05rem;
            background-size: 100% 100%;
            margin-top: .1rem;
            color: #cc0c01;
            font-size: .12rem;
            text-align: center;
            @include txtOverflow;
            &:nth-child(2n){
              float: right;
            }
            .type-money{
                height: .65rem;
                padding-top: .13rem;
                box-sizing: border-box;
     
                .money{
                    font-weight: 600;
                    
                    span{
                        font-size: .25rem;
                    }
                }
                .type{
                  width: 90%;
                  margin-left:5%;
                  @include txtOverflow;
                }
            }
            
            p{
                color: #000;
                line-height: .28rem;
            }
        }
        
      }
    }
    .bottom{
      width: 100%;
      height: 1rem;
      background: url('~assets/img/orders/popup.png') no-repeat;
      background-size: 100% 100%;
      margin-top: -.28rem;
      div{
        height: .4rem;
        width: 90%;
        background: #f5b82c;
        color: #d03435;
        border-radius: .1rem;
        line-height: .4rem;
        margin-left: 5%;
        position: absolute;
        bottom: .17rem;
      }
    }
    
  }

</style>
