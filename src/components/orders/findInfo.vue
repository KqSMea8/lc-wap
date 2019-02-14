<template>
  <div class="find-info ">
    <div class="top">
      <router-link :to="`/discovery/`+activityInfo.id">
        <div class="arrow-link mod">{{activityInfo.title}}</div>
      </router-link>
      
      <div class="mod">
        <p>活动时间：{{activityInfo.startTime}} - {{activityInfo.endTime}}</p>
        <p>集合地址：{{activityInfo.address}}</p>
        <p>活动联系：<a :href="'tel:'+activityInfo.tel">{{activityInfo.tel}}</a>（或联系乐橙客服）</p>
      </div>
    </div>
    <div class="bottom mt">
      <div class="tilte">报名信息</div>
      <ul>
        <li v-for="(item,index) in proList">
          <span class="sort"><em>{{index+1}}</em></span>
          <span class="people">{{item.subtitle}}</span>
          <span class="money">{{parseFloat(item.price)==0?'免费':`￥${item.price}`}}</span>
          <span class="num">{{item.num}}份</span>
        </li>

        <div class="connect">
          姓名电话：<span>{{orderInfo.custName}} {{orderInfo.custPhone}}</span>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name:'find-info',
  props:['proList','activityInfo','orderInfo']
}
</script>
<style lang="scss" scoped>
@import "~assets/css/var.scss";
  .find-info{
    color:#22222d;
    .top{
      background: #fff;
      .mod{
        padding:.1rem .3rem .1rem .2rem;
        border-bottom:1px solid #f2f2f2;
        a{color:$red}
        p{font-size: .12rem;color: $gray;line-height: .2rem;}
      }
    }
    .bottom{
      padding:.15rem .2rem;background: #fff;
      .tilte{text-align: center;position: relative;margin-bottom: .15rem;
        &::before{
          content: '';
          width: .5rem;
          height: 0;
          border-top: 1px solid #c9c9c9;
          position: absolute;
          top: .1rem;
          margin-left: -.6rem;
        }
        &::after{
          content: '';
          width: .5rem;
          height: 0;
          border-top: 1px solid #c9c9c9;
          position: absolute;
          top: .1rem;
          margin-left: .1rem;
        }
      }
      ul{
        border-radius: .06rem;
        box-shadow: 0px 0px 5px 2px #f1f1f1;
        padding-top: .1rem;

        li{
          font-size: 0;
          padding-bottom:.1rem;
          overflow: auto;
          span{display: inline-block;font-size: .15rem;float: left}
          .sort{width:.5rem;vertical-align: super;
            em{
              border:1px solid #22222d;border-radius: 50%;font-style: normal;text-align: center;height: .15rem;width: .15rem;display: inline-block;line-height: .15rem;margin-left: .17rem;margin-top: .01rem;
            }
          }
          .people{width: 1.3rem;margin-right: .2rem;}
          .money{width:.7rem;}
          .num{margin-right: .17rem;float: right}
        }
        .connect{height: .4rem;line-height:.4rem;background: #f2f2f2;color:$gray;padding:0 .17rem;font-size:.13rem;
          span{color: $lightBlack;margin-left: .4rem;}
        }
      }
    }    
  }
</style>
