// vue.config.js
module.exports = {
    // options...

    // 项目部署的基础路径
    // 我们默认假设你的应用将会部署在域名的根部，
    // 比如 https://www.my-app.com/
    // 如果你的应用时部署在一个子路径下，那么你需要在这里
    // 指定子路径。比如，如果你的应用部署在
    // https://www.foobar.com/my-app/
    // 那么将这个值改为 `/my-app/`
    publicPath: '/unionManagement',

    // 打包输出位置
    outputDir: 'dist',

    // 相对于outputDir放置静态资源的地方 (js/css/img/font/...)
    assetsDir: '',

    //指定生成index.html的路径(相对于outputDir)
    indexPath:'index.html',

    //生成的文件内对文件名的描述是否携带hash值
    //一般情况下使用hash值提高性能
    filenameHashing:true,

    //多页应用配置
    // pages: {
    //     index: {
    //       // 入口文件
    //       entry: 'src/index/main.js',/*这个是根入口文件*/
    //       // 模板文件
    //       template: 'public/index.html',
    //       // 输出文件
    //       filename: 'index.html',
    //       // 页面title
    //       // 模板文件的title标签应该是 <title><%= htmlWebpackPlugin.options.title %></title>
    //       title: 'Index Page',
    //       // chunks to include on this page, by default includes
    //       // extracted common chunks and vendor chunks.
    //       chunks: ['chunk-vendors', 'chunk-common', 'index']
    //     },
    //     //简写格式
    //     //模板文件默认是 `public/subpage.html`
    //     //如果不存在，就是 `public/index.html`.
    //     //输出文件默认是 `subpage.html`.
    //     subpage: 'src/subpage/main.js' /*注意这个是*/
    //   }

    // 是否在保存的时候使用 `eslint-loader` 进行检查。
    // 有效的值： boolean | 'warning' | 'default' | 'error'
    // 当设置为 `"error"` 时，检查出的错误会触发编译失败。
    lintOnSave: 'default',


    //runtime-only比runtime-compiler更快,这里false就行了
    runtimeCompiler:false,

    //是否需要babel转译node_modules中的依赖项
    transpileDependencies:[],

    // 是否为生产环境构建生成 source map？
    productionSourceMap: true,

    //设置生成的 HTML 中 <script> 和 <link rel="stylesheet"> 标签的 crossorigin 属性。
    //anonymous	对此元素的 CORS 请求将不设置凭据标志。即，不进行安全验证。
    //use-credentials	对此元素的CORS请求将设置凭证标志；这意味着请求将提供凭据进行验证
    //""	设置一个空的值，如 crossorigin 或 crossorigin=""，和设置 anonymous 的效果一样。
    //crossorigin:'anonymous',

    //设置true会在生成的HTML中启用<link rel="stylesheet">和<script>标签的Subresource Integrity (SRI)  
    //如果你通过CDN方式构建，建议开启他增加安全性
    integrity:false,

    //webPack配置
    // configureWebpack:config => {
    //     if (process.env.NODE_ENV === "production") {
    //         // 为生产环境修改配置...
    //         config.mode = "production";
    //     } else {
    //         // 为开发环境修改配置...
    //         config.mode = "development";
    //     }
    // }
     
    //webPack高级配置
    // chainWebpack: config => {
    //     config.module
    //     .rule('vue')
    //     .use('vue-loader')
    //     .loader('vue-loader')
    //     .tap(options => {
    //         // 修改它的选项...
    //         return options
    //     })
    // }

    css:{
        //是否将组件中的CSS提取到独立的CSS文件中（而不是内联到JavaScript中并动态注入）。(默认生产环境true，开发环境false,一般不用设置自动就好)
        //extract:true,

        //用于设定，是否只有 *.module.[ext] 结尾的文件才会被视作CSS Modules 模块。
        //默认情况下，只有文件名中含有.modules的CSS相关文件还能使用CSS Modules。
        requireModuleExtension:true,

        //是否为CSS启用源映射。将此设置为true可能会影响构建性能
        sourceMap:false,

        //将选项传递给与CSS相关的加载程序。（chainWebpack也可以配置，但推荐用这里的）
        // loaderOptions: {
        //     css: {
        //       // options here will be passed to css-loader
        //     },
        //     postcss: {
        //       // options here will be passed to postcss-loader
        //     }
    },


    //如果前端应用程序和后端API服务器未在同一主机上运行，​​则在开发过程中需要将API请求代理到API服务器。可以通过devServer.proxy选项进行配置

    //简单配置
    //服务器会将任何未知请求 (没有匹配到静态文件的请求) 代理到http://localhost:4000上
    // devServer: {
    //     proxy: 'http://localhost:4000'
    // }


    //详细配置
    devServer:{
        //请求到 /api/xxx 现在会被代理到请求 http://localhost:3000/api/xxx, 例如 /api/user 现在会被代理到请求 http://localhost:3000/api/user
        // proxy:{
        //     '/api': 'http://localhost:3000'
        // },

        //代理多个上下文路径
        // proxy: {
        //     context: ['/auth', '/api'],
        //     target: 'http://localhost:3000',
        // },

        proxy:{
            '/api':{
                target: 'http://localhost:8081/unionManagementApi',//代理地址，这里设置的地址会代替axios中设置的baseURL
                // target: 'http://112.86.129.73:2000/api',//代理地址，这里设置的地址会代替axios中设置的baseURL
                changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
                ws: true, // proxy websockets
                secure: false, //忽略https安全提示
                //xfwd：false, //添加x-forward标头
                //pathRewrite方法重写url
                pathRewrite: {
                    '^/api': ''//重写之后url为 http://localhost:8080/xxxx
                } 
                //pathRewrite: {'^/api': '/api'} //重写之后url为 http://localhost:8080/api/xxxx
            },
            '/imgocr':{
                target: 'http://1001.jzzlkj.top:81/imgocr',//代理地址，这里设置的地址会代替axios中设置的baseURL
                changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
                ws: true, // proxy websockets
                secure: false, //忽略https安全提示
                //xfwd：false, //添加x-forward标头
                //pathRewrite方法重写url
                pathRewrite: {
                    '^/imgocr': ''//重写之后url为 http://localhost:8080/xxxx
                } 
                //pathRewrite: {'^/api': '/api'} //重写之后url为 http://localhost:8080/api/xxxx
            }
        }
    },

    //插件配置
    pluginOptions: {
       
        
    }

}