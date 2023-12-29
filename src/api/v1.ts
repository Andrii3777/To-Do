import express from 'express';
import { appStorage } from '..';
const crudModulePath = `../routes/${appStorage}/crud`;
const usersModulePath = `../routes/${appStorage}/users`;

const router = express.Router();

(async () => {
    try {
        const crudModule = await import(crudModulePath);
        const usersModule = await import(usersModulePath);

        const { getItems, addItem, editItem, deleteItem } = crudModule;
        const { login, logout, register } = usersModule;

        router.route('/items')
            .get(getItems)
            .post(addItem)
            .put(editItem)
            .delete(deleteItem);

        router.post("/login", login);
        router.post("/logout", logout);
        router.post("/register", register);
    } catch (error) {
        console.error(error);
    }
})();

export default router;