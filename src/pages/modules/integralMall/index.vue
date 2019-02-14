<template>
  <app-layout id="integralMall">
    <div class="login-box arrow-link" @click="goLogin">
      <div class="portrait"  :style="{'background-image':'url('+defaultHead+')'}" ></div>
      <div class="info-box">
        <div class="name">
          <p>{{user.jifenInfo?user.jifenInfo.nickname:'立即登录'}}</p>

            <img v-if="user.jifenInfo&&user.jifenInfo.grade=='251'" src="~assets/img/integralMall/label_activity_detail_puka.png" alt="">
            <img v-else-if="user.jifenInfo&&user.jifenInfo.grade=='252'" src="~assets/img/integralMall/label_activity_detail_yinka.png" alt="">
            <img v-else-if="user.jifenInfo&&user.jifenInfo.grade=='253'" src="~assets/img/integralMall/label_activity_detail_jinka.png" alt="">
            <img v-else-if="user.jifenInfo&&user.jifenInfo.grade=='254'" src="~assets/img/integralMall/label_activity_detail_zuanshika.png" alt="">
            <div v-else class="no-card">盈众车生活 一键乐启程</div>
        </div>
        <div class="point" v-if="user.jifenInfo" >
          <svg class="icon" aria-hidden="true" style="width:.13rem;">
              <use :xlink:href="'#icon-icon_integral'"></use>
          </svg><span style="vertical-align: middle;margin-left:.02rem;">{{user.jifenInfo.credit}}</span>
        </div>
      </div>
    </div>
    <ul class="nav-ul area" v-if="user.jifenInfo">
      <li @click="linkApp">
        <svg class="icon" aria-hidden="true" style="width:.16rem;">
          <use :xlink:href="'#icon-icon_integral'"></use>
        </svg>
        <span style="vertical-align: middle;">去赚积分</span>
      </li>
      <li @click="linkRecord"> 
        <svg class="icon" aria-hidden="true" style="width:.16rem;">
          <use :xlink:href="'#icon-icon_record'"></use>
        </svg>
        <span style="vertical-align: middle;">兑换记录</span>
      </li>
    </ul>
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
      <!-- 轮播图 -->
      <swiper class="bannerSwiper" v-if="mod.modulid===8&&mod.body.length>0" :style="{'height':`${mod.frame&&mod.frame.height/200}rem`}" :options="bannerSwiperOption" ref="bannerSwiper">
        <swiper-slide v-for="(item,index) in mod.body" @click.native="next(item.datatype,item.datavalue)">
          <!-- <a @click="next(item.datatype,item.datavalue)" > -->
            <div class="banImg" :style="{'background-image':`url(${item.img})`}"></div>
          <!-- </a> -->
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <ul v-if="mod.modulid===9" class="main-fn area">
        <li v-for="item in mod.body" >
          <a @click="next(item.datatype,item.datavalue)">
            <img :src="item.img">
            <h2>{{item.text}}</h2>
          </a>
        </li>
      </ul>
    </template>

    <div class="area-title clearfix" v-if="goodsList.length>0">
      <p>精选推荐</p>
    </div>
    <div class="goods-list col2" v-if="goodsList.length>0">
      <li class="li"  v-for="item in goodsList" @click="goDetails(item.item_id)" >
        <img v-lazy.appMain="item.img">
        <div class="detail-box">
          <h1>{{item.title}}</h1>
          <h2>
            <svg class="icon" aria-hidden="true" style="width:.14rem;">
              <use :xlink:href="'#icon-icon_integral'"></use>
            </svg><span style="vertical-align: middle;">{{item.jf}}{{parseFloat(item.price)>0?`+￥${parseFloat(item.price)}`:''}}</span>
          </h2>
        </div>
      </li>
      
    </div>
  </app-layout>
