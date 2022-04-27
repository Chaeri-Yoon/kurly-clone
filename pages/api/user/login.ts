import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import crypto from 'crypto';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { body: { userId, password } } = await req;
    try {
        // Find a user in db
        const user = await client.user.findUnique({
            where: {
                userId
            }
        });
        if (!user) {
            res.json({
                ok: true,
                logged: false,
                message: '아이디 또는 비밀번호 오류입니다'
            })
            return;
        }
        // Compare password
        const inputPassword = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
        if (!(user.password === inputPassword)) {
            res.json({
                ok: true,
                logged: false,
                message: '아이디 또는 비밀번호 오류입니다'
            })
            return;
        }

        req.session.user = { id: user.id, name: user.name };
        await req.session.save();

        res.json({
            ok: true,
            logged: true
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false
        })
    }
}
export default withApiSession(handler);