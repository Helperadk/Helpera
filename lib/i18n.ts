export type Lang = 'da' | 'en'

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'da'
  const saved = window.localStorage.getItem('lang')
  return saved === 'en' ? 'en' : 'da'
}

export function setLang(lang: Lang) {
  window.localStorage.setItem('lang', lang)
}

export const t = (lang: Lang) => ({
  appName: 'Helpera',
  browseTitle: lang === 'da' ? 'Opslag' : 'Jobs',
  searchPh: lang === 'da' ? 'Søg: fx hund, have, pakke…' : 'Search: dog, garden, package…',
  region: lang === 'da' ? 'Landsdel' : 'Region',
  all: lang === 'da' ? 'Alle' : 'All',
  view: lang === 'da' ? 'Se opslag' : 'View',
  post: lang === 'da' ? 'Opret opslag' : 'Post a job',
  bid: lang === 'da' ? 'Byd på opgave' : 'Make an offer',
  contact: lang === 'da' ? 'Kontakt' : 'Contact',
  email: lang === 'da' ? 'Din e-mail' : 'Your email',
  message: lang === 'da' ? 'Besked' : 'Message',
  send: lang === 'da' ? 'Send' : 'Send',
  sent: lang === 'da' ? 'Sendt!' : 'Sent!',
  price: lang === 'da' ? 'Pris' : 'Price',
})
