export class ServerError extends Error {
  constructor(stack = 'Internal server error') {
    super('Internal server error');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
