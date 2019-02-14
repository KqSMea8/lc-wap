<template>
    <app-layout id="coupon_mine" style="padding-bottom:0 !important">
        <mt-navbar slot="header" v-model="selected">
            <mt-tab-item  :id="'status0'" >乐橙券
                <mt-badge size="small" color="#fe0000" v-if="badge1435.badge=='dot'"></mt-badge>
            </mt-tab-item>
            <mt-tab-item  :id="'status1'" style="border-right:0 !important">优惠券
                <mt-badge size="small" color="#fe0000" v-if="badge1434.badge=='dot'"></mt-badge>
            </mt-tab-item>
            
            
        </mt-navbar>

        <div id="header"  v-if="type==='1'">
            <div style="display:inline-block" v-if="list.length>0">共<span>{{totle}}</span>张可用</div>
            <router-link to="/article/6">使用说明</router-link>
        </div>
        <ul v-if="list.length>0" v-infinite-scroll="loadMore"  infinite-scroll-distance="100" infinite-scroll-disabled="loading"  infinite-scroll-immediate-check="false">
            
            <li v-for="(item,index) in list" @click="goDetails(item)" :key="item.myCouponId">
                <div :class="{top:true,blue:selected=='status1'&&item.vstatus=='1',yellow:selected=='status0'&&item.vstatus=='1',dis:item.vstatus!='1'}">
                    <div class="title">{{item.couponName}}</div>
                    <div class="money" v-if="item.isShowAmt!=2">
                        <div><span>¥</span>{{item.deductMoney}}</div>
                        <span >{{item.condition}}</span>
                    </div>
                </div>
                <div class="bottom" ref="bottom">
                    <p class="time" :style="selected=='status0'?'padding-top: .03rem':''">
                        <span  class="time-span">{{item.time}}</span>
                        <span v-if="selected=='status0'&&item.vstatus=='1'" class="knowledge">使用须知 ></span>
                    </p>
                    <p v-if="selected=='status1'" class="content2"  ref="desc"><span >{{item.couponDesc}}</span></p>
                    <img v-if="item.vstatus=='3'" :style="selected=='status0'?'top:inherit':''" src="~assets/img/recommendBuyers/icon_card_over.png">
                    <img v-if="item.vstatus=='2'||item.vstatus=='5'" :style="selected=='status0'?'top:inherit':''" src="~assets/img/recommendBuyers/icon_card_used.png">
                    <button v-if="item.vstatus=='1'&&selected=='status1'" @click="use(item.type,item.myCouponId)">立即使用</button>
                    <div v-if="selected=='status1'&&item.ismore==1" class="triangle-box" @click="slideChange(index,item.updown)">
                        <img class="triangle-img" v-if="item.updown==0" src="~assets/img/mall/icon_card_detail_open.png">
                        <img class="triangle-img" v-else src="~assets/img/mall/icon_card_detail_close.png"> 
                    </div>
                </div>
            </li>
            
        </ul>
        <div v-if="type==='1'&&list.length>0" class="history" @click="goHistory" :style="type==='1'&&selected=='status0'?'padding-bottom:.5rem':''">查看历史卡券 ></div>

        <div class="lc-error" v-if="list.length===0" :style="type==='1'&&selected=='status0'?'height: calc(100% - .3rem)':''">
            <img src="~assets/img/error-empty.png">
            <p>当前无可用卡券</p>
            <div v-if="type==='1'" class="history"  @click="goHistory">查看历史卡券 ></div>
        </div>
        <div slot="footer" v-if="type==='1'&&selected=='status0'" class="nextOne exchange" @click="openPopup"><img src="~assets/img/mall/icon_card_tab_add.png">兑 换</div>
        <div class="manual-bg" slot="aside" v-show="showPopup">
            <div class="manual-popup">
                <div class="close" @click="showPopup=false">×</div>
                <div class="title">输入兑换码</div>
                <input type="text" v-model="inputNum" @keyup="keyUpnum(inputNum)"/>
                <div class="btn" @click="exchange">兑 换</div>
            </div>
        </div>
    </app-layout>
</template>

