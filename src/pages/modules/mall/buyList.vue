<template>
    <app-layout id="mallBuyList">

        <div class="totle clearfix">
            <span>共{{num}}件商品{{serviceNum>0?`，${serviceNum}个服务`:''}}</span>
            <span>￥{{totle}}</span>
        </div>

        
        <div class="orders-goods" v-for="item in list">
            <div class="li">
                <img :src="item.img">
                <div class="info">
                    <h1><span class="secKill" v-if="item.miaosha">天天秒杀</span>{{item.title}}</h1>
                    <h2>{{item.spec_info}}</h2>
                    <h2 v-if="item.servicetype=='install'">服务：4s店免费安装</h2>
                    <h2 v-if="ziti">门店：{{ziti.zitititle}}</h2>
                    <p>
                        <span>￥{{item.miaosha?item.miaosha.price:item.price}}</span>
                        <del v-if="item.miaosha">￥{{item.price}}</del>
                        x{{item.quantity}}
                    </p>
                    
                </div>
            </div>
        </div>
    </app-layout>
</template>

<script>
export default {
    data() {
        return {
            totle:0,
            num:0,
            serviceNum:0,
            ziti:null,
            list: []
        };
    },
    activated() {
        let cart=this.$cache.cart;
        this.totle=cart.totle;
        this.num=cart.num;
        this.serviceNum=cart.serviceNum;
        this.ziti=cart.ziti
        this.list = [].concat(cart.origin);
    }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
    #mallBuyList{
        .totle{line-height: .5rem;border-bottom:$border;background:#fff;margin-top:.1rem;padding:0 .2rem;
            span{float:left;}
            span:last-of-type{float:right;color:$red;}
        }
        // .li{
        //     img{width: .6rem;height: .6rem;float: left}
        //     div{position: relative;
        //         span{position:absolute;right:0;bottom:0;}
        //     }
        // } 

        .orders-goods{border-bottom:$border;padding:.14rem .2rem;background:#fff;
            
            .li{display:block;min-height:.66rem;padding-left:.7rem;overflow: hidden;zoom:1;position: relative;}
            img{width:.6rem;height:.6rem;display: block;position:absolute;left:0;top:0;}
            
            .info{padding-right:.6rem;font-size:$h3;line-height:.2rem;

                h1{color:$black;max-height:.4rem;overflow: hidden;}
                h2{color:$gray;@include txtOverflow;}
                p{line-height:.15rem;position:absolute;right:0;top:0;text-align: right;
                span{color:$red;font-size: .14rem;display: block;;margin-bottom:.02rem;}}
                del{display: block;margin-bottom:.02rem;}
                div{color:$red;}
            }

            .secKill{height: .16rem;line-height: .16rem;font-size: .12rem;display: inline-block;padding: 0 .04rem;background: linear-gradient(to right, #f02d8d, #f2315e);color: #fff;border-radius: 3px;margin-right: .04rem;}
  
        }
    }
</style>