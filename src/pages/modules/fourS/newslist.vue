<template>
  <app-layout id="news_list">
    <ul v-if="list.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
      <!-- <router-link tag="li" :to="`/hotarticle?actUrl=${encodeURIComponent(item.linkUrl)}`" v-for="(item,index) in list">
       
        <img :src="item.imgUrl" alt="">
        <div>
          <p>{{item.title}}</p>
          <div>发表日期：{{item.publishDate}}</div>
        </div>
      </router-link> -->
      <a v-for="(item,index) in list" :href="item.linkUrl">
          <img :src="item.imgUrl" alt="">
          
          <div class="info">
            <p>{{item.title}}</p>
            <div>发表日期：{{item.publishDate}}</div>
          </div>
        <!-- </a> -->
      </a>
      
      <lc-nomore v-show="nomore&&totalPages<=pageNo"></lc-nomore>
    </ul>
  </app-layout>
</template>
<script>
export default {
  data(){
    return{
      pageNo: 1,
      pageSize: 10,
      nomore: false,
      list:[],
      st:0,
      totalPages:1,
    }
  },
  
  activated() {
    if(this.list.length<=0){
      this.loadMore();
    }else if (this.st != 0) {
      this.$el.children.appMain.scrollTop = this.st; 
    }
  },
  beforeRouteLeave(to, from, next) {
    if(/stores/.test(to.path)){
      this.resetPage();
    }else{
      this.st = this.$el.children.appMain.scrollTop;
    }
    next();
  },
  methods:{
    resetPage(){
      this.pageNo=1;
      this.nomore=false;
      this.list=[];
    },
    async loadMore(){
      if(!this.nomore){
        this.nomore=true;
        let data={
          content:{
            foursId:this.$route.params.id,
            pageNo:this.pageNo,
            pageSize:this.pageSize
          }
          
        }
        let res=await this.$post('/CRM/appfourspoint/queryNewsFlash.json',data);
        if (res.errcode === 0) {
          let con=res.content;

          this.list =this.list.concat(con.newsflashList);
          this.totalPages=res.content.totalPages;
          if (con.totalPages > this.pageNo) {
            this.nomore = false;
            this.pageNo += 1;
            
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import "~assets/css/var.scss";
  #news_list{
    ul{
      a{
        margin-top: .05rem;background: #fff;padding: .1rem .2rem;display: block;overflow:auto;
        img{
          width: 1.15rem;height: .76rem;margin-right: .1rem;float: left;
        }
        
        .info{
          @include box; @include flexDir(column); @include flexJustify(space-between);padding-right:.1rem;float: left;width:2rem;height: .76rem;
          p{
            color: #000;display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
          }
          div{
            font-size: .12rem;color: $gray;
          }
        }
      }
    }
  }
</style>
