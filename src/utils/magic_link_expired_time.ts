export function MagicLinkExpiredTime() {
  const futureDate = new Date();

  futureDate.setMinutes(futureDate.getMinutes() + 15)

  return futureDate
}
