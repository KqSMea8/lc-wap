<template>
  <app-layout id="helpRed2" v-if="redRecord" :style="{'background':redRecord.backgroundColor}">
    <div class="top" :style="{'background-image':'url('+redRecord.mainImg+')'}">
      <div class="action-box">
        <img :src="redRecord.topAnimation" class="icon-action1">
        <img :src="redRecord.topAnimation" class="icon-action1 fr">
      </div>
      <div class="rule-box" @click="takeRule">活动规则</div>
      <swiper class='name-list' :options="nameSwiper" v-if="redRecord.recordList&&redRecord.recordList.length>0">
        <swiper-slide v-for="(item,idnex) in redRecord.recordList">{{item.memberName}}领取{{item.prizeName}}</swiper-slide>
      </swiper>
      <swiper class='title-box' :options="titleSwiper" :style="{'background-image':'url('+redRecord.mainAnimation+')'}">
        <swiper-slide v-for="(item,idnex) in redRecord.activityTips">{{item}}</swiper-slide>
      </swiper>
      <div class="red-box" :style="{'background-image':'url('+redRecord.redEnvelopeImg+')'}">
        <div class="text-box" v-if="content">
          <p>送您{{content.seedsAmount}}个{{content.seedsName}}</p>
          <div>{{content.openDesc}}</div>
        </div>
        <div class="receive" @click="takeRed">立即领取</div>
      </div>
    </div>
    <div class="bottom">
      <img class="erweima" src="/CRM/WeChat/App/static/img/helpRed2/erweima.png" alt="">
    </div>
    
    <div class="fixed-bg" :class="redbox==true?'scale-red':''">
      <div class="fixed-box" >
        <div class="big-red">
          <div class="icon-box">
            <img :src="seedsCon.img||default_profile" alt="">
          </div>
          <div class="title">
            <p class="title1">{{seedsCon.resultPref}}</p>
            <div class="title2">恭喜你获得<span>{{seedsCon.prizeValue&&seedsCon.prizeValue.split(' ')[0]}}</span>{{seedsCon.prizeValue&&seedsCon.prizeValue.split(' ')[1]}}</div>
            <div class="title2">{{seedsCon.resultDesc}}</div>
          </div>
          <router-link :to="'/helpRed2/myRed'+$route.fullPath.split('helpRed2')[1]">
            <div class="nextbtn">进入我的红包</div>
          </router-link>
        </div>
        
      </div> 
    </div>

    <div class="fixed-bg" :class="rulebox==true?'scale-red':''">
      <div class="fixed-box">
        <div class="big-rule">
          <section class="content">
            <img class="title" src="~assets/img/helpRed2/rule_title.png" >
            <div  v-html="article.articleContent||''"></div>
          </section>
        </div>
        <img src="~assets/img/helpRed2/icon_login_close.png"  class="btn" @click="rulebox=false">
      </div>
    </div>
  </app-layout>
