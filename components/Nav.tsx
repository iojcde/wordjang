import Link from 'next/link'
import UserSection from './UserSection'

const Nav = () => (
  <div className="max-w-5xl py-4 mx-auto flex w-full px-4 justify-between items-center">
    <div className="flex">
      <h1 className="text-2xl font-bold mr-8">
        <Link href="/">Wordjang</Link>
      </h1>
      <div className="flex items-center gap-6 text-sm">
        <Link href="/wordjang/new">New</Link>
        <Link href="/test">Test</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
    <UserSection />
  </div>
)

export default Nav
