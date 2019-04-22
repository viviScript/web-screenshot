//裁剪图像

function ScreenShot(el, jcropConfig, canvasConfig) {
    this.el = el;
    this.jcropConfig = jcropConfig;
    this.canvasConfig = canvasConfig;
    this.jcrop_api = {}
    this.canvasImage = ''
    this.jcropPosition = []
    this.jcropImage = {}
    this.cb = function () {}
};
/* 
  第一步： 获取视图dom,根据dom将视图转化为一张图片
*/
ScreenShot.prototype.creatCanvasImg = function () {
    var _self = this;
    // 第三方插件：html2canvas截图
    html2canvas(document.querySelector(_self.el), {
        scale: 1 // 放大比率
    }).then(function (canvas) {
        let canvasImg = new Image(); // 创建新图片
        canvasImg.src = canvas.toDataURL(); // 将canvas截图转化blob图片路径
        canvasImg.onload = function () {
            $("html").addClass("jcrop_body")
            $("body").addClass("jcrop_body")
            let divContent = "<div class='divContent'>" +
                "<div class='divJcrop'>" + "</div>" +
                "</div>"

            $("body").append(divContent)
            $(".divContent .divJcrop").append(canvasImg)
            _self.canvasImage = canvasImg
        }
    });
};
/* 
  第二步： 将截取好的图片放入页面dom中显示
          并使用第三方选取截图插件挂载其dom上，开始选取截图区域
*/
ScreenShot.prototype.jcropHandle = function () {
    var _self = this
    $(this.canvasImage).Jcrop({
        bgFade: true,
        setSelect: [0, 0, 400, 200],
        onChange: function (e) {
            $(".jcrop_hander").css({
                top: e.y2 + 'px',
                left: e.x2 - $(".jcrop_hander").width() + 'px'
            })
        },
        onSelect: function (e) {
            $(".jcrop_hander").css({
                "visibility": 'visible'
            })
            _self.jcropPosition = e;
        },
        onRelease: function (e) {
            $(".jcrop_hander").css({
                "visibility": 'hidden'
            })
        },
        onDblClick: function (e) {}
    }, function () {
        _self.jcrop_api = this;
        _self.creatJcropDiv()
    });
    return _self.jcrop_api;
}
/* 
  第三步： 创建截图选取框的dom与事件
*/
ScreenShot.prototype.creatJcropDiv = function () {
    var _self = this;
    var jcropDiv = "<div class='jcrop_hander'> " +
        "<button class='jcrop_affirm'>截图</button>" +
        "<button class='jcrop_cancel'>取消</button>" +
        "</div>"
    $(".jcrop-holder").append(jcropDiv)
    $(".jcrop_hander .jcrop_affirm").bind("click", function () {
        _self.jcrop_api.destroy()
        _self.hiddenJcrop()
        _self.setImage()
    })
    $(".jcrop_hander .jcrop_cancel").bind("click", function () {
        _self.jcrop_api.destroy()
        _self.hiddenJcrop()
    })
};
// 获取截好的图片
ScreenShot.prototype.setImage = function () {
    var _self = this
    var val = this.jcropPosition
    var canvasShow = document.createElement('canvas')
    var context_show = canvasShow.getContext('2d');
    canvasShow.style.width = val.w + 'px'
    canvasShow.style.height = val.h + 'px'
    canvasShow.width = val.w
    canvasShow.height = val.h
    context_show.drawImage(this.canvasImage, val.x, val.y, val.w, val.h, 0, 0, val.w, val.h)

    var imgDom = new Image();
    var imgurl = canvasShow.toDataURL();
    imgDom.src = imgurl
    this.jcropImage = imgDom
    this.cb(imgDom)
    return imgDom
}
// 开始截图
ScreenShot.prototype.startJcrop = function (cb) {
    this.showJcrop()
    this.jcropHandle()
    this.cb = cb;
    return this
}
// 移除截图
ScreenShot.prototype.removeJcrop = function () {
    this.hiddenJcrop()
    this.jcrop_api.destroy()
}
// 显示截图区域
ScreenShot.prototype.showJcrop = function () {
    $(".divContent").css({
        "display": 'block'
    })
    $("html").addClass("jcrop_body")
    $("body").addClass("jcrop_body")
}
// 隐藏截图区域
ScreenShot.prototype.hiddenJcrop = function () {
    $(".divContent").css({
        "display": 'none'
    })
    $("html").removeClass("jcrop_body")
    $("body").removeClass("jcrop_body")
}