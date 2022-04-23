import client from "@libs/server/client";
import withApiSession from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId, password, name, email, contact, address } = await req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await client.user.create({
            data: {
                userId,
                password: hashPassword,
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