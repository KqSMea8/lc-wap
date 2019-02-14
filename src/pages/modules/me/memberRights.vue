<template>
    <app-layout id="meMemberRights">
        <div class="meMember-card">
            <div class="card-bg" :class="cardtype">
                <div class="top">
                    <div class="head" :style="{'background-image':'url('+defaultHead+')'}"></div>
                    <div class="right">
                        <div class="name-box">
                            <div class="name">{{$cache.user.nickname}}</div>
                            <div class="type">{{$cache.user.level}}会员</div>
                        </div>
                        <div class="distance" v-if="$cache.user.growthPoint2NextLevel==0">您已升级为钻石卡会员</div>
                        <div class="distance" v-else>距离下一级还差{{$cache.user.growthPoint2NextLevel}}个成长值</div>
                        <div class="progress-box">
                            <div class="all-line">
                                <div class="line" :style="{'width':progress+'%'}"></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('普卡')}"></div></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('银卡')}"></div></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('金卡')}"></div></div>
                                <div class="round"><div :class="{animate:$cache.user.level.includes('钻石')}"></div></div>
                            </div>
                            <ul>
                                <li>普卡</li>
                                <li>银卡</li>
                                <li>金卡</li>
                                <li>钻石</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div>当前成长值<span class="num">{{$cache.user.growthPoint}}</span></div>
                    <div>成长值排名：<span>{{$cache.user.memberRank}}</span>名</div>
                </div>
            </div>
        </div>
        <div class="rights-box">
            <div class="title">{{$cache.user.level}}会员权益</div>
            <ul class="rights-ul">
                <router-link tag="li" :to="'./rightDetail?actUrl='+encodeURIComponent('/CRM/WeChat/forApp/vip_rights_detail.html?rid='+item.rid+'&grade='+grade)"  v-for="(item,index) in rightsList" v-show="cardNum>=item.type">
                    <img :src="item.img" alt="">
                    <p>{{item.title}}</p>
                    <div>{{item.con1}}<br/>{{item.con2}}</div>
                </router-link> 
            </ul>
        </div>
        
        <div class="area-title clearfix" v-if="list.length>0">
            <p>专享积分商品</p>
            <router-link class="arrow" to="/integralMall">
                <div>更多</div>
            </router-link>
        </div>

        <div class='goods-list col1' v-if="list.length>0">

            <router-link class="li" v-for="item in list" :to="'/integralMall/details/'+item.item_id">
                <div class="logo">
                <img :src="item.img">

                </div>
                <div  class="detail-box" style="width:1.6rem">
                <h1>{{item.title}}</h1>
                <ul>
                    <!-- <li v-if="item.jfinfo.jftips.title">{{item.jfinfo.jftips.title}}</li> -->
                </ul>
                <h2>
                    <svg class="icon" aria-hidden="true" style="width:.15rem;">
                    <use :xlink:href="'#icon-icon_integral'"></use>
                    </svg><span style="vertical-align: middle">{{item.jfinfo.itemjf}}{{parseFloat(item.jfinfo.itemprice)>0?`+￥${item.jfinfo.itemprice}`:''}}</span></h2>
                </div>
                <div class="exchange dis" v-if="item.status=='yiduihuan'">已兑</div>
                <div class="exchange dis" v-else-if="item.status=='kucunbuzu'">兑完</div>
                <div class="exchange" v-else>兑换</div>
            </router-link>
        </div>
        
    </app-layout>
