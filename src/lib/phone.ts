// Turns "082 123 4567" or "+27 82 123 4567" into "27821234567" for wa.me
export function toWhatsAppNumber(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = '27' + digits.slice(1) // local SA number
  return digits
}

export function toTelNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, '')
}