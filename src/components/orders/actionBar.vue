<template>
  <div class="order-action-bar" >
    <!-- 1：待付款 2：进行中 3：待收货 4：待评价 5：已完成 6：已取消 7：取消中 -->
    <button v-if="[1,2].includes(data.statusInfo.status)&&!['MG'].includes(data.statusInfo.orderType)" @click="changeStatus(4)">取消订单</button>
    <button v-if="data.statusInfo.deliveryCode===1&&![1,2,6,7].includes(data.statusInfo.status)" @click="next('/shipping/'+data.no)">查看物流</button>
    <button v-if="data.statusInfo.deliveryCode===1&&data.statusInfo.status===3" class="red" @click="changeStatus(3)">确认收货</button>
    
    <button v-if="data.statusInfo.status===1" class="red" @click="next('/pay/'+data.no)">{{data.miaosha&&data.miaosha.second>=0?'':'立即'}}支付 
      {{data.miaosha&&data.miaosha.second>=0?`${$countDown((data.miaosha.second-nowtime)*1000,'minute')[0]}:${$countDown((data.miaosha.second-nowtime)*1000,'minute')[1]}`:''}}
    </button>
    <button v-if="data.statusInfo.status===4" class="red" @click="next('/orders/comment/'+data.no)">立即评价</button>
  </div>
</template>

<script>
export default {
  name:'order-action-bar',
  
  props:{
    data:{type:Object},
    nowtime:{type:Number}
  },

  methods:{
    next(path){
      if(['WB','SJ','MR','CP','NC','YY','MG','TJ','FX','CZ','JF'].includes(this.data.statusInfo.orderType)){
        this.$router.push(path);
      }else{
        this.$appDownLoad.show()
      }
    },
    async changeStatus(status){

        //【3】已完成  【4】取消  【25】申请退货   【27】填写退货信息
        if(['XC'].includes(this.data.statusInfo.orderType)){
          this.$appDownLoad.show()
          return
        }
        let res='',
            data=this.$sign({
                content: {
                    no: this.data.no,
                    orderState:status
                }
            });

        if(status===4){
          if(!data.content.no){
            this.$toast('订单异常，请重试');
            eventBus.$emit('updateOrder');
            return
          }
          let order={
            no:this.data.no,
            orderType:this.data.statusInfo.orderType,
            status:this.data.statusInfo.state,
          }
          eventBus.$emit('changeCancel',true,order);
          // this.$messagebox.confirm('确定取消订单?', '提示').then(async ()=>{
          //   if(!data.content.no){
          //     this.$toast('订单异常，请重试');
          //     eventBus.$emit('updateOrder');
          //     return
          //   }
          //   res = await this.$post('/CRM/api/update.order.info.json',data);
          //   if(res&&res.errcode==0){
          //       eventBus.$emit('updateOrder');
          //   }
          // })
        }else if(status===3){
          this.$messagebox.confirm('是否确认收货?', '提示').then(async ()=>{
            
            res = await this.$post('/CRM/api/update.order.info.json',data);
            if(res&&res.errcode==0){
                eventBus.$emit('updateOrder');
            }
          })
        }else{
            res = await this.$post('/CRM/api/update.order.info.json',data);
            if(res&&res.errcode==0){
                eventBus.$emit('updateOrder');
            }
        }
    }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .order-action-bar{height: .44rem;text-align:right;box-sizing: border-box;padding:.095rem .2rem;background:#fff;border-top:$border;
      button{height:.25rem;padding:0 .1rem;border-radius:.03rem;margin-left:.1rem;border:$border;color:$gray;}
      button.red{border-color:$red;color:$red;}
    }
</style>
