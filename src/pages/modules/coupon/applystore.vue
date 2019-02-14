<template>
  <app-layout id="coupon_appaystore" >
      <div class="title-num" slot="header">共<span>{{totalNums}}</span>家门店</div>
      
      <ul class="store-ul" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="100" infinite-scroll-immediate-check="false" v-if="fsList.city&&fsList.city.length>0">
          <li v-for="(item,index) in fsList.city">
              <div class="title">{{item}}</div>
              <store-info v-for="store in fsList[item]"  :data="{name:store.name,address:store.address,lat:store.dimension,lng:store.longitude,phone:store.bespeakTel,brandList:store['4SBrandList']}" ></store-info>
          </li>
      </ul>
  </app-layout>
  
</template>
<script>
    
    export default {
        data(){
            return{
                fsList:{},
                pageNo:1,
                pageSize:200,
                loading:false,
                foursId:'',
                totalNums:0,
                location:{}
            }
        },

        mounted(){
            this.location=this.$cache.location
        },
        activated(){
            // var arr=[]
            // for(var i=0;i<this.fsList.length;i++){
            //     if(i==0){
            //         arr.push(this.fsList[i].area)
            //     }else{
            //         if(arr.indexOf(this.fsList[i].area)==-1){
            //             arr.push(this.fsList[i].area)
            //         }
            //     }  
                
            // }
            // var fsarr=[] 
            // for(var i=0;i<arr.length;i++){
            //     fsarr.push(this.fsList.filter((ele,index)=>{
            //         return ele.area==arr[i]
            //     }))
            // }
        },
        beforeRouteEnter (to, from, next) {
            if(from.path.includes('/myCoupons/detail')){
                next(vm => {
                    vm.resetPage()
                    vm.getData()
                })
                
            }else{
                next()
            }
            
        },
        methods:{
            resetPage(){
                this.pageNo=1;
                this.loading=false;
                this.fsList=[];
            },
            async getData(){
                let data;
                if(this.$route.query.preview==1){
                    data = {
                        content: {
                            couponId:this.$route.params.id,
                            apiType:'GET_COUPON_DETAIL_OFFLINE'
                        }
                    }
                }else{
                    data = {
                        content: {
                            memberId:this.$cache.user.memberId,
                            myCouponId:this.$route.params.id,
                            apiType:'GET_COUPON_DETAIL_OFFLINE'
                        }
                    }
                }

                let res = await this.$post('/couponSys/appcoupon/getDetail.json', data);
                if(res.errcode==0){
                    this.foursId=res.content.couponCenter.applyStoresId
                    this.loadMore()
                }else{
                    this.$toast(res.msg)
                }
            },
            async loadMore(){
                if(!this.loading){
                    this.loading=true; 

                    let data = {
                        content: {
                            dimension:this.location.lat,
                            longitude:this.location.lng,
                            pageNo:this.pageNo,
                            pageSize:this.pageSize,
                            foursId:this.foursId,
                            sort:''
                        }
                    }
                    let res = await this.$post('/CRM/appfourspoint/query4SInfoV2.json', data);
                    if(res.errcode==0){
                        this.totalNums=res.content.totalNums
                        

                        let fourS=res.content.fsList,
                            fi,
                            stores={
                                city:[]
                            };

                        for(let i=0;i<fourS.length;i++){
                            fi=fourS[i]
                            if(stores.city.includes(fi.area)){
                                stores[fi.area].push(fi);
                            }else{
                                stores.city.push(fi.area);
                                stores[fi.area]=[fi];
                            }
                        }
                        this.fsList=stores
                        if(res.content.totalPages>this.pageNo){
                            this.pageNo += 1;
                            this.loading = false;
                        }


                    }
                }
            }
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #coupon_appaystore{
        font-size: .12rem;
        .title-num{
            height: .4rem;
            line-height: .4rem;
            padding:0 .2rem;
            background: #fff;
            color: $black;
            span{
                color:#e94814
            }
        }
        .store-ul{
            padding-top: .05rem;
            li{
                .title{
                    padding:0 .2rem .05rem;
                    // height: .2rem;
                    // line-height: .2rem;
                    color: $gray
                }
            }
        }
    }
</style>

