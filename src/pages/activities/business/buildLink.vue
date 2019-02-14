<template>
  <app-layout id="business_buildLink">
    <div class="header">
      <img :src="data.img">
    </div>
    <div class="part">
      <div class="item">活动时间：{{data.startTime}} - {{data.endTime}}</div>
      <div class="item">活动区域：{{data.conductName}}</div>
    </div>
    <div class="part" v-if="data.articleContent">
      <p class="title">奖励政策</p>
      <div class="con"  v-html="data.articleContent||''"></div>
    </div>


    <div slot="footer" class="nextOne"><router-link class="btn" :to="link">立即生成专属链接</router-link></div>
  </app-layout>
</template>

<script>
    export default {
      data() {
        return {
          data:{},
          link:''
        }
      },
      mounted(){
        this.getData();
      },
      methods: {
        async getData() {
          let d={content: {
              id: this.$route.params.aid,
              workNumber: this.$route.query.wid,
              foursId:this.$route.query.fid
          }};

          let res=await this.$post('/CRM/appshop/queryShareDetail.json',d);

          if (res.errcode == 0) {
            this.data = res.content;
            this.link = '/business/poster/' + this.$route.params.aid + '?wid=' + this.$route.query.wid+'&fid='+this.$route.query.fid;
            this.$utils.setAppTitle(this.data.activityName);
          } 
        }
      }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";

    #business_buildLink{font-size:$h3;padding-bottom:.51rem;
      .header{
        font-size: 0;
        text-align:center;
        img{width:100%;}
      }
      .part{
        background:#fff;margin-bottom: .05rem;
        padding: .1rem .15rem;
        .item{font-size: .13rem;color: $gray;line-height: .2rem;}
        .title{font-size: .15rem;color: $black;margin-bottom: .1rem;}
        .con{
          img{max-width:100%}
        }
      }
    }
</style>