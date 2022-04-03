import { InferGetServerSidePropsType } from 'next'
import { getProviders, signIn } from 'next-auth/react'
import { AiFillGithub } from 'react-icons/ai'

const icons: Record<string, JSX.Element> = {
  github: <AiFillGithub size="32" />,
}

const SignIn: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  if (providers == null) {
    return <>oops</>
  }
  return (
    <>
      <h1 className="font-bold text-4xl mb-8 lg:mb-4">Sign in to Wordjang</h1>
      <div className="justify-center w-full p-4 grid">
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id)}
              className="rounded-lg items-center gap-2 flex text-xl px-8 py-2 shadow bg-black text-white border"
            >
              {icons[provider.name.toLowerCase()]} Sign in with{` `}
              {provider.name}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
export default SignIn

export const getServerSideProps = async () => {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
