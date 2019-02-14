<template>
  <div>
    <div class="activity-box" @click="showActivity=!showActivity" v-show="selectedStore.id&&selectedStore.goucheyouhui&&selectedStore.goucheyouhui.length>0">
      <div class="title">线上下订可享以下门店活动</div>
      <ul>
        <li v-for="item in selectedStore.goucheyouhui">
          <span>{{item.tag}}</span>
          <p>{{item.title}}</p>
        </li>
      </ul>
    </div>
    <mt-popup slot="aside" v-model="showActivity" position="bottom" style="width:100%;">
      <div class="activity">
        <h1>门店活动</h1>
        <ul class="page-content">
          <a :href="item.url||'javascript:void(0)'" v-for="item in selectedStore.goucheyouhui">
          <li  :class="{'arrow-link':item.url}" >
            <span>{{item.tag}}</span>
            <p>{{item.title}}</p>
          </li>
          </a>
        </ul>
      </div>
    </mt-popup>
  </div>
  
</template>
<script>
  export default {
    name:'car-discount',
    props:{
      selectedStore:{type:Object},
    },
    data(){
      return{
        showActivity:false
      }
    },
    
    deactivated(){
        this.showActivity=false
    },
    methods:{
    }
  }
</script>
<style lang="scss" scoped>
  @import "~assets/css/var.scss";
  .activity-box{
    background: #fff;font-size:.13rem;padding:.15rem .2rem;
    .title{color: $red;position: relative;
      &::after{
        content: '...';position: absolute;right: 0;font-weight: bold;letter-spacing: .02rem; color: $gray;top: -.02rem;
      }
    }
    ul{
      li{
        margin-top: .15rem;@include txtOverflow;@include box;@include flexAlign;
        span{color: #fff;border-radius: 3px;padding: 0px 3px;height:.16rem;line-height:.16rem;margin-right: .1rem;background: $red;display: inline-block;font-size: .12rem;}
        p{text-overflow: ellipsis;@include flex;@include txtOverflow;font-size: .12rem;color: $gray;}
      }
    }
  }
  .activity{background:#fff;padding-bottom:.2rem;
    h1{line-height: .5rem;text-align: center;border-bottom:$border;font-size:.16rem;color:$black;}
    .page-content{
      height:3rem;padding:0 .2rem;
      li{padding:.15rem 0;border-bottom:$border;@include box;   height: inherit;
        span{color: #fff;border-radius: 3px;padding: 0px 3px;height:.16rem;line-height:.16rem;margin-right: .1rem;background: $red;display: inline-block;font-size: .12rem;}
        p{text-overflow: ellipsis;@include flex;padding-right: .2rem;font-size: .12rem;color: $gray;line-height: .16rem;margin-top: .01rem;}
        &::before{
          right: 0;
        }
        &::after{
          right: 0;
        }
      }
    }
  }
</style>
