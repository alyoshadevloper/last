 

 

window.addEventListener('load' , () => {

    let saleing = document.querySelectorAll('.saleing')
    let sale_price = document.querySelectorAll('.prices_sale')

    saleing.forEach((element , index) => {
        if(element.innerHTML == "%"){
            element.style.display = 'none'
            sale_price[index].style.display = 'none'
        }
    });

    let cardClick = document.querySelectorAll('.product_img')
    cardClick.forEach(element => {
        element.addEventListener('click' , () => {
            let userID =  $(element).attr('userId')
            window.location.href = userID
        })
      

    });
 
    let cardlike = document.querySelectorAll('.likes')
    let writeLike = document.querySelectorAll('.writeLike')
    console.log(cardlike)
    cardlike.forEach((element , value) => {
        element.addEventListener('click' , (e) => {
            let userID =  $(element).attr('userIds')
            console.log(userID)
            
            fetch(userID ,{
                method: "POST"
            })
            .then(data => data.json())
            .then(data => {
                writeLike.forEach((elem , val) => {
                    if(val == value){
                        elem.innerText = data.like
                        console.log(elem)
                        console.log(data)
                    }
                });
            })

        } , {once : 'true'})
    });
    

})