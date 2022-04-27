import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { body: { userId, password, name, email, contact, address } } = await req;
    const salt = crypto.randomBytes(16).toString('hex')
    const hashPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    try {
        const newUser = await client.user.create({
            data: {
                userId,
                password: hashPassword,
                salt,
                name,
                email: email || '',
                contact: contact || '',
                address: address || ''
            }
        });

        req.session.user = { id: newUser.id, name: newUser.name };
        await req.session.save();

        res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false });
    }
}
export default withApiSession(handler);