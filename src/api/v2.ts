import express, { Request, Response } from 'express';
import { appStorage } from '..';
const crudModulePath = `../routes/${appStorage}/crud`;
const usersModulePath = `../routes/${appStorage}/users`;

const router = express.Router();

(async () => {
    const crudModule = await import(crudModulePath);
    const usersModule = await import(usersModulePath);

    const { getItems, addItem, editItem, deleteItem } = crudModule;
    const { login, logout, register } = usersModule;

    router.post('/router', (req: Request, res: Response) => {
        const actions: { [key: string]: Function } = {
            'login': login,
            'logout': logout,
            'register': register,
            'getItems': getItems,
            'createItem': addItem,
            'editItem': editItem,
            'deleteItem': deleteItem
        };

        const handler = actions[req.query.action as string];
        handler ? handler(req, res) : res.status(400).json({ error: 'Invalid action' });
    });
})();

export default router;