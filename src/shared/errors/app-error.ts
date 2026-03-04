export class AppError extends Error {
  public readonly name = 'AppError'

  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}