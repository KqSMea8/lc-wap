<template>
  <app-layout id="discoveryRefer">
    <div class="info" v-if="activity">
      <p class="title">{{activity.title}}</p>
      <div class="main">
        <img :src="activity.shareImg" alt="">
        <div class="con">
          <div>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-icon_activity_detail2'"></use>
            </svg>
            <span>{{activity.startTime}} - {{activity.endTime}}</span>
          </div>
          <div>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-icon_activity_detail3'"></use>
            </svg>
            <span>{{activity.areaName}}</span>
          </div>
          <div style="margin:0">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-icon_activity_detail'"></use>
            </svg>
            <span>{{activity.applyGrade==''?'适用所有会员':activity.applyGrade+'会员专享'}}</span>
          </div>
        </div>
      </div>
    </div>

    <ul  class="list-ul" v-for="(item,index) in specName">
      <li v-for="(child,inx) in item.child">
        <div class="top">
          <p class="left-p"><span class="left-span">{{child.spec_value}}</span></p>
          <em v-if="!skuIds[child.spec_value_id].hasStore">已满员</em>
          <div v-else>
            <span @click="reduceNum(skuIds[child.spec_value_id].num,index,inx,skuIds[child.spec_value_id].price,child.spec_value_id)">-</span>
            <input type="tel" v-model="skuIds[child.spec_value_id].num" readonly>
            <span @click="addNum(skuIds[child.spec_value_id].num,index,inx,skuIds[child.spec_value_id].price,child.spec_value_id)">+</span>
          </div>
        </div>
        <div class="bottom">{{parseFloat(skuIds[child.spec_value_id].price)==0?'免费':`￥${skuIds[child.spec_value_id].price}`}}</div>
      </li>
    </ul>
    <div class="card-coupon" v-if="pageData.promotion">
      <img v-if="this.$cache.user.level=='银卡'" src="~assets/img/discovery/label_activity_detail_yinka.png" alt="">
      <img v-else-if="this.$cache.user.level=='金卡'" src="~assets/img/discovery/label_activity_detail_jinka.png" alt="">
      <img v-else-if="this.$cache.user.level=='钻石卡'" src="~assets/img/discovery/label_activity_detail_zuanshika.png" alt="">
      <div>可享满{{pageData.promotion.full}}元减<span>{{pageData.promotion.minus}}元</span>报名优惠</div>
    </div>
    <div :style="!pageData.promotion?{'margin-top':'.1rem'}:''">
      <div class="part">
        <span>联系人<em>*</em></span>
        <input type="text" placeholder="请输入联系人姓名" v-model="name">
      </div>
      <div class="part">
        <span>联系电话<em>*</em></span>
        <input type="tel" placeholder="请输入联系人电话" v-model="tel">
      </div>
    </div>
    <div id="footer" slot="footer">
      总计：<span>{{pageData.promotion&&parseFloat(allPrice)>=parseFloat(pageData.promotion.full)?`￥${(parseFloat(allPrice)-parseFloat(pageData.promotion.minus)).toFixed(2)}`:parseFloat(allPrice)==0&&isSel?'免费':`￥${allPrice}`}}</span><del v-if="pageData.promotion&&parseFloat(allPrice)>=parseFloat(pageData.promotion.full)">￥{{allPrice}}</del>
      <button  class="next" @click="next">确定提交</button>
    </div>
  </app-layout>
