import { defineStore } from 'pinia'

type IToast = {
  type: 'success' | 'error' | 'warning' | 'info' | 'primary'
  text: string
  timeoutDestroy?: number
}

const messages: IToast[] = []

export const useToastStore = defineStore('toast', {
  state: () => ({
    messages
  }),
  actions: {
    setToast(message: IToast) {
      this.messages.push(message)
      setTimeout(() => this.messages.pop(), message.timeoutDestroy ?? 3500)
    }
  }
})
