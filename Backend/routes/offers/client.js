const express = require("express");
const router = express.Router();
const offers = require("../../models/offersModel")

router.get('/getEnabledOffers', async(req, res)=>{
    try {
        const enabled_offers = await offers.find({enabled_flag: true}).sort({sortValue: 1})
        res.send(enabled_offers)
    } catch (error) {
        res.send(error)
    }
})



module.exports = router;