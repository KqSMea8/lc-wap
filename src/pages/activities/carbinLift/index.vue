<template>
  <app-layout id="carbinLift">
    <div>
      <div class="main-bg">
        <div class="info" v-if="activity.consultantInfo">
          <div :style="activity.consultantInfo.headSculpture ? {'background-image':'url('+activity.consultantInfo.headSculpture+')'}:{'background-image':'url('+defaultpture+')'}"  class="profile"></div>

          <h1 style="padding-left: .2rem;">专属顾问<span style="margin: 0 .1rem ">{{activity.consultantInfo.name}}</span><a :href="`tel:${activity.consultantInfo.mobilePhone}`"><img class="phone" src="~assets/img/carbinLift/button_phone.png" alt=""></a></h1>
          <h2>送给您一份升舱大礼包</h2>
          <div class="banner">
              <img :src="activity.img">
          </div>
          <h1>{{activity.name}}</h1>
          <h2 style="font-size:.13rem;">领券时间：{{activity.startTime}}至{{activity.endTime}}</h2>

          <ul class="coupon-main">
            <li  v-for="(item,index) in content">
                <div class="left">
                    <img src="/CRM/WeChat/App/static/img/carbinLift/coupon1.png" v-if="index==0" alt="">
                    <img src="/CRM/WeChat/App/static/img/carbinLift/coupon2.png" v-if="index==1" alt="">
                    <img src="/CRM/WeChat/App/static/img/carbinLift/coupon3.png" v-if="index==2" alt="">
                    <img src="/CRM/WeChat/App/static/img/carbinLift/coupon4.png" v-if="index==3" alt="">
                </div>
                <div  class="right yellow">

                    <div class="time" v-if="item.cansend_start_time>nowtime">
                        <p>距离开抢还剩</p>
                        <div class="surplus-box yellow">
                            <div class="surplus">{{$countDown((item.cansend_start_time-nowtime)*1000)[0]}}</div>
                            <span class="point">:</span>
                            <div class="surplus">{{$countDown((item.cansend_start_time-nowtime)*1000)[1]}}</div>
                            <span class="point">:</span>
                            <div class="surplus">{{$countDown((item.cansend_start_time-nowtime)*1000)[2]}}</div>
                        </div>
                        
                    </div>

                    <img src="~assets/img/coupon/icon_coupon_get.png" alt="" v-else-if="item.userlimit_quantity<=item.hasgetnum||(item.hasgetnum>0&&item.send_couponcode_quantity>=item.max_gen_quantity&&item.userlimit_quantity>item.hasgetnum)">

                    <img src="~assets/img/coupon/icon_coupon_empty.png" alt="" v-else-if="item.send_couponcode_quantity>=item.max_gen_quantity">

                    <div class="time"  v-show="item.userlimit_quantity>item.hasgetnum&&item.send_couponcode_quantity<item.max_gen_quantity&&item.cansend_start_time<=nowtime">
                        <div class="canvas-box" >
                            <canvas  class="canvas" :width="canvasWid" :height="canvasWid" :num="parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)==0?Math.ceil((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100):parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)"></canvas>
                            <div class="canvas-circle yellow" >
                                <div class="text-box">
                                    <div>剩余</div>
                                    <div>{{parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)}}%</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>


                    <div class="btn" v-if="item.userlimit_quantity<=item.hasgetnum||(item.hasgetnum>0&&item.send_couponcode_quantity>=item.max_gen_quantity&&item.userlimit_quantity>item.hasgetnum)"  @click="use">点击查看</div>
                    <div class="btn" v-else-if="item.max_gen_quantity>item.send_couponcode_quantity" @click="receive(index,item.id,item.hasgetnum,item.send_couponcode_quantity)">立即领取</div>
                    
                </div>
            </li>

            
          </ul>
          
        </div>
      </div>
      <div class="page-center">
        <div class="explain">
          <div class="title">活动说明</div>
            <p><em>1</em><span>点击“立即领取”按钮后，即可领取升舱现金券，在盈众汽车集团指定门店置换新车时，出示券码符合要求即可享受优惠政策；</span></p>
            <p><em>2</em><span>在盈众乐橙汇APP-我的卡券中，可查看已领取的优惠券，本券需在有效期内使用，过期无效；</span></p>
            <p><em>3</em><span>该升舱现金券为线下使用券，请按券详细说明中指定门店消费使用，详询店面工作人员；</span></p>
            <p><em>4</em><span>持券人需妥善保管自己的现金券，不可向他人转让、出售、透漏券码或券码信息，因此产生的风险及损失由持券人自行承担；</span></p>
            <p><em>5</em><span>获取或使用优惠券时存在违规行为，将取消用户领取资格、撤销违规交易且收回全部优惠券，必须时追究法律责任。</span></p>
        </div>
        <img src="/CRM/WeChat/App/static/img/carbinLift/bg_center.png"   class="bg-center">
      </div>
      <div class="page-bottom">
        <img src="~assets/img/carbinLift/tip_car.png" class="title-tip">
        <ul>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car1.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car2.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car3.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car4.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car5.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car6.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car7.jpg" alt=""></li>
          <li><img src="/CRM/WeChat/App/static/img/carbinLift/pic_car8.jpg" alt=""></li>
        </ul>
      </div>
      <div class="footer"></div>
    </div>
  </app-layout>
