"use server"

import { cookies } from 'next/headers'
 
export async function setCookies(data:string) {
  try {
    cookies().set('token', data, { maxAge: 60 * 60 * 24 })
  } catch (error) {
    console.log(error)
  }
  return null;
}