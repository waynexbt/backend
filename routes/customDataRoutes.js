const router= require("express").Router();
const customDataController = require("../controllers/customData.controller")

router.get("/custom_data", customDataController.get_custom_data)

module.exports = router;