</template>
<script>
export default {
  data() {
    return {
      default_profile: require('assets/img/default_user.png'),
      content:null,
      redRecord:null,
      article:'',
      redbox:false,
      rulebox:false,
      seedsCon:{},
      nameSwiper: {
        notNextTick: true,
        direction: 'vertical',
        slidesPerView: 1,
        autoplay: 2000,
        speed: 2000,
        loop: true
      },
      titleSwiper: {
        notNextTick: true,
        direction: 'vertical',
        slidesPerView: 1,
        autoplay: 2000,
        speed: 2000,
        loop: true
      },
    }
  },
  activated() {
    this.joinRecord()
    this.getData()
  },
  methods: {
    async getData(){
      let d={
        content: {
          activityId: this.$route.params.aid,
          mbeId:this.$cache.user.memberId||'',
          recordSize:'',
        }
      };
      let res = await this.$post('/CRM/wechatRedEnvelope/getHomePageInfo.json',d);
      if(res.errcode==0){
        if(res.content.todayGetSeeds==1){
          this.$cache.history.pop();
          var query = this.$route.fullPath.split('helpRed2')[1]
          this.$router.replace('/helpRed2/myRed'+query)
          return
        }
        this.content=res.content;
        this.getArticle(res.content.detailRuleId)
        this.$utils.setAppTitle(this.content.activityTitle);
        let shareData = {
          share_title: this.content.shareTitle,
          share_desc: this.content.shareDesc,
          share_img: this.content.shareImg,
          share_url: location.origin+'/wxwap?#'+this.$route.fullPath
        }
        this.$utils.shareConfig(shareData);
      }
    },
    async joinRecord(){
      let d={
        content: {
          activityId: this.$route.params.aid,
          recordSize:'',
        }
      };
      let res = await this.$post('/CRM/wechatRedEnvelope/joinRecord.json',d);
      if(res.errcode==0){
        this.redRecord = res.content;
      }
      
    },
    async getArticle(id) {
      let data={content: {
          id: id
      }};
      let res=await this.$post('/CRM/apparticle/queryArticleDetail.json',data);
      if(res.errcode==0){
          let con=res.content;
          con.articleContent=con.articleContent.replace(/data-src/g,'src');
          this.article=res.content;
      }
    },
    takeRed(){
      
      this.$login(async ()=>{
        if(this.content.status==1){
          this.$toast('活动未开始')
        }else if(this.content.status==3){
          this.$toast('活动已满额')
        }else if(this.content.status==4){
          this.$toast('活动已结束')
        }else if(this.content.status==2){
          let d={
            content: {
              activityId: this.$route.params.aid,
              mbeId:this.$cache.user.memberId,
              userId:this.$route.query.sid||'',
              shareId:this.$route.query.osid||'',
              foursId:this.$route.query.fid||''
            }
          };
          let res = await this.$post('/CRM/wechatRedEnvelope/getSeeds.json',d);
          if(res.errcode==0){
            this.seedsCon=res.content;
            this.redbox=true
          }else{
            this.$toast(res.msg)
          }
        }
      },this.$route);
    },
    takeRule(){
      this.rulebox=true
    }
  },
}
</script>
<style lang="scss">
  @import "~assets/css/var.scss";
  #helpRed2{
    section::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      -webkit-border-radius: 20px;
    }

    section::-webkit-scrollbar-thumb {
      background: #f05e4f;
      -webkit-border-radius: 20px;
    }
    section::-webkit-scrollbar-track {
      background: #ffc799;
    }
    .fixed-bg{z-index: 100;position: fixed;width: 100%;height: 101%;top: 50%;left: 50%;background: rgba(0,0,0,.7);transform: translate(-50%,-50%) scale(0);transition:transform 0.2s;
      &.scale-red{
        transform: translate(-50%,-50%) scale(1);
      }
      .fixed-box{position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);
        .big-red{position: relative;width: 2.8rem;height: 3.08rem;background: url('/CRM/WeChat/App/static/img/helpRed2/bg_popup_open.png') no-repeat;background-size:100% 100%;
          .title{text-align: center;color: #f05e4f;font-weight: 600;padding: 0 .4rem;padding-top: .6rem;
            .title1{font-size: .18rem;margin-bottom: .05rem;}
            .title2{
              span{color:#f05e4f;font-size: .2rem}
              color: #b88154}
          }
          .icon-box{text-align: center;position: absolute;left: 50%;top: .012rem;transform: translateX(-49%);
            img{width: .45rem;height: .45rem;border-radius: 50%;}
            p{color: #fff;font-size: .13rem;}
          }
          .nextbtn{position: absolute;width: 2.22rem;height: .58rem;bottom: .5rem;left: 50%;transform: translateX(-50%);background:url('~assets/img/helpRed2/button_object1.png');background-repeat: no-repeat;background-size: 100% 100%;color: #f05e4f;font-size: .18rem;line-height: .58rem;text-align: center;font-weight: 600;}
        }
        .big-rule{position: relative;width: 3.25rem;height: 4.5rem;background: url('~assets/img/helpRed2/rule_pop.png') no-repeat;background-size:100% 100%;overflow: hidden;padding:.25rem .13rem;box-sizing: border-box;
          .title{width: .94rem;position: relative;left: 50%;transform: translateX(-50%);margin-bottom:.1rem}
          
          .content{box-sizing: border-box;overflow:auto;height:100%;padding: 0 .1rem;
            img{max-width: 100%;}
          }
        }
      }
      .btn{ width: .3rem;margin-top: .2rem;position: relative;left: 50%;transform: translateX(-50%)}
    }
    .bottom{width: 100%;padding:0 .175rem;box-sizing:border-box;
      .erweima{width: 100%;margin-top: .2rem;margin-bottom: .6rem;}
    }
    
    .top{overflow-x:hidden;background-repeat: no-repeat;background-size: 100% 100%;width: 100%;height: 5.3rem;position: relative;
      .action-box{position: absolute; width: 96%;left: 2%;top: 0;
        .icon-action1{width: .4rem; position: relative;}
      }
      .rule-box{width: .62rem;height: .2rem;line-height: .2rem;text-align: center;position: absolute;right: 0;background:#fd7959;font-size: .11rem;color: #fff;top: .4rem;border-radius: .2rem 0 0 .2rem;border: .01rem solid #ffdbbb}
      .name-list{text-align:center;height: .2rem;line-height: .2rem;padding: 0 .12rem;background: rgba(0,0,0,.5);position: absolute;top: 1.62rem;left: .15rem;color: #fff;font-size: .12rem;border-radius: .2rem;}
      .title-box{background-repeat: no-repeat;background-size: 100% 100%;height:.29rem;width:2.405rem;position: absolute;top: 1.85rem;left: 50%;color: #f05e4f;transform: translateX(-50%);text-align: center;line-height: .29rem;    font-weight: 600;overflow: hidden;}
      .red-box{width: 2.775rem;height: 2.89rem;background-repeat: no-repeat;background-size: 100% 100%;position: absolute;bottom: 0;left: .485rem;
        .text-box{color: #ffdbbb;text-align:center;position:absolute;top:1.15rem;width:100%;
          p{font-size: .17rem;margin-bottom:.03rem;}
          div{font-size: .12rem;}
        }
        .receive{position: absolute;width: 2.22rem;height: .58rem;top: 1.83rem;left: 50%;transform: translateX(-50%);background:url('~assets/img/helpRed2/button_object1.png');background-repeat: no-repeat;background-size: 100% 100%;color: #f05e4f;font-size: .2rem;line-height: .58rem;text-align: center;font-weight: 600;animation: rotate-word 2s infinite linear ;}
        
        @keyframes rotate-word {
            0% {
                transform:translateX(-50%) scale(1);
            }
            3% {
                transform:translateX(-50%) scale(0.8);
            }
            6% {
                transform:translateX(-50%) scale(1);
            }
            24% {
                transform:translateX(-50%) scale(1);
            }
            26% {
                transform:translateX(-50%) rotate(-3deg);
            }
            28% {
                transform:translateX(-50%) rotate(0deg);
            }
            30% {
                transform:translateX(-50%) rotate(3deg);
            }
            32% {
                transform:translateX(-50%) rotate(0deg);
            }
            34% {
                transform:translateX(-50%) rotate(-3deg);
            }
            36% {
                transform:translateX(-50%) rotate(0deg);
            }
            38% {
                transform:translateX(-50%) rotate(3deg);
            }
            40% {
                transform:translateX(-50%) rotate(0deg);
            }
            100% {
                transform:translateX(-50%) rotate(0deg);
            }
        }           
      }
    }
  }
</style>

