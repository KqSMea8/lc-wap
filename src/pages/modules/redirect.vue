<template>
  <div @click="gowechat">点击</div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
   
      

  },
  methods:{
    gowechat(){
      location.replace("https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI1NTEyNzg4MQ==#wechat_redirect")
    }
  }
}
</script>
<style>

</style>
