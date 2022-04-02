// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })
  if (req.method == `GET`) {
    const { id } = req.query
    if (session) {
      const wordjang = await prisma.wordjang.findUnique({
        where: { id: id as string },
        select: { name: true, user: true, word: true },
      })

      if (session.user?.email != wordjang?.user.email) {
        return res.status(401).json({ status: `unauthorized` })
      }

      wordjang?.word.reverse()

      return res.json(wordjang)
    }

    return res.status(401).json({ status: `unauthorized` })
  }
}
