import common from './dependencies'

const env = process.env.NODE_ENV
const isDev=(env === 'development');
const install = function (Vue, router) {
 
  let pAll = [];
  // updateMbeId && pAll.push(getMbeId());
  router.beforeEach((to, from, next) => {

    Promise.all(pAll).then(function () {
      let tm = to.meta,
        fm = from.meta

        if(tm.openWechat){
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
            var redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65478e169956c988&redirect_uri=' + encodeURIComponent('https://www.lechengclub.com/wap/redirect.html') +
              '&response_type=code&scope=snsapi_userinfo&state=' + (curHost+state) + '#wechat_redirect';
          }else{
            var redirect_uri = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0a5e1fd83f89b602&redirect_uri=' + encodeURIComponent('https://ceshi.lechengclub.com/wap/redirect.html') +'&response_type=code&scope=snsapi_userinfo&state=' + (curHost+state) + '#wechat_redirect';
          }
          location.replace(redirect_uri);
        }

      //友盟统计
      _czc.push(["_trackPageview","/wxwap?#"+to.fullPath+"【"+(tm.resetTitle||tm.title)+"】","/wxwap?#"+from.fullPath+"【"+((fm.resetTitle||fm.title)||'微信直接打开')+"】"]); 
 
      
      //是否需要登录
      if (tm.requireAuth === undefined&&!Vue.$cache.user.name) {
        common.login(Vue, to, next,tm.noJumpLogin,tm.activity);

      } else {
        common.geolocation(Vue, to, next);
      }

    });

  });
  
}
export default install

