const express = require('express')
const DbProduct = require('../model/Product')
const fetch = require('node-fetch')
const router = express.Router()

/////// Bosh sahifani Routeri ///////

router.get('/', (req, res) => {
     
//    DbProduct.find({}, (err, data) => {
//         fetch("http://www.cbu.uz/oz/arkhiv-kursov-valyut/json/")
           
//             .then(body =>
//                 res.render('index', {
//                     title: 'Bosh sahifa',
//                     datas: data,
//                     kurs: body,
//                 }))

//     })
    let query = {}
    let page = 1
    let perpage = 9
 
    if(req.query.page!=null){
        page= req.query.page
    }
    query.skip=(perpage * page)-perpage;
    query.limit=perpage;
    console.log(query)

    DbProduct.find({},{},query,(err , data)=>{
        if(err){console.log(err)}
        fetch("http://www.cbu.uz/oz/arkhiv-kursov-valyut/json/")
        .then(data => data.json())
        .then(body => 
          DbProduct.count((err,count)=>{ 
             console.log(count)
             if(err){console.log(err)}
             res.render('index',{
                 kurs: body,
                 datas:data,
                 current:page,
                 pages:Math.ceil(count/perpage)
                 
             })

          }));
 
        
        })



    });



/////// Qidiruv tizmini Routeri ///////

router.get('/search', (req, res) => {
    let { search } = req.query 
    search.toLowerCase()
    DbProduct.find({ title: { $regex: search }}, (err, data) => {
        if (data == "" || req.query.search == "") {
            res.redirect('/')
        }else{
            res.render('index', {
                title: 'Bosh sahifa',
                datas: data
            })
        }
    })
})


/////// Like  sahifani Routeri ///////

router.post('/like/:id' , (req , res) => {
    DbProduct.findById(req.params.id , (err , data) => {
        if(err){ console.log(err)}
        else{
            data.like += 1
            data.save()
            res.send(data)
        }
    })
})




module.exports = router