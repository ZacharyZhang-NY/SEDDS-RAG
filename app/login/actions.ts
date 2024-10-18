'use server'

import { signIn } from '@/auth'
import { User } from '@/lib/types'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import {nanoid, ResultCode} from '@/lib/utils'
import {client} from "@/app/db";

export async function getUser(email: string) {
  try {
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email])
    if (user.rows.length === 0) return null;
    return user.rows[0] as User
  } catch (e) {
    console.error("Database ERR", e)
    throw e
  }
}

export async function getUserRole (id: string) {
  try {
    const user = await client.query('SELECT role FROM users WHERE id = $1', [id])
    if (user.rows.length === 0) return null;
    return user.rows[0].role
  } catch (e) {
    console.error("Database ERR", e)
    throw e
  }

}
interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6)
      })
      .safeParse({
        email,
        password
      })

    if (parsedCredentials.success) {
      await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          }
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError
          }
      }
    }
  }
}
