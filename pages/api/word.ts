// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })

  if (session) {
    if (req.method == `POST`) {
      const { wordjangId, word, definition, example } = req.body

      const result = await prisma.word.create({
        data: {
          word,
          definition,
          example,
          wordjang: { connect: { id: wordjangId } },
        },
      })

      return res.json(result)
    } else if (req.method == `PATCH`) {
      const { id, word, definition, example } = req.body
      const email = await prisma.word
        .findUnique({
          where: { id },
          select: {
            wordjang: { select: { user: { select: { email: true } } } },
          },
        })
        .then((res) => res?.wordjang.user.email)

      if (email != session.user?.email) {
        res.status(401).json({ status: `unauthorized` })
      }

      const result = await prisma.word.update({
        where: { id },
        data: { word, definition, example },
      })

      return res.json(result)
    } else {
      res.status(400).json({ status: `invalid request` })
    }
  } else {
    res.status(401).json({ status: `unauthorized` })
  }
}