<script>
export default {
    data() {
        return {
            inputNum:'',
            showPopup:false,
            titleArr:['乐橙券','优惠券'],
            selected:'',
            selNum:0,
            type:'',
            key:null,
            pageSize:10,
            totle1:0,
            pageNo1:1,
            loading1:false,
            list1:[],

            totle2:0,
            pageNo2:1,
            loading2:false,
            list2:[],
            st:0,
            goDetail:true,
            badge1434:{},
            badge1435:{}
        }
    },
    watch: {
        selected(val) {
            
            if(!this.goDetail){
                return
            }
            if((this.list1.length==0&&this.pageNo1==1)||(this.list2.length==0&&this.pageNo2==1)){
                this.loadMore();
            }else{
                
                this.$nextTick(()=>{
                    for(let i=0;i<this.$refs.desc.length;i++){
                        this.$refs.desc[i].className ='content2'
                        if(this.$refs.desc[i].offsetHeight<25){
                            this.list2[i].ismore=0
                            this.$refs.bottom[i].style.cssText='padding-bottom:.08rem'
                        }else{
                            this.list2[i].updown=0
                            this.$refs.desc[i].className ='content1'
                        }
                    }
                    
                })
                    
            }
            if(val=='status0'){
                if(this.badge1435.badge=='dot'){
                    this.badge1435.badge=''
                    this.changeBadgeInfo('1435')
                }
            }else{
                if(this.badge1434.badge=='dot'){
                    this.badge1434.badge=''
                    this.changeBadgeInfo('1434')
                }
            }
            
        }
        // selected(val) {
        //     this.resetPage();
        //     this.loadMore();

        // }
    },
    computed:{
        list(){
            if(this.selected=='status0'){
                return this.list1
            }else{
                return this.list2
            }
        },
        pageNo(){
            if(this.selected=='status0'){
                return this.pageNo1
            }else{
                return this.pageNo2
            }
        },
        loading(){
            if(this.selected=='status0'){
                return this.loading1
            }else{
                return this.loading2
            }
        },
        totle(){
            if(this.selected=='status0'){
                return this.totle1
            }else{
                return this.totle2
            }
        },
    },
    deactivated(){
        if(!this.goDetail){
            this.selected='';
            this.resetPage();
        }
    },
    activated(){
        
        this.goDetail=true
        this.showPopup=false
        this.inputNum=''
        this.type=this.$route.params.type;
        
        if(this.st != 0) { 
            this.$el.children.appMain.scrollTop = this.st;
        }
        this.key=this.$route.query.key||null;
        
        if(this.key==1||!this.key){

            this.selected='status0'
        }else{
            this.selected='status1'
        }
        this.getBadgeInfo()
    },

    beforeRouteUpdate(to, from, next){
        this.type=to.path.split('myCoupons/')[1];

        if(this.type==0){
            to.meta.resetTitle='我的卡券'
        }else{
            to.meta.resetTitle='历史卡券'
        }
        this.resetPage();
        this.loadMore();
        next();
    },
    beforeRouteLeave (to, from, next) {
 
        from.meta.resetTitle='我的卡券'
        if(to.path.includes('myCoupons/detail')){
            this.goDetail=true;
            this.st = this.$el.children.appMain.scrollTop;
            next();
            
        }else{
            this.goDetail=false;
            next();
        }
        
    }, 
    
    methods: {
        async changeBadgeInfo(funcId){
            let data = {
                content: {
                    mbeId:this.$cache.user.memberId,
                    funcId: funcId,           
                }
            };
            let res = await this.$post('/CRM/appfuncconfig/changeBadgeInfo.json', data);
        },
        async getBadgeInfo() {
            let data = {
                content: {
                    mbeId:this.$cache.user.memberId,
                    funcId: "1434,1435",
                    appVersion:'',
                    platform:'Wechat'
                    
                }
            };
            let res = await this.$post('/CRM/appfuncconfig/getBadgeInfo.json', data);
            if(res&&res.errcode==0){
                let badgeList=res.content.badgeList;
                
                for (let i = 0; i < badgeList.length; i++) {
                    if(badgeList[i].funcId==1435){
                        this.badge1435=badgeList[i];
                    }else{
                        this.badge1434=badgeList[i];
                    }
                }
                if(this.key==1||!this.key){
                    if(this.badge1435.badge=='dot'){
                        this.badge1435.badge=''
                        this.changeBadgeInfo('1435')
                    }
                    
                }else{
                    if(this.badge1434.badge=='dot'){
                        this.badge1434.badge=''
                        this.changeBadgeInfo('1434')
                    }
                }

            }
        },
        keyUpnum(num){
            if(num){
                this.inputNum=num.replace(/\D/g,'')
            }
        },
        goHistory(){
            this.$route.meta.resetTitle='历史卡券'
            this.$router.push({path: '/myCoupons/0',params:{type:0}})
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
        resetPage(){
            this.st=0
 
            this.totle1=0;
            this.pageNo1=1;
            this.loading1=false;
            this.list1=[];

            this.totle2=0;
            this.pageNo2=1;
            this.loading2=false;
            this.list2=[];
            
        },

        async loadMore() {
            // if(!this.loading){
                if(this.selected=='status0'){
                    this.loading1=true; 
                }else{
                    this.loading2=true; 

                }
                let user = this.$cache.user;

                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        mobile:this.$cache.user.phone,
                        pageSize:this.pageSize,
                        pageNo:this.pageNo,
                        apiType:'',
                        type:this.type,
                    },
                    
                };

                if(this.selected=='status0'){
                    d.content.apiType='GET_MY_COUPON_OFFLINE' 
                }else if(this.selected=='status1'){
                    d.content.apiType='GET_MY_COUPON_ONLINE'
                }
                let res = await this.$post('/couponSys/appcoupon/getList.json',d);

                
                if (res.errcode === 0) {
                    let con=res.content;
                    for(let i=0;i<con.list.length;i++){
                        con.list[i].updown=0
                        con.list[i].ismore=1
                    }
                    
                    // if(this.pageNo==1){
                    //     this.list=[];
                    // }
                    
                    
                    if(this.selected=='status0'){
                        this.list1 = this.list1.concat(con.list);
                        this.totle1=con.totalNums;
                        this.$nextTick(()=>{
                            if(this.$refs.desc){
                            for(let i=0;i<this.$refs.desc.length;i++){
                                this.$refs.desc[i].className ='content2'
                                if(this.$refs.desc[i].offsetHeight<25){
                                    this.list1[i].ismore=0
                                    this.$refs.bottom[i].style.cssText='padding-bottom:.08rem'
                                }else{
                                    this.list1[i].updown=0
                                    this.$refs.desc[i].className ='content1'
                                }
                            }
                            }
                            
                        })
                        if(res.content.totalPages>this.pageNo){
                            this.pageNo1 += 1;
                            this.loading1 = false;
                        }else{
                            this.pageNo1 += 1;
                            this.loading1 = true;
                        }
                    }else{
                        
                        this.list2 = this.list2.concat(con.list);
                        this.totle2=con.totalNums; 
                        
                        this.$nextTick(()=>{
                            
                                for(let i=0;i<this.$refs.desc.length;i++){
                                    this.$refs.desc[i].className ='content2'
                                    if(this.$refs.desc[i].offsetHeight<25){
                                        this.list2[i].ismore=0
                                        this.$refs.bottom[i].style.cssText='padding-bottom:.08rem'
                                    }else{
                                        this.list2[i].updown=0
                                        this.$refs.desc[i].className ='content1'
                                    }
                                }
                            
                        })

                        if(res.content.totalPages>this.pageNo){
                            this.pageNo2 += 1;
                            this.loading2 = false;
                        }else{
                            this.pageNo2 += 1;
                            this.loading2 = true;
                        }

                    }

                }
            // }
        },
        slideChange(index,updown){

            if(updown==0){
                this.list2[index].updown=1
                this.$refs.desc[index].className ='content2'
            }else{
                this.list2[index].updown=0
                this.$refs.desc[index].className ='content1'
            }
        },
        async exchange(){
            if(this.inputNum==''){
                this.$toast('请输入兑换码')
                return
            }
            let user = this.$cache.user;
            let data = {
                content: {
                    memberId: user.memberId,
                    verificationCode:this.inputNum,
                    apiType:'REDEEM_OFFLINE',
                    receiveType:8
                }
            }
            let res = await this.$post('/couponSys/appcoupon/receiveOrRedeem', data);
            if (res.errcode === 0) {
                this.resetPage();
                this.loadMore();
                this.showPopup=false
                this.$toast(res.msg)
            }else{
                this.$toast(res.msg)
            }
        },
        goDetails(item){
            
            if(this.selected=='status0'&&this.type==1){

                this.$router.push({path: '/myCoupons/detail/'+item.myCouponId,params:{id:item.myCouponId}})
            }
            
        },
        openPopup(){
            this.inputNum=''
            this.showPopup=true
        }
    }
}
</script>


