/**
 * @author chenkailun
 * @date 2015-12-17 15:04
 */
(function(window,document,$) {
	$.extend($.fn, {
		jLoad: function(setting) {
			//默认参数
			var jl = {
				doc:$(this),
				
				//滚动：默认开启
				scroll:true,
				
				//请求
				//url:"",
				
				//请求post参数
				//data:"",
				
				//请求完成的回调
				//callback:"",
				
				//默认json格式
				dataType:"JSON",
				
				//默认提交方式POST
				type:"POST",
				
				//生成的默认文字
				loading_text:"加载中...",
				click_text:"点击加载更多",
				tip:"loading...",
				tipError:"异常",
				nomore:"没有更多数据了"
			}
			
			//重新加载
			jl.reLoad = function(newData) {
				jl.data = newData;
				jl.doc.empty();
				jl.post();
			}
			
			//参数覆盖
			var jl = $.extend(jl,setting);
			
			//初始化插件需要的dom
			jl.initObjects = function () {
				//加载中对象
				jl.loading = $("<p></p>");
				jl.loading.text(jl.tip);
				jl.loading.css({"text-align":"center","padding":"1em 0"});
				
				//滚动监听锁
				jl.scrollLock = true;
			}
			
			//加载中函数,true表示显示，false不显示
			jl.showLoading = function() {
				if(arguments.length == 0 || (arguments.length == 1 && typeof arguments[0] == "boolean")) {
					if(arguments.length == 0){
						jl.doc.append(jl.loading);
					}else{
						arguments[0] == true ? jl.doc.append(jl.loading):jl.loading.remove();
					}
				}else{
					throw new Error("loading param not right,must be true or false");
				}
			}
			
			//发起ajax请求调用传入回调函数
			jl.post = function() {
				$.ajax({
					url:jl.url,
					type:"POST",
					dataType:jl.dataType,
					data:jl.data,
					error:function(msg) {
						throw new Error(msg);
					},
					success:function(data) {
						//关闭加载
						jl.showLoading(false);
						//调用回调函数
						var retData = jl.callback(data,jl.data);
						//返回的对象添加到目标容器
						jl.doc.append(retData.retData);
						//修改锁为可以使用
						jl.scrollLock = true;
						//刷新返回的data
						jl.data = retData.postData;
						if(retData.isEnd) {//最后一页
							jl.loading.text(jl.nomore);
							jl.showLoading();
						}else{//不是最后一页
							jl.loading.text(jl.loading_text);
							jl.showLoading();
							//重新绑定事件，延时1秒
							jl.bindEvent();
						}
					}
				});
			}
			
			//根据scroll参数设置滚动监听或者点击事件
			jl.bindEvent = function () {
				if(jl.scroll) {
					jl.bindRoll();
				}else{
					jl.loading.text(jl.click_text);
					jl.bindClick();
				}
			}
			
			//点击加载事件
			jl.click = function () {
				
				//去掉点击事件
				jl.bindClick(false);
				
				//修改加载中文字
				jl.loading.text(jl.loading_text);
				
				//显示加载中
				jl.showLoading();
				
				//发起请求
				jl.post();
				
			}
			
			//绑定点击事件
			jl.bindClick = function () {
				if(arguments.length == 0 || (arguments.length == 1 && typeof arguments[0] == "boolean")) {
					
					//事件绑定
					if(arguments.length == 0){
						jl.loading.bind("click", jl.click);
						jl.showLoading();
					}else{
						arguments[0] == true ? jl.loading.bind("click", jl.click):jl.loading.unbind("click",jl.click);
					}
					//事件源显示
					jl.showLoading();
				}else{
					throw("bind roll param not right,must be true or false");
				}
			}
			
			//滑动事件
			jl.roll = function (event) {
				event.cancelBubble = true;
				var clientHeight = document.documentElement.clientHeight;
				var scrollTop = document.body.scrollTop;
				var scrollHeight = document.body.scrollHeight;
				
				if(clientHeight + scrollTop == scrollHeight){
					if(jl.scrollLock) {
						jl.scrollLock = false;
						jl.bindRoll(false);
						//显示loading
						jl.showLoading();
						//发起请求
						jl.post();
					}
				}
			}
			
			
			//绑定与解绑滑动监听事件
			jl.bindRoll = function() {
				if(arguments.length == 0 || (arguments.length == 1 && typeof arguments[0] == "boolean")) {
					if(arguments.length == 0){
						$(window).scroll(jl.roll);
					}else{
						arguments[0] == true ? $(window).scroll(jl.roll):$(window).off("scroll",jl.roll);
					}
				}else{
					throw("bind roll param not right,must be true or false");
				}
			}
			
			//加载一次
			jl.load = function () {
				
				if(jl.scroll) {
					jl.roll();
				}else{
					jl.loading.text(jl.click_text);
					jl.click();
				}
			}
			
			//初始化jLoad
			jl.init = function() {
				
				//初始化需要的dom
				jl.initObjects();
				
				//绑定事件
				jl.bindEvent();
				
				//加载一次数据
				jl.post();
			}
			
			jl.init();
			
			return jl;
		}
	});
})(this,document,jQuery);