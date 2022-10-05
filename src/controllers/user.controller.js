import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

export async function saveFavoriteProduct(req, rep) {
    try {
        const { userId } = req.params;
        const { link } = req.body;

        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        const product = await Product.findOneAndUpdate({ link }, req.body, {
            upsert: true,
        });

        await User.findByIdAndUpdate(userId, {
            $addToSet: { favorite_products: product?._id },
        });

        rep.status(201).send({
            status: 'success',
            data: req.body,
        });
    } catch (error) {
        console.error('saveFavoriteProduct error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}

export async function deleteFavoriteProduct(req, rep) {
    try {
        const { userId } = req.params;
        const { link } = req.body;

        const product = await Product.findOne({ link });

        if (!product) {
            return rep.status(404).send({
                status: 'error',
                message: 'product not found',
            });
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { favorite_products: product._id } },
        );

        rep.status(200).send({
            status: 'success',
        });
    } catch (error) {
        console.error('deleteFavoriteProduct error: ', error);

        rep.status(500).send({
            message: 'internal server error',
        });
    }
}