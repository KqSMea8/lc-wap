'use strict'

const install = function (Vue) {

    Vue.$login = Vue.prototype.$login = async function (callback,route) {
 
        if (Vue.$cache.user.memberId) {
            callback();
        } else {

            if (isLecheng) {
               

                let url = location.href,
                h=location.hash,
                s=location.search;

                // if (s) {
                //     s += '&LechengLogin';
                // } else {
                //     s += '?LechengLogin';
                // }

                if(!s){
                  var appurl = url.split(h)[0]+'LechengLogin'+h;
                }else{
                  s += '&LechengLogin';
                }

                let extra={}
                if(route){
                    extra.value = Vue.$utils.activityRecord(route,Vue.$cache.activityInfo)
                }

                let appLogin = {
                    type: "goNative",
                    data: {
                        page: "login",
                        redirectUrl: !s?appurl:url.replace(location.search,s),
                        extra:extra
                    }
                }
                Vue.$utils.jsBridge(appLogin);

            } else if(isWechat){
                let data = {
                    content: {
                        openid: Vue.$utils.getCookie('openid'),
                    }
                };

                let res = await Vue.$post('/CRM/wechatcfg/getinfo.json', data);
                if (res.errcode == 0) {

                    let con = res.content;
                    if (con.isBinding) {
                        Vue.$cache.token = con.userToken;
                        getUserInfo(con.mbeId,callback);
                    } else {
                        if(route){
                            const extra = Vue.$utils.activityRecord(route,Vue.$cache.activityInfo)
                            if(extra){
                                Vue.$router.push('/signUp?from=activity&value='+extra);
                            }else{
                                Vue.$router.push('/signUp?from=activity');
                            }
                            // let str='';
                            // Object.keys(pageType).forEach(function(key,index){
                            //     let val=pageType[key];
                            //     if(index==Object.keys(pageType).length-1){
                            //         str+=(key+'='+val);  
                            //     }else{
                            //         str+=(key+'='+val+'&');  
                            //     }
                            // });
                            // Vue.$router.push('/signUp?'+str);
                        }else{
                            Vue.$router.push('/signUp');
                        }
                    }

                } else if (res.errcode == 3) {//openid过期
                    Vue.$utils.delCookie('openid');
                    let curHost;
                    switch(location.host){
                      case "192.168.21.158:8080":curHost='0';break;
                      case "localhost:8080":curHost='0';break;
                      case "ceshi.lechengclub.com":curHost='1';break;
                      case "lechengclub.com":curHost='2';break;
                      case "www.lechengclub.com":curHost='2';break;
                      case "c.lechengclub.com":curHost='3';break;
                    }
          
                    var state = location.hash.split('#')[1].replace(/\?/g, 'X0').replace(/\=/g, 'X1').replace(/&/g, 'X2').replace(/\//g,'X3');
          
                    if(curHost==2||curHost==3){
                      var  redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65478e169956c988&redirect_uri=' + encodeURIComponent('https://www.lechengclub.com/wap/redirect.html') +
                      '&response_type=code&scope=snsapi_userinfo&state=' + (curHost+state) + '#wechat_redirect';
          
                    }else{
                      var redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0a5e1fd83f89b602&redirect_uri=' + encodeURIComponent('https://ceshi.lechengclub.com/wap/redirect.html') +'&response_type=code&scope=snsapi_userinfo&state=' + (curHost+state) + '#wechat_redirect';
            
                      
                    }
                    location.replace(redirect_uri);
                }
            }else{

                if(route){

                    const extra = Vue.$utils.activityRecord(route,Vue.$cache.activityInfo)
                    if(extra){
                        Vue.$router.push('/h5signUp?from=activity&value='+extra);
                    }else{
                        Vue.$router.push('/h5signUp?from=activity');
                    }
                    
                }else{
                    Vue.$router.push('/h5signUp');
                }
               
            }
        }
    }

    async function getUserInfo(memberId,callback) {

        let data = {
            content: {
                memberId: memberId,
                source: 'WeChat'
            }
        };
        let res = await Vue.$post('/CRM/appmembermgcust/getMemberInfo.json', data);
        if (res.errcode == 0) {
            Vue.$cache.user = res.content;
            eventBus.$emit('loggedIn');
            callback();
        }
    }

}
export default install
// module.exports = {
//     install
// };






