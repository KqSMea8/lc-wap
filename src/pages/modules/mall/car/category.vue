<template>
  <app-layout id="clsNewCar">
  
    <lc-search slot="header" work-for="mall" type="car" v-on:search="search"></lc-search>
      
      <ul class="sth-link n5 clearfix ">
        <li class="sth" v-for="item in brands" @click="next('',item.cat_id)">
          <img :src="item.cat_logo">
          <h1>{{item.cat_name}}</h1>
        </li>
      </ul>

      <ul class="priceIn clearfix">
        <li v-for="item in price" @click="next('','',item.price_start,item.price_end)">{{item.title}}</li>
      </ul>
      
      <router-link to="/mall/car?key=" class="">
        <div class="more-new area">更多选车 ></div>
      </router-link>
      <template v-for="mod in pageData">
        <!-- 标题 -->
        <div v-if="mod.head&&mod.head.rightdatatype" class="area-title clearfix">
          <img :src="mod.head.leftimg">
          <p>{{mod.head.middletext}}</p>
          
          <a v-if="mod.head.rightdatatype" class="arrow" @click="gonext(mod.head.rightdatatype,mod.head.rightdatavalue)">
            <div>更多</div>
          </a>
        </div>

         <!-- 左2右3 -->
        <div v-if="mod.modulid===6" class="recommend2 area">
          <a v-for="item in mod.body" @click="gonext(item.datatype,item.datavalue)">
            <img :src="item.img">
          </a>
        </div>

        <template v-if="mod.modulid===14">
          <swiper class="swiper-special" :options="carSwiper">
            <swiper-slide class="slide-special" v-for="(item,index) in mod.body" >
              <router-link :to="'/mall/salecar/'+item.extra.item_id">
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
        </template>
      </template>
      <div class="newCarSep">新车推荐</div>
      <div class="goods-list col2" v-if="goodsList.length>0">
        <router-link class="li" v-for="item in goodsList" :key="item.datavalue" :to="'/mall/car/'+item.item_id">
          <img v-lazy.mall="item.img">
          <div  class="detail-box">
            <h1>{{item.title}}</h1>
            <p>{{item.sub_title}}</p>
            <h3>指导价：<span>￥{{parseFloat(item.zdstart_price)}}-{{parseFloat(item.zdend_price)}}万</span></h3>
          </div>
        </router-link>
      </div>
      
  </app-layout>

</template>

<script>
export default {
  data() {
    return {
      brands:[],
      price:[],

      goodsList:[],
      st:0,
      itemLink: this.$cache.itemLink,
      carSwiper: {
        slidesPerView:1,
        spaceBetween:8,
        pagination: '.swiper-pagination'
      },
      pageData:[],
      itemLink: this.$cache.itemLink,
    };
  },
  mounted() {
    this.getData();
    this.getSpecialCar()
    this.loadMore();
    
  },
  methods:{
    gonext(type,value){
      switch(type){
        case 'url':
          if(/duiba/.test(value)){
            this.$router.push('/spMall/somePage?url='+encodeURIComponent(value.replace('?LechengMallSign','')));
          }else{
            location.href=value;
          }
        break;

        case 'goodsclass_car':
          this.$router.push('/mall/car?key='+value);
        break;

        case 'goodsclass_salecar':
          this.$router.push('/mall/salecar?key='+'');
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
        default:
          this.$router.push(this.itemLink[type]+value);
        break;
      }
    },
    search(data){
      this.$router.push('/mall/car?val='+data.keyword);
    },
    next(val,key,priceFrom,priceTo){
      let query='';

      if(val){query+=('val='+val+'&');}
      if(key){query+=('key='+key+'&');}
      if(priceFrom){query+=('pf='+priceFrom+'&');}
      if(priceTo){query+=('pt='+priceTo+'&');}

      this.$router.push('/mall/car?'+query);
    },
    async getData(){
      let res=await this.$post('/mall29/newcar-category.html', {});
      if(res.errcode===0){
        this.brands=res.content.brand;
        this.price=res.content.price;
      }
    },
    async getSpecialCar(){
      let data={
        content:{
          platform:"carcategory"
        }
      }
      let res=await this.$post('/mall29/index.html', data);
      if(res.errcode===0){
        this.pageData=res.content.list
      }
    },
    async loadMore(){
      let data = { content: { type: 'carclass', maxRecordNum: 20, pageNo: 1 ,pageSize:20} };
      let res = await this.$post('/mall29/itemlist.html', data);

      if(res.errcode===0){
        let list =res.content.list;
        this.goodsList=this.goodsList.concat(list);
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#clsNewCar {
  .area{margin:0 auto .06rem;}
    .area-title{padding:0 .2rem;height:.36rem;line-height:.36rem;background: #fff;border-bottom:$border;font-size:$h3;
      img{display:block;height:.15rem;float: left;margin-top:.105rem; }
      >p{float:left;@include txtOverflow;width:1.8rem;margin-left:.2rem;color:$black;}
      a{float:right;}
      .arrow div{padding-right:.1rem;
        &::after{top:.11rem;}
        &::before{top:.11rem;}
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
    .priceIn{padding:.2rem;background:#fff;padding-bottom:.05rem;
        li{display: block;float:left;padding:.05rem .1rem;margin:0 .15rem .12rem 0;border:$border;text-align:center;font-size:$h3;color:$gray;}    
    }
    .newCarSep{
        color:$black;height:.3rem;line-height:.3rem;position:relative;background:#fff;margin-top: .05rem;padding-left:.15rem;font-size: .13rem;
    }
    .more-new{
      font-size: .12rem;
      background: #fff;
      text-align: center;
      padding-bottom: .08rem;
      color: $red
    }
    .swiper-special{
      // margin-top: .05rem;
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
          @include flexJustify(space-between);
          @include flexAlign(flex-end);
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
    .swiper-pagination{}
      .swiper-pagination-bullet{
        background:#c5c5c5;
        width: .04rem;
        height: .04rem;
        border-radius:0
      }
      .swiper-pagination-bullet-active{background:#8a898f !important;}
}
</style>
