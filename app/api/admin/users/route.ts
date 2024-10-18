import {NextRequest} from "next/server";
import {getStringFromBuffer, ResultCode} from "@/lib/utils";
import {client} from "@/app/db";


export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const password = 123456

  const salt = crypto.randomUUID()

  const encoder = new TextEncoder()
  const saltedPassword = encoder.encode(password + salt)
  const hashedPasswordBuffer = await crypto.subtle.digest(
    'SHA-256',
    saltedPassword
  )
  const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

  const query = 'UPDATE users SET password = $2, salt = $3 WHERE id = $1'

  try {
    await client.connect()
    const res = await client.query(query, [id, hashedPassword, salt])
  } catch (e: any) {
    console.error(e);
    return new Response(e.message, {status: 500})
  }

  return new Response('ok')
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  const query = 'DELETE FROM users WHERE id = $1'
  try {
    await client.connect()
    await client.query(query, [id])
  } catch (e: any) {
    console.error(e);
    return new Response(e.message, {status: 500})
  }
  return new Response('ok')

}