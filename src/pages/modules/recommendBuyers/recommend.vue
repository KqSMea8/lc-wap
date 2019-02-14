<template>
  <app-layout id="recommendBuyersRecommend">

        <ul class="card">
          <li>
            <label>{{txts.name||''}}<span>*</span></label>
            <input class="item-val" type="text" :placeholder="txts.nameTip||''" v-model="name">
          </li>
          <li>
            <label>{{txts.phone||''}}<span>*</span></label>
            <input class="item-val" type="tel" :placeholder="txts.phoneTip||''" v-model="phone">
          </li>
        </ul>

        <ul class="card">
            <li :class="type=='1'?'arrow':''">
              <label>{{txts.fourS||''}}<span>*</span></label>
              <router-link :to="`${type=='1'?'/recommendBuyers/fourS':''}`" class="item-val" :style="fourS=='请选择'?'color:#777':''">{{type=='1'?fourS:usedCarStore.usedCarStoreName}}</router-link>
            </li>
            <template v-if="type=='1'">
              <li v-if="fourS!='请选择'" class="arrow">
                <label>销售顾问</label>
                <router-link to="/salesConsultant" class="item-val" :style="salesConsultant=='请选择(选填)'?'color:#777':''">{{salesConsultant}}</router-link>
              </li>
              <li v-if="fourS!='请选择'" class="arrow">
                <label>意向车系</label>
                <router-link to="/recommendBuyers/brands" class="item-val" :style="car=='请选择意向车型'?'color:#777':''">{{car}}</router-link>
              </li>
            </template>
            <template v-else>
              <li>
                <label>销售顾问</label>
                <input type="text" placeholder="请选择(选填)" style="text-align:right" v-model="usedConsultant">
              </li>
              <li>
                <label>意向车系</label>
                <input type="text" placeholder="请选择(选填)" style="text-align:right"  v-model="brandName">
              </li>
            </template>
        </ul>

        <ul class="card">
          <li class="txtArea">
                <label>备注</label>
                <textarea placeholder="有其他购车意向可以填写在这里哦~" v-model="remark"></textarea>
          </li>
        </ul>
        <a href="https://yz.souche.com/?__mobile=true">
          <img v-if="type==2" src="/CRM/WeChat/App/static/img/recommendBuyers/esbanner.jpg" style="width: 100%;" alt="">
        </a>
        <div class="btns" slot="footer">
            <button class="share" v-on:click="share" v-if="!$route.query.id">转发朋友代填</button>
            <button class="submit" v-on:click="sub">立即提交</button>
        </div>
        
        <img v-if="wxInvite" src="/CRM/WeChat/App/static/img/invite.png" class="invite-tip" v-on:click="wxInvite=false">

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        txts:{},
        defaultTxts:{
          name:'客户姓名',
          nameTip:'您要推荐的客户姓名',
          phone:'客户电话',
          phoneTip:'您要推荐的客户手机号码',
          fourS:'推荐4S店'
        },
        shareTxts:{
          name:'姓名',
          nameTip:'请输入您的姓名',
          phone:'电话',
          phoneTip:'请输入您的手机号码',
          fourS:'选择4S店'
        },

        name:'',
        phone:'',
        fourS:'请选择',
        car:'请选择(选填)',
        salesConsultant:'请选择(选填)',
        consultantId:'',
        remark:'',
        areaVisible:false,

        wxInvite: false,
        type:'',
        usedCarStore:{},
        usedConsultant:'',
        brandName:''
      };
      
    },
    watch: {
      fourS(val) {
        if (val!=='请选择要推荐的4S店') {
          this.car='请选择意向车型';
          this.salesConsultant='请选择(选填)';
          this.consultantId='',
          this.$cache.brand = {};
          this.$cache.salesConsultant={};
        }
      }
    },
    activated(){
      if(this.$route.query.id){
        this.$utils.setAppTitle('报名信息填写');
      }else{
        this.$utils.setAppTitle('推荐信息填写');
      }
      
      this.txts=this.$route.query.id?this.shareTxts:this.defaultTxts;
      this.type=this.$route.query.type
      let s=this.$cache,
          fourS=s.fourS.name,
          brand=s.brand,
          salesConsultant=s.salesConsultant.name,
          // usedCarStore=s.usedCarStore,
          consultantId=s.salesConsultant.id;
      let usedCarStore = JSON.parse(sessionStorage.getItem('usedCarStore'))
      if(fourS){this.fourS=fourS;}
      if(salesConsultant){this.salesConsultant=salesConsultant;}
      if(usedCarStore){this.usedCarStore=usedCarStore}
      if(consultantId){this.consultantId=consultantId;}
      if(brand.bname){this.car=(brand.bname+' '+brand.sname);}
      if(this.type==2){
        this.fourS=usedCarStore.usedCarStoreName;
      }
    },
    beforeRouteLeave (to,from,next){
      if(to.path=='/recommendBuyers'){
        this.resetPage();
        this.$cache.fourS = {};
        this.$cache.brand = {};
      }
      next();
    },
    methods: {
      resetPage(){
        this.name='';
        this.phone='';
        this.fourS='请选择';
        this.car='请选择(选填)';
        this.salesConsultant='请选择(选填)';
        this.consultantId='';
        this.remark='';
        this.areaVisible=false;
        this.usedCarStore={}
      },
      hasNull(){
       if(this.name===''){
         this.$toast('请输入姓名');
         return true;
       }

       if(this.phone===''){
         this.$toast('请输入手机号码');
         return true;
       }else if(!/^1[3456789]\d{9}$/.test(this.phone.replace(/\s/g,''))){
         this.$toast('手机号码格式有误，请检查');
         return true;
       }

       if(this.fourS==='请选择要推荐的4S店'){
         this.$toast('请选择要推荐的4S店');
         return true;
       }

        return false;
      },
      share(){
        let shareData=this.$cache.recommendBuyersShareData;
            shareData.share_url=location.origin+'/wxwap?#/recommendBuyers/share/'+this.$cache.user.memberId+'?type='+this.type;

        this.$utils.shareConfig(shareData,'call');
        if (!isLecheng) {
          this.wxInvite = true;
        } 
      },
      async sub(){
        if(!this.hasNull()){
            let s=this.$cache,
                fourS=s.fourS.id,
                brand=s.brand;
                
            let data={
              content:{
                memberId:this.$route.query.id||s.user.memberId,
                customerName:this.name,
                customerPhone:this.phone,
                recommendFours:this.type=='1'?fourS:this.usedCarStore.usedCarStoreId,
                intentionCarBrand:brand.bid||'',
                intentionCarSeries:brand.sid||'',
                consultant:this.type=='1'?(this.salesConsultant=='请选择(选填)'?'':this.salesConsultant):this.usedConsultant,
                consultantId:this.consultantId,
                remark:this.remark,
                openId:this.$route.query.id?document.cookie.replace(/(?:(?:^|.*;\s*)openid\s*\=\s*([^;]*).*$)|^.*$/, "$1"):'',
                brandName:this.brandName||'',
                recommendType:this.type
              }};

            let res=await this.$post('/CRM/wechatrecommendbuycar/commitCustomerInfo.json',data);
            if(res.errcode==0){
              this.$messagebox.alert(this.$route.query.id?'报名成功':'推荐成功').then(action => {
                  this.$router.go(-1);
              });
            }
          }
      }
    }
  }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";

  #recommendBuyersRecommend{
    
    .card {
          margin: .05rem auto;
      li{border-bottom:$border;}
      li:not(.txtArea){@include box;height:.44rem;line-height:.44rem;padding:0 .12rem;}
      li:not(.txtArea) label{@include flex;}
      li.arrow{
        position:relative;padding-right:.20rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      
      li.txtArea{
          padding:.12rem;
          label{display: block;}
          textarea{text-align: left;color:$black;width:100%;line-height:.20rem;min-height:.60rem;}
      }

      li label span{color:red;}
      
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;height:.44rem;}

      input{height:100%;line-height:normal!important;}
    }

    .btns{@include box;height:.5rem;
        button{display: block;line-height:.5rem;color:#fff;}
        .share{@include flex(1.5);background:#f29600;;}
        .submit{@include flex(2.5);background:$red;}
    }
    
  }

</style>
