window.addEventListener("DOMContentLoaded", () => {
  // 焦点图加载事件
  imgrightLoad();

  //鼠标点击换图片
  eventClick();

  //右侧按钮移入移出
  imgrightMove();

  //鼠标按下滚轮事件
  scrollMove();

  //右侧按钮点击事件
  imgrightClick();

  // 滑轮加载事件
  scrollAll();

  //滚轮事件
  var isMove = false;
  document.addEventListener("mousewheel", f1);
  document.addEventListener("DOMMouseScroll", f1);

  // 焦点图加载事件
  function imgrightLoad() {
    //加载data.js中的文件
    var goodImgsrc = goodData.imgsrc;
    goodImgsrc.forEach(function (item) {
      var li = document.createElement("li");
      var img = document.createElement("img");
      var ulist = document.querySelector("#ulist");
      img.src = item.b;
      li.append(img);
      ulist.append(li);
    });
  }

  //右侧按钮点击事件
  function imgrightClick() {
    var imgright_top = document.querySelector("#imgright-top");
    var imgright_buttom = document.querySelector("#imgright-buttom");
    imgright_top.addEventListener("click", () => {
      move(false);
    });
    imgright_buttom.addEventListener("click", () => {
      move(true);
    });
  }

  //鼠标点击换图片
  function eventClick() {
    var imgleft = document.querySelector("#imgleft");
    var imgright_ulist = document.querySelector("#ulist");
    //鼠标点击换图片
    imgright_ulist.addEventListener("click", () => {
      //event兼容事件
      var event = event || window.event;
      if (event.target.nodeName == "IMG") {
        imgleft.firstElementChild.src = event.target.src;
      }
    });
  }

  //右侧按钮移入移出
  function imgrightMove() {
    var imgright = document.querySelector("#imgright");
    var imgright_top = document.querySelector("#imgright-top");
    var imgright_buttom = document.querySelector("#imgright-buttom");
    //右侧按钮移入移出
    imgright.addEventListener("mouseenter", () => {
      imgright_top.style.opacity = 0.8;
      imgright_buttom.style.opacity = 0.8;
    });

    imgright.addEventListener("mouseleave", () => {
      imgright_top.style.opacity = 0;
      imgright_buttom.style.opacity = 0;
    });
  }

  //滑轮加载事件
  function scrollAll() {
    var scroll = document.querySelector(".scroll");
    var scrollIn = document.querySelector(".scroll .scrollIn");
    var imgright_ulist = document.querySelector("#ulist");

    // 滑槽的高度 / 内容的高度
    var scale = scroll.clientHeight / imgright_ulist.offsetHeight;
    // 滑块的高度 = (滑槽的高度 / 内容的高度 )* 滑槽的高度
    var scrollIn_h = scale * scroll.clientHeight;
    // 滑块的高度赋值
    scrollIn.style.height = scrollIn_h + "px";
  }

  // 滑块按下事件
  function move(flag) {
    var scroll = document.querySelector(".scroll");
    var scrollIn = document.querySelector(".scroll .scrollIn");
    var li = document.querySelector("#ulist li");
    var imgright_ulist = document.querySelector("#ulist");
    // 解决定时器叠加bug
    if (isMove == true) {
      return;
    }
    isMove = true;
    //获取li的高度
    var liHeight = li.offsetHeight;
    // 判断flag，确定图片移动方向与距离
    var disY = flag ? -liHeight : liHeight;

    //定义总时长
    var maxTime = 1000;
    //定时每隔40毫秒调用一次
    var smallTime = 40;
    //计算单次移动的距离
    var disTime = disY / (maxTime / smallTime);
    //mytime的计时器
    var mytime = setInterval(function () {
      // 获取 ul列表的当前位置,并进行移动位置计算偏移量
      var lastY = imgright_ulist.offsetTop + disTime;
      //获取列表的总长度
      var imgListHeight = imgright_ulist.offsetHeight;
      //获取页面的总高度
      var imgHeight = imgright.offsetHeight;
      //获取可移动的高度
      var imgCHeight = imgListHeight - imgHeight;
      if (imgCHeight > -lastY && lastY < 0) {
        imgright_ulist.style.top = lastY + "px";
        // 内容的滚动距离 = 滑块滚动距离 / (滑槽的高度 / 内容的高度) scale
        scrollIn.style.top =
          -(scroll.offsetHeight / imgListHeight) * lastY + "px";
      }
      if (lastY % liHeight == 0 || imgCHeight < -lastY) {
        // 清除当前定时
        clearInterval(mytime);
        // 改变动画状态为false
        isMove = false;
      }
    }, smallTime);
  }

  //鼠标按下滚轮事件
  function scrollMove() {
    var scroll = document.querySelector(".scroll");
    var scrollIn = document.querySelector(".scroll .scrollIn");

    var imgright_ulist = document.querySelector("#ulist");
    // 滑槽的高度 / 内容的高度
    var scale = scroll.clientHeight / imgright_ulist.offsetHeight;
    //鼠标按下滚轮事件
    scrollIn.onmousedown = function (event) {
      // 兼容事件
      event = event || window.event;
      // 获取滑块的向上偏移量
      var eleY = scrollIn.offsetTop;
      // 获取鼠标的初始位置
      var startY = event.clientY;
      // 滑块移动事件
      document.onmousemove = function (event) {
        event = event || window.event;
        // 获取鼠标的结束位置
        var endY = event.clientY;
        // 结束位置-初始位置
        var disY = endY - startY;
        // 最终位置的偏移量
        var lastY = eleY + disY;

        // 边界问题
        if (lastY >= scroll.clientHeight - scrollIn.offsetHeight) {
          lastY = scroll.clientHeight - scrollIn.offsetHeight;
        } else if (lastY <= 0) {
          lastY = 0;
        }

        scrollIn.style.top = lastY + "px";
        // 内容的滚动距离 = 滑块滚动距离 / (滑槽的高度 / 内容的高度) scale
        var content_dis = lastY / scale;
        // 把最终的值赋给列表的top值;
        imgright_ulist.style.top = -content_dis + "px";
      };

      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };

      document.addEventListener("mousewheel", f1);
      document.addEventListener("DOMMouseScroll", f1);
      // 阻止默认属性
      return false;
    };
  }

  //滚动条事件
  function f1(event) {
    if (isMove == true) {
      return;
    }
    isMove == true;
    //判断浏览器
    var flaga;
    var scroll = document.querySelector(".scroll");
    var scrollIn = document.querySelector(".scroll .scrollIn");
    var imgright_ulist = document.querySelector("#ulist");
    // 滑槽的高度 / 内容的高度
    var scale = scroll.clientHeight / imgright_ulist.offsetHeight;
    if (event.wheelDelta) {
      if (event.wheelDelta > 0) {
        flaga = true;
      } else {
        flaga = false;
      }
    } else {
      if (event.detail < 0) {
        flaga = true;
      } else {
        flaga = false;
      }
    }
    //判断出哪个浏览器
    if (flaga == false) {
      //设置偏移量+10
      var lastY = scrollIn.offsetTop + 10;
      //判断出最大可偏移量
      if (lastY >= scroll.clientHeight - scrollIn.offsetHeight) {
        lastY = scroll.clientHeight - scrollIn.offsetHeight;
      }
      //
      var content_dis = lastY / scale;
      imgright_ulist.style.top = -content_dis + "px";
      scrollIn.style.top = lastY + "px";
    } else {
      var lastY = scrollIn.offsetTop - 10;
      if (lastY <= 0) {
        lastY = 0;
      }
      var content_dis = lastY / scale;
      imgright_ulist.style.top = -content_dis + "px";
      scrollIn.style.top = lastY + "px";
      isMove == false;
    }
  }
});
