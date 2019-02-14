<template>
  <app-layout id="orders">

      <div class="order-type" slot="aside"><span :class="{active:showTypes}" @click="showTypes=!showTypes">{{selectedType.name=='全部'?'我的订单':selectedType.name}}</span></div>
      <mt-popup v-model="showTypes" position="top" style="width:100%;" slot="aside">
          <div class="types">
              <div v-for="item in types" @click="selOrderType(item)" :class="{on:selectedType.id===item.id}">{{item.name}}</div>
          </div>
      </mt-popup>

      <mt-navbar slot="header" v-model="curStatus">
        <mt-tab-item v-for="(item,index) in status" :id="index">{{item}}</mt-tab-item>
      </mt-navbar>

      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
          <order-li v-if="item" v-for="(item,index) in list" :data="item" :nowtime="nowtime" :index="index"  :key="item.id" @changeStatus="changeStatus"></order-li>
          <lc-nomore v-show="nomore&&totalPages<=pageNo&&list.length>0"></lc-nomore>
      </div>
      <cancel-popup slot="aside" v-model="showCancel" :chooseOrder="chooseOrder"></cancel-popup>

  </app-layout>
</template>
<script>
    import cancel from 'components/orders/cancel'
    export default {
        data(){
            return{
                showCancel:false,
                curStatus:0,
                status:['全部','待付款','进行中','待收货','待评价'],

                types:[],
                selectedType:{},
                selType:'',
                showTypes:false,

                st:0,
                pageNo:1,
                pageSize:15,
                list: [],
                nomore:false,
                totalPages:1,
                cleartime:'',
                nowtime:0,
                chooseOrder:{}
            }
        },
        components:{
            'cancel-popup':cancel,
        },
        watch: {
            curStatus(val) {
                this.resetPage();
                this.loadMore();
            },
            // selectedType(val){
            //     this.resetPage();
            //     this.loadMore();
            // }
        },

        mounted(){
            eventBus.$on('updateOrder',()=> {
                this.update();
            });
            
        },
        activated(){
            
            if(this.list.length===0){
                if(this.$route.query.status==this.curStatus){
                    this.selType = this.$route.query.type||'';
                    this.loadMore();
                }else{
                    this.curStatus=parseInt(this.$route.query.status||0);
                }
                
            }else if(this.st!=0){
                this.$el.children.appMain.scrollTop = this.st;
            }
            eventBus.$on('changeCancel',(status,order)=> {
                this.showCancel=status; 
                this.chooseOrder=order

            });
        },
        deactivated(){
            eventBus.$off('changeCancel');
        },
        beforeRouteLeave (to,from,next){
            if(!/(orders|pay|comment|shipping)/.test(to.path)){
                this.resetPage();
            }else{
                this.st = this.$el.children.appMain.scrollTop;
            }
            next();
        },
        methods:{
            selOrderType(item){
                this.resetPage();
                this.selectedType=item;
                this.selType = item.id;
                this.showTypes=false;
                
                this.loadMore();
            },
            resetPage(){
                this.st=0;
                this.pageNo=1;
                this.list=[];
                // this.selType='';
                // this.selectedType={}
                this.nomore=false;
                clearInterval(this.cleartime)
            },
            changeStatus(index){
                let item=this.list[index];
                if(this.curStatus==1){
                    this.$delete(this.list,this.list[index])
                }else{
                    item.statusInfo.status=6;
                    item.statusInfo.text='已取消'
                    this.$set(this.list,this.list[index],item)
                }
                
            },
            async update() {
                if(this.st===0){
                    this.st=this.$el.children.appMain.scrollTop;
                }
                
                let data=this.$sign({
                        content: {
                            orderType: this.selectedType.id,
                            pageNo:1,
                            pageSize:this.pageSize*this.pageNo,
                            status:this.curStatus||''
                        }
                    });

                let res=await this.$post('/CRM/api/query.order.page.json',data);
                
                if(res.errcode==0){
                    let list=res.content.orderList;
                    this.list=[].concat(list?list:[]);

                    
                    this.nowtime=0;
                    clearInterval(this.cleartime)
                    this.cleartime=setInterval(()=>{  
                        this.nowtime=this.nowtime+1
                    },1000)

                    this.$nextTick(function () {
                        this.$el.children.appMain.scrollTop = this.st;
                    });
                }
            },
            async loadMore() {
                if(!this.nomore){
                    this.nomore=true;

                    let data=this.$sign({
                        content: {
                            orderType: this.selType,
                            pageNo:this.pageNo,
                            pageSize:this.pageSize,
                            status:this.curStatus||''
                        }
                    });

                    let res=await this.$post('/CRM/api/query.order.page.json',data);
                    
                    if(res.errcode==0){
                        let con=res.content;

                        // if(this.types.length===0){
                            this.types=con.orderTypeList;
                            for(const i in this.types){
                                if(this.selType==this.types[i].id){
                                    this.selectedType=this.types[i]
                                }
                                
                            }
                        // }

                        if(this.pageNo>1){
                            for(let i=0;i<this.list.length;i++){
                                if(this.list[i].miaosha&&this.list[i].miaosha.second>=0){
                                    this.list[i].miaosha.second=this.list[i].miaosha.second-this.nowtime-1;
                                
                                }
                            }
                        }
                        
                        this.list=this.list.concat(res.content.orderList);
                        this.nowtime=0;
                        clearInterval(this.cleartime)
                        this.cleartime=setInterval(()=>{  
                            this.nowtime=this.nowtime+1
                        },1000)
                        
                        this.totalPages=res.content.totalPages;
                        if(res.content.totalPages>this.pageNo){
                            this.nomore=false;
                            this.pageNo+=1;
                            
                        }
                    }

                }
            },
            
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    #orders{top:.41rem;
        .types{padding: .2rem .2rem .08rem!important;
            div{border: $border;border-radius:.03rem;display:inline-block;width:1rem;line-height:.3rem;text-align: center;box-sizing:border-box;margin-bottom:.12rem;font-size:$h3;color:#55555D;
                &:nth-of-type(3n-1){margin:0 .175rem;}
                &.on{color:$red;border-color:$red;}
            }
        }
        .order-type{position:fixed;top:0;left:0;right:0;text-align: center;line-height: .4rem;background:#fff;border-bottom:$border;z-index: 206;
            span{
                &::after{content:'';width:0;height:0;border:.05rem solid transparent;border-bottom:0;border-top-color:$gray;display:inline-block;vertical-align: .025rem;margin-left:.05rem;}
                &.active::after{border:.05rem solid transparent;border-top:0;border-bottom-color:$gray;}
            }
            .mint-popup{padding-top: .41rem;z-index: 205!important;}
            .v-modal{z-index: 204!important;}
        }

    }
</style>

