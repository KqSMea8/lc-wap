<template>
  <app-layout id="cargoodsSeckill">
    <div class="seckill-logo" :style="{'background-image':`url(${banner})`}"></div>
    <mt-navbar  v-model="type">
        <mt-tab-item id="current">本期秒杀</mt-tab-item>
        <mt-tab-item id="next">下期秒杀</mt-tab-item>
    </mt-navbar>
    <div class="time" v-if="list.length>0">
      <p>距离本场{{type=='current'?'结束':'开始'}}</p>
      <div>
        <span class="num">{{$countDown(second*1000)[0]}}</span>
        <em>:</em>
        <span class="num">{{$countDown(second*1000)[1]}}</span>
        <em>:</em>
        <span class="num">{{$countDown(second*1000)[2]}}</span>
      </div>
    </div>
    <div class="time" v-else>暂无秒杀商品</div>
    <ul class="seckill-main">
      <li  v-for="(item,index) in list" @click="goDetails(item.item_id)"  :key="item.item_id">
        <img :src="item.img" alt="">
        <div class="content">
          <p>{{item.title}}</p>

          <div class="price">
            <span>￥{{item.price}}</span>
            <del>￥{{item.mkt_price}}</del>
            <em :class="{no:type=='next'}">限购{{item.limitbuy}}件</em>
          </div>
          <div class="percent-box">
            <div class="percent">
              <div class="big"><div :style="{'width':`${100-item.percent}%`}"></div></div>
              <span>已抢{{100-item.percent}}%</span>
            </div>
            <div  class="btn" v-if="type=='current'&&item.percent!=0">马上抢</div>
            <div class="btn no" v-else-if="type=='current'&&item.percent==0">已抢完</div>
            <div  class="btn no" v-if="type=='next'">即将开始</div>

          </div>
        </div>
      </li>
    </ul>
  </app-layout>
</template>
<script>
  export default {
    data(){
      return{
        type:'',
        banner:'',
        list:[],
        statusinfo:'',
        itemid:'',
        cleartime:'',
        second:null,
        st:0,
        url:''
      }
    },
    watch: {
      type(val) {
        this.loadMore();
      }
    },
    activated(){

      if(this.type==''){
        this.itemid=this.$route.query.key
        this.type=this.$route.query.type;
        return
      }
      if(this.type!=''&&this.$route.query.type!=this.type){
        if(this.itemid!=this.$route.query.key){
          this.itemid=this.$route.query.key
          this.loadMore()
          return
        }
        
      }
      if(this.itemid==this.$route.query.key){
        if(this.st != 0){
          this.loadMore()
          this.$el.children.appMain.scrollTop=this.st;
          return
        }else{
          this.loadMore()
          return
        }
      }else{
        this.itemid=this.$route.query.key
        this.loadMore()
      }
      
      
    },
    
    deactivated(){
        clearInterval(this.cleartime)
    },
    beforeRouteLeave (to, from, next) {
        this.st = this.$el.children.appMain.scrollTop;
        next();
      
    },
    methods:{
      goDetails(id){
        if(isLecheng){
          this.$utils.goNative('cargoods',id);
        }else{
          this.$router.push('/mall/cargoods/'+id)
        }
        
        
      },
      async loadMore(){
        let user=this.$cache.user;
        let data = {
          content:{
            mbeid:user.memberId,
            mobile:user.phone,
            type:this.type,
            itemid:this.itemid
          }
        }
        let res= await this.$post('/mall29/miaosha.html', data);
        if(res.errcode==0){
          if(res.content.share){
            let shareData = {
                share_title: res.content.share.title,
                share_desc: res.content.share.desc,
                share_img: res.content.share.img,
                share_url: res.content.share.url,
            }

            this.$utils.shareConfig(shareData);
          }
          this.banner=res.content.banner;
          this.list=res.content.list;

          this.second=res.content.miaosha.second;
          clearInterval(this.cleartime)
          this.cleartime=setInterval(()=>{  
              this.second=this.second-1;
              if(this.second<=0&&this.list.length>0){
                this.loadMore()
              }
          },1000)
          
        }
      }
    }
  }
</script>
<style lang="scss">
@import "~assets/css/var.scss";
  #cargoodsSeckill{
    .mint-tab-item-label{
      font-size: .15rem;
    }
    .seckill-logo{
      width: 100%;
      height: 1.675rem;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: 50%;
    }
    .time{
      height: .44rem;
      line-height: .44rem;
      background: #fff;
      border-top: 1px solid #f2f2f2;
      @include box;
      @include flexJustify;
      
      text-align: center;
      color:$red;
      p{
        font-size: .14rem;
        color: $black;
      }
      div{
        font-size: 0;
        margin-left:.08rem;
        em{
          font-style: normal;
          font-size: .12rem;
          padding: 0 .02rem;
          font-weight: 600;
        }
        .num{
          display: inline-block;
          line-height: .18rem;
          
          font-size: .12rem;
          width: .18rem;
          height:.18rem;
          border:1px solid #c9c9c9;
        }
      }
    }
    .seckill-main{
      width: 100%;
      margin-top: .05rem;
      li{
        padding: .15rem .2rem;
        background: #fff;
        border-bottom: 1px solid #f2f2f2;
        @include box;
        // box-sizing: border-box;
        // width: 100%;
        img{
          width: .8rem;
          height: .8rem;
          margin-right: .12rem;
        }
        .content{
          @include flex;
          overflow: hidden;
          p{
            width: 100%;
            height: .37rem;
            color:$black;
            font-size: .13rem;
            line-height: .2rem;
            margin-bottom: .04rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .price{
            margin-bottom: .02rem;
            span{
              font-size: .14rem;
              color: $red;
            }
            del{
              margin-left: .05rem;
              font-size: .12rem;
              color:$gray;
            }
            em{
              font-style: normal;
              color: $red;
              font-size: .12rem;
              float: right;
              display: inline-block;
              width: .65rem;
              text-align: center
            }
            .no{
              color: $gray
            }
          }
          .percent-box{
            @include box;
            @include flexJustify(space-between);
            @include flexAlign(flex-end);
            margin-top: 0rem;
            .percent{
              
              .big{
                height: .05rem;
                width: .65rem;
                background:#f8c8ba;
                border-radius: .05rem;
                display: inline-block;
                vertical-align: middle;
                margin-right: .02rem;
                div{
                  border-radius: .05rem;
                  background: $red;
                  height: 100%;
                  max-width:100%;
                }
              }
              span{
                color: $red;
                font-size: .12rem;
              }
            }
            .btn{
              height: .24rem;
              width: .65rem;
              background: $red;
              text-align: center;
              line-height: .24rem;
              font-size: .12rem;
              color:#fff;
              border-radius: 5px;
            }
            .no{
              background: #c9c9c9;
            }
          }
        }
      }
    }
  }
</style>

