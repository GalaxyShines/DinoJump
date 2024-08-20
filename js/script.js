// 全局变量初始化
var nowStatus = 0 // 当前游戏状态{-1：游戏结束，0：游戏未开始（暂停中），1：游戏进行中}
var nowTime = 0 // 当前分数，用于全局访问
var scoreElem // 初始化计分对象变量，用于全局访问
var scoreAddInterval // 初始化计分对象计时器变量，用于全局访问
var spaceAvailable = true // 初始化按键可用状态

/**
 * 人物与障碍物碰撞检测
 * @param {*} element1 碰撞检测对象1
 * @param {*} element2 碰撞检测对象2
 * @param {*} callback 发生碰撞的回调函数
 * @returns 
 */
function checkOverlap(element1, element2, callback) {
    // 定义一个函数来检查两个元素是否重合
    function isOverlapping() {
      const rect1 = element1.getBoundingClientRect();
      const rect2 = element2.getBoundingClientRect();
  
      return !(rect1.right < rect2.left ||
               rect1.left > rect2.right ||
               rect1.bottom < rect2.top ||
               rect1.top > rect2.bottom);
    }
  
    // 使用 setInterval 定时检查两个元素是否重合
    const intervalId = setInterval(() => {
      if (isOverlapping()) {
        // 如果两个元素重合，执行回调函数
        callback();
      }
    }, 100); // 每100毫秒检查一次
  
    // 返回一个函数，用于停止监听
    return () => clearInterval(intervalId);
  }
  
  // 使用示例：
  
  // 定义一个回调函数，当两个元素重合时执行
  function onOverlap() {
    console.log('两个元素重合了');
    nowStatus=-1
    scoreElem.over()
  }
  
  // 开始监听两个元素是否重合
  
/**
 * 障碍物生成 对象
 */
class obstacle{
    /**
     * 
     * @param {Number} diff 当前难度(0~9)
     */
    constructor(diff){
        this.diff = diff // 设置当前难度
        let obs = document.createElement('div') // 创建障碍物对象
        const minHeight = 8 // 设置障碍物最低高度
        const MaxHeight = 15 // 设置障碍物最高高度
        const height = Math.floor(Math.random() * (MaxHeight-minHeight+1))+minHeight // 在设置的高度区间中获取随机高度
        const minWidth = 3 // 设置障碍物最小宽度
        const maxWidth = 5 // 设置障碍物最大宽度
        const width = Math.floor(Math.random() * (maxWidth-minWidth+1))+minWidth // 在设置的宽度区间中获取随机宽度
        // 障碍物CSS属性设置
        obs.style.position='absolute' // 绝对定位
        obs.style.height = `${height}%` // 高度设置
        obs.style.width = `${width}%` // 宽度设置
        obs.style.bottom = '0' // 底部距离设置
        obs.style.right = '0%' // 右侧距离设置
        obs.style.backgroundColor = 'black' // 设置填充色
        // 障碍物对象属性设置
        obs.className = `speed${diff}` // 绑定动画类

        gbId('content').appendChild(obs) // 在画面中添加障碍物对象
        checkOverlap(gbId('ball'), obs, onOverlap); // 设置障碍物与人物碰撞检测
        setTimeout(() => { // 4000ms后从画面中移除障碍物
            gbId('content').removeChild(obs) // 移除障碍物
        }, 4000);
    }
}

/**
 * 人物动作与动画控制
 */
function animateDemo() {
    const ball = document.getElementById('ball'); // 获取人物对象
    let startTime = new Date().getTime() // 获取当前时间戳
    function animateUpdate(){
        let nowTime = new Date().getTime()
        if(nowStatus==-1){
            return
        }
        if(nowTime-startTime>500){ // 动画执行完毕时
            spaceAvailable = true // 空格可用状态为可用
            return
        }else if(nowTime-startTime>300){ // 最后200恢复正常速度
            ball.style.bottom = `${startTime+500-nowTime}px`

            setTimeout(() => {
                animateUpdate() // 自调用
            }, 5);
            
        }else if(nowTime-startTime>250){ // 250~300速度较快
            ball.style.bottom = `${(startTime+500-nowTime)+1}px`

            setTimeout(() => {
                animateUpdate() // 自调用
            }, 5);
        }else if(nowTime-startTime>200){ // 200~250速度较快
            ball.style.bottom = `${(nowTime-startTime)+1}px`

            setTimeout(() => {
                animateUpdate() // 自调用
            }, 5);
        }else if(nowTime-startTime>=0){ // 0~200速度较快
            ball.style.bottom = `${nowTime-startTime}px`

            setTimeout(() => {
                animateUpdate() // 自调用
            }, 5);
        }
    }
    animateUpdate()
}

