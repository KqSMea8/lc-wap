
import appDownLoad from './appDownLoad.vue'
export default {
  install(Vue,options){
    
    let $vm;
    Vue.prototype.$appDownLoad = {
      show(params){
        if(!$vm){
          const tpl = Vue.extend(appDownLoad);
          $vm = new tpl().$mount()
          document.body.appendChild($vm.$el)
        }
        if(params){
          if(params.title){
            $vm.title=params.title
          }
          if(params.details){
            $vm.details=params.details
          }
          if(params.mlink){
            $vm.mlink=params.mlink
          }
          if(params.mobParams){
            $vm.mobParams=params.mobParams
            let obj=params.mobParams,
            str='';
            Object.keys(obj).forEach((key,index)=>{
              let val=obj[key];
              if(index==Object.keys(obj).length-1){
                str+=(key+'='+val);
              }else{
                str+=(key+'='+val+'&');
              }
            });
            $vm.mobLink=`lecheng://?${str}`
          }
          
          if(params.wechat){
            $vm.wechat=params.wechat
          }
        }
        $vm.showAlert=true
        
      },
      hide(){
        $vm.title='请下载App'
        $vm.details='该浏览器端无此功能'
        $vm.mlink='ABc3?mlKey=home'
        $vm.mobParams={
          mlKey:"home",
          mId:""
        }
        $vm.mobLink=`lecheng://?mlKey=home&mId=''`
        $vm.wechat=false
        $vm.showAlert=false
      }
    }
  }
}