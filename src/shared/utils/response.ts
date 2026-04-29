export function successResponse<T>(data: T, message = 'Success') {
  return {
    message,
    data,
  }
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  }
}
