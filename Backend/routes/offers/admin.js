const express = require("express");
const router = express.Router();
const offers = require("../../models/offersModel")


router.post('/postOffer', async (req, res)=>{
    try {
        const offer =  await offers.create(req.body.data)
        if(offer){
            res.send(offer)
        }
    } catch (error) {
        res.send(error)
    }
})

router.get('/getOffers', async (req, res)=>{
    try {
        const allOffers = await offers.find()
        // console.log(allOffers)
        if(allOffers.length > 0){
            res.send(allOffers)
        }
    } catch (error) {
        res.send(error)
    }
})

router.put('/editOffer', async (req, res)=>{
    try {
        // console.log(req.body)
        const id = req.body.data._id
        const edited = await offers.updateOne({_id: id}, req.body.data)
        if(edited.modifiedCount > 0){
            res.sendStatus(200)
        }
    } catch (error) {
        res.send(error)
    }
})





module.exports = router;