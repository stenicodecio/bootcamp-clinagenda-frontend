import { Mask } from 'maska'

export const phoneNumberMask = {
  preProcess: (val: string) => {
    return val.replace(/^[\,,\.]+/, '')
  },
  mask: '(##) # ####-####',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  eager: false
}

export const dateMask = {
  preProcess: (val: string) => {
    return val.replace(/^[\,,\.]+/, '')
  },
  mask: '##/##/####',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  eager: false
}

export const documentNumberMask = {
  preProcess: (val: string) => {
    return val.replace(/^[\,,\.]+/, '')
  },
  mask: '###.###.###-##',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  eager: false
}

export const timeMask = {
  preProcess: (val: string) => {
    return val.replace(/^[\,,\.\:]+/, '')
  },
  mask: '##:##',
  tokens: {
    9: { pattern: /[0-9]/, repeated: true }
  },
  eager: false
}

const documentNumberMaskClass = new Mask(documentNumberMask)
export const maskDocumentNumber = (s: string) => documentNumberMaskClass.masked(s)

const phoneNumberMaskClass = new Mask(phoneNumberMask)
export const maskPhoneNumber = (s: string) => phoneNumberMaskClass.masked(s)
