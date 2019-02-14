import common from './dependencies'

const install = function (Vue, router) {

    let cur_mid = Vue.$cache.user.memberId,
        new_mid = Vue.$utils.getUrlParam('memberId');

    let cur_token = Vue.$cache.token,
        new_token = Vue.$utils.getUrlParam('userToken');

    if (!cur_mid|| cur_mid !== new_mid) {
        Vue.$cache.user.memberId = new_mid;
    }
    if (cur_token==''|| cur_token != new_token) {
        Vue.$cache.token = new_token;
        // Vue.$toast(Vue.$cache.token)
    }

    router.beforeEach((to, from, next) => {
        let tm = to.meta,
            fm = from.meta;
        
        //友盟统计
        _czc.push(["_trackPageview","/wxwap?#"+to.fullPath+"【"+(tm.resetTitle||tm.title)+"】","/wxwap?#"+from.fullPath+"【"+((fm.resetTitle||fm.title)||'APP直接打开')+"】"]); 

        
        if (tm.share === false) {
            Vue.$utils.shareConfig(null,'hide');
        }

        if (tm.requireAuth === undefined) {

            let mid=Vue.$cache.user.memberId;
            let token=Vue.$cache.token;

            if (!mid) {
                // let url = location.href,
                // s=location.search;
                // s?s += '&LechengLogin':s += '?LechengLogin';
                // Vue.$utils.goNative('login',null,url.replace(location.search,s));
                let url = location.href,
                h=location.hash,
                s=location.search;
                if(tm.noJumpLogin){
                    if(!s){             
                        var appurl = url.split(h)[0]+'LechengMember'+h;
                        Vue.$utils.goNative('LechengMember',null,appurl);
                        
                    }else{
                        s += '&LechengMember';
                        Vue.$utils.goNative('LechengMember',null,url.replace(location.search,s));
                    }
                    common.updatePageInfo(Vue, to, next);
                    return
                }
                let extra={}
                if(tm.activity){
                    extra.value = Vue.$utils.activityRecord(to,Vue.$cache.activityInfo)
                }

                if(!s){
                  var appurl = url.split(h)[0]+'LechengLogin'+h;
                  Vue.$utils.goNative('login',null,appurl,extra);
                }else{
                  s += '&LechengLogin';
                  Vue.$utils.goNative('login',null,url.replace(location.search,s),extra);
              
                }
            } else {
                common.getUserInfo(Vue, to, mid, next)
            }

        } else {
            common.updatePageInfo(Vue, to, next);
        }

    });

}
export default install