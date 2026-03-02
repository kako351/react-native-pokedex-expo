export type ApiErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN';

const statusMap: Record<number, ApiErrorCode> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
};

export type ApiErrorParams = {
  message: string;
  code: ApiErrorCode;
  status?: number;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code: ApiErrorCode;

  constructor(params: ApiErrorParams) {
    super(params.message);
    this.code = params.code;
    this.status = params.status;
  }

  static network(message?: string): ApiError {
    return new ApiError({
      message: message ?? 'Network error',
      code: 'NETWORK_ERROR',
    });
  }

  static fromStatus(status?: number, message?: string): ApiError {
    if (!status) {
      return ApiError.network(message);
    }

    const code = statusMap[status] ?? 'UNKNOWN';

    return new ApiError({
      message: message ?? defaultMessage(code),
      code,
      status,
    });
  }

  static unknown(message?: string): ApiError {
    return new ApiError({
      message: message ?? defaultMessage('UNKNOWN'),
      code: 'UNKNOWN',
    });
  }
}

function defaultMessage(code: ApiErrorCode): string {
  switch (code) {
    case 'BAD_REQUEST':
      return 'Bad request';
    case 'UNAUTHORIZED':
      return 'Unauthorized';
    case 'FORBIDDEN':
      return 'Forbidden';
    case 'NOT_FOUND':
      return 'Not found';
    case 'NETWORK_ERROR':
      return 'Network error';
    default:
      return 'Unknown error';
  }
}