</template>
<script>
export default {
  data(){
    return{
      isWechat:isWechat,
      user:{},
      defaultHead:null,
      pageData:{},
      goodsList:[],
      bannerSwiperOption: {
        autoplay: 5000,
        // autoplayDisableOnInteraction: false,
        speed: 500,
        // loop: true,
        // lazyLoading: true,
        // lazyLoadingOnTransitionStart: true,
        pagination: '.bannerSwiper .swiper-pagination'
      },
    }
  },
  mounted() {
    
    this.getPageData();
  },
  activated() {
    this.user = {}
    this.getMbeCreditInfo();

  },
  methods:{
    goDetails(id){
      if(isLecheng){
        this.$utils.goNative('jifen',id);
      }else{
        this.$router.push('/integralMall/details/'+id)
      }

    },
    linkApp(){
      if(isLecheng){
        this.$utils.goNative('signin');
      }else{
        this.$appDownLoad.show({
          title:' ',
          details:'请下载盈众乐橙汇App即可参与',
          mlink:"ABji?mlKey=sign",
          mobParams:{mlKey:'sign',mId:''}
        })
      }
    },
    linkRecord(){
      if(isLecheng){
        this.$utils.goNative('order_record','JF');
      }else{
        this.$router.push('/orders?status=0&type=JF')
      }
      
    },
    goLogin() {
      if(!this.user.jifenInfo){
        this.$router.push(isWechat?'/signUp':'/h5signUp')
      }else{
        this.$router.push('/point')
      }
    },
    async getMbeCreditInfo () {
      let data = { 
        content: {
          mbeid:this.$cache.user.memberId||'',
          mobile:this.$cache.user.phone||''
        } 
      };
      let res = await this.$post('/mall29/jfindex.html', data);
      if (res.errcode === 0) {
        const con = res.content;
        this.user = con;
        this.defaultHead = con.jifenInfo?con.jifenInfo.headImgUrl||require("assets/img/default_user.png"):require("assets/img/default_user.png")
        let shareData={
          share_title:con.shareInfo.title,
          share_desc:con.shareInfo.desc,
          share_img:con.shareInfo.img,
          share_url:con.shareInfo.url
        }
        this.$utils.shareConfig(shareData);
      }
    },
    async getPageData () {
      let data = { content: { platform: "jfmall" } };
      let res = await this.$post('/mall29/index.html', data);

      if (res.errcode === 0) {
        this.pageData = res.content.list;
        this.loadMore();
      }
    },
    async loadMore () {
      let data = { content: { itemtype:'jifen',mobile:this.$cache.user.phone||'',mbeid:this.$cache.user.memberId||'', maxRecordNum: 20, pageNo: 1 ,pageSize:20,order:'rand'} };
      let res = await this.$post('/mall29/itemlist.html', data);

      if (res.errcode === 0) {
        let list = res.content.list;
        this.goodsList = this.goodsList.concat(list);
      }
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
  }
}
</script>
<style lang="scss">
@import "~assets/css/var.scss";
#integralMall{
  .area{margin: 0 auto .05rem}

  .arrow-link{
    &::before {position: absolute;content: '';width: 0;height: 0;right: .2rem;top: 50%;margin-top: -.05rem;border: .05rem solid transparent;border-right: 0;border-left-color: #88888d;}
    &::after {position: absolute;content: '';width: 0;height: 0;right: .21rem;top: 50%;margin-top: -.05rem;border: .05rem solid transparent;border-right: 0;border-left-color: #fff;}
  }
  .login-box{height: .75rem;background: #fff;padding:0 .2rem;@include box;@include flexAlign;
    .portrait{height: .45rem;width: .45rem;border-radius: 50%;background-size:cover;background-position:center;}
    .info-box{padding: 0 .15rem;@include box;@include flexAlign;@include flexJustify(space-between);@include flex;
      .name{
        p{color: $black;margin-bottom: .06rem;}
        .no-card{font-size: .12rem;color: $lightGray}
        img{height: .14rem;}
      }
      .point{color:$red;
        img{width: .09rem;margin-right: .02rem;}
      }
    }
  }
  .nav-ul{
    height: .44rem;margin-top:1px;background:#fff;@include box;@include flexJustify;text-align:center;line-height:.44rem;
    li{@include flex;border-right: 1px solid #f2f2f2;
    &:nth-child(2n){border:none}
    }
  }
  .bannerSwiper{
    .banImg{height: 100%;width: 100%;background-size:cover;background-position: center center;background-repeat: no-repeat }
  }
  .main-fn{padding: .15rem .1rem}
  .area-title{padding: 0 .2rem;height: .36rem;line-height: .36rem;background: #fff;border-bottom: 1px solid rgba(237, 237, 237, 0.8);}
}
</style>
