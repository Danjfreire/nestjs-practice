import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-anonymous';

export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
  constructor() {
    super();
  }

  authenticate(): void {
    return this.success({});
  }
}
