import { InternalServerErrorException } from '@nestjs/common';

export function handleCustomException({
  error,
  customMessage,
  displayMessage,
}: {
  error: Error;
  customMessage?: string;
  displayMessage?: string;
}) {
  throw new InternalServerErrorException({
    status: 'error',
    message: customMessage || error.message || 'Something went wrong',
    displayMessage: displayMessage || null,
  });
}
