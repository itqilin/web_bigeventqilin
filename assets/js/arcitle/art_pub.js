$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法：
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败');
                var htmlStr = template('tpl_cate', res);
                $('[name="cate_id"]').html(htmlStr);
                form.render(); // 一定要记得调用 form.render() 方法
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面按钮绑定点击事件：
    $('#btnChooseImage').on('click', () => {
        $('#coverFile').click();
    })

    // 监听文件选择的 change 事件：
    $('#coverFile').on('change', e => {
        var Files = e.target.files; // 获取到文件的列表数组
        if (Files.length === 0) return; // 判断用户是否选择了文件
        // 如果用户选择了文件，就拿到用户选择的文件：
        var file = e.target.files[0];
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态：
    var act_state = '已发布';
    // 当用户点击了存为草稿按钮，就让 act_state 的值为 ‘草稿’
    $('#btnSave2').on('click', () => {
        act_state = '草稿';
    })

    // 为表单绑定 submit 提交事件：
    $('#form_pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为：
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象：
        var fd = new FormData($(this)[0]); // 记得要将 jQuery 对象转换为 DOM 对象
        // 3. 将文章的发布状态 state 存到 fd 中：
        fd.append('state', act_state);
        // 4. 将裁剪过后的图片，输出为一个文件对象：
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象储存到 fd 中：
                fd.append('cover_img', blob);
                // 6. 发起 ajax 数据请求：
                publishArticle(fd);
            });
    })

    // 发布文章的方法：
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: res => {
                if (res.status !== 0) return layer.msg('发布文章失败');
                location.assign('/article/art_list.html');
                layer.msg('发布文章成功！');
            }
        })
    }
})