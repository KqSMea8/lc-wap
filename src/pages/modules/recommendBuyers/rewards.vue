<template>
    <app-layout id="recommendBuyersRewards">

        <page-switch slot="header" :items="switchPages" :active="1"></page-switch>

        <mt-navbar slot="header" v-model="selected">
            <mt-tab-item id="status3">全部</mt-tab-item>
            <mt-tab-item id="status0">待使用</mt-tab-item>
            <mt-tab-item id="status1">已使用</mt-tab-item>
            <mt-tab-item id="status2">已过期</mt-tab-item>
        </mt-navbar>

        <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">

            <li  v-if="selected==='status3'||selected==('status'+value.status)" v-for="(value,index) in listItems">
                <div class="top" :class="(value.status=='2'||value.status=='1')?'dis':'yellow'">
                    <div class="title">{{value.prizeName}}</div>
                    <div class="money" >
                        <div><span>¥</span>{{value.prizeAmount}}</div>
                    </div>
                </div>
                <div class="base">
                    <h2><img src="~assets/img/recommendBuyers/icon_card_shop.png">适用门店<b>{{value.useStores}}</b></h2>
                    <h2><img src="~assets/img/recommendBuyers/icon_card_time.png">有效期<b>{{value.createTime}}至{{value.expireTime}}</b></h2>   

                    <img v-if="value.status=='1'" class="status" :src="icon_card_used">
                    <img v-if="value.status=='2'" class="status" :src="icon_card_over">
                </div>
                <div class="detail">
                    <div v-if="(showIndex==index)" style="    border-top: 1px dashed #f2f2f2;">
                        <b><i>i</i>兑换码：{{value.prizeCdkey}}</b>
                        <p v-html="getDetail(value.detail)"></p>   
                    </div>
                    <h1 :class="(showIndex==index?'up':'')" v-on:click="showDetail(index)"></h1>
                </div>
            </li>

        </ul>

        <div v-if="nomore" class="nodata">没有数据咯</div>
        
    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            switchPages:[
                {name:'推荐记录',path:'/recommendBuyers/records'},
                {name:'奖励记录',path:'/recommendBuyers/rewards'}
            ],
            icon_card_over:require('assets/img/recommendBuyers/icon_card_over.png'),
            icon_card_used:require('assets/img/recommendBuyers/icon_card_used.png'),
            st:0,
            pageNo:1,
            pageSize:10,
            nomore:false,
            loading:false,
            showIndex:-1,
            selected:'status3',
            listItems:[]
        };
      },
      watch: {
        selected(val) {
            this.resetPage();
            this.loadMore();
        }
      },
      activated(){
          if(this.st!=0){
              this.$el.children.appMain.scrollTop = this.st;
          }else{
              this.loadMore();
          }
      },
      beforeRouteLeave (to,from,next){
        if(to.path=='/recommendBuyers'){
            this.resetPage();
        }else{
            this.st = this.$el.children.appMain.scrollTop;
        }
        next();
     },
      deactivated(){
        this.$indicator.close();
      },
      methods: {
        resetPage(){
          this.st=0;
          this.pageNo=1;
          this.pageSize=10;
          this.nomore=false;
          this.loading=false;
          this.showIndex=-1;
          this.listItems=[];
        },
        showDetail(index){
            this.showIndex==index?this.showIndex=-1:this.showIndex=index;
        },
        getDetail(str){
            return str.replace(/[\r\n]/g,"<br>");
        },
        async loadMore() {
            if(!this.nomore&&!this.loading){
                this.loading=true;

                let d={content: {
                    memberId: this.$cache.user.memberId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    status:this.selected.substr(-1)
                }};

                let res=await this.$post('/CRM/wechatrecommendbuycar/getMemberRewardList',d);
                if(res.errcode==0){
                    let list=res.content.rewardList;
                    this.listItems=this.listItems.concat(list?list:[]);
                    if(res.content.totalPages<=this.pageNo){
                        this.nomore=true;
                    }else{
                        this.pageNo+=1;
                    }
                    this.loading=false;
                }
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #recommendBuyersRewards{
      li{
        width:90%;margin:10px auto;border-radius:8px;background:#fff;
        .top{height: .65rem;position: relative;@include box;color:#fff;
            &.dis{background: url('~assets/img/mall/background_card_top_over.png') no-repeat top center;background-size: 100%;}
            &.yellow{background: url('~assets/img/mall/background_card_top_yellow.png') no-repeat top center;background-size: 100%;}
            .title{line-height: .65rem;text-indent: .15rem;font-size:.15rem;width: 70%;@include txtOverflow;}
            .money{font-size: .3rem;line-height:.3rem;font-weight:500;@include flex;text-align: center;@include box;@include flexDir(column);@include flexJustify;margin-right:.15rem;text-align:right;
                div{font-size: .27rem;font-weight:600;position: relative;
                    span{font-size: .17rem}
                }
                span{font-size: .12rem;position: relative;top: -.02rem; white-space: nowrap;}
            }

        }
        // h1{font-size:$h2;padding:0 .20rem;line-height:.60rem;font-weight:500;color:#fff;span{float:right;font-weight:600;font-size:.18rem;b{font-size:.28rem;}}}
        .base{
            background:#fff;padding:.15rem 0 .10rem;position:relative;margin:0 .2rem;
            .status{position:absolute;right:.1rem;top:.1rem;width:.55rem;}
            h2{
                font-size:12px;color:$gray;text-align:left;line-height:.25rem;
                img{width:14px;vertical-align: middle;margin-right:5px;}
                b{color:black;margin-left:10px;font-weight: normal}
            }
            div{position:absolute;bottom:.10rem;right:.10rem;h3{border-bottom:1px solid $gray;}}
        }
        .detail{
            color:$gray;background:#fff;border-radius:0 0 8px 8px;
            h1{
                position:relative;padding:.10rem;text-align:center;
                // &::after{position:absolute;content:'';width:0;height:0;top:0;left:50%;margin-left:-.10rem;border:.10rem solid transparent;border-bottom:0;border-top-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;top:.02rem;left:50%;margin-left:-.10rem;border:.06rem solid transparent;border-bottom:0;border-top-color:#c9c9c9;}
            }
            h1.up{
                // &::after{position:absolute;content:'';width:0;height:0;top:.02rem;left:50%;margin-left:-.10rem;border:.10rem solid transparent;border-top:0;border-bottom-color:#fff;}
                &::before{position:absolute;content:'';width:0;height:0;top:0;left:50%;margin-left:-.10rem;border:.06rem solid transparent;border-top:0;border-bottom-color:#c9c9c9;}
            }
            div{
                padding:.10rem 0rem;margin:0 .2rem;
                b{text-align:left;color:#e84816;font-weight: normal;font-size: .16rem;i{display:inline-block;width:.14rem;height:.14rem;border-radius:99px;color:#fff;background:#e84816;text-align:center;margin-right:5px;}}
                p{font-size:12px;margin-top:.1rem;line-height:.22rem;}
            }
        }
      }

      li.gray{
        background:#c9c9c9;
        .detail div b{color:#88888d;i{background:#88888d;}}
      }
  }
</style>
