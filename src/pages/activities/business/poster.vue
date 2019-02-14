
<template>
  <app-layout id="helpRedPoster" >

    <div class="main">
      <div class="poster-main">
        <p class="title">方式1：分享海报<span>长按保存图片并复制文案转发</span></p>
        <div class="poster-box">
          <img :src="canvasimg" >
        </div>
        <div class="prompt">长按保存图片</div>
        <div class="copywriting" v-if="info">
          
          <p>【{{info.activityName}}】</p>
          <p>{{info.shareDesc}}</p>
          <p>活动链接：<a>{{smallUrl}}</a></p>
          
          
          <div class="copy-btn1 fuzhi" @click="copyWx" :data-clipboard-text="text">复制文案</div>
        </div>
      </div>

      <div class="poster-main">
        <p class="title">方式2：分享链接<span>直接分享活动链接</span></p>
        <ul class="share-box">
          <li @click="appShare">
            <img src="~assets/img/helpRed/icon_share_wechat_83.png" alt="">
            <p>微信好友</p>
          </li>
          <li @click="appShare">
            <img src="~assets/img/helpRed/icon_share_friend_83.png" alt="">
            <p>微信朋友圈</p>
          </li>
          <li class="fuzhi" @click="copyWx" :data-clipboard-text="smallUrl">
            <img src="~assets/img/helpRed/icon_share_copy_83.png" alt="">
            
            <p>复制链接</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="template" id="template" v-show="showTem">
      <div style="position:relative;width:100%">
        <img :src="info.posterImg" alt="" class="poster-bg" ref="posterbg"  >
        <div class="tag" v-if="info.service">
          <div :style="false ? {'background-image':'url('+info.service.imgUrl+')'}:{'background-image':'url('+defaultpture+')'}"  class="profile"></div>
          <div class="info">
            <div class="name" ><span>{{info.service.name}}</span>-{{info.service.foursName}}</div>
            <div class="tel">{{info.service.phone}}</div>
            <div>邀请你参加{{info.activityName}}</div>
            <img :src="info.service.brandIcon" alt="" class="fours">
          </div>
        </div>
        <div class="code-box">
          <div class="code">
            <canvas ref="qrCanvas" ></canvas>
            <p>长按二维码参与活动</p>
          </div>
        </div>
      </div>
    </div>

    <div class="share-bg" v-show="shareTip" @click="shareTip=false">
        <img src="/CRM/WeChat/App/static/img/helpRed/tip_share.png">
    </div>
    
  </app-layout>
</template>

