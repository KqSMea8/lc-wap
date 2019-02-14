<template>
  <app-layout id="storeComments">
        <div slot="header" class="comment-top">
            <div class="comp-score">
                <span>总体评分</span>
                <lc-rate disabled :size=".12" v-model="compScore"></lc-rate>
            </div>
            <ul class="comp-tab">
                <li @click="selComment(item.id)" :class="selected==item.id?'sel':''" v-for="(item,index) in tagList" :key="item.id">{{item.name}} ({{item.num}})</li>
            </ul>
            <div class="radio"><div v-on:click="changeHave" :class="showHave?'on':''"></div>仅显示有内容评价</div>
        </div>
        

        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
            <div class="comment" v-for="item in comments">
                <img class="profile" :src="item.memberHeadPortrait||profile">
                <h2><span>{{item.memberName}}</span>{{item.appraiseTime}}</h2>
                <lc-rate disabled v-model="item.compScore"></lc-rate>
                <p>{{item.appraise||''}}</p>
                <div class="imgs clearfix" v-if="item.appraiseImg.length>0">
                    <img v-for="img in item.appraiseImg" v-lazy.appMain="img">
                </div>
                <div class="reply" v-if="item.merchantReply!==''">{{item.merchantReply}}</div>
            </div>
            <lc-nomore v-show="nomore&&totalPages<=pageNo&&comments.length>0"></lc-nomore>
        </div>
      
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          profile:require('assets/img/default_user.png'),
          comments:[],

          tagList:[],

          selected:'1',
          pageNo:1,
          pageSize:20,
          nomore:false,
          totalPages:1,
          showHave:true,
          compScore:''
        }
      },

      activated(){
          this.loadMore();
      },
      beforeRouteLeave(to,from,next){
        if(/stores/.test(to.path)){
        //   this.resetPage();
        }
        next();
      },
      watch:{
          selected(){
              this.pageNo=1;
            this.nomore=false;
            this.comments=[];
            this.loadMore();
          }
      },
      methods:{
        selComment(id){
            this.selected=id;
            
        },
        changeHave(){
            this.showHave=!this.showHave;
            this.pageNo=1;
            this.nomore=false;
            this.comments=[];
            this.loadMore();
        },
        async loadMore() {
            if(!this.nomore){
                this.nomore=true;

                let data={content:{
                        queryId:this.$route.params.id,
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
                        queryType:1,
                        queryTag:this.selected,
                        contentShow:this.showHave,
                        getFew:false
                    }
                };
                let res=await this.$post('/CRM/appbespeak/getAppraiseList.json',data);
                if(res.errcode==0){
                    let con=res.content;

                    if(this.pageNo===1){

                        this.tagList=con.tagList;
                        this.compScore=con.scoreInfo.compScore
                        eventBus.$emit('layout');
                    }

                    this.comments=this.comments.concat(con.appraiseList||[]);
                    this.totalPages=res.content.totalPages;

                    if(con.totalPages>this.pageNo){
                        this.nomore=false;
                        this.pageNo+=1;
                        
                    }

                    
                    
                    
                }
            }
        }
      }
    }
</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #storeComments{
      .comment-top{background: #fff;margin-bottom:.05rem;
        .comp-score{color: $black;height: .44rem;border-bottom:1px solid #f2f2f2;line-height: .44rem;padding:0 .2rem;
          span{vertical-align: middle;display: inline-block;margin-right: .05rem;}
        }
        .comp-tab{@include box;margin:.1rem 0;padding:0 .2rem;margin-bottom:0;
          li{height: .25rem;line-height:.25rem;border:1px solid #dfdfdf;border-radius: 4px;color:$gray;text-align: center;padding:0 .08rem;font-size: .12rem;margin-right:.12rem;margin-bottom:.1rem;
            &.sel{color: $red;border-color: $red;}
          }
        }
        .radio{
            height:.2rem;padding:1px .2rem 1px .45rem;position:relative;padding-bottom:.05rem;font-size:.12rem;color:$lightBlack;margin-top:.05rem;
            div{position:absolute;width:.11rem;height:.11rem;top:.03rem;left:.25rem;border-radius:99px;border:1px solid $red;}
            div.on{background:$red;color:#fff;}
            div.on:before{content:'√';}
            a{color:$red;}
        }
      }
      .part{background:#fff;margin-bottom:.05rem;}

      .comment{position: relative;padding:.1rem .2rem .1rem .6rem;color:$gray;line-height:.2rem;font-size:$h4;background:#fff;
        .profile{position: absolute;top:.1rem;left:.2rem;width:.3rem;height:.3rem;border-radius: 50%;border:$border;}
        h2{text-align:right;span{float:left;color:$black;}}
        .imgs img{width:.5rem;height:.5rem;float: left;margin-right:.05rem;}
        .reply{padding:.05rem .1rem;border-radius: 3rem;border:$border;background:$lightGray;}
      }


  }
</style>