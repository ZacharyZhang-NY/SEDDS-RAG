'use server'

import { signIn } from '@/auth'
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { z } from 'zod'
import { getUser } from '../login/actions'
import { AuthError } from 'next-auth'
import { client } from "@/app/db";
import {siteConfig} from "@/siteConfig";

export async function createUser(
  email: string,
  hashedPassword: string,
  salt: string
) {
  const existingUser = await getUser(email)

  if (existingUser) {
    return {
      type: 'error',
      resultCode: ResultCode.UserAlreadyExists
    }
  } else {
    // Check email domain
    const domain = email.split('@')[1]
    if (!siteConfig.emailDomain.includes(domain)) {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidEmailDomain
      }
    }

    // check if is first user
    const firstUserQuery = 'SELECT * FROM users'
    const firstUserRes = await client.query(firstUserQuery)
    if (firstUserRes.rowCount === 0) {
      const user = {
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        salt,
        role: 'super_admin'
      }
      const insertionQuery = 'INSERT INTO users (id, email, password, salt, role) VALUES ($1, $2, $3, $4, $5)'
      try {
        const res = await client.query(insertionQuery, [user.id, user.email, user.password, user.salt, user.role])
        return {
          type: 'success',
          resultCode: ResultCode.UserCreated
        }
      } catch (e) {
        console.log(e);
        throw e
      }
    }


    const user = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      salt
    }

    const query = 'INSERT INTO users (id, email, password, salt) VALUES ($1, $2, $3, $4)'
    try {
      const res = await client.query(query, [user.id, user.email, user.password, user.salt])
      return {
        type: 'success',
        resultCode: ResultCode.UserCreated
      }
    } catch (e) {
      console.log(e);
      throw e
    }
  }
}

export async function updatePassword(
  email: string,
  password: string,
  salt: string
) {
  const query = 'UPDATE users SET password = $1, salt = $2 WHERE email = $3'
  try {
    const res = await client.query(query, [password, salt, email])
    return {
      type: 'success',
      resultCode: ResultCode.UserUpdated
    }
  } catch (e) {
    console.log(e);
    throw e
  }
}


interface Result {
  type: string
  resultCode: ResultCode
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

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
    const salt = crypto.randomUUID()

    const encoder = new TextEncoder()
    const saltedPassword = encoder.encode(password + salt)
    const hashedPasswordBuffer = await crypto.subtle.digest(
      'SHA-256',
      saltedPassword
    )
    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

    try {
      const result = await createUser(email, hashedPassword, salt)

      if (result.resultCode === ResultCode.UserCreated) {
        await signIn('credentials', {
          email,
          password,
          redirect: false
        })
      }

      return result
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
      } else {
        return {
          type: 'error',
          resultCode: ResultCode.UnknownError
        }
      }
    }
  } else {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidCredentials
    }
  }
}
