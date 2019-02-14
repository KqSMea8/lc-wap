'use strict'

import axios from 'axios'
import MD5 from 'js-md5'

const env = process.env.NODE_ENV;
const isDev=(env === 'development' || location.host === 'ceshi.lechengclub.com');

const install = function (Vue) {
    let httpArr = [];

    axios.interceptors.request.use(config => {
        return config
    }, error => {
        return Promise.reject(error)
    })

    axios.interceptors.response.use(response => {
        return response
    }, error => {
        return Promise.resolve(error.response)
    })

    

    function checkStatus(response) {
        // 如果http状态码正常，则直接返回数据
        if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
            
            // let serverDate=response.headers.date,
             let  resData=response.data;
            // resData.serverDate=serverDate;

            return resData
        }
        // 异常状态下，把错误信息返回去
        return {
            status: -404,
            msg: '网络异常'
        }
    }

    function checkCode(res,popup) {
        // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
        if (res.status === -404) {
            Vue.$toast(res.msg);
        }
        if (res.errcode && res.errcode != 0) {
            let msg = res.msg;
            if (msg == 'fail') { msg = '今日抽奖次数已送完'; }
            if(!popup){
                Vue.$toast(msg ? msg : ('错误：' + res.errcode));
            }
            
        }
        if(res.errcode==1004){
            Vue.$router.push(isWechat?'/signUp':'/h5signUp')
        }

        httpArr.pop();
        if (httpArr.length === 0) { Vue.$indicator.close(); }

        return res
    }

    Vue.$post = Vue.prototype.$post = function (url, data, popup) {
        
        if (httpArr.length === 0) { Vue.$indicator.open(); }
        httpArr.push(1);
        if((url.startsWith('/CRM')||url.startsWith('/couponSys'))&&(data&&Object.keys(data).indexOf('sign')==-1)){
            var signData=Vue.$sign(data,'addkey');
        }

        // if(url.includes('/mall29')&&location.host.includes('ceshi')){
        //     var myurl='https://www.lechengclub.com'+url
        // }else{
        //     var myurl=url
        // }

        return axios({
            method: 'post',
            url:url,
            data: JSON.stringify(signData||data),
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).then(
            (res) => {
                return checkCode(res,popup)
            })
    }


    Vue.$get = Vue.prototype.$get = function (url, params) {
        if (httpArr.length === 0) { Vue.$indicator.open(); }
        httpArr.push(1);
        
        return axios({
            method: 'get',
            url:url,
            params, // get 请求时带的参数
            timeout: 10000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).then(
            (res) => {
                return checkCode(res)
            })
    }

    Vue.$postForm = Vue.prototype.$postForm = function (url, data) {
        if (httpArr.length === 0) { Vue.$indicator.open(); }
        httpArr.push(1);

        return axios({
            method: 'post',
            url:url,
            data: data,
            timeout: 100000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(
            (response) => {
                return checkStatus(response)
            }).then(
            (res) => {
                return checkCode(res)
            })
    }

}

export default install
// module.exports = {
//     install
// };
