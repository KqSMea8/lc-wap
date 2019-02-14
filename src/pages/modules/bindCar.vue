<template>
  <app-layout id="bindCar">

    <div v-if="fromPath==='/maintenance'" class="nodata">您尚未绑定车辆，请先添加车辆，方可进行维保预约！</div>

    <ul class="card">

      <li>
        <label>车主姓名</label>
        <input class="item-val" type="text" placeholder="请输入车主姓名" v-model="owner">
      </li>

      <li class="arrow">
        <label>品牌车型</label>
        <router-link to="/brands" class="item-val">{{$cache.brand.brandName}} {{brand}}</router-link>
      </li>

      <li>
        <label>车牌号</label>
        <div class="area" v-on:click="areaVisible=true">
          <span>{{area}}</span>
        </div>
        <input class="item-val carId" type="text" placeholder="请输入车牌号码" maxlength="6" v-model="carNum">
      </li>

      <li class="arrow">
        <label>归属4S店</label>
        <router-link to="/fourS" class="item-val">{{fourS}}</router-link>
      </li>

      <li class="arrow" v-if="fourS!='选择归属4S店'">
        <label>专属服务顾问</label>
        <router-link to="/server/list" class="item-val">{{server}}</router-link>
      </li>

      <li class="setDefault" v-show="!isDefaultCar">
        <label>设为默认车</label>
        <div class="item-val">
          <mt-switch class="switch" v-model="radio"></mt-switch>
        </div>
      </li>

    </ul>

    <button class="sub" v-on:click="next">{{carId?'保存':'添加'}}</button>

    <mt-popup slot="aside" v-model="areaVisible" position="bottom" style="width:100%;">
      <table id="carArea" class="keyboard">
        <tr v-for="value in keyboardData">
          <td v-for="item in value" :class="area==item?'on':''" v-on:click="area=item;areaVisible=false;">{{item}}</td>
        </tr>
      </table>
    </mt-popup>

    <div class="dialog-bg" v-if="showBind">
      <div class="gift-popup">
        <div class="close" @click="showBind=false" style="margin-right:.07rem">×</div>
        <div class="top">
          <p class="title">系统查询到您的车辆信息</p>
          <ul class="gift-ul">
            <li :class="selBind==index?'sel':''" v-for="(item,index) in carList" @click="selCar(index)">
              <img :src="item.carImgUrl" alt="">
              <div class="info">
                <p>{{item.licenseplate}}</p>
                <div>{{item.brandName}} {{item.modelName}}</div>
              </div>
            </li>

          </ul>
          <div class="btn-box">
            <div @click="showBind=false">绑定其他车辆</div>
            <div style="background:#ea5f00" @click="trueCar">确定</div>
          </div>
          <div class="tips">如以上不是您的车辆，请<router-link class="left" tag="button" to="/feedback"><span>一键报错</span></router-link>进行核对</div>
        </div>
      </div>
    </div>

  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        keyboardData: [
          ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀'],
          ['豫', '川', '渝', '辽', '吉', '黑', '皖', '鄂'],
          ['湘', '赣', '闽', '陕', '甘', '宁', '蒙', '津'],
          ['贵', '云', '桂', '琼', '青', '新', '藏', '台']
        ],
        carId:'',
        owner: '',
        area: '闽',
        carNum: '',
        fourS: '选择归属4S店',
        server: '选择专属服务顾问',
        brand: '选择车型',
        radio: false,
        areaVisible: false,
        fromPath: '',
        isDefaultCar:false,
        showBind:false,
        carList:[],
        selBind:0,

      };
    },
    watch: {
      fourS(val) {
        if (/fourS/.test(this.fromPath)&&val != '选择归属4S店') {
          this.server = '选择专属服务顾问';
          this.$cache.server={};
        }
      }
    },
    activated(){

        if(!this.carId){
          
          let car=this.$cache.car,
              carId=car.carId;
          if(carId){
            
            this.carId=carId;
            this.owner=car.czname;
            this.area=car.licenseplate.substr(0,1);
            this.carNum=car.licenseplate.substr(1);
            this.radio=car.isDefaultCar?true:false;
            this.isDefaultCar=car.isDefaultCar
          }
        }

        let fourS = this.$cache.fourS.name,
          server = this.$cache.server.name,
          brand = this.$cache.brand.name;

        if (fourS) {
          this.fourS = fourS;
        }
        if (server) {
          this.server = server;
        }
        if (brand) {
          this.brand = brand;
        }
    },
    beforeRouteEnter: (to, from, next) => {

      let fp=from.path;
      if(/detail/.test(fp)||to.query.edit==1){
        to.meta.resetTitle='编辑爱车详情';
      }
      next(vm => {
          vm.fromPath=fp;
          if(!/detail/.test(fp)&&!/brands/.test(fp)&&!/fourS/.test(fp)&&!/server/.test(fp)&&to.query.edit!=1){
            vm.getCarInfo()
          }
      })
    },
    beforeRouteLeave(to, from, next) {
      if (!/(brands|fourS|server)/.test(to.path)) {
        this.resetPage();
        this.$cache.car={};
        this.$cache.fourS={};
        this.$cache.brand={};
        this.$cache.server={};
      }
      next();
    },
    methods: {
      resetPage() {
        this.carId='';
        this.owner = '';
        this.area = '闽';
        this.carNum = '';
        this.fourS = '选择归属4S店';
        this.server = '选择专属服务顾问';
        this.brand = '选择车型';
        this.radio = false;
        this.areaVisible = false;
        this.firstCar = false;
        this.fromPath='';
      },
      trueCar(){
        this.carId=this.carList[this.selBind].carId;
        this.owner=this.carList[this.selBind].czname;
        this.$cache.brand.brandName=this.carList[this.selBind].brandName;
        this.brand=this.carList[this.selBind].modelName;
        this.carNum=this.carList[this.selBind].licenseplate.substr(1);
        this.area=this.carList[this.selBind].licenseplate.substr(0,1);
        this.fourS=this.carList[this.selBind]['4sStoreName'];
        this.server=this.carList[this.selBind].serviceCustName;

    
        this.$cache.brand.bid=this.carList[this.selBind].brandId;
        this.$cache.brand.sid=this.carList[this.selBind].serviceCustId;
        this.$cache.brand.mid=this.carList[this.selBind].modelId;
        this.$cache.brand.name=this.carList[this.selBind].brandName;

        this.$cache.fourS.id=this.carList[this.selBind]['4sStoreId'];
        this.$cache.fourS.name=this.carList[this.selBind]['4sStoreName'];
        this.showBind=false
      },
      selCar(index){
        this.selBind=index
      },
      async getCarInfo(){
        let data = {
          content:{
            memberId:this.$cache.user.memberId
          }
        }
        let res=await this.$post('/CRM/appmembermgcust/getCarInfo.json', data);
        if (res.errcode == 0) {
          if(res.content.carList.length>0){

            this.carList=res.content.carList;
            this.showBind=true
          }else{
            this.showBind=false
          }
        }
      },
      hasNull() {

        let data = document.getElementsByClassName('item-val'),
          vm = this,
          di,
          val,
          len;

        for (let i = 0; i < data.length; i++) {
          di = data[i];
          if (di.tagName != 'DIV') {

            di.tagName == 'INPUT' ? val = di.value.replace(/(^\s+)|(\s+$)/g, '') : val = di.innerText;
            len = di.getAttribute('maxlength');

            if (val === '' || val == '选择车型' || val == '选择归属4S店') {
              this.$toast(di.parentNode.children[0].innerText + '不能为空');
              return true;
            } else if (len !== null && val.length < len) {
              this.$toast(di.parentNode.children[0].innerText + '应为' + len + '位非空字符，请检查');
              return true;
            }
          }
        }

        return false;
      },
      async next() {

        if (!this.hasNull()) {
          let s = this.$cache,
            brand = s.brand;

          let d = {
            'content': {
              'memberId': '' + s.user.memberId + '',
              'registeredCars': [{
                'status': this.carId?'update':'create',
                'carId': this.carId||null,
                'czname': this.owner,
                '4sStoreId': s.fourS.id.toString(),
                'brandId': brand.bid.toString(),
                'seriesId': brand.sid.toString(),
                'modelId': brand.mid.toString(),
                'licensePlateNo': '' + this.area + '' + this.carNum.toUpperCase() + '',
                'serviceCustId': (s.server.id === undefined || s.server.id === '') ? '' : s.server.id.toString(),
                'setDefault': this.radio
              }]
            }
          };

          let res=await this.$post('/CRM/appmembermgcust/updatecarinfo.json', d);
          if (res.errcode == 0) {
            eventBus.$emit('userInfoUpdated');
            if (/caidan/.test(location.search)) {
              this.$router.push('/myCars');
            } else if(this.fromPath==='/maintenance'){
              this.$cache.history.pop();
              this.$router.replace('/maintenance');
            }else{
              this.$router.go(-1);
            }
          } 
        }

      }

    }
  };

