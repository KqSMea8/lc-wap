'use strict'

import MD5 from 'js-md5'

const SECRET={
    common:'09LDZK#$!KEQ',
    pay:'76f5d3cb319d403c95cb85a7c081b65f',
    sms:'09LDZK#$!KEQ',
    addkey:'09LDZK#$!KEQ'

};
function getNonce(){
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    var value="";
    var num=Math.floor(Math.random()*25+8);
    for(var i=0;i<num;i++){
        var id = parseInt(Math.random()*61);
        value+=chars[id];
    }
    return value;
}
const install = function (Vue) {
    
    Vue.$sign=Vue.prototype.$sign =function(data,type){
        
        let obj=data,
            str='';

        Object.keys(obj).forEach(function(key){
            let val=obj[key];
            if(typeof val==='object'){
                str+=(key+'='+JSON.stringify(val)+'&');
            }else{
                str+=(key+'='+val+'&');
            }
        });

        let secret;
        secret=SECRET[type]||SECRET.common;

        let sign;

        if(type=='addkey'||type=='sms'){
            var nonce=getNonce();
            var signMethod='MD5';
            var ts=new Date().getTime()+'';
            var type1='app';
            var version = Vue.$cache.appVersion
            
            if(type=='sms'){

                sign=MD5('content='+JSON.stringify({'value':data.content})+'&nonce='+nonce+'&signMethod='+signMethod+'&ts='+ts+'&type='+type1+'&version='+version+'&SECRET='+secret).toLowerCase();
                obj.content = JSON.stringify({'value':data.content})
       
            }else{
                
                sign=MD5(str+'nonce='+nonce+'&signMethod='+signMethod+'&ts='+ts+'&type='+type1+'&version='+version+'&SECRET='+secret).toLowerCase();

                obj.content = JSON.stringify(data.content)
            }
            obj.nonce=nonce;
            obj.signMethod=signMethod;
            obj.ts=ts;
            obj.type =type1;
            obj.version = version
            
        }else{
            
           
            sign=MD5(str+'SECRET='+secret).toLowerCase();
            
        }
        if(type=='pay'){
            obj.content = JSON.stringify(obj.content)
        }
        obj.sign=sign;

        if(type!=='sms'){
            
            obj.userToken=Vue.$cache.token;
        //  obj.userToken="IyDtq4c4XEB$fwzoJu5sCCa0aVYX366CAKemtIWTYOCbf9cIRnC6O2$aDxPASFXUaBXs4e0ToUJqOnlByqJsJzBLNLzVMV4lKKLH4dGE$EQNH6$y28KiOSyNlNVe0YnJb62Zpnwvab1uMXxjIltBp76b5p2o6TXVN$juR9MFJV0=";
        }
        return obj;
    }
    
}
export default install
// module.exports = {
//     install
// };