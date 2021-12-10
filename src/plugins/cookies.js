import Cookies from 'js-cookie'

const _default = {
    install:function(App, options) {
        App.config.globalProperties.$cookies = Cookies;
    }
}

export default _default;