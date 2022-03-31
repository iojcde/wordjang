import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import WordItem from 'components/WordItem'
import { Dialog, Transition } from '@headlessui/react'
import prisma from 'lib/prisma'
import Router from 'next/router'
import { Fragment, useState } from 'react'
import UserSection from 'components/UserSection'
import { getSession } from 'next-auth/react'
import { Word, Wordjang } from '@prisma/client'
import Nav from 'components/Nav'
import Link from 'next/link'

const Home: NextPage<{
  wordjangs: {
    word: Word[]
    id: string
    name: string
    updatedAt: string
    createdAt: string
    _count: {
      word: number
    }
  }[]
}> = ({ wordjangs }) => {
  return (
    <div>
      <Nav />
      <div className="px-4 py-4 lg:px-8 max-w-4xl mx-auto mt-8 ">
        {wordjangs ? (
          <>
            <h2 className="text-4xl font-bold">My Wordjangs</h2>
            <div className="mt-4">
              {wordjangs?.map((wj) => (
                <div key={wj.name} className="rounded-xl px-4 py-2 border">
                  <Link href={`/wordjang/${wj.id}`}>
                    <a className="font-bold text-2xl capitalize">{wj.name}</a>
                  </Link>
                  <h3 className=" text-sm text-neutral-800 my-2">
                    {wj._count.word}
                    {` `}
                    {wj._count.word == 1 ? `word` : `words`}
                  </h3>
                  <span className="text-sm text-neutral-700">
                    {wj.updatedAt ? (
                      <>
                        Last updated at:{` `}
                        {new Date(wj.updatedAt).toLocaleString()}
                      </>
                    ) : (
                      <>Created at: {new Date(wj.createdAt).toLocaleString()}</>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>oops no wordjangs</>
        )}
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (session) {
    const wordjangs = await prisma.wordjang.findMany({
      where: { user: { email: session?.user?.email } },
      select: {
        word: true,
        name: true,
        id: true,
        _count: {
          select: { word: true },
        },
        updatedAt: true,
        createdAt: true,
      },
    })
    const newWordjang = wordjangs.map((x) => {
      return {
        ...x,
        updatedAt: x.updatedAt.toString(),
        createdAt: x.createdAt.toString(),
      }
    })

    return {
      props: { wordjangs: newWordjang },
    }
  } else {
    return {
      props: {},
    }
  }
}
