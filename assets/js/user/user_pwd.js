$(function() {
    // 导入 layui 对象：
    var form = layui.form;
    var layer = layui.layer;

    // 定义表单验证：
    form.verify({
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) return '新旧密码不能一样';
        },
        rePwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) return '两次输入的密码不一致';
        }
    });

    // 表单提交重置密码：
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('修改密码失败');
                layer.msg('修改密码成功');
                // 成功后清空表单数据：
                $('.layui-form')[0].reset();
            }
        })
    })
})