</template>
<script>
  export default {
    data(){
      return{
        defaultpture:require('assets/img/carbinLift/defaultpture.png'),
        content:[],
        activity:{},
        nowtime:null,
        cleartime:'',
        canvasHtml:'',
        canvasWid:parseInt(document.documentElement.clientWidth/375*48),
        couponArr:['aafbfd6d63635932016401617f227ca0','aafbfd6d636359320164016378537cac','aafbfd6d6363593201640172a07f7cce','aafbfd6d6363593201640174f1eb7cda'],//正式
        // couponArr:['ff808081640138590164020ce8db0049','ff808081640138590164024e487d0083','ff808081640138590164020ce8db0049','ff808081640138590164020ce8db0049'], //测试
   
       
      }
    },
    activated(){
        if(this.content.length==0){
            this.getActivity()
            this.getCoupon()
        }
        
        clearInterval(this.cleartime)
        this.cleartime=setInterval(()=>{  

            this.nowtime=this.nowtime+1
        },1000)
    },
    beforeRouteLeave (to, from, next) {
        if(/myCoupons/.test(to.path)){
            next();
        }else{
            this.resetPage();
            next();
        }
    },
    deactivated(){

        clearInterval(this.cleartime)
    },
    methods:{
      
      resetPage(){
        this.content=[]
        this.activity={}
      },
      use(){
          this.$router.push('/myCoupons/1?key=2')
      },
      loadCanvas(){
          CanvasRenderingContext2D.prototype.sector = function(x, y, radius, sDeg, eDeg) {
              this.save()
              this.beginPath();
              this.moveTo(x, y);
              this.arc(x, y, radius, sDeg, eDeg, false);
              this.closePath();
              this.restore();
              return this;
          }

          var canvasArr = document.querySelectorAll('.canvas');
          for(let i=0;i<canvasArr.length;i++){
              var num=canvasArr[i].getAttribute('num')/100
              var ctx = canvasArr[i].getContext('2d');
              ctx.clearRect(0, 0, this.canvasWid, this.canvasWid);
              ctx.fillStyle = 'rgba(0,0,0,0.2)';
              ctx.sector(this.canvasWid/2, this.canvasWid/2, this.canvasWid/2, 0, Math.PI / 180 * 84 * 3.6).fill();
              ctx.fillStyle = '#ffffff';
              ctx.sector(this.canvasWid/2, this.canvasWid/2, this.canvasWid/2, 0, Math.PI / 180 * 84* num * 3.6).fill();
          }
      },
      async getActivity() {
          let d={content: {
              id: this.$route.query.aid,
              consultantId: this.$route.query.sid
              }};

          let res=await this.$post('/CRM/wechatautoshow/autoShowDetail.json',d);
          if(res.errcode==0){
              this.activity=res.content;
              
            let shareData = {
                share_title: res.content.name,
                share_desc: res.content.description,
                share_img: res.content.shareImg,
                share_url: location.origin+'/wxwap?#'+this.$route.fullPath
            }
            this.$utils.shareConfig(shareData);
          }
      },
      async getCoupon(){
          let memid=localStorage.getItem('memberId');
          for(let i=0;i<4;i++){
            let d={
                content: {
                    schemeId:this.couponArr[i],
                    type:2,
                    memberId:memid||''
                }
            };
            let res = await this.$post('/couponSys/appcoupon/detail.json',d);
            if(res.errcode==0){
                this.nowtime=Number(res.time)-1;
                if(!memid){
                    res.content.hasgetnum=0
                }
                this.content.push(res.content);
                setTimeout(()=>{
                    this.$nextTick(()=>{
                        this.loadCanvas()
                    })
                },10)
                
                
            }else{
                this.$toast(res.msg)
            }
          }
          
      },
      async getMember(id){
          let d={
                content: {
                    staffId:this.$route.query.sid,
                    couponId:id,
                    mbeId:this.$cache.user.memberId
                }
            };
            let res = await this.$post('/CRM/wechatActivity/memberGetCoupon.json',d);
      },
        async receive(index,id,hasgetnum,couponcode){
            this.$login(async ()=>{
                localStorage.setItem('memberId',this.$cache.user.memberId)
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        id:id
                    }
                };
                let  res = await this.$post('/couponSys/appcoupon/receive.json',d);
                
                
                if(res.errcode==0){
                    this.getMember(id)
                    this.content[index].hasgetnum=++hasgetnum;
                    this.content[index].send_couponcode_quantity=++couponcode;
                    setTimeout(()=>{
                        this.$nextTick(()=>{
                            this.loadCanvas()
                        })
                    },10)
                    this.$toast('领取成功')
                }else if(res.errcode==2){
                    if(res.msg=='该券已过期'&&this.content[index].hasgetnum==0){
                        this.content[index].send_couponcode_quantity=this.content[index].max_gen_quantity;
                    }else{
                        this.content[index].hasgetnum=this.content[index].userlimit_quantity;
                    }
                    
                    this.$toast(res.msg)
                }else{
                    this.$toast(res.msg)
                    
                }
            })        
            
            
        },
      
        
    }
  }
