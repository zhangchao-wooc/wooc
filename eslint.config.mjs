import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.base,
  {
    ignores: ['dist/**', 'node_modules/**', '.eslintrc.cjs'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/block-lang': 'off',
      'vue/require-v-for-key': 'off',
      'vue/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  skipFormatting,
)
