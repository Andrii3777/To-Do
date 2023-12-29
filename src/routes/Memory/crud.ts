import { Request, Response } from 'express';

const items: { id: number; text: string; checked: boolean; userLogin: string }[] = [];
let idCounter = 22;

export function getItems(req: Request, res: Response) {
    const userLogin = req.session.userLogin;
    if (!userLogin) return res.status(500).json({ "error": "forbidden" });

    // Filter items by user ID
    const userItems = items.filter((item) => item?.userLogin === (userLogin));

    res.json({ items: userItems });
};

export function addItem(req: Request, res: Response) {
    const userLogin = req.session.userLogin;
    if (!req.body || !userLogin) return res.sendStatus(400);
    const { text } = req.body;

    const newItem = {
        id: ++idCounter,
        text,
        checked: false,
        userLogin: userLogin
    };
    items.push(newItem);

    res.json({ id: newItem.id });
};

export function editItem(req: Request, res: Response) {
    const { id, text, checked } = req.body;

    // Find item by id and update its properties
    const item = items.find((item) => item.id === id);
    if (item) {
        item.text = text;
        item.checked = checked;
        res.json({ ok: true });
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
};

export function deleteItem(req: Request, res: Response) {
    const { id } = req.body;

    // Find the index of the element by id and remove it from the array
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
        items.splice(index, 1);
        res.json({ ok: true });
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
};