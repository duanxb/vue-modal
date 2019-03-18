(function(doc, win){

	var pageScroll = function () {
        var fn = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        var islock = false;

        return {
            lock: function () {
                if (islock)return;
                islock = true;
                doc.body.style.overflow = 'hidden';
                doc.addEventListener('touchmove', fn, false);
            },
            unlock: function () {
                islock = false;
                doc.body.style.overflow = '';
                doc.removeEventListener('touchmove', fn, false);
            }
        };
    }();

    /*初始化js/CSS文件方法*/
    var dynamicLoading = {
	  	css: function(path){
			if(!path || path.length === 0){
			  throw new Error('argument "path" is required !');
			}
		 	var head = document.getElementsByTagName('head')[0];
		    var link = document.createElement('link');
		    link.href = path;
		    link.rel = 'stylesheet';
		    link.type = 'text/css';
		    head.appendChild(link);
	  	},
	  	js: function(path){
			if(!path || path.length === 0){
			  throw new Error('argument "path" is required !');
			}
			var head = document.getElementsByTagName('head')[0];
		    var script = document.createElement('script');
		    script.src = path;
		    script.type = 'text/javascript';
		    head.appendChild(script);
	  	}
	}
	dynamicLoading.css("/plugins/modal/css/modal.min.css?ver=" + Math.random());

    var MODAL = {};
    /*==============================================ModalConfirm============================================*/
    /*
    	调用方式
		this.$modal.confirm({
            title: '选填标题',
            mes: '我有一个小毛驴我从来也不骑！',
            opts: function(){}
        });
        this.$modal.confirm({
            title: '选填标题',
            mes: '我有一个小毛驴我从来也不骑！',
            opts: [{txt: '取消',class: '.btnclass',callback: function() {}]
        });
    */ 
	!function () {
			var ModalConfirm = Vue.component('modal-confirm', {
				template: '<div class="modal-wrap">\
								<div class="modal-confirm" :class="stylename">\
									<i class="iconfont modal-close" v-if="close === true" @click.stop="closeConfirm()"></i>\
									<div class="modal-title" v-show="title" v-html="title"></div>\
									<div class="modal-inner" v-html="mes"></div>\
									<template v-if="typeof opts == \'function\'">\
									<div class="modal-button-group">\
										<button type="button" class="modal-button" @click.stop="closeConfirm()">取消</button>\
										<button type="button" class="modal-button" @click.stop="closeConfirm(opts)">确认</button>\
									</div>\
									</template>\
									<template v-else>\
									<div class="modal-button-group">\
										<button type="button" class="modal-button" :class="item.class" :key="key" v-for="item, key in opts" @click.stop="closeConfirm(item.callback)">{{item.txt}}</button>\
									</div>\
									</template>\
								</div>\
							</div>',
				props: {
			        title: String,
					mes: String,
					close: {
						type: Boolean,
						default: false
					},
					stylename: String,
			        opts: {
			            type: [Array, Function],
			            default: function() {}
			        }
			    },

			})
			var ConfirmConstructor = Vue.extend(ModalConfirm);

			var instance = new ConfirmConstructor({
			    el: document.createElement('div')
			});
			var hashChange = function () {
			   pageScroll.unlock();
			    var el = instance.$el;
			    el.parentNode && el.parentNode.removeChild(el);
			};
			ConfirmConstructor.prototype.closeConfirm = function (callback) {
			    if(typeof callback === 'function') {
			        stopClose = callback();
			    }
			    pageScroll.unlock();

			    var el = instance.$el;
			    el.parentNode && el.parentNode.removeChild(el);

			    window.removeEventListener("hashchange", hashChange);
			};

			MODAL.Confirm = function(options){
			    instance.mes = options.mes || '';
			    instance.title = options.title;
				instance.opts = options.opts;
				instance.close = options.close;
				instance.stylename = options.stylename || '';
			    window.addEventListener("hashchange", hashChange);

			    document.body.appendChild(instance.$el);

			    pageScroll.lock();
			};
	}();


	/*==============================================ModalToast============================================*/
    /*
    	调用方式
		this.$modal.toast({
            mes: '鼠标不错哟！',
            timeout: 1500,
            icon: 'success',
            callback: functon(){}
        });
    */ 
    !function () {

    	var ModalToast = Vue.component('modal-toast', {
				template: '<div class="modal-wrap" :class="{modalToastNoIcon: !icon}">\
								<div class="modal-toast" :class="modalClass">\
									<i v-if="icon" class="iconfont" :class="iconsClass"></i>\
									<span class="modal-toast-text" v-html="mes"></span>\
								</div>\
							</div>',
				props: {
		            mes: String,
					icon: String,
					styleclass: String,
		            timeout: Number,
		            callback: Function
		        },
		        computed: {
		            iconsClass: function() {
		                var _icon = '';
		                if (this.icon === 'success' || this.icon === 'error') {
		                    _icon = 'modal-' + this.icon;
		                }
		                return _icon;
		            },
		            modalClass: function(){
		            	var _pre = 'modal-toast-';
		            	if(this.styleclass){
		            		return _pre + this.styleclass;
		            	}
		            }
		        }

			})

			var ToastConstructor = Vue.extend(ModalToast);

			var instance = new ToastConstructor({
			    el: document.createElement('div')
			});

			ToastConstructor.prototype.closeToast = function () {
			    var el = instance.$el;
			    el.parentNode && el.parentNode.removeChild(el);

			    pageScroll.unlock();

			    typeof this.callback === 'function' && this.callback();
			};

			MODAL.Toast = function(options) {
			    instance.mes = options.mes;
				instance.icon = options.icon;
				instance.styleclass = options.styleclass;
			    instance.timeout = ~~options.timeout || 2000;
			    instance.callback = options.callback;

			    document.body.appendChild(instance.$el);

				pageScroll.lock();
				
				if(instance.timeout != -1) {
					var timer = setTimeout(function() {
						clearTimeout(timer);
						instance.closeToast();
					}, instance.timeout);
				}
			};

    }()


    /*==============================================ModalAlert============================================*/
    /*
    	调用方式
		this.$modal.alert({
			mes: '消息一出，休想滚动屏幕[移动终端]！',
			callback: function(){}
		});
    */ 
   !function () {

		var ModalAlert = Vue.component('modal-alert', {
				template: '<div class="modal-wrap">\
								<div class="modal-alert" :class="stylename">\
									<div class="modal-alert-box">\
										<span class="modal-alert-icon"><i class="iconfont" :class="iconsClass"></i></span>\
										<span class="modal-alert-text" v-html="mes">\
										</span>\
										<div class="modal-alert-bottom"><span class="modal-alert-button"  @click.stop="closeAlert">{{btntxt}}</span></div>\
									</div>\
								</div>\
							</div>',
				props: {
					mes: String,
					icon: String,
					stylename: String,
					btntxt: {
						type: String,
						default: '我知道了'
					},
					callback: Function
				},
				computed: {
					iconsClass: function() {
						var _icon = 'modal-alerticon';
						if (this.icon === 'success' || this.icon === 'error' || this.icon === 'info') {
							_icon = 'modal-' + this.icon;
						}
						return _icon;
					}
				}

			})
			var AlertConstructor = Vue.extend(ModalAlert);

			var instance = new AlertConstructor({
				el: document.createElement('div')
			});

			var hashChange = function () {
				pageScroll.unlock();

				var el = instance.$el;
				el.parentNode && el.parentNode.removeChild(el);
			};

			AlertConstructor.prototype.closeAlert = function () {
				pageScroll.unlock();

				var el = instance.$el;
				el.parentNode && el.parentNode.removeChild(el);

				window.removeEventListener("hashchange", hashChange);

				typeof this.callback === 'function' && this.callback();
			};

			MODAL.Alert = function (options) {
				instance.mes = options.mes;
				instance.icon = options.icon;
				instance.stylename = options.stylename;
				instance.btntxt = options.btntxt || '我知道了';
				instance.callback = options.callback;
				if(typeof options == 'string'){
					instance.mes = options;
				}

				window.addEventListener("hashchange", hashChange);

				document.body.appendChild(instance.$el);

				pageScroll.lock();
			};


	}()


     /*==============================================ModalLoading============================================*/
    /*
    	调用方式
		this.$modal.loading.open({title: "很多加载", icon: 1});
        this.$modal.loading.close();
    */ 
    !function () {

    	var ModalLoading = Vue.component('modal-loading', {
			template: '<div class="modal-wrap modal-loading-wrap" :class="{pageLoading: type == 2}">\
							<div class="modal-loading">\
								<img :src="loadIcon" />\
								<div class="modal-loading-text">{{title}}</div>\
							</div>\
						</div>',
			props: {
				type: {
	            	type: Number,
	            	default: 1,
	            },
	            title: {
	            	type: String,
	            	default: "加载中",
	            },
	            icon: {
	            	type: Number,
	            	default: 1,
	            }
	        },
	        computed: {
	        	loadIcon: function(){
	        		if(!this.icon || this.icon == 1){
	        			return "/plugins/modal/img/loading/loading-spin.svg";
	        		}else if(this.icon == 2){
	        			return "/plugins/modal/img/loading/loading-spinning-bubbles.svg";
	        		}else if(this.icon == 3){
	        			return "/plugins/modal/img/loading/loading-bubbles.svg";
	        		}else if(this.icon == 4){
	        			return "/plugins/modal/img/loading/loading-bars.svg";
	        		}
	        	}
	        }

		})


		var LoadingConstructor = Vue.extend(ModalLoading);

		var instance = new LoadingConstructor({
		    el: document.createElement('div')
		});

		LoadingConstructor.prototype.open = function(options){
			instance.type = 1;
			instance.icon = 1;
			if(typeof options == 'string'){
				instance.title = options;
			}
			if(!options){
			    instance.title = '正在加载';
		    }
		    if(typeof options == 'object'){
		    	instance.title = options.title || '正在加载';
		    	instance.icon = options.icon || 1;
		    	instance.type = options.type || 1;
		    	if(options.type == 2){
		    		instance.icon = 2;
		    	}
		    }

		    document.body.appendChild(instance.$el);

		    pageScroll.lock();
		};

		LoadingConstructor.prototype.close = function () {
		    var el = instance.$el;
		    el.parentNode && el.parentNode.removeChild(el);

		    pageScroll.unlock();
		};

		MODAL.Loading = {
			open: instance.open,
			close: instance.close
		}

    }()


     /*==============================================ModalNotify============================================*/
    /*
    	调用方式
		this.$modal.notify({
            mes: '5秒后自动消失，点我也可以消失！',
            timeout: 5000,
            callback: function() {
                console.log('我走咯！');
            }
        });
    */ 
    !function () {

    	var ModalNotify = Vue.component('modal-notify', {
				template: '<div class="modal-notify" :class="classes" v-html="mes">\
							</div>',
				data: function() {
		            return {
		                classes: ''
		            }
		        },
				props: {
		            mes: String,
		            timeout: Number,
		            callback: Function
		        }

			})


    	var NotifyConstructor = Vue.extend(ModalNotify);

		var instance = new NotifyConstructor({
		    el: document.createElement('div')
		});

		var timer = null;
		var lock = false;

		NotifyConstructor.prototype.closeNotify = function () {
		    instance.classes = 'model-notify-out';

		    setTimeout(function() {
		        var el = instance.$el;
		        el.parentNode && el.parentNode.removeChild(el);
		        lock = false;
		    }, 150);

		    typeof this.callback === 'function' && this.callback();
		};

		MODAL.Notify = function(options) {
		    instance.classes = '';
		    instance.mes = options.mes;
		    instance.timeout = ~~options.timeout || 5000;
		    instance.callback = options.callback;

		    if (lock)return;
		    lock = true;

		    document.body.appendChild(instance.$el);

		    instance.$el.addEventListener('click', function() {
		        clearTimeout(timer);
		        instance.closeNotify();
		    });

		    timer = setTimeout(function() {
		        clearTimeout(timer);
		        instance.closeNotify();
		    }, instance.timeout);
		};

    }()

    /*=========================================ModalBox===================================================*/
    /*
    	调用方式
		this.$modal.prompt({
			title: "",
			placeholder: "",
            content: '',
            maxlength: 500,
            callback: function(data) {
                console.log(data);
            }
        });
    */
    !function () {

    	var ModalPrompt = Vue.component('modal-prompt', {
				template: '<div class="modal-wrap">\
								<div class="modal-prompt">\
									<div class="modal-title">{{title}}</div>\
									<div class="modal-prompt-box">\
										<textarea v-model="inputContent" :placeholder="placeholder" @input="changeInput"></textarea>\
										<div class="contentLength"><span>{{inputContent.length}}</span>/{{maxlength}}</div>\
									</div>\
									<div class="modal-button-group">\
										<button class="modal-button" @click="closePrompt()">取消</button>\
										<button class="modal-button" @click="closePrompt(callback)">保存</button>\
									</div>\
								</div>\
							</div>',
				props: {
					title: String,
					content: String,
					placeholder: String,
		            maxlength: String,
		            callback: Function
		        },
		        data: function(){
		        	return {
		        		inputContent: this.content || ''
		        	}
		        },
		        methods: {
		        	changeInput: function() {
		        		if(this.inputContent.length >= this.maxlength) 
						this.inputContent = this.inputContent.substr(0, this.maxlength);
		        	}
		        }

			})

    		var PromptConstructor = Vue.extend(ModalPrompt);

			var instance = new PromptConstructor({
			    el: document.createElement('div')
			});
			var hashChange = function () {
			   pageScroll.unlock();
			    var el = instance.$el;
			    el.parentNode && el.parentNode.removeChild(el);
			};
			PromptConstructor.prototype.closePrompt = function (callback) {
			    if(typeof callback === 'function') {
			        stopClose = callback(instance.inputContent);
			    }
			    pageScroll.unlock();

			    var el = instance.$el;
			    el.parentNode && el.parentNode.removeChild(el);

			    window.removeEventListener("hashchange", hashChange);
			};

			MODAL.Prompt = function(options){
			    instance.mes = options.mes || '';
			    instance.title = options.title || '编辑';
			    instance.inputContent = options.content;
			    instance.placeholder = options.placeholder;
			    instance.maxlength = options.maxlength || 200;
			    instance.callback = options.callback;

			    window.addEventListener("hashchange", hashChange);

			    document.body.appendChild(instance.$el);

			    pageScroll.lock();
			};

	}();
	

	/*=========================================ModalLayer===================================================*/
        /*使用方法:
            <modal-layer title="modaltitle" stylename="stylename">
                <div solt='body'>这是body</div>
                <div solt="foot">这是foot</div>
            </modal-layer>
        */
	   Vue.component("modalLayer", {
		template: '<div class="modal-layer-wrap" :class="klass" v-show="layerShowFlag" @click.self="hide">\
					<div class="modal-layer-box">\
						<div class="modal-layer-title" v-if="layertitle">{{layertitle}}</div>\
						<div class="modal-layer-body">\
							<slot name="body"></slot>\
						</div>\
						<div class="modal-layer-footer">\
							<slot name="foot"></slot>\
						</div>\
					</div>\
				</div>',
		props: {
			title: {
				type: String,
				default: ''
			},
			stylename: {
				type: String,
				default: ''
			}
		},
		data: function() {
			return {
				layertitle: this.title,
				layerShowFlag: false,
				klass: this.stylename
			}
		},
		methods: {
			show: function() {
				this.layerShowFlag = true;
			},
			hide: function() {
				this.layerShowFlag = false;
			}
		}

	})


	/*===================================暴露$modal对象，外部调用======================================================*/ 

	Vue.prototype.$modal = {
		confirm: MODAL.Confirm,
		toast: MODAL.Toast,
		alert: MODAL.Alert,
		loading: MODAL.Loading,
		notify: MODAL.Notify,
		prompt: MODAL.Prompt
	}

})(document, window)

