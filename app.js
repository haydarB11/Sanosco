require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');

const corsOptions = { 
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    headers: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/sansco/public', express.static(path.join(__dirname, 'public')));
app.get('/sansco', (req, res) => {
    return res.json("welcome to sansco app!");
});

// manager routes
app.use('/sansco/manager/charts', require('./routes/ManagerRoutes/ChartRouter'));
app.use('/sansco/manager/advertisements', require('./routes/ManagerRoutes/AdvertisementRouter'));
app.use('/sansco/manager/offers', require('./routes/ManagerRoutes/OfferRouter'));
app.use('/sansco/manager/categories', require('./routes/ManagerRoutes/CategoryRouter'));
app.use('/sansco/manager/brands', require('./routes/ManagerRoutes/BrandRouter'));
app.use('/sansco/manager/collections', require('./routes/ManagerRoutes/CollectionRouter'));
app.use('/sansco/manager/items', require('./routes/ManagerRoutes/ItemRouter'));
app.use('/sansco/manager/orders', require('./routes/ManagerRoutes/OrderRouter'));
app.use('/sansco/manager/static-contents', require('./routes/ManagerRoutes/StaticContentRouter'));
app.use('/sansco/manager', require('./routes/ManagerRoutes/UserRouter'));

// user routes
app.use('/sansco/user/static-contents', require('./routes/UserRoutes/StaticContentRouter'));
app.use('/sansco/user/notifications', require('./routes/UserRoutes/NotificationRouter'));
app.use('/sansco/user/categories', require('./routes/UserRoutes/CategoryRouter'));
app.use('/sansco/user/favorites', require('./routes/UserRoutes/FavoriteRouter'));
app.use('/sansco/user/brands', require('./routes/UserRoutes/BrandRouter'));
app.use('/sansco/user/collections', require('./routes/UserRoutes/CollectionRouter'));
app.use('/sansco/user/items', require('./routes/UserRoutes/ItemRouter'));
app.use('/sansco/user/advertisements', require('./routes/UserRoutes/AdvertisementRouter'));
app.use('/sansco/user/carts', require('./routes/UserRoutes/CartRouter'));
app.use('/sansco/user/orders', require('./routes/UserRoutes/OrderRouter'));
app.use('/sansco/user/ratings', require('./routes/UserRoutes/RateRouter'));
app.use('/sansco/user', require('./routes/UserRoutes/UserRouter'));

const server = app.listen({ port: process.env.PORT || 3070 }, async () => {
    // await sequelize.sync({force:true});
    // await sequelize.sync({alter:true});
    console.log('starting on port : ' + process.env.PORT);
});