/**
 * Created by Administrator on 2017/4/2.
 */
/**
 * 获取页面文本内容兼容性处理
 * @param element
 * @returns {*}
 */
function getText(element) {
    if (typeof element.innerText == "string") {
        return element.innerText;
    } else {
        return element.textContent;
    }
}
/**
 * 设置页面文本内容兼容性处理
 * @param element
 * @param str
 */
function setText(element, str) {
    if (typeof element.innerText == "string") {
        element.innerText = str; //设置内容
    } else {
        element.text.Content = str;
    }
}
/**
 * 获取下一个兄弟元素（同级）的兼容性处理
 * @param element
 * @returns {*}
 */
function getNextElement(element) {
    if (element.nextElementSibling) {
        return element.nextElementSibling;
    } else {
        var next = element.nextSibling;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    }
}
/**
 * 获取上一个兄弟元素的兼容性函数
 * @param element
 * @returns {*}
 */
function getPreviosElement(element) {
    if (element.previousElementSibling) {
        return element.previousElementSibling;
    } else {
        var pre = element.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }
}
/**
 * 获取内联样式的兼容性写法
 * @param ele
 * @returns {*}
 */
function getStyle(ele) {
    if (ele.currentStyle) {
        return ele.currentStyle; //只有IE识别
    } else {
        return getComputedStyle(ele, null); //IE678不识别
    }
}

/**
 * 获取第一个子元素的兼容性函数
 * @param ele
 * @returns {Element}
 */
function getNextChild(ele) {
    if (ele.firstElementChild) {
        return ele.firstElementChild;
    } else {
        var next = ele.firstElementChild;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling; //继续寻找子元素的兄弟节点，直到为元素节点
        }
    }
    return next;
}
/**
 * 获取最后一个子元素的兼容性函数
 * @param ele
 * @returns {Element}
 */
function getLastChild(ele) {
    if (ele.lastElementChild) {
        return ele.lastElementChild;
    } else {
        var next = ele.lastElementChild;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling; //继续寻找子节点的兄弟节点，直到为元素节点
        }
    }
    return next;
}
/**
 * 查找类名兼容性处理函数
 * @param ele
 * @param classname
 * @returns {*}
 */
function getClassName(ele, classname) {
    if (ele.getElementsByClassName(classname)) {
        return ele.getElementsByClassName(classname);
    }
    //寻找所有的标签节点，遍历查找是否有我们需要的类名
    else {
        var newarr = [];
        var elements = ele.getElementsByTagName("*"); //通配符表示ele下的所有标签
        for (i = 0; i < elements.length; i++) {
            //在所有ele下的所有标签中查找类名
            var filterArr = elements[i].split(" ");
            //用空字符串切割所有标签名
            for (j = 0; j < filterArr.length; j++) {
                if (filterArr[i] == classname) {
                    newarr.push(elements[i]);
                    break;
                }
            }
            return newarr; //所有找的同类名的元素集合
        }
    }
}
/**
 * 替换类名函数
 * @param ele
 * @param newclass
 * @param oldclass
 */
function replaceClassName(ele, newclass, oldclass) {
    var arr = ele.className.split(" "); //用空格切割类名字符串，存储到数组
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == oldclass) {
            arr[i] = newclass;
        }
    }
    ele.className = arr.join(" ");
}
/**
 * 匀速轮播图动画函数
 * @param obj
 * @param target
 * @constructor
 */
function Move(obj, target) {
    clearInterval(obj.time);
    var target;
    //动态获取对象的初始left值
    var leader = obj.offsetLeft;
    obj.time = setInterval(function () {
        var step = 30;
        //让step有正负可以进行左右移动
        step = leader < target ? step : -step;
        //            判断移动至倒数第二步时是否还可以继续移动
        if (Math.abs(leader - target) > Math.abs(step)) {
            leader = leader + step;
            obj.style.left = leader + "px";
        } else {
            obj.style.left = target + "px"; //总是忘记加单位，啊啊啊啊啊
            clearInterval(obj.time);
        }
    }, 15)
}

/**
 * 缓动动画函数
 * @param obj
 * @param target
 */
