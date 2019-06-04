/**
 * User: abhijit.baldawa
 *
 * This module contains all the routes for "/meters" endpoints
 */

const
    Router = require('koa-router'),
    metersController = require('../controller/meters.controller'),
    router = new Router({
        prefix: '/meters'
    });

router.get('/', metersController.getAllMetersReadings);
router.post('/', metersController.createNewMeterReading);
router.get('/monthlyUsage', metersController.getMonthlyUsage);

module.exports = router;