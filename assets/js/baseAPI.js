// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给 ajax 提供的配置对象：
$.ajaxPrefilter(function(options) {
    // 在发起真正的 ajax 请求之前，统一拼接请求的路径：
    options.url = 'http://www.liulongbin.top:3007' + options.url;

    // 统一为有权限的接口，设置 header 请求头：
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };

    // 全局统一挂载 complete 回调函数：不论身份认证成功还是失败，都会执行 complete 回调函数
    options.complete = function(res) {
        // 在 complete 函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据：
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token'); // 强制清空token
            location.href = '/login.html'; // 强制跳转到登录页面
        }
    }
})