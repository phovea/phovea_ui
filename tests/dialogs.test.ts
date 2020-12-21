/// <reference types="jest" />
import {Dialog} from '../src/components/dialogs';

describe('generateDialog', () => {
  it('dummy', () => {
    expect(Dialog.generateDialog('hello')).toBeDefined();
  });
});
