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
let blueportMenu=new Array();
let cafenamuMenu=new Array();
let pandorothyMenu=new Array();
let blue_orderList=[];
let namu_orderList=[];
let pandorothy_orderList=[];

let blue_orderList_fin=[];
let namu_orderList_fin=[];
let pandorothy_orderList_fin=[];


//개발용으로 확인 용
app.get('/signup', (req, res) => {
    res.send(userInfo);
})

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
        newUser.banned=0;//banned 0 normal, 1 advise(alert to manager), 2 banned (can't login)
        userInfo.push(newUser);
        res.status(200).end();
    }
    
})

app.post('/getBan',(req,res)=>{
    let ret = JSON.stringify(userInfo.filter((n)=>n.logstate===1))
    res.send(ret);
})

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


//blue port에 대해서 주문 정보를 보내준다.
app.post('/blueportOrder', (req, res) => {
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
            for (let i=0;i<blueportMenu.length; i++)
            {
                result+=ord.order[i]*blueportMenu[i][2];
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
            for (let i=0;i<blueportMenu.length; i++)
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
            for (let i=0;i<blueportMenu.length; i++)
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
app.get('/blueportMenu', (req, res) => {
    res.send(JSON.stringify(blueportMenu));
})  

app.get('/cafenamuMenu', (req, res) => {
    res.send(JSON.stringify(cafenamuMenu));
})

app.get('/pandorothyMenu', (req, res) => {
    res.send(JSON.stringify(pandorothyMenu));
})

app.get('/blueportOrder', (req, res) => {
    res.send(JSON.stringify(blue_orderList));
})  

app.get('/cafenamuOrder', (req, res) => {
    res.send(JSON.stringify(namu_orderList));
})

app.get('/pandorothyOrder', (req, res) => {
    res.send(JSON.stringify(pandorothy_orderList));
})

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
    else{
        res.status(400).end();
    }
})


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
    newUser.banned=0;//banned 0 normal, 1 advise(alert to manager), 2 banned (can't login)
    userInfo.push(newUser);

    let newUserC=new Object();
    newUserC.student_number="9000000001";
    newUserC.password="qwerty123!";
    newUserC.class="cafemanager";
    newUserC.logstate=0;
    newUserC.banned=0;//banned 0 normal, 1 advise(alert to manager), 2 banned (can't login)
    userInfo.push(newUserC);

    let newUserS=new Object();
    newUserS.student_number="2018311485";
    newUserS.password="qwerty123!";
    newUserS.class="education";
    newUserS.logstate=0;
    newUserS.banned=0;//banned 0 normal, 1 advise(alert to manager), 2 banned (can't login)
    userInfo.push(newUserS);
    
    /*
    json 변환해서 카페 메뉴 정보를 폴더에 넣은 뒤 불러와서 array에 넣어주는 작업
    */
    fs.readFile('./public/json/blueport.json', (err, data) => {  
        if (err) throw err
        temp=JSON.parse(data)
        temp.forEach((item)=>{
            blueportMenu.push([item.mId,item.name,parseInt(item.price)])
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