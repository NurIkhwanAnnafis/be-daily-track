import bcrypt from 'bcrypt'
import { LoginInput } from './auth.schema'
import { authRepository } from './auth.repository'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt'
import { AppError } from '../../shared/errors/app-error'

export const authService = {
  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email)
    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401)
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401)
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken({ sub: user.id })

    // Compute expiresAt from the refresh token's own exp claim
    const decoded = verifyRefreshToken(refreshToken) as { sub: string; exp: number }
    const expiresAt = new Date(decoded.exp * 1000)
    await authRepository.saveRefreshToken(user.id, refreshToken, expiresAt)

    return { accessToken, refreshToken }
  },

  async refresh(token: string) {
    const storedToken = await authRepository.findRefreshToken(token)
    if (!storedToken) {
      throw new AppError('Invalid or expired refresh token', 401)
    }

    try {
      const payload = verifyRefreshToken(token)
      const user = await authRepository.findUserByEmail(storedToken.userId)
      if (!user) throw new AppError('User not found', 401)

      const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role })
      return { accessToken }
    } catch {
      throw new AppError('Invalid or expired refresh token', 401)
    }
  },

  async logout(token: string) {
    await authRepository.revokeRefreshToken(token)
  },
}
