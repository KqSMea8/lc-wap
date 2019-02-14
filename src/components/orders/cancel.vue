<template>
  <mt-popup slot="aside" v-model="showCancel" position="bottom" style="width:100%;">
    <div class="cancel-popup">
        <div class="title">
            <span @click="showCancel=false;checkNum=-1">取消</span>
            <p>请选择取消原因</p>
            <span @click="trueCancel">确定</span>
        </div>

        <ul class="page-content">
            <li  v-for="(item,index) in cancelArr" @click="checkCancel(index,item.id)" >
                <div :class="{check:checkNum==index}"><span>{{item.name}}</span></div>
            </li>
        </ul>

    </div>
  </mt-popup>
</template>
<script>
  export default {
    name:'cancel-popup',
    props:['value','chooseOrder'],
    data(){
      return{
        cancelArr:[],
        checkNum:-1,
        showCancel:false,
        cancelReasonId:''
      }
    },
    mounted(){

    },
    computed:{
        
    },
    watch:{
        value(val){
            this.showCancel=val

        },
        showCancel(val){

            eventBus.$emit('changeCancel',val,this.chooseOrder);
            if(val){

                this.getCancel();
            }
        }
    },
    methods:{
      checkCancel(index,id){
          this.checkNum=index;
          this.cancelReasonId=id
      },
      resetData(){
        this.cancelArr=[]
        this.checkNum=-1
        this.cancelReasonId=''
      },
      async getCancel(){
          this.resetData()
          let data=this.$sign({
              content: {
                  orderType: this.chooseOrder.orderType,
                  state:this.chooseOrder.status
              }
          });

        let res = await this.$post('/CRM/api/getCancelReasonConfig.json',data);
        if(res&&res.errcode==0){
            
            this.cancelArr=res.content.reasonList
        }else{
            this.showCancel=false
        }
      },
      async trueCancel(){
        if(this.checkNum==-1){
            this.$toast('请选择取消原因');
            return
        }
        let data=this.$sign({
            
              content: {
                  no: this.chooseOrder.no,
                  orderState:4,
                  cancelReasonId:this.cancelReasonId
              }
          });
        let res = await this.$post('/CRM/api/update.order.info.json',data);
        if(res&&res.errcode==0){
            this.showCancel=false;
            this.checkNum=-1
            eventBus.$emit('updateOrder');
        }
      }
    }
  }
</script>
<style lang="scss">
@import "~assets/css/var.scss";
  .cancel-popup{
      color: $black;
      font-size: .15rem;
      .title{
          padding: 0 .2rem;
          height: .4rem;
          @include box;
          @include flexJustify(space-between);
          @include flexAlign;
          span{
              color: #e84816;
          }
      }
      ul{
          height: 3rem;
          li{
              
              @include box;
              @include flexAlign;
              box-sizing: border-box;
              padding: .1rem .2rem;
              min-height: .44rem;
              // line-height: .44rem;
              border-top: 1px solid #f2f2f2;
              div{
                    padding-right: .3rem;
                span{display: inline-block;width: 100%}
                  &.check{background: url('~assets/img/mall/icon_list_detail_select.png') no-repeat right center;background-size:17px 12px; width: 100%;}
              } 
          }
      }
      
  }
</style>

