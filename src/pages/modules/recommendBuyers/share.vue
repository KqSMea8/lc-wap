<template>
    <app-layout id="recommendBuyersShare">

        <template v-if="pageData.hasRecord==2">
            <div class="main">
                <div class="info">
                    <img class="profile" :src="pageData.memberInfo.memberHeadPortrait">
                    <h1>{{pageData.memberInfo.memberName}}</h1>
                    <h2>送给您一份购车大礼包</h2>
                    <div class="banner">
                        <img :src="pageData.image">
                    </div>
                    <p><label>1</label>盈众老友记推荐客户，尊享<span>VIP购车礼遇；</span></p>
                    <p><label>2</label>购车成功的<span>新车主，</span>赠送<span>1000元购车大礼包；</span></p>
                    <p><label>3</label>推荐成功的<span>老车主，</span>可享<span>300-2000元保养抵用券。</span></p>
                </div>

                <p class="tip">意向在盈众汽车旗下各品牌门店购车客户皆可参加。</p>
                <router-link tag="button" :to="`/recommendBuyers/recommend?id=${$route.params.id}&type=${$route.query.type}`">立即报名</router-link>
            </div>
            
            <div class="aboutUs">
                <div class="con new" v-if="$route.query.type==1">
                    <p>盈众汽车<span>创立于2000年6月</span>，是一家以汽车销售服务为主的综合性企业，<span>下属50余家品牌汽车4S店及汽车服务类子公司</span>，经销一汽-大众、上汽大众、斯柯达、奥迪、进口大众、英菲尼迪、上汽通用别克、克莱斯勒吉普、长安福特、雪佛兰、丰田、凯迪拉克、上汽荣威、吉利等品牌。公司业务范围覆盖整车销售、售后维修、金融保险、二手车、备件精品、汽车电商、汽车文化等完整的产业服务链，业务遍及福建全省。2009年，成为福建省率先突破万辆规模的汽车销售服务企业集团。2016年，公司共销售乘用车近55000辆，营业额突破107亿元。截止2017年年底，<span>全省拥有40万+车主选择盈众</span>，还在等什么，赶快加入我们吧。</p>
                    <div>盈众汽车集团旗下代理品牌</div>
                    <img src="/CRM/WeChat/App/static/img/recommendBuyers/pic_logo.png">
                </div>
                <div class="con old" v-else>
                    <p><span>易新二手车</span>有限公司成立于2003年2月，隶属于盈众控股集团有限公司，公司自成立以来连续荣获中国汽车流通协会<span>“优秀二手车经销商”、““行”认证诚信建设功勋奖”</span>等多项殊荣。公司一直秉承盈众“卓越服务，快乐生活”的企业宗旨，竭诚致力二手车服务，业务范围涵盖二手车鉴定评估、置换收购、认证零售、金融延保、竞价批售及售后服务等模块<span>全省拥有40万+车主选择盈众</span>，还在等什么，赶快加入我们吧。</p>
                    <a href="https://yz.souche.com/?__mobile=true"><img style="margin-top:.1rem" src="/CRM/WeChat/App/static/img/recommendBuyers/esbanner.jpg"></a>
                    
                </div>
            </div>
 
        </template>

        <template v-if="pageData.hasRecord==1">
            <div class="aboutAct">
                <img class="banner" :src="pageData.image">
                <h1>您已报名参加盈众老友记活动</h1>
                <h2>请根据流程说明进店购车，享受优惠活动！</h2>
                <router-link :to="`/article/${$route.query.type=='1'?pageData.activityRuleId:pageData.usedCarActRuleId}`">查看规则详情 》</router-link>
            </div>
            
            <!-- <router-link tag="div" class="store" v-for="store in pageData.recommendList" :to="'/stores/'+store.foursId">
                <img class="pic" :src="store.foursImage">
                <h1>{{store.foursName}}</h1>
                <div class="brands">
                    <img v-for="item in store.brandImage.split(',')" :src="item">
                </div>
                <lc-rate disabled v-model="store.score"></lc-rate>
                <div class="addr clearfix"><p>{{store.address}}</p><span>{{getDistance(store.longitude,store.dimension)}}</span></div>
                <div class="arrow-link">查看门店</div>
            </router-link> -->
            
            <div class="store-info" v-for="store in pageData.recommendList">
                <div  class="info" @click="linkPage(store)" >
                
                    <div class="name">
                        <h2>{{store.foursName}}</h2>
                        <div v-if="store.brandImage">
                            <img v-for="item in store.brandImage.split(',')" :src="item">
                        </div>
                        <div class="arrow-link">{{store.foursName.includes('二手车')?'查看车型':'查看门店'}}</div>
                    </div>
                    
                    <div class="address" style="margin-top:.07rem">
                        <p>{{store.address}}</p>
                        <span>{{getDistance(store.longitude,store.dimension)}}</span>
                    </div>
                </div>
                <div class="contact">
                    <router-link :to="'/map?lat='+store.dimension+'&lng='+store.longitude">地图</router-link>
                    <a :href="'tel:'+store.phone">电话</a>
                </div>
            </div>

            <div slot="footer" class="nextOne"><div class="btn" @click="sheetVisible=true">我还要报名</div></div>
            <mt-actionsheet 
                slot="aside"
                :actions="actions"
                v-model="sheetVisible"
                cancelText="取消">
            </mt-actionsheet>
            
        </template>
        
    </app-layout>
