<template>
  <app-layout id="newuser" :style="{'background':entity?entity.bgColor:''}">
    <div class="top" v-if="entity" :style="{'background-image':`url(${entity.actImg})`}">
        <router-link :to="'/article/'+entity.detailRuleId">
            <div class="go-detail" >活动规则</div>
        </router-link>      
    </div>
    <div class="bottom">
      <div class="gift-box" v-if="entity">
        <ul class="gift-ul" v-if="entity.imgList.length>0">
          <li v-for="(item,index) in entity.imgList" :style="{'background-image':`url(${item.img})`}">
            <!-- <div class="money">¥<span></span></div>
            <div class="type">保养工时券</div>
            <p>无门槛使用</p> -->
          </li>

        </ul>
        <template v-if="entity.status==1">
            <p class="coupon-link" style="text-decoration: none;" v-if="entity.issueStatus==4">您已经是我们的老朋友啦（以上券限新人可领）</p>
            <router-link to="/invite"><div class="receive" v-if="entity.issueStatus==4">邀请好友赚更多奖励</div></router-link>

            <div class="receive" @click="next" v-if="entity.issueStatus==1||!entity.issueStatus">马上领取新人礼包</div>
            <router-link to="/invite"><div class="receive" v-if="entity.issueStatus==2">领取成功，邀请好友赚更多奖励</div></router-link>
        </template>
        
        <div class="receive dis" v-else>活动已过期</div>
        <div class="coupon-link"  v-if="entity.issueStatus" @click="goMyCoupons">我的卡券 ></div>
      </div>
      <div class="choose">
          <img src="/CRM/WeChat/App/static/img/coupon/pic_liyou.png" alt="">
      </div>
      <!-- <a  class="appopen2">
          <img class="download" src="~assets/img/coupon/button_download.png" alt="">
      </a> -->
      <img class="erweima" src="/CRM/WeChat/App/static/img/coupon/erweima.png" alt="">
    </div>

    <!-- <lc-appdialog v-if="showAlert" :showAlert.sync="showAlert"   title="该礼包限App用户领取" details="请下载盈众乐橙汇App即可成功领取" :mlink="mlink"></lc-appdialog> -->

  </app-layout>
</template>
<script>
  export default {
    data() {
      return {
        mlink:'Ae7S?url='+encodeURIComponent(location.origin+'/wxwap?#'+this.$route.path)+'&mlKey=link',
        mobParams:{mlKey:'link',url:encodeURIComponent(location.origin+'/wxwap?#'+this.$route.path)},
        receiveInfo:'',
        showAlert:false,
        entity:null
      }
    },
    mounted(){
        // if(!isLecheng){
        //     new Mlink({
        //         mlink:this.mlink,
        //         button:document.querySelector('a.appopen2')
        //     })

        // }
        
    },
    activated() {
        this.getData();
    },
    methods:{
        goMyCoupons(){
            if(isLecheng){
                this.$utils.goNative('myCoupons');
            }else{
                this.$router.push('/myCoupons/1?key=1');
            }
        },
        async getData(){
            let d={
                content: {
                    memberId: this.$cache.user.memberId,
                    actType:1,
                    id:this.$route.params.id
                }
            };

            let res = await this.$post('/CRM/appActivityUnion/queryActivity.json',d);
            if(res.errcode==0){
                this.entity=res.content.entity;
                this.$utils.setAppTitle(this.entity.name);
                let shareData = {
                    share_title: this.entity.name,
                    share_desc: this.entity.shareTig,
                    share_img: this.entity.shareImg,
                    share_url: location.origin+'/wxwap?#'+this.$route.fullPath
                }
                this.$utils.shareConfig(shareData);
            }
        },
         next(){
             

            this.$login(async ()=>{
                if(isLecheng){
                    let d={
                        content: {
                            memberId: this.$cache.user.memberId,
                            actType:1,
                            id:this.entity.id
                        }
                    };

                    let res = await this.$post('/CRM/appActivityUnion/redeemAward.json',d);
                    if(res.errcode==0){
                        this.$toast('领取成功')
                        this.entity.issueStatus=2
                    }
                }else{
                    this.$appDownLoad.show({
                        title:'该礼包限App用户领取',
                        details:'请下载盈众乐橙汇App即可成功领取',
                        mlink:this.mlink,
                        mobParams:this.mobParams,

                    })
                    // this.showAlert=true
                }
                
            },this.$route)
                
         
            
            
        }
    }
  }
</script>
<style lang="scss">
@import "~assets/css/var.scss";
  #newuser{
    // background: #e85b54;
    .top{
 
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 100%;
        height: 3.2rem;
        position: relative;
        .go-detail{
            position: absolute;
            color: #fff;
            background: rgba(0,0,0,.6);
            padding: 0 .1rem;
            border-radius: 10px;
            height: .2rem;
            line-height: .2rem;
            font-size: .12rem;
            top: .1rem;
            right: .1rem;
        }
    }
    .bottom{
      width: 90%;
      margin: 0 5%;
    }
    .gift-box{
      position: relative;
      top: -.4rem;
      
      border-radius: .1rem;
      background: #fff;
      box-shadow: 0px 0px 12px 2px #f6dde0 inset;
      padding:.05rem .15rem .15rem;
      box-sizing: border-box;
      .gift-ul{
       overflow: auto;padding: 0 .05rem;
        li{
            &:nth-child(2n){
                float: right;
            }
            float: left;
            
            background-size: 100% 100%;
            width: 1.4rem;
            height: 1.05rem;
            background-size: 100% 100%;
            margin-top: .1rem;
            color: #cc0c01;
            font-size: .12rem;
            text-align: center;
            @include txtOverflow;
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
            }
            
            p{
                color: #000;
                line-height: .28rem;
            }
        }
        
      }
      .receive{
          height: .4rem;
          line-height: .4rem;
          text-align: center;
          color: #fff;
          background: #e85b54;
          border-radius: .1rem;
          margin-top:.1rem;
          &.dis{background:#c9c9c9}
      }
      .coupon-link{
          color: #cc0c01;
          font-size: .13rem;
          text-align: center;
          text-decoration: underline;
          display: block;
          text-align: center;
          margin-top: .1rem;
      }
    }
    .choose{
        background: #fae4cd;
        padding: .15rem;
        border-radius: .1rem;
        margin-bottom:.3rem;
        img{width: 100%;}
        
    }
    
    .download{
        width: 100%;
    }
    .erweima{
        width: 100%;
        margin-top: .1rem;
        margin-bottom: .6rem
    }
}
</style>

