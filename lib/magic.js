import { Magic } from 'magic-sdk';
import { WebAuthnExtension } from '@magic-ext/webauthn';

// Create client-side Magic instance
const createMagic = () => {
  return (
    typeof window != 'undefined' &&
    new Magic('pk_test_196B83E1C870F939', {
      extensions: [new WebAuthnExtension()],
    })
  );
};

export const magic = createMagic();
