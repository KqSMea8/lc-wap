<template>
  <app-layout id="integralMall_exchangelist" class="goodsList" >
    <!-- <template slot-scope="slotProps"> -->
    <lc-filter slot="header" type="car" :sort.sync="sort" ></lc-filter>

    <div class='goods-list col1' v-if="list.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">

      <li class="li" v-for="item in list" @click="goDetails(item.item_id)">
        <div class="logo">
          <img v-lazy.appMain="item.img">

        </div>
        <div  class="detail-box" style="width:1.6rem">
          <h1>{{item.title}}</h1>
          <ul>
            <li v-if="item.jfinfo.jftips&&item.jfinfo.jftips.title">{{item.jfinfo.jftips.title}}</li>
          </ul>
          <h2>
            <svg class="icon" aria-hidden="true" style="width:.15rem;">
              <use :xlink:href="'#icon-icon_integral'"></use>
            </svg><span style="vertical-align: middle">{{item.jfinfo.itemjf}}{{parseFloat(item.jfinfo.itemprice)>0?`+￥${item.jfinfo.itemprice}`:''}}</span></h2>
        </div>
        <div class="exchange dis" v-if="item.status=='yiduihuan'">已兑</div>
        <div class="exchange dis" v-else-if="item.status=='kucunbuzu'">兑完</div>
        <div class="exchange" v-else>兑换</div>
      </li>
      <lc-nomore v-show="nomore&&totalPages<=pageNo"></lc-nomore>
    </div>

    <div v-if="list.length===0" class="lc-error">
        <img src="~assets/img/mall/icon_goods_empty.png">
        <p>没有符合条件的商品</p>
    </div>
    
    <template slot-scope="slotProps" slot="backtop" v-if="slotProps.scrolltop>0">
      <lc-backtop></lc-backtop>
    </template>
      
   
  </app-layout>
</template>

<script>
import filter from 'components/mall/filter'
export default {
  components:{
    'lc-filter':filter
  },
  props:['scrolltop'],
  data() {
    return {
      cid:'',

      list:[],
      pageNo: 1,
      pageSize: 10,
      nomore: false,
      totalPages:1,
      st:0,
      sort:'default',

    };
  },
  watch:{
    sort(val){
        this.refresh();
        this.loadMore();
    }
  },

  activated(){
    if(this.list.length===0){

      this.loadMore();

    }else if(this.st != 0) { 
      this.$el.children.appMain.scrollTop = this.st;
    }
  },
  beforeRouteLeave(to, from, next) {
    if(!/integralMall\//.test(to.path)){
      this.resetPage(next);
    }else{
      this.st = this.$el.children.appMain.scrollTop;
      next();
    }
  },
  methods:{
    goDetails(id){
      if(isLecheng){
        this.$utils.goNative('jifen',id);
      }else{
        this.$router.push('/integralMall/details/'+id)
      }

    },
    refresh(){
      this.list=[];
      this.pageNo=1;
      this.nomore=false;
    },
    resetPage(callback){
      this.cid='';

      this.list=[];
      this.pageNo=1;
      this.nomore=false;
      this.st=0;

      this.sort='default';


      callback();
    },
    
    
    filter(){
      this.refresh();
      this.loadMore();
    },

    async loadMore() {
        let vm=this;
        vm.nomore = true;
        let isCid=/^\d+$/.test(this.cid);

        let data = {
            content: {
              itemtype:'jifen',
              mobile:this.$cache.user.phone||'',
              mbeid:this.$cache.user.memberId||'',
              jflisttype:'myself',
              pageNo:vm.pageNo,
              pageSize:vm.pageSize,
              order:vm.sort==='default'?'':vm.sort=='price_asc'?'jf_asc':vm.sort=='price_desc'?'jf_desc':'',
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









