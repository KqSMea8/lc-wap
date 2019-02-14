<template>
<app-layout id="me">
    <div class="header-bg">
        <div class="info-box">
            <router-link tag="div" class="head" :style="{'background-image':'url('+defaultHead+')'}" to="/me/account"></router-link>
            <router-link tag="div" class="name" to="/me/account">{{nickname}}</router-link>
            <div class="progress-box" v-if="mbeId">
                <div class="full">
                    <div class="progress" :style="{'width':percent+'%'}"></div>
                </div>
                <div class="num">{{$cache.user.growthPoint}}/{{$cache.user.growthPoint+$cache.user.growthPoint2NextLevel}}</div>
            </div>
            <router-link v-else :to="isWechat?'/signUp':'/h5signUp'"><div class="login-btn" >立即登录</div></router-link>
            
            <div class="card-box">
                <router-link to="/me/memberRights" class="mycard" v-if="mbeId">
                    <img src="~assets/img/me/label_personal_puka@2x.png" v-if="$cache.user.level.includes('普卡')">
                    <img src="~assets/img/me/label_personal_yinka@2x.png" v-else-if="$cache.user.level.includes('银卡')">
                    <img src="~assets/img/me/label_personal_jinka@2x.png" v-else-if="$cache.user.level.includes('金卡')">
                    <img src="~assets/img/me/label_personal_zuanshika@2x.png" v-else-if="$cache.user.level.includes('钻石')">
                    <span>{{$cache.user.level}}会员权益<span class="arrow"></span></span>
                </router-link>
                <router-link  class="mycard" to="/privilege" v-if="mbeId&&['金卡','钻石卡'].includes($cache.user.level)">
                    <img src="~assets/img/me/icon_personal_quanyi@2x.png" style="height:.13rem;margin-left: .05rem;">
                    <span>限量特权<span class="arrow"></span></span>
                </router-link>
            </div>

        </div>
        <ul class="package-box">
            <router-link tag="li" to="/money">
                
                <img src="~assets/img/me/icon_personal_coupon@2x.png">
                <div>余额</div>
            </router-link>
            <router-link tag="li" to="/point">
                
                <img src="~assets/img/me/icon_personal_integral@2x.png">
                <div>积分</div>
            </router-link>
            <li  @click="changeBadgeInfo('1413','/myCoupons/1')">
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1413&&item.badge=='dot'">
                    <mt-badge size="small" color="#fe0000"></mt-badge>
                </template>
                <img src="~assets/img/me/icon_personal_money@2x.png">
                <div>卡券</div>
            </li>
            <li   @click="changeBadgeInfo('1412','/package')">
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1412&&item.badge=='dot'">
                    <mt-badge size="small" color="#fe0000"></mt-badge>
                </template>
                <img src="~assets/img/me/icon_personal_package@2x.png">
                <div>套餐</div>
            </li>
        </ul>
    </div> 
    <div class="myOrders" >
    
        <router-link tag="li" class="all" to="/orders?status=0">
            <img src="~assets/img/me/order.png">
            <span class="text">我的订单</span>
            <div class="right">查看全部订单<span class="arrow"></span></div>
        </router-link>
        
        <div class="parts">
            <router-link to="/orders?status=1">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pay"></use>
                </svg>
                <div>待付款</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1414&&item.badge&&item.badge!=''">
                    <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
            </router-link>

           <router-link to="/orders?status=2">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-ongoing"></use>
                </svg>
                <div>进行中</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1415&&item.badge&&item.badge!=''">
                    <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
                
            </router-link>

            <router-link to="/orders?status=3">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-receive"></use>
                </svg>
                <div>待收货</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1416&&item.badge&&item.badge!=''">
                    <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
            </router-link>

            <router-link to="/orders?status=4">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-comment"></use>
                </svg>
                <div>待评价</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1417&&item.badge&&item.badge!=''">
                    <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
            </router-link>

            <a @click.stop="$appDownLoad.show()">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-pay"></use>
                </svg>
                <div>售后/退款</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1418&&item.badge&&item.badge!=''">
                    <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>

            </a>
        </div>

    </div>


    <ul class="squared-box">
       
        <router-link tag="li" to="/mall/cart">
            <img src="~assets/img/me/squared_icon9.png">
            <p>购物车</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1430&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000" class="num">{{item.badge}}</mt-badge>
            </template>
        </router-link>

        <router-link tag="li" to="/mall/collection">
            <img src="~assets/img/me/squared_icon10.png">
            <p>我的收藏</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1431&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>

        <router-link tag="li" to="/integralMall">
            <img src="~assets/img/me/squared_icon3.png">
            <p>积分商城</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1422&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>

        <router-link tag="li" to="./myCars">
            <img src="~assets/img/me/squared_icon1.png">
            <p>我的车库</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1420&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>

        <router-link tag="li" to="/invite">
            <img src="~assets/img/me/squared_icon4.png">
            <p>邀请有礼</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1426&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>

        <router-link tag="li" to="/recommendBuyers">
            <img src="~assets/img/me/squared_icon5.png">
            <p>盈众老友记</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1432&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>
        <router-link tag="li" to="/carWiki">
            <img src="~assets/img/home/module_icon7.png">
            <p>用车百科</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1428&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>
        <router-link tag="li" :to="'./helpCenter?actUrl='+encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/forApp/help_center.html')">
            <img src="~assets/img/me/squared_icon8.png">
            <p>客服中心</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1425&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>
        <router-link tag="li" to="/feedback">
            <img src="~assets/img/me/icon_personal_advice.png">
            <p>意见反馈</p>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1424&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
        </router-link>
    </ul>

