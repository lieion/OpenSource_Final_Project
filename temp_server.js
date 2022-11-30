const express = require('express');
const cors=require("cors");
const app = express()
const port = 3000
const bodyParser= require('body-parser')
const fs = require("fs");
app.use(bodyParser.urlencoded({extended: true})) 
app.use(cors());

app.use(express.json()) // for parsing application/json
app.use(express.static('public'))
let userInfo = []; //유저 로그인 정보
let bluepotMenu=new Array();  //Blue pot 메뉴 정보
let cafenamuMenu=new Array(); //카페 나무 메뉴 정보
let pandorothyMenu=new Array(); //팬도로시 메뉴 정보
let blue_orderList=[]; //blue pot 주문 정보 
let namu_orderList=[]; //
let pandorothy_orderList=[];

/*
    유저 정보 객체 정보 (user Info)
    student_number : 학번 및 아이디
    password= 비밀번호
    class : 유저 직군
    logstate : 0 유저 밴 정보

    메뉴 정보 객체 정보 (cafenamuMenu)
    mid : 메뉴 코드
    name : 이름
    price : 가격


    주문 정보의 객체 정보 (ex. blue_orderList)
    user : 주문자 학번
    market : 주문 대상 가게
    order : 주문 개수
    menu_price : 메뉴 당 가격
    order_time : 주문 시간
    order_price : 주문 총 가격
    order_menu : 주문 가게 메뉴

*/

//개발용으로 가입 유저 확인 용
app.get('/signup', (req, res) => {
    res.send(userInfo);
})

//회원가입
app.post('/signup', (req, res) => {
    let state=0;
    //학번 검사를 통해 이미 회원가입을 했는지 확인
    userInfo.forEach(chat => {
        if(chat.student_number===req.body.student_number){
            state=1;
        }
    });

    //존재한다면?
    if(state===1){
        res.status(400).end();
    }
    else{
        let newUser=new Object();
        newUser.student_number=req.body.student_number;//학번
        newUser.password=req.body.passw;//비밀번호
        newUser.class=req.body.classification;//분류
        newUser.logstate=0;//로그인 상태 (변경 가능)
        
        userInfo.push(newUser);
        res.status(200).end();
    }
    
})


//밴 된 유저 목록을 보낸다.
app.post('/getBan',(req,res)=>{
    let ret = JSON.stringify(userInfo.filter((n)=>n.logstate===1))
    res.send(ret);
})


//로그인 요청 정보를 POST로 받는다.
app.post('/logins',(req,res)=>{
    let ret=new Object();
    ret.state=0;
    ret.auth="";
    //학번 존재 여부 확인
    userInfo.forEach(chat => {
        if(chat.student_number===req.body.student_number){
            //비밀번호 일치여부 확인
            if (chat.password===req.body.passw){
                ret.state=chat.student_number;
                ret.auth=chat.class;
                ret.ban=chat.logstate;
            }
        }
    })
    //일치하는 경우
    if(ret.state!==0){
        console.log("welcome")
        res.status(200).send(JSON.stringify(ret));
    }
    //일치하지 않는 경우
    else{
        console.log("non")
        res.status(400).end();
    }
})

//통합적으로 주문 요청
app.post('/order',(req,res)=>{ //주문
    let inputOrder=new Object();
    inputOrder.user=req.body.student_number;
    inputOrder.market=parseInt(req.body.market);
    inputOrder.order=req.body.price;
    inputOrder.menu_price=req.body.menu_price;
    inputOrder.order_time=new Date();
    inputOrder.order_price=parseInt(req.body.total)
    inputOrder.order_menu=req.body.menu;
    if(inputOrder.order_price===0 || req.body.student_number===""){
        res.status(400).end()
    }
    else{
        inputOrder.isDone=0;
        if(inputOrder.market===2){
            
            blue_orderList.push(inputOrder)
        }
        else if(inputOrder.market===1){
            namu_orderList.push(inputOrder)
        }
        else{
            pandorothy_orderList.push(inputOrder)
        }
        res.status(200).end();
    }
})