<style lang="scss">
@import "~assets/css/var.scss";
#coupon_mine{
    .exchange{
        height: .5rem;
        @include box;
        @include flexJustify;
        @include flexAlign;
 
       
        img{
            height: .15rem;
            width: .15rem;
            margin-right: .02rem
        }
    }
    .mint-navbar{
            position: relative;
            @include box;
            font-size: 0
        }
         
        .mint-navbar .mint-tab-item {
            border-right: 1px solid #f1f1f1 !important;
            border-bottom: 1px solid #f1f1f1;
            padding: 0;
            height: .44rem;
            width: 50%;
            display: inline-block;
            
            .mint-tab-item-label{
                font-size: .15rem;
                line-height: .44rem;
                position: relative;
                .mint-badge{ padding: 4px !important;position: absolute;top: .1rem;right: .6rem;}
            }
            &::last-child{
                border-right: 0;
            }
            &.is-selected{
                border-bottom: 3px solid $red;
            }
        }
    .lc-error{
        img{margin-top: -1.5rem}
        p{color: #c9c9c9;margin-top: .15rem}
    }
    #header{line-height: .2rem;font-size:.14rem;padding:0 .2rem;margin-top:.1rem;
        span{color:$red;}
        a{float:right;
            &:before{content:'?';display: inline-block;border:1px solid $gray;border-radius:99px;vertical-align: text-bottom;line-height: .14rem;width:.14rem;text-align: center;font-size:$h3;margin-right:.05rem;}
        }
    }
    .history{display:block;text-align: center;margin:.15rem auto;color: #88878c}
    ul{
        margin-bottom: .15rem;
        li{color:#fff;width:3.4rem;margin:.15rem auto 0;background:#fff;border-radius:8px;box-shadow: 1px 1px 6px -3px #8c8c8e;
            .top{height: .65rem;position: relative;@include box;
                &.dis{background: url('~assets/img/mall/background_card_top_over.png') no-repeat top center;background-size: 100%;}
                &.blue{background: url('~assets/img/mall/background_card_top.png') no-repeat top center;background-size: 100%;}
                &.yellow{background: url('~assets/img/mall/background_card_top_yellow.png') no-repeat top center;background-size: 100%;}
                
                .title{line-height: .65rem;text-indent: .15rem;font-size:.15rem;width: 70%;@include txtOverflow;}
                .money{font-size: .3rem;line-height:.3rem;font-weight:500;@include flex;text-align: center;@include box;@include flexDir(column);@include flexJustify;margin-right:.15rem;text-align:right;
                    div{font-size: .27rem;font-weight:600;position: relative;top:.06rem;
                        span{font-size: .17rem}
                    }
                    span{font-size: .12rem;position: relative;top: -.02rem; white-space: nowrap;}
                }

            }

            .bottom{border:$border;border-top:none;border-radius:0 8px 8px 8px;padding:.1rem .15rem 0;position: relative;box-sizing:border-box;    min-height: .48rem;
                .time{line-height: .24rem;margin-bottom: .07rem;
                    .time-span{@include flex;}
                    .knowledge{float:right;color: #e94716;text-align: right;position: absolute;right: .15rem;line-height: .48rem;top: 0;}
                }
                .content1{line-height: .18rem;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
                    span{@include flex;min-width: 1px;overflow: hidden;text-overflow: ellipsis;}
                }
                .content2{line-height: .18rem;span{@include flex;min-width: 1px;}}
                p{font-size:$h3;color:$gray;@include box;@include flexAlign;}
                p::before{content: '';display: inline-block;margin-right:.07rem;width:.12rem;height:.12rem;background: url('~assets/img/mall/icon_card_detail_time.png') no-repeat center;background-size:100%;margin-top: .06rem;@include flexSelf(flex-start);}
                p:nth-of-type(2)::before{background-image:url('~assets/img/mall/icon_card_detail_notice.png');@include flexSelf(flex-start);margin-top: .02rem}
                >img{width:.57rem;position: absolute;right:.2rem;top:.05rem;bottom:0}
                button{font-size:$h3;padding:0 .1rem;height: .22rem;border-radius: 99px;color:#44aae5;border:1px solid #44aae5;position: absolute;right:.15rem;top:.1rem;}
                .triangle-box{
                    margin: 0 auto;
                    margin-top: -.02rem;
                    padding-bottom: .08rem;
                    width: 1rem;
                    .triangle-img{
                        width: .08rem;
                        height: .04rem;
                        position: relative;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
                
            }
        }
    }
    .manual-bg{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .5);
        z-index: 300;
        .manual-popup{
            width: 84%;
            height: 1.94rem;
            background: #fff;
            border-radius: 6px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            .close{
                position: absolute;
                font-size: .2rem;
                color: #c9c9c9;
                right: 0;
                width: .20rem;
                height: .20rem;
                text-align: center;
                line-height: .20rem;
                padding: .1rem;
            }
            .title{
                color: #22222d;
                font-size: .18rem;
                text-align: center;
                margin-top: .25rem;
            }
            input{
                height: .4rem;
                width: 68%;
                margin: .22rem auto;
                margin-left: 16%;
                border: 1px solid #dfdfdf;
                box-sizing: border-box;
                border-radius: 4px;
                text-align: center;
            }
            .btn{
                height: .4rem;
                width: 1.3rem;
                background: orangered;
                color: #fff;
                font-size: .15rem;
                text-align: center;
                margin: auto;
                line-height: .4rem;
                border-radius: .4rem;
            }
        }
    }
}
</style>
