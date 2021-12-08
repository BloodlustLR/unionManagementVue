import axios from 'axios';

//创建一个axios对象
const instance = axios.create({
    baseURL:'/api',
    timeout:300000,
    //表示跨域请求时是否需要使用凭证
    withCredentials: false, // default
    //表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    responseType: 'json', // default
    //响应编码
    //Note: Ignored for `responseType` of 'stream' or client-side requests
    responseEncoding: 'utf8', // default
    //xsrf token 的值的cookie的名称
    xsrfCookieName: 'XSRF-TOKEN', // default
    //the name of the http header that carries the xsrf token value
    xsrfHeaderName: 'X-XSRF-TOKEN', // default
    // `onUploadProgress` 允许为上传处理进度事件
    onUploadProgress: function (progressEvent) {
        // Do whatever you want with the native progress event
    },
    // `onDownloadProgress` 允许为下载处理进度事件
    onDownloadProgress: function (progressEvent) {
        // 对原生进度事件的处理
    },
})

//请求拦截
//所有的网络请求都会先走这个方法
instance.interceptors.request.use(
    function(config){
        console.group('全局请求拦截')
        console.log(config);
        console.groupEnd();
        return config;
    },
    function(err){
        return Promise.reject(err);
    }
)

//响应拦截
//所有的网络请求返回数据之后都会先执行此方法
//可以根据服务器的返回状态码做相应的处理
instance.interceptors.response.use(
    function(response){
        console.group('全局响应拦截')
        console.log(response);
        console.groupEnd();
        return response.data;
    },
    function(err){
        return Promise.reject(err);
    }
)

const _axios = {
    /**
         * 一般Get请求
         * @param {*} url 请求路径
         * @param {*} params 请求参数
         * @returns 
         */
    get(url,params){
        return instance.get(url,{
            params:params
        });
    },

    /**
     * 一般Post请求
     * @param {*} url 请求路径
     * @param {*} params 请求参数
     * @returns 
     */
    post(url,data){
        return instance.post(url,data,{
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });
    },

    /**
     * 带进度事件的Post请求
     * @param {*} url 请求路径
     * @param {*} params 请求参数
     * @param {*} uploadCallBack 上传事件
     * @param {*} downloadCallBack 下载事件
     * @returns 
     */
    postProgress(url,data,uploadCallBack,downloadCallBack){
        return instance.post(url,data,{
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            onUploadProgress: function (progressEvent) {
                if(uploadCallBack!=null&&uploadCallBack!=undefined){
                    uploadCallBack(progressEvent);
                }
                // Do whatever you want with the native progress event
            },
            onDownloadProgress: function (progressEvent) {
                // 对原生进度事件的处理
                if(downloadCallBack!=null&&downloadCallBack!=undefined){
                    downloadCallBack(progressEvent)
                }
            },
        });
    },

    /**
     * 提交表格的Post请求
     * @param {*} url 请求路径
     * @param {*} params 请求参数
     * @returns 
     */
    postForm(url,data){
        let param = new FormData();
        for(let key in data){
            param.append(key,data[key]);
            console.log(key,param.get(key))
        }
        return instance.post(url,param,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    /**
     * 带进度事件提交表格的Post请求
     * @param {*} url 请求路径
     * @param {*} params 请求参数
     * @param {*} uploadCallBack 上传事件
     * @param {*} downloadCallBack 下载事件
     * @returns 
     */
    postFormProgress(url,data,uploadCallBack,downloadCallBack){
        let formData = new FormData();
        for(let key in data){
            formData.append(key,data[key]);
        }
        return instance.post(url,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: function (progressEvent) {
                if(uploadCallBack!=null&&uploadCallBack!=undefined){
                    uploadCallBack(progressEvent);
                }
                // Do whatever you want with the native progress event
            },
            onDownloadProgress: function (progressEvent) {
                // 对原生进度事件的处理
                if(downloadCallBack!=null&&downloadCallBack!=undefined){
                    downloadCallBack(progressEvent)
                }
            }
        });
    },

    /**
     * x-www-form-urlencoded的Post请求
     * @param {*} url 请求路径
     * @param {*} params 请求参数
     * @returns 
     */
    postFormUrlEncoded(url,data){
        let params = new URLSearchParams();
        for(let index in data){
            params.append(index,data[index]);
        }
        return instance.post(url,params,{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },

    /**
     * 获取文件blob
     * @param {*} url 
     * @param {*} params 
     * @returns 
     */
    async getBlob(url,params){
        let blob;
        await instance.get(url,{
            headers:{
                'Cache-Control': 'no-cache'
            },
            responseType: 'blob',
            params:params
        }).then(res=>{
            blob = new Blob([res],{type:res.type});
        });
        return blob;
    },

    /**
     * 获取文件
     * @param {*} url 
     * @param {*} params 
     * @returns 
     */
    async getFile(fileName,url,params){
        let file;
        await instance.get(url,{
            headers:{
                'Cache-Control': 'no-cache'
            },
            responseType: 'blob',
            params:params,
        }).then(res=>{
            let blob = new Blob([res],{type:res.type});
            file = new File([blob],fileName,{type:res.type});
        });
        return file;
    },

    /**
     * 下载文件
     * @param {*} url 文件URL
     */
    download(fileName,url,params){
        instance.get(url,{
            headers:{
                'Cache-Control': 'no-cache'
            },
            responseType: 'blob',
            params:params
        }).then(res=>{
            let blob = new Blob([res],{type:res.type});
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放blob对象
        });
    }
}

const _default = {
    install:function(App, options) {
        App.config.globalProperties.$request = _axios;
    }
}

export default _default;