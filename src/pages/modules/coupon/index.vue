<template>
    <app-layout id="coupon">
        <ul class="coupon-ul" v-show="listItems.length>0" v-infinite-scroll="loadMore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false" infinite-scroll-disabled="loading">
            
            <li v-for="(item,index) in listItems" :key="item.couponId" v-if="item.canSendEndTime>nowtime&&item.canSendStartTime<=parseInt(nowtime)+86400">
                <div class="left">
                    <img :src="item.couponType==1?pic_general1:pic_general2" alt="">
                    <div class="coupon-box" :class="{noAmt:item.isShowAmt==2}">
                        <p  >{{item.couponName}}</p>
                        <div v-if="item.isShowAmt!=2"><span :class="item.couponType==1?'blue':'yellow'" style="font-size:.13rem;margin:0">¥</span><span :class="item.couponType==1?'blue':'yellow'">{{item.deductMoney}}</span><em>{{item.condition}}</em></div>
                    </div>
                </div>
                <div :class="['right',item.couponType==1?'blue':'yellow']" >

                    <div class="time" v-if="item.canSendStartTime>nowtime">
                        <p>距离开抢还剩</p>
                        <div class="surplus-box" :class="item.couponType==1?'blue':'yellow'">
                            <div class="surplus">{{$countDown((item.canSendStartTime-nowtime)*1000)[0]}}</div>
                            <span class="point">:</span>
                            <div class="surplus">{{$countDown((item.canSendStartTime-nowtime)*1000)[1]}}</div>
                            <span class="point">:</span>
                            <div class="surplus">{{$countDown((item.canSendStartTime-nowtime)*1000)[2]}}</div>
                        </div>
                        
                    </div>

                    <img src="~assets/img/coupon/icon_coupon_get.png" alt="" v-else-if="item.userlimitQuantity<=item.hasGetNum||(item.hasGetNum>0&&item.sendCouponcodeQuantity>=item.maxGenQuantity&&item.userlimitQuantity>item.hasGetNum)">

                    <img src="~assets/img/coupon/icon_coupon_empty.png" alt="" v-else-if="item.sendCouponcodeQuantity>=item.maxGenQuantity">

                    <div class="time"  v-show="item.userlimitQuantity>item.hasGetNum&&item.sendCouponcodeQuantity<item.maxGenQuantity&&item.canSendStartTime<=nowtime">
                        <!-- <p>剩余{{parseInt((item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100)}}%</p>
                        <div class="progress">
                            <div :style="{'width':(item.max_gen_quantity-item.send_couponcode_quantity)/item.max_gen_quantity*100+'%'}"></div>
                        </div> -->
                        <div class="canvas-box" >
                            <canvas  class="canvas" :width="canvasWid" :height="canvasWid" :num="parseInt((item.maxGenQuantity-item.sendCouponcodeQuantity)/item.maxGenQuantity*100)==0?Math.ceil((item.maxGenQuantity-item.sendCouponcodeQuantity)/item.maxGenQuantity*100):parseInt((item.maxGenQuantity-item.sendCouponcodeQuantity)/item.maxGenQuantity*100)"></canvas>
                            <div class="canvas-circle" :class="item.couponType==1?'blue':'yellow'">
                                <div class="text-box">
                                    <div>剩余</div>
                                    <div>{{parseInt((item.maxGenQuantity-item.sendCouponcodeQuantity)/item.maxGenQuantity*100)}}%</div>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    <div class="btn" v-if="(item.hasGetNum==0&&item.sendCouponcodeQuantity>=item.maxGenQuantity)||item.canSendStartTime>nowtime" v-show="item.couponType==1" @click="use(item.type,item.couponId)">去逛一逛</div>
                    <div class="btn" v-else-if="(item.userlimitQuantity<=item.hasGetNum||(item.hasGetNum>0&&item.sendCouponcodeQuantity>=item.maxGenQuantity&&item.userlimitQuantity>item.hasGetNum))&&item.couponType=='1'"  @click="use(item.type,item.couponId)">立即使用</div>
                    <router-link to="/myCoupons/1" tag="div" class="btn" v-else-if="(item.userlimitQuantity<=item.hasGetNum||(item.hasGetNum>0&&item.sendCouponcodeQuantity>=item.maxGenQuantity&&item.userlimitQuantity>item.hasGetNum))&&item.couponType=='2'" >立即查看</router-link>
                    <div class="btn" v-else @click="receive(index,item.couponId,item.hasGetNum,item.sendCouponcodeQuantity,item.couponType)">立即领取</div>
                    
                </div>
            </li>
            
        </ul>
        <div  class="lc-error" v-show="listItems.length==0">
            <img src="~assets/img/error-empty.png">
            <p>抱歉，暂无优惠券</p>
        </div>
        <router-link to="/myCoupons/1" tag="div" slot="footer" class="nextOne exchange">我的卡券 ></router-link>
        <!-- <div class="mint-indicator-mask" v-show="isclick"></div> -->
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                pageNo:1,
                pageSize:10,
                loading:false,
                listItems:[],//优惠券
                nowtime:null,
                cleartime:'',
                canvasHtml:'',
                canvasWid:parseInt(document.documentElement.clientWidth/375*48),
                pic_general1:require('assets/img/coupon/icon_coupon_pic_general1.png'),
                pic_general2:require('assets/img/coupon/icon_coupon_pic_general2.png')
                // isclick:false
            }
        },

        activated(){ 
            this.resetPage()
            this.loadMore()
            clearInterval(this.cleartime)
            this.cleartime=setInterval(()=>{  
                // let now=new Date().getTime().toString()
                // this.nowtime=now.substr(0,10)
                this.nowtime=this.nowtime+1
            },1000)
               
        },

        deactivated(){
            clearInterval(this.cleartime)
        },

        methods:{
            async receive(index,id,hasgetnum,couponcode,type){
                
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        id:id,
                        apiType:type==1?'RECEIVE_ONLINE':type==2?'RECEIVE_OFFLINE':'RECEIVE_OUTPLATFORM',
                        receiveType:5
                    },
                    
                };
                let res = await this.$post('/couponSys/appcoupon/receiveOrRedeem.json',d);
                if(res.errcode==0){
                    this.listItems[index].hasGetNum=++hasgetnum;
                    this.listItems[index].sendCouponcodeQuantity=++couponcode;

                    setTimeout(()=>{
                        this.$nextTick(()=>{
                            this.loadCanvas()
                        })
                    },10)
                    this.$toast('领取成功')
                }else{
                    this.resetPage();
                    this.loadMore();
                    this.$toast(res.msg)
                }
            },
            use(type,id){
                switch(type){
                    case 'meirong':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cosmetology');
                        }else{
                            this.$router.push('/beauty');
                        }
                    break;
                    
                    case 'cargoods':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cargoods_with_coupon',id);
                        }else{
                            this.$router.push('/mall/cargoods?cpid='+id);
                        }
                    break; 

                    case 'yiye':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cargoods_with_coupon',id);
                        }else{
                            this.$router.push('/partners');
                        }
                    break;

                    case 'salecar':
                    case 'xiche':
                        if(isLecheng){
                            this.$utils.goNative('goodsclass_cargoods_with_coupon',id)
                        }else{
                            this.$appDownLoad.show()
                        }
                    break;
                    
                }
            },
            loadCanvas(){
                CanvasRenderingContext2D.prototype.sector = function(x, y, radius, sDeg, eDeg) {
                    this.save()
                    this.beginPath();
                    this.moveTo(x, y);
                    this.arc(x, y, radius, sDeg, eDeg, false);
                    this.closePath();
                    this.restore();
                    return this;
                }

                var canvasArr = document.querySelectorAll('.canvas');
                for(let i=0;i<canvasArr.length;i++){
                    var num=canvasArr[i].getAttribute('num')/100
                    var ctx = canvasArr[i].getContext('2d');
                    ctx.clearRect(0, 0, this.canvasWid, this.canvasWid);
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.sector(this.canvasWid/2, this.canvasWid/2, this.canvasWid/2, 0, Math.PI / 180 * 84 * 3.6).fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.sector(this.canvasWid/2, this.canvasWid/2, this.canvasWid/2, 0, Math.PI / 180 * 84* num * 3.6).fill();
                }
            },
            resetPage(){
                this.pageNo=1;
                this.loading=false;
                this.listItems=[];
            },
            async loadMore () {
                if(!this.loading)
                    this.loading=true
                    let d={
                        content: {
                            memberId: this.$cache.user.memberId,
                            mobile:this.$cache.user.phone,
                            pageSize:this.pageSize,
                            pageNo:this.pageNo,
                            apiType:'GET_COUPON_CENTER_ONLINE,GET_COUPON_CENTER_OFFLINE,GET_COUPON_CENTER_OUTPLATFORM'
                        },
                        
                    };
  
                    let res = await this.$post('/couponSys/appcoupon/getList.json',d);

                    if(res.errcode==0){

                        this.nowtime=Number(res.content.time)-1;
                        let list=res.content.list;
                        this.listItems=this.listItems.concat(list?list:[]);

                        setTimeout(()=>{
                            this.$nextTick(()=>{
                                this.loadCanvas()
                            })
                        },10)
                        
                        if(res.content.totalPages>this.pageNo){
                            this.pageNo += 1;
                            this.loading = false;  
                        }
                        
                    }
                    
                }
                
            }, 
            
        }
    
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #coupon{
        .exchange{
            font-size: .15rem;
            color: $black;
            height: .5rem;
            @include box;
            @include flexJustify;
            @include flexAlign;
        }
        .canvas-box{
            width: .48rem;
            height: .48rem;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
            .canvas{
                z-index: 2;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: .48rem;
                height: .48rem;
                margin: auto;
                transform: rotate(120deg);
            }
            .canvas-circle{
                font-size: .12rem;
                text-align: center;
                color: #fff;
                z-index: 3;
                width:.42rem;
                height: .42rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                border-radius: 50%;
                .text-box{
                    margin-top: .05rem
                }
                &.blue{
                    background: #44aae5;
                }
                &.yellow{
                    background: #f29600
                }
            }
        }
        
        .mint-navbar{
            position: relative;
        }
        .mint-navbar .mint-tab-item {
            border-right: 1px solid #f1f1f1 !important;
            border-bottom: 1px solid #f1f1f1;
            padding: 0;
            height: .44rem;
            .mint-tab-item-label{
                font-size: .15rem;
                line-height: .44rem;
            }
            &::last-child{
                border-right: 0;
            }
            &.is-selected{
                border-bottom: 3px solid $red;
            }
        }
        font-size: .12rem;
        color: #88888d;
        .coupon-ul{
            width: 90%;
            margin-left: 5%;
            padding-bottom: .2rem;
            li{
                width: 100%;
                height: .97rem;
                background: #fff;
                margin-top: .18rem;
                border-radius: 4px;
                @include box;
                .left{
                    @include flex;
                    @include box;
                    @include flexAlign;
                    img{
                        width: .64rem;
                        height: .55rem;
                        margin:0 .1rem;
                    }
                    .coupon-box{
                        height: .65rem;
                        @include box(nowrap);
                        @include flexDir(column);
                        @include flexJustify(space-between);
                        @include flex;
                        margin-right: .08rem;
                        &.noAmt{
                            @include flexJustify;
                        }
                        p{
                            font-size: .13rem;
                            word-break: break-all;
                            color: #22222d;
                        }
                        div{
                            span{
                                font-size: .24rem;
                                margin-right: .03rem;
                                font-weight: 600;
                                &.blue{
                                    color: #44aae5;
                                }
                                &.yellow{
                                    color: #e94816
                                }
                            }
                            em{
                                    font-style: normal;
                            }
                        }
                    }
                }
                .right{
                    text-align: center;
                    width: .9rem;
                    height: 100%;
                    text-align: center;
                    @include box;
                    @include flexDir(column);
                    @include flexJustify;
                    @include flexAlign;
                    &.blue{
                        background: url('~assets/img/coupon/background_coupon_shopping_right.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    &.yellow{
                        background: url('~assets/img/coupon/background_coupon_shopping_right_yellow.png') no-repeat;
                        background-size: 100% 100%;
                    }
                    .time{
                        position: relative;
                        color: #fff;
                        text-align: center;
                        .surplus-box{
                            @include box;
                            @include flexJustify;
                            &.blue{
                                    color: #44aae5;
                            }
                            &.yellow{
                                color: #e94816;
                            }
                            .surplus{
                                width: .16rem;
                                height: .16rem;
                                background: #fff;
                                line-height: .16rem;
                                text-align: center;
                                font-weight: 600;
                            }
                            .point{
                                margin: 0 .05rem;
                                color: #fff;
                            }
                        }
                        p{
                            font-size: .13rem;
                            margin-bottom: .08rem;
                        }
                        .progress{
                            width: .65rem;
                            height: .05rem;
                            background: rgba(0,0,0,.15);
                            border-radius: .05rem;
                            margin-top: .08rem;
                            position: relative;
                            div{
                                position: absolute;
                                left: 0;
                                top: 0;
                                border-radius: .05rem;
                                width: 80%;
                                height: 100%;
                                background: #fff;
                            }
                        }
                    }
                    img{
                        width: .48rem;
                        height: .48rem;
                        text-align: center;
                        // margin-top: .1rem;
                    }
                    .btn{
                        
                        height: .2rem;
                        line-height: .2rem;
                        padding: 0 .08rem;
                        display: inline-block;
                        border:1px solid #fff;
                        border-radius: .2rem;
                        text-align: center;
                        color: #fff;
                        margin-top: .08rem;
                    }
                }
            }
        }
    }
</style>
