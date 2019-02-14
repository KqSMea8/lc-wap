<template>
    <app-layout id="meAccount">
        <div class="list-box" style="margin-top: .1rem;">
            <div class="item" style="height:.8rem;" >
                <div class="title">头像</div>
                <div class="right" style="flex: inherit;-webkit-flex: inherit;">
                    
                    <div class="avatar" :style="{'background-image':'url('+defaultHead+')'}"><input type="file" class="upimg" @change="uploadImg"/></div>
                </div>
            </div>
            <router-link tag="div" class="item" to="/me/modifyNickname">
                <div class="title">昵称</div>
                <div class="right">
                    <span>{{nickname}}</span>
                    <span class="arrow"></span>
                </div>
            </router-link>
        </div>
        <div class="list-box">
            <div class="item" @click="sheetVisible=true">
                <div class="title">性别</div>
                <div class="right">
                    <span>{{sex}}</span>
                    <span class="arrow"></span>
                </div>
            </div>
            <div class="item" @click="openPicker(pickerbrithday)">
                <div class="title">生日</div>
                <div class="right">
                    <span>{{pickerbrithday}}</span>
                    <span class="arrow"></span>
                </div>
            </div>
            <router-link tag="div" class="item" to="/me/phoneOne">
                <div class="title">手机号码</div>
                <div class="right">
                    <span>{{mobilephone}}</span>
                    <span class="arrow"></span>
                </div>
            </router-link>
        </div>
        <router-link tag="div" class="list-box" to="/address?fromPath=me">
            <div class="item">
                <div class="title">收货地址</div>
                <div class="right">
                    <span class="arrow"></span>
                </div>
            </div>
        </router-link>
        <mt-actionsheet
            :actions="actions"
            v-model="sheetVisible"
            cancelText="取消">
        </mt-actionsheet>
        <mt-datetime-picker 
            ref="picker"
            type="date"
            v-model="PickerDate"
            @confirm="handleConfirm"
            :startDate="startDate"
            :endDate="endDate">
        </mt-datetime-picker>
        <div slot="footer" class="nextOne" v-if="!isWechat">
            <div class="btn" @click="signOut">退出登录</div>
        </div>
    </app-layout>
