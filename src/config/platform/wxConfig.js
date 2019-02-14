import common from './dependencies'

const env = process.env.NODE_ENV

const install = function (Vue, router) {
  let pAll = [];
  updateOpenid && pAll.push(getOpenid());
  pAll.push(wxConfig())
  router.beforeEach((to, from, next) => {
    let tm = to.meta,
        fm = from.meta,
        tms = tm.share,
        fms = fm.share;

    //微信JSSDK
    pAll.push(wxShare(to, tms))
    Promise.all(pAll).then(function () {
      //友盟统计
      _czc.push(["_trackPageview","/wxwap?#"+to.fullPath+"【"+(tm.resetTitle||tm.title)+"】","/wxwap?#"+from.fullPath+"【"+((fm.resetTitle||fm.title)||'微信直接打开')+"】"]); 

      //是否需要登录
      if (tm.requireAuth === undefined&&!Vue.$cache.user.name) {
        if(tm.noJumpLogin){
          common.login(Vue, to, next,true);
        }else{
          if(tm.activity){
            common.login(Vue, to, next,false,true);
          }else{
            common.login(Vue, to, next,false,false);
          }
        }
      } else {
        common.geolocation(Vue, to, next);
      }
    });

  });


  function wxConfig() {
    return new Promise(async function(resolve, reject){
      let wxData = {
        content: {
          url: encodeURIComponent(location.href.split('#')[0])
        }
      };
      
      let res = await Vue.$post('/CRM/wechatcfg/getcfg.json', wxData);

      if (res.errcode == 0) {
        var con = res.content;
        wx.config({
          // debug:true,
          appId: con.appid,
          timestamp: con.timestamp,
          nonceStr: con.nonceStr,
          signature: con.signature,
          jsApiList: ['chooseWXPay','onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideOptionMenu','showOptionMenu']
        });
      }
      resolve()
    })
  }

  function wxShare(to, tms) {
    wx.ready(function () {
      // wx.hideOptionMenu();
      // wx.showMenuItems({
      //   menuList: [
      //     'menuItem:share:appMessage',
      //     'menuItem:share:timeline',
      //     'menuItem:favorite'
      //   ]
      // });
      if (tms === undefined) {//重置分享内容
        let data = {
          share_title: to.meta.resetTitle||'盈众乐橙服务平台',
          share_desc: '',
          share_img: location.origin + '/CRM/WeChat/App/static/img/login_logo.png',
          share_url: location.origin + '/wxwap?#' + to.fullPath
        }

        Vue.$utils.shareConfig(data);
      } else if (tms === false) {//不可分享，隐藏按钮
        wx.hideOptionMenu();
      }
    });
  }

  function getOpenid() {

    return new Promise(async function (resolve) {
      let data = {
        content: {
          code: Vue.$utils.getUrlParam('code'),
        }
      };

      let res = await Vue.$post('/CRM/wechatcfg/getopenid.json', data);
      if (res.errcode == 0) {
        let openid = res.content.openid;
        Vue.$utils.addCookie('openid', openid,'d60');
        Vue.$utils.addCookie('lastVersion', version,'d60');
      }
      resolve();

    });
  }

}
export default install

