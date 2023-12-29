import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../../database/MySQLConnect';

export function logout(req: Request, res: Response) {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ ok: true });
        }
    });
};

export async function login(req: Request, res: Response) {
    try {
        const { login, pass } = req.body;
        const query = 'SELECT * FROM user WHERE login = ?';

        pool.query(query, [login], (err, users) => {
            if (err) { return res.status(500).json({ error: err }) }

            if (!users.length) { return res.status(401).json({ error: 'not found' }) }

            bcrypt.compare(pass, users[0].password, (err, result) => {
                if (err) { return res.status(500).json({ error: err }) }

                if (result) {
                    req.session.userLogin = login;
                    res.json({ ok: true });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            });
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export async function register(req: Request, res: Response) {
    try {
        const { login, pass } = req.body;
        if (!isLoginValid(login)) {
            return res.status(400).json({ error: 'Invalid login' });
        }

        const query = 'SELECT * FROM user WHERE login = ?';
        pool.query(query, [login], async (err, users) => {
            if (err) { return res.status(500).json({ error: err }); }

            if (users.length > 0) {
                return res.status(409).json({ error: 'User already exists' });
            }

            const query = 'INSERT INTO user (login, password) VALUES (?, ?)';
            const hashPass = await bcrypt.hash(pass, 10);
            req.session.userLogin = login;

            pool.query(query, [login, hashPass], (err, result) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.json({ ok: true });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export function isLoginValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return regex.test(email);
}