// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req })
  const { name } = req.body

  if (session) {
    const result = await prisma.wordjang.create({
      data: {
        user: { connect: { email: session.user?.email as string } },
        name,
        updatedAt: new Date(),
      },
    })

    return res.json(result)
  } else {
    res.status(401).json({ status: `unauthorized` })
  }
}
