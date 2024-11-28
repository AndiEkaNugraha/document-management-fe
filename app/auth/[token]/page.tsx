"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Auth({params: {token}}:{params: {token: string}}) {
   const router = useRouter()
   
   useEffect(() => {
      if (!token) {
         router.push("https://my.prasmul-eli.co/login")
      }
      sessionStorage.setItem('users', token)
      router.push("/")
   })
}