//缓动动画框架封装5.0最终版,可修改多个属性样式，添加可修改不带px的属性（opacity,zIndex）
function animate(obj, json, fn) {
    clearInterval(obj.time);
    obj.time = setInterval(function () {
        var flag = true; //假设每个属性已经到达修改的目的地
        for (var k in json) {
            //透明度单独处理
            if (k == "opacity") {
                //获取指定对象的指定属性值，为字符串
                var leader = getStyle(obj, k) * 100;
                var step = (json[k] * 100 - leader) / 15;
                //向上取整是为了保持缓动最后能到达目标位置
                //向左缓动时，值小于零时向上取整，会一直取到零，所以需要向下取整
                var step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                //传入指定属性，设置attr的值，记得加单位
                obj.style[k] = leader / 100;
            } else if (k == "zIndex") {
                obj.style[k] = json[k]; //层级直接设置不需要渐变
            } else {
                //获取指定对象的指定属性值，为字符串
                var leader = parseInt(getStyle(obj, k)) || 0; //0为了兼容不带px单位的属性
                var step = (json[k] - leader) / 15;
                //向上取整是为了保持缓动最后能到达目标位置
                //向左缓动时，值小于零时向上取整，会一直取到零，所以需要向下取整
                var step = step > 0 ? Math.ceil(step) : Math.floor(step);
                leader = leader + step;
                //传入指定属性，设置attr的值，记得加单位
                obj.style[k] = leader + "px";
            }
            //判断当前属性修改是否到达目的地
            if (leader !== json[k]) {
                flag = false;
            }
        }
        //循环外部判断所有属性修改是否已经 到达目的地，如果为true,则清除定时器循环
        if (flag) {
            clearInterval(obj.time);
            //回调函数的真正调用执行位置
            if (fn) {
                fn();
            }
        }
    }, 15)
}
//    获取计算后样式属性值函数（长,宽,高,left,top）
function getStyle(obj, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(obj, null)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}
/**
 * 获取计算之后的样式函数兼容性处理
 * @param obj
 * @param attr
 * @returns {*}
 */
function getNewStyle(obj, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(obj, null)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}
/**
 * 获取窗口可视区域的宽高函数
 * @returns {{width: number, width: number}}
 */
function getClient() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
    };
}
/**
 * 获取页面被卷去的左侧宽度和顶部高度
 * @returns {{top: number, left: number}}
 */
function getScroll() {
    return {
        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    };
}
/**
 * 获取事件对象的兼容封装
 * @param event
 * @returns {*|Event}
 */
function getEvent(event) {
    return event || window.event;
}
/**
 * 获取鼠标水平坐标的兼容函数封装
 * @param event
 * @returns {number|Number|*}
 */
function getPageX(event) {
    return event.pageX || event.clientX + document.documentElement.scrollLeft;
}
/**
 * 获取鼠标竖直坐标的兼容函数封装
 * @param event
 * @returns {number|Number|*}
 */
function getPageY(event) {
    return event.pageY || event.clientY + document.documentElement.scrollTop;
}
/**
 * 阻止事件冒泡的兼容函数封装
 * @param event
 */
function stopPropagation(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}
/**
 * 获取事件对象目标兼容性写法
 * @param event
 * @returns {*|Element|Object}
 */
function getTarget(event) {
    return event.target || event.srcElement;
}
/**
 * event事件对象工具包封装
 * @type {{getEvent: Function, getPageX: Function, getPageY: Function, stopPropagation: Function, getTarget: Function}}
 */
var eventTools = {
    getEvent: function (event) {
        return event || window.event;
    },
    getPageX: function (event) {
        return event.pageX || event.clientX + document.documentElement.scrollLeft;
    },
    getPageY: function (event) {
        return event.pageY || event.clientY + document.documentElement.scrollTop;
    },
    stopPropagation: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    }
};
/**
 * 表单验证函数，传入要验证的对象和正则表达式规则
 * @param inp
 * @param regEx
 */
function check(inp, regEx) {
    inp.onblur = function () {
        if (regEx.test(this.value)) {
            this.nextSibling.innerHTML = "√";
            this.nextSibling.className = "right";
        } else {
            this.nextSibling.innerHTML = "×";
            this.nextSibling.className = "wrong";
        }
    };
}

/**
 * 去掉两端空格的兼容函数
 * @param str
 * @returns {XML|string|void|*}
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, ""); //global 全局
}

/**
 * 全屏兼容函数封装
 */

function fullScreen(ele) {
    if (ele.requestFullscreen) {
        return ele.crequestFullscreen();
    } else if (ele.webkitRequestFullScreen) {
        return ele.webkitRequestFullScreen()
    } else if (ele.msRequestFullscreen) {
        return ele.msRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        return ele.mozRequestFullScreen();
    }
}

/**
 * 移动端点击事件TAP的封装
 */
