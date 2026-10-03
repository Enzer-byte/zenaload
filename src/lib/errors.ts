// Messages safe to show customers.
export class UserFacingError extends Error {}
export class NotConfiguredError extends Error {} // placeholder credentials still in place
export class SupplierRejectedError extends Error {} // supplier definitively refused: safe to try the next supplier
export class SupplierUnknownError extends Error {} // timeout/5xx: outcome unknown. NEVER fall back; status-check first
