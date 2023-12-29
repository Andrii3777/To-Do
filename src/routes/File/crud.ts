import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { Mutex } from 'async-mutex';

const ITEMS_FILE_PATH = path.join(__dirname, '../../../files/item.txt');;
let items: { id: number; text: string; checked: boolean; userLogin: string }[] = [];
const mutex = new Mutex();

if (fs.existsSync(ITEMS_FILE_PATH)) {
  items = JSON.parse(fs.readFileSync(ITEMS_FILE_PATH, 'utf-8'));
}

let idCounter = items.length > 0 ? items[items.length - 1].id : 22;

export function getItems(req: Request, res: Response) {
  const userLogin = req.session.userLogin;

  if (!userLogin) return res.status(500).json({ "error": "forbidden" });

  const userItems = items.filter((item) => item?.userLogin === userLogin);
  res.json({ items: userItems });
};

export function addItem(req: Request, res: Response) {
  const userLogin = req.session.userLogin;
  if (!req.body || !userLogin) return res.sendStatus(400);
  const { text } = req.body;

  mutex.acquire().then((release) => {
    // Capture the mutex before accessing shared data
    const newItem = {
      id: ++idCounter,
      text,
      checked: false,
      userLogin: userLogin
    };
    items.push(newItem);
    fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(items), 'utf-8');

    release(); // Release mutex after completion of operations

    res.json({ id: newItem.id });
  });
};

export function editItem(req: Request, res: Response) {
  const { id, text, checked } = req.body;

  mutex.acquire().then((release) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      item.text = text;
      item.checked = checked;
      fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(items), 'utf-8');
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }

    release();
  });
};

export function deleteItem(req: Request, res: Response) {
  const { id } = req.body;

  mutex.acquire().then((release) => {
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(items), 'utf-8');
      res.json({ ok: true });
    } else {
      res.status(404).json({ error: 'Item not found' });
    }

    release();
  });
};
