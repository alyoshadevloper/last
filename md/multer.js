const multer = require('multer')
const path = require('path')


const storage = multer.diskStorage({
    destination : (req, file , cd) => {
        cd(null, 'uploads')
        console.log(file)
 
    },
    filename: (req, file , cb) => {
        cb(null, Math.random().toString() + path.extname(file.originalname) ) // 12321.jpg
    }
})

const uploads = multer({
    storage,
    limits : {fieldSize : 2 * 1024 * 1024 },
    fileFilter : (req, file , cb) => {
        const extname = path.extname(file.originalname)
        if(extname !== '.jpg' &&  extname !== '.jpeg'  && extname !== '.png'){
            const err = new Error('xatolik bor')
            err.code = 404
            return cb(err)
        }
        cb(null, true)

    },
    preservePath : true,

}) 


module.exports = uploads