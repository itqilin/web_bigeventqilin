$(function() {
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    $('#link_login').on('click', function() {
        $('.login_box').show();
        $('.reg_box').hide();
    });

    // 只要导入了 layui.all.js 文件，就可以从 layui 中获取对象：
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则：
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'], // 自定义了一个叫做 pwd 校验规则
        repwd: function(vlaue) {
            // 通过形参拿到的是确认密码框中的内容
            // 拿到密码框中的内容，和确认密码框内容进行 if 判断，如果不相等，则返回一个错误提示
            var pwd = $('.reg_box [name="password"]').val();
            if (pwd !== vlaue) return '两次密码不一致';
        }
    });

    // 监听注册表单的提交事件：
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        // 发起 POST 请求：
        var data = {
            username: $('#form_reg [name="username"]').val(),
            password: $('#form_reg [name="password"]').val()
        }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) return layer.msg(res.message);
            layer.msg('注册成功，请登录');
            // 注册成功后，自动跳转登录页面：
            $('#link_login').click();
        })
    });

    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(), // 获取表单所有数据
            success: function(res) {
                if (res.status !== 0) return layer.msg('登录失败');
                layer.msg('登录成功！');
                // 登录成功得到 token 中的字符串， 保存到本地存储中：
                localStorage.setItem('token', res.token);
                // 登录成功跳转到后台主页：
                location.href = '/index.html';
            }
        })
    })
})