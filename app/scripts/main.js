var oLayer;

var data = [{name: "软件学院", content:"来看马戏团吧！", url:"http://www.baidu.com"},
  {name: "汽车系", content:"来看车夜狂欢吧！", url:"http://www.baidu.com"},
  {name: "数学系", content:"来看独树一帜吧！", url:"http://www.baidu.com"},
  {name: "精仪系", content:"来看奇艺秘境吧！", url:"http://www.baidu.com"}];

collie.util.addEventListener(window, "load", function () {
  var htParams = collie.util.queryString();
  var htSize = {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  };

  var range = min(htSize.height, htSize.width) / 10;
  var top = 230;
  var bottom = 150;
  var num;
  var box;

  var isShowNoHat = false;
  var isShowDrag = true;
  var isShowNoHurt = false;
  var unknownFlag = false;

  oLayer = new collie.Layer({
    width: htSize.width,
    height: htSize.height
  });

  var oSelectedDisplayObject = null;
  var htStartPosition = {};
  var htSelectedDisplayObjectPosition = {};

  oLayer.attach({
    mousedown: function (oEvent) {
      oSelectedDisplayObject = oEvent.displayObject;
      if (oEvent.displayObject) {
        if (oEvent.displayObject == hat) {
          if (isShowNoHat) {
            removeNoHat();
          }
          if (isShowDrag) {
            removeDrag();
          }
          htStartPosition = {
            x: oEvent.x,
            y: oEvent.y
          };
          htSelectedDisplayObjectPosition = {
            x: oSelectedDisplayObject.get("x"),
            y: oSelectedDisplayObject.get("y")
          };
        } else if (oEvent.displayObject == person) {
          if (isShowNoHat) {
            removeNoHat();
            unknownFlag = true;
          }
          showNoHurt();
        } else if (oEvent.displayObject == hatWord) {
          console.log("click!");
          hatWord.set({
            useEvent: false
          });
          showWord();
        } else if (oEvent.displayObject == box) {
          console.log(num);
          window.location.href = data[num].url;
        }
      }
    },
    mouseup: function (oEvent) {
      if (oSelectedDisplayObject !== null) {
        if (oSelectedDisplayObject == hat) {
          var x = oSelectedDisplayObject.get("x");
          var y = oSelectedDisplayObject.get("y");
          if (x > personX - range && x < personX + range && y > (personY - top * nScale) && y < (personY - bottom * nScale)) {
            oSelectedDisplayObject.set({
              useEvent: false
            });
            person.set({
              useEvent: false
            });
            showHatWord();
          } else {
            if (!isShowNoHat) {
              showNoHat();
            }
          }
          oSelectedDisplayObject = null;
          htSelectedDisplayObjectPosition = htStartPosition = {};
          oLayer.removeChild(oEvent.displayObject);
          oLayer.addChild(oEvent.displayObject);
        } else if (oSelectedDisplayObject == person) {
          removeNoHurt();
          if (unknownFlag) {
            showNoHat();
            unknownFlag = false;
          }
        }
      }
    },
    mousemove: function (oEvent) {
      if (oSelectedDisplayObject == hat) {
        var x = htStartPosition.x - oEvent.x;
        var y = htStartPosition.y - oEvent.y;
        var nowX = htSelectedDisplayObjectPosition.x - x;
        var nowY = htSelectedDisplayObjectPosition.y - y;
        var maxX = htSize.width - 300 * nScale;
        var maxY = htSize.height - 300 * nScale;
        if (nowX <= 0 - move) nowX = 0 - move;
        if (nowX >= maxX - move) nowX = maxX - move;
        if (nowY <= 0 - move) nowY = 0 - move;
        if (nowY >= maxY - move) nowY = maxY - move;
        oSelectedDisplayObject.set({
          x: nowX,
          y: nowY
        });
      }
    }
  });

  collie.ImageManager.add("hat", "../images/hat.png");
  collie.ImageManager.add("person", "../images/person.png");
  collie.ImageManager.add("noHatWord", "../images/nohat.png");
  collie.ImageManager.add("dragWord", "../images/drag.png");
  collie.ImageManager.add("hatWord", "../images/hatWord.png");
  collie.ImageManager.add("nohurt", "../images/nohurt.png");

  function min(num1, num2) {
    return num1 < num2 ? num1 : num2;
  }
  function max(num1, num2) {
    return num1 > num2 ? num1 : num2;
  }
  console.log(htSize.height);
  console.log(htSize.width);
  var nScale = min(htSize.width, htSize.height) / 550;
  var move = (1 - nScale) * 150;
  console.log(nScale);
  var hat = new collie.DisplayObject({
    //TODO: make sure the width and the height is 300
    width: 300,
    height: 300,
    x: (htSize.width - 300) / 2,
    y: htSize.height / 10 - move,
    angle: 0,
    zIndex: 1,
    useEvent: true,
    backgroundImage: "hat",
    scaleX: nScale,
    scaleY: nScale,
    opacity: 1,
    //TODO: change this param to change the click area; you can use this tool : http://jindo.dev.naver.com/collie/tool/hitarea.html
    hitArea: [[15, 280],[67, 290],[124, 293],[184, 299],[198, 295],[269, 271],[210, 266],[196, 231],[177, 213],[189, 188],[157, 144],[156, 133],[181, 117],[194, 98],[181, 89],[143, 79],[148, 111],[89, 134],[88, 142],[117, 173],[90, 186],[54, 275],[17, 277]],
    scale: nScale
  }).addTo(oLayer);

  var personX = (htSize.width - 300) / 2;
  var personY = htSize.height - 430 * nScale - move;
  var person = new collie.DisplayObject({
    //TODO: make sure the width is 300 and height is 450
    width: 300,
    height: 350,
    x: personX,
    y: personY,
    angle: 0,
    zIndex: 0,
    useEvent: true,
    backgroundImage: "person",
    scaleX: nScale,
    scaleY: nScale,
    opacity: 1,
    hitArea: [[11, 426],[39, 281],[98, 200],[71, 178],[60, 139],[39, 112],[62, 84],[73, 91],[114, 45],[186, 51],[224, 92],[249, 90],[259, 115],[230, 144],[207, 191],[248, 234],[279, 326],[279, 435],[24, 425]],
    scale: nScale
  }).addTo(oLayer);

  var wordX = personX + 230 * nScale;
  var wordOutX = htSize.width + 10;

  var nohat = new collie.DisplayObject({
    //TODO: make sure the width is 300 and height is 450
    width: 300,
    height: 300,
    x: wordOutX,
    y: personY,
    angle: 0,
    zIndex: 2,
    useEvent: false,
    backgroundImage: "noHatWord",
    scaleX: nScale,
    scaleY: nScale,
    opacity: 1,
    scale: nScale
  }).addTo(oLayer);

  var dragMe = new collie.DisplayObject({
    //TODO: make sure the width is 300 and height is 450
    width: 300,
    height: 300,
    x: wordX,
    y: htSize.height / 10 - move,
    angle: 0,
    zIndex: 3,
    useEvent: false,
    backgroundImage: "dragWord",
    scaleX: nScale,
    scaleY: nScale,
    opacity: 1,
    scale: nScale
  }).addTo(oLayer);

  var outLeftX = -move - 300 * nScale;
  var LeftY = personY - top * nScale;
  var inLeftX = -move;
  var hatWord = new collie.DisplayObject({
    //TODO: make sure the width and the height is 300
    width: 300,
    height: 300,
    x: outLeftX,
    y: LeftY,
    angle: 0,
    zIndex: 3,
    useEvent: true,
    backgroundImage: "hatWord",
    scaleX: nScale,
    scaleY: nScale,
    opacity: 1,
    //TODO: change this param to change the click area; you can use this tool : http://jindo.dev.naver.com/collie/tool/hitarea.html
    hitArea: [[18, 181],[70, 230],[134, 242],[197, 230],[222, 203],[226, 108],[190, 27],[125, 1],[50, 11],[8, 70],[7, 136]],
    scale: nScale
  }).addTo(oLayer);

  var noHurt = new collie.DisplayObject({
    //TODO: make sure the width and the height is 300
    width: 300,
    height: 300,
    x: outLeftX,
    y: personY,
    angle: 0,
    zIndex: 3,
    useEvent: true,
    backgroundImage: "nohurt",
    scaleX: nScale,
    scaleY: nScale,
    opacity: 1,
    scale: nScale
  }).addTo(oLayer);

  function showHatWord() {
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", hatWord, 200, {
      set : ["x", "y"],
      to : [inLeftX, LeftY]
    });
  }

  function showNoHat() {
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", nohat, 100, {
      set : ["x", "y"],
      to : [wordX, personY]
    });
    isShowNoHat = true;
  }

  function removeNoHat() {
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", nohat, 100, {
      set : ["x", "y"],
      to : [wordOutX, personY]
    });
    isShowNoHat = false;
  }

  function removeDrag() {
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", dragMe, 100, {
      set : ["x", "y"],
      to : [wordOutX, htSize.height / 10 - move]
    });
    isShowDrag = false;
  }

  function showNoHurt() {
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", noHurt, 100, {
      set : ["x", "y"],
      to : [inLeftX, personY]
    });
    isShowNoHurt = true;
  }

  function removeNoHurt() {
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", noHurt, 100, {
      set : ["x", "y"],
      to : [outLeftX, personY]
    });
    isShowNoHurt = false;
  }

  function showWord() {
    new collie.DisplayObject({
      width : htSize.width,
      height : htSize.height,
      x : 0,
      y : 0,
      zIndex: 4,
      opacity: 0.9,
      backgroundColor : 'black'
    }).addTo(oLayer);
    var oText = new collie.Text({
      x : 50,
      y : htSize.height,
      width : htSize.width - 100,
      fontSize : 30,
      zIndex: 5,
      fontColor : "#ffffff"
    }).addTo(oLayer);
    num = getNum();
    oText.text(data[num].name + ":\n" + data[num].content);
    var oTimer = collie.Timer.timeline();
    oTimer.add(0, "transition", oText, 2000, {
      set : ["x", "y"],
      to : [50, 50]
    });
    box = new collie.DisplayObject({
      width : 200,
      height : 50,
      x : (htSize.width - 200) / 2,
      y : htSize.height,
      zIndex: 5,
      backgroundColor : 'red',
      useEvent: true,
      hitArea: [[0,0], [200, 0], [200, 50], [0, 50]]
    }).addTo(oLayer);
    var urlText = new collie.Text({
      x : (htSize.width - 120) / 2,
      y : htSize.height,
      width : 200,
      fontSize : 30,
      zIndex: 6,
      fontColor : "#ffffff"
    }).addTo(oLayer);
    urlText.text("go there!");

    oTimer.add(1900, "transition", box, 100, {
      set : ["x", "y"],
      to : [(htSize.width - 200) / 2, htSize.height - 100]
    });
    oTimer.add(1900, "transition", urlText, 100, {
      set : ["x", "y"],
      to : [(htSize.width - 120) / 2, htSize.height - 95]
    });
  }

  function getNum() {
    return Math.floor(Math.random() * 4);
  }

  collie.Renderer.addLayer(oLayer);
  collie.Renderer.load(document.getElementById("container"));
  collie.Renderer.start();
});

