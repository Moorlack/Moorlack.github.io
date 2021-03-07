//Константы

const BlockSize = 34;                           //Размер блока в пикселях
const canvas = document.getElementById("snek");
const ctx = canvas.getContext("2d");
let img = document.getElementById("dollar");

//Константы

//Переменные

var Gaming = false;     //Состояние игры
var onbut;              //Состояние нажатия кнопки клавы
var x, y                //Корды головы
var snek = []           //Массив блоков змеи
var xd, yd              //Корды доллара
var Direction           //Направление змеи
var Moving              //Переменная для движения
var block =             //Куда нельзя нажимать при :
{
    "KeyW": [0, 1],
    "KeyS": [0, -1],
    "KeyD": [-1, 0],
    "KeyA": [1, 0],
}
var l=[0]               //Массив длин змеи при собирании доллара
var lastdollar = Number.MAX_VALUE/2     //Счетчик циклов с последнего собранного доллара
var dollarcount = 0                     //Счетчик долларов внутри змеи
var score = 0                           //Кол-во очков на вывод
var tmr = 0                               //Таймер
var speed = 175                          //Скорость змеи
var bestscore = 0

//Переменные

//Функции

//Основные

function _loadFont(){
    var canvas = document.createElement("canvas");
    //Setting the height and width is not really required
    canvas.width = 16;
    canvas.height = 16;
    var ctx = canvas.getContext("2d");

    //There is no need to attach the canvas anywhere,
    //calling fillText is enough to make the browser load the active font

    //If you have more than one custom font, you can just draw all of them here
    ctx.font = "4px '8-bit Limit (BRK)'";
    ctx.fillText("text", 0, 8);
}

function Start() //Функция старта страницы
{
    $(".Button").click(GameStart)       //Нажатие на кнопку = старт игры
    $(document).keypress(ChangeMove)    //Считывание нажатий кнопок движения
    $("#snek").height($(window).height()*0.9)
    $("#snek").width($(window).height()*0.9)
    $(".title").width($(window).height()*0.9)
    $("#snek").css("margin-left", "calc(50% - "+$("#snek").width()/2+"px)")
    $(".title").css("margin-left", "calc(50% - "+$(".title").width()/2+"px)")
    $(".Button").css("margin-top", ""+$("#snek").width()/3+"")
}

function Random(min,max)    //Рандомайзер
{
    return Math.floor(min + Math.random() * (max - min + 1))
}

function GameStart()        //Функция для старта игры
{
    if (Gaming) return   //Проверка на начало игры
    ctx.fillStyle = "#2b2b2b"                                        
    ctx.fillRect(0, 0, 680, 680)   
    Gaming = true        //
    x = Random(1, 19) * BlockSize             //Рандомное местоположение
    y = Random(1, 19) * BlockSize             //
    snek[0]=[x,y]                             //
    var r = Random(-1,1)                                                //Рандомное направление
    Direction = [r, (1 - Math.abs(r)) * ((Random(1, 2) == 1) ? 1 : -1)] //
    ctx.fillStyle = 'yellow'    
    ctx.fillRect(x, y, BlockSize, BlockSize)   //Рисование головы
    SnekMove()                                  //Запуск функции движения
    Dollar()                                        //Создание первого доллара
}

function StopGameRu()
{
    Gaming = false;
    snek.length=0;
    $(".scorec").text(0);
    lastdollar = Number.MAX_VALUE/2 
    speed = 175
    ctx.fillStyle = 'black'
    ctx.textAlign = "center"
    _loadFont()
    ctx.font = "100px '8-bit Limit (BRK)'"
    ctx.fillText("YOU DIED",340,340)
    ctx.fillStyle = 'yellow'
    ctx.font = "90px '8-bit Limit (BRK)'"
    ctx.fillText("YOU DIED",340,340)
    ctx.fillStyle = 'black'
    ctx.font = "55px '8-bit Limit (BRK)'"
    ctx.fillText("Your score:"+score,340,400)
    ctx.fillStyle = 'yellow'
    ctx.font = "50px '8-bit Limit (BRK)'"
    ctx.fillText("Your score:"+score,340,400)
    if(bestscore<score) bestscore = score
    $(".bestc").text(bestscore);
    score = 0;
}

