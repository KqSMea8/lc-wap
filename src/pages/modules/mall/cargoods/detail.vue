<template>
  <app-layout id="cargoodsDetail" class="goodsDetail">

      <!-- 轮播图 -->
      <div class="goodsImgs">
        <swiper v-if="pageData.images" :options="bannerSwiperOption" ref="goodsImg" style="height:100%">
          <swiper-slide v-for="(item,index) in pageData.images">
            <div :style="{'background-image':`url(${item})`}" :class="{'car-img':true,'swiper-lazy':index>1}"></div>
            <!-- <img :src="item" :data-src="index>1&&item" :class="index>1&&'swiper-lazy'"> -->
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>

        <div class="home-my">
          <router-link to="/home" >
            <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#icon-home'"></use>
            </svg>
          </router-link>
          <router-link to="/me" >
            <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#icon-personal'"></use>
            </svg>
          </router-link>
        </div>
        <div class="self-tag" v-if="pageData.isziti==1">门店自提</div>
      </div>

      <div class="goods-info" style="margin-bottom:.05rem" >
        <router-link v-if="pageData.miaosha" :to="`/mall/seckill?key=${gid}&type=${pageData.miaosha.status=='wait'?'next':'current'}`">
          <div class="arrow-link seckill" >
            <p class="title">天天秒杀<span>{{pageData.miaosha.status=='wait'?`秒杀价：￥${parseFloat(pageData.miaosha.price)}`:'抢购中'}}</span></p>
            <div class="time">
              <p>距离本场{{pageData.miaosha.status=='wait'?'开始':'结束'}}</p>
              <div>
                <span class="num">{{$countDown(second*1000)[0]}}</span>
                <em>:</em>
                <span class="num">{{$countDown(second*1000)[1]}}</span>
                <em>:</em>
                <span class="num">{{$countDown(second*1000)[2]}}</span>
              </div>
            </div>
          </div>
        </router-link>
        
        <div class="base">
          <h1>{{pageData.title}}</h1>
          <h2>{{pageData.sub_title}}</h2>
          <ul v-if="pageData.servicetype&&pageData.servicetype=='install'">
            <li >包安装</li>
          </ul>
          <div class="price">
            <div>
              ￥{{pageData.miaosha&&pageData.miaosha.status!='wait'?parseFloat(pageData.miaosha.price):parseFloat(pageData.price)}}
              <del style="margin-left:.05rem;" v-if="pageData.miaosha&&pageData.miaosha.status!='wait'">￥{{parseFloat(pageData.price)}}</del>
            </div>
          </div>
        </div>

        <div v-if="pageData.itemproperty" class="arrow-link profit" @click="showProfitsDetail=true">
          <div v-for="(item,index) in pageData.itemproperty" v-if="index<3">{{item.ctitle}}</div>
        </div>

        <div class="coupon-popup" v-if="coupons.length>0&&(!pageData.miaosha||pageData.miaosha.status=='wait')">
            <div class="arrow-link switch" @click="showCoupon=true">
              <h1 class="has-icon">领取优惠券</h1>
            </div>
        </div>
        
        <div v-if="pageData.status!=='kucunbuzu'&&pageData.status!=='xiajia'&&hasStore" class="arrow-link" @click="showoriginal?$toast('商品已达限制购买数量'):openSku('')">
          <h1>{{skusName.length>0?'已选： '+skusName.join(' ')+' '+amount+'件':'请选择数量规格'}}</h1>
        </div>
      </div>

      <div class="appraise goods-info" v-if="comments.length>0">


        <router-link tag="div" :to="commentData.totalNums>3?'/mall/cargoods/comments/'+gid:''" :class="commentData.totalNums>3?'arrow-link':'arrow-link no-link'" style="line-height:.35rem;height:.35rem;"><h1>用户评价 {{commentData.totalNums>0?`(${commentData.totalNums})`:''}}</h1><lc-rate style="margin-right: .2rem;" disabled :size=".12" v-model="commentData.scoreInfo.compScore"></lc-rate></router-link>
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
          <router-link v-if="commentData.totalNums>3" class="all" :to="'/mall/cargoods/comments/'+gid">查看全部点评 ></router-link>
      </div>

      <mt-navbar v-model="detail">
        <mt-tab-item id="doc">图文详情</mt-tab-item>
        <mt-tab-item id="qa">常见问题</mt-tab-item>
      </mt-navbar>

      <div class="detail" v-if="detail=='doc'"  v-html="pageData.wap_desc"></div>
      <div class="detail" v-if="detail=='qa'"  v-html="pageData.shop_request"></div>



    <div slot="footer" class="btns">
        <router-link class="left" tag="button" :to="'/onlineHelp?actUrl='+encodeURIComponent('https://static.meiqia.com/dist/standalone.html?_=t&eid=38740&groupid=846de8917f52c53f0207d5c7e1c7c5e4')"><img src="~assets/img/mall/icon_detail_tab_service.png"><span>客服</span></router-link>
        <button class="left" v-if="!pageData.isfastbuy" @click="goCart"><img src="~assets/img/mall/icon_detail_tab_shoppingcart.png"><span>购物车</span><i>{{pageData.cartcount>=100?'99+':pageData.cartcount}}</i></button>
        <button class="left" @click="collect"><div :class="{on:pageData.itemCollect}" ></div><span>收藏</span></button>

        <div class="right">
          <template v-if="!['kucunbuzu','xiajia'].includes(pageData.status)">
            <button class="yellow" @click="openSku('cart')" v-if="!pageData.isfastbuy">加入购物车</button>
            <button class="orange" @click="openSku('order')">立即购买</button>
          </template>
          <button class="dis" v-if="pageData.status==='kucunbuzu'">库存不足</button>
          <button class="dis" v-if="pageData.status==='xiajia'">商品已下架</button>
        </div>
    </div>
    <div slot="footer" class="limit-footer" @click="originalPrice" v-if="showoriginal&&pageData.miaosha">{{pageData.miaosha.hasbuynum>=pageData.miaosha.limitbuynum?'您已达限制购买数量':'秒杀库存已抢完'}}，点击查看原价购买</div>

    <take-coupon slot="aside" :gid="gid" v-model="showCoupon" :coupons="coupons"></take-coupon>

    <mt-popup slot="aside" v-model="showProfitsDetail" position="bottom" style="width:100%;">
      <div class="profitsDetail">
        <h1>权益服务</h1>

        <ul class="page-content">
          <li v-for="item in profitsDetail">
            <h2>{{item.title}}</h2>
            <p>{{item.content}}</p>
          </li>
        </ul>
      </div>
    </mt-popup>


    <mt-popup slot="aside" v-model="showSku" position="bottom" style="width:100%;" v-if="!['kucunbuzu','xiajia'].includes(pageData.status)">
      <div v-if="pageData.images" class="sku">
          <img class="goodsImg" :src="pageData.images[0]">
          <span class="price" v-if="Object.keys(skuIds).length>0">￥{{parseFloat(skuIds[skus.join('_')].price)}}</span>
          <p class="tip">请选择商品规格</p>
          <div class="page-content">
              <template v-if="pageData.spec">   
                <div v-for="(item,index) in pageData.spec.specName">
                  <h1>{{item.name}}</h1>
                  <span :class="skus[index]===child.spec_value_id?'on':''" v-for="child in item.child" @click="selectSku(index,child.spec_value_id,child.spec_value)">{{setSkuName(index,child.spec_value_id,child.spec_value)}}</span>
                </div>
              </template>
              <div v-if="pageData.item_type=='cargoods'&&pageData.isziti==1">
                <h1>提货方式</h1>
                <span class="on">电子兑换码</span>
              </div>
              <div v-if="pageData.item_type=='cargoods'&&pageData.servicetype=='install'">
                <h1>服务<em>*请到门店提货安装</em></h1>
                <span class="on">4s店免费安装</span>
              </div>
              <div v-if="pageData.item_type=='cargoods'&&pageData.isziti==1">
                <h1>提货门店</h1>
                <div :class="{'arrow-link':pageData.zitilist.length>1, 'ziti-box':true}" @click="pageData.zitilist.length>1?showStores=true:''">
                  <svg class="icon" aria-hidden="true">
                      <use :xlink:href="'#icon-sstore'"></use>
                  </svg>
                  <em v-if="selectedStore.id">{{selectedStore.title}}</em>
                  <em v-else>请选择提货门店</em>
                </div>
              </div>
              <div>
                <h1>数量<em v-if="pageData.miaosha&&pageData.miaosha.status=='start'">(活动限购{{pageData.miaosha.limitbuynum}}件)</em></h1>
                <div class="amount">
                  <button @click="reduceNum">-</button>
                  <input type="tel" v-model="amount" readonly>
                  <button @click="addNum">+</button>
                </div>
              </div>
          </div>

          <div class="next">
            <template v-if="!['kucunbuzu','xiajia'].includes(pageData.status)&&hasStore">
              <button class="yellow" @click="addToCart" v-if="!pageData.isfastbuy&&!next">加入购物车</button>
              <button class="orange" @click="order" v-if="!pageData.isfastbuy&&!next">立即购买</button>

              <button class="ok" @click="confirm" v-if="pageData.isfastbuy||next">确 认</button>
            </template>

            <button class="dis" v-if="pageData.status==='kucunbuzu'||!hasStore">库存不足</button>
            <button class="dis" v-if="pageData.status==='xiajia'">已下架</button>
          </div>
          
      </div>
    </mt-popup>

    <mt-popup slot="aside" v-model="showStores" position="bottom" style="width:100%;">
      <div class="fourS">
        <h1>提车门店</h1>

        <ul class="page-content">
          <li v-for="item in stores.city">
            <h3>{{item}}</h3>
            <store-info v-for="store in stores[item]" :selected="selectedStore.id===store.id" @select="selectStore(store)" :data="{name:store.title,address:store.address,lat:store.lat,lng:store.lng,phone:store.tel,goucheyouhui:store.goucheyouhui}"></store-info>
          </li>
        </ul>
        
      </div>
    </mt-popup>
  </app-layout>
