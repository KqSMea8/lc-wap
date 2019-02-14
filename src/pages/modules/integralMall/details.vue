<template>
  <app-layout id="integralMall_details" class="goodsDetail">
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

      <div class="goods-info mt1" >
        <div class="base">
          <h1>{{pageData.title}}</h1>
          <h2>{{pageData.sub_title}}</h2>
          <ul v-if="pageData.servicetype&&pageData.servicetype=='install'">
            <li>包安装</li>
          </ul>
          <div class="price">
            <div>
              <img v-if="jfinfo.usergrade==253&&jfinfo.priceLabel==1" class="vip-img" src="~assets/img/integralMall/label_detail_jinka.png">
              <img v-else-if="jfinfo.usergrade==254&&jfinfo.priceLabel==1" class="vip-img" src="~assets/img/integralMall/label_detail_zuanshika.png">
              <svg class="icon" aria-hidden="true" style="width:.14rem;">
                <use :xlink:href="'#icon-icon_integral'"></use>
              </svg><em class="jifen">{{jfinfo.itemjf}}{{parseFloat(jfinfo.itemprice)>0?` + ￥${jfinfo.itemprice}`:''}}</em>
            </div>
          </div>
        </div>

        <router-link tag="div"  :to="jfinfo.jftips.vipurl?'/helpCenter?actUrl='+encodeURIComponent(jfinfo.jftips.vipurl):''" class="profit" :class="{'arrow-link':jfinfo.jftips.hascondition==0}" v-if="jfinfo.jftips">
          <div :class="jfinfo.jftips.hascondition==0?'guide':'notice'">{{jfinfo.jftips.title}}</div>
        </router-link>
        
        <div v-if="false" class="arrow-link" @click="showoriginal?$toast('商品已达限制购买数量'):openSku('')">
          <h1>{{skusName.length>0?'已选： '+skusName.join(' ')+' '+amount+'件':'请选择数量规格'}}</h1>
        </div>
      </div>

      <div class="goods-detail mt1" v-if="jfinfo.discountconfig">
        <p>等级折扣差异</p>
        <ul class="difference">
          <li v-for="(item,index) in jfinfo.discountconfig" :class="{'cur':item.check==1}">
            <span class="level" v-if="item.grade==254">钻石卡会员</span>
            <span class="level" v-else-if="item.grade==253">金卡会员</span>
            <span class="level" v-else-if="item.grade==252">银卡会员</span>
            <span class="level" v-else-if="item.grade==251">普卡会员</span>
            <img  v-if="item.grade==254" src="~assets/img/integralMall/icon_integral_detail_zuanshika.png" alt="">
            <img v-else-if="item.grade==253" src="~assets/img/integralMall/icon_integral_detail_jinka.png" alt="">
            <img v-else-if="item.grade==252" src="~assets/img/integralMall/icon_integral_detail_yinka.png" alt="">
            <img v-else-if="item.grade==251" src="~assets/img/integralMall/icon_integral_detail_puka.png" alt="">
            <span>兑换积分{{item.jf}}{{parseFloat(item.price)>0?` + ￥${item.price}`:''}}</span>
          </li>
          
        </ul>
      </div>
      <template v-if="pageData.isvirtual==0">
        <router-link  class="part addr  arrow-link"  :to="'/address?id='+addr.id||''" :style="addr.id?'padding-left:.65rem':'margin-bottom:.05rem'">
          <div class="hasaddr" v-if="addr.id">送至</div>
          <div class="nulladdr" v-else></div>
          <h1>{{addr.id?(addr.consignee+'&nbsp;&nbsp;&nbsp;&nbsp;'+addr.mobilePhone):'设置收货地址'}}</h1>
          <p>{{addr.id?(addr.proviceName+addr.cityName+addr.areaName+addr.addressDetail):''}}</p>
        </router-link>
        <router-link v-if="addr.id"  class="mt1 part addr" to="/address" :style="addr.id?'padding-left:.65rem':''">
          <div class="hasaddr">运费</div>
          <h1>{{parseFloat(postfee)>0?'￥'+postfee:'包邮'}}</h1>
        </router-link>
      </template>
      
      <div class="goods-detail">
        <p>商品详情</p>
        <div class="detail" style="padding:0"  v-html="pageData.wap_desc"></div>
      </div>

    <div slot="footer" class="btns">
        <div class="right">
          
          <button class="dis" v-if="pageData.status==='yiduihuan'">您已兑换</button>
          <button class="dis" v-else-if="pageData.status==='kucunbuzu'">已兑完</button>
          <button class="dis" v-else-if="pageData.status==='xiajia'">商品已下架</button>
          <button class="dis" v-else-if="pageData.status==='jifenbuzu'">积分不足</button>
          <router-link tag="button" v-else-if="pageData.status==='dengjibugou'" :to="'/helpCenter?actUrl='+encodeURIComponent(jfinfo.jftips.vipurl)" class="orange" >如何获取兑换资格 ></router-link>
          <button v-else class="orange" @click="openSku('order')">立即兑换</button>
        </div>
    </div>

    <mt-popup slot="aside" v-model="showSku" position="bottom" style="width:100%;" v-if="!['kucunbuzu','xiajia'].includes(pageData.status)">
      <div v-if="pageData.images" class="sku">
        <img class="goodsImg" :src="pageData.images[0]">
        <div class="price"  v-if="Object.keys(skuIds).length>0">
          <svg class="icon" aria-hidden="true" style="width:.14rem;">
            <use :xlink:href="'#icon-icon_integral'"></use>
          </svg><span style="vertical-align: middle;">{{jfinfo.itemjf}}{{parseFloat(jfinfo.itemprice)>0?`+￥${parseFloat(jfinfo.itemprice)}`:''}}</span>
        </div>
        
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
        </div>

        <div class="next">
          <template v-if="!['kucunbuzu','xiajia'].includes(pageData.status)&&hasStore">
            <button class="ok" @click="confirm">确 认</button>
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

    <div class="dialog-bg" v-if="showExchange" :style="!isExchange?'z-index:9998':'z-index:10000'">
      <div class="exchange-dialog">
        <div class="close" @click="showExchange=false">×</div>
        <div class="top">
          <template v-if="!isExchange">
            <p>确定消耗<span>{{jfinfo.itemjf}}</span>积分兑换吗？</p>
          </template>
          <template v-else>
            <svg class="icon" aria-hidden="true" style="color:#91cd53" v-if="sucExchange">
              <use xlink:href="#icon-success_fill"></use>
            </svg>
            <svg class="icon" aria-hidden="true" style="color:#eb666b" v-else>
              <use xlink:href="#icon-failure1"></use>
            </svg>
            <p>{{sucExchange?'兑换成功':'兑换失败'}}</p>
            <span v-if="!sucExchange">{{errmsg}}</span>
          </template>
        </div>
        <div class="bottom" >
          <template v-if="!isExchange">
            <div @click="showExchange=false">取消</div>
            <div @click="trueExchange">确定</div>
          </template>
          <template v-else>
            <div v-if="!sucExchange" @click="showExchange=false">返回</div>
            <template v-else>
              <router-link tag="div" :to="`/orders/${sucno}`">查看详情</router-link>
              <div @click="shareTip=true;showExchange=false">分享</div>
            </template>
          </template>
        </div>
        
      </div>
    </div>

    <div class="share-bg" v-show="shareTip" @click="shareTip=false">
        <img src="/CRM/WeChat/App/static/img/helpRed/tip_share.png">
    </div>
  </app-layout>
