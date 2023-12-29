import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { client } from '../../database/MongoConnect';

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
        const users = client.db().collection('users');

        const user = await users.findOne({ login: login });// Check user’s existence and password

        if (user) {
            bcrypt.compare(pass, user.pass, (err, result) => {// Compare password hash with entered password
                if (result) {
                    req.session.userLogin = login;
                    res.json({ ok: true });
                } else {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
            });
        } else {
            res.status(401).json({ error: 'not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export async function register(req: Request, res: Response) {
    try {
        const { login, pass } = req.body;
        const users = client.db().collection('users');

        if (!isLoginValid(login)) {
            res.status(400).json({ error: 'Invalid login' });
            return;
        }

        const user = await users.findOne({ login });// Check that there is no user with this login
        if (user) {
            res.status(409).json({ error: 'User already exists' });
        } else {
            const hashPass = await bcrypt.hash(pass, 10);// Hashing the password before saving
            req.session.userLogin = login;
            await users.insertOne({ login, pass: hashPass });

            res.json({ ok: true });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export function isLoginValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return regex.test(email);
}