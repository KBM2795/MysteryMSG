"use client"
import { signIn,useSession,signOut } from "next-auth/react"
 
export default function Component() {
   const {data: session} = useSession()
if(session){
  return (
        <>
        signed in as {session.user?.email}
      <button onClick={() => signOut({callbackUrl: "/signin"})}>
      Sign out
      </button>
        </>
  )}else{
    return (
            <>
            not signed in
        <button onClick={() => signIn()}>
        Sign in
        </button>
            </>
    )
  }
}