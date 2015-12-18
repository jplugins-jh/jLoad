/**
 * @author chenkailun
 * @date 2015-12-17 15:04
 * @discription 该插件用做移动端查询列表时使用，开发者调用时参数传入：发起的请求url，数据data,以及回调函数callback，
 * callback需要返回被放入的jquery实例，例如：$("#"),调用方式为$("xxx").jLoad({url:"xx",data:{}/null,callback:function});
 * callback的返回值需要返回一个json对象,包含一个{retData:"存放需要放入的jquery对象",isEnd："boolean值，true为最后一页"}
 */
(function(window,document,$) {
	$.extend($.fn, {
		jLoad: function(setting) {
			//默认参数
			var jl = {
				doc:$(this),
				
				//滑动：默认开启 , 要默认关闭请取消scoll注释
				//scoll:true,
				
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
				nomore:"没有了"
			}
			
			//参数覆盖
			var jl = $.extend(jl,setting);
			
			//初始化插件需要的dom
			jl.initObjects = function () {
				//加载中对象
				jl.loading = $("<p></p>");
				jl.loading.text(jl.tip);
				jl.loading.css({"text-align":"center","padding":"1em 0"});
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
				console.log("url:"+jl.url);
				console.log(jl.data);
				console.log(jl.callback);
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
						var retData = jl.callback(data);
						
						//返回的对象添加到目标容器
						jl.doc.append(retData.retData);
						
						if(retData.isEnd) {//最后一页
							jl.loading.text(jl.nomore);
							jl.showLoading();
							console.log("最后一页");
						}else{//不是最后一页
							jl.loading.text(jl.loading_text);
							jl.showLoading();
							//重新绑定监听事件
							jl.bindEvent();
							console.log("不是最后一页");
						}
					}
				});
			}
			
			//根据scoll参数设置滚动监听或者点击事件
			jl.bindEvent = function () {
				if(typeof jl.scoll == "undefined" || jl.scoll) {
					jl.bindRoll();
				}else{
					jl.loading.text(jl.click_text);
					jl.bindClick();
				}
			}
			
			//点击加载事件
			jl.click = function () {
				
				console.log("进入点击事件");
				
				//修改加载中文字
				jl.loading.text(jl.loading_text);
				
				//显示加载中
				jl.showLoading();
				
				//解绑事件
				jl.bindClick(false);
				
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
			jl.roll = function () {
				
				var clientHeight = document.documentElement.clientHeight;
				var scrollTop = document.body.scrollTop;
				var scrollHeight = document.body.scrollHeight;
				
				if(clientHeight + scrollTop == scrollHeight){
					
					//显示loading
					jl.showLoading();
					
					//发起请求
					jl.post();
					
					//解绑事件
					jl.bindRoll(false);
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
			
			//初始化jLoad
			jl.init = function() {
				
				//初始化需要的dom
				jl.initObjects();
				
				//绑定事件
				jl.bindEvent();
				
			}
			
			jl.init();
		}
	});
})(this,document,jQuery);