/**
 * 空格点击触发事件
 */
function spaceEvent() {
    animateDemo(new Date().getTime()) // 空格点击触发人物跳跃动画
    new obstacle(0) // 生成障碍物
    spaceAvailable = false // 空格可用状态为不可用
}

/**
 * 按键监听事件
 * @param {*} e 
 */
function spaceListener(e) {
    if (e.code == 'Space'&&nowStatus==1) { // 人物跳跃
        e.preventDefault() // 取消空格默认事件
        if (spaceAvailable) { // 在空格可用时触发空格点击事件
            spaceEvent() // 执行空格点击触发事件
        }
    }else if(e.code=='KeyC'&&nowStatus==1){ // 人物下蹲
        gbId('ball-svg-leg-1').style.display='none' // 不显示人物左腿
        gbId('ball-svg-leg-2').style.display='none' // 不显示人物右腿
        gbId('ball-svg').setAttribute('height', '85') // 调整画布大小，去除腿部高度
        setTimeout(() => { // 人物下蹲时长500ms，设置定时函数
            gbId('ball-svg-leg-1').style.display='block' // 显示人物左腿
            gbId('ball-svg-leg-2').style.display='block' // 显示人物右腿
            gbId('ball-svg').setAttribute('height', '100') // 调整画布大小，添加腿部高度
        }, 500);
    }
}

window.onload = function () {

}

/**
 * 获取指定ID对象方法
 */
function gbId(name) {
    return document.getElementById(name) // 返回通过ID获取到的DOM对象
}

/**
 * 点击开始游戏事件
 */
function startGame() {
    gbId('start-button').style.display = 'none' // 隐藏“开始游戏”按钮
    scoreElem = new score(0) // 创建计时对象，计时起始值为0
    scoreElem.start() // 计时对象开始计时

}

/**
 * consoleClick 控制台按钮点击事件（暂停、继续）
 */
function consoleClick() {
    switch (nowStatus) { // 判断当前游戏状态
        case 1: {  // 游戏进行中
            scoreElem.stop() // 暂停游戏
                .then(res => {
                    nowTime = res // 返回计时器暂停方法返回的游戏分数，作为下一次创建计时对象的起始值
                })
                .catch(error => {
                    console.log(error)
                })
            break
        }
        case 0: { // 游戏暂停中
            scoreElem = new score(nowTime) // 继续游戏，创建新计时对象
            gbId('console-button').innerHTML = '暂停' // 更改控制台按钮文字
            scoreElem.start() // 计时对象开始计时
            break
        }
    }
}

/**
 * score 分数管理
 */
class score {
    /**
     * 
     * @param {Number} time 起始时间
     */
    constructor(time) {
        this.time = time
    }
    /**
     * 开始计时
     */
    start() {
        gbId('console-button').style.display = 'flex' // 显示控制台按钮
        nowStatus = 1 // 设置游戏状态为游戏中
        // 进行分数的自增
        scoreAddInterval = setInterval(() => {
            this.time++
            // 根据分数位数补全0
            if (this.time >= 1000000) {
                gbId('score').innerHTML = this.time
            } else if (this.time >= 100000) {
                gbId('score').innerHTML = '0' + this.time
            } else if (this.time >= 10000) {
                gbId('score').innerHTML = '00' + this.time
            } else if (this.time >= 1000) {
                gbId('score').innerHTML = '000' + this.time
            } else if (this.time >= 100) {
                gbId('score').innerHTML = '0000' + this.time
            } else if (this.time >= 10) {
                gbId('score').innerHTML = '00000' + this.time
            } else if (this.time >= 0) {
                gbId('score').innerHTML = '000000' + this.time
            }

        }, 10);
        document.addEventListener('keydown', spaceListener) // 按键监听事件添加
    }
    /**
     * 暂停游戏与计时
     * @returns {Promise<Number>}
     */
    stop() {
        return new Promise((resolve, reject) => {
            if (nowStatus === 1) { // 判断当前状态是否为游戏中
                clearInterval(scoreAddInterval) // 清除计分器
                nowStatus = 0 // 修改当前状态为暂停中
                gbId('console-button').innerHTML = '继续' // 更改控制台按钮文字
                document.removeEventListener('keydown', spaceListener) // 按键监听事件移除
                resolve(this.time) // 返回当前分数，作为下一次继续游戏时的初始分数
            } else { // 当前状态不是游戏中
                reject(new Error('now status not is stop'))
            }
        })
    }
    /**
     * 结束游戏与计时
     */
    over(){
        clearInterval(scoreAddInterval) // 清除计分器
        gbId('overTitle').style.display='flex' // 显示游戏结束文字
        document.removeEventListener('keydown', spaceListener) // 按键监听事件移除
    }
}