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

      if (wordjang == null) {
        return res.status(404).json({ status: `not found` })
      }

      if (session.user?.email != wordjang?.user.email) {
        return res.status(401).json({ status: `unauthorized` })
      }

      wordjang?.word.reverse()

      return res.json(wordjang)
    }

    return res.status(401).json({ status: `unauthorized` })
  } else if (req.method == `PATCH`) {
    const { id, name } = req.query
    if (session) {
      const email = await prisma.wordjang
        .findUnique({
          where: { id: id as string },
          select: { user: true },
        })
        .then((wj) => wj?.user.email)

      if (session.user?.email != email) {
        return res.status(401).json({ status: `unauthorized` })
      }
      const wordjang = await prisma.wordjang.update({
        where: { id: id as string },
        data: { name: name as string },
      })

      return res.json(wordjang)
    }

    return res.status(401).json({ status: `unauthorized` })
  } else if (req.method == `DELETE`) {
    const { id } = req.query
    if (session) {
      const email = await prisma.wordjang
        .findUnique({
          where: { id: id as string },
          select: { user: true },
        })
        .then((wj) => wj?.user.email)

      if (session.user?.email != email) {
        return res.status(401).json({ status: `unauthorized` })
      }
      const wordjang = await prisma.wordjang.delete({
        where: { id: id as string },
      })

      return res.json(wordjang)
    }

    return res.status(401).json({ status: `unauthorized` })
  }
  return res.status(400).json({ status: `invalid request` })
}