</template>
<script>
    import Fileupload from '../../../utils/fileupload.js'
    export default {
        data(){
            return{
                startDate:new Date(new Date().getFullYear() - 100, 0, 1),
                endDate:new Date(new Date().getFullYear() + 100, 0, 1),
                defaultHead:this.$cache.user.headImgUrl||require('assets/img/default_user.png'),
                actions:[
                    {
                        name:'男',
                        method:()=>{
                            this.changeInfo(this.$cache.user.nickname,1,this.pickerbrithday)
                        }
                    },
                    {
                        name:'女',
                        method:()=>{
                            this.changeInfo(this.$cache.user.nickname,2,this.pickerbrithday)
                        }
                    }
                ],
                sheetVisible:false,
                PickerDate:'1990-01-01',
                pickerbrithday:'1990-01-01',
                sex:'',
                nickname:'',
                mobilephone:'',
                isWechat:isWechat

            }
            
        },
        activated(){
            if(this.$cache.user.sex==0){
                this.sex='请选择'
            }else if(this.$cache.user.sex==1){
                this.sex='男'
            }else if(this.$cache.user.sex==2){
                this.sex='女'
            }
            this.pickerbrithday=this.$cache.user.brithday;
            this.nickname=this.$cache.user.nickname
            this.mobilephone=this.$cache.user.phone
        },
        methods:{
            signOut(){
                this.$messagebox.confirm('确定要退出吗?', '提示').then((action)=>{
                    this.$utils.delCookie('mbeId');
                    this.$utils.delCookie('userToken');
                    this.$cache.user={};
                    this.$cache.history.pop();
                    this.$router.replace('/h5signUp');
                }).catch(()=>{
                    
                });
                
            },
            async changeInfo(name,sex,brithday){
                let d={
                    content: {
                        memberId: this.$cache.user.memberId,
                        name:this.$cache.user.name,
                        nickname:name,
                        sex:sex,
                        birthday:brithday
                    }
                };
                let res = await this.$post('/CRM/appmembermgcust/updatememberinfo.json',d);
                if(res.errcode==0){
                    this.$cache.user.brithday=brithday;
                    this.pickerbrithday=brithday;
                    this.$cache.user.sex=sex;
                    this.sex=sex==2 ? '女':'男'
                    this.$toast('修改成功')
                }
            },
            openPicker(picker) {   
                if(picker==''||picker==undefined){
                    let date=new Date();
                    let month=(date.getMonth() + 1).toString().length<2 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1);
                    let day=date.getDate().toString().length<2 ? '0'+date.getDate():date.getDate();
                    let time=date.getFullYear() + '-' + month + '-' + day;
                    this.PickerDate=time;
                } else{
                    this.PickerDate=picker
                }
                this.$refs.picker.open();  
            },
            handleConfirm(e){
                let date=new Date(e)
                if(date.getTime() > new Date().getTime()){
                    this.$toast('所选时间必须小于当前时间')
                    this.$refs.picker.open();  
                    return 
                }
                let month=(date.getMonth() + 1).toString().length<2 ? '0'+(date.getMonth() + 1):(date.getMonth() + 1);
                let day=date.getDate().toString().length<2 ? '0'+date.getDate():date.getDate();
                let time=date.getFullYear() + '-' + month + '-' + day;

                this.changeInfo(this.$cache.user.nickname,this.$cache.user.sex,time)
            },
            uploadImg: function(e){
                var that=this;
                let obj=e.target;
                let files=obj.files;
     
                Fileupload.uploadfiles(this,1,files).then(async (data)=>{
                    that.defaultHead=data.baseArr[0];
                    
                    let formData = new FormData();
                    formData.append('files', data.filesArr[0]);
                    console.log(formData.get('files'))
                    let res = await that.$postForm('/CRM/appothers/uploadImg.json',formData);
                    
                    if(res.errcode==0){
                        let d={
                            content:{
                                memberId:that.$cache.user.memberId,
                                filename:res.content.filesNames
                            }
                            
                        }
                        let res1 = await that.$post('/CRM/appmembermgcust/updatecustheadsculpture.json',d);
                        if(res1.errcode==0){
                            that.$cache.user.headImgUrl=data.baseArr[0];
                            that.$toast('修改成功')
                        }
                        
                    }       
                })   
            },
        }
    }
</script>
<style lang="scss">
    @import "~assets/css/var.scss";
    .mint-toast {
            z-index: 2009 !important;
        }
    #meAccount{
        
        .mint-datetime-action{
            color: orangered
        }
        .list-box{
            margin-top: .05rem;
            .upimg{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                opacity: 0;
            }
            .item{
                font-size: .15rem;
                color:#22222d;
                background: #fff;
                border-bottom: 1px solid #f2f2f2;
                height: .44rem;
                @include box;
                @include flexJustify(space-between);
                @include flexAlign;
                padding: 0 .2rem;
                position: relative;
            }
            .right{
                @include flex;
                text-align: right;
                color: #88888d;
                .arrow{
                    position:relative;
                    margin-right: .06rem;
                    margin-left: .1rem;
                    top: .01rem;
                    &::after{position:absolute;content:'';width:0;height:0;top: .02rem;right:-.05rem;border:.06rem solid transparent;border-right:0;border-left-color:#fff;}
                    &::before{position:absolute;content:'';width:0;height:0;top: .02rem;border:.06rem solid transparent;border-right:0;border-left-color:#999;}
                }
                .avatar{
                    width: .6rem;
                    height: .6rem;
                    border-radius: 50%;
                    border:1px solid #d7d7d7;
                    background-size: cover;
                    background-position: center;
                }

            }
        }
    }
</style>
