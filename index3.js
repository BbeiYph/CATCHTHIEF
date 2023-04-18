//---------- 参数定义 -----------
const gridW = 30; //棋盘格子宽
const gridH = 30;  //棋盘格子高
const row = 15; //棋盘行数
const col = 20; //棋盘列数


let thiefImg = null;//小偷图片
let thiefXPos = 30;//小偷横坐标
let thiefYPos = 0;//小偷纵坐标
const stepLen = 4; //小偷移动步长（速度）
let dir = stepLen;  //记录小偷的移动方向

let policeImg = null;//警察图片 
let policeXPos = 0;//警察横坐标
let policeYPos = 0;//警察纵坐标


let interval = null;//循环句柄
const moveTime = 16;//循环时间

//---------- dom节点 -----------
const startBtn = document.getElementById('start-btn');

//---------- 逻辑处理 -----------

//预加载图片
function preload() {
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
}


//监听开始游戏事件
startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    dir = stepLen;
    //小偷运动循环体
    interval = setInterval(() => {
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
    }, moveTime);
  });