<template>
  <app-layout id="discovery">
    <div class="acinfo">
      <img :src="content.imgUrl" alt="">
      <div class="detail">
        <p class="title">{{content.title}}</p>
        <ul class="clearfix">
          <li v-for="(item,index) in typeName">{{item}}</li>
        </ul>
        <div class="con">
          <div>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-icon_activity_detail2'"></use>
            </svg>
            <span>{{content.startTime}} - {{content.endTime}}</span>
          </div>
          <div>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-icon_activity_detail3'"></use>
            </svg>
            <span>{{content.areaName}}</span>
          </div>
          <div>
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="'#icon-icon_activity_detail'"></use>
            </svg>
            <span>{{content.applyGrade==''?'适用所有会员':content.applyGrade+'会员专享'}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="details">
      <img src="~assets/img/discovery/line_activity_line.png" alt="" class="title">
      
      <div class="content" v-html="htmlContent"></div>
    </div>
    
    <div  slot="footer" class="acbtn dis" v-if="content.btnStatus==1">活动已结束</div>
    <div  slot="footer" class="acbtn dis" v-else-if="content.btnStatus==2">报名未开始</div>
    <div  slot="footer" class="acbtn dis" v-else-if="content.btnStatus==3">限{{content.applyGrade}}会员报名</div>
    <div  slot="footer" class="acbtn dis" v-else-if="content.btnStatus==4">名额已满</div>
    <div  slot="footer" class="acbtn dis" v-else-if="content.btnStatus==5">报名已截止</div>

    <div  slot="footer" class="acbtn" @click="btnEvent(6)" v-else-if="content.btnStatus==6">查看我的报名</div>
    <div  slot="footer" class="acbtn" @click="btnEvent(7)" v-else-if="content.btnStatus==7">立即报名</div>

  </app-layout>
</template>
<script>
export default {
  data() {
    return{
      content:'',
      typeName:[],
      mobParams:'',
      htmlContent:'',
      mlink:''
    }
  },
 
  activated() {
    this.mlink='Ae7S?url='+encodeURIComponent(location.origin+'/wxwap?#'+this.$route.path)+'&mlKey=link'
    this.mobParams={mlKey:'link',url:encodeURIComponent(location.origin+'/wxwap?#'+this.$route.path)}
    this.getActivityDetail()
  },
  methods:{
    async getActivityDetail(){
      let data={
        content:{
          id:this.$route.params.aid,
          memberId:this.$cache.user.memberId,
        }
      }
      let res=await this.$post('/CRM/appactivity/queryActivityDetail.json',data);
      if(res.errcode==0){
        this.content = res.content;
        if(!isLecheng){
          this.htmlContent = this.content.articleContent.replace(/data-src/g,'src').replace(/href=/g,'attr=').replace(/title="jsbridge/g,'href="jsbridge')
        }else{
          this.htmlContent = this.content.articleContent.replace(/data-src/g,'src')
        }
        this.typeName = res.content.typeName.split(',')
        this.$utils.setAppTitle(res.content.title);
        let shareData = {
          share_title:res.content.title,
          share_desc:res.content.description,
          share_img:res.content.shareImg,
          share_url:location.origin+'/wxwap?#'+this.$route.fullPath
        }
        this.$utils.shareConfig(shareData);
        eventBus.$emit('layout');
      }
    },
    btnEvent(num) {
      switch(num){
        case 6:
          if(isLecheng){
              this.$utils.goNative('orders_details',this.content.orderNo);
          }else{
            
            this.$router.push('/orders/'+this.content.orderNo);
          }
          break;
        case 7:
          if(isLecheng){
            this.$login(()=>{
              this.$utils.goNative('discovery_refer',this.$route.params.aid);
            },this.$route)
              
          }else if(isWechat){
            this.$login(()=>{
              // this.$router.push(this.$route.fullPath.replace('?','/refer?'));
              var query = this.$route.fullPath.split('discovery')[1]
              this.$router.push('/discovery/refer'+query);
            },this.$route);
            
          }else{
            this.$appDownLoad.show({
                title:' ',
                details:'请下载盈众乐橙汇App即可参与活动',
                mlink:this.mlink,
                mobParams:this.mobParams
            })

          }
          break;
      }
    }
    
  }
}
</script>
<style lang="scss" >
@import "~assets/css/var.scss";
  #discovery{
    .page-content{background: #fff;}
    .acinfo{padding-bottom:.03rem;border-bottom:1px solid #dfdfdf;
      img{height: 1.68rem;width: 100%;}
      .title{color: #22222d;margin: .1rem 0;}
      .detail{padding:0 .2rem}
      ul{
        margin-bottom: .03rem;
        li{font-size: .12rem;height: .25rem;padding: 0 .1rem;border: 1px solid #dfdfdf;border-radius: .04rem;color: $gray;float: left;line-height: .27rem;margin-right: .07rem;margin-bottom: .1rem;}
      }
      .con{
        color: $gray;font-size:.12rem;
        div{
          margin-bottom: .12rem;
          .icon{width: .13rem;height: .13rem;}
          span{vertical-align: middle;display: inline-block;margin-left: .04rem;}
        }
      }
    }
    .details{
      padding: 0 .2rem .2rem;
      word-wrap: break-word;
      .title{
        width: 100%;
        margin: .2rem 0;
      }
      
    }
    .acbtn{
      color: #fff;
      height: .5rem;
      line-height: .5rem;
      text-align: center;
      background: $red;
      &.dis{
        background: #c9c9c9;
      }
    }
    .content{
      img{max-width: 100%;}
    }
  }
</style>