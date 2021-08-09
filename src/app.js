import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import connection from "./database.js";
const app = express();
app.use(express.json())
app.use(cors())


app.post('/registry', async (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    let verify = []
    try {
        if (email.length > 0 && name.length > 0 && password.length > 0) {verify = await connection.query(`SELECT * FROM users WHERE email = $1`, [email]) }
        else { return res.sendStatus(401) }
        if (verify.rows.length === 0) {
            await connection.query(`
        INSERT INTO users 
        (name, email, hash, token)
        VALUES ($1,$2,$3,$4)
        `, [name, email, hash, null])
            res.sendStatus(201);
        } else {
            res.sendStatus(409);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(401);
    }
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (req.body.token) {
        try {
            const verify = await connection.query(`SELECT * FROM users WHERE token =$1 and email = $2`, [req.body.token, email])
            if (verify.rows.length > 0) {

                await connection.query(`
                    UPDATE users 
                    SET token = $1
                    WHERE email = $2
                `, [req.body.token, email])
                res.status(200).send({ "id": verify.rows[0].id, "name": verify.rows[0].name, "email": email, "token": req.body.token });
            }
        } catch {
            res.sendStatus(401);
        }
    } else {
        const token = uuid();
        try {
            const verify = await connection.query(`SELECT * FROM users WHERE email = $1`, [email])
            if (verify.rows.length > 0 && bcrypt.compareSync(password, verify.rows[0].hash)) {

                await connection.query(`
                UPDATE users 
                SET token = $1
                WHERE email = $2
            `, [token, email])

                res.status(200).send({ "id": verify.rows[0].id, "name": verify.rows[0].name, "email": email, "token": token });
            } else{
                res.sendStatus(401);
            }
        } catch {
            res.sendStatus(401);
        }
    }
})
app.get('/transactions', async (req, res) => {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', "");

    if (!token) return res.sendStatus(401);
    try {
        const user = await connection.query(`SELECT * FROM users WHERE token = $1`, [token])
        if (user.rows.length > 0) {
            const userId = user.rows[0].id
            const transactions = await connection.query(`SELECT * FROM transactions WHERE "userId" = $1`, [userId])
            const total = transactions.rows.reduce((acc, item) => item.typeTransaction === "in" ? acc += item.value : acc -= item.value, 0);
            res.status(200).send([transactions.rows, total])
        }
    } catch {
        res.sendStatus(400)
    }
})
app.post('/transactions', async (req, res) => {
    const authorization = req.headers.authorization;
    const { value, description, typeTransaction } = req.body;
    const token = authorization?.replace('Bearer ', "");
    const date = dayjs().format('DD/MM');
    if (!token) return res.sendStatus(401);
    try {
        const user = await connection.query(`SELECT * FROM users WHERE token = $1`, [token])
        if (user.rows.length > 0) {
            const userId = user.rows[0].id
            await connection.query(`INSERT INTO transactions ("userId", "typeTransaction",value, date, description) VALUES ($1,$2,$3,$4,$5)`, [userId, typeTransaction, value, date, description])
            res.sendStatus(201)
        }
    } catch {
        res.sendStatus(400)
    }
})


app.get('/teste', (req, res) => {
    res.sendStatus(200);
})

export default app;

