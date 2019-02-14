<template>
  <app-layout id="storeDetail">
    <div class="detail-fixed" v-show="pageData.myService">
      <template v-if="pageData.myService">
        <div class="nickname">
            <div class="head"  :style="pageData.myService.imgUrl ? {'background-image':'url('+pageData.myService.imgUrl+')'} : {'background-image':'url('+serverProfile+')'}"></div>
        </div>
        
        <div class="name" >
            <p>{{pageData.myService.name}}</p>
            <lc-rate disabled v-model="pageData.myService.star"></lc-rate><span>{{pageData.myService.orders}}单</span>
        </div>
        <div class="btn" @click="goServerDetail(pageData.myService.id,pageData.myService.name)">找他服务</div>
      </template>
    </div>
    <div class="bannerSwiper">
      <template v-if="pageData['4sImgUrl']">
        <swiper :options="bannerSwiperOption" ref="bannerSwiper">
          <swiper-slide v-for="(img,index) in pageData['4sImgUrl']">
              <img :src="img" :data-src="index>1&&img" :class="index>1&&'swiper-lazy'">
          </swiper-slide>
        </swiper>
        <div class="pagination">{{activeIndex}}/{{pageData['4sImgUrl'].length}}</div>
      </template>
    </div>

    <div class="store">
        <h1>
          {{pageData['4sStoreName']}}
          <div :class="{on:intro}" @click="intro=!intro">简介</div>
        </h1>
        <p class="intro" v-show="intro">{{pageData['4sStoreDescribe']}}</p>
        <div class="brands">
            <img v-for="item in pageData['4SBrandList']" :src="item.brandIcon">
        </div>
        <lc-rate disabled v-model="pageData.compScore"></lc-rate>
        <a :href="'tel:'+pageData['4sStorePhone']"></a>
    </div>

    <router-link class="part addr clearfix" :to="'/map?lat='+pageData['4sStoreDimension']+'&lng='+pageData['4sStoreLongitude']"><p>{{pageData['4sStoreAddr']}}</p><span>{{distance}}</span></router-link>
    <div class="part" v-if="pageData.newsFlash&&pageData.newsFlash.length>0">
      <h1 class="title showflex new-flash">
        <div class="title-pic"><img src="~assets/img/fours/tip_4s_news.png" alt=""></div>
        <swiper class='news' :options="newsSwiper" ref="news">
          
          <swiper-slide v-for="(item,index) in pageData.newsFlash">
            <router-link :to="`/hotarticle/${item.id}`" >{{item.title}}</router-link>
          </swiper-slide>

        </swiper>
        <router-link :to="`/stores/newslist/${$route.params.id}`"  class="arrow" style="text-indent:0">
          <div style="top:0;right:0;line-height:.45rem;">更多</div>
        </router-link>
      </h1>
    </div>
    <div class="part welfare"  v-if="welfareList.length>0">
        <h1 class="title">会员福利</h1>
        <swiper :options="welfareSwiperOption"  ref="welfareSwiper">
          <swiper-slide v-for="(item,index) in welfareList">
            <div class="welfare-box">
              <div class="left">
                <p :style="item.isShowAmt==2?'margin:.13rem 0':''">{{item.couponName}}</p>
                <div class="money" v-if="item.isShowAmt!=2">￥<span>{{item.deductMoney}}</span></div>
                <div class="condition">{{item.condition}}</div>
              </div>
              <div class="right">
                
                <img v-if="item.userlimitQuantity<=item.hasGetNum" src="~assets/img/fours/icon_4s_coupons_get.png" alt="">
                <router-link tag="div" class="see" v-if="item.userlimitQuantity<=item.hasGetNum" to="/myCoupons/1">查看</router-link>
                <img v-else-if="item.sendCouponcodeQuantity>=item.maxGenQuantity" src="~assets/img/fours/icon_4s_coupons_empty.png" alt="">
                <div class="btn" v-else @click="receiveWelfare(index,item.couponId,item.hasGetNum,item.sendCouponcodeQuantity,item.couponType)">领取</div>
              </div>
            </div>
          </swiper-slide>
          
        </swiper>
    </div>
    <div class="part">
        <h1 class="title">车主活动</h1>

        <template v-if="acts.length>0">
            <a :href="item.linkUrl" class="act" v-for="(item,index) in acts" v-show="index<3||showMoreActs">
                <img :src="item.imgUrl">
                <h2>{{item.title}}</h2>
                <label class="red" v-if="item.superscript">{{item.superscript}}</label>
                <label class="orange">{{item.typeName.split(',')[0]}}</label>
                <label class="orange">{{item.typeName.split(',')[1]}}</label>
                <label class="orange"  v-if="!item.superscript">{{item.typeName.split(',')[2]}}</label>
                <p class="time">{{item.startTime+'至'+item.endTime}}</p>
                <p class="area">{{item.areaName}}</p>
            </a>
            <div v-if="acts.length>3" :class="{more:true,on:showMoreActs}" @click="showMoreActs=!showMoreActs">{{showMoreActs?'收起':'展开'}}</div>
        </template>

        <div style="padding:.2rem 0;text-align:center;font-size:.12rem;color:gray;" v-else>活动正在筹备中，请持续关注我们哦~</div>
        
    </div>

    <div class="part" v-if="mallData.list_car&&mallData.list_car.length>0">
        <h1 class="title">全部车型 <span style="margin-left:.1rem;font-size:.12rem;color:gray;">共{{mallData.list_car.length}}款</span></h1>
        <swiper :options="carSwiperOption" ref="carSwiper" class="cars">
            <swiper-slide v-for="i in Math.ceil(mallData.list_car.length/6)">
                  <router-link :to="'/mall/car/'+item.item_id+'?storeId='+id+'&isSwitch=0'" v-for="item in mallData.list_car.slice((i-1)*6,6*i)">
                    <img :src="item.img">
                    <p>{{item.cat_name}}</p>
                  </router-link>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
    <div class="part" v-if="carList.body&&carList.body.length>0">
      <h1 class="title showflex">
        <span>特价新车</span>
        <a v-show="carList.head.rightdatavalue" class="arrow" @click="gonext(carList.head.rightdatatype,carList.head.rightdatavalue)" style="text-indent:0">
            <div style="top:0;right:0">更多</div>
          </a>
      </h1>
      <swiper class="swiper-special" :options="carSwiper">
        <swiper-slide class="slide-special" v-for="(item,index) in carList.body" >
          <router-link :to="'/mall/salecar/'+item.extra.item_id+'?storeId='+id+'&isSwitch=0'">
            <div :style="{'background-image':`url(${item.extra.img})`}" class="car-img">
              <div class="price-box">
                <div class="num">限量<span>{{item.extra.store}}</span>台</div>
                <div class="price">
                  <del>原价￥{{item.extra.zdprice}}万</del>
                  <span>￥<span style="font-size:.17rem;">{{item.extra.fixedprice}}</span>万</span>
                </div>
              </div>
            </div>
            <div class="car-text">
              <p>{{item.extra.title}}</p>
              <div>{{item.extra.sub_title}}</div>
            </div>
          </router-link>
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
      </swiper>
    </div>
    <div class="part" v-if="mallData.list_cargoods&&mallData.list_cargoods.body.length>0">
      <h1 class="title showflex">
        <span>精选车品</span>
        <a v-show="mallData.list_cargoods.head.rightdatavalue" class="arrow" @click="gonext(mallData.list_cargoods.head.rightdatatype,mallData.list_cargoods.head.rightdatavalue)" style="text-indent:0">
            <div style="top:0;right:0">更多</div>
          </a>
      </h1>
        
    </div>

    <div class="goods-list col2" style="padding:0 .05rem;" v-if="mallData.list_cargoods">
      <router-link class="li" v-for="(item,index) in mallData.list_cargoods.body" :to="'/mall/cargoods/'+item.extra.item_id" v-if="index<2">
        <div class="self-tag" v-if="item.extra.isziti==1">门店自提</div>
        <img v-lazy.appMain="item.extra.img">
        <div  class="detail-box">
          <h1>{{item.extra.title}}</h1>
          <ul>
            <li v-if="item.extra.servicetype&&item.extra.servicetype=='install'">包安装</li>
          </ul>
          <h2>￥{{item.extra.miaosha?parseFloat(item.extra.miaosha.price):parseFloat(item.extra.price)}}
            <del v-if="item.extra.miaosha">￥{{parseFloat(item.extra.price)}}</del>
          </h2>
        </div>
      </router-link>
    </div>
    
    <div class="part server" v-if="pageData.serviceCust&&pageData.serviceCust.length>0&&!pageData.myService">
        <h1 class="title">服务顾问</h1>
        <swiper :options="serverSwiperOption" ref="serverSwiper">
          <swiper-slide v-for="item in pageData.serviceCust" @click.native="goServerDetail(item.id,item.name)">

              <div class="profile">
                <img v-lazy.appMain="item.imgUrl||serverProfile">
              </div>
              <div>{{item.name}}</div>

          </swiper-slide>
        </swiper>
    </div>

    <div class="part appraise" v-if="commentData.scoreInfo">
        <router-link :to="commentData.totalNums>3?$route.path+'/comments':''" :class="commentData.totalNums>3?'arrow':''"><h1 class="title">车主点评 {{commentData.totalNums>0?`(${commentData.totalNums})`:''}}</h1><div></div></router-link>
        <div class="score">
          <div class="general">
              <div>{{commentData.scoreInfo.compScore}}</div>
              总体点评
          </div>
          <div class="detail">
              <div><label>服务质量</label><lc-rate disabled v-model="commentData.scoreInfo.qualScore"></lc-rate></div>
              <div><label>服务效率</label><lc-rate disabled v-model="commentData.scoreInfo.effiScore"></lc-rate></div>
              <div><label>服务态度</label><lc-rate disabled v-model="commentData.scoreInfo.attiScore"></lc-rate></div>
          </div>
        </div>
        <div class="comment" v-for="item in comments">
            <img class="profile" :src="item.memberHeadPortrait||profile">
            <h2><span>{{item.memberName}}</span>{{item.appraiseTime}}</h2>
            <lc-rate disabled v-model="item.compScore"></lc-rate>
            <p>{{item.appraise||''}}</p>
            <div class="imgs clearfix" v-if="item.appraiseImg.length>0">
                <img v-for="img in item.appraiseImg" v-lazy.appMain="img" @click="previewImg(img)">
            </div>
            <div class="reply" v-if="item.merchantReply!==''">商家回复：{{item.merchantReply}}</div>
        </div>
        <router-link v-if="commentData.totalNums>3" class="all" :to="$route.path+'/comments'">查看全部点评 ></router-link>
    </div>

    <div slot="footer" class="btns">
      <div class="left">
        <router-link tag="button" :to="'/beauty?id='+id"><img src="~assets/img/icon_detail_tab_service@2x.png"><span>美容</span></router-link>
        <button @click="next('/testDrive')"><img src="~assets/img/icon_detail_tab_drive@2x.png"><span>试驾</span></button>
        <a :href="'tel:'+pageData.rescuePhone"><button><img src="~assets/img/icon_detail_tab_help@2x.png"><span>救援</span></button></a>
        <!-- <router-link tag="button" :to="'/sos?actUrl='+encodeURIComponent('/CRM/static/pages/others/activity/sos/index.html')"><img src="~assets/img/icon_detail_tab_help@2x.png"><span>救援</span></router-link> -->
      </div>

      <div class="right">
          <button class="orange" @click="next('/maintenance')">维保预约</button>
      </div>
    </div>
    
      
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          id:'',
          subShopId:'',
          myLocation:'',
          profile:require('assets/img/default_user.png'),
          serverProfile:require('assets/img/default_server.png'),

          st:0,
          pageData:{},
          commentData:{},
          mallData:{},
          intro:false,

          acts:[],
          showMoreActs:false,

          comments:[],

          activeIndex:0,
          bannerSwiperOption: {
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            speed: 500,
            loop: true,
            lazyLoading: true,
            lazyLoadingOnTransitionStart: true,
            onSlideChangeStart: (swiper)=>{
                this.activeIndex=swiper.realIndex+1;
            }
          },

          carSwiperOption:{
            pagination: '.cars .swiper-pagination'
          },
          welfareSwiperOption:{
            slidesPerView: 1.55,
            freeMode: true
          },
          serverSwiperOption: {
            slidesPerView: 5.2,
            freeMode: true
          },
          
          carList:{},
          carSwiper: {
            slidesPerView:1,
            spaceBetween:8,
            pagination: '.swiper-pagination'
          },
          
          newsSwiper: {
            direction: 'vertical',
            slidesPerView: 1,
            autoplay: 2000,
            speed: 500,
            loop: true,
            // notNextTick: true,
          },
          welfareList:[],
          distance:''
        }
      },

      activated(){
        if(this.$refs.news){
          this.$refs.news.swiper.init()
        }
        if(!this.id||this.id!=this.$route.params.id){
            this.id=this.$route.params.id;
            this.getData();
            this.getwelfare();
            this.getMallData();
            this.loadcomment()
            let point=this.$cache.location;
            this.myLocation=new BMap.Point(point.lng,point.lat);
        }
        if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
      },
      beforeRouteLeave(to,from,next){
        if(/stores$/.test(to.path)){
          this.resetPage();
        }else{
          this.st = this.$el.children.appMain.scrollTop;
        }
        next();
      },
      methods:{
        
        previewImg(img){
            var that = this;
            wx.ready(function () {
                wx.previewImage({
                    current: img, // 当前显示图片的http链接
                    urls: that.pictureArr // 需要预览的图片http链接列表
                })
            })
            
        },
        gonext(type,value){
          switch(type){
            case 'goodsclass_salecar_subshop':
              this.$router.push('/stores/salecar/'+value);
            break;
            case 'goodsclass_cargoods_subshop':
            
              this.$router.push('/stores/cargoods/'+value);
            break;
          }
        },
        resetPage(){
          this.id='';
          this.myLocation='';

          this.st=0;
          this.pageData={};
          this.mallData={};
          this.commentData={};
          this.intro=false;
          
          this.acts=[];
          this.showMoreActs=false;

          this.comments=[];
          this.activeIndex=0;
        },
        async getwelfare(){
          
          let data={
            content:{
                apiType:'GET_FOURSSHOP_COUPON_OFFLINE',
                foursId:this.id,
                memberId:this.$cache.user.memberId
            }
          }
            let res=await this.$post('/couponSys/appcoupon/getFoursshopCouponList.json',data);
            if(res.errcode==0){
              this.welfareList = res.content.list
            }
        },
        async receiveWelfare(index,id,hasgetnum,couponcode,type){
          this.$login(async ()=>{
            let d={
                content: {
                    memberId: this.$cache.user.memberId,
                    id:id,
                    apiType:type==1?'RECEIVE_ONLINE':type==2?'RECEIVE_OFFLINE':'RECEIVE_OUTPLATFORM',
                    receiveType:14
                },
                
            };
            let res = await this.$post('/couponSys/appcoupon/receiveOrRedeem.json',d);
            if(res.errcode==0){
                this.welfareList[index].hasGetNum=++hasgetnum;
                this.welfareList[index].sendCouponcodeQuantity=++couponcode;
                this.$toast('领取成功')
            }
          })   
            
        },
        async getData() {
            let data={content:{
                '4sStoreId':this.id,
                queryType:3,
                memberId:this.$cache.user.memberId
              }
            }
            let res=await this.$post('/CRM/appfourspoint/queryService4SDetail.json',data);
            if(res.errcode==0){
              
                let con=res.content;
                this.pageData=con;
                this.$utils.setAppTitle(con['4sStoreName']);
                this.acts=con.activityInfo.activityList;

                this.distance=this.getDistance(con['4sStoreLongitude'],con['4sStoreDimension'])
                let shareData = {
                        share_title: con['4sStoreName'],
                        share_desc: con['4sStoreDescribe'],
                        share_img: con['4sImgUrl'][0],
                        share_url: location.origin+'/wxwap?#/stores/'+this.id
                    };
                this.$utils.shareConfig(shareData);
                this.$nextTick(()=>{
                  if(this.$refs.news){
                    this.$refs.news.swiper.init()
                  }
                  
                })

            }
        },
        async loadcomment(){
          let data={
            content:{
                  queryId:this.id,
                  queryType:1,
                  queryTag:1,
                  contentShow:true,
                  getFew:true
              }
            };
            let res=await this.$post('/CRM/appbespeak/getAppraiseList.json',data);
            if(res.errcode==0){
                let con=res.content;
                this.commentData=con;
                this.comments=con.appraiseList;
                this.pictureArr=[];
                for(let i=0;i<this.comments.length;i++){
                    for(let j=0;j<this.comments[i].appraiseImg.length;j++){
                        this.pictureArr.push(this.comments[i].appraiseImg[j])
                    }
                }

            }
        },
        async getMallData() {
            let data={content:{crmid:this.id}};
            let res=await this.$post('/mall29/foursshopgoodslist.html',data);
            
            if(res.errcode==0){
                this.mallData=res.content;
                this.subShopId=res.subshopid;
                this.carList=res.content.list_sale
            }
        },
        getDistance(lng,lat){

            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));
            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        },
        goServerDetail(id,name){
          this.$cache.server={
            id:id,
            name:name
          }
          this.$router.push('/server/detail');
        },
        next(path){
          this.$cache.fourS={
            id:this.pageData['4sStoreId'],
            name:this.pageData['4sStoreName']
          }
          this.$router.push(path);
        },

      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #storeDetail{
      .detail-fixed{
          height: .55rem;
          background: #fff;
          @include box;
          @include flexAlign;
          .nickname{
              background: url("~assets/img/myCars/icon_muycar_guwen@2x.png") no-repeat;
              background-size: 100% 100%;
              height: .55rem;
              width: 1.25rem;
              .head{
                  height: .4rem;
                  width: .4rem;
                  border-radius: 50%;
                  margin-top: .075rem;
                  float: right;
                  margin-right: .08rem;
                  background-size: cover;
                  background-position-y: 50%;
              }
          }
          .name{
              margin: 0 .1rem;
              // margin-right: .1rem;
              @include flex;
              p{
                  color: #22222d;
                  font-size: .15rem
              }
              
              span{font-size: .12rem;margin-left: .1rem;display: inline-block;vertical-align: middle;}
          }
          .btn{
              border:1px solid $red;
              color: $red;
              font-size: .12rem;
              border-radius: .2rem;
              margin-right: .15rem;
              padding: 0 .07rem;
              height: .2rem;
              line-height: .2rem;
              box-sizing: border-box;
          }
      }
      .arrow div{padding-right:.1rem;top:-.35rem;right:.2rem;
        &::after{top:.11rem;}
        &::before{top:.11rem;}
      }
      .part{background:#fff;margin-bottom:.05rem;
        .title{color:$black;line-height: .35rem;text-indent: .2rem;border-bottom:$border;font-size:$h2;position: relative;
          &.showflex{@include box;@include flexJustify(space-between);}
          a{float:right;margin-right:.2rem;font-size:$h3;color:$gray;}
          
        }
        .new-flash{
          line-height: .45rem;
          .title-pic{display: flex;align-items: center;margin-left: .2rem; margin-right: .12rem;
            img{height: .15rem;}
          }
          .news{height: .25rem;width: 2rem;padding-left: .1rem;margin-left: 0;border-left: 1px solid #f2f2f2;text-indent: 0;line-height: .25rem;font-size: .12rem;color: $gray;margin-top: .1rem;
            
            .swiper-slide{
              @include txtOverflow;
            }
            a{
              display: block;
              float: left;
              width: 100%;
            }
          }
          .arrow div{
              &::after{top:.16rem;}
              &::before{top:.16rem;}
            }
        }
        // .area-title{padding:0 .2rem;height:.36rem;line-height:.36rem;background: #fff;border-bottom:$border;font-size:$h3;
        //   img{display:block;height:.15rem;float: left;margin-top:.105rem; }
        //   >p{float:left;@include txtOverflow;width:1.8rem;margin-left:.2rem;color:$black;}
        //   a{float:right;}
        //   .arrow div{padding-right:.1rem;
        //     &::after{top:.11rem;}
        //     &::before{top:.11rem;}
        //   }
        // }
      }

      .bannerSwiper {height: 2.5rem;position: relative;
        .swiper-container{height:100%;}
        img{width:100%;height:100%;display: block;}
        .pagination{position: absolute;left:.1rem;bottom:.1rem;color:#fff;z-index: 2;padding:0 .1rem 0 .3rem;line-height:.2rem;border-radius: 99px;background:rgba(0,0,0,.6) url('~assets/img/icon-img.png') no-repeat .1rem center;background-size:.14rem .11rem;}
      }
      
      .store{display:block;position: relative;padding:.1rem .2rem .2rem;background: #fff;margin-bottom:0;
          h1{color:$black;
            div{display:inline-block;border:$border;border-radius:99px;line-height:.18rem;padding:0 .07rem 0 .22rem;color:$gray;font-size:$h3;background:url('~assets/img/intro.png') no-repeat .08rem center;background-size:.11rem .12rem;
              &:after{display:inline-block;vertical-align:middle;margin-left:.03rem;content:'';width:0;height: 0;border:.05rem solid transparent;border-bottom:0;border-top-color:$gray;}
              &.on:after{border:.05rem solid transparent;border-top:0;border-bottom-color:$gray;}
            }
          }
          .intro{color:$gray;font-size:$h3;margin:.05rem 0;line-height: .2rem;}
          .brands{height: .2rem;
              img{width:.2rem;height:.2rem;margin-right:.05rem;}
          }
          a{position:absolute;bottom:.225rem;right:.2rem;display: block;width:.3rem;height: .3rem;background:url('~assets/img/phone.png') no-repeat center;background-size:100%;}
      }

      .addr{display:block;font-size:$h4;color:$gray;border-top:$border;padding:.1rem .5rem .1rem .2rem;position: relative;
          &:after{content:'';position:absolute;right:0;top:0;width:.5rem;height: 100%;background: url('~assets/img/indicator.png') no-repeat center;background-size:.16rem .16rem;}
          p{width:70%;@include txtOverflow;float: left;}
          span{float:right;}
      }

      .cars{padding-bottom:.15rem;
        .swiper-slide{
          a{display: block;float:left;width:33.3333%;text-align:center;padding:.15rem .15rem .1rem;box-sizing: border-box;box-sizing: border-box;font-size:$h3;color:$black;
            img{width:100%;}
          }
          p{height: .16rem;line-height: .16rem;}
        }
        .swiper-pagination-bullets{bottom:.05rem!important;width: 100%;}
        .swiper-pagination-bullet{background:#c7c7c7!important;width:5px!important;height:5px!important;margin:0 3px!important;border-radius:0!important;}
        .swiper-pagination-bullet-active{background:#89888e!important;}
      }

      .server{
        .swiper-container{padding:.1rem .2rem;}
        .swiper-slide{text-align:center;font-size:$h3;
          .profile{display:inline-block;width:.45rem;height:.45rem;border-radius:50%;overflow: hidden;
            img{width:100%;margin-top:-.08rem;}
          }
        }
      }
      .welfare{
        .swiper-container{padding:.15rem .2rem;}
        .swiper-slide{text-align:center;font-size:$h3;
          .welfare-box{
            background:url('~assets/img/fours/bg_4s_coupons.png') no-repeat;width: 1.95rem;height: .9rem;
            background-size: 100% 100%;@include box;padding: .1rem .12rem;box-sizing: border-box;font-size:.12rem;
            .left{
              width: 1.05rem;text-align: left;padding: .06rem .08rem;box-sizing: border-box;@include txtOverflow;padding-right:.02rem;
              p{
                color: $red;@include txtOverflow;
              }
              .money{
                color: $red;
                margin: .02rem 0;
                span{
                  font-size: .19rem;
                }
              }
              .condition{
                color: #000;@include txtOverflow;
              }
            }
            .right{
              @include flex;position: relative;
              .btn{
                line-height: .7rem;text-align: center;color: $red;font-size: .15rem;
              }
              img{width: .5rem;height: .5rem;position: absolute;top: -.07rem;right: -.07rem;}
              .see{
                font-size: .12rem;color: $red;border:1px solid $red;display:inline-block;padding:0 .1rem;border-radius: .2rem;margin-top: .46rem;
              }
            }
          }
        }
      }
      .more{color:$gray;position: relative;margin:0 auto;line-height:.4rem;font-size:$h3;text-align:center;
        &::after{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.025rem;border:.05rem solid transparent;border-bottom:0;border-top-color:#fff;}
        &::before{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.035rem;border:.05rem solid transparent;border-bottom:0;border-top-color:$black;}
      }
      .more.on{
        &::after{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.035;border:.05rem solid transparent;border-top:0;border-bottom-color:#fff;}
        &::before{position:absolute;content:'';width:0;height:0;right:50%;margin-right:-.3rem;bottom:50%;margin-bottom:-.015rem;border:.05rem solid transparent;border-top:0;border-bottom-color:$black;}
      }

      .act{display:block;padding:.15rem .2rem .15rem 1.05rem;position: relative;font-size:$h3;color:$gray;overflow: hidden;line-height:.15rem;border-bottom:$border;
          img{width:.7rem;height:.7rem;position: absolute;left:.2rem;top:.15rem;}
          h2{color:$black;@include txtOverflow;}
          label{display:inline-block;color:#fff;padding:0 .05rem;margin:.05rem .05rem .05rem 0;font-size:$h4;
            &.red{background:$red;}
            &.orange{background:$orange;}
          }
          p:before{content:'';width:.10rem;height:.10rem;display: inline-block;vertical-align: middle;margin-right:.05rem;}
          .time:before{background:url('~assets/img/icon_card_detail_time.png') no-repeat center;background-size: contain;}
          .area:before{background:url('~assets/img/icon_card_detail_address.png') no-repeat center;background-size: contain;}
      }

      .appraise{
        .all{display:block;text-align: center;line-height: .4rem;font-size:$h3;color:$gray;border-top:$border;}
      } 

      .score{@include box;padding:.1rem .2rem;border-bottom:$border;@include flexAlign;font-size:$h3;
        .general{text-align:center;div{color:$red;font-size:.2rem;}}
        .detail{padding-left:.3rem;
          div:nth-last-of-type(n+2){margin-bottom:.05rem;}
          label{margin-right:.2rem;vertical-align: middle;}
        }
      }

      .comment{position: relative;padding:.1rem .2rem .1rem .6rem;color:$gray;line-height:.2rem;font-size:$h4;
        .profile{position: absolute;top:.1rem;left:.2rem;width:.3rem;height:.3rem;border-radius: 50%;border:$border;}
        h2{text-align:right;span{float:left;color:$black;}}
        .imgs img{width:.5rem;height:.5rem;float: left;margin-right:.05rem;}
        .reply{padding:.03rem .1rem;border-radius: .03rem;border:$border;background:#f9f9f9;margin-top:.1rem;position: relative;
          &::before { content: ''; position: absolute;width:0; height:0; border-width:5px; border-style:solid; border-color: transparent transparent rgba(237, 237, 237, 0.8); font-size:0; line-height:0;top: -11px;left: 10px;}
          &::after { content: ''; position: absolute;width:0; height:0; border-width:5px; border-style:solid; border-color: transparent transparent #f9f9f9; font-size:0; line-height:0;top: -10px;left: 10px;}
        }
      }

      .btns{height:.45rem;background:#fff;overflow: hidden;zoom:1;
        button{box-sizing: border-box;height:.45rem;}
        .left{width:1.5rem;@include box;float:left;
          button:nth-of-type(n+1){border-right:$border;}
          button{width:.5rem;border-top:$border;position: relative;
            div,img{width:.2rem;height:.2rem;display: block;margin:0 auto;}
            span{font-size:$h4;color:$gray;}
          }
        }

        .right{width:2.25rem;float:right;@include box;
            button{@include flex;color:#fff;
              &.yellow{background:#f29600;}
              &.orange{background:$red;}
              &.dis{background:#c9c9c9;width:2.25rem;line-height: .45rem;color:#fff;text-align:center;}
            }
        }
      }
      .swiper-special{
      margin-top: .05rem;
      padding: 0 .15rem;
      background: #fff;
      .slide-special{
        left: 50%;
        transform: translateX(-50%);
        
      }
      .car-img{
        height: 2.1rem;
        width: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50%;
        box-shadow: 0px -30px 50px -30px #88888d inset;
        position: relative;
        @include box;
        @include flexAlign(flex-end);

        .price-box{
          @include box;
          @include flexAlign(flex-end);
          @include flexJustify(space-between);
          margin-bottom: .1rem;
          text-align: center;
          padding: 0 .12rem;
          width: 100%;
          .num{
            line-height: .18rem;
            color: #fff;
            font-size: .12rem;
            height: .18rem;
            padding: 0 .1rem;
            background: rgba(0,0,0,.6);
            border-radius: .18rem;
            span{
              color: #ef9a00
            }
          }
          .price{
            background: url('~assets/img/mall/icon_4s_detail_price@2x.png');
            background-size: 100% 100%;
            width: .85rem;
            height: .37rem;
            color: #fff;
            del{
              font-size: .11rem;
            }
            span{
              font-size: .14rem; 
            }
          }
        }
      }
      .car-text{
        height: .87rem;
        width: 100%;
        p{
          padding: .14rem 0 .06rem 0;
          color:#22222d;
          font-size: .15rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        div{
          color:$red;
          font-size: .12rem;
        }
      }
    }
    .swiper-pagination{
      .swiper-pagination-bullet{
        background:#c5c5c5;
        width: .05rem;
        height: .05rem;
        border-radius:0
      }
      .swiper-pagination-bullet-active{background:#8a898f !important;}
    }
  }
</style>