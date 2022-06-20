$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义查询参数的对象，将来请求数据的时候，需要将请求参数的对象提交到服务器：
    var q = {
        pagenum: 1, // 页码值，默认展示第一页
        pagesize: 2, // 每页显示多少数据
        cate_id: '', // 文章分类的 id
        state: '' // 文章的发布状态
    }

    // 定义美化时间的过滤器：(需导入 template-web.js 模板引擎 js 文件才可使用)
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补零函数：
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    initTable();
    initCate();

    // 获取文章列表数据的方法:
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章列表失败');
                var htmlStr = template('tpl_table', res);
                $('tbody').html(htmlStr);
                // 列表数据渲染完成之后，就立即渲染分页的数据：并将总数据条数 res.total 传递进去
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类方法;
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取文章分类失败')
                var htmlStr = template('tpl_cate', res);
                $('[name="cate_id"]').html(htmlStr);
                form.render(); // 通过 layui 重新渲染表单区域的 ui 结构
            }
        })
    }

    // 为筛选表单绑定提交事件：
    $('#form_search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选项的值：
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据：
        initTable();
    })

    // 定义渲染分页的方法：
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 5, 7, 10],
            // 当分页被切换的时候，会触发 jump 函数，详见 layui 官网 分页——分页的回调：
            // 触发 jump 回调的方式有两种：
            // 1. 只要点击了页码就会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 值来判断是哪种方式触发的 jump 回调
                // 如果 first 的值为 true，证明是方式 2 触发的，反之为方式 1 触发的
                q.pagenum = obj.curr; // 把最新的所在页码值，赋值给 q
                q.pagesize = obj.limit; // 把最新的条数赋值给 q
                // if (!first) {
                //     initTable();
                // }
                !first && initTable();
            }
        })
    }

    // 通过代理的形式为 .btn_delete 删除按钮绑定点击事件:
    $('tbody').on('click', '.btn_delete', function() {
        var len = $('.btn_delete').length; // 获取当前页面上删除按钮的个数
        var id = $(this).attr('data-id'); // 获取当前按钮的自定义 data-id 属性的值
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除失败');
                    layer.msg('删除成功');
                    // 当数据删除完成后，需要判断此时页面是否还有剩余的数据，如果没有剩余的数据了，则让页码值 -1 
                    // 之后再重新调用 initTable() 方法
                    // 如果 len 的值等于了 1 ，证明删除后该页没有数据了，并且页码值最小必须是 1 
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })


})