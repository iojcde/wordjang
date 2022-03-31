import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
} from 'next'
import { getProviders, signIn } from 'next-auth/react'

const SignIn: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  return (
    <>
      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
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