<script>
import html2canvas from 'html2canvas';
import Clipboard from 'clipboard';
import QRCode from 'qrcode';
import jsonp from 'jsonp'
export default {
  data(){
    return{
      info:'',
      url:'',
      defaultpture:require('assets/img/carbinLift/defaultpture.png'),
      shareTip:false,
      canvasimg:'',
      showTem:true,
      mainBg:'',
      text:'',
      smallUrl:'',

    }
  },
  mounted(){
    this.getActivity();
  },
  activated(){
    
  },
  methods:{
    appShare(){
      let shareData = {
          share_title:this.info.activityName,
          share_desc:this.info.shareDesc,
          share_img:this.info.shareImg,
          share_url:this.info.linkUrl
      }
      this.$utils.shareConfig(shareData,'call');
    },
     getSmallUrl(url){

      let url_long='https://api.weibo.com/2/short_url/shorten.json?source=2849184197&url_long='+encodeURIComponent(url)
      jsonp(url_long,(err,data)=>{
          if(!err){
              this.smallUrl=data.data.urls[0].url_short
              this.text=`【${this.info.activityName}】\n${this.info.shareDesc}\n活动链接：${this.smallUrl}`
          }
      })
    },
    async getActivity() {
        let d={content: {
          id: this.$route.params.aid,
          workNumber: this.$route.query.wid,
          foursId:this.$route.query.fid
        }};

        let res=await this.$post('/CRM/appshop/queryShareDetail.json',d);
        if(res.errcode==0){
            this.getSmallUrl(res.content.linkUrl)
            this.info=res.content;

            let shareData = {
                share_title: res.content.activityName,
                share_desc: res.content.shareDesc,
                share_img: res.content.shareImg,
                share_url: res.content.linkUrl
            }
            this.$utils.shareConfig(shareData);
            this.$refs.posterbg.onload= (e)=>{
              e.stopPropagation();
              this.loadQR(res.content.linkUrl) 
            }
        }
    },
    loadQR(url){
      QRCode.toCanvas(this.$refs.qrCanvas, url,{width:135,height:135},  (error)=> {
        if (error) console.error(error)
        this.convert2canvas()
      })
    },
    copyWx () {
      let clipboard = new Clipboard('.fuzhi')
      clipboard.on('success', e => {
        // 释放内存
        this.$toast('复制成功')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.$toast('浏览器不支持自动复制，请手动复制')
        // 释放内存
        clipboard.destroy()
      })
    },
    
    
    convert2canvas() {
        // if(this.$refs.posterbg.complete){
          var shareContent = document.getElementById('template'); 
          var width = shareContent.offsetWidth; 
          var height = shareContent.offsetHeight; 

          var canvas = document.createElement("canvas"); 
          var context= canvas.getContext("2d"); 
          var devicePixelRatio = window.devicePixelRatio || 1;
          var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                                  context.mozBackingStorePixelRatio ||
                                  context.msBackingStorePixelRatio ||
                                  context.oBackingStorePixelRatio ||
                                  context.backingStorePixelRatio || 1;
          var scale = devicePixelRatio / backingStoreRatio; 

          canvas.width = width * scale; 
          canvas.height = height * scale; 
          context.scale(scale, scale); 

          var opts = {
              scale: scale, 
              canvas: canvas, 
              logging: false, 
              async:true,
              // allowTaint:true,
              useCORS:true,
              width: width, 
              height: height ,

          };

          html2canvas(shareContent, opts).then( (canvas)=> {
              
              var url = canvas.toDataURL()

              if(url=='data:,'){
                this.convert2canvas()
                return
              }
              this.canvasimg=url
              this.showTem=false
          })
        // }
    }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #helpRedPoster{
    background: #fff;
    .template{
      width: 100%;
      font-size: 0;
      position: absolute;
      z-index: -1;
      .poster-bg{
        width: 100%
      }
      .code-box{
        width: 100%;
        position: absolute;
        text-align: center;
        top: 4.5rem;
        left: 0rem;
      }
      .code{
        // padding: .08rem;
        //  top: 4.6rem;
        // left: 0rem;
        // right: 0rem;
        // margin: 0 auto;
        background: #fff;
        border-radius: .1rem;
        display: inline-block;
        // position: absolute;
       
        width: 135px;
        font-size: .12rem;
        text-align: center;
        canvas{
          border-radius: .1rem;
          z-index: 11;
        }
        p{
          position: relative;
          top: -.11rem;
        };
      }
      .tag{
        width: 3.59rem;
        height: .84rem;
        background:url('~assets/img/helpRed/title.png') no-repeat;
        background-size: 100% 100%;
        left: .08rem;
        top: .75rem;
        position: absolute;
        .profile{
          position: absolute;
          width: .4rem;
          height: .4rem;
          top: .2rem;
          left: 1.05rem;
          margin-left: -.23rem;
          border-radius: 50%;
            background-size: cover;
            background-position: center;
        }
        .info{
          position: relative;
          font-size: .12rem;
          color: #88888d;
          @include box(nowrap);
          @include flexDir(column);
          @include flexJustify(space-around);
          margin-left: 1.45rem;
          height: 100%;
          padding: .06rem 0;
          box-sizing: border-box;
          padding-right: .5rem;
          span{
            color: #22222d;
            font-size: .15rem;
            vertical-align: middle;
            margin-right: .01rem;
          }
          .fours{
            width: .35rem;
            height: .35rem;
            position: absolute;
            right: .12rem;
            top: .08rem;
          }
        }
      }
    }
    .main{
      background: #fff;
      padding: 0 5%;
      width: 90%;
      min-height: 100%;
    }
    .share-bg{
        position: fixed;
        width: 100%;
        height: 100%;
        background:rgba(0,0,0,.7);
        left: 0;
        top: 0;
        z-index: 100;
        img{
            position: absolute;
            width: 2.05rem;
            height: 1.55rem;
            right: .45rem;
            top: .15rem;
        }
    }
    .poster-main{
      .title{color: #22222d;font-size: .15rem;line-height:.4rem;
        span{color: #88888d;font-size: .12rem;margin-left: .2rem;}
      }
      .poster-box{
        width: 1.875rem;
        // height: 3.335rem;
        margin: 0 auto;
        img{
          height: 100%;
          width: 100%;
        }
      }
      .prompt{
        text-align: center;
        font-size: .12rem;
        color: #88888d;
        margin-top: .1rem;
      }
      .copywriting{
        user-select:text !important;
        .copytext{
          user-select:text !important;
        }
        
        margin: .15rem 0;
        width: 100%;
        background: #f2f2f2;
        padding: .1rem;
        box-sizing: border-box;
        font-size: .12rem;
        p{
          color: #22222d;
          line-height: .18rem;
          a{
            color: #0064ff
          }
        }
        .copy-btn1{
          user-select:none !important;
          color: #e94816;
          text-align: right;
          margin-top: .1rem;
        }
      }
      .share-box{
        @include box;
          @include flexJustify(space-around);
        padding-bottom: .25rem;
        li{
          font-size: .12rem;
          color: #88888d;
          text-align: center;
          img{
            width: .4rem;
            height: .4rem;
          }

        }
      }
    }
  }
</style>

