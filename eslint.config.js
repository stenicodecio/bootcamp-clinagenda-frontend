import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  skipFormatting,

  {
    rules: {
      quotes: [2, 'single', { avoidEscape: true }],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true
        }
      ],
      'vue/valid-v-slot': [
        'error',
        {
          allowModifiers: true
        }
      ],
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]
