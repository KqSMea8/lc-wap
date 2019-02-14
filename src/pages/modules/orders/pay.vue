 <template>

    <app-layout id="OrderPay" v-if="detail.no">
        <ul class="card">
            <li>
                <label>订单编号</label>
                <div class="item-val">{{detail.no}}</div>
            </li>
            <li>
                <label>订单实付金额</label>
                <div class="item-val">￥{{detail.payment}}</div>
            </li>
        </ul>

        <div slot="footer" class="nextOne"><div class="btn" @click="pay">确认支付</div></div>
    </app-layout>

 </template>
 
 <script>
  export default {
    name:'ex-orderPay',
    data() {
      return {
        detail:{}
      };
    },
    mounted() {
        this.getData();
    },
    beforeRouteLeave (to, from, next) {
      if(/paid/.test(to.path)){
        next()
      }else{
        this.$messagebox.confirm('订单还未支付，确定退出支付?', '提示').then((action)=>{
          if(/cart/.test(to.path)&&this.detail.no.split(',').length>1){
              this.$router.replace('/orders?status=0')
          }else{
            next()
          }
        }).catch(()=>{
          next(false)
        });
      }
      
      

      
    },
    methods:{

      async getData(){
        let data=this.$sign({
            content:{
              no:this.$route.params.id
            }
          });

        let res= await this.$post('/CRM/api/query.payedInfo.json', data);
        if (res.errcode === 0) {
          this.detail=res.content;
        }

      },
      async pay(){
        if(!isWechat){
          this.$toast('请使用微信浏览器支付');
          return
        }
        let detail=this.detail, 
          data=this.$sign({
            content:{
              body:detail.description,
              outTradeNo:detail.no,
              terminalIp:returnCitySN.cip,
              totalAmt:detail.payment,
              pMchid:detail.pMchid,
              tradeType:'JSAPI',
              openid:this.$utils.getCookie('openid')
            },
            pMchid:detail.pMchid,
            payType:'weixin'
          },'pay');

        let res=await this.$post('/paycenter/api/pay/trade.unifiedorder.json',data);
        if(res.errCode==0){
            let con=res.content.weixin;

              wx.chooseWXPay({
                timestamp:con.timeStamp, 
                nonceStr: con.nonceStr, 
                package: con.package, 
                signType: 'MD5',
                paySign: con.paySign,
                success: (res)=> {
                  eventBus.$emit('updateOrder');
                  this.$cache.history.pop();
                  this.$router.replace('/paid/'+detail.no);
                }
              });
 
            
        }

       }
    }
       
}
</script>

 <style lang="scss">
   @import "~assets/css/var.scss";
   #OrderPay{
    .card {
      li{border-bottom:$border;}
      li:not(.txtArea){@include box;height:.44rem;line-height:.44rem;padding:0 .12rem;}
      li:not(.txtArea) label{@include flex;}
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;height:.44rem;}
    }
  }
 </style>