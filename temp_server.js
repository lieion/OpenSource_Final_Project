const express = require('express')
const cors=require("cors");
const app = express()
const port = 3000
const bodyParser= require('body-parser')


app.use(bodyParser.urlencoded({extended: true})) 
app.use(cors());

app.use(express.json()) // for parsing application/json
app.use(express.static('public'))
let userInfo = []; //유저 로그인 정보

/*
    excel로 json 변환해서 카페 메뉴 정보를 txt파일로 폴더에 넣은 뒤 불러와서 array에 넣어주는 작업 예정
*/


//개발용으로 확인 용
app.get('/signup', (req, res) => {
    res.send(userInfo);
})

app.post('/signup', (req, res) => {
    let state=0;
    console.log("here");
    console.log(req.body);
    //학번 검사를 통해 이미 회원가입을 했는지 확인
    userInfo.forEach(chat => {
        if(chat.student_number===req.body.student_number){
            state=1;
        }
    });

    //존재한다면?
    if(state===1){
        console.log("이미 존재");
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

app.post('/logins',(req,res)=>{
    let state=0;
    console.log("logins");
    console.log(req.body);
    //학번 존재 여부 확인
    userInfo.forEach(chat => {
        if(chat.student_number===req.body.student_number){
            //비밀번호 일치여부 확인
            if (chat.password===req.body.passw){
                state=chat.student_number;
            }
        }
    })
    //일치하는 경우
    if(state!==0){
        console.log("welcome")
        res.status(200).send(state);
    }
    //일치하지 않는 경우
    else{
        console.log("non")
        res.status(400).end();
    }
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


})