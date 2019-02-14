<template>
  <app-layout id="mall_collection">
      <div v-if="list.length===0" class="lc-error">
          <img src="~assets/img/mall/icon_goods_empty.png">
          <p>暂无商品</p>
      </div>

      <div id="header" slot="header" :class="list.length>0?'':'hide'">
        共{{totle}}件商品
        <button @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</button>
      </div>


       <mt-navbar slot="header" v-model="type">
            <mt-tab-item id="car">新车</mt-tab-item>
            <mt-tab-item id="cargoods">车品</mt-tab-item>
        </mt-navbar>


      <div v-if="list.length>0" v-infinite-scroll="loadMore" infinite-scroll-disabled="nomore" infinite-scroll-distance="100" infinite-scroll-immediate-check="false">
        <lc-cell-swipe v-for="item in list" :right="[{
                  content: '删除',
                  style: { background: 'red', color: '#fff','line-height':'1rem',padding:'0 .1rem' },
                  handler:()=>deleteItems([item.item_id])
                }]">

          <div v-if="isEdit" :class="{'item-radio':true,'on':selected.indexOf(item.item_id)>=0,'dis':(!item.valid&&!isEdit)}" @click="select(item.item_id)"></div>

          <router-link class="item-info" :to="'/mall/cargoods/'+item.item_id">
            <div class="img">
              <img :src="item.img">
            </div>
            
            <h1><span class="secKill" v-if="type=='cargoods'&&item.miaosha" >天天秒杀</span>{{item.title}}</h1>
            <p></p>
            <h2>￥{{item.miaosha?parseFloat(item.miaosha.price):parseFloat(item.goods_price)}}
              <del v-show="item.miaosha">￥{{parseFloat(item.goods_price)}}</del>
            </h2>
          </router-link>

        </lc-cell-swipe>
      </div>

      <div id="footer" slot="footer" v-if="isEdit&&list.length>0">
        <button class="del" v-if="isEdit" @click="deleteItems(selected)">删除</button>
      </div>

  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      type:'car',
      pageNo: 1,
      pageSize: 10,
      nomore: false,
      st:0,
      totle:0,

      list:[],
      selected:[],

      isEdit:false
    }
  },
  watch: {
    type(val) {
      this.resetPage();
      this.loadMore();
    }
  },
  activated(){
    this.loadMore();
    if (this.st != 0) { this.$el.children.appMain.scrollTop = this.st; }
  },
  beforeRouteLeave(to, from, next) {
    this.st = this.$el.children.appMain.scrollTop;
    next();
  },
  methods:{
    resetPage(){
      this.pageNo=1;
      this.nomore=false;
      this.totle=0;
      this.list=[];
      this.selected=[];
      this.isEdit=false;
    },
    select(id){
      let index=this.selected.indexOf(id);
      if(index>=0){
        this.selected.splice(index,1);
      }else{
        this.selected.push(id);
      }
    },
    async deleteItems(ids){
      if(ids.length===0){
        this.$toast('请选择要删除的商品');
      }else{
        let user=this.$cache.user,
          data={
            content:{
              item_id:ids.join(','),
              mbeid:user.memberId,
              mobile:user.phone
            }
        };
        let res= await this.$post('/mall29/collectremove.html', data);
        if (res.errcode === 0) {
          this.list=this.list.filter(item => ids.indexOf(item.item_id)<0);
          this.selected=[];
          this.totle-=1;
          this.$toast('删除成功');
          if(this.list.length<this.pageSize){
            this.loadMore();
          }
        }
      }
    },
    async loadMore(){
      if(!this.nomore){
        this.nomore=true;
     
        let user=this.$cache.user,
          data={
            content:{
              mbeid:user.memberId,
              mobile:user.phone,
              itemtype:this.type,
              pageNo:this.pageNo,
              pageSize:this.pageSize
            }
          }
          let res= await this.$post('/mall29/collectitemlist.html', data);
          if (res.errcode === 0) {
            let con=res.content,
                list=con.list;

            this.list =this.list.concat(con.list);
            this.totle=con.totalNums;

            if (con.totalPages > this.pageNo) {
              this.pageNo += 1;
              this.nomore = false;
            }
          }
        }
    }
   
  }
}
</script>

<style lang="scss">
@import "~assets/css/var.scss";
#mall_collection{

  #appMain{padding-bottom:.52rem!important;}

  .lc-cell-wrapper {width:100%;height: 1rem;padding:.1rem .2rem;box-sizing:border-box;display:block;font-size:$h3;@include box;
    .item-radio{display: block;width:.38rem;height:100%;background: url('~assets/img/icon_list_select.png') no-repeat left center;background-size:.2rem .2rem;
      &.on{background-image:url('~assets/img/icon_list_select_pressed.png'); }
      &.dis{background: none;}
    }

    .item-info{display: block;width: 2.97rem;height: 100%;position: relative;
      >h2{color:$red;position:absolute;bottom:0;left:.9rem;font-size:.14rem;
        del{color: #88888d;font-size: 0.12rem;margin-left: .05rem;}
      }
    }
    .img{height:.8rem;width:.8rem;float: left;margin-right:.1rem;
      img{width:100%;height:100%;}
    }
    .secKill{height: .16rem;line-height: .16rem;font-size: .12rem;display: inline-block;padding: 0 .04rem;background: linear-gradient(to right, #f02d8d, #f2315e);color: #fff;border-radius: 3px;margin-right: .04rem;}
    h1{color:$black;}
    p{color:$gray;margin-top:.05rem;}

    
  }

  #header{height:.5rem;line-height: .5rem;background:#fff;font-size:$h2;border-bottom:.05rem solid #f2f2f2;padding:0 .2rem;
    button{float:right;}
  }

  #footer{height:.5rem;line-height: .5rem;background:#fff;padding-left:.48rem;font-size:$h2;border-top:$border;
    span{color:$red;}
    button{float:right;
      &.next{background:$red;height: 100%;width:1.1rem;color:#fff;}
      &.del{color:$red;border:1px solid $red;border-radius: 3px;height:.3rem;margin-top:.1rem;margin-right:.2rem;padding:0 .2rem;line-height: .3rem;}
    }
  }
  .mint-tab-item-label{
        font-size: .15rem;
    }
}
</style>
