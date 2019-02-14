<template>
  <app-layout id="home">

      <div slot="header" class="area-weather">
        <router-link class="area" to="/weather/area">{{city}}</router-link>

        <router-link to="/weather">
          <swiper class='weather' :options="wetherSwiper" ref="wether">
            <swiper-slide v-if="weather">
                <img :src="weather.curWeatherPic">
                {{weather.nightTemp}}°C-{{weather.dayTemp}}°C
            </swiper-slide>
            <swiper-slide v-if="weather"> 
                {{weather.washCarTitle}}洗车
            </swiper-slide>
          </swiper>
        </router-link>

      </div>
      <div class="car-archives" v-if="defaultCarList">
        <div class="top">
          <div class="left">
            <img class="logobg" src="~assets/img/home/bg_semicircle_logo.png" alt="">
            <div class="head">
              <img :src="defaultCarList.carImgUrl" class="logo"/>
            </div>
          </div>
          <div class="right">
            <span>{{defaultCarList.licenseplate}}</span>
            <div @click="goDetail(defaultCarList.carId)">爱车档案</div>
          </div>
        </div>
        <div class="bottom">
          <div class="left"></div>
          <div class="right">
            <div class="box" @click="editCar">
              <div class="info">
                <img src="~assets/img/home/text1.jpg" alt="">
                <p :style="!defaultCarList['4sStoreName']?'color:#cacaca':''">{{defaultCarList['4sStoreName']?defaultCarList['4sStoreName']:'添加专属门店'}}</p>
              </div>
            </div>

            <div class="line"></div>
            <div class="box" style="padding-left:.2rem;" @click="goServer(defaultCarList,defaultCarList.serviceCustId?'detail':'list?action=update')">
              <div class="info">
                <img src="~assets/img/home/text2.jpg" alt="">
                <p :style="!defaultCarList.serviceCustId?'color:#cacaca':''">{{defaultCarList.serviceCustId?defaultCarList.serviceCustName:'添加顾问'}}</p>
              </div>
              <div v-if="defaultCarList.serviceCustId" class="head" :style="defaultCarList.scImgUrl ? {'background-image':'url('+defaultCarList.scImgUrl+')'}:{'background-image':'url('+default_server+')'}"></div>
              <img class="addhead"  v-else src="~assets/img/home/icon_home_car_addadvisor@2x.png">
            </div>
          </div>
        </div>
      </div>
      <div class="my-cars" v-else>
        <div class="card">
          <router-link class="add-box"  to="/bindCar">
            <img src='~assets/img/home/icon_home_car_addcar@2x.png' class="add"/>
            <span>添加爱车</span>
          </router-link>
        </div>
      </div>
      

      <ul class="main-fn" style="margin:0">
        <li>
          <router-link to="/maintenance">
            <img src="~assets/img/home/mainFn_maintenance.png?t=1"><h2>维保预约</h2>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1010&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
          </router-link>
        </li>

        <li>
          <router-link to="/beauty">
            <img src="~assets/img/home/mainFn_beauty_hot.png?t=1">
            <h2>爱美容</h2>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1014&&item.badge&&item.badge!=''">
              <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
          </router-link>
        </li>
        <li>
          <router-link to="/recommendBuyers">
            <img src="~assets/img/home/mainFn_laoyouji_hot.png?t=1">
            <h2>盈众老友记</h2>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1014&&item.badge&&item.badge!=''">
              <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
          </router-link>
        </li>
        <li>
          <router-link to="/peccancy">
            <img src="~assets/img/home/mainFn_peccancy.png?t=1">
            <h2>违章查询</h2>
            <template v-for="(item,index) in badgeList" v-if="item.funcId==1012&&item.badge&&item.badge!=''">
              <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
            </template>
          </router-link>
        </li>
        
      </ul>

      <div class="module-box">
          <ul class="clearfix">
            <!-- <li>
              <img src="~assets/img/home/module_icon1.png">
              <div>每日签到</div>
            </li> -->
            <router-link tag="li" to="/coupon">
              <img src="~assets/img/home/module_icon2.png">
              <div>领券中心</div>
              <template v-for="(item,index) in badgeList" v-if="item.funcId==1421&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
              </template>
            </router-link>
            
            <router-link tag="li" to="/creditCard">
              <!-- <a href="http://www.yixinusedcar.com:6061/Home/buycarlist?isapp=1"> -->
                <img src="~assets/img/home/module_icon12.png">
                <div>车主信用卡</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1029&&item.badge&&item.badge!=''">
                  <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
              <!-- </a> -->
            </router-link>
            <li @click="goManual">
              <img src="~assets/img/home/module_icon6.png">
              <div>保养手册</div>
              <template v-for="(item,index) in badgeList" v-if="item.funcId==1027&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
              </template>
            </li>
            <router-link tag="li" to="/carWiki">
              <img src="~assets/img/home/module_icon7.png">
              <div>用车百科</div>
              <template v-for="(item,index) in badgeList" v-if="item.funcId==1028&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
              </template>
            </router-link>
            <li>
              <a href="https://www.che300.com/yzlc">
                <img src="~assets/img/home/module_icon4.png">
                <div>爱车评估</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1023&&item.badge&&item.badge!=''">
                  <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
              </a>
            </li>
            <li>
              <a href="http://common.diditaxi.com.cn/general/webEntry?maptype=baidu&channel=1301">
                <img src="~assets/img/home/module_icon10.png">
                <div>滴滴打车</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1025&&item.badge&&item.badge!=''">
                  <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
              </a>
            </li>
            <li>
              <a href="https://h5.edaijia.cn/app/index.html?from=01051443">
                <img src="~assets/img/home/module_icon11.png">
                <div>代驾服务</div>
                <template v-for="(item,index) in badgeList" v-if="item.funcId==1026&&item.badge&&item.badge!=''">
                  <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
                </template>
              </a>
            </li>
            <router-link tag="li" :to="'/helpCenter?actUrl='+encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/forApp/help_center.html')">
              <img src="~assets/img/home/module_icon8.png">
              <div>客服中心</div>
              <template v-for="(item,index) in badgeList" v-if="item.funcId==1027&&item.badge&&item.badge!=''">
                <mt-badge size="small" color="#fe0000">{{item.badge}}</mt-badge>
              </template>
            </router-link>
          </ul>
  
          <!-- <swiper-slide class="module-ul">
            <li>
              <img src="~assets/img/home/module_icon9.png">
              <div>出行查询</div>
            </li>
            
          </swiper-slide> -->
          
      </div>
      <!-- <div class="dialog-bg" v-if="showNewUser" slot="aside">
        <div class="newuser-box">
          <router-link :to="'/newUser/'+newUserId"><img :src="newUserImg" alt=""></router-link>
          
          <svg class="icon" aria-hidden="true" @click="showNewUser=false">
            <use :xlink:href="'#icon-icon_login_close'"></use>
          </svg>
        </div>
      </div> -->
      <div class="dialog-bg" v-if="showCarGift&&pushContent" slot="aside">
        <div class="newuser-box">
          <router-link v-if="pushContent.linkType==1" :to="'/orders/'+pushContent.businessParam"><img :src="pushContent.image" alt=""></router-link>
           <router-link v-if="pushContent.linkType==2" :to="pushContent.link.split('#')[1]"><img :src="pushContent.image" alt=""></router-link>
          <svg class="icon" aria-hidden="true" @click="showCarGift=false">
            <use :xlink:href="'#icon-icon_login_close'"></use>
          </svg>
        </div>
      </div>
  </app-layout>
