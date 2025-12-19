import { sarast } from '@sarast/eslint-config';
import globals from 'globals';

export default sarast().append({
  languageOptions: {
    globals: {
      ...globals.browser,
      chrome: 'readonly',
    },
  },
});
