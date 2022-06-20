$(function() {
    // 调用 getUserInfo 获取用户的基本信息：
    getUserInfo();

    var layer = layui.layer; // 获取 layui 中的layer对象
    // 退出功能：
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // 确定退出之后，需要清空本地缓存中的 token 并跳转到 login.html
            localStorage.removeItem('token');
            location.href = '/login.html';

            // 关闭询问框
            layer.close(index);
        });
    })


    // 获取用户的基本信息：
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers 就是请求头配置对象：
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取用户信息失败');
                // 获取用户信息成功后，就渲染用户的头像 昵称：
                renderAvatar(res.data);
            },
            // // 不论成功还是失败，都会执行 complete 回调函数：
            // complete: function(res) {
            //     // 在 complete 函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据：
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         localStorage.removeItem('token'); // 强制清空token
            //         location.href = '/login.html'; // 强制跳转到登录页面
            //     }
            // }
        })
    };
    // 渲染用户的头像：
    function renderAvatar(user) {
        // 获取用户的名称
        var username = user.nickname || user.username;
        if (user.user_pic !== null) {
            // 渲染图片头像
            // $('.text_portrait').hide();
            // $('.layui-nav-img').prop('src', user.user_pic).show();
            var htmlStrTop = `<img src="${user.user_pic}" class="layui-nav-img"> 个人中心`;
            var htmlStrLeft = `<img src="${user.user_pic}" class="layui-nav-img"> <span class="welcome">${'欢迎 &nbsp&nbsp' + username}</span>`
                // 设置欢迎的文本
                // $('.welcome').html('欢迎 ' + username);
            $('.user_portrait_top').html(htmlStrTop);
            $('.user_portrait_left').html(htmlStrLeft);
        } else {
            // 渲染文本头像
            // $('.layui-nav-img').hide();
            var first = username[0].toUpperCase();
            // $('.text_portrait').html(first).show();
            var htmlStrTop2 = `<span class="text_portrait">${first}</span> 个人中心`;
            var htmlStrLeft2 = `<span class="text_portrait">${first}</span><span class="welcome">${'欢迎&nbsp&nbsp' + username}</span>`;
            $('.user_portrait_top').html(htmlStrTop2);
            $('.user_portrait_left').html(htmlStrLeft2);
        }
    }
})