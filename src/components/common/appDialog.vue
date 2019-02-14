<template>
  <div>
    <div class="dialog-bg" v-if="wechat">

      <div class="dialog-box">
        <p class="title">{{title}}</p>
        <a href="" class="appopen1">
            <div class="btn" >下载盈众乐橙汇App</div>
        </a>
        <img src="/CRM/WeChat/App/static/img/lechengqr.jpg" alt="">
        <div class="info">扫描或长按识别二维码关注公众号<br/>获取更多优惠信息</div>
        <div class="close" @click="$emit('update:showAlert', false)">×</div>
      </div>

    </div>
    <div class="dialog-bg"  v-else>
      <div class="dialog-box">
        <p class="title">{{title}}</p>
        <div class="info">{{details}}</div>
        <a href="" class="appopen1">
            <div class="btn" style="margin-bottom:.1rem;">下载盈众乐橙汇App</div>
        </a>
        <div class="close" @click="$emit('update:showAlert', false)">×</div>
      </div>
    </div>
    
  </div>
</template>
<script>

  export default {
    name:'lc-appdialog',
    props:['title','details','wechat','showAlert','mlink'],
    // model: {
    //   prop: 'value',
    //   event: 'close'
    // },
    mounted() {
      if(!isLecheng){
        new Mlink({
            mlink:this.mlink,
            button:document.querySelector('a.appopen1')
        })
      }
    },
  }
</script>