</template>

<script>

export default {

  data() {
    return {
      profile:require('assets/img/default_user.png'),
      //通用
      gid:'',
      amount:1,
      pageData: {},
      jfinfo:{},
      next:'',
      addr:{},

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


      //车品
      showSku:false,
      skus:[],//选中的sku id
      defaultSkusName:[],
      skusName:[],//选中的sku名称
      skuIds:{},//sku 组合id
      hasStore:true,
      showoriginal:false,

      showStores:false,
      stores:{},
      selectedStore:{},
      showExchange:false, //显示兑换弹窗
      isExchange:false,  //是否是兑换失败获成功弹窗
      postfee:0,   //运费
      sucExchange:true,  //是否兑换成功
      errmsg:'',
      sucno:'',
      shareTip:false
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

  },
  mounted(){
    eventBus.$on('selectAddr',(data)=>{
      this.addr=data;

      this.getPostfee()
    })

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
      // if(this.$cache.user.memberId){
      //   this.getAddress();
      // }

    }
  },

  beforeRouteLeave(to,from,next){
    if(!/(order|address)$/.test(to.path)){
      clearInterval(this.cleartime)
      this.resetPage(next);
    }else{
      next();
    }
  },
  methods: {
    errorBack() {
      this.getPageData()
      this.showExchange=false
    },
    confirm(){
      // return
      switch (this.next) {
        
        case 'order':
          if(!this.addr.id&&this.pageData.isvirtual==0){
            this.$toast('请填写收货地址');
            this.showSku=false;
            return
          }
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
        this.showExchange = true;
  
    },

    async trueExchange(){
      let user=this.$cache.user;
      let  data=this.$sign({
          content:{
            orderType:'JF',
            items:[{itemid:this.gid,skuid:this.skuIds[this.skus.join('_')].id,num:this.amount,pType:'jifen'}],
            trade_memo:'',
            totalfee:this.jfinfo.itemprice,
            address_id:this.pageData.isvirtual==0?this.addr.id:'',
            receiver_mobile:this.pageData.isvirtual==0?user.phone:'',
            grade:this.jfinfo.usergrade,
            needCredit:this.jfinfo.itemjf
          }
      });
      let res= await this.$post('/CRM/api/commit.order.json', data,true);
      if (res.errcode === 0) {
        if(parseFloat(this.jfinfo.itemprice)>0||parseFloat(this.postfee)>0){
          this.showExchange = false;
          
          this.$router.push('/pay/'+res.content.no);
        }else{
          this.sucno = res.content.no;
          this.getPageData();
          this.sucExchange=true
        }
        
      }else{
        this.getPageData();
        this.errmsg = res.msg
        this.sucExchange=false
      }
      
      this.isExchange=true;
    },
    resetPage(callback){
      this.gid='';
      this.amount=1;
      this.pageData={};
      this.next='';
      
      this.showProfitsDetail=false;

      this.profitsDetail=[];

      this.showSku=false;
      this.skus=[];
      this.defaultSkusName=[];
      this.skusName=[];
      this.skuIds={};

      this.stores={};
      this.showStores=false;
      this.selectedStore={};
      this.showoriginal=false

      this.showExchange=false;
      this.errmsg=''
      this.sucno=''

      this.isExchange=false
      this.postfee=0
      this.sucExchange=true
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
        if(!this.addr.id&&this.pageData.isvirtual==0&&next&&this.pageData.spec.specSku.length==1){
          this.$toast('请填写收货地址');
          return
        }
        this.isExchange=false
        if(this.pageData.spec.specSku.length==1&&next){
          
          this.showExchange = true;

        }else if(this.pageData.spec.specSku.length>1){
          this.next=next;
          this.showSku=true;
        }
      });
    },
    selectSku(index,id,name){ 
      this.skus.splice(index,1,id);
      this.skusName.splice(index,1,name);
      this.hasStore=this.skuIds[this.skus.join('_')].hasStore;

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
            share_title:con.share.title,
            share_desc:con.share.desc,
            share_img:con.share.img,
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
                    price:ii.price,
                    hasStore:true,
                    store:ii.store
                  };

                
              }else{
                skuIds[ii.spec_id]={
                    id:ii.sku_id,
                    price:ii.price,
                    hasStore:false,
                    store:0
                };
              }
              if(defaultSkus.length===0){
                defaultSkus=ii.spec_ids; 
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
            if(this.$cache.user.memberId&&con.isvirtual==0){
              this.getAddress();
            }
        }
        this.pageData=con;
        this.jfinfo = con.jfinfo;
        
      }
    },
    async getAddress(){
      let user=this.$cache.user,
        data={
          content:{
            mbeid:user.memberId,
            mobile:user.phone
          }
      }
      let res= await this.$post('/mall29/addresslist.html', data);
      if (res.errcode === 0) {
        const list=res.content.list;
        const arr=list.filter((item)=>{
          return item.isDefault==1
        })
        this.addr=arr[0]||[]
        if(arr.length==1){
          this.getPostfee()
        }
      }
    },
    async getPostfee(){
   
      let user=this.$cache.user
      let data={
        content:{
          mbeid:user.memberId,
          num:this.amount,
          sku_id:this.skuIds[this.skus.join('_')].id,
          regionid:this.addr.proviceCode+','+this.addr.cityCode+','+this.addr.areaCode,
          sendtype:'express',
          mobile:user.phone
        }
      }
      let res= await this.$post('/mall29/getpostfee.html', data);
      if (res.errcode === 0) {
        this.postfee = res.content.post_fee;
        // this.postfee = res.content.post_fee>0?'￥'+res.content.post_fee:'包邮'
      }
    },
    
  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsDetail.scss";
  @import "~assets/css/coupon/popup.scss";
