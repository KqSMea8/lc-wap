<template>
  <div v-show="showAlert">
    <div class="dialog-bg" v-if="wechat">

      <div class="dialog-box">
        <p class="title">{{title}}</p>
        <a id="appopen1" @click="openApp" >
            <div class="btn" >下载盈众乐橙汇App</div>
        </a>
        <img src="/CRM/WeChat/App/static/img/lechengqr.jpg" alt="">
        <div class="info">扫描或长按识别二维码关注公众号<br/>获取更多优惠信息</div>
        <div class="close" @click="$appDownLoad.hide()">×</div>
      </div>

    </div>
    <div class="dialog-bg"  v-if="!wechat">
      <div class="dialog-box">
        <p class="title">{{title}}</p>
        <div class="info">{{details}}</div>
        <a id="appopen1" @click="openApp" >
            <div class="btn" style="margin-bottom:.1rem;">下载盈众乐橙汇App</div>
        </a>
        <div class="close" @click="$appDownLoad.hide()">×</div>
      </div>
    </div>
    
  </div>
</template>
<script>
  export default {

    props:{
      title:{
        type:String,
        default:'请下载App'
      },
      details:{
        type:String,
        default:'该浏览器暂无此功能'
      },
      wechat:{
        type:Boolean,
        default:false
      },
      mlink:{
        type:String,
        default:'ABc3?mlKey=home'
      },
      mobParams:{
        type:Object,
        default:()=>{
          return{
            mlKey:"home",
            mId:""
          }
        }
      },
      mobLink:{
        type:String,
        default:`lecheng://?mlKey=home&mId=''`
      },
      showAlert:{
        type:Boolean,
        default:false
      },
    },
    // watch:{
    //   showAlert(data){
    //     if(data==false) return

    //     if(!isLecheng){
    //       if(isWechat||isIOS){
    //         this.$nextTick(()=>{
    //           MobLink([
    //             {
    //               el: "#appopen1",
    //               path: "lecheng",
    //               params: this.mobParams
    //             }, 
    //           ])
    //           // new Mlink({
    //           //     mlink:this.mlink,
    //           //     button:document.querySelector('a#appopen1')
    //           // })
    //         })
    //       }
          
    //     }
    //   }
    // },
    methods: {
      openApp(){
        // if(!isLecheng){
        //   if(!isWechat&&isAndroid){
        //     window.location.href = this.mobLink;
        //     setTimeout(()=>{
              window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.enjoyauto.lecheng"
        //     },500)
        //   }
        // }
        
        
      }
    },
  }
</script>



