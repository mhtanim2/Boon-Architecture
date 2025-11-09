export class MagicLinkTokensMemoryStorage {
  tokens: Map<string, string>;

  constructor() {
    this.tokens = new Map();
  }

  async set(code: string, token: string) {
    return this.tokens.set(code, token);
  }

  async get(code: string) {
    return this.tokens.get(code);
  }

  async delete(code: string) {
    return this.tokens.delete(code);
  }
}
