<template>
    <app-layout id="myCarsDetail">
        <div class="detail-box" :style="serviceCust ? '':'height:100%'">
            <router-link  to="/myCars"><div class="manage-car">管理车型</div></router-link>
            <swiper class="my-cars" :options="carSwiper" ref="mySwiper" :not-next-tick="notNextTick">
                <swiper-slide  class="card" v-for="(item,index) in listItems">
                    <img src="~assets/img/myCars/default.png" class="default" alt="" v-show="item.isDefaultCar">
                    <img :src="item.carImgUrl" class="logo"/>
                    <div class="info">
                        <p>{{item.licenseplate}}</p>
                        <div>{{item.brandName}} {{item.modelName}}</div>
                    </div>
                    <div class="edit" @click="editCar">
                        <img src="~assets/img/icon-edit.png"/>
                        <div>编辑</div>
                    </div>
                </swiper-slide>

                <div class="swiper-pagination"  slot="pagination"></div>
            </swiper>
                
                <!-- <ul class="func">
                    
                    
                    <li @click="goManual">
                        <img src="~assets/img/myCars/icon_mycar_note@2x.png" />
                        <p>保养手册</p>
                    </li>
                    <router-link tag="li" to="/carWiki">
                        <img src="~assets/img/myCars/icon_mycar_knowledge@2x.png" />
                        <p>用车百科</p>
                    </router-link>
                </ul> -->
            <div class="module-box">
                <ul class="clearfix">
                    <router-link tag="li" :to="`/stores/${carInfo['4sStoreId']}`">
                        <img src="~assets/img/home/module_icon13.png">
                        <div>专属4S店</div>
                    </router-link>
                    <router-link tag="li" :to="'/myCars/repair/'+carId">
                        <img src="~assets/img/home/module_icon14.png" />
                        <p>维保历史</p>
                    </router-link>
                    <router-link tag="li" :to="'/myCars/safe/'+carId">
                        <img src="~assets/img/home/module_icon15.png" />
                        <p>保险记录</p>
                    </router-link>
                    <li @click="goManual">
                        <img src="~assets/img/home/module_icon6.png">
                        <div>保养手册</div>
                    </li>
                    <router-link tag="li" to="/carWiki">
                        <img src="~assets/img/home/module_icon7.png">
                        <div>用车百科</div>
                    </router-link>
                    <li><a href="/CRM/static/pages/others/activity/sos/index.html"><img src="~assets/img/home/module_icon16.png"><h2>一键救援</h2></a></li>
                    <!-- <li><router-link :to="'/sos?actUrl='+encodeURIComponent('/CRM/static/pages/others/activity/sos/index.html')"><img src="~assets/img/home/module_icon16.png"><h2>一键救援</h2></router-link></li> -->
                </ul>
            
            </div>
            <ul class="detail-cen">
                <li>
                    <div class="head" @click="goPeccancy">
                        <img src="~assets/img/myCars/icon_mycar_steward_traffic@2x.png" />
                        <span>违章提醒</span>
                        <div class="right" >
                            <span v-show="violation.queryViolationDate">查询更新时间：{{violation.queryViolationDate}}</span>
                            <span class="arrow"></span>
                        </div>
                    </div>
                    <div class="data" v-if="violation.queryViolationDate">
                        <li>
                            <p>未处理</p>
                            <div>{{violation.number}}</div>
                        </li>
                        <li>
                            <p>扣分</p>
                            <div>{{violation.fen}}</div>
                        </li>
                        <li>
                            <p>罚款</p>
                            <div>{{violation.money}}</div>
                        </li>
                    </div>
                    <div class="nodata" v-else @click="goPeccancy">快速查询全国违章信息</div>
                </li>   
                <li>
                    <div class="head" @click="goSetmaintain">
                        <img src="~assets/img/myCars/icon_mycar_steward_service@2x.png" />
                        <span>{{maintain.name}}</span>
                        <div class="right">
                            <span v-show="maintain.maintainKilometer">下次保养公里数{{maintain.maintainKilometer}}KM</span>
                            <img src="~assets/img/icon-edit.png"/>
                        </div>
                    </div>       

                    <div class="data" @click="goMaintain" v-if="maintain.maintainDayNum!==''">
                        <div class="surplus">
                            <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                            <span>距离下一次保养还有</span>
                        </div>
                        <div class="date"><span>{{maintain.maintainDayNum}}</span>天</div>
                    </div>
                    <div class="nodata" v-else @click="goSetmaintain">下次保养早知道</div>
                    
                </li> 
                <li>
                    <div class="head" @click="goSetsafe">
                        <img src="~assets/img/myCars/icon_mycar_steward_insurance@2x.png" />
                        <span>{{insurance.name}}</span>
                        <div class="right">
                            <img src="~assets/img/icon-edit.png"/>
                        </div>
                    </div>
                    <div class="data" @click="goSafe" v-if="insurance.insuranceDayNum!==''">
                        <div class="surplus">
                            <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                            <span>距离下一次续保还有</span>
                        </div>
                        <div class="date"><span>{{insurance.insuranceDayNum}}</span>天</div>
                    </div>
                    <div class="nodata" @click="goSetsafe" v-else>一键设置，永不脱保</div>
                </li> 
                <li>
                    <div class="head"  @click="goSetcheck">
                        <img src="~assets/img/myCars/icon_mycar_steward_check@2x.png" />
                        <span>{{annual.name}}</span>
                        <div class="right">
                            <img src="~assets/img/icon-edit.png"/>
                        </div>
                    </div>      
                    <div class="data" @click="goCheck" v-if='annual.annualStopDayNum!==""'>
                        <div class="surplus">
                            <img src="~assets/img/myCars/icon_mycar_alarm@2x.png"/>
                            <span>距离下一次年检还有</span>
                        </div>
                        <div class="date"><span>{{annual.annualStopDayNum}}</span>天</div>
                    </div>
                    <div class="nodata" @click="goSetcheck" v-else>轻松设置，年检不再错过</div>
                </li>      
            </ul>
        </div>
        <div class="detail-fixed" v-if="serviceCust">
            <div class="nickname">
                <div class="head" @click="goServer" :style="serviceCust.scImgUrl ? {'background-image':'url('+serviceCust.scImgUrl+')'} : {'background-image':'url('+default_server+')'}"></div>
            </div>
            
            <div class="name">
                <p>{{serviceCust.scName}}</p>
                <div>{{serviceCust.scService4SName}}</div>
            </div>
            <!-- <a :href="'msg:'+serviceCust.scMobilePhone">
            <img src="~assets/img/myCars/message.png" class="phone"/>
            </a> -->
            <a :href="'tel:'+serviceCust.scMobilePhone">
            <img src="~assets/img/phone.png" class="phone"/>
            </a>
        </div>
    </app-layout>