</script>

<style lang="scss">
  @import "~assets/css/var.scss";
  #bindCar{
    .page-content{padding:0 4%;}
    .card {
      li{padding:0 .12rem;border-bottom:$border;@include box;height:.44rem;line-height:.44rem;}
      li.setDefault{height:44px;line-height:44px;}
      li.arrow{
        position:relative;padding-right:.2rem;
         &::after{position:absolute;content:'';width:0;height:0;top:.15rem;right:.11rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
         &::before{position:absolute;content:'';width:0;height:0;top:.15rem;right:.09rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
      }
      label{@include flex;}
      div.area{
        @include flex;text-align:center;
        span:nth-of-type(1){margin-right:.15rem;}
        span::after{content:"▼";margin-left:.02rem;}
      }
      .item-val{text-align:right;@include flex(2);color:$black;@include txtOverflow;}
      .item-val.carId{@include flex(1);max-width:100px;}
      .item-val .switch{float:right;margin-top:6px;}
      input{height:100%;line-height:normal!important;}
    }

    .keyboard{
      border-spacing:.1rem;background: #eaebec;width:100%;
      td{line-height:.4rem;text-align:center;background:#fff;border-bottom: 1px solid #b8babb;border-radius:5px;width:12.5%;}
      td.on{background:$red;color:#fff;}
    }

    .gift-popup{
      width: 3.31rem;
      left: 50%;
      top: 50%;
      position: relative;
      transform: translate(-50%,-50%);
      .top{
        margin-left: .055rem;
        box-sizing: border-box;
        width: 3.2rem;
        background: #fff;
        border-radius: .06rem;
        padding:.2rem .3rem;
        color: #000;
        
        .title{
          margin-bottom: .14rem;
          color: #22222d;
          text-align: left;
          span{color: #cc0c01}
        }
        .gift-ul{
          max-height: 1.8rem;
          overflow: auto;
          li{
            &.sel{
              border-color: #e04816;
              background: #fef5e6;
            }
            @include box(nowrap);
            @include flexAlign;
            @include txtOverflow;
            box-sizing: border-box;
            background: #f2f2f2;
            border:1px solid #dfdfdf;
            width: 100%;
            height: .65rem;
            border-radius: .06rem;
            background-size: 100% 100%;
            margin-bottom: .1rem;
            color: #cc0c01;
            font-size: .12rem;
            img{
              width: .45rem;
              margin: 0 .2rem;
            }
            .info{
              font-size: .15rem;
              padding-right: .2rem;
              text-align: left;
              @include txtOverflow;
              @include flex;
              p{
                color: #22222d;
                margin-bottom: .03rem;
                text-align: left;
              }
              div{
                @include txtOverflow;
                font-size: .12rem;
                color: $gray;
              }
            }
            
          }
          
        }
        .btn-box{
          @include box;
          @include flexJustify(space-between);
          margin-top: .15rem;
          div{
            border-radius: .06rem;
            color: #fff;
            line-height: .4rem;
            width: 1.18rem;
            height: .4rem;
            background: #f19601;
            text-align: center;
            
          }
        }
        .tips{
          color: #22222d;
          margin-top: .1rem;
          font-size: .12rem;
          text-align: left;
          span{
            color: #e2491d;
            text-decoration: underline;
          }
        }
      }
      .bottom{
        width: 100%;
        height: 1rem;
        background: url('~assets/img/orders/popup.png') no-repeat;
        background-size: 100% 100%;
        margin-top: -.28rem;
        div{
          height: .4rem;
          width: 90%;
          background: #f5b82c;
          color: #d03435;
          border-radius: .1rem;
          line-height: .4rem;
          margin-left: 5%;
          position: absolute;
          bottom: .17rem;
        }
      }
      
    }
  }
  
</style>
