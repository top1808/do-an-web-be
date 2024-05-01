const inventoryController = require('../../controllers/inventoryController');

const inventoryRoute = require('express').Router();

inventoryRoute.get('/', inventoryController.getData);
inventoryRoute.post('/create', inventoryController.create);
inventoryRoute.post('/import-by-sku/:id', inventoryController.importByProductSKU);
inventoryRoute.post('/delete-history-import/:id', inventoryController.deleteHistoryImport);
inventoryRoute.delete('/:id',  inventoryController.delete);
inventoryRoute.put('/update/:id',  inventoryController.edit);
inventoryRoute.get('/:id',  inventoryController.getById);

module.exports = inventoryRoute;