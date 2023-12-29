import { Request, Response } from 'express';
import { pool } from '../../database/MySQLConnect';

export async function getItems(req: Request, res: Response) {
  try {
    const userLogin = req.session.userLogin;
    if (!userLogin) return res.status(500).json({ "error": "forbidden" });

    const query = 'SELECT * FROM item WHERE userLogin = ?';
    pool.query(query, [userLogin], (err, items, fields) => {
      if (err) {
        return res.status(500).json({ error: err });
      }

      res.json({ items: items });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export async function addItem(req: Request, res: Response) {
  try {
    const userLogin = req.session.userLogin;
    if (!req.body || !userLogin) return res.sendStatus(400);
    const { text } = req.body;

    const query = 'INSERT INTO item (text, checked, userLogin) VALUES (?, ?, ?)';
    const itemData = [text, false, userLogin];
    pool.query(query, itemData, (err, item, fields) => {
      if (err) { return res.status(500).json({ error: err }) }

      res.json({ id: item.insertId });
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export async function editItem(req: Request, res: Response) {
  try {
    if (!req.body) return res.sendStatus(400);

    const { id, text, checked } = req.body;
    const query = 'UPDATE item SET text = ?, checked = ? WHERE id = ?';
    const updatedItemData = [text, checked, id];

    pool.query(query, updatedItemData, (err, result, fields) => {
      if (err) { return res.status(500).json({ error: err }); }

      res.json({ ok: true });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export async function deleteItem(req: Request, res: Response) {
  try {
    const { id } = req.body;

    pool.query(`DELETE FROM item WHERE id = ?`, [id], (err, result, fields) => {
      if (err) { return res.status(500).json({ error: err }) }

      res.json({ ok: true });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};