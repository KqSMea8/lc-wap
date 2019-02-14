<template>
  <app-layout id="feedback">
    <div class="box">
      <!-- <p class="title">选择反馈问题</p> -->
      <ul >
        <mt-radio
          title="选择反馈问题"
          align="right"
          v-model="value"
          :options="options">
        </mt-radio>
      </ul>
    </div>
    <div class="box">

      <ul class="card">
        
        <li class="text-area">
          <textarea name="" v-model="content" placeholder="请输入反馈资料"></textarea>
        </li>
        <li>
          <input type="text" v-model="name">
        </li>
        <li class="arrow">
          <input type="tel" v-model="phone">
        </li>
      </ul>
    </div>
    <div class="btn" @click="saveInfo">提交</div>
  </app-layout>
</template>
<script>
export default {
  data(){
    return{
      content:'',
      name:'',
      phone:'',
      value:'1',
      options:[
        {
          label: '问题反馈',
          value: '1',
        },
        {
          label: '功能建议',
          value: '2'
        }
        
      ]
    }
  },
  activated() {
    this.name = this.$cache.user.name
    this.phone = this.$cache.user.phone
  },
  beforeRouteEnter (to, from, next) {
    next((vm)=>{
      if(/bindCar/.test(from.path)){
        vm.content = '我的车辆与系统的车辆信息有误，请麻烦核对。'
      }else{
        vm.content = ''
      }
    })
    
  },
  methods:{
    async saveInfo(){
      if(this.name==''){
        this.$toast('请输入姓名');
        return;
      }
      if(this.content==''){
        this.$toast('请输入提交内容');
        return;
      }
      if(this.phone==''){
        this.$toast('请输入手机号码');
        return;
      }else if(!/^1[3456789]\d{9}$/.test(this.phone.replace(/\s/g,''))){
        this.$toast('手机号码格式有误，请检查');
        return;
      }

      let data={
        content:{
          memberId:this.$cache.user.memberId,
          memberName:this.name,
          memberPhone:this.phone,
          content:this.content,
          vtype:this.value
        }
      }
      let res = await this.$post('/CRM/appothers/saveinfo.json',data);
      if(res.errcode==0){
        this.$toast('提交成功');
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
  #feedback{
    .btn{margin:0 .1rem;margin-top: .2rem;height: .4rem;background: #fc8946;line-height: .4rem;color: #fff;text-align: center;border-radius: .06rem;font-size: .15rem;}
    .box{
      margin:.2rem .1rem ;
      .title{font-size: .12rem;text-indent: .1rem;color: #a3a3a3;margin-bottom: .02rem;}
      .card {
        margin:0;
        li{padding:0 .12rem;border-bottom:$border;@include box;height:.44rem;line-height:.44rem;}
        li.setDefault{height:44px;line-height:44px;}
        li.text-area{
          height:auto;line-height:.2rem;padding:.1rem;
        }
        label{@include flex;}
        textarea{
          width: 100%;
          height: 1.5rem;
        }
        div.area{
          @include flex;text-align:center;
          span:nth-of-type(1){margin-right:.15rem;}
          span::after{content:"▼";margin-left:.02rem;}
        }
        .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;}
        .item-val.carId{@include flex(1);max-width:100px;}
        .item-val .switch{float:right;margin-top:6px;}
        input{height:100%;line-height:normal!important;}
      }
    }
  }
  
</style>
