$(function() {
    // 从 layui 中获取对象：
    var form = layui.form;
    var layer = layui.layer;

    // 通过 form.verify() 函数自定义校验规则：
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '昵称长度必须在 1 ~ 6 个字符之间';
        }
    });

    initUserInfo();


    // 初始化用户的基本信息;
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败');
                // 如果获取信息成功了，就把用户的信息通过 form.val 方法快速给表单赋值：
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置事件：
    $('#btnReset').on('click', function(e) {
        e.preventDefault(); // 阻止重置按钮的默认重置行为
        initUserInfo(); // 用户点击重置之后，重新初始化用户的基本信息即可
    });

    // 更新用户的基本信息:(监听表单的提交事件)
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('信息修改失败');
                layer.msg('信息修改成功');
                // 立即重新渲染用户的头像和用户信息：
                window.parent.location.reload();
            }
        })
    })
})