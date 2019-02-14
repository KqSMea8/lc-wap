<template>

    <div class="orders-goods">
        <a @click="goDetails(data.id)">
            <img :src="data.icon">
            <div class="info">
                <h1><span class="secKill" v-if="data.miaosha">天天秒杀</span>{{data.name}}</h1>
                <h2 v-if="type!=='TJ'">{{data.subtitle}}</h2>
                <h2 v-if="type==='CP'&&data.serviceTypeName">服务：{{data.serviceTypeName}}</h2>
                <h2 v-if="type==='CP'&&data.foursName">门店：{{data.foursName}}</h2>

                <div v-if="type==='TJ'"  class="special-price"><img class="icon-pricecar" src="~assets/img/mall/icon_detail_1pricecar.png"/><span style="font-size:.15rem;margin-right:.05rem">￥{{parseFloat(data.price)}}万</span> <del>￥{{parseFloat(data.origPrice)}}万</del></div>
                
                <div v-if="type==='NC'" class="dingjin">：￥{{data.price}}</div>

                
                <p v-else>
                    <span v-if="type==='JF'"><svg class="icon" aria-hidden="true" style="width:.13rem;">
                        <use :xlink:href="'#icon-icon_integral'"></use>
                    </svg><em style="font-style: normal;vertical-align: middle;">{{data.credit}}</em></span>
                    
                    <span v-if="type==='JF'&&parseFloat(data.price)>0">+ ￥{{data.price}}</span>
                    <span v-if="type!=='JF'&&data.price">￥{{data.miaosha?data.miaosha.price:data.price}}</span>
                    <del v-if="data.miaosha">￥{{data.price}}</del>
                    <template v-if="data.num">x{{data.num}}</template>
                </p>
               
            </div>
        </a>
        <div v-if="data.afterSaleText" class="afterSale"><button @click.stop="$appDownLoad.show()">{{data.afterSaleText}}</button></div>
    </div>

</template>

<script>
export default {
  name:'order-goods',
  
  props:{
    type:{type:String,default:'CP'},
    data:{type:Object},

  },
    
  methods:{
    cancel(id,type){
        let vm=this;
        vm.$messagebox.confirm('确定取消订单?', '提示').then(async function(){
            let res=await vm.$post('/CRM/apptestdriveorder/cancelTestdriveOrderById.json',d);
            if(res.errcode==0){
                eventBus.$emit('updateOrder','service');
            }
        });
    },
    goDetails(id){
        
        switch(this.type){
            case 'CP':
                this.$router.push('/mall/cargoods/'+id)
            break;
            case 'TJ':
                this.$router.push('/mall/salecar/'+id)
            break;
            case 'NC':
                this.$router.push('/mall/car/'+id)
            break;
            case 'JF':
                this.$router.push('/integralMall/details/'+id)
            break;
            default:
                this.$router.push('/mall/cargoods/'+id)
            break;
        }

    }
  }
}
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    .orders-goods{border-bottom:$border;padding:.14rem .2rem;background:#fff;
            
        a{display:block;min-height:.66rem;padding-left:.7rem;overflow: hidden;zoom:1;position: relative;}
        img{width:.6rem;height:.6rem;display: block;position:absolute;left:0;top:0;}
        .secKill{height: .16rem;line-height: .16rem;font-size: .12rem;display: inline-block;padding: 0 .04rem;background: linear-gradient(to right, #f02d8d, #f2315e);color: #fff;border-radius: 3px;margin-right: .04rem;}
        .info{padding-right:.6rem;font-size:$h3;line-height:.2rem;
            &.car{padding-right:0;}
            h1{color:$black;max-height:.4rem;overflow: hidden;}
            h2{color:$gray;@include txtOverflow;}
            p{line-height:.15rem;position:absolute;right:0;top:0;text-align: right;
                span{color:$red;font-size: .14rem;display: block;;margin-bottom:.02rem;}
                del{display: block;margin-bottom:.02rem;}
                span{color:$red;}
            }
            div{color:$red;}
        }
        .num{line-height: .6rem;float:right;}

        .afterSale{text-align:right;
            button{min-width:.8rem;font-size:$h2;color:$gray;line-height:.25rem;padding:0 .1rem;border:$border;}
        }
        .special-price{
            
           @include box;
           @include flexAlign;
            margin-top: .02rem;
            img{width: .37rem;height:.13rem;align-self: center;margin-right: .06rem;margin-top: -.01rem;position: relative !important;};
            span{color:$red}
            del{color:$gray}
        }
            
    }
</style>
