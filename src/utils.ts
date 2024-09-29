import { ErrorResponse } from './types'

export const createErrorResponse = (
    error: string,
    type: string,
    code: string
): ErrorResponse => ({
    error,
    type,
    code,
})