/*=======================增加$ajax方法=====================================*/ 

!(function(Vue, $) {

    if(!Vue || !$) {
        console.error('未引入依赖Vue或JQuery');
    }

    var vm = new Vue(),
        Modal = vm.$modal; 
        
    var vueAjax = function(newOptions) {

        var options = {};

        /**
         * 参数定义
         * @param option:
         * @param loading Sting/false 
         * @param url 表单提交的url,
         * @param data 表单的值,
         * @param success 保存成功的回调
         * @param error 保存失败的回调
         * @param complete 保存完成的回调
         * 
         */
        options.type = 'get';
        options.loading = false;
        options.dataType = 'json';
        options.beforeSend = null;
        options.success = null;
        options.error = null;
        options.complete = null;
        options.confirm = false;

        options = $.extend({}, options, newOptions);

        

        if(options.confirm) {
            Modal.confirm({
                mes: options.confirm,
                opts: function(){
                    ajaxStart(options);
                }
            });
        }else{
            ajaxStart(options);
        }
    }

    function ajaxStart(options) {
        $.ajax({
            type: options.type,
            url: options.url,
            data: options.data,
            dataType: options.dataType,
            beforeSend: function() {
                if(typeof options.beforeSend === 'function') {
                    if(options.beforeSend() === false) {
                        return false;
                    }
                }
                if(options.loading) {
                    Modal.loading.open(options.loading);
                }
            },
            success: function(res) {
                if(res.error_code == 0) {
                    if(options.success) {
                        options.success(res);
                    }
                }else if(res.error_code == 404) {
					location.href = '/user/bind';
				}else{
                    Modal.toast({mes: res.error_msg});
                    if(options.error) {
                        options.error(res);
					}
                }
            },
            error: function(res) {
                Modal.toast({mes: '咦，遇到错误啦'});
                if(options.error) {
                    options.error(res);
                }
            },
            complete: function() {
				if(options.loading) {
					Modal.loading.close();
				}
                if(options.complete) {
                    options.complete(res);
                }
            }

        })
    }


    Vue.prototype.$ajax = vueAjax;

})(Vue, jQuery)