import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from './app-error'

export function errorHandler(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error)

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    })
  }

  // Fastify errors (e.g. 400 validation, 404, 415 unsupported media type, etc.)
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    })
  }

  // Fallback — internal server error
  return reply.status(500).send({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  })
}