</app-layout>
</template>
<script>

export default {
  data() {
    return {
      percent: 0,
      defaultHead: "",
      nickname: "",
      mbeId:"",
      badgeList:[],
      isWechat:isWechat,

    };
  },
  mounted() {
    if(this.$cache.user.level){
        this.percent =
        this.$cache.user.growthPoint /
        (this.$cache.user.growthPoint + this.$cache.user.growthPoint2NextLevel) *
        100;
    }
  },
  activated() {
    this.mbeId = this.$cache.user.memberId;
    this.nickname = this.$cache.user.nickname;
    this.defaultHead =
    this.$cache.user.headImgUrl || require("assets/img/default_user.png");
    this.badgeList=[]
    this.getBadgeInfo()
  },
  methods: {

    async changeBadgeInfo(funcId,url){
        this.$router.push(url)
        for(let i=0;i<this.badgeList.length;i++){
            if(funcId==this.badgeList[i].funcId&&this.badgeList[i].badge=='dot'){
                let data = {
                    content: {
                        mbeId:this.$cache.user.memberId,
                        funcId: funcId,           
                    }
                };
                let res = await this.$post('/CRM/appfuncconfig/changeBadgeInfo.json', data);
            }
        }
        
        
    },
    async getBadgeInfo() {
        let data = {
            content: {
                mbeId:this.mbeId,
                funcId: "",
                appVersion:'',
                platform:'Wechat'
                
            }
        };
        let res = await this.$post('/CRM/appfuncconfig/getBadgeInfo.json', data);
        if(res&&res.errcode==0){
            this.badgeList=res.content.badgeList;
        }
    },
  }
};
</script>
<style lang="scss">
@import '~assets/css/var.scss';

#me{
    .login-btn{
        border: 1px solid #fff;
        display: inline-block;
        padding:0 .15rem;
        border-radius: .2rem;
        font-size: .12rem;
        height: .2rem;
        line-height: .2rem;
        margin-top: .2rem;
    }
    .icon{
        width: .24rem;
        height: .24rem;
    }
    .header-bg{width:100%;height:2.5rem;background:url('/CRM/WeChat/App/static/img/me/pic_personal.jpg') center no-repeat;background-size:100% 100%;color:#fff;position:relative;

    .info-box{text-align:center;padding-top:.22rem;
      .head{height:.6rem;width:.6rem;border-radius:50%;border:2px solid #fff;box-sizing:border-box;margin:auto;background-size:cover;background-position:center;}
      .name{font-size:.15rem;margin-top:.05rem;}

      .progress-box{@include box;@include flexAlign;font-size:.12rem;@include flexJustify;margin-top:.15rem;
        .full{margin-right:.1rem;position:relative;height:.05rem;width:1.1rem;background:#fff;border-radius:.05rem;overflow:hidden;
          .progress{position:absolute;width:50%;height:100%;background:$red;border-radius:.05rem;}}}

      .card-box{@include box;@include flexJustify;
        .mycard{@include box;@include flexAlign;
          height:.23rem;background:#2e2e30;border-radius:.23rem;padding:0 .03rem;font-size:.12rem;margin:.1rem;
          img{width:.16rem;border-radius:50%;margin-right:.05rem;}
          .arrow{position:relative;top:.01rem;margin-right:.1rem;margin-left:.05rem;
            &::after{position:absolute;content:'';width:0;height:0;top:0;right:-.04rem;border:.06rem solid transparent;border-right:0;border-left-color:#2e2e30;}
            &::before{position:absolute;content:'';width:0;height:0;top:0;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}}}}}

                
    .package-box{@include box;background:#424143;position:absolute;bottom:0;left:0;width:100%;height:.6rem;
      li{@include box;@include flexDir(column);@include flexJustify;@include flexAlign;@include flex;text-align:center;position: relative;
        .mint-badge{padding: 4px !important;position: absolute;top: .1rem;right: .23rem;}
        img{width:.25rem;height:.25rem;}
        div{font-size:.12rem;margin-top:.05rem;}}}}

  .myOrders{margin:.1rem 0;
        .all{background:#fff;height:.5rem;@include box;@include flexJustify(space-between);@include flexAlign;font-size:.15rem;padding:0 .2rem;
            img{height:.19rem;margin-right:.1rem;}
            .text{color:#22222d;}
            .right{@include flex;text-align:right;color:#88888d;
                .arrow{position:relative;margin-left:.08rem;top:.01rem;
                    &::after{position:absolute;content:'';width:0;height:0;top:0;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                    &::before{position:absolute;content:'';width:0;height:0;top:0;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                }
            }
        }
        
        .parts{@include box;border-top:$border;background: #fff;color:$gray;padding:.15rem 0;
            a{@include flex;text-align:center;position: relative;
                .mint-badge{padding:1px 5px !important;position: absolute;top: -.05rem;right: .08rem;}
                div{line-height: .1rem;font-size:$h4;margin-top:.1rem;}
            }
        }
    }

  .squared-box{@include box;background:#fff;font-size:.15rem;color:#22222d;
    li{@include box;@include flexDir(column);@include flexJustify;@include flexAlign;width:33.33%;height:.88rem;border-right:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;box-sizing:border-box;position: relative;
      .mint-badge{padding:1px 5px !important;position: absolute;top: .15rem;    left: .6rem;font-size: .11rem;
        &.num{left: .8rem;}
      }
      img{height:.3rem;margin-bottom:.05rem;}}}}

</style>