function tap(domobj, callback) {
    if (!domobj || typeof domobj !== 'object') {
        return;
    }
    var starttime, startX, startY;
    domobj.addEventListener('touchstart', function (e) {
        //判断是否是一根手指
        if (e.targetTouches.length > 1) {
            return;
        }
        //记录当前时间以及偏移位置
        starttime = Date.now();
        startX = e.targetTouches[0].clientX;
        startY = e.targetTouches[0].clientY;
    });
    domobj.addEventListener('touchend', function (e) {
        if (e.changedTouches.length > 1) {
            return;
        }
        //记录当前时间以及偏移位置
        var endtime = Date.now();
        var endX = e.changedTouches[0].clientX;
        var endY = e.changedTouches[0].clientY;
        if (endtime - starttime > 160) {
            //	长按操作,不是单击事件
            console.log('这是一次长按操作');
            return;
        }

        if (Math.abs(endX - startX) < 6 && Math.abs(endY - startY) < 6) {
            console.log('这是一次单击事件模拟');
            //			用短路运算 进行判断是否传入了 匿名回调函数，传入了则执行匿名函数，并将当前点击事件的 event 对象 传给匿名函数，进行相关操作
            callback && callback(e);
        }
    });
}

/**
 * __prototype__原型兼容性函数
 * @param instance
 * @returns {Object|Function|Mongo.Collection|number}
 */
function getprototype(instance) {
    return instance.constructor.prototype;
}
/**
 * 创建新对象，实现继承的方法兼容性函数封装
 * @param obj
 * @returns {*}
 */
function creatWithObj(obj) {
    if (Object.create) {
        return Object.create(obj);
    } else {
        function F() {
        };
        F.prototype = obj;
        return new F();
    }
}
/**
 * 闭包模拟缓存函数的封装
 * @returns {cache}
 */
function creatCache() {
    var data = [], max = 3;

    function cache(key, value) {
        if (data.length >= max) {
            //移除数组中最早放进去的数据
            var temp = data.shift();
            //删除数组中最开始插入的数据对应的cache中绑定的值
            delete cache(temp);
        }
        data.push(key);
        cache[key] = value;
    }
    return cache;
}
/**
 * [ajax 异步请求函数封装]
 * @return {[type]} [description]
 */
function ajax(url, style, callback) {
    var xhr = null;
    if (window.XMLHtmlRequest) {
        xhr = new XMLHtmlRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open(style, url);
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.readystate == 4) {
            if (xhr.status == 200) {
                var data = xhr.responseText;
                callback(data);
            }
        }
    }
}

/**
 * Canvas 绘制直线函数封装
 * 构造函数原型继承封装所有方法
 */
function Line(config) {
    this.ctx = ctx;
    this.x0 = config.x0;
    this.y0 = config.y0;
    this.x1 = config.x1;
    this.y1 = config.y1;

    this.strokeStyle = config.strokeStyle;
    this.lineWidth = config.lineWidth;
}
Line.prototype = {
    constructor: Line,
    stroke: function () {
        this.ctx.moveTo(this.x0, this.y0);
        this.ctx.lineTo(this.x1, this.y1);
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.lineWidth) {
            this.ctx.lineWidth = this.lineWidth;
        }
        this.ctx.stroke();
    }
};

/**
 * canvas 处理弧度与角度的函数
 */
//弧度转角度
function toAngle(radian) {
    return radian * 180 / Math.PI;
}
// 角度 转弧度
function toRadian(angle) {
    return angle * Math.PI / 180;
}
/**
 * canvas 绘制数据饼形图函数封装
 * obj 画布对象
 * arr 数据数组
 */
function picData(obj, arr) {
    var sum = 0;
    var ctx = obj.getContext('2d');
    var rr = obj.width > obj.height ? obj.height : obj.width;
    var x0 = obj.width / 2, y0 = obj.height / 2, r = parseInt((rr / 2) * 0.8);
    arr.forEach(function (v) {
        sum += v;
    });
    var colors = 'tomato,turquoise,violet,yellowgreen,wheat,firebrick,whitesmoke,yellow,'.split(',');
    var start = -90;
    for (var i = 0; i < arr.length; i++) {
        var angle = arr[i] / sum * 360;
        var padding = 10;
        // 绘制饼
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(x0, y0);
        ctx.arc(x0, y0, r, toRadian(start), toRadian(start + angle));
        ctx.closePath();
        ctx.fill();

        // 绘制直线
        ctx.beginPath();
        ctx.font = '15px yahei';
        ctx.fillStyle = '#000';
        ctx.moveTo(x0, y0);
        var x1 = x0 + (r + 30) * Math.cos(toRadian(start + angle / 2));
        var y1 = y0 + (r + 30) * Math.sin(toRadian(start + angle / 2));
        ctx.lineTo(x1, y1);
        ctx.textAlign = 'center';
        ctx.fillText(parseInt(arr[i] / sum * 100) + '%', x1 + padding, y1 + padding);
        // 511行 的数据直线的坐标值计算不能写成 start+=angle ，这样 它的值会累加起来。越来越大
        start += angle;
    }
}
/**
 * 绘制矩形函数封装
 */
