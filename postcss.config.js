import purgecss from '@fullhuman/postcss-purgecss'
import cssnano from 'cssnano'

export default {
  plugins: [
    purgecss.default({
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './src/**/*.html'
      ],
      safelist: [
        // Bootstrap Layout
        /^container(-fluid)?$/,
        /^row$/,
        /^col(-.*)?$/,
        /^g[xy]?-\d+$/,
        
        // Bootstrap Components
        /^btn(-.*)?$/,
        /^badge(-.*)?$/,
        /^spinner(-.*)?$/,
        /^form(-.*)?$/,
        /^input(-.*)?$/,
        /^select(-.*)?$/,
        /^textarea(-.*)?$/,
        /^card(-.*)?$/,
        /^nav(-.*)?$/,
        /^navbar(-.*)?$/,
        /^dropdown(-.*)?$/,
        /^modal(-.*)?$/,
        /^alert(-.*)?$/,
        /^progress(-.*)?$/,
        /^table(-.*)?$/,
        
        // Bootstrap Utilities
        /^d(-.*)?$/,
        /^p[xytblr]?-\d+$/,
        /^m[xytblr]?-\d+$/,
        /^text(-.*)?$/,
        /^bg(-.*)?$/,
        /^border(-.*)?$/,
        /^w(-.*)?$/,
        /^h(-.*)?$/,
        /^position(-.*)?$/,
        /^top-\d+$/,
        /^start-\d+$/,
        /^end-\d+$/,
        /^bottom-\d+$/,
        /^justify(-.*)?$/,
        /^align(-.*)?$/,
        /^flex(-.*)?$/,
        /^float(-.*)?$/,
        /^rounded(-.*)?$/,
        /^shadow(-.*)?$/,
        /^opacity(-.*)?$/,
        /^overflow(-.*)?$/,
        /^z(-.*)?$/,
        
        // Typography
        /^h[1-6]$/,
        /^display-\d+$/,
        /^fs(-.*)?$/,
        /^fw(-.*)?$/,
        /^lh(-.*)?$/,
        /^font(-.*)?$/,
        /^lead$/,
        /^mark$/,
        /^small$/,
        
        // Interactive states
        'active',
        'disabled',
        'show',
        'hide',
        'fade',
        'collapse',
        'collapsed',
        'collapsing',
        
        // Form validation
        'needs-validation',
        'was-validated',
        'is-valid',
        'is-invalid',
        'valid-feedback',
        'invalid-feedback',
        
        // Link utilities
        /^link(-.*)?$/
      ],
      // Standard extraction to catch more classes
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      // Remove unused CSS variables and keyframes
      variables: true,
      keyframes: true
    }),
    // Additional CSS optimization
    cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        reduceTransforms: true
      }]
    })
  ]
}