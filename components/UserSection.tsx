import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu } from '@headlessui/react'
import Image from 'next/image'
import Avvvatars from 'avvvatars-react'
import Link from 'next/link'

const UserSection = () => {
  const { data: session, status } = useSession()

  return (
    <div className="flex items-center">
      {status == `loading` && (
        <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
      )}

      {session && (
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center">
            {session && session.user?.image ? (
              <Image
                src={session.user?.image}
                width={32}
                height={32}
                alt=""
                className="rounded-full"
              />
            ) : (
              <Avvvatars value={session.user?.email as string} size={32} />
            )}
          </Menu.Button>
          <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item as="div" className="p-4 text-sm">
              <Link href="/">Home</Link>
            </Menu.Item>
            <Menu.Item as="div" className="p-4 text-sm">
              <Link href="/settings">Settings</Link>
            </Menu.Item>
            <Menu.Item
              as="div"
              onClick={() => signOut()}
              className="p-4 text-sm w-full text-left"
            >
              Logout
            </Menu.Item>
          </Menu.Items>
        </Menu>
      )}

      {status == `unauthenticated` && (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </div>
  )
}

export default UserSection
