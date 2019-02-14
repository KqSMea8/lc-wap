<template>
  <app-layout id="helpRed2Myred" v-if="redRecord" :style="{'background':redRecord.backgroundColor}">
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
      <div class="red-box" v-if="content" :style="{'background-image':'url('+redRecord.redEnvelopeImg+')'}">
        <div class="share-btn" v-if="content.status==1">活动未开始</div>
        <div class="share-btn" v-else-if="content.status==2" @click="shareBtn">邀请好友<br/>开红包</div>
        <div class="share-btn" v-else-if="content.status==3">已满额</div>
        <div class="share-btn" v-else-if="content.status==4">活动结束</div>
        <div class="text-box" >
          <div v-if="['3','4'].includes(content.status)">请关注其他精彩活动</div>
          <div v-else>还有<span>{{content.unopenNumber}}</span>个红包待开</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="redlist-box">
        <ul class="nav">
          <li @click="isSelect=1" :class="isSelect==1?'sel':''"><div v-if="isSelect==1"></div>助力好友（{{content&&content.seedsAmount-content.unopenNumber}}人）</li>
          <li @click="isSelect=2" :class="isSelect==2?'sel':''"><div v-if="isSelect==2"></div>我的红包（{{content&&content.myEnvelopeAmount}}）</li>
        </ul>
        <section class="con1" v-if="isSelect==1&&content">
          <template v-if="content.seedsAmount>content.unopenNumber">
            <li v-for="(item,index) in content.redEnvelopeList" v-if="item.isOpen==1">
              <img :src="item.mbeImg||default_profile" alt="">
              <span class="nickname">{{item.nickname}}</span>
              <span class="num">{{item.randomAdj}}，<br/>帮你开了{{item.prizeValue}}{{item.prizeName}}</span>
            </li>
          </template>
          <div class="nodata" v-else>还没有助力红包，快去邀请好友助力吧！</div>
        </section>
        <section class="con2" v-if="isSelect==2&&content">
          <template  v-if="content.myEnvelopeList.length>0">
            <li v-for="(item,index) in content.myEnvelopeList">
              <div class="money">{{item.prizeValue}}</div>
              <div class="time">{{item.time}}{{item.getWay==1?'助力好友获得':'开红包获得'}}</div>
            </li>
          </template>
          
          <div class="nodata" v-else>还没有现金红包哦，快去助力好友吧！</div>
        </section>
      </div>
      <router-link to="/myCoupons/1?key=1">
        <div class="goredlist">查看我的红包 》</div>
      </router-link>
      
      <img class="voucher" src="/CRM/WeChat/App/static/img/helpRed2/lucky.jpg" alt="">
      <div class="img-btn">
        <div @click="imgbox=true">保存活动海报</div>
        <a href="http://enjoylecheng.mikecrm.com/wNGAf7m"><div>上传活动凭证</div></a>
      </div>
      <div class="img-box" v-if="!isLecheng">
        <img @click="linkUrl('car')" src="/CRM/WeChat/App/static/img/helpRed2/goods1.png" alt="">
        <img @click="linkUrl('integralMall')" src="/CRM/WeChat/App/static/img/helpRed2/goods2.png" style="float: right;" alt="">
      </div>
      <img v-if="!isLecheng" @click="linkUrl('mall')"  class="more-mall" src="~assets/img/helpRed2/button_mall_detail.png" alt="">
      
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
            <div v-html="article.articleContent||''"></div>
          </section>
        </div>
        <img src="~assets/img/helpRed2/icon_login_close.png"  class="btn" @click="rulebox=false">
      </div>
    </div>
    <div class="fixed-bg" @click.self="imgbox=false" :class="imgbox==true?'scale-red':''">
      <div class="fixed-box">
        <div class="big-img">
          <svg class="icon" aria-hidden="true" @click="imgbox=false">
            <use xlink:href="#icon-failure1"></use>
          </svg>
          <img src="/CRM/WeChat/App/static/img/helpRed2/poster.jpg" alt="">
          <p>长按保存图片</p>
        </div>
        
      </div>
    </div>
    <div class="share-bg" v-show="shareTip" @click="shareTip=false">
      <img src="/CRM/WeChat/App/static/img/helpRed2/pic_share.png">
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
      imgbox:false,
      seedsCon:{},
      isSelect:1,
      shareTip:false,
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
      isLecheng:isLecheng
    }
  },
  activated() {
    this.joinRecord()
    this.getData()
  },
  methods: {
    linkUrl(num) {
      if(!isLecheng){
        switch(num){
          case 'car':
            this.$router.push('/mall/carCategory/1');
            break;
          case 'mall':
            this.$router.push('/mall');
            break;
          case 'integralMall':
            this.$router.push('/integralMall');
            break;
        }
      }
    },
    async getData(){
      let d={
        content: {
          activityId: this.$route.params.aid,
          mbeId:this.$cache.user.memberId,
          // mbeId:1105057
        }
      };
      let res = await this.$post('/CRM/wechatRedEnvelope/myRedEnvelope.json',d);
      if(res.errcode==0){
        this.content=res.content;
        this.getArticle(res.content.detailRuleId)
        if (!isLecheng) {
          this.shareText()
        } 
      }
    },
    shareText(){
      var query = this.$route.fullPath.split('myRed')[1]
      let shareData = {
        share_title: this.content.shareTitle,
        share_desc: this.content.shareDesc,
        share_img: this.content.shareImg,
        share_url:`${location.origin}/wxwap?#/helpRed2/help${query}${query.includes('?')?'&':'?'}mbeId=${this.$cache.user.memberId}`
      }
      this.$utils.shareConfig(shareData,'call');
    },
    shareBtn(){
      if (isLecheng) {
        this.shareText()
      }else{
        this.shareTip=true
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
    
    takeRule(){
      this.rulebox=true
    },

  },
}
</script>
<style lang="scss">
  @import "~assets/css/var.scss";
  #helpRed2Myred{
    
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
    .share-bg{position: fixed;width: 100%; height: 100%;background:rgba(0,0,0,.7);left: 0;top: 0; z-index: 100;
      img{position: absolute;width: 3.75rem;height: 4rem;right: 0;top: 0;}
    }
    .fixed-bg{z-index: 100;position: fixed;width: 100%;height: 101%;top: 50%;left: 50%;background: rgba(0,0,0,.7);transform: translate(-50%,-50%) scale(0);transition:transform 0.2s;
      &.scale-red{
        transform: translate(-50%,-50%) scale(1);
      }
      .fixed-box{position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);
        .big-red{position: relative;width: 2.8rem;height: 3.08rem;background: url('/CRM/WeChat/App/static/img/helpRed2/bg_popup_open.png') no-repeat;background-size:100% 100%;
          .title{text-align: center;color: #f05e4f;font-weight: 600;padding: 0 .4rem;padding-top: .6rem;
            .title1{font-size: .18rem;margin-bottom: .06rem;}
            .title2{color: #b88154}
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
        .big-img{position: relative;
          .icon{background: #f05e4f;color: #ffdbbb;border-radius: 50%;width: .3rem;height: .3rem; position: absolute;right: -.12rem;top: -.12rem;border: 1px solid;}
          img{max-width: 2.8rem;max-height: 4.8rem;border-radius: .1rem;}
          p{color: #fff;margin-top: .05rem;text-align: center}
        }
      }
      .btn{ width: .3rem;margin-top: .2rem;position: relative;left: 50%;transform: translateX(-50%)}
    }
    .top{overflow-x:hidden;background-repeat: no-repeat;background-size: 100% 100%;width: 100%;height: 5.3rem;position: relative;
      .action-box{position: absolute; width: 96%;left: 2%;top: 0;
        .icon-action1{width: .4rem; position: relative;}
      }
      .rule-box{width: .62rem;height: .2rem;line-height: .2rem;text-align: center;position: absolute;right: 0;background:#fd7959;font-size: .11rem;color: #fff;top: .4rem;border-radius: .2rem 0 0 .2rem;border: .01rem solid #ffdbbb}
      .name-list{text-align:center;height: .2rem;line-height: .2rem;padding: 0 .12rem;background: rgba(0,0,0,.5);position: absolute;top: 1.62rem;left: .15rem;color: #fff;font-size: .12rem;border-radius: .2rem;}
      .title-box{background-repeat: no-repeat;background-size: 100% 100%;height:.29rem;width:2.405rem;position: absolute;top: 1.85rem;left: 50%;color: #f05e4f;transform: translateX(-50%);text-align: center;line-height: .29rem;    font-weight: 600;overflow: hidden;}
      .red-box{width: 2.775rem;height: 2.89rem;background-repeat: no-repeat;background-size: 100% 100%;position: absolute;bottom: 0;left: .485rem;
        .share-btn{background:url('~assets/img/helpRed2/button_object2.png') no-repeat;background-size: 100% 100%;position: absolute;width: 1rem;height: 1rem;left: 50%;transform: translateX(-50%);top: .4rem;text-align: center;color: #f05e4f;font-size: .18rem;@include box;@include flexAlign;@include flexJustify
        }
        .text-box{color: #ffdbbb;text-align:center;position:absolute;top:1.65rem;width:100%;
          span{font-size: .18rem;}
          
        }
        .receive{position: absolute;width: 2.22rem;height: .58rem;top: 1.83rem;left: 50%;transform: translateX(-50%);background:url('~assets/img/helpRed2/button_object1.png');background-repeat: no-repeat;background-size: 100% 100%;color: #f05e4f;font-size: .2rem;line-height: .58rem;text-align: center;font-weight: 600;animation: rotate-word .5s infinite linear ;}
        
        @keyframes rotate-word {
          0% {
            transform:translateX(-50%) rotate(0deg);
          }
          25% {
            transform:translateX(-50%) rotate(3deg);
          }
          50% {
            transform:translateX(-50%) rotate(0deg);
          }
          75% {
            transform:translateX(-50%) rotate(-3deg);
          }
          100% {
            transform:translateX(-50%) rotate(0deg);
          }
        }            
      }
    }
    .bottom{width: 3.4rem;margin-left:.175rem;
      .redlist-box{margin-top:.24rem;color:#b88154;
        .nav{background: #fff3e3;margin-bottom: 1px;height: .4rem;@include box;@include flexJustify;@include flexAlign;
          li{@include flex;text-align: center;height: 100%;line-height: .4rem;position: relative;
            &.sel{color:#f05e4f}
            div{height: .04rem;width: 100%;background: #f05e4f;position:absolute;top: 0;left:0}
          }
        }
        .con1{background: #fff3e3;padding:.2rem;max-height: 2.4rem;box-sizing:border-box;overflow: auto;
          li{width: 3rem;height: .6rem;margin-top: .1rem;background:#ffdbbb;border-radius:.1rem;padding:0 .12rem;box-sizing:border-box;color:#f05e4f;@include box;@include flexAlign;font-size:.12rem;
            &:first-child{margin-top: 0}
            img{width: .35rem;height: .35rem;border-radius: 50%;}
            .nickname{margin-left: .12rem;margin-right:.05rem;display: inline-block;width: .7rem;}
            .num{@include flex;@include txtOverflow;line-height: .18rem;}
          }
        }
        .con2{background: #fff3e3;padding:.2rem;max-height: 2.4rem;box-sizing:border-box;overflow: auto;
          li{background: url('~assets/img/helpRed2/coupon.png') no-repeat;background-size: 100% 100%;width: 3rem;height: .6rem;margin-top: .1rem;@include box;@include flexAlign;font-size:.12rem;text-align:center;
            &:first-child{margin-top: 0}
            .money{color: #ffdbbb;width: 1.2rem;font-size: .18rem;}
            .time{color: #f05e4f;@include flex;}
          }
        }
        .nodata{color: #b88154}
      }
      .goredlist{height: .45rem;line-height: .45rem;text-align: center;color: #f05e4f;font-size: .12rem;text-decoration: underline;}
      .voucher{width: 100%;}
      .img-btn{@include box;@include flexJustify(space-between);margin:.2rem 0;
        div{font-size: .16rem;height: .45rem;width: 1.6rem;background: url('~assets/img/helpRed2/button_object4.png') no-repeat;background-size: 100% 100%;line-height: .45rem;text-align: center;color: #ffdbbb}
      }
      .img-box{
        img{width: 1.67rem;}
      }
      .more-mall{width: 100%;margin: .2rem 0}
      .erweima{width: 100%;margin-bottom: .6rem}
    }
  }
</style>

