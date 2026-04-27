// @waimia/lib · point d'entrée
//
// Sub-paths exposés via package.json `exports` :
//   import { resend } from '@waimia/lib/resend'
//   import { translate } from '@waimia/lib/i18n'
//   import type { Lead, ContactSubmission } from '@waimia/lib/types'
//
// Règle promotion (best practice 2025) : un util ne monte ici qu'au 3e usage
// cross-app. Tant qu'il vit dans 1 seule app, il y reste. Évite la sur-archi.

export const PACKAGE_VERSION = '0.0.1';