</template>

<script>
import TakeCoupon from 'components/coupon/take'
export default {
  components:{
      'take-coupon':TakeCoupon,
  },
  data() {
    return {
      profile:require('assets/img/default_user.png'),
      //通用
        gid:'',
        amount:1,
        pageData: {},
        next:'',

        cart:[],

        pulling:false,
        detail:'doc',
        detailHtml:'',
        detailLoaded:false,
        bottomPullText:'上拉查看图文详情',

        showProfitsDetail:false,
        profitsDetail:[],

        bannerSwiperOption: {
            autoplay: 5000,
            autoplayDisableOnInteraction: false,
            speed: 500,
            loop: true,
            lazyLoading: true,
            lazyLoadingOnTransitionStart: true,
            pagination: '.swiper-pagination'
        },

        showCoupon:false,

        //车品
        showSku:false,
        skus:[],//选中的sku id
        defaultSkusName:[],
        skusName:[],//选中的sku名称
        skuIds:{},//sku 组合id
        hasStore:true,
        coupons:[],
        commentData:{},
        comments:[],
        cleartime:'',
        second:null,
        showoriginal:false,

        showStores:false,
        stores:{},
        selectedStore:{},
    };
  },
  computed: {
    swiper() {
      return this.$refs.goodsImg.swiper
    }
  },
  watch:{
    showProfitsDetail(val){
      if(val&&this.profitsDetail.length===0){
        this.getProfitsDetail();
      }
    },
    amount(val){
      if(val===''||val<=0){this.amount=1;}
      
    }
  },
  mounted(){
    eventBus.$on('loggedIn', ()=>{

      this.getPageData();

    });
    eventBus.$on('reloadDetail', ()=>{
      this.resetPage();
    });
  },
  activated() {
    
    if(!this.gid){
      let id=this.$route.params.id;
      this.gid=id;
      this.getPageData();
      this.getCoupon()
      this.loadcomment()
    }
  },
  // beforeRouteEnter: (to, from, next) => {
  //   if(/pay/.test(from.path)){

  //     next((vm)=>{
  //       vm.resetPage()
  //       // vm.showoriginal=true;
  //     })
  //   }else{
  //     next()
  //   }
  // },
  beforeRouteLeave(to,from,next){
    if(!/(order|signUp)$/.test(to.path)){
      clearInterval(this.cleartime)
      this.resetPage(next);
    }else{
      next();
    }
  },
  methods: {
    previewImg(img){
        var that = this;
        wx.ready(function () {
            wx.previewImage({
                current: img, // 当前显示图片的http链接
                urls: that.pictureArr // 需要预览的图片http链接列表
            })
        })
        
    },
    originalPrice(){  //点击购买原价
      clearInterval(this.cleartime)
      this.$delete(this.pageData,'miaosha')
      this.showoriginal=false
    },
    addNum(){  //添加数量
      if(this.pageData.miaosha&&this.pageData.miaosha.status=='start'){
        // if(this.pageData.miaosha.store<=this.amount){
        //   return
        // }
        if(this.skuIds[this.skus.join('_')].store<=this.amount){
          this.amount=this.skuIds[this.skus.join('_')].store;
          
          return
        }
        if(this.pageData.miaosha.store-this.pageData.miaosha.freez<=this.amount){
          this.amount=this.pageData.miaosha.store-this.pageData.miaosha.freez;
          return
        }
        
        if(this.pageData.miaosha.limitbuynum-this.pageData.miaosha.hasbuynum<=this.amount){
          this.amount=this.pageData.miaosha.limitbuynum-this.pageData.miaosha.hasbuynum;
          this.$toast(`秒杀活动商品每人限购${this.amount+this.pageData.miaosha.hasbuynum}件`)
          return
        }
      }
      if(this.skuIds[this.skus.join('_')].store<=this.amount){
        return
      }
      this.amount=this.amount+1
    },
    reduceNum(){  //减少数量
      this.amount>1?this.amount=this.amount-1:''
    },
    async getCoupon(){
        
      // this.$login(async ()=>{
          if(!this.$cache.user.memberId) return
          let d={
              content: {
                  memberId: this.$cache.user.memberId,
                  mobile:this.$cache.user.phone,
                  apiType:'GET_CANRECEIVE_COUPON_ONLINE',
                  id:this.gid
              },
              
          };
          let res= await this.$post('/couponSys/appcoupon/getList.json', d);
          if (res.errcode === 0) {
              this.coupons = res.content.couponList||[];
          }
      // });
        
    },
    confirm(){

      // return
      switch (this.next) {
        case 'cart':
            this.addToCart();
        break;
        case 'order':
          this.order();
        break;
        default:
          this.showSku=false;
          break;
      }
    },
    order(){

        if(!this.selectedStore.id&&this.pageData.isziti==1){
          this.showStores=true
          return
        }
        
        this.showSku=false;
        let path='/mall/order?sid='+this.skuIds[this.skus.join('_')].id+'&num='+this.amount;
        if(this.pageData.zitilist){
          path+='&zid='+this.selectedStore.id;
        }
        this.$router.push(path);
    },
    resetPage(callback){
      this.gid='';
      this.amount=1;
      this.pageData={};
      this.next='';
      this.detail='doc';
      this.detailHtml='';
      this.detailLoaded=false;
      this.bottomPullText='上拉查看图文详情';
      
      this.showProfitsDetail=false;
      this.profitsDetail=[];

      this.showCoupon=false;

      this.showSku=false;
      this.skus=[];
      this.defaultSkusName=[];
      this.skusName=[];
      this.skuIds={};

      this.stores={};
      this.showStores=false;
      this.selectedStore={};
      this.showoriginal=false
      if(callback){
        callback();
      }
      
    },
    selectStore(store){
      this.selectedStore=store;
      this.showStores=false;
    },
    openSku(next){
      this.$login(()=>{
          this.next=next;
          this.showSku=true;
      });
    },
    selectSku(index,id,name){ 
      this.skus.splice(index,1,id);
      this.skusName.splice(index,1,name);
      this.hasStore=this.skuIds[this.skus.join('_')].hasStore;

      if(this.amount>=this.skuIds[this.skus.join('_')].store){
        this.amount=this.skuIds[this.skus.join('_')].store
      }
    },
    goCart(){
      this.$router.push('/mall/cart');
    },
    addToCart(){
      this.$login(async ()=>{
          let user=this.$cache.user,
            data={
              content:{
                sku_id:this.skuIds[this.skus.join('_')].id,
                quantity:this.amount,
                mbeid:user.memberId,
                mobile:user.phone
              }
          }
          let res= await this.$post('/mall29/cart-add.html', data);
          if (res.errcode === 0) {
            this.pageData.cartcount+=this.amount;
            this.showSku=false;
            this.$toast('已加入购物车');
          }
      });
    },
    collect(){
      this.$login(async ()=>{
        if(this.pageData.itemCollect){
          let user=this.$cache.user,
            data={
              content:{
                item_id:this.gid,
                mbeid:user.memberId,
                mobile:user.phone
              }
          }
          let res= await this.$post('/mall29/collectremove.html', data);
          if (res.errcode === 0) {
            this.pageData.itemCollect=false;
          }
        }else{
          let user=this.$cache.user,
            data={
              content:{
                item_id:this.gid,
                mbeid:user.memberId,
                mobile:user.phone
              }
          }
          let res= await this.$post('/mall29/collect.html', data);
          if (res.errcode === 0) {
            this.pageData.itemCollect=true;
          }
        }
      });
    },
    async getProfitsDetail(){
      let data=[],
          profits=this.pageData.itemproperty;
      for (let i = 0; i < profits.length; i++) {
        data.push(profits[i].pkid);
      }

      let res = await this.$post('/mall29/itemright.html', {content:{right_id:data.join(',')}});
      if (res.errcode === 0) {
        this.profitsDetail = res.content.list;
      }
    },
    loadDetailHtml(){
      this.detailLoaded=true;
      this.detailHtml=this.pageData.wap_desc;
      this.$refs.loadmore.onBottomLoaded();
      this.pulling=false;
    },
    handleBottomChange(status){
      if(!this.detailLoaded){
        if(status==='pull'){
          this.pulling=false;
          this.bottomPullText='上拉加载图文详情';
        }else{
          this.pulling=true;
          this.bottomPullText='释放查看图文详情';
        }
      }
    },
    async getCart () {
      let user=this.$cache.user,
        data = {
          content:{
            mbeid:user.memberId||'',
            mobile:user.phone||''
          }
        };

      let res = await this.$post('/mall29/cart-list.html', data);
      if (res.errcode === 0) {
        this.cart = res.content.cartData.items;
      }
    },
    setSkuName(index,id,name){
      if(!this.skusName[index]&&this.skus[index]==id){
        this.skusName[index]=name;
      }
      return name;
    },
    async getPageData () {
      let user=this.$cache.user,
        data = {
          content:{
            item_id:this.gid,
            mbeid:user.memberId||'',
            mobile:user.phone||''
          }
        };

      let res = await this.$post('/mall29/itemdetail.html', data);

      if (res.errcode === 0) {

        let con=res.content;
        
        let shareData={
            share_title:con.title,
            share_desc:con.sub_title,
            share_img:con.images[0],
            share_url:location.origin+'/wxwap?#'+this.$route.fullPath
        }
        this.$utils.shareConfig(shareData);

        let spec=con.spec;
        if(spec){
            
            let ids=spec.specSku,
              defaultSkus=[],
              skuIds={},
              ii;

            for(let i=0;i<ids.length;i++){
              ii=ids[i];

              if(ii.store>0){
                skuIds[ii.spec_id]={
                    id:ii.sku_id,
                    price:con.miaosha&&con.miaosha.status=='start'?ii.miaosha_price:ii.price,
                    hasStore:true,
                    store:ii.store
                  };

                if(defaultSkus.length===0){
                  defaultSkus=ii.spec_ids;
                }
              }else{
                skuIds[ii.spec_id]={
                    id:ii.sku_id,
                    price:con.miaosha&&con.miaosha.status=='start'?ii.miaosha_price:ii.price,
                    hasStore:false,
                    store:0
                };
              }
            }

            let skus=spec.specName,
              defaultSkusName=[],
              ci,
              cij;

            for(let i=0;i<skus.length;i++){
              ci=skus[i].child;
              for(let j=0;j<ci.length;j++){
                cij=ci[j];
                if(defaultSkus.includes(cij.spec_value_id)){
                  defaultSkusName.push(cij.spec_value);
                }
              }
            }

            let fourS=con.zitilist||[],
                fi,
                stores={
                  city:[]
                };

            for(let i=0;i<fourS.length;i++){
              fi=fourS[i]
              if(stores.city.includes(fi.cityname)){
                stores[fi.cityname].push(fi);
              }else{
                stores.city.push(fi.cityname);
                stores[fi.cityname]=[fi];
              }
            }

            if(fourS.length==1){
              this.selectStore(fourS[0])
            }
            this.stores=stores;
            this.skus=defaultSkus;
            this.defaultSkusName=defaultSkusName;
            this.skusName=defaultSkusName;
            this.skuIds=skuIds;

        }
        this.pageData=con;
        if(con.miaosha){
          
          if(['kucunbuzu','xiajia'].includes(con.status)){
            this.$delete(this.pageData,'miaosha')
            return
          }
          if(con.miaosha.status=='end'){
            this.showoriginal=true;
          }
          this.second = con.miaosha.second;
          clearInterval(this.cleartime)
          this.cleartime=setInterval(()=>{  
              this.second=this.second-1;
              if(this.second<=0){
                clearInterval(this.cleartime)
                this.$delete(this.pageData,'miaosha')
              }
          },1000)
        }
      
      }
    },
    async loadcomment(){
      let data={
        content:{
              queryId:this.gid,
              queryType:3,
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
      }
  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsDetail.scss";
  @import "~assets/css/coupon/popup.scss";
  .appraise{background:#fff;margin-bottom:.05rem !important;
    .all{
      display: block;
      text-align: center;
      line-height: .4rem;
      font-size: 0.12rem;
      color: #88888d;
      border-top: 1px solid rgba(237, 237, 237, 0.8);
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
  
</style>
