const { ItemService } = require('../../services/ItemService');
const { UserService } = require('../../services/UserService');
const axios = require('axios');

function getRandomElements(arr, num) {

    if (num > arr.length) {
        return arr;
    }

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, num);
}

function getLimitElements(arr, num) {

    if (num > arr.length) {
        return arr;
    }

    return arr.slice(0, num);
}

module.exports = {

    getShowedItemsWithLimit: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            // const limit = req.query.limit;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getShowedWithLimit(req?.user?.id, req.query.language, req.query.page, req.query.pageSize, req.query?.limit);
            let subList;
            if (req.query?.limit) {
                subList = result.data.slice(0, req.query.limit);
            } else {
                subList = result.data;
            }

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = subList.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        rates: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.rate),
                        storages: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = subList.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    rates: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.rate),
                    storages: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getAllShowedItemWithDiscount: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getShowedWithDiscountAndLimit(req?.user?.id, req.query.language, req.query.page, req.query.pageSize, req.query?.limit);
            let subList;
            if (req.query?.limit) {
                subList = result.data.slice(0, req.query.limit);
            } else {
                subList = result.data;
            }

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = subList.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        rates: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.rate),
                        storages: subList
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = subList.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    rates: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.rate),
                    storages: subList
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getNewShowedItemsWithLimit: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getShowedWithLimit(req?.user?.id, req.query.language, req.query.page, req.query.pageSize);

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = result.data.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        rates: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.rate),
                        storages: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = result.data.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    rates: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.rate),
                    storages: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getMostSellingShowedItemsWithLimit: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            // const limit = req.query.limit;
            const user = await UserService.getById(req?.user?.id);
            let mostSellingItem = await ItemService.getShowedMostSellingWithLimit(req?.query?.limit); 
            if (req?.query?.limit) {
                mostSellingItem.data = getLimitElements(mostSellingItem.data, req?.query?.limit);
            }
            const mostSellingItemIds = mostSellingItem.data.map(item => item.id);
            
            const result = await ItemService.getShowedWithLimitInSpecificIds(mostSellingItemIds, req?.user?.id, req.query.language);            

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = result.data.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        storages: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = result.data.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    storages: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getItemById: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getByIdForUser(req.query.language, req.params.item_id, req?.user?.id || null);
            const itemsForOneName = await ItemService.getAllForOneName(req.query.language, result.data?.name, req?.user?.id || null);

            let item;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                const newItem = result.data.toJSON();
                delete newItem['price'];
                item =  { 
                    ...newItem,
                    is_favorite: result.data.favorite?.length > 0 ? true : false,
                    is_empty: (result.data.storage == 0) ? true : false, 
                    cart_count: result.data?.cart_items[0] ? result.data.cart_items[0].count : 0,
                    measures: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.measure),
                    paracodes: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.paracode),
                    ids: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.id),
                    storages: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.storage)
                };
            } else {
                item =  { 
                    ...result.data.toJSON(), 
                    is_favorite: result.data.favorite?.length > 0 ? true : false, 
                    is_empty: (result.data.storage == 0) ? true : false,
                    cart_count: result.data?.cart_items[0] ? result.data.cart_items[0].count : 0,
                    measures: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.measure),
                    paracodes: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.paracode),
                    ids: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.id),
                    storages: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.storage)
                };
            }

            res.status(result.status).send({
                data: item,
                country: country
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getItemByName: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const itemsForOneName = await ItemService.getAllForOneName(req.query.language, req.query?.name, req?.user?.id || null);
            if (itemsForOneName.data[0]?.id) {

                let item;
    
                if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                    const newItem = itemsForOneName.data[0].toJSON();
                    delete newItem['price'];
                    item =  { 
                        ...newItem,
                        is_favorite: itemsForOneName.data[0].favorite?.length > 0 ? true : false,
                        is_empty: (itemsForOneName.data[0].storage == 0) ? true : false, 
                        cart_count: itemsForOneName.data[0]?.cart_items[0] ? itemsForOneName.data[0].cart_items[0].count : 0,
                        measures: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.measure),
                        paracodes: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.paracode),
                        ids: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.id),
                        storages: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.storage)
                    };
                } else {
                    item =  { 
                        ...itemsForOneName.data[0].toJSON(), 
                        is_favorite: itemsForOneName.data[0].favorite?.length > 0 ? true : false, 
                        is_empty: (itemsForOneName.data[0].storage == 0) ? true : false,
                        cart_count: itemsForOneName.data[0]?.cart_items[0] ? itemsForOneName.data[0].cart_items[0].count : 0,
                        measures: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.measure),
                        paracodes: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.paracode),
                        ids: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.id),
                        storages: itemsForOneName.data
                            .filter(item => item.name === itemsForOneName.data[0].name)
                            .map(item => item.storage)
                    };
                }
    
                res.status(itemsForOneName.status).send({
                    data: item,
                    country: country
                });

            } else {
                res.status(404).send({
                    data: 'item not found',
                    country: country
                });
            }
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    SearchForItemInOneCategory: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            let itemsForOneName;
            if (req.params.category_id) {
                itemsForOneName = await ItemService.getAllForOneNameForOneCategory(req.query.language, req.query?.name, req?.user?.id || null, req.params.category_id);
            } else {
                itemsForOneName = await ItemService.getAllForOneName(req.query.language, req.query?.name, req?.user?.id || null);
            }
            if (itemsForOneName.data[0]?.id) {

                let items;
    
                if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                    items = itemsForOneName.data.map(element => {
                        const newElement = element.toJSON();
                        delete newElement['price'];
                        return {
                            ...newElement, 
                            is_favorite: newElement.favorite.length > 0 ? true : false,
                            is_empty: (element.storage == 0) ? true : false,
                            cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                            measures: itemsForOneName.data
                                .filter(item => item.name === newElement.name)
                                .map(item => item.measure),
                            paracodes: itemsForOneName.data
                                .filter(item => item.name === newElement.name)
                                .map(item => item.paracode),
                            ids: itemsForOneName.data
                                .filter(item => item.name === newElement.name)
                                .map(item => item.id),
                            storages: itemsForOneName.data
                                .filter(item => item.name === newElement.name)
                                .map(item => item.storage)
                        }
                    });
                } else {
                    items = itemsForOneName.data.map(element => ({
                        ...element.toJSON(), 
                        is_favorite: element.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                        measures: itemsForOneName.data
                            .filter(item => item.name === element.name)
                            .map(item => item.measure),
                        prices: itemsForOneName.data
                            .filter(item => item.name === element.name)
                            .map(item => item.price),
                        paracodes: itemsForOneName.data
                            .filter(item => item.name === element.name)
                            .map(item => item.paracode),
                        ids: itemsForOneName.data
                            .filter(item => item.name === element.name)
                            .map(item => item.id),
                        storages: itemsForOneName.data
                            .filter(item => item.name === element.name)
                            .map(item => item.storage)
                    }));
                }

                const uniqueItems = [];
                const seenNames = new Set();
                
                items.forEach(item => {
                    if (!seenNames.has(item.name)) {
                        seenNames.add(item.name);
                        uniqueItems.push(item);
                    }
                });
    
                res.status(itemsForOneName.status).send({
                    data: uniqueItems,
                    country: country
                });

            } else {
                res.status(200).send({
                    data: [],
                    country: country
                });
            }
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getItemByMeasure: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const result = await ItemService.getForOneMeasure(req.query.language, req.query?.measure, req.query?.name, req?.user?.id || null);
            const itemsForOneName = await ItemService.getAllForOneName(req.query.language, result.data?.name, req?.user?.id || null);
            let item;
            if (result.data ==  null) {
                item = {};
            } else {
                const newItem = result.data.toJSON();
                delete newItem['price'];
                item =  { 
                    ...newItem, 
                    is_favorite: result.data.favorite?.length > 0 ? true : false, 
                    is_empty: (result.data.storage == 0) ? true : false,
                    cart_count: result.data?.cart_items[0] ? result.data.cart_items[0].count : 0,
                    measures: itemsForOneName.data
                        .filter(item => item.name === result.data.name)
                        .map(item => item.measure),
                };
            }

            res.status(result.status).send({
                data: item,
                country: country
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getAllShowedItemsForOneCategory: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getAllShowedForOneCategory(req?.user?.id, req.params.category_id, req.query.language, req.query.page, req.query.pageSize);

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = result.data.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        storages: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = result.data.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    storages: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getAllShowedItemsForOnePrimaryCategory: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getAllShowedItemsForOnePrimaryCategory(req?.user?.id, req.params.category_id, req.query.language, req.query.page, req.query.pageSize);

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = result.data.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        storages: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = result.data.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    storages: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

    getAllShowedItemsForOneBrand: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;
            const user = await UserService.getById(req?.user?.id);
            const result = await ItemService.getAllShowedForOneBrand(req?.user?.id, req.params.brand_id, req.query.language, req.query?.page, req.query?.pageSize);

            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = result.data.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                        storages: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.storage)
                    }
                });
            } else {
                items = result.data.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    storages: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }
            

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },
    
    getAllShowedItemsForOneCollection: async (req, res) => {
        try {
            const ipAddress = await axios.get('https://api.ipify.org?format=json');
            const response = await axios.get(`http://ip-api.com/json/${ipAddress.data.ip}`);
            const country = response.data.country;

            const user = await UserService.getById(req?.user?.id);
            let result = await ItemService.getAllShowedForOneCollection(req?.user?.id, req.params.collection_id, req.query.language, req.query.page, req.query.pageSize);
            if (req?.query?.limit) {
                result.data = getRandomElements(result.data, req.query.limit)
            }
            let items;

            if (!req?.user?.id || (user.data?.country == 'Syria' && user.data?.type != 'promoter')) {
                items = result.data.map(element => {
                    const newElement = element.toJSON();
                    delete newElement['price'];
                    return {
                        ...newElement, 
                        is_favorite: newElement.favorite.length > 0 ? true : false,
                        is_empty: (element.storage == 0) ? true : false,
                        cart_count: newElement?.cart_items[0] ? newElement.cart_items[0].count : 0,
                        measures: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.measure),
                        paracodes: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.paracode),
                        ids: result.data
                            .filter(item => item.name === newElement.name)
                            .map(item => item.id),
                            storages: result.data
                                .filter(item => item.name === element.name)
                                .map(item => item.storage)
                    }
                });
            } else {
                items = result.data.map(element => ({
                    ...element.toJSON(), 
                    is_favorite: element.favorite.length > 0 ? true : false,
                    is_empty: (element.storage == 0) ? true : false,
                    cart_count: element?.cart_items[0] ? element.cart_items[0].count : 0,
                    measures: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.measure),
                    prices: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.price),
                    paracodes: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.paracode),
                    ids: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.id),
                    storages: result.data
                        .filter(item => item.name === element.name)
                        .map(item => item.storage)
                }));
            }

            const uniqueItems = [];
            const seenNames = new Set();
            
            items.forEach(item => {
                if (!seenNames.has(item.name)) {
                    seenNames.add(item.name);
                    uniqueItems.push(item);
                }
            });

            res.status(result.status).send({
                data: uniqueItems,
                country: country,
            });
        } catch (error) {
            res.status(400).send({
                data: error.message
            });
        }
    },

}