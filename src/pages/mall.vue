<template>
  <app-layout id="mall">
    <lc-search slot="header" work-for="mall" type="car" v-on:search="search"></lc-search>
  
    <!-- modulid 对应模版
              2:3图，左1右2
              3:一行多列，可滚动
              4:2行3列
              5:1列多行
              6:1列2行+1行1列
              7:广告
              8:轮播图
              9:快速入口
              10:5列多行
              11:4列多行
      -->
  
    <template v-for="mod in pageData">
  
      <!-- 标题 -->
      <div v-if="mod.head" class="area-title clearfix">
        <img :src="mod.head.leftimg">
        <p>{{mod.head.middletext}}</p>
        <div class="time" v-if="mod.head.extra">
          <p>剩余时间</p>
          <div>
            <span class="num">{{$countDown(second*1000)[0]}}</span>
            <em>:</em>
            <span class="num">{{$countDown(second*1000)[1]}}</span>
            <em>:</em>
            <span class="num">{{$countDown(second*1000)[2]}}</span>
          </div>
        </div>
        <a v-if="mod.head.rightdatatype&&mod.head.rightdatavalue" class="arrow" @click="next(mod.head.rightdatatype,mod.head.rightdatavalue)">
          <div>更多</div>
        </a>
      </div>
  
      <!-- 轮播图 -->
      <swiper class="bannerSwiper" v-if="mod.modulid===8&&mod.body.length>0" :options="bannerSwiperOption" ref="bannerSwiper" :style="{'height':`${mod.frame&&mod.frame.height/200}rem`}">
        <swiper-slide v-for="(item,index) in mod.body">
          <a @click="next(item.datatype,item.datavalue)">
            <div class="banImg" :style="{'background-image':`url(${item.img})`}"></div>
            <!-- <img :src="item.img" :data-src="index>1&&item.img" :class="index>1&&'swiper-lazy'"> -->
          </a>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      
  
      <!-- 快速入口 -->
      <ul v-if="mod.modulid===9" class="main-fn area">
        <li v-for="item in mod.body" >
          <a @click="next(item.datatype,item.datavalue)">
            <img :src="item.img">
            <h2>{{item.text}}</h2>
          </a>
        </li>
      </ul>
  
      <!-- 三图组合 -->
      <div v-if="mod.modulid===2" class="recommend area">
        <a v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
          <img :src="item.img">
        </a>
      </div>

       <!-- 左2右3 -->
      <div v-if="mod.modulid===6" class="recommend2 area">
        <a v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
          <img :src="item.img">
        </a>
      </div>
  
      <!-- banner/一列多行 -->
      <template v-if="mod.modulid===7||mod.modulid===5">
        <a v-for="item in mod.body" @click="next(item.datatype,item.datavalue)" class="ad area">
          <img :src="item.img">
        </a>
      </template>
  
      <!-- 一行多列 -->
      <template v-if="mod.modulid===3||mod.modulid===16">
        <swiper class="newCar area" :options="newcarSwiperOption" ref="newcarSwiper">
          <swiper-slide v-for="item in mod.body">
            <a @click="next(item.datatype,item.datavalue)">
              <img :src="item.img">
              <div v-if="mod.modulid===16">
                <p>{{item.text}}</p>
                <h2>￥{{item.price2}}<del>￥{{item.price}}</del></h2>
              </div>
              
            </a>
          </swiper-slide>  
        </swiper>
        
      </template>
  
      <!-- 5列多行 -->
      <template v-if="mod.modulid===10">
        <div class="sth-link n5 clearfix area">
          <a class="sth" v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
            <img v-lazy.appMain="item.img">
            <h1>{{item.text}}</h1>
          </a>
        </div>
      </template>
  
      <!-- 4列多行 -->
      <template v-if="mod.modulid===11">
        <div class="sth-link n4 clearfix area">
          <a class="sth" v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
            <img v-lazy.appMain="item.img">
            <h1>{{item.text}}</h1>
          </a>
        </div>
      </template>


      <!-- 3列多行 -->
      <template v-if="mod.modulid===4">
        <div class="sth-link n3 clearfix area">
          <a class="sth" v-for="item in mod.body" @click="next(item.datatype,item.datavalue)">
            <img v-lazy.appMain="item.img">
            <h1>{{item.text}}</h1>
          </a>
        </div>
      </template>
  
    </template>
  
    <div class="goods-list col2" v-if="goodsList.length>0">
      <img class="title" src="~assets/img/mall/icon_home_recommend.png">
  
      <router-link class="li" v-for="item in goodsList" :to="'/mall/cargoods/'+item.item_id">
        <img v-lazy.appMain="item.img">
        <div class="detail-box">
          <h1><span class="secKill" v-if="item.miaosha">天天秒杀</span>{{item.title}}</h1>
          <h2>￥{{item.miaosha?parseFloat(item.miaosha.price):parseFloat(item.price)}}
            <del v-show="item.miaosha">￥{{parseFloat(item.price)}}</del>
          </h2>
        </div>
      </router-link>
  
    </div>
  
  </app-layout>