</template>
<script>
    export default {
        data(){
            return{
                list:[],

                cardtype:'',
                cardNum:0,
                progress:0,
                iframeUrl:'',
                grade:'',
                rightsList:[
                    {
                        img:require('assets/img/me/icon_member_benefit_integral@2x.png'),
                        rid:0,
                        title:'积分回馈',
                        con1:'小积分',
                        con2:'购豪礼',
                        type:0
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_help@2x.png'),
                        rid:1,
                        title:'道路救援',
                        con1:'全省区域',
                        con2:'省心服务',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_vip@2x.png'),
                        rid:9,
                        title:'贵宾礼遇',
                        con1:'让你尽享',
                        con2:'尊贵体验',
                        type:2
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_birthday@2x.png'),
                        rid:2,
                        title:'生日服务',
                        con1:'生日祝福',
                        con2:'为您庆生',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_car@2x.png'),
                        rid:8,
                        title:'代步服务',
                        con1:'便利出行',
                        con2:'专享特权',
                        type:2
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_health@2x.png'),
                        rid:3,
                        title:'健康养生',
                        con1:'您的健康',
                        con2:'我们呵护',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_slowlife@2x.png'),
                        rid:4,
                        title:'休闲文化',
                        con1:'感受城市',
                        con2:'慢节奏',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_food@2x.png'),
                        rid:5,
                        title:'玩乐餐饮',
                        con1:'吃喝玩乐',
                        con2:'美妙生活',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_easylife@2x.png'),
                        rid:6,
                        title:'便民生活',
                        con1:'悉心关照',
                        con2:'点点滴滴',
                        type:1
                    },
                    {
                        img:require('assets/img/me/icon_member_benefit_activity@2x.png'),
                        rid:7,
                        title:'专属活动',
                        con1:'带给您',
                        con2:'不一样的体验',
                        type:1
                    }
                    
                ],
                defaultHead:this.$cache.user.headImgUrl||require('assets/img/default_user.png')
            }
        },
        activated(){
            this.list = []
            this.loadMore()
            if(this.$cache.user.level.includes('普卡')){
                this.cardtype="card0"
                this.cardNum=0;
                this.progress=this.$cache.user.growthPoint/500*100*(1/3);
                
                this.iframeUrl=this.$cache.user.privilegePuKaUrl;
                this.grade=251
            }else if(this.$cache.user.level.includes('银卡')){
                this.cardtype="card1"
                this.cardNum=1;
                this.progress=100*(1/3)+((this.$cache.user.growthPoint-500)/8500)*100*(1/3);
                this.iframeUrl=this.$cache.user.privilegeYinKaUrl
                this.grade=252
            }else if(this.$cache.user.level.includes('金卡')){
                this.cardtype="card2"
                this.cardNum=2;
                this.progress=100*(2/3)+((this.$cache.user.growthPoint-9000)/13000)*100*(1/3);
                this.iframeUrl=this.$cache.user.privilegeJinKaUrl
                this.grade=253
            }else if(this.$cache.user.level.includes('钻石')){
                this.cardtype="card3"
                this.cardNum=3;
                this.progress=100;
                this.iframeUrl=this.$cache.user.privilegeZuanShiKaUrl
                this.grade=254
            }
        },
        methods:{
            iframeLoad(){
                document.getElementById("iframe").height=0;
                document.getElementById("iframe").height=document.body.clientHeight
            },
            async loadMore() {
                let vm=this;
                vm.nomore = true;
                let data = {
                    content: {
                    itemtype:'jifen',
                    mobile:this.$cache.user.phone||'',
                    mbeid:this.$cache.user.memberId||'',
                    jflisttype:'grade',
                    pageNo:1,
                    pageSize:20,
                    order:'',
                    }
                };

                let res=await vm.$post('/mall29/itemlist.html', data);
                if (res.errcode === 0) {
                    vm.list = vm.list.concat(res.content.list);
                
                }
            },
        }
    }
