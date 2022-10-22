import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export interface ILoggedUser {
    id: number,
    name: string
}
async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.session.user) return res.status(200).json({ ok: true, message: 'No logged user' });
    if (req.method === "GET") {
        try {
            const { query } = req;
            let fields: { [key: string]: boolean } = {};
            if (query.field) {
                if (typeof (query.field) === "string") fields[query.field] = true
                else query.field.map(key => fields[key] = true)
            }
            else fields["id"] = true

            const loggedUser = await client.user.findUnique({ where: { id: req.session.user.id }, select: { ...fields } })
            if (!loggedUser) return res.status(404).json({ ok: false, message: "❌No user is found" });
            return res.status(200).json({ ok: true, loggedUser });
        }
        catch (error) {
            return res.status(500).json({ ok: false, error: error?.toString() || "Something went wrong!" });
        }
    }
    else if (req.method === "PATCH") {
        try {
            const { body: { address } } = req;
            await client.user.update({
                where: {
                    id: req.session.user.id
                },
                data: {
                    address
                }
            })
            return res.json({
                ok: true
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false
            })
        }
    }
}
export default withApiSession(handler);