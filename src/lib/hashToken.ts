import { createHash } from 'crypto';

function hashToken(token: string): string {
  return  createHash('sha512').update(token).digest('hex');
}

export { hashToken };