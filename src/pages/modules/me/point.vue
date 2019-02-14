<template>
    <app-layout id="myPoint">
           
        <div class="mpBox">
            <router-link :to="'./helpCenter?actUrl='+encodeURIComponent('https://www.lechengclub.com/CRM/WeChat/forApp/help_center.html?page=vip')" class="rule">
                <span>?</span>
                积分规则
            </router-link>
            <div>
                <p>{{con.integralBalance}}</p>
                <span>积分余额</span>
            </div>
            <ul>
                <li>
                    <h2>可用积分</h2>
                    <p>{{con.availableIntegral}}</p>
                </li>
                <li>
                    <h2>即将过期积分</h2>
                    <p>{{con.willExpireIntegral}}</p>
                </li>
                <li>
                    <h2>冻结积分</h2>
                    <p>{{con.freezingIntegral}}</p>
                </li>
            </ul>
        </div>
        <div class="title" >
            <span>积分明细</span>
        </div>
        <mt-navbar v-model="selected">
            <mt-tab-item id="type0">全部</mt-tab-item>
            <mt-tab-item id="type1">收入</mt-tab-item>
            <mt-tab-item id="type2">支出</mt-tab-item>
        </mt-navbar>

        <ul class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
            <li v-for="value in listItems">
                <div>
                    <label>{{value.item}}</label>
                    <div>{{value.date}}</div>
                </div>
                <span>
                    <svg class="icon" aria-hidden="true" style="width:.13rem;">
                        <use :xlink:href="'#icon-icon_integral'"></use>
                    </svg><span style="vertical-align: middle;margin-left:.02rem;">{{value.amount}}</span>
            </span>
            </li>
            <div  class="lc-error" style="margin-top:.5rem" v-show="listItems.length==0">
                <img src="~assets/img/error-empty.png">
                <p>抱歉，暂无数据</p>
            </div>
        </ul>
        <div slot="footer" class="nextOne">
            <div tag="div" class="market" @click="linkApp">
                <svg class="icon" aria-hidden="true" style="width:.16rem;">
                    <use :xlink:href="'#icon-icon_integral'"></use>
                </svg>
                <span>去赚积分</span>
            </div>
            <router-link tag="div" class="market" to="/integralMall">
                <svg class="icon" aria-hidden="true" style="width:.16rem;">
                    <use :xlink:href="'#icon-icon_integramall'"></use>
                </svg>
                <span>积分商城</span>
            </router-link>
        </div>
        

    </app-layout>
</template>

<script>
    export default {
      data() {
        return {
            pageNo:1,
            pageSize:20,
            nomore:false,
            loading:false,
            selected:'type0',
            con:[],
            listItems:[]
        };
      },
      watch: {
        selected(val) {
            this.resetPage();
            this.loadMore();
        }
      },
      activated(){
          this.loadMore();
      },
      methods: {
        linkApp(){

            if(isLecheng){
                this.$utils.goNative('signin');
            }else{
                this.$appDownLoad.show({
                title:' ',
                details:'请下载盈众乐橙汇App即可参与',
                mlink:"ABji?mlKey=sign",
                mobParams:{mlKey:'sign',mId:''}
                })
            }
        },
        resetPage(){
          this.pageNo=1;
          this.pageSize=20;
          this.nomore=false;
          this.loading=false;
          this.listItems=[];
        },
        async loadMore() {
            if(!this.nomore&&!this.loading){
                this.loading=true;
                let d={content: {
                    memberId:this.$cache.user.memberId,
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    type:this.selected.substr(-1)
                }};

                let res=await this.$post('/CRM/appmembermgcust/queryIntegralDetail.json',d);
                if(res.errcode==0){
                    this.con=res.content;
                    let list=res.content.detail;
                    this.listItems=this.listItems.concat(list?list:[]);

                    if(res.content.totalPages<=this.pageNo){
                        this.nomore=true;
                    }else{
                        this.pageNo+=1;
                    }
                    this.loading=false;
                }
            }
        }
      }
    }
</script>

<style lang="scss">
    @import "~assets/css/var.scss";
    #myPoint{
        .nextOne{@include box;@include flexAlign;height:.5rem;}
        .market{
            
            border-right:1px solid #f2f2f2;
            color: $black;@include flex;text-align: center;
            span{vertical-align: middle}
            .icon{color: $gray}
            &:nth-child(2n){border:none}
        }
        .title{
            height: .45rem;margin-top:.6rem;color:#cacaca;line-height:.45rem;text-align:center;font-size:.14rem;
            span{
                position: relative;font-size:.13rem;
                &::before{content: '';width: .6rem;height: 0;border-top: 1px solid #cacaca;position: absolute;top: .08rem;left: -.7rem;}
                &::after{content: '';width: .6rem;height: 0;border-top: 1px solid #cacaca;position: absolute;top: .08rem;right: -.7rem;}
            }

        }
        .list{
            
            background: #f2f2f2;
            overflow:auto;
            li{padding:.1rem .15rem;position:relative;background:#fff;@include box;@include flexJustify(space-between);@include flexAlign;
                >div{color:$black;
                div{color: #cacaca;margin-top: .05rem;font-size: .12rem;}
                }
                >span{top:auto;bottom:.1rem;color:$red;font-size:.16rem;}
            }
        }
        
        .mint-navbar{
            position: relative;
        }
        .mint-navbar .mint-tab-item {
            // border-right: 1px solid #f1f1f1 !important;
            border-bottom: 1px solid #f2f2f2;
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
    }
</style>
