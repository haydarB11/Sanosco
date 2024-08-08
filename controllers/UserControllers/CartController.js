const { CartService } = require('../../services/CartService');
const { CartItemService } = require('../../services/CartItemService');
const { sequelize } = require('../../models');
const { UserService } = require('../../services/UserService');


module.exports = {

    addCartWithItsItems: async (req, res) => {
        let data = req.body;
        data.user_id = req.user.id;
        const t = await sequelize.transaction();
        try {
            
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;

            const deleteCart = await CartService.deleteMyOwn(data.user_id, { transaction: t });
            const user = await UserService.getById(req?.user?.id);
            const newCart = await new CartService(data).add({ transaction: t });
            const cartItemsData = data.items.map(item => ({
                cart_id: newCart.data.id,
                item_id: item.item_id,
                count: item.count
            }));
            const cartItems = await CartItemService.addMany(cartItemsData, { transaction: t });
            await t.commit();
            const cart = await CartService.get(data.user_id, 'ar');
            let total_price = 0; 
            cart.data.cart_items.forEach(cartItem => {
                total_price += cartItem.count * cartItem.item.price - (cartItem.item.offers.length > 0) ? cartItem.item.offers[0].discount * cartItem.count * cartItem.item.price : 0;
            });
            let updatedData;
            if (user.data?.country == 'Syria' && user.data?.type != 'promoter') {
                updatedData = { ...cart.data.toJSON() };
            } else {
                updatedData = { ...cart.data.toJSON(), total_price };
            }
            res.status(cart.status).send({
                data: updatedData,
                country: country
            });
        } catch (error) {
            await t.rollback();
            res.status(500).send({
                data: 'An error occurred'
            });
        }
    },

    getMyCartWithItsItems: async (req, res) => {
        try {
            const result = await CartService.get(req.user.id, req.query?.language);
            let total_price = 0;
            let data = {};
                const user = await UserService.getById(req?.user?.id);
                if (user.data?.country == 'Syria' && user.data?.type != 'promoter') {
                    result.data?.cart_items.forEach(cartItem => {
                        total_price += (cartItem.count * cartItem.item.price - ((cartItem.item.offers.length > 0) ? cartItem.item.offers[0].discount * cartItem.count * cartItem.item.price : 0));
                        cartItem.item.setDataValue('is_favorite', cartItem.item.favorite.length > 0 ? true : false);

                        delete cartItem.item.dataValues.price;

                    });
                    data = result.data?.cart_items.length > 0 ? {...result.data?.toJSON(), total_price: 0, shipping: 0} : {}; // may there is no cart
                } else {
                    result.data?.cart_items.forEach(cartItem => {
                        console.log(cartItem.count * cartItem.item.price);
                        total_price += (cartItem.count * cartItem.item.price - ((cartItem.item.offers.length > 0) ? cartItem.item.offers[0].discount * cartItem.count * cartItem.item.price : 0));
                        console.log(total_price);
                        cartItem.item.setDataValue('is_favorite', cartItem.item.favorite.length > 0 ? true : false);
                    });
                    data = result.data?.cart_items.length > 0 ? {...result.data?.toJSON(), total_price, shipping: 0} : {}; // may there is no cart
                }
                res.status(result.status).send({
                    data: data,
                });
        } catch (error) {
            res.status(500).send({
                data: 'An error occurred'
            });
        }
    },

    deleteMyCart: async (req, res) => {
        const result = await CartService.deleteMyOwn(req.user.id);
        res.status(result.status).send({
            data: result.data,
        });
    },

    addItemToCart: async (req, res) => {
        const data = req.body;
        data.user_id = req.user.id;
        let cart = await CartService.get(req.user.id);
        if (! cart?.data?.id) {
            cart = await new CartService(data).add();
        }
        data.cart_id = cart.data.id;
        const cartItem = await CartItemService.getItemOneForOneCart(data);
        let result;
        if (cartItem.data?.id) {
            data.cart_item_id = cartItem.data.id;
            if (data?.increase) {
                result = await CartItemService.edit(data); 
            } else {
                result = await CartItemService.putNewCount(data);
            }
        } else {
            result = await new CartItemService(data).add();
        }
        res.status(result.status).send({
            data: result.data,
        });
    },

    removeItemFromCart: async (req, res) => {
        const data = req.body;
        const cart = await CartService.get(req.user.id);
        data.cart_id = cart.data.id;
        const result = await CartItemService.delete(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

    removeManyItemFromCart: async (req, res) => {
        const data = req.body;
        const cart = await CartService.get(req.user.id);
        data.cart_id = cart.data.id;
        const result = await CartItemService.deleteMany(data);
        res.status(result.status).send({
            data: result.data,
        });
    },

}