</script>
<style lang="scss">
  @import "~assets/css/var.scss";
  #carbinLift{
    .canvas-box{
        width: .48rem;
        height: .48rem;
        border-radius: 50%;
        position: relative;
        overflow: hidden;
        .canvas{
            z-index: 2;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: .48rem;
            height: .48rem;
            margin: auto;
            transform: rotate(120deg);
        }
        .canvas-circle{
            font-size: .12rem;
            text-align: center;
            color: #fff;
            z-index: 3;
            width:.42rem;
            height: .42rem;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            border-radius: 50%;
            .text-box{
                margin-top: .05rem
            }
            &.blue{
                background: #44aae5;
            }
            &.yellow{
                background: #f29600
            }
        }
    }
    .main-bg{
      background:url('/CRM/WeChat/App/static/img/recommendBuyers/bg_oldfriends.png') no-repeat 0 -.2rem,
                linear-gradient(to bottom,#ffa230 0%,#ff5130 100%);
      background-size:100% ;
     padding:1.1rem .2rem .15rem;
      .info{
        color: #22222d;
        text-align: center;
        background: #fff;
        border-radius: 10px;
        padding: .3rem 0rem .15rem;
        position: relative;
        // line-height: .2rem;
        .phone{
          width: .21rem;
          height: .21rem;
          vertical-align: middle;
        }
        .profile{
          position: absolute;
          width: .46rem;
          height: .46rem;
          top: -.23rem;
          left: 50%;
          margin-left: -.23rem;
          border-radius: 50%;
            background-size: cover;
            background-position: center;
        }
        h2{
          color: #88888d;
          margin-top: .05rem;
        }
        .banner{position: relative;margin:.3rem .15rem .1rem;
           &:before{content:'';position:absolute;top:-.26rem;left:50%;margin-left:-.635rem;z-index:2;width:1.27rem;height:.565rem;background:url('/CRM/WeChat/App/static/img/recommendBuyers/icon_banner_gift.png') no-repeat center;background-size:100%;}
                    img{width:100%;height:100%;}
        }
        .coupon-main{
          background:#efeff0;
          padding:.1rem .15rem;
          margin-top: .1rem;
          li{
                width: 100%;
                height: .9rem;
                background: #fff;
                border-radius: 4px;
                @include box;
                margin-bottom: .1rem;
                .left{
                  width: 2.26rem;
                  height: .9rem;
                    img{
                      height: 100%;
                      width: 100%;
                    }
                }
                .right{
                    text-align: center;
                    width: .85rem;
                    height: 100%;
                    text-align: center;
                    @include box;
                    @include flexJustify;
                    @include flexAlign;
                    @include flexDir(column);
                    &.blue{
                        background: url('~assets/img/coupon/background_coupon_shopping_right.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.yellow{
                        background: url('~assets/img/coupon/background_coupon_shopping_right_yellow.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    .time{
                        position: relative;
                        color: #fff;
                        text-align: center;
                        .surplus-box{
                            @include box;
                            @include flexJustify;
                            &.blue{
                                    color: #44aae5;
                            }
                            &.yellow{
                                color: #e94816;
                            }
                            .surplus{
                                width: .16rem;
                                height: .16rem;
                                background: #fff;
                                line-height: .16rem;
                                text-align: center;
                                font-weight: 600;
                            }
                            .point{
                                margin: 0 .05rem;
                                color: #fff;
                            }
                        }
                        p{
                            font-size: .13rem;
                            margin-bottom: .08rem;
                        }
                        .progress{
                            width: .65rem;
                            height: .05rem;
                            background: rgba(0,0,0,.15);
                            border-radius: .05rem;
                            margin-top: .08rem;
                            position: relative;
                            div{
                                position: absolute;
                                left: 0;
                                top: 0;
                                border-radius: .05rem;
                                width: 80%;
                                height: 100%;
                                background: #fff;
                            }
                        }
                    }
                    img{
                        width: .48rem;
                        height: .48rem;
                        text-align: center;
                        // margin-top: .1rem;
                    }
                    .btn{
                        
                        height: .2rem;
                        line-height: .2rem;
                        padding: 0 .08rem;
                        display: inline-block;
                        border:1px solid #fff;
                        border-radius: .2rem;
                        text-align: center;
                        color: #fff;
                        margin-top: .06rem;
                        font-size: .12rem;
                    }
                }
            }
        }
        
      }
    }
    .page-center{
        background: #fff;
        padding: .3rem .2rem .15rem;
        .explain{
            font-size: .12rem;
            text-align: left;
            position: relative;
            width: 100%;
            border:1px solid #565658;
            box-sizing: border-box;
            border-radius: 10px;
            padding: .2rem .13rem .1rem;
            .title{
                font-weight: 500;
                color: #fff;
                font-size: .15rem;
                width: 1.8rem;
                height: .25rem;
                line-height: .25rem;
                border-radius: .23rem;
                text-align: center;
                background: #e83a18;
                position: absolute;
                left: 50%;
                top: -.13rem;
                transform: translateX(-50%);
            }
            p{
                line-height: .2rem;
                margin-bottom: .02rem;
                @include box;
                em{
                  font-style: normal;
                  background: #e83a18;
                  width: .15rem;
                  height: .15rem;
                  color: #fff;
                  text-align: center;
                  line-height: .15rem;
                  border-radius: 50%;
                  margin-right: .08rem;
                  position: relative;
                  top: .01rem;
                }
                span{@include flex;}

            }
          }
        }
        .bg-center{width: 100%;margin:.1rem 0}
    .page-bottom{
      padding-bottom: .1rem;
      background: #f99d2e;
      text-align: center;
      .title-tip{
        width: 1.78rem;
        margin: .15rem auto;
      }
      ul{
        width: 3.55rem;
        margin-left: .1rem;
        li{
          margin-bottom: .1rem;
          width: 100%;
          height: 2rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .footer{
      width: 100%;
      height: 2rem;
      background: url('/CRM/WeChat/App/static/img/carbinLift/pic_logo.jpg') no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