//blue pot에 대해서 주문 정보를 보내준다.
app.post('/bluepotOrder', (req, res) => {
    console.log(req.body)
    let sid=req.body.id;
    let ret=[];
    let retno=1;
    let menu=[];
    blue_orderList.forEach(ord=>{
        if(ord.user===sid){
            let result=0;
            let tempObj=new Object();
            tempObj.no=retno;
            retno+=1;
            tempObj.sid=sid;
            tempObj.menu=ord.order_menu;
            tempObj.menu_price=ord.menu_price;
            tempObj.order=ord.order;
            for (let i=0;i<bluepotMenu.length; i++)
            {
                result+=ord.order[i]*bluepotMenu[i][2];
            }
            tempObj.order_price=result
            tempObj.orderStatus=ord.isDone;
            ret.push(tempObj);
        }
    })
    res.send(JSON.stringify(ret));
})


//cafe namu에 대해서 주문 정보를 보내준다.
app.post('/cafeNamuOrder', (req, res) => {
    console.log(req.body)
    let sid=req.body.id;
    let ret=[];
    let retno=1;
    let menu=[];
    namu_orderList.forEach(ord=>{
        if(ord.user===sid){
            let result=0;
            let tempObj=new Object();
            tempObj.no=retno;
            retno+=1;
            tempObj.sid=ord.user;
            tempObj.menu=ord.order_menu;
            tempObj.menu_price=ord.menu_price;
            tempObj.order=ord.order;
            for (let i=0;i<bluepotMenu.length; i++)
            {
                result+=ord.order[i]*cafenamuMenu[i][2];
            }
            tempObj.order_price=result
            tempObj.orderStatus=ord.isDone;
            ret.push(tempObj);
        }
    })
    res.send(JSON.stringify(ret));
})

//pandorothy에 대해서 주문 정보를 보내준다.
app.post('/pandorothyOrder', (req, res) => {
    console.log(req.body)
    let sid=req.body.id;
    let ret=[];
    let retno=1;
    let menu=[];
    pandorothy_orderList.forEach(ord=>{
        if(ord.user===sid){
            let result=0;
            let tempObj=new Object();
            tempObj.no=retno;
            retno+=1;
            tempObj.sid=sid;
            tempObj.menu=ord.order_menu;
            tempObj.menu_price=ord.menu_price;
            tempObj.order=ord.order;
            for (let i=0;i<bluepotMenu.length; i++)
            {
                result+=ord.order[i]*pandorothyMenu[i][2];
            }
            tempObj.order_price=result
            tempObj.orderStatus=ord.isDone;
            ret.push(tempObj);
        }
    })
    res.send(JSON.stringify(ret));
})


/* 개발용 */
app.get('/bluepotMenu', (req, res) => {
    res.send(JSON.stringify(bluepotMenu));
})  

app.get('/cafenamuMenu', (req, res) => {
    res.send(JSON.stringify(cafenamuMenu));
})

app.get('/pandorothyMenu', (req, res) => {
    res.send(JSON.stringify(pandorothyMenu));
})

app.get('/bluepotOrder', (req, res) => {
    res.send(JSON.stringify(blue_orderList));
})  

app.get('/cafenamuOrder', (req, res) => {
    res.send(JSON.stringify(namu_orderList));
})

app.get('/pandorothyOrder', (req, res) => {
    res.send(JSON.stringify(pandorothy_orderList));
})
/*  개발용 */



app.post('/banUser',(req,res) => {
    console.log("BANNNNN");
    for (let i=0; i<userInfo.length; i++){
        console.log(userInfo[i].student_number);
        console.log(req.body.id);
        if(userInfo[i].student_number===req.body.id){
            userInfo[i].logstate = 1;
        }
    }
    console.log(userInfo);
    res.status(200).end();
})



