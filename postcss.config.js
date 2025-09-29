import purgecss from '@fullhuman/postcss-purgecss'

export default {
  plugins: [
    purgecss.default({
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './src/**/*.html'
      ],
      safelist: [
        // Keep Bootstrap utility classes and commonly used classes
        /^btn/,
        /^badge/,
        /^spinner/,
        /^modal/,
        /^dropdown/,
        /^form/,
        /^input/,
        /^select/,
        /^textarea/,
        /^card/,
        /^nav/,
        /^container/,
        /^row/,
        /^col/,
        /^d-/,
        /^p-/,
        /^m-/,
        /^text-/,
        /^bg-/,
        /^border/,
        /^w-/,
        /^h-/,
        /^justify/,
        /^align/,
        /^flex/,
        /^show/,
        /^hide/,
        /^fade/,
        /^collapse/,
        /^active/,
        /^disabled/,
        /^invalid/,
        /^valid/,
        'needs-validation',
        'was-validated'
      ],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
}