// @waimia/db · point d'entrée · à venir
//
// Plan : exposer Prisma client typé partagé entre apps/cal (existant) et future
// apps/api business. Tant qu'apps/cal vit en yarn 4 berry isolé avec son propre
// Prisma, ce package reste un skeleton — on l'activera quand 2+ apps en pnpm
// auront besoin de partager des types DB (règle 2025 : 3 usages = extraction).

export const PACKAGE_VERSION = '0.0.1';