</template>

<script>

export default {
  data() {
    return {
      pageData: {},
      goodsList: [],
      st: 0,
      bannerSwiperOption: {
        autoplay: 5000,
        autoplayDisableOnInteraction: false,
        speed: 500,
        loop: true,
        lazyLoading: true,
        lazyLoadingOnTransitionStart: true,
        pagination: '.bannerSwiper .swiper-pagination'
      },
      newcarSwiperOption: {
        slidesPerView: 3.7,
        freeMode: true
      },
      itemLink: this.$cache.itemLink,
      cleartime:'',
      second:null
    };
  },
  mounted() {
    this.getPageData();
    clearInterval(this.cleartime)
    this.cleartime=setInterval(()=>{  
      if(this.second){
        this.second=this.second-1;
        if(this.second<=0&&this.$route.path==='/mall'){
          setTimeout(()=>{
            this.getPageData();
          },1000)
          
        }
      }
    },1000)   
    
  },
  activated() {
    if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
    
  },
  // deactivated(){
  //    clearInterval(this.cleartime)
  // },
  beforeRouteLeave(to, from, next) {
    this.st = this.$el.children.appMain.scrollTop;
    next();
  },
  methods: {
    
    search(data){
      this.$router.push('/mall/'+data.type+'?val='+data.keyword);
    },
    next(type,value){

      switch(type){
        case 'url':
          if(/duiba/.test(value)){
            this.$router.push('/spMall/somePage?url='+encodeURIComponent(value.replace('?LechengMallSign','')));
          }else{
            location.href=value;
          }
        break;
        case 'car':
          this.$router.push('/mall/car/'+value);
        break;

        case 'salecar':
          this.$router.push('/mall/salecar/'+value);
        break;

        case 'cargoods':
          this.$router.push('/mall/cargoods/'+value);
        break;

        case 'goodsclass_car':
          this.$router.push('/mall/car?key='+value);
        break;

        case 'goodsclass_salecar':
          this.$router.push('/mall/salecar?key='+value);
        break;

        case 'goodsclass_cargoods':
          this.$router.push('/mall/cargoods?key='+value);
        break;

        case 'channel_testdrive':
          this.$router.push('/testDrive/brands');
        break;
        case 'channel_meirong':
          this.$router.push('/beauty');
        break;
        case 'channel_miaosha':
          this.$router.push('/mall/seckill?key='+value+'&type=current');
        break;
        case 'channel_jf_allgoods':
          this.$router.push('/integralMall/allList');
        break;
        case 'channel_jf_membersarea':
          this.$router.push('/integralMall/memberList');
        break;
        case 'channel_jf_cardarea':
          this.$router.push('/integralMall/couponList');
        break;
        case 'channel_jf_canexchange':
          this.$router.push('/integralMall/exchangeList');
        break;
        case 'channel_jf_lottery':
          this.$router.push('/lottery?aid='+value.split('aid=')[1]);
        break;
        case 'jifen':
          this.$router.push('/integralMall/details/'+value);
        break;
        default:
          this.$router.push(this.itemLink[type]+value);
        break;
      }
    },
    async getPageData () {
      let data = { content: { platform: "mweb" } };
      let res = await this.$post('/mall29/index.html', data);

      if (res.errcode === 0) {
        this.pageData = res.content.list;
        let miaosha=this.pageData.filter((item)=>{
          return item.modulid==16
        }) 
     
        if(miaosha.length>0&&miaosha[0].head){
          
          this.second = miaosha[0].head.extra.second
        }
        
        this.loadMore();
      }
    },
    async loadMore () {
      let data = { content: { type: 'mallindex', maxRecordNum: 20, pageNo: 1 ,pageSize:20} };
      let res = await this.$post('/mall29/itemlist.html', data);

      if (res.errcode === 0) {
        let list = res.content.list;
        this.goodsList = this.goodsList.concat(list);
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
 #mall {
    .area{margin:0 auto .06rem;}
    .area-title{padding:0 .2rem;height:.36rem;line-height:.36rem;background: #fff;border-bottom:$border;font-size:$h3;
      img{display:block;height:.15rem;float: left;margin-top:.105rem; }
      >p{float:left;@include txtOverflow;width:1.8rem;margin-left:.2rem;color:$black;}
      a{float:right;}
      .arrow div{padding-right:.1rem;
        &::after{top:.11rem;}
        &::before{top:.11rem;}
      }
      .time{
        float: left;
        width: 1.8rem;
        margin-left: .2rem;
        color: $red;
        @include box;
        text-align: center;
        p{
          font-size: .14rem;
          color: $black;
        }
        div{
          font-size: 0;
          margin-left:.08rem;
          em{
            font-style: normal;
            font-size: .12rem;
            padding: 0 .02rem;
            font-weight: 600;
          }
          .num{
            display: inline-block;
            line-height: .18rem;
            
            font-size: .12rem;
            width: .18rem;
            height:.18rem;
            border:1px solid #c9c9c9;
          }
        }
      }
    }
    .bannerSwiper {img{width:100%;height:100%;display: block;}.banImg{height: 100%;width: 100%;background-size:cover;background-position: center center;background-repeat: no-repeat }}
    .main-fn{padding:.15rem .2rem;img{width:.4rem;}}
    .recommend {
      position:relative;height:2rem;
      a{
        position:absolute;box-sizing:border-box;display: block;
        img{width:100%;height:100%;display: block;}
        &:nth-of-type(1){width:40%;top:0;left:0;height:100%;border-right:.01rem solid #fff;}
        &:nth-of-type(2){width:60%;top:0;right:0;height:50%;border-bottom:.01rem solid #fff;}
        &:nth-of-type(3){width:60%;bottom:0;right:0;height:50%;}
      }
    }
    .recommend2 {
      position:relative;height:2.79rem;
      a{
        position:absolute;box-sizing:border-box;display: block;width:50%;
        img{width:100%;height:100%;display: block;}
        &:nth-of-type(1){top:0;left:0;height:1.86rem;border-right:$border;border-bottom:$border;}
        &:nth-of-type(2){top:0;right:0;height:.93rem;border-bottom:$border;}
        &:nth-of-type(3){top:.93rem;right:0;height:.93rem;border-bottom:$border;}
        &:nth-of-type(4){bottom:0;left:0;height:.93rem;border-right:$border;}
        &:nth-of-type(5){bottom:0;right:0;height:.93rem;}
      }
    }
    .ad{display: block;width:100%;height:.75rem;img{display: block;width:100%;height: 100%;}}
    .newCar{
      .swiper-slide{border-right:$border;background:#fff;box-sizing: border-box;text-align:center;
        img{width:100%;display: block;}
        div{
          padding:.05rem .02rem;
          p{font-size: .12rem;@include txtOverflow;margin-bottom: .04rem;}
          h2{color: $red;font-size: 0.14rem;position: relative;@include txtOverflow;
            del{color: $gray;font-size: 0.12rem;margin-left: .1rem;}
          }
        }
      }
      .more{width:.2rem !important;}
    } 
    .secKill{height: .16rem;line-height: .16rem;font-size: .12rem;display: inline-block;padding: 0 .04rem;background: linear-gradient(to right, #f02d8d, #f2315e);color: #fff;border-radius: 3px;margin-right: .04rem;}
  }
</style>
