import { Constant } from '@/constants';

export class UserSession {
  id: bigint;
  kind: number;

  constructor(id: bigint, kind: number) {
    this.id = id;
    this.kind = kind;
  }

  public getKeyType(): string {
    return this.kind === Constant.ACCOUNT_KIND_USER ? 'usr' : 'emp';
  }
}