</template>
<script>
export default {
  data(){
    return{
      activity:'',
      skuIds:null,
      specName:[],
      allPrice:'0.00',
      name:'',
      tel:'',
      pageData:'',
      isSel:false
    }
  },
  activated() {
    // this.activity = this.$cache.urlquery;
    this.skuIds=null;
    this.specName=[]
    this.name = this.$cache.user.name;
    this.tel = this.$cache.user.phone;
    this.getActivityDetail()


    

  },

  methods:{
    async next(){
      if(!this.isSel){
        this.$toast('请选择报名项目');
        return
      }
      if(this.name==''||this.tel==''){
         this.$toast('请完善联系方式');
         return
      }
      if(!/^1[3456789]\d{9}$/.test(this.tel)){
        this.$toast('手机号格式有误，请检查');
        return
      }
      let goods=[];
      let ci,cij;
      for(let i=0;i<this.specName.length;i++){
        ci=this.specName[i].child;
        for(let j=0;j<ci.length;j++){
          cij=ci[j];
          if(this.skuIds[cij.spec_value_id].num>0){
            let item={
              itemid:this.skuIds[cij.spec_value_id].item_id,skuid:this.skuIds[cij.spec_value_id].id,num:this.skuIds[cij.spec_value_id].num
            }
            goods.push(item)
          }
          
        }
      }

      // return
      let  data=this.$sign({
          content:{
            orderType:'FX',
            items:goods,
            totalfee:this.pageData.promotion&&parseFloat(this.allPrice)>=parseFloat(this.pageData.promotion.full)?(parseFloat(this.allPrice)-parseFloat(this.pageData.promotion.minus)).toFixed(2):this.allPrice,
            receiver_name:this.name,
            receiver_mobile:this.tel,
            consultantId: this.$route.query.sid||'',
            shareId:this.$route.query.osid||'',
            foursId:this.$route.query.fid||''
          }
      });

      let res= await this.$post('/CRM/api/commit.order.json', data);
      if (res.errcode === 0) {
        this.$cache.history.pop();
        if(parseFloat(this.allPrice)>0){
          this.$router.replace('/pay/'+res.content.no);
          eventBus.$emit('reloadDetail');
        }else{
          this.$router.replace('/paid/'+res.content.no);
        }
      }else if(res.errcode==1007){
        this.isSel=false
        this.allPrice=0
        this.getData()
      }
    },
    reduceNum(num,index,inx,price,id){
      if(num==0) return
      this.skuIds[id].num=num-1;
      this.allPrice=(parseFloat(this.allPrice)-parseFloat(price)).toFixed(2);
      this.hasSel()
    },
    addNum(num,index,inx,price,id){
      if(this.skuIds[id].store==num) return
      this.skuIds[id].num=num+1;
      this.allPrice=(parseFloat(this.allPrice)+parseFloat(price)).toFixed(2);
      this.hasSel()
    },
    hasSel(){
      let allnum=0;
      for(let i in this.skuIds){
        allnum+=this.skuIds[i].num
      }
      if(allnum>0){
        this.isSel=true
      }else{
        this.isSel=false
      }
      
    },
    async getActivityDetail(){
      let data={
        content:{
          id:this.$route.params.aid,
          memberId:this.$cache.user.memberId||'',
        }
      }
      let res=await this.$post('/CRM/appactivity/queryActivityDetail.json',data);
      if(res.errcode==0){
        this.activity = res.content;
        this.$utils.setAppTitle(res.content.title);
        var query = this.$route.fullPath.split('refer')[1]
        let shareData = {
          share_title:res.content.title,
          share_desc:res.content.description,
          share_img:res.content.shareImg,
          share_url:location.origin+'/wxwap?#/discovery'+query
        }
        this.$utils.shareConfig(shareData);
        this.getData();
      }
    },
    async getData() {
     
      let data={
        content:{
          mbeid:this.$cache.user.memberId,
          item_id:this.activity.itemId,
          mobile:this.$cache.user.phone
        }
      }
      let res=await this.$post('/mall29/itemdetail.html',data);
      if(res.errcode==0){
        let con=res.content;
        this.pageData=con;
        let spec=con.spec;
        if(spec){
          let ids=spec.specSku,
            skuIds={},
            ii;
          
          for(let i=0;i<ids.length;i++){
            ii=ids[i];

            if(ii.store>0){
              skuIds[ii.spec_id]={
                  item_id:ii.item_id,
                  id:ii.sku_id,
                  price:ii.price,
                  hasStore:true,
                  store:ii.store,
                  num:!this.skuIds?0:this.skuIds[ii.spec_id].num>ii.store?ii.store:this.skuIds[ii.spec_id].num
                };
                if(this.skuIds){
                  this.isSel=true
                  this.allPrice=(parseFloat(this.allPrice)+(parseFloat(skuIds[ii.spec_id].price)*skuIds[ii.spec_id].num)).toFixed(2);
                }
            }else{
              skuIds[ii.spec_id]={
                  item_id:ii.item_id,
                  id:ii.sku_id,
                  price:ii.price,
                  hasStore:false,
                  store:0,
                  num:0
              };
            }
          }
          
          this.skuIds=skuIds;
          this.specName=spec.specName;

          this.$nextTick(()=>{

              var num=document.querySelectorAll('.left-p').length;
              for(let i=0;i<num;i++){
                let widp=document.querySelectorAll('.left-p')[i].offsetWidth;
                let widspan=document.querySelectorAll('.left-span')[i].offsetWidth;
                let len=widspan-widp;
                if(len>0){
                  let myspan = document.querySelectorAll('.left-span')[i];
                  this.animateFunc(myspan,len)
                }
              }

          })
        }
      }
    },
    animateFunc(myspan,len){
      myspan.style.cssText=`left:${-len}px;transition:left ${len/50}s linear 1.5s;-webkit-transition:left ${len/50}s linear 1.5s;`;
      setTimeout(()=>{
        myspan.style.cssText=`left:0px;transition:left 0s linear;-webkit-transition:left 0s linear;`;
      },len*20+3000)
      setTimeout(()=>{
        this.animateFunc(myspan,len)
      },len*20+3001)
    }

  }
}
</script>
<style lang="scss" >
@import "~assets/css/var.scss";
.ceshi{
  width:1.9rem;overflow:hidden;height:.2rem;
  span{
    display: inline-block;white-space: nowrap;position: relative;left:0;top:0;
  }
}
  #discoveryRefer{
    
    color: #22222d;
    .info{
      background: #fff;padding:.15rem .2rem;
      .title{overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;}
      .main{
        @include box;margin-top:.15rem;
        img{width: .6rem;height: .6rem;margin-right: .2rem;}
        .con{
          color: $gray;font-size:.12rem;
          div{
            margin-bottom: .5em;
            .icon{width: .13rem;height: .13rem;}
            span{vertical-align: middle;display: inline-block;margin-left: .04rem;}
          }
        }
      }
    }
    .list-ul{
      padding: 0 .1rem;
      li{padding:.15rem;background: #fff;border-radius: .06rem;margin-top: .1rem;
        .top{
          @include box;
          @include flexJustify(space-between);
          p{line-height: .23rem;width: 1.9rem;overflow: hidden;height: .25rem;
            span{display: inline-block;white-space: nowrap;position:relative;left:0}
          }
          em{font-style:normal;color:$gray}
          div{border: 1px solid #cacaca;border-radius: .02rem;height:.23rem;font-size:0;text-align:center;
            span{width: .23rem;display: inline-block;font-size: .14rem;}
            input{width: .32rem;border-left: 1px solid #cacaca;;border-right: 1px solid #cacaca;font-size: .12rem;height: 100%;text-align:center;  border-radius: 0;}
          }
        }
        .bottom{color:$red;margin-top: .1rem;}
      }
    }
    .card-coupon{
      height: .4rem;padding: 0 .18rem;
      img{height: .14rem;vertical-align: middle;margin-right: .2rem;}
      div{display: inline-block;line-height: .4rem;font-size: .12rem;
        span{color: $red}
      }
    }
    .part{
      background: #fff;height: .45rem;line-height: .45rem;padding: 0 .2rem;margin-bottom:1px;
      em{color:$red }
      input{float: right;text-align: right}
    }
    #footer{height:.5rem;line-height: .5rem;background:#fff;padding-left:.2rem;font-size:$h2;border-top:$border;
      span{color:$red;}
      del{color: $gray;font-size: .13rem;margin-left: .08rem;}
      button{float:right;
        &.next{background:$red;height: 100%;width:1.1rem;color:#fff;}
        &.dis{background:#c9c9c9}
      }
    }
  }
</style>
