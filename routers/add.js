const express = require('express')
const DbProduct = require('../model/Product')
const DbUser = require('../model/User')
const multer = require('../md/multer').single('photo')
const router = express.Router()
const path = require('path')
const fs = require('fs')
console.log(path.join(__dirname , '../uploads'))
// console.log(path.dirname(__dirname).join('md'))
const md = (req,  res, next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger' , 'Iltimos tizimga ulaning')
        res.redirect('/login/log')
    }
}
 
router.get('/add' ,  md , (req  ,res) => {
        res.render('add' , {
        title: 'Mahsulot qoshish sahifasi',

    })
})

router.post('/add' , multer ,   (req  ,res) => {
    req.checkBody('title' , 'Mahsulotning nomi bosh qolishi mumkin emas').notEmpty()
    req.checkBody('price' , 'Mahsulotning narxi bosh qolishi mumkin emas').notEmpty()
    req.checkBody('category' , 'Mahsulotning categorysi bosh qolishi mumkin emas').notEmpty()
    req.checkBody('comments' , 'Mahsulotning comments bosh qolishi mumkin emas').notEmpty()
     
    
    const errors =  req.validationErrors()
    if(errors){
        res.render('add' , {
            title: 'Error',
            errors : errors
        })
    } else{
        const db  = new DbProduct({
            title : req.body.title.toLowerCase(),
            price : req.body.price,
            category : req.body.category,
            comments : req.body.comments,
            dirUser: req.user.id,
            sale : req.body.sale,
            photo : req.file.path
        })
        db.save((err) => {
            if(err)
                throw err
            else{
                req.flash('success' , 'Maxsulot qoshildi')
                res.redirect('/')
            }
        })
    }

})


/////// Product - Card  sahifani Routeri ///////

router.get('/product/:id', async(req, res) => {

     let db =  await DbProduct.find({} )
    //  console.log(db)
    // console.log(req.params.id)
    DbProduct.findById(req.params.id,  ((err, data) => {
        // let db =  await DbProduct.find({ dirUser : data.dirUser} )
      
        if(data== null){
            res.redirect('/')
        }else{
            DbUser.findById(data.dirUser ,    (err ,user ) => {  
                res.render('cards', {
                    title: 'Mahsulot haqida',
                    datas: data,
                    db, 
                    prof : user 
                })
               
                
        })
        }
   
      
    }))
 


})

/////// Product - Cardni Edit qilish  sahifani Routeri ///////

router.get('/product/edit/:userId' ,  md ,(req  ,res) => {
 

    DbProduct.findById(req.params.userId , ((err, data) => {
        if(data.dirUser !=  req.user._id  ){
            req.flash('danger' , 'Haqqiz yoq')
            res.redirect('back')
             console.log(req.user)
        }
        res.render('add' , {
            title: 'Maxsulotni ozgartirish', 
            datas: data
        })
    }))
})




router.post('/product/edit/:userId' , multer ,  (req  ,res) => {
    req.checkBody('title' , 'Mahsulotning nomi bosh qolishi mumkin emas').notEmpty()
    req.checkBody('price' , 'Mahsulotning narxi bosh qolishi mumkin emas').notEmpty()
    req.checkBody('category' , 'Mahsulotning categorysi bosh qolishi mumkin emas').notEmpty()
    req.checkBody('comments' , 'Mahsulotning comments bosh qolishi mumkin emas').notEmpty()    
    const errors =  req.validationErrors()
    if(errors){
        res.render('add' , {
            title: 'Error',
            errors : errors
        })
    } else{
        const db  =  {
            title : req.body.title.toLowerCase(),
            price : req.body.price,
            category : req.body.category,
            comments : req.body.comments,
            photo : req.file.path  
        }
        const ids = {_id : req.params.userId }
        DbProduct.updateOne(ids , db , (err) => {
            if(err){
                console.log(err)
            }else{
            req.flash('success' , 'Maxsulot omadli ozgartirildi')
            res.redirect('/')
        }
        })
       
    }

})
 
router.get('/product/delete/:userId' , async (req , res) => {
    let id =    {id: req.params.userId}


    DbProduct.findOneAndDelete(id , (err) => {
        if(err) console.log(err)
        req.flash('success' , `Maxsulot omadli ochirildi`)
        res.redirect('/')
 
     
    })








    // let db  =   await DbProduct.findById(id.id)

    // if(db._id == id.id) {
    //     let filePath = await path.join(__dirname ,   `../${db.photo}`)
 
           
    //      fs.unlink( filePath,  async function(err) {
    //         if (err) throw err;
    //           await DbProduct.deleteOne(id ,    (err) => {
    //             if(err) console.log(err)
    //                 req.flash('success' , `Maxsulot omadli ochirildi`)
    //                 res.redirect('/')
    //         })
    //         // req.flash('success' , `Maxsulot omadli ochirildi`)
    //         // res.redirect('/')
    //     });
    // }
    // else{
    //     res.redirect('/')
    // }
//    console.log( db + 'dddd')
//    let filePath = path.join(__dirname ,   `../${data.photo}`)
//    console.log( filePath)
//     DbProduct.findOneAndDelete(id , (err) => {
//         if(err) console.log(err)
//         req.flash('success' , `Maxsulot omadli ochirildi`)
//         res.redirect('/')
//         // fs.unlink( filePath, function(err) {
//         //     if (err) throw err;
        
//         // });
     
//     })

})

 
 
module.exports  = router