</template>
<script>
  export default {
    data(){
      return{
        
        default_server:require('assets/img/default_server.png'),
        city:'厦门市',
        weather:'',
        carList:[],
        defaultCarList:null,
        carSwiper: {
          slidesPerView:1,
          spaceBetween:8,
          pagination: '.swiper-pagination'
        },

        wetherSwiper: {
          notNextTick: true,
          direction: 'vertical',
          slidesPerView: 1,
          autoplay: 1,
          speed: 2000,
          loop: true
        },
        badgeList:[],

        // showNewUser:false,
        // newUserImg:'',
        // newUserId:'',
        showCarGift:true,
        pushContent:null
      }
    },
    computed: {
        swiper() {
            return this.$refs.wether.swiper;
        }
    },
    mounted(){
      
      eventBus.$on('cityChanged',(city)=> {
        this.city=city;
        this.$cache.city=city;
        this.getWeather();
      });

      eventBus.$on('userInfoUpdated',()=> {
        this.getData();
      });

      this.getCity();
      this.getData();
      this.getBadgeInfo()
      // this.getNewUser()
      this.getPhsh()
    },
    activated(){
      if (this.swiper) { this.swiper.init(); }
    },
    methods:{
        async getBadgeInfo() {
          let data = {
              content: {
                  mbeId:this.$cache.user.memberId,
                  funcId: "1010,1011,1014,1012,1421,1027,1028,1023,1025,1026,1027",
                  appVersion:'',
                  platform:'Wechat'
                  
              }
          };
          let res = await this.$post('/CRM/appfuncconfig/getBadgeInfo.json', data);
          if(res&&res.errcode==0){
              this.badgeList=res.content.badgeList;
          }
      },
      getCity(){
        let vm=this,
          myLocation=vm.$cache.location,
          myGeo = new BMap.Geocoder(),
          point = new BMap.Point(myLocation.lng,myLocation.lat);

        myGeo.getLocation(point, function(rs){
            let city = rs.addressComponents.city||'厦门市';
            vm.city=city;
            vm.$cache.city=city;
            vm.getWeather();
        });
      },
      async getData () {
        if(!this.$cache.user.memberId) return
        let data={content: {memberId: this.$cache.user.memberId}},
          res = await this.$post('/CRM/appmembermgcust/queryCarList.json',data);

        if(res.errcode==0){
          this.carList=res.content.carList;
          for(var i=0;i<this.carList.length;i++){
            if(this.carList[i].isDefaultCar){
              this.defaultCarList = this.carList[i];
              this.$cache.car.carId=this.defaultCarList.carId;
              this.$cache.car['4sStoreId']=this.defaultCarList['4sStoreId'];
              
              break;
            }
          }
        }
      },
      editCar(){
        if(this.defaultCarList['4sStoreId']){
          this.$router.push({path: `/stores/${this.defaultCarList['4sStoreId']}`})
        }else{

            let serviceCust=this.defaultCarList.serviceCustId;
            if(serviceCust){
              this.$cache.server={
                  id:this.defaultCarList.serviceCustId,
                  name:this.defaultCarList.serviceCustName
              };
            }

            

            let bid=this.defaultCarList.brandId;
            if(bid){
                this.$cache.brand={
                    bid:bid,
                    sid:this.defaultCarList.seriesId||'',
                    mid:this.defaultCarList.modelId||'',
                    name:this.defaultCarList.brandName+this.defaultCarList.seriesName+this.defaultCarList.modelName
                }
            }

            this.$cache.car=this.defaultCarList;
            
            this.$router.push({path: '/bindCar?edit=1'})
        }
        
      },
      async getWeather(){
        let data={content: {city: this.city}},
          res = await this.$post('/CRM/appothers/carToRemindWeather.json',data);

        if(res.errcode==0){
          let con=res.content,
            wether={
            arr:[con.f1,con.f2,con.f3,con.f4,con.f5,con.f6,con.f7],
            city:con.city
          }
          this.weather=con.f1;
          this.$cache.weather=wether;

          if (this.swiper) { this.swiper.init(); }
        }
      },
      goDetail(carId){
        // this.$router.push({path: '/myCars/detail/'+carId,params:{carId:carId}})
        this.$router.push({path: '/myCars/detail'})
      },
      goServer(car,page){
        if(!this.defaultCarList['4sStoreName']&&!this.defaultCarList.serviceCustId){
          this.editCar()
          return
        }
        this.$cache.car=car;
        this.$cache.fourS={
          id:car['4sStoreId'],
          name:car['4sStoreName']
        };
        this.$cache.server={
          id:car.serviceCustId,
          name:car.serviceCustName
        };

        let path='/server/'+page;
        this.$router.push(path);
      },
      goManual(){
        if(this.carList.length>0){
          this.$cache.urlquery={};
          this.$cache.urlquery.carId=this.defaultCarList.carId;
          this.$router.push({path:'/manual'});
        }else{
          this.$router.push({path:'/bindCar'});
        }
      },

      async getPhsh(){

        let d={
            content: {
                memberId: this.$cache.user.memberId,
            }
        };

        let res = await this.$post('/CRM/appmessagecenter/getHomePagePush.json',d,true);
        if(res.errcode==0){
          if(res.content.numberOfMessage>0&&res.content.businessParam!=''){
            this.pushContent=res.content
          }
        }
      },
    }
  }
