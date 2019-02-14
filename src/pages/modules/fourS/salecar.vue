<template>
  <app-layout id="carList" class="goodsList" >
    <div :class="'goods-list col1'" v-if="list.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false" >
      <router-link class="li" v-for="item in list" :to="'/mall/salecar/'+item.item_id+'?storeId='+subshop_id+'&isSwitch=0'" >
        <div class="logo">
          <img v-lazy.appMain="item.img">
          <span  v-if="item.store==0">卖光啦</span>
        </div>
        
        <div class="detail-box">
          <h1>{{item.title}}</h1>
          <!-- <p>{{item.sub_title}}</p> -->
          
          <h3>指导价：<del>￥{{parseFloat(item.zdprice)}}万</del></h3>
          <div class="special-price">
            <h2 style="display:flex;display:-webkit-flex"><img class="icon-pricecar" src="~assets/img/mall/icon_detail_1pricecar.png"/><span>￥{{parseFloat(item.fixedprice)}}万</span></h2>
            <h3 style="color:#22222d" v-if="item.store>0">限量<span>{{parseFloat(item.store)}}</span>台</h3>
          </div>
        </div>
      </router-link>
      <lc-nomore v-show="nomore&&totalPages<=pageNo"></lc-nomore>
    </div>

    <div v-if="list.length===0" class="lc-error">
        <img src="~assets/img/mall/icon_goods_empty.png">
        <p>没有符合条件的商品</p>
    </div>
  </app-layout>
</template>

<script>
export default {
  data(){
    return{
      list:[],
      pageNo:1,
      nomore:false,
      subshop_id:'',
    }
  },
  activated(){
    this.list=[];
    this.pageNo=1;
    this.nomore=false;
    this.subshop_id=this.$route.params.id
    this.loadMore();
    
  },
  methods:{
    async loadMore() {
        let vm=this;
        vm.nomore = true;
        let isCid=/^\d+$/.test(this.cid);

        let data = {
            content: {
              subshop_id:this.subshop_id,
              itemtype:'salecar',
              pageNo:vm.pageNo,
              pageSize:vm.pageSize,
              cat_id:'',
              brand_id:'',
              searchkey:'',
              pricestart:'',
              priceend:'',
              order:'',
            }
        };

        let res=await vm.$post('/mall29/itemlist.html', data);
        if (res.errcode === 0) {
          vm.list = vm.list.concat(res.content.list);
          vm.totalPages=res.content.totalPages;
          if (res.content.totalPages > vm.pageNo) {
            vm.nomore = false;
            vm.pageNo += 1;
            
          }
        }
    },
  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsList.scss";
</style>