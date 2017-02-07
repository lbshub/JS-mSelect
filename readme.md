# JS-mSelect
移动web：日期选择，时间选择，自定义选择...

<img src="https://raw.githubusercontent.com/lbshub/JS-mSelect/master/date.jpg" />


### 使用
引入JS文件 css文件自动加载（默认路径与js文件同目录）
```html
<script type="text/javascript" src="mSelect.js"></script>
```

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
### DEMO
index.html
