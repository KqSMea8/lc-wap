/**
 * 内部统计
 */

'use strict'

const env = process.env.NODE_ENV;
const isDev=(env === 'development');

const platform=getPlatform();

function getPlatform() {
    const userAgentInfo = navigator.userAgent;
    const Agents = ["Android","iPhone"];

    let platform='';
    for (let i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
                platform=Agents[i];
            break;
        }
    }

    return platform;
}


const install = function (Vue) {
    
    Vue.$statistics= Vue.prototype.$statistics = async function (path) {
        if(!isDev){
            let cache=Vue.$cache,
                data = {
                    content: {
                        entrance:'WEB',
                        platform:platform,
                        pageId: path||'',
                        mbeId:cache.user.memberId||'',
                        ip:returnCitySN.cip||'',
                        lat:cache.location.lat||'',
                        lng:cache.location.lng||'',
                        isLogin:'',
                        isCommon:'true',
                        networkWay:'',
                        deviceId:'',
                        operator:'',
                        sysVersion:'',
                        appVersion:'',
                        machineType:''
                    }
                };
            let res = await Vue.$post('/CRM/appothers/commonApi.json', data);
        }
    }
}
export default install
// module.exports = {
//     install
// };






