import { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../errors/app-error'
import { verifyAccessToken, JwtPayload } from '../utils/jwt'

// Extend FastifyRequest to carry the authenticated user
declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload
  }
}

function extractBearer(req: FastifyRequest): string {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Missing or invalid Authorization header', 401)
  }
  return authHeader.slice(7)
}

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  const token = extractBearer(req)

  try {
    const payload = verifyAccessToken(token)
    req.user = payload
  } catch {
    throw new AppError('Invalid or expired token', 401)
  }
}