</template>

<script>
    export default {
        data(){
            return{
                myLocation:'',
                pageData:{},
                sheetVisible:false,
                actions:[
                    {
                        name:'报名新车',
                        method:()=>{
                            this.$router.push('/recommendBuyers/recommend?id='+this.$route.params.id+'&type=1')
                        }
                    },
                    {
                        name:'报名二新车',
                        method:()=>{
                            this.$router.push('/recommendBuyers/recommend?id='+this.$route.params.id+'&type=2')
                        }
                    }
                ],
            }
        },
        mounted(){
        let point=this.$cache.location;
        this.myLocation=new BMap.Point(point.lng,point.lat);
      },
       activated(){
          this.getData();
      },
      methods: {
        linkPage(store){
            if(store.foursName.includes('二手车')){
                location.href="https://yz.souche.com/?__mobile=true"
            }else{
                this.$router.push(`/stores/${store.foursId}`)
            }
        },
        async getData() {
            let data={
                content: {
                    memberId:this.$route.params.id,
                    openId:document.cookie.replace(/(?:(?:^|.*;\s*)openid\s*\=\s*([^;]*).*$)|^.*$/, "$1")
                }
            };

            let res=await this.$post('/CRM/wechatrecommendbuycar/invitationLetter.json',data);
            if(res.errcode==0){
                let con=res.content;
                this.pageData=con;
                // this.$cache.usedCarStore={usedCarStoreId:con.usedCarStoreId,usedCarStoreName:con.usedCarStoreName}
                let usedCarStore = JSON.stringify({usedCarStoreId:con.usedCarStoreId,usedCarStoreName:con.usedCarStoreName})
                sessionStorage.setItem('usedCarStore',usedCarStore)
                if(con.hasRecord==1){eventBus.$emit('layout');}
            }
        },
        getDistance(lng,lat){
            let point=new BMap.Point(lng,lat);
            let distance=Math.round(this.$BMap.getDistance(this.myLocation,point));

            return distance>=1000?Math.round(distance/1000)+'km':distance+'m';
        }
      }
    }
    
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #recommendBuyersShare{
        .main{padding:1.1rem .2rem .15rem;
            background:url('/CRM/WeChat/App/static/img/recommendBuyers/bg_oldfriends.png') no-repeat 0 -.2rem,
                linear-gradient(to bottom,#ffa230 0%,#ff5130 100%);
            background-size:100% ;

            .info{color:$black;text-align:center;background:#fff;border-radius:10px;padding:.3rem .15rem .15rem;position: relative;line-height:.2rem;
                .profile{position: absolute;width:.46rem;height:.46rem;top:-.23rem;left:50%;margin-left:-.23rem;border-radius: 50%;}
                h2{color:$gray;margin-top:.05rem;}
                .banner{position: relative;height:1.4rem;margin:.3rem 0 .1rem;padding-bottom:.15rem;border-bottom:$border;
                    &:before{content:'';position:absolute;top:-.26rem;left:50%;margin-left:-.635rem;z-index:2;width:1.27rem;height:.565rem;background:url('/CRM/WeChat/App/static/img/recommendBuyers/icon_banner_gift.png') no-repeat center;background-size:100%;}
                    img{width:100%;height:100%;}
                }
                p{text-align: left;margin-top:.05rem;font-size:$h3;
                    label{background:#fb770a;border-radius:50%;color:#fff;font-size:$h4;padding:0 .03rem;margin-right:.05rem;}
                    span{color:#e83a18;font-weight: bold;}
                }
            }

            .tip{color:#fff;font-size:$h3;text-align: center;margin:.1rem auto;}

            button{color:#761e1d;line-height: .4rem;width:100%;border-radius:99px;@include transColor_t2b(#ffe668,#feb626);}
        }

        .aboutUs{background:#fff;padding:.4rem .2rem;
            .con{border:1px solid #761e1d;border-radius: 8px;padding:.3rem .1rem .1rem;position: relative;font-size:$h3;
                p{line-height:.2rem;text-indent:.24rem;span{color:#e83a18;}}
                
                div{width:1.82rem;line-height: .25rem;background:#e83a18;color:#fff;text-align: center;border-radius:99px;margin:.2rem auto;}
                img{width:100%;}
                &.new{
                    &:before{content:'';position:absolute;top:-.2rem;left:50%;margin-left:-1.06rem;z-index:2;width:2.12rem;height:.325rem;background:url('/CRM/WeChat/App/static/img/recommendBuyers/icon_title_introduce.png') no-repeat center;background-size:100%;}
                }
                &.old{
                    &:before{content:'';position:absolute;top:-.2rem;left:50%;margin-left:-1.06rem;z-index:2;width:2.12rem;height:.325rem;background:url('/CRM/WeChat/App/static/img/recommendBuyers/icon_title_introduce1.png') no-repeat center;background-size:100%;}
                }
            } 
        }

        .aboutAct{margin-bottom:.05rem;background:#fff;text-align:center;font-size:$h3;padding-bottom:.1rem;
            img{margin-bottom:.2rem;}
            h1{color:$black;font-size:$h2;}
            h2{color:$gray;margin:.05rem 0;}
            a{color:$red;text-decoration: $red;}
        }

        // .store{display:block;position: relative;padding:.1rem .2rem .1rem 1.05rem;background: #fff;border-bottom:$border;min-height:.7rem;
        //     .pic{position:absolute;left:.2rem;top:.1rem;width:.7rem;height:.7rem;}
        //     .brands{height: .2rem;
        //         img{width:.2rem;height:.2rem;margin-right:.05rem;}
        //     }

        //     .addr{font-size:$h4;color:$gray;
        //         p{width:70%;@include txtOverflow;float: left;}
        //         span{float:right;}
        //     }

            .arrow-link{font-size:$h3;color:$red;position:absolute;right:0;top:.12rem;padding-right:.3rem;line-height: .2rem;
                &::before{
                    border-left-color: $red;
                }
            }
        // }
        .store-info{padding:0 .2rem;border-bottom:$border;background:#fff;margin-bottom:.05rem;position: relative;
        &.on{color:inherit;
            .name{background: url('~assets/img/mall/icon_list_detail_select.png') no-repeat right center;background-size:17px 12px;}
        }
        .info{padding: .12rem 0;
            .name{@include box;margin-bottom:.04rem;
                h2{font-size:.15rem;color:$black}
                
                &:last-of-type{margin-bottom:0;}
                div{height: .2rem;margin-left:.15rem;
                    img{width: .2rem;height:.2rem;margin-left: .02rem;}
                }
                
            }
            .address{color: $gray;@include box;@include flexJustify(space-between);margin-top:.04rem;line-height:.2rem;font-size:$h3;
                p{width: 80%;@include txtOverflow}
            }
        }
        .contact{@include box;padding:.1rem 0;border-top:$border;color: $black;font-size: .14rem;}
            a{@include flex;text-align: center;
            &:before{content:'';display: inline-block;width:.14rem;height:.14rem;margin-right:.06rem;vertical-align: middle;background: url('~assets/img/mall/icon_popup_list_phone.png') no-repeat center;background-size:.14rem .14rem;}
            &:first-of-type:before{background-image: url('~assets/img/mall/icon_popup_list_address.png');margin-top: -.02rem;}
            &:first-of-type{border-right:$border;}
        }
        
        .saleCoupon-ul{@include box;line-height:.16rem;font-size:.12rem;
            li{color: #fff;background: $red;padding:0 .04rem; border-radius: 3px;margin:.02rem 0;margin-right: .05rem;}
        }
        
    }
    
    }
</style>

