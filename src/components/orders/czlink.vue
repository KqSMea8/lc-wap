<template>
    <div style="margin-top: .05rem;" v-if="CZDetail.showOtherActivity==='1'" @click="czgo(CZDetail.otherActivityUrl)">
        <img :src="CZDetail.otherActivityImgUrl" style="width:100%">
    </div>

</template>
<script>
export default {
  name:'cz-link',
  props:{
    orderId:{type:Number,default:''},
  },
  data(){
    return{
      CZDetail:''
    }
  },
  mounted() {
    this.getCZDetail()
  },
  methods:{
    async getCZDetail(){
      let d={content: {
          orderId: this.orderId
      }};

      let res=await this.$post('/CRM/wechatautoshow/orderDetail.json',d);
      if(res.errcode==0){
          this.CZDetail=res.content;
      }
    },
    czgo(url){
      if(/wxwap/.test(url)){
          this.$router.push(url.split('#')[1]);
      }else{
          location.href=url;
      }
    },
  }
}
</script>