function Rect(config) {
    this.ctx = config.ctx;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;

    this.lineWidth = config.lineWidth;
    this.strokeStyle = config.strokeStyle;
    this.fillStyle = config.fillStyle;
}
Rect.prototype = {
    constructor: Rect,
    //   描边矩形
    stroke: function () {
        var ctx = this.ctx;
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.lineWidth) {
            this.ctx.lineWidth = this.lineWidth;
        }
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    },
    //   填充矩形
    fill: function () {
        var ctx = this.ctx;
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.lineWidth) {
            this.ctx.lineWidth = this.lineWidth;
        }
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

/**
 *  canvas 绘制line、circle、rect统一封装
 *  x0,y0:画笔起始点，x1,y1画笔结束点
 *  width,height:矩形的宽高，x0,y0,x1,y1都传入的情况下默认以x0,y0作为画笔的起始点
 *  同理默认以x0,y0作为圆的圆心，r:半径，a0,a1:圆的开始角度和结束角度
 *  lineWidth,strokeStyle,fillStyle 可选的画笔样式
 *  isFill 判断是否填充，为true 画实心圆, 画实心矩形
 */
function Canvas(config) {
    this.ctx = config.ctx;
    this.x0 = config.x0;
    this.y0 = config.y0;
    this.x1 = config.x1;
    this.y1 = config.y1;
    this.width = config.width;
    this.height = config.height;
    this.r = config.r;
    this.a0 = config.a0;
    this.a1 = config.a1;
    this.lineWidth = config.lineWidth;
    this.strokeStyle = config.strokeStyle;
    this.fillStyle = config.fillStyle;
    this.isFill = config.isFill;
}
Canvas.prototype = {
    constructor: Canvas,
    // 绘制直线方法
    strokeLine: function () {
        this.ctx.moveTo(this.x0, this.y0);
        this.ctx.lineTo(this.x1, this.y1);
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.lineWidth) {
            this.ctx.lineWidth = this.lineWidth;
        }
        this.ctx.stroke();
    },
    // 绘制矩形方法
    rect: function () {
        var ctx = this.ctx;
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.lineWidth) {
            this.ctx.lineWidth = this.lineWidth;
        }
        if (this.fillStyle) {
            this.ctx.fillStyle = this.fillStyle;
        }
        if (this.isFill) {
            ctx.fillRect(this.x0, this.y0, this.width, this.height);
        } else {
            ctx.strokeRect(this.x0, this.y0, this.width, this.height);
        }
    },
    // 绘制圆方法
    circle: function () {
        var ctx = this.ctx;
        if (this.strokeStyle) {
            this.ctx.strokeStyle = this.strokeStyle;
        }
        if (this.lineWidth) {
            this.ctx.lineWidth = this.lineWidth;
        }
        if (this.fillStyle) {
            this.ctx.fillStyle = this.fillStyle;
        }
        ctx.moveTo(this.x0, this.y0);
        ctx.arc(this.x0, this.y0, this.r, toRadian(this.a0), toRadian(this.a1));
        ctx.closePath();
        if (this.isFill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    },
}

/**
 * $.each 封装
 * isArrLike 函数 用于对传入的对象分类数组、伪数组和对象两类 
 * arr：传入的对象，fn：传入的回调函数
 */
function isArrLike(arr) {
    var length = arr && arr.length;
    return length >= 0 && typeof length === 'number';
}

function each(arr, fn) {
    if (isArrLike(arr)) {
        for (var i = 0; i < arr.length; i++) {
            if (fn.call(arr[i], i, arr[i]) === false) { break };
        }
    } else {
        for (var k in arr) {
            if (fn.call(arr[k], k, arr[k]) === false) { break };
        }
    }
    return arr;
}
/**
 * $.map 函数的封装
 * arr 传入的对象，fn 传入的回调函数,item返回的新数组
 */
function map(arr, fn) {
    var item = [],
        tmp;
    if (isArrLike(arr)) {
        for (i = 0; i < arr.length; i++) {
            tmp = fn(arr[i], i);
            if (tmp !== undefined) {
                item.push(tmp);
            }
        }
    } else {
        for (var k in arr) {
            tmp = fn(arr[i], i);
            if (tmp !== undefined) {
                item.push(tmp);
            }
        }
    }
    return item;
}
/**
 * jQuery 顶级对象 $ 封装原理
 */