import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const users: { login: string; pass: string }[] = [];

export function logout(req: Request, res: Response) {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ ok: true });
        }
    });
};

export function login(req: Request, res: Response) {
    const { login, pass } = req.body;
    try {
        // Check user’s existence and password
        const user = users.find((user) => user.login === login);
        if (user) {
            // Compare password hash with entered password
            bcrypt.compare(pass, user.pass, (err, result) => {
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

export function register(req: Request, res: Response) {
    const { login, pass } = req.body;

    if (!isLoginValid(login)) {
        res.status(400).json({ error: 'Invalid login' });
        return;
    }

    // Check that there is no user with this login
    const userExists = users.some((user) => user.login === login);
    if (userExists) {
        res.status(409).json({ error: 'User already exists' });
    } else {
        // Hashing the password before saving
        bcrypt.hash(pass, 10, (err, hashPass) => {
            if (err) {
                console.error('Internal server error');
                res.status(500).json({ error: 'Internal server error' });
            } else {
                req.session.userLogin = login;
                users.push({ login, pass: hashPass });
                res.json({ ok: true });
            }
        });
    }
};

export function isLoginValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}