function Win()
{
    Gaming = false;
    snek.length=0;
    $(".scorec").text(0);
    lastdollar = Number.MAX_VALUE/2 
    speed = 175
    ctx.fillStyle = 'black'
    ctx.textAlign = "center"
    _loadFont()
    ctx.font = "100px '8-bit Limit (BRK)'"
    ctx.fillText("YOU WON!",340,340)
    ctx.fillStyle = 'yellow'
    ctx.font = "90px '8-bit Limit (BRK)'"
    ctx.fillText("YOU WON!",340,340)
    ctx.fillStyle = 'black'
    ctx.font = "55px '8-bit Limit (BRK)'"
    ctx.fillText("Your score:"+score,340,400)
    ctx.fillStyle = 'yellow'
    ctx.font = "50px '8-bit Limit (BRK)'"
    ctx.fillText("Your score:"+score,340,400)
    ctx.fillStyle = 'black'
    ctx.font = "11px '8-bit Limit (BRK)'"
    ctx.fillText("HOW DO YOU HACK THIS GAME???",340,500)
    ctx.fillStyle = 'yellow'
    ctx.font = "10px '8-bit Limit (BRK)'"
    ctx.fillText("HOW DO YOU HACK THIS GAME???",340,500)
    score = 0;
}

//Основные

//Игровые

function Dollar()                               //Функция создания доллара
{
    while (true)
    {
        var insnek = false;
        xd = Random(1, 19) * BlockSize
        yd = Random(1, 19) * BlockSize
        for(i=0;i<snek.length;i++)
        {
            if(xd==snek[i][0]&&yd==snek[i][1]) 
            {
                insnek = true;
                break
            }
        }
        if(!insnek) break
    }
    ctx.drawImage(img, xd, yd)

}

function ChangeMove()                                               //Функция проверки движения
{
    if(onbut==false)
    {
        onbut=true
        return
    }
    var ch = block[event.code] || Direction
    if (ch[0] == Direction[0] && ch[1] == Direction[1] ) return;
    switch (event.code)
    {
        case "KeyW":
        {
                Direction = [0, -1]
                break
            }
        case "KeyS":
        {
                Direction = [0, 1]
                break
            }
        case "KeyA":
        {
                Direction = [-1, 0]
                break
            }
        case "KeyD":
        {
                Direction = [1, 0]
                break
            }
        default: { break }
    }
    onbut=false
}

function SnekMove()
{
    Moving = setInterval(function ()
    {
        tmr+=40
        if(tmr<speed) return
        tmr=0

        x = x + BlockSize * Direction[0]    
        y = y + BlockSize * Direction[1]
        if (x > 646) x = 0                  
        if (y > 646) y = 0
        if (x < 0) x = 646
        if (y < 0) y = 646

        onbut=true;
        lastdollar++
        var save_1 = snek[0][0]
        var save_2 = snek[0][1]
        for (i = 1; i < snek.length; i++)
        {
            var zxc = [save_1, save_2]
            if(x==snek[i][0]&&y==snek[i][1])
            {
                StopGameRu()
                clearInterval(Moving)
                return
            }
            save_1 = snek[i][0]
            save_2 = snek[i][1]
            snek[i] = zxc
        }
        if (lastdollar == l[0])
        {
            snek[snek.length] = [1000,1000];
            if (dollarcount>1) 
            {
                for (i = 0; i <= l.length - 1; i++) {
                    l[i] = l[i + 1]
                }
                lastdollar = 0
            }
            dollarcount--;
        }

        snek[0][0] = x                    
        snek[0][1] = y

        if (x == xd && y == yd) {   
                   
            if (lastdollar>l[0])
            {
                l[0] = snek.length
                lastdollar = 0
                dollarcount = 1
            } else
            {
                l[dollarcount] = lastdollar
                dollarcount++
            }
            Dollar();
            score++
            speed=speed-0,3375
            $(".scorec").text(score);  
        }

        ctx.fillStyle = "#2b2b2b"                                        
        ctx.fillRect(0, 0, 680, 680)                                                                            
        ctx.drawImage(img, xd, yd)                      
        ctx.fillStyle = "yellow"                                        
        ctx.fillRect(x, y, BlockSize, BlockSize)                         
        for (i = 1; i <= snek.length-1; i++) {
            ctx.fillRect(snek[i][0], snek[i][1], BlockSize, BlockSize)
            ctx.strokeRect(snek[i][0], snek[i][1], BlockSize, BlockSize)
        }
        console.log(l, lastdollar, dollarcount)
        if(score==399) {
            Win()
            clearInterval(Moving)
            return
        }  
    }, 40)
}

//Игровые

//Функции

$(document).ready(Start)