const express = require('express')
const {createComunity,getAllComunites,getOneComunity,editComunity,deleteCommunity} = require('../controllers/communityController')

const router = express.Router()


router.route('/')
.post(createComunity)
.get(getAllComunites)


router.route('/:id').get(getOneComunity).patch(editComunity).delete(deleteCommunity)
module.exports=router