</script>
<style lang="scss">

    @import "~assets/css/mall/goodsList.scss";
    #meMemberRights{
        .exchange{float: right; height: .18rem;border: 1px solid $red;padding: 0 .1rem;border-radius: .2rem; font-size: .14rem;line-height: .18rem; color: $red;margin-top:.3rem;
            &.dis{color: $gray;border-color: $gray}
        }
        .meMember-card{
            padding: .4rem 5%;
            .card-bg{
                width: 100%;
                height: 1.6rem;
                
                background-repeat:no-repeat; 
                background-size: 100% 100%;
                color: #fff;
                font-size: .12rem;
                .top{
                    padding: .12rem 0 .1rem;
                    @include box;
                    .head{
                        width: .5rem;
                        height: .5rem;
                        box-sizing: border-box;
                        border: 2px solid #fff;
                        border-radius: 50%;
                        margin-left:.2rem;
                        margin-right:.15rem;
                        background-size: cover;
                        background-position: center
                    }
                    .right{
                        @include flex;
                        margin-right: .15rem;
                        .name-box{
                            @include box;
                            @include flexJustify(space-between);
                            .name{
                                font-size: .18rem;
                            }
                            .type{
                                color: #fff;
                                height: .22rem;
                                background: rgba(0,0,0,.3);
                                padding: 0 .15rem;
                                line-height: .22rem;
                                border-radius: .22rem;
                            }
                        }
                        .distance{
                            margin-top: .08rem;
                        }
                        .progress-box{
                            margin-top: .12rem;
                            margin-left: .1rem;
                            position: relative;
                            .all-line{
                                position: relative;
                                @include box;
                                @include flexJustify(space-between);
                                height:1px;
                                width: 2.08rem;
                                
                                .round{
                                    width:.05rem;
                                    height: .05rem;
                                    border-radius: 50%;                               
                                    margin-top: -.025rem;
                                    position: relative;
                                    .animate{
                                        position: absolute;
                                        width:.05rem;
                                        height: .05rem;
                                        border-radius: 50%;
                                        animation: scaleami 1.5s infinite linear;
                                    }
                                    @keyframes scaleami {
                                        0%{
                                            transform: scale(1);
                                            opacity: .8;
                                        }
                                        100%{
                                            transform: scale(2.5);
                                            opacity: .3;
                                        }
                                    }
                                }
                                .line{
                                    position: absolute;
                                    max-width: 100%;
                                    height: 100%;
                                    width: 0%;
                                    left: 0;
                                    top: 0;
                                }
                            }
                            ul{
                                margin-left: -.1rem;
                                width: 2.27rem;
                                @include box;
                                @include flexJustify(space-between);
                                margin-top: .05rem;
                                li{

                                }
                            }
                        }
                    }
                }
                .bottom{
                    padding: 0 .2rem;
                    height: .48rem;
                    @include box;
                    @include flexJustify(space-between);
                    @include flexAlign;
                    .num{
                        vertical-align: middle;
                        font-size: .18rem;
                        margin-left: .05rem
                    }
                }
            }
            .card0{
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_puka@2x.png');
                .all-line{
                    background: #fea03e;
                    opacity: .5;
                }
                .line{
                    background: #fff;
                }
                .round{
                    background: #fff;
                    .animate{
                        background: #fff;
                    }
                }
                

            }
            .card1{
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_yinka@2x.png');
                color: #88888d;
                .all-line{
                    background: #d4d4d6;
                    opacity: .5;
                }
                .line{
                    background: #88888d;
                }
                .round{
                    background: #88888d;
                    .animate{
                        background: #88888d;
                    }
                }
            }
            .card2{
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_jinka@2x.png');
                .all-line{
                    background: #d6bb86;
                }
                .line{
                    background: #957029;
                }
                .round{
                    background: #957029;
                    .animate{
                        background: #957029;
                    }
                }
            }
            .card3{
                .all-line{
                    background: #fff;
                }
                .line{
                    background: #fff;
                }
                background-image: url('/CRM/WeChat/App/static/img/me/background_card_zuanshika@2x.png');
                .round{
                    background: #fff;
                    .animate{
                        background: #fff;
                    }
                }
            }
        }
        .rights-box{
            box-shadow: 0px -30px 30px 0px #dfdfdf;
            background: #fff;
            color: #000;
            .title{
                font-size: .15rem;
                padding: .15rem 5%;
            }
            .rights-ul{
                @include box;
                li{
                    width: 25%;
                    font-size: 0;
                    text-align: center;
                    margin-bottom: .15rem;
                    img{
                        width: .5rem;
                        height: .5rem;
                        border-radius: 50%;
                        box-sizing: border-box;
                        border: 1px solid #c9c9c9;
                    }
                    p{
                        font-size: .12rem;
                        margin: .04rem 0
                    }
                    div{
                        color: #88888d;
                        font-size: .1rem;
                        line-height: .12rem;
                    }
                }
            }
        }
        .recommend{
            height: .52rem;
            color: #22222d;
            font-size: .15rem;
            text-align: center;
            div{
                position: relative;
                display: inline-block;
                margin:.1rem .1rem;
                height: .32rem;
                line-height: .32rem;
                &::before{
                    content: '';
                    position: absolute;
                    width: .5rem;
                    height: 1px;
                    background: #22222d;
                    left: -.6rem;
                    top: .15rem;
                }
                &::after{
                    content: '';
                    position: absolute;
                    width: .5rem;
                    height: 1px;
                    background: #22222d;
                    right: -.6rem;
                    top: .15rem;
                }
            }
        }
        .area-title{margin-top:.05rem;padding:0 .2rem;height:.36rem;line-height:.36rem;background: #fff;border-bottom:$border;
      >p{float:left;@include txtOverflow;width:1.8rem;color:$black;}
      a{float:right;}
      .arrow div{padding-right:.1rem;
        &::after{top:.11rem;}
        &::before{top:.11rem;}
      }
      
    }
    }
</style>

