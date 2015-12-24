# jLoad
##使用方法 :
```javascript
//javascript
//$("#xxx") 为想要放入的容器
$("#xxx").jLoad({
  url:'xxx.html', //请求
  data:{},//ajax的data
  //scroll 可选参数，true或者不填为监听滚动到底部时发起请求，false则为底部的点击加载更多发起请求
  scroll:false,
  //回调函数的两个参数：data是发起ajax请求返回的data，postData为ajax请求的data，也就是上一行的data
  callback:function(data,postData){
    //返回对象(可以为任意名字)
    var retData = {};
    //返回对象必须包含三个参数
    //retData 生成的dom对象
    retData.retData = $('<div>这是dom对象</div>');
    //isEnd 是否是最后一页，根据自己系统的情况判断
    retData.isEnd = true;
    //postData  callback传入的postData，目的是为了让用户处理该数据的页码，然后再丢给插件，下次请求时就是用该对象做查询
    //例如我项目中的当前页字段为p，在该回调中我改变postData.p的值为 postData.p++
    retData.postData = postData;
    //最后返回完整对象
    return retData;
  }
});
```
jLoad还会返回jLoad所包含的一个全局对象，该对象可以调用重新加载的方法来重新刷新当前页面
```javascript
var jload = $("#xxx").jLoad({...});
//data为新的json查询数据，目的是做列表删选时使用
jload.reload(data);
```