#integralMall_details{
  .share-bg{
        position: fixed;
        width: 100%;
        height: 100%;
        background:rgba(0,0,0,.7);
        left: 0;
        top: 0;
        z-index: 300;
        img{
            position: absolute;
            width: 2.05rem;
            height: 1.55rem;
            right: .45rem;
            top: .15rem;
        }
    }
  .mt1{margin-bottom:.05rem;}
  .exchange-dialog{width: 2.75rem;background:#fff;border-radius:.15rem;position: relative;top:50%;left:50%;transform:translate(-50%,-50%);color:#000;
    .close{ position: absolute;right: 0; top: 0;color: #88888d;font-size: .3rem;padding: .05rem .1rem;}
    .icon{width:.4rem;height:.4rem;margin-bottom: .1rem;}
    .top{padding:.2rem 0;
      p{font-size: .16rem;
      span{color:$red}}
      >span{font-size: .12rem;color:$gray;margin-top: .05rem;display: inline-block;}
    }
    .bottom{height: .52rem;border-top:1px solid #f2f2f2;@include box;@include flexAlign;
      div{@include flex;height: 100%;line-height:.52rem;
        &:nth-child(2n){
          color:#e84814;border-left: 1px solid #f2f2f2;
        }
      }
    }
  }
  .part{display:block;padding:.1rem .2rem;background: #fff;overflow: hidden;zoom:1;min-height:.24rem;line-height:.24rem;border-bottom:$border;
    h1{color:$black;display: inline-block;}
    div{float:right;color:$gray;margin-right:.1rem;}
    p{color:$gray;font-size:$h3;position: relative;@include txtOverflow;
      span{position:absolute;left:.75rem;top:0;}
    }
    input{width:2.4rem;}
  }
  .addr{padding:.1rem .3rem .1rem .5rem;position:relative;
    .nulladdr{width:.5rem;position:absolute;height:100%;left:0;top:0;background: url('~assets/img/icon-addr-new.png') no-repeat center;background-size:.15rem .19rem;}
    .hasaddr{float: left;position: absolute;left: .2rem;font-size: .13rem;}
  }
  .profit{height:.44rem;line-height: .44rem;padding:0 .2rem;}
}
  
</style>


