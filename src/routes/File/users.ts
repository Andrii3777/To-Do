import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import { Mutex } from 'async-mutex';

const USERS_FILE_PATH = path.join(__dirname, '../../../files/user.txt');
let users: { login: string; pass: string }[] = [];
// let addUserLock = false; // Lock for adding a user
const mutex = new Mutex();

if (fs.existsSync(USERS_FILE_PATH)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE_PATH, 'utf-8'));
}

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
        // Acquire the lock
        /* if (addUserLock) {
            res.status(503).json({ error: 'Service Unavailable' }); // At the moment the user is added, so we return the error
            return;
        }
        addUserLock = true; */
        mutex.acquire().then((release) => {// Capture the mutex before accessing shared data

            // Hashing the password before saving
            bcrypt.hash(pass, 10, (err, hashPass) => {
                if (err) {
                    console.error('Internal server error');
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    req.session.userLogin = login;
                    users.push({ login, pass: hashPass });
                    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users), 'utf-8');

                    // Release the lock
                    /* addUserLock = false; */
                    release(); // Release mutex after completion of operations

                    res.json({ ok: true });
                }
            });
        });
    }
};

export function isLoginValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
