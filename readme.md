# JS-mSelect
移动web：日期选择，时间选择，自定义选择...

<img src="https://raw.githubusercontent.com/lbshub/JS-mSelect/master/date.jpg" />


### 使用

##### 日期选择 
```js
var date = document.querySelector('.date');
var ds = new mSelect({
    mode: 'date',
    title: '选择日期',
    select: function(arr) {
        date.innerHTML = arr.join('-');
    }
});
date.addEventListener('click', function() {
    ds.show();
});
```
##### 时间选择 
```js
var time = document.querySelector('.time');
var ts = new mSelect({
    mode: 'time',
    select: function(arr) {
        // time.innerHTML = arr.join(':');
        time.innerHTML = arr[0] + ':' + (arr[1] > 10 ? arr[1] : '0' + arr[1]);
    }
});
time.addEventListener('click', function() {
    ts.show();
});
```
##### 自定义选择 
```js
var allData = [{
    list: ['你', '我', '他', '你们', '我们', '他们']
}, {
    list: ['是', '不是', '应该是', '一定是']
}, {
    list: ['大', '小']
}, {
    list: ['混蛋', '傻瓜', '白痴']
}];
var all = document.querySelector('.all');
var ms = new mSelect({
    data: allData,
    select: function(arr) {
        all.innerHTML = arr.join('');
    }
});
all.addEventListener('click', function() {
    ms.show();
});
```

### 选项 | 方法
* ===================================================
* *选项 属性*
* opts.mode 自带数据模式 可选('date'--日期  'time'--时间)
* opts.data 数据列表 
	日期模式提供自带日期列表数据
	时间模式提供自带时间列表数据
	如未设置模式选项 则必须提供数据
* opts.align 对齐方式 可选('top' 'center' 'bottom') 
	 如未设置对齐选项
	 日期模式下对齐到当前年月日
	 时间模式下对齐到当前小时分钟
	 其他默认对齐'top'
* opts.title UI标题文本
* opts.cssUrl 对应的css文件路径 方便更换UI皮肤
	默认与mSelect.js同路径目录 ('mSelect.js' || 'mSelect.css')
* opts.parent UI插入到哪里 默认 body
* opts.boxClass 半透明标签的类名 默认'mSelect-box'
* opts.containerClass 实际包裹容器标签类名 默认'mSelect-container'
* opts.headClass 头部标签类名 默认'mSelect-head'
* opts.contentClass 中间内容标签类名 默认'mSelect-content'
* opts.wrapperClass 每项包裹标签类名 默认'mSelect-wrapper'
* opts.scrollerClass 每项滚动标签类名 默认'mSelect-scroller'
* opts.suffixClass 每项修饰词标签类名 默认'mSelect-suffix'
* opts.maskClass 每项渐变标签类名 默认'mSelect-mask'
* opts.footClass 底部标签类名 默认'mSelect-foot'
* opts.defineClass 确定按钮标签类名 默认'mSelect-define'
* opts.cancelClass 取消按钮标签类名 默认'mSelect-cancel'
* ****************************************************
* *选项 方法*
* opts.select 点击确定后执行函数
* ===================================================
* *实例 方法*
* this.show 显示方法
* this.hide 隐藏方法

### DEMO
index.html
