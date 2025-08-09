import multer from "multer"




const storage = multer.diskStorage({
    destination :(req, file, cb)=> {
        cb(file, 'uploads/') //the destention folder
    },
    filename: (req, file, cb) => {
        cb(file.filename, `${Date.now()}-${file.originalname}`)
    }
})

export const upload = multer({ storage })