//매니저 페이지에 주문 정보를 보내준다.
app.post('/mangerPage', (req, res) => {
    let sid=parseInt(req.body.id);
    let ret=[];
    let retno=1;
    //카페 나무에게 할당된 학번인 경우
    if(sid>=9000000000 && sid<=9099999999) {
        namu_orderList.forEach(ord=>{
            let tempObj=new Object();
            
            tempObj.no=retno;
            retno+=1;
            tempObj.sid=ord.user;
            tempObj.menu=ord.order_menu;
            tempObj.menu_price=ord.menu_price;
            tempObj.order=ord.order;
            tempObj.order_price=ord.order_price
            tempObj.orderStatus=ord.isDone;
            tempObj.order_time=ord.order_time;
            ret.push(tempObj);
            
        })
        res.send(JSON.stringify(ret));
    }
    //블루 포트에 할당된 학번인 경우
    else if(sid>=9100000000 && sid<=9199999999){
        blue_orderList.forEach(ord=>{
            let tempObj=new Object();
            tempObj.no=retno;
            retno+=1;
            tempObj.sid=ord.user;
            tempObj.menu=ord.order_menu;
            tempObj.menu_price=ord.menu_price;
            tempObj.order=ord.order;
            tempObj.order_price=ord.order_price
            tempObj.orderStatus=ord.isDone;
            tempObj.order_time=ord.order_time;
            ret.push(tempObj);
            
        })
        res.send(JSON.stringify(ret));
    }
    //팬도로시에 할당된 학번인 경우
    else if(sid>=9200000000 && sid<=9299999999){
        pandorothy_orderList.forEach(ord=>{
            let tempObj=new Object();
            tempObj.no=retno;
            retno+=1;
            tempObj.sid=ord.user;
            tempObj.menu=ord.order_menu;
            tempObj.menu_price=ord.menu_price;
            tempObj.order=ord.order;
            tempObj.order_price=ord.order_price
            tempObj.orderStatus=ord.isDone;
            tempObj.order_time=ord.order_time;
            ret.push(tempObj);
            
        })
        res.send(JSON.stringify(ret));
    }
    //오류 감지
    else{
        res.status(400).end();
    }
})

//orderlist의 isDone을 변화시킨다. => managerPage에서 제조중=> 완성
app.post('/moveDone', (req, res) => {
    let sid=req.body.id;
    let idx=req.body.idx;
    if(sid>=9000000000 && sid<=9099999999) {
        namu_orderList[idx-1].isDone+=1;
    }
    else if(sid>=9100000000 && sid<=9199999999){
        blue_orderList[idx-1].isDone+=1;
    }
    else{
        pandorothy_orderList[idx-1].isDone+=1;
    }
    res.status(200).end();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)

    //개발용 유저
    let newUser=new Object();
    newUser.student_number="0000000001";
    newUser.password="qwerty123!";
    newUser.class="engineer";
    newUser.logstate=0;
    
    userInfo.push(newUser);

    let newUserC=new Object();
    newUserC.student_number="9000000001";
    newUserC.password="qwerty123!";
    newUserC.class="cafemanager";
    newUserC.logstate=0;
    
    userInfo.push(newUserC);

    let newUserS=new Object();
    newUserS.student_number="2018311485";
    newUserS.password="qwerty123!";
    newUserS.class="education";
    newUserS.logstate=0;
    
    userInfo.push(newUserS);
    
    /*
    json 변환해서 카페 메뉴 정보를 폴더에 넣은 뒤 불러와서 array에 넣어주는 작업
    */
    fs.readFile('./public/json/bluepot.json', (err, data) => {  
        if (err) throw err
        temp=JSON.parse(data)
        temp.forEach((item)=>{
            bluepotMenu.push([item.mId,item.name,parseInt(item.price)])
        });
    });

    fs.readFile('./public/json/cafenamu.json', (err, data) => {
        if (err) throw err
        temp=JSON.parse(data)
        temp.forEach((item)=>{
            cafenamuMenu.push([item.mId,item.name,parseInt(item.price)])
        });
    });
    fs.readFile('./public/json/pandorothy.json', (err, data) => {
        if (err) throw err
        temp=JSON.parse(data);
        temp.forEach((item)=>{
            pandorothyMenu.push([item.mId,item.name,parseInt(item.price)])
        }); 
    });

})