</template>
<script>
    export default {
    //   name:'ex-myCarsdetail',
      data() {
        return {
            carId:'',
            carInfo:'',
            violation:'',
            maintain:'',
            insurance:'',
            annual:'',
            serviceCust:'',
            default_server:require('assets/img/default_user.png'),
            notNextTick: true,
            carSwiper: {
                slidesPerView:1,
                spaceBetween:8,
                pagination: '.swiper-pagination',
                onSlideChangeEnd:(swiper) =>{
                    this.carId=this.listItems[swiper.realIndex].carId;
                    this.getData();
                },
            },
            listItems:[],
            changeId:false
        }
      },
      computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
      },
      mounted() {
        //   this.carId=this.$route.params.carId;
      },
      activated() {
            if(this.changeId){
                if(this.$cache.car.carId){
                    this.carId=this.$cache.car.carId;
                }
            }
              
            this.getCarList()
            this.getData();

          
      },
      beforeRouteLeave (to, from, next) {
          if(to.path=='/home'||to.path=='/myCars'){
              this.changeId=true
          }else{
              this.changeId=false
          }
          next()
      },
      methods: {
        async getCarList () {
            let d={content: {memberId:this.$cache.user.memberId}};

            let res = await this.$post('/CRM/appmembermgcust/queryCarList.json',d);
            if(res.errcode==0){
                this.listItems=res.content.carList;
                if(this.carId==''){
                    this.carId=this.listItems[0].carId;
                }
                for(var i=0;i< this.listItems.length;i++){
                    if(this.listItems[i].carId==this.carId){
                        this.swiper.slideTo(i, 300, false);
                        break;
                    }
                }
            }
        },
        async getData () {
            let d={
                content: {
                    memberId: this.$cache.user.memberId,
                    carId:this.carId
                }
            };

            let res = await this.$post('/CRM/appgarage/getGarageList.json',d);
            if(res.errcode==0){
               this.carInfo=res.content.carInfo;
               this.violation=res.content.violation;
               this.maintain=res.content.maintain;
               this.insurance=res.content.insurance;
               this.annual=res.content.annual;
               this.serviceCust=res.content.serviceCust;

               this.$cache.car.carId = this.carId;
               this.$cache.fourS.id = this.carInfo['4sStoreId']
   
            }
        },
        goServer(){
            this.$cache.car.carId=this.carId;
            this.$cache.fourS={
                id:this.carInfo['4sStoreId'],
                name:this.carInfo['4sStoreName']
            };
            this.$cache.server={
                id:this.serviceCust.scId,
                name:this.serviceCust.scName
            };

            this.$router.push('/server/detail');
        },
        goPeccancy(){
            
            let content={},
                other={},
                data=this.violation.carInf;

                content.licenseplate=data.licenseplate;
                content.licenseplatePrefix=data.licenseplatePrefix;
                content.ecode=data.engineno||'';
                content.vcode=(/systemdefault/.test(data.carframeno)||!data.carframeno)?'':data.carframeno;
                
                content.city_name=data.cityName;
                content.province=data.provinceCode;

                content.brandId=data.brandId||'';
                content.seriesId=data.seriesId||'';
                content.modelId=data.modelId||'';

                other.iCar=data.iCar;
                other.img=data.carImgUrl||'';
                other.seriesName=data.seriesName||'';
                other.modelName=data.modelName||'';

                this.$cache.peccancy={content:content,other:other};
                this.$router.push('/peccancy/add');

        },
        goManual(){
            this.$cache.urlquery={}
            this.$cache.urlquery.carId=this.carId;
            this.$router.push({path:'/manual'})
        },
        goSetmaintain(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.maintain));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/setMaintainRemind/'+this.carId,params:{carId:this.carId}})
        },
        goMaintain(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.maintain));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/maintainRemind/'+this.carId,params:{carId:this.carId}})
        },
        goSetsafe(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.insurance));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/setSafeRemind/'+this.carId,params:{carId:this.carId}})
        },
        goSafe(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.insurance));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/safeRemind/'+this.carId,params:{carId:this.carId}})
        },
        goSetcheck(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.annual));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/setCheckRemind/'+this.carId,params:{carId:this.carId}})
        },
        goCheck(){
            this.$cache.urlquery=JSON.parse(JSON.stringify(this.annual));
            this.$cache.urlquery.licenseplate=this.carInfo.licenseplate;
            this.$router.push({path: '/myCars/checkRemind/'+this.carId,params:{carId:this.carId}})
        },
        editCar(){
            
            let carInfo=this.carInfo;
            carInfo.carId=this.carId;

            let serviceCust=this.serviceCust;
            if(serviceCust){
                this.$cache.server={
                    id:serviceCust.scId,
                    name:serviceCust.scName
                };
            }

            this.$cache.fourS={
                id:carInfo['4sStoreId'],
                name:carInfo['4sStoreName']
            }

            let bid=carInfo.brandId;
            if(bid){
                this.$cache.brand={
                    bid:bid,
                    sid:carInfo.seriesId||'',
                    mid:carInfo.modelId||'',
                    name:carInfo.brandName+carInfo.seriesName+carInfo.modelName
                }
            }

            this.$cache.car=carInfo;

            this.$router.push({path: '/bindCar'})
        }
      }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #myCarsDetail{
        .detail-box{
            height: calc(100% - .55rem);
            overflow: auto;
            padding-bottom: .31rem;
            box-sizing: border-box
        }
        .manage-car{
            background:$red;color:#fff;text-align: right;font-size: .14rem;padding: .1rem .2rem;
        }
        .my-cars{background:$red; padding: 0 .2rem ;text-align:center;
            .card{
                position: relative;
                text-align:left;
                background: #fff;
                width: 100%;
                height: .855rem;
                margin: 0;
                box-sizing: border-box;
                opacity: .8;
                transition:opacity .3s ease-out;
                @include box;
                @include flexAlign;
                .default{width: .4rem;position: absolute;left:0;top: 0;}
                .logo{
                    width: .48rem;
                    height: .48rem;
                    margin: 0 .15rem;
                }
                .info{
                    @include flex;
                    margin-right: .1rem;
                    p{
                        color: #231815;
                        font-size: .18rem
                    }
                    div{
                        font-size: .12rem;
                        color: #86878c;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                    }
                }
                .edit{
                    height: .25rem;
                    width: .53rem;
                    box-sizing: border-box;
                    border-left: 1px solid #dfdfdf;
                    @include box(nowrap);
                    @include flexJustify;
                    @include flexAlign;
                    @include flexDir(column);
                    img{
                        width: .15rem;
                        height: .15rem;
                    }
                    div{
                        font-size: .12rem;
                        color: #86878c;
                        margin-top: .05rem;
                    }
                }
            }
            .swiper-slide-active{opacity: 1;}
            .swiper-pagination{position: relative;bottom:auto;left:auto;border: 1px solid #fff;display: inline-block;width:auto;margin: .08rem auto;border-radius: 99px;line-height: 3px;}
            .swiper-pagination-bullet{border-radius: 0;margin:0;height:3px;vertical-align: bottom;background:#fff;opacity: 1;text-align: center;}
            .swiper-pagination-bullet-active{border-radius:100%;background:$red!important;}
            .func{
                @include box;
                margin-top: .18rem;
                @include flexJustify(space-between);
                padding: 0 .04rem;
                li{
                    color: #fff;
                    text-align: center;
                    font-size: .12rem;
                    img{
                        width: .3rem;
                        height: .3rem;
                    }
                }
            }
        }
        .module-box{background: #fff;margin-top: .05rem;
            li{text-align: center;font-size: .12rem;line-height:.15rem;color: #000;width:25%;height: .65rem;border-right:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;box-sizing: border-box;background: #fff;float:left;position: relative;
            img{height: .25rem;margin: .08rem auto .05rem;}
            .mint-badge{padding:1px 4px !important;position: absolute;top: .07rem;font-size: .11rem;}
            &:nth-of-type(4n){border-right:0;}}
        }
        .detail-cen{
            padding:0 5%;
            > li{
                background: #fff;
                border-radius: 4px;
                margin-top: .15rem;
                .head{
                    @include box;
                    height: .4rem;
                    padding-right: .15rem;
                    @include flexAlign;
                    border-bottom: 1px dashed #d2d2d4;
                    > img{
                    width: .2rem;
                    height: .2rem; 
                    margin: 0 .1rem;
                    }
                    > span{
                        font-size: .15rem;
                        color: #22222d;
                    }
                    .right{
                        @include flex;
                        text-align: right;
                        color: #88888d;
                        font-size: .12rem;
                        .arrow{
                            position:relative;
                            margin-right: .06rem;
                            margin-left: .1rem;
                            top: .01rem;
                            &::after{position:absolute;content:'';width:0;height:0;top: 0;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                            &::before{position:absolute;content:'';width:0;height:0;top: 0;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                        }
                        img{
                            width: .15rem;
                            height: .15rem;
                            vertical-align: top;
                            margin-left: .1rem;
                        }
                    }
                }
                .nodata{
                    padding: .1rem .19rem;
                    font-size: .15rem;
                    color: #88888d;
                    text-align: left
                }
                .data{
                   padding: .17rem 0;
                   @include box; 
                   li{
                       @include flex;
                       text-align: center;
                       border-right: 1px solid #dfdfdf;
                       &:last-child{
                           border-right: 0
                       }
                       p{
                           color: #88888d;
                           font-size: .15rem;
                       }
                       div{
                           color: #e84816;
                           font-size: .18rem;
                           margin-top: .05rem
                       }
                   }
                   .surplus{
                       @include box;
                        @include flexSelf(flex-start);
                        @include flexAlign;
                       img{
                           width: .13rem;
                           margin-left: .19rem;
                           margin-right: .08rem
                       }
                       span{
                           color: #88888d;
                           font-size: .15rem
                       }
                   }
                   .date{
                        margin-right: .15rem;
                        color: #88888d;
                        text-align: right;
                        @include flex;
                        position: relative;
                        top: -.08rem;
                        height: .36rem;
                        span{
                            font-size: .45rem;
                            color: #c9c9c9;
                            margin-right: .1rem
                        }
                   }
                }
            }
            
            
        }
        .detail-fixed{
            height: .55rem;
            background: #fff;
            @include box;
            @include flexAlign;
            .nickname{
                background: url("~assets/img/myCars/icon_muycar_guwen@2x.png") no-repeat;
                background-size: 100% 100%;
                height: .55rem;
                width: 1.25rem;
                .head{
                    height: .4rem;
                    width: .4rem;
                    border-radius: 50%;
                    margin-top: .075rem;
                    float: right;
                    margin-right: .08rem;
                    background-size: cover;
                    background-position-y: 50%;
                }
            }
            .name{
                margin: 0 .16rem;
                @include flex;
                p{
                    color: #22222d;
                    font-size: .15rem
                }
                div{
                    font-size: .12rem;
                    color: #88888d;
                    margin-top: .02rem;
                }
            }
            .phone{
                height: .3rem;
                width: .3rem;
                border-radius: 50%;
                margin-right: .2rem;
            }
        }
    }
</style>





