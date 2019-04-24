interface ShotProps {
  el: string;
  jcropConfig?: object;
  canvasConfig?: object;
}

class ScreenShotTs {
  el: string;
  jcropConfig?: object;
  canvasConfig?: object;
  private canvasImage: any
  private jcropPosition: {
      x?: string,
      y?: string,
      w?: string,
      h?: string,
      x2?: string,
      y2?: string
  } = {}
  private jcrop_api = {
    destroy: ():void => {}
  }
  private jcropImage: any = {}
  private callback: ()=>{} = () => {}
  constructor(el: string, jcropConfig?: object, canvasConfig?: object) {
    this.el = el;
    this.jcropConfig = jcropConfig;
    this.canvasConfig = canvasConfig;
  }

  creatCanvasImg() {
    let _self = this;
    // 第三方插件：html2canvas截图
    let elDom = document.querySelector(_self.el)
    html2canvas(elDom, {
      scale: 1 // 放大比率
    }).then(function(canvas: any) {
      let canvasImg = new Image(); // 创建新图片
      canvasImg.src = canvas.toDataURL(); // 将canvas截图转化blob图片路径
      canvasImg.onload = function() {
        $("html").addClass("jcrop_body");
        $("body").addClass("jcrop_body");
        let divContent =
          "<div class='divContent'>" +
          "<div class='divJcrop'>" +
          "</div>" +
          "</div>";

        $("body").append(divContent);
        $(".divContent .divJcrop").append(canvasImg);
        _self.canvasImage = canvasImg;
      };
    });
  }
  jcropHandle() {
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

  creatJcropDiv() {
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
  }
  setImage() {
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
    this.callback(imgDom)
    return imgDom
  }
  startJcrop (callback) {
    this.showJcrop()
    this.jcropHandle()
    this.callback = callback;
    return this
  }
  removeJcrop () {
    this.hiddenJcrop()
    this.jcrop_api.destroy()
  }
  showJcrop () {
    $(".divContent").css({
        "display": 'block'
    })
    $("html").addClass("jcrop_body")
    $("body").addClass("jcrop_body")
  }
  hiddenJcrop () {
    $(".divContent").css({
        "display": 'none'
    })
    $("html").removeClass("jcrop_body")
    $("body").removeClass("jcrop_body")
  }
}
