$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 获取文章分类的列表：
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl_table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 点击添加按钮弹出添加层：
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog_add').html()
        })
    })

    // 通过代理的形式，为 form_add 添加提交事件：
    $('body').on('submit', '#form_add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form_add').serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('添加失败');
                initArtCateList();
                layer.msg('添加成功！');
                // 根据索引关闭对应的弹出层（详见 layui 官网）
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式，为 btn_edit 编辑按钮添加点击事件：
    var indexEdit = null;
    $('tbody').on('click', '#btn_edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog_edit').html()
        })

        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form_edit', res.data);
            }
        })
    })

    // 通过代理的形式，为 form_edit 添加提交事件：
    $('body').on('submit', '#form_edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('更新分类信息失败');
                layer.msg('更新分类信息成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    // 通过代理的形式，为 btn_delete 删除按钮添加点击事件：
    $('tbody').on('click', '#btn_delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除失败');
                    layer.msg('删除成功');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})