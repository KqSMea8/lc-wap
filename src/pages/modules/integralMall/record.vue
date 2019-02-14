<template>
  <app-layout id="integralMall_record" class="goodsList" >

    <div class='goods-list col1' v-if="list.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">

      <router-link class="li arrow-link" v-for="item in list" :to="'/orders/'+item.no">
        <div class="logo">
          <img v-lazy.appMain="item.icon">

        </div>
        <div  class="detail-box" style="width:1.6rem">
          <h1>{{item.title}}</h1>
          <ul>
            <!-- <li></li> -->
          </ul>
          <h2>
            <svg class="icon" aria-hidden="true" style="width:.15rem;"><use xlink:href="#icon-icon_integral"></use></svg><span style="vertical-align: middle">{{item.otherText.split('：')[1]}}</span>
          </h2>
            
        </div>
        <div class="record-state">{{item.statusInfo.text}}</div>
      </router-link>
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
export default {
  props:['scrolltop'],
  data() {
    return {

      list:[],
      pageNo: 1,
      pageSize: 10,
      nomore: false,
      totalPages:1,
      st:0,

    };
  },


  activated(){
    if(this.list.length===0){
      this.loadMore();
    }else if(this.st != 0) { 
      this.$el.children.appMain.scrollTop = this.st;
    }
  },
  beforeRouteLeave(to, from, next) {
    if(!/orders\//.test(to.path)){
      this.resetPage(next);
    }else{
      this.st = this.$el.children.appMain.scrollTop;
      next();
    }
  },
  methods:{

    resetPage(callback){

      this.list=[];
      this.pageNo=1;
      this.nomore=false;
      this.st=0;

      callback();
    },
    
    async loadMore() {
      if(!this.nomore){
        this.nomore=true;

        let data=this.$sign({
            content: {
                orderType: 'JF',
                pageNo:this.pageNo,
                pageSize:this.pageSize,
                status:''
            }
        });
        let res=await this.$post('/CRM/api/query.order.page.json',data);
        if(res.errcode==0){
            let con=res.content;
            this.list=this.list.concat(res.content.orderList);   
            this.totalPages=res.content.totalPages;
            if(res.content.totalPages>this.pageNo){
              this.nomore=false;
              this.pageNo+=1;
            }
        }
      }
    },
    

  }
}
</script>

<style lang="scss">
  @import "~assets/css/mall/goodsList.scss";
  
</style>









