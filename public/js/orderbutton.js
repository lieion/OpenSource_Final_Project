let tsk=localStorage.getItem('id');
console.log(tsk)
let classing=localStorage.getItem('auth');//education cafemanager engineer
console.log(classing)
let login_state=0
let loginBtnPart=document.getElementById('login');
let signUpPart=document.getElementById('sign-up');
let login_button=document.querySelector("#login");
let signup_btn=document.querySelector("#sign-up");
//로그인 되어있는지 안되어있는지 확인
//로그인 되어있다면 로그인 버튼을 로그아웃 버튼으로 바꾼다. 기능도 달리한다.
if (tsk===undefined || tsk==="0" || tsk===null)
{
    login_state=0;
    loginBtnPart.innerText = 'Login';            
    signUpPart.disabled=false;
    /*log - in btn이 클릭되면 login html로 이동한다*/              
    login_button.addEventListener("click",()=>{
    location.href="./login.html"
    });
    /*sign up btn이 클릭되면 sign-up html로 이동한다*/            
    signup_btn.addEventListener("click",()=>{
        location.href="./sign-up.html"
    });
}
else if(classing==="cafemanager"){ // 카페 관리자의 경우
    login_state=1;
    loginBtnPart.innerText = 'Log-Out';
    signUpPart.innerText="Manager Page";

    /*log - in btn이 클릭되면 login html로 이동한다*/
    login_button.addEventListener("click",()=>{
        localStorage.setItem('id','0');
        location.href="./login.html"
    });

    /*sign up btn이 클릭되면 sign-up html로 이동한다*/
    signup_btn.addEventListener("click",()=>{
        location.href="./myPage.html"
    });
}
else if(classing==="engineer"){ // 엔지니어의 경우
    login_state=1;
    loginBtnPart.innerText = 'Log-Out';
    signUpPart.innerText="Banning";

    /*log - in btn이 클릭되면 login html로 이동한다*/
    login_button.addEventListener("click",()=>{
        localStorage.setItem('id','0');
        localStorage.setItem('auth',"");
        location.href="./login.html"
    });

    /*sign up btn이 클릭되면 sign-up html로 이동한다*/
    signup_btn.addEventListener("click",()=>{
        location.href="./myPage.html"
    });
}
else
{
    login_state=1;
    loginBtnPart.innerText = 'Log-Out';
    signUpPart.innerText="My Page";
    /*log - in btn이 클릭되면 login html로 이동한다*/
    login_button.addEventListener("click",()=>{
        localStorage.setItem('id','0');
        localStorage.setItem('auth',"");
        location.href="./login.html"
    });
    /*sign up btn이 클릭되면 sign-up html로 이동한다*/
    signup_btn.addEventListener("click",()=>{
        location.href="./myPage.html"
    });

}
let tempmarket=localStorage.getItem('market');

// order button을 눌렀을 때
let orderbutton = document.querySelector("#orderbutton");
orderbutton.addEventListener("click", () => {
    if(classing==="education"){
        let total_price = 0;
        let menu_name = Object.keys(menu);
        let menu_price = Object.values(menu);
        for(var i = 0; i < 6; i++){
            total_price += order_list[i] * menu_price[i];
        }
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/order",
            data: {
                student_number: tsk,
                market: tempmarket,
                total: total_price,
                menu: menu_name,
                price: order_list,
                menu_price: menu_price
            },
            success: function (data) {
                alert("주문 완료");
                console.log(data);
                window.location.href="./myPage.html"

                /* myPage에서 뒤로 가기 눌렀을 때 value 값과 total관련 맞지 않는 문제 발견 -> 0으로 초기화*/
                document.querySelector("#input1").value=0;
                document.querySelector("#input2").value=0;
                document.querySelector("#input3").value=0;
                document.querySelector("#input4").value=0;
                document.querySelector("#input5").value=0;
                document.querySelector("#input6").value=0;
            },
            error: function (request, status, error) {
                if (request.status===400) alert("주문이 비어있습니다")
                else alert("주문 실패");
            }
        });
    }
    else{
        alert("학생/교원 계정만 주문이 가능합니다");
        location.href="../index.html";
    }
    
    /* Todo
    1. total_price에 주문한 총 금액이 저장되어 있습니다.
    2. order_list에 각 상품의 주문량이 저장되어 있습니다. ex) order_list[0] -> 첫번째 상품(아이스 아메리카노) 주문 개수
    3. menu_name에 각 상품의 이름이 저장되어 있습니다. ex) menu_name[0] -> "[ICE] Americano" (string)
    4. menu_price에 각 상품의 가격이 저장되어 있습니다. ex) menu_price[0] -> 2000 (int)
    */
})
