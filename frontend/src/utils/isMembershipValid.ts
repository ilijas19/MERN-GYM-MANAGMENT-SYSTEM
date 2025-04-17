export function isMembershipValid(dateStr: string): boolean {
  if (!dateStr) return false;

  const now = new Date();
  const expiration = new Date(dateStr);

  return expiration.getTime() > now.getTime(); // Checks date + time
}
