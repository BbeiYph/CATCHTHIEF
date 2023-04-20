//---------- 参数定义 -----------

let sone = null;//胜利音乐
let whoWin = ''; //谁胜利可选值'police|thief'


const gridW = 30; //棋盘格子宽
const gridH = 30;  //棋盘格子高
const row = 15; //棋盘行数
const col = 20; //棋盘列数


let thiefImg = null;//小偷图片
let thiefXPos = 30;//小偷横坐标
let thiefYPos = 0;//小偷纵坐标
const stepLen = 2; //小偷移动步长（速度）
let dir = stepLen;  //记录小偷的移动方向

let policeImg = null;//警察图片 
let policeXPos = 0;//警察横坐标
let policeYPos = 0;//警察纵坐标
let policeStepLen = 2;//警察移动步长基数
let policeDir = 0; //警察动态移动步长（速度）
let policeMove = 1  //是正向移动还是反向移动

let btnSpeed = 0;  //计算点击按钮的速率
let lastTime = null


let interval = null;//循环句柄
const moveTime = 36;//循环时间

//---------- dom节点 -----------
const startBtn = document.getElementById('start-btn');
const clickBtn = document.getElementById('clickBtn');
const restartBtn = document.getElementById('restart-btn');
const policeProgressNode = document.getElementById('policeProgress');
const policeValNode = document.getElementById('policeVal');
const thiefWinGifNode = document.getElementById('thiefGif'); //小偷胜利动图
const policeWinGifNode = document.getElementById('policeGif'); //警察胜利动图

//---------- 逻辑处理 -----------

//预加载图片
function preload() {
    song = loadSound('./resources/胜利配乐.mp3');
    thiefImg = loadImage('./resources/thief.png');
    policeImg = loadImage('./resources/police.png');
}

//初次调用
function setup() {
    // 1. 绘制画布, col + 2 是跑道的30个格子+左右两边通道的2个格子
    // createCanvas( col * gridW, row * gridH).parent('gameCanvas')
    createCanvas(( col + 2 ) * gridW, row * gridH).parent('gameCanvas')
}

function draw() {

    background('#fff');

    // 2. 绘制格子盘，定义棋盘的行列和格子的宽高
    // rect(0*gridW, 0*gridH, gridW, gridH);
    // rect(0*gridW, 1*gridH, gridW, gridH);
    // rect(1*gridW, 0*gridH, gridW, gridH);
    // rect(1*gridW, 1*gridH, gridW, gridH);

    // i从第二列开始，第一列留给通道
    for (let i = 1; i < col + 1 ; i++) {
        for (let j = 0; j < row; j++) {
            fill('pink')
            rect(i * gridW, j * gridH, gridW, gridH-1);
        }
    }

    // 去掉边框
    noStroke();


    /**
     *  3. 绘制通道
     *  在跑道的分割处绘制一些粉色的小矩形营造出通道的感觉
     *  第一行在左边，第二行在右边，第三行在左边，以此类推。。
     */
    // rect(0, 1 * gridH, gridW, 3)
    // rect((col + 1)*gridW, 2 * gridH, gridW, 3)
    // rect(0, 3 * gridH, gridW, 3)
    // rect((col + 1)*gridW, 4 * gridH, gridW, 3)
    for (let i = 1; i < row; i++) {
        fill('pink');
        (i % 2 === 0) ? rect((col + 1) * gridW, gridH * i - 1, gridW, 3) : rect(0, gridH * i - 1, gridW, 3);
    }

    /**
    * 4. 绘制小偷和警察
    *    1）定义小偷和警察的图片，预加载图片
    *    2）定义小偷和警察的初始横坐标，纵坐标，初始小偷比警察多一个格子 （调整坐标和图片高宽让警察和小偷都能占满一个格子）
    */
    image(thiefImg, thiefXPos, thiefYPos - 5, gridW, gridH + 5);
    image(policeImg, policeXPos, policeYPos - 20, gridW, gridH + 25);

    // 5. 绘制终点
    fill(0, 0, 0);
    textSize(12)
    text("终点", (col + 1) * gridW + 2, row * gridH - 10);

    policeValNode.innerText = policeProgressNode.value = btnSpeed < 0.05 ? 0.00 : btnSpeed.toFixed(2);


    if (whoWin === 'police') {
      fill(255, 0, 0);
      textSize(30)
      text("恭喜你抓住小偷啦，警察胜利喽！", col * gridW / 6, 60);
    }
    if (whoWin === 'thief') {
      fill(255, 0, 0);
      textSize(30)
      text("小样，还想抓住我，哈哈哈", col * gridW / 5, 60);
    }
}


