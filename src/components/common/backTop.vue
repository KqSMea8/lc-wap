<template>
  <div class="backtop">
    <div class="bg" v-show="showbg"></div>
    <div class="top" @click.stop="backTop"></div>
  </div>
  
</template>
<script>
  export default {
    name:'lc-backtop',
    data(){
      return{
        cleartime:'',
        showbg:false,

      }
    },
    methods:{
      backTop(){
        clearInterval(this.cleartime)
        const top=this.$parent.$el.children.appMain.scrollTop;
        const speed=top/100*10;
        this.showbg=true
        this.cleartime=setInterval(()=>{  
          if(this.$parent.$el.children.appMain.scrollTop<=speed){
            this.$parent.$el.children.appMain.scrollTop=0
            this.showbg=false
            clearInterval(this.cleartime)
            return
          }

          this.$parent.$el.children.appMain.scrollTop-=speed
        },10)
        
      }
    }
  }
</script>
<style lang="scss" scoped>
  .backtop{
    
    .bg{
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.01);
      top: 0;
      left: 0;
    }
    .top{
      font-size: .12rem;
      width: .48rem;
      height: .48rem;
      position: absolute;
      bottom: .2rem;
      right: .15rem;
      background: url('~assets/img/mall/backTop.png');
      background-size: 100% 100%;
      
    }
  }
</style>


