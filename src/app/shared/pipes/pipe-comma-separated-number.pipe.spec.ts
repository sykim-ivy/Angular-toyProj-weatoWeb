import { PipeCommaSeparatedNumberPipe } from './pipe-comma-separated-number.pipe';

describe('PipeCommaSeparatedNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new PipeCommaSeparatedNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
