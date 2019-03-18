## vue-modal

    移动端基于Vue包括Alert、Confirm、Toast、Loading、Notify、Prompt、modalLayer 弹框

### Alert

![modal-alert]()

```javascript  

this.$modal.alert({
    mes: '消息一出，休想滚动屏幕[移动终端]！',
    callback: function(){}
});

```
#### alertProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| mes		|[String]   弹出的消息内容，支持Html |
| icon      |[String]， 图标CLASS |
| stylename      |[String]， 弹出框增加样式名称，用于个性化更改样式 |
| btntxt      |[String]， 按钮文字 |
| callback      |[Function]， 点击确定按钮回调 |


### Confirm

![modal-confirm]()

```javascript

//普通调用方式
this.$modal.confirm({
    title: '选填标题',
    mes: '我有一个小毛驴我从来也不骑！',
    opts: function(){}
});

//更换按钮名称
this.$modal.confirm({
    title: '选填标题',
    mes: '我有一个小毛驴我从来也不骑！',
    opts: [
        {txt: '不看了',class: '.btnclass',callback: function() {}},
        {txt: '好，提交了',class: '.btnclass',callback: function() {}}
    ]
});

```

#### confirmProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| title		|[String]   确认框的标题 |
| close		|[Boolean]   右上角显示关闭按钮，默认False |
| stylename      |[String]， 弹出框增加样式名称，用于个性化更改样式 |
| opts      |[Array, Function]， 当为 Function 时，点击确定按钮的回调方法，当为数组的时候，可一修改底部的按钮名称： {txt: '不看了',class: '.btnclass',callback: function() {}},  |


### Toast

![modal-toast]()

```javascript
    //一般的Toast
    this.$modal.toast({mes: '这是一个toast.'})
    //成功的Toast
    this.$modal.toast({
        mes: '提交保存成功',
        timeout: 1500,
        icon: 'success',
        callback: functon(){}
    });
    //失败的Toast
    this.$modal.toast({
        mes: '失败了',
        icon: 'error',
    });

```

#### toastProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| mes		|[String]   弹出的消息内容 |
| icon      |[String]， 可选：success、error, 默认无|
| styleclass      |[String]， 弹出框增加样式名称，用于个性化更改样式 |
| timeout      |[String]， n 秒后消失 |
| callback      |[Function]， 消失后的回调方法 |



### Loading

![modal-loading]()

```javascript
    //打开loading
    this.$modal.loading.open({title: "很多加载", icon: 1});

    //pade-loading
    this.$modal.loading.open({type: 2, icon: 2});
    
    //关闭loading
    this.$modal.loading.close();

```

#### loadingProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| type		|[String]   1: 普通的loading, 2: page-loading |
| icon      |[String]， 1 ~ 4 种不同的loading图标 |
| title      |[String]， loading图标下的文案 |


### Notify

![modal-notify]()

```javascript
    this.$modal.notify({
        mes: '5秒后自动消失，点我也可以消失！',
        timeout: 5000,
        callback: function() {
            console.log('我走咯！');
        }
    });

```

#### loadingProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| mes		    |[String]   内容 |
| timeout      |[Number]， n 秒后消失 |
| callback      |[Function]， 消失后的回调 |



### Prompt

![modal-prompt]()

```javascript
    this.$modal.prompt({
        title: "输入",
        placeholder: "请输入****",
        content: '这里是内容',
        maxlength: 500,
        callback: function(data) {
            console.log(data);
        }
    });
```

#### loadingProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| title		    |[String]   弹框标题 |
| placeholder      |[String]， textarea文本框描述 |
| content      |[String]， textarea文本框默认内容 |
| maxlength      |[Number]， textarea文本框最大字数 |
| callback      |[Function]， 提交后的回调 |



### ModalLayer

![ModalLayer]()

```html
    <modal-layer title="modaltitle" stylename="stylename">
        <div slot='body'>这是body</div>
        <div slot="foot">这是foot</div>
    </modal-layer>
```
#### ModalLayerProps 参数
| 参数        	| 说明           |
| ------------- |-------------|
| title		    |[String]   标题 |
| stylename      |[String]， 样式名称 |
