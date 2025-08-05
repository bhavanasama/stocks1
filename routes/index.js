const {Router} = require('express');
const IndexController = require('../controllers/index');

const router = Router();
const indexController = new IndexController();

function setRoutes(app) {
    app.use('/api/items', router);
    
    // Define the routes
    router.get('/', indexController.getItems.bind(indexController));
    router.get('/:id', indexController.getItemById.bind(indexController));
    router.post('/', indexController.createItem.bind(indexController));
    router.put('/buy', indexController.buyStock.bind(indexController));  // buy operation
    router.put('/sell', indexController.sellStock.bind(indexController));


    // router.put('/:id', indexController.updateItem.bind(indexController));   // ✅ PUT
    // router.delete('/:id', indexController.deleteItem.bind(indexController)); // ✅ DELETE
}

module.exports = {setRoutes};