</script>
<style lang="scss">
  @import "~assets/css/var.scss";
  #home{
    .car-archives{
      height: 1rem;margin-bottom:.05rem;margin-top:-.05rem;
      .top{height: .5rem;background: $red;@include box;
        .left{width: .96rem;position: relative;
          .logobg{width: .62rem;position: absolute;bottom: 0;left: .17rem}
          .head{width: .62rem;margin:auto;position: relative;top:.25rem;border-radius:50%;

            img{width: .4rem;height: .4rem;margin-left: .11rem;margin-top: .05rem;border-radius: 50%;}
          }
        }
        .right{@include flex;@include box;@include flexAlign;
          span{font-size: .16rem;color: #fff;}
          div{color: $red;background: #fff;font-size: .12rem;padding:0 .16rem 0 .1rem;border-radius:.1rem;height: .16rem;line-height:.16rem;position: relative;margin-left:.1rem;margin-top:.01rem;
            &::after{
              content: '';
              font-size: 0;
              line-height: 0;
              border-width: .05rem;;
              border-color: $red;
              border-right-width: 0;
              border-style: dashed;
              border-left-style: solid;
              border-top-color: transparent;
              border-bottom-color: transparent;
              position: absolute;
              top: .03rem;
              margin-left: .05rem;
            }
          }
        }
      }
      .bottom{height: .5rem;background: #fff;@include box;
        .left{width:.96rem;height:100%}
        .right{@include box;@include flex;@include flexAlign;
          .line{height: .2rem;width: 1px;background: #dfdfdf}
          .box{
            
            @include flex;@include box;@include flexAlign;padding-right:.2rem;position: relative;
            &::before{
              position: absolute;
              content: '';
              width: 0;
              height: 0;
              right: .2rem;
              top: 50%;
              margin-top: -.05rem;
              border: .05rem solid transparent;
              border-right: 0;
              border-left-color: #88888d;
            }
            &::after{
              position: absolute;
              content: '';
              width: 0;
              height: 0;
              right: .21rem;
              top: 50%;
              margin-top: -.05rem;
              border: .05rem solid transparent;
              border-right: 0;
              border-left-color: #fff;
            }
            .info{
              img{width: .5rem;}
              p{font-size: .12rem;}
            }
            .head{
              background-position: center;
              background-size: cover;
              width: .2rem;height: .2rem;border-radius: 50%;margin-left:.2rem;
            }
            .addhead{
              width:.2rem;margin-left:.2rem
            } 
            
          }
        }
      }
    }
    .yuanzhui{ 
      transform: rotate(50deg);
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(red, orange, yellow, green, teal, blue, purple);

    }
    .area{position: absolute;top:0;left:0;width:.7rem;line-height:.4rem;text-align: left;font-size: .12rem;z-index: 204;color:#fff;text-indent:.2rem;
      &::before{content: '';width: 0;height: 0;border-right: .04rem solid transparent;border-left: .04rem solid transparent;border-top: .05rem solid #fff;position: absolute;right:0;top: 50%;margin-top:-.02rem;}}

    .weather{position: absolute;top:.1rem;right:.2rem;height:.2rem;text-align: right;font-size: .1rem;z-index: 204;color:#fff;
      .swiper-slide{line-height: .2rem;
        img{width: .2rem;height:.2rem;vertical-align:text-bottom;}}}

    .my-cars{
      background:$red;text-align: center;padding:.05rem .2rem .15rem;
      .card{@include box;background: #fff;height: .75rem;margin: 0;box-sizing: border-box;@include flexAlign;text-align: left;transition:opacity .3s ease-out;
        .logo{width: .48rem;height: .48rem;margin: 0 .15rem;}

        .add-box{text-align:center;display:block;width:100%;height:100%;padding:.25rem 0;box-sizing:border-box;
          img{width: .25rem;height:.25rem;vertical-align: top;}
          span{color: $red;font-size: .15rem;margin-left: .08rem;font-weight: 700;line-height: .25rem;}}

        .info{@include flex;margin-right: .1rem;white-space: nowrap;overflow: hidden;
            p{color: #231815;font-size: .18rem}
            div{font-size: .12rem;color: #86878c;text-overflow: ellipsis;overflow: hidden;margin-top: .03rem;}}
        
        .edit{height: .43rem;width: .98rem;padding-left: .15rem;box-sizing: border-box;border-left: 1px solid #dfdfdf;@include box(nowrap);@include flexJustify;@include flexDir(column);
            img{@include flexSelf(flex-start);width: .65rem}
            .head-box{font-size: 0;color: #86878c;margin-top: .04rem;position: relative;top: .04rem;
                img{width: .2rem;height: .2rem;border-radius: 50%;float: left;}
                .head{width: .2rem;height: .2rem;border-radius: 50%;float: left;background-position: center;background-size: cover;}
                span{color: #22222d;font-size: .1rem;line-height: .2rem;margin-left: .05rem;}}}
      }

      .swiper-slide-active{opacity: 1;}
      .swiper-pagination{position: relative;bottom:auto;left:auto;border: 1px solid #fff;display: inline-block;width:auto;margin: .08rem auto;border-radius: 99px;line-height: 3px;}
      .swiper-pagination-bullet{border-radius: 0;margin:0;height:3px;vertical-align: bottom;background:#fff;opacity: 1;}
      .swiper-pagination-bullet-active{border-radius:100%;background:$red!important;}
    }

    .module-box{background: #fff;margin-top: .05rem;
        li{text-align: center;font-size: .12rem;line-height:.15rem;color: #000;width:25%;height: .65rem;border-right:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2;box-sizing: border-box;background: #fff;float:left;position: relative;
          img{height: .25rem;margin: .08rem auto .05rem;}
          .mint-badge{padding:1px 4px !important;position: absolute;top: .07rem;font-size: .11rem;}
          &:nth-of-type(4n){border-right:0;}}
    }
    .mint-badge{padding:1px 4px !important;position: absolute;top: .01rem;font-size: .11rem;}
    .newuser-box{position: relative;top: 50%;left: 50%;transform: translate(-50%,-50%);
      img{width: 2.8rem;}
      .icon{display: block;margin: .25rem auto 0;width: .3rem;height: .3rem;color: #fff;}
      .btn{position: absolute;width: 2rem;height: .45rem;top: 2.56rem;left: .88rem;}
      // .price{position: absolute;color: #fff;transform: translateX(-50%);left: 50%;top: 1.83rem;font-size: .16rem;
      //   span{color: #f8e76b}
      // }
    }
  }
</style>