//监听开始游戏事件
startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    dir = stepLen;
    //小偷运动循环体
    interval = setInterval(() => {
      //小偷跑步逻辑
      thiefXPos += dir;
      //小偷跑到最后一列时，改变方向，跳转到下一行
      if (thiefXPos >= (col + 1) * gridW) {
        thiefXPos = (col + 1) * gridW - stepLen
        dir = -stepLen
        thiefYPos += gridH
      } else if (thiefXPos < 0) {
        //小偷跑到第一列时，改变方向，跳转到下一行
        thiefXPos = -stepLen
        dir = stepLen
        thiefYPos += gridH
      }


      /**
       * 警察跑步逻辑，根据两次按钮点击的时间间隔判断，间隔越短速度越快
       */
      const now = Date.now()
      btnSpeed = lastTime ? Math.min(100/(now-lastTime),1) : 0
      policeDir = btnSpeed < 0.05 ? 0 : btnSpeed + policeStepLen
      policeXPos = policeMove > 0 ?  policeDir + policeXPos : policeXPos-policeDir
      //警察的改变方向逻辑
      if (policeXPos >= (col + 1) * gridW) {
        policeXPos = (col + 1) * gridW - stepLen
        policeMove = -1
        policeYPos += gridH
      } else if (policeXPos < 0) {
        policeXPos = 1
        policeMove = 1
        policeYPos += gridH
      }


      //贼胜利逻辑
      if (thiefYPos >= row * gridH) {
        winLogicFunc('thief')
      }
      //警察胜利逻辑
      if (policeYPos === thiefYPos && (policeMove > 0 && policeXPos >= thiefXPos || policeMove < 0 && Math.abs(policeXPos) <= thiefXPos)) {
        winLogicFunc('police')
      }
    }, moveTime);

});

//监听狂点按钮
clickBtn.addEventListener('click', ()=>{
  const now = Date.now()
  lastTime = now
})


//胜利逻辑函数
function winLogicFunc(who) {
  restartBtn.disabled = false
  if (who == 'thief' || who == 'police') {
    clearInterval(interval);
    song.play();
    whoWin = who
    noLoop();
    (who === 'thief' ? thiefWinGifNode : policeWinGifNode).style.visibility = 'visible';
  }
}

//重新开始游戏
restartBtn.addEventListener('click', () => {
  thiefWinGifNode.style.visibility = 'hidden';
  policeWinGifNode.style.visibility = 'hidden';
  // 重新开始游戏
  startBtn.disabled = false;
  restartBtn.disabled = true;
  thiefXPos = 40;
  thiefYPos = 0;
  policeXPos = 0;
  policeYPos = 0;
  whoWin = '';
  policeDir = 0;
  policeMove = 1;
  btnSpeed = 0;
  lastTime = null
  loop();
});


window.onload = function() { // 阻止双击放大 
  var lastTouchEnd = 0;
   document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) { 
  event.preventDefault(); 
  } });
   document.addEventListener('touchend', function(event) { 
  var now = (new Date()).getTime(); if (now - lastTouchEnd <= 300) {
   event.preventDefault(); 
  } lastTouchEnd = now;
   }, false); 
  // 阻止双指放大 
  document.addEventListener('gesturestart', function(event) { event.preventDefault(); }); }
  
  document.body.addEventListener('touchmove', function (e) {
  e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
 }, {passive: false});
