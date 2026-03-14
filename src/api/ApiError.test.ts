import { ApiError } from './ApiError';

describe('ApiError', () => {
  describe('fromStatus', () => {
    it('status が未指定なら NETWORK_ERROR を返す', () => {
      // Arrange
      const status = undefined;

      // Act
      const error = ApiError.fromStatus(status);

      // Assert
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.message).toBe('Network error');
      expect(error.status).toBeUndefined();
    });

    it('既知の status を対応する code に変換する', () => {
      // Arrange
      const status = 404;

      // Act
      const error = ApiError.fromStatus(status);

      // Assert
      expect(error.code).toBe('NOT_FOUND');
      expect(error.message).toBe('Not found');
      expect(error.status).toBe(404);
    });

    it('未知の status は UNKNOWN になる', () => {
      // Arrange
      const status = 500;

      // Act
      const error = ApiError.fromStatus(status);

      // Assert
      expect(error.code).toBe('UNKNOWN');
      expect(error.message).toBe('Unknown error');
      expect(error.status).toBe(500);
    });

    it('message を渡した場合は優先される', () => {
      // Arrange
      const status = 400;
      const message = 'custom message';

      // Act
      const error = ApiError.fromStatus(status, message);

      // Assert
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toBe('custom message');
      expect(error.status).toBe(400);
    });
  });

  describe('unknown', () => {
    it('デフォルトで UNKNOWN を返す', () => {
      // Arrange

      // Act
      const error = ApiError.unknown();

      // Assert
      expect(error.code).toBe('UNKNOWN');
      expect(error.message).toBe('Unknown error');
      expect(error.status).toBeUndefined();
    });
  });
});
