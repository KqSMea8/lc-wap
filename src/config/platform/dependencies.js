
const env = process.env.NODE_ENV;
const isDev=(env === 'development');

export default {


  async getUserInfo (Vue, to, memberId, next) {
    
    if (!Vue.$cache.user.name) {

      let data = {
        content: {
          memberId:Vue.$cache.user.memberId?Vue.$cache.user.memberId:memberId,
          source: "WeChat"
        }
      };
      
      let res = await Vue.$post('/CRM/appmembermgcust/getMemberInfo.json', data);

      if (res.errcode == 0) {
        if(Vue.$cache.user.memberId){
          const mid = Vue.$cache.user.memberId;
          Vue.$cache.user = res.content;
          Vue.$cache.user.memberId = mid
        }else{
          Vue.$cache.user = res.content;
        }
        

        this.geolocation(Vue, to, next);
      }

    } else {
      this.geolocation(Vue, to, next);
    }
  },



  async login (Vue, to, next,noJumpLogin,activity) {
    if (isLecheng) {
      let appLogin = {
        type: "goNative",
        data: {
          page: "login",
          redirectUrl: location.href
        }
      }
      Vue.$utils.jsBridge(appLogin);

    } else if (isWechat) {
      
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
          this.getUserInfo(Vue, to, con.mbeId, next);
        } else {
          if(noJumpLogin){
            
            Vue.$cache.page.title = to.meta.title;
            Vue.$utils.setAppTitle(to.meta.title||to.meta.resetTitle);
            this.geolocation(Vue, to, next);
            return
          }
          if(activity){
            
            const extra = Vue.$utils.activityRecord(to,Vue.$cache.activityInfo)
            if(extra){
              this.geolocation(Vue, to, next, '/signUp?from=activity&value='+extra);
            }else{
              this.geolocation(Vue, to, next, '/signUp?from=activity');
            }
            
          }else{
            this.geolocation(Vue, to, next, '/signUp');
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

      var mbeId=Vue.$utils.getCookie('mbeId');
      if(mbeId){

        Vue.$cache.user.memberId=Vue.$utils.getCookie('mbeId');
        Vue.$cache.token=unescape(Vue.$utils.getCookie('userToken'));
        this.getUserInfo(Vue, to, Vue.$cache.user.memberId, next);
        return
      }
      if(noJumpLogin){
       
        Vue.$cache.page.title = to.meta.title;
        Vue.$utils.setAppTitle(to.meta.title||to.meta.resetTitle);
        this.geolocation(Vue, to, next);
        // next();
        return
      }
      
      // if(to.path.includes('/me')||to.path.includes('/home')||to.path.includes('/stores')||to.path.includes('/coupon/welfare')||to.path.includes('/discovery')||to.path.includes('/newUser')){
      //   Vue.$cache.page.title = to.meta.title;
      //   Vue.$utils.setAppTitle(to.meta.title||to.meta.resetTitle);
      //   next();
      //   return
      // }
      if(activity){

        const extra = Vue.$utils.activityRecord(to,Vue.$cache.activityInfo)
        if(extra){
          this.geolocation(Vue, to, next, '/h5signUp?from=activity&value='+extra);
        }else{
          this.geolocation(Vue, to, next, '/h5signUp?from=activity');
        }

      }else{
        this.geolocation(Vue, to, next, '/h5signUp');
      }
    }
  },



  geolocation(Vue, to, next, newPath){
    
    if(to.meta.geolocation&&!Vue.$cache.location.lat){
      let $this=this;
      if(isDev){
        Vue.$cache.location={lng:118.038466,lat:24.480229};
        document.body.lastChild.remove();
        $this.updatePageInfo(Vue, to, next, newPath);
        return
      }
      
      Vue.$Geo.getCurrentPosition(function(r){
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
              Vue.$cache.location=r.point;
              document.body.lastChild.remove();
              $this.updatePageInfo(Vue, to, next, newPath);
          }else{
            Vue.$cache.location={lng:118.038466,lat:24.480229};
            document.body.lastChild.remove();
            $this.updatePageInfo(Vue, to, next, newPath);
          }
      },{enableHighAccuracy: true})

    }else{
      this.updatePageInfo(Vue, to, next, newPath);
    }
  },

  

  updatePageInfo: function (Vue, to, next, newPath) {
   
    let toPath=to.fullPath;

    if(['/home','/stores','/mall','/me'].includes(toPath)){
      Vue.$cache.fourS={};
      Vue.$cache.server={};
      Vue.$cache.car={};
      Vue.$cache.date={};  
      Vue.$cache.salesConsultant={};
    }

    let tm=to.meta;

    let title = tm.resetTitle;
    if (title) {
      Vue.$utils.setAppTitle(title);
    } else if (document.title !== '盈众乐橙服务平台') {
      Vue.$utils.setAppTitle('盈众乐橙服务平台');
    }

    let page = Vue.$cache.page;
    page.hasTabBar = tm.hasTabBar;
    page.title = tm.title;
    page.hasSearch = tm.hasSearch;
    Vue.$indicator.close();
    
    //内部统计
    Vue.$statistics(toPath);

    if (newPath) {
     
      Vue.$cache.entry = toPath;
      next({
        path: newPath
      });
    } else {
      next();
    }
  }

};


