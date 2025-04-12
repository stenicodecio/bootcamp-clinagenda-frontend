<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { StatusForm } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const id = route.params.id
const pageMode = id ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<StatusForm>({
  name: ''
})

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar status' : 'Cadastrar novo status'
})

const submitForm = async () => {
  isLoadingForm.value = true
  const response = await request<StatusForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'status/insert' : `status/update/${id}`,
    body: form.value
  })

  isLoadingForm.value = false

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Status ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
  })

  router.push({ name: 'status-list' })
}

const loadForm = async () => {
  if (pageMode === PageMode.PAGE_INSERT) return

  isLoadingForm.value = true
  const statusFormResponse = await request<undefined, StatusForm>({
    method: 'GET',
    endpoint: `status/update/${id}`
  })

  isLoadingForm.value = false

  if (statusFormResponse?.isError) return

  form.value = statusFormResponse.data
}

onMounted(() => {
  loadForm()
})
</script>

<template>
  <default-template>
    <template #title>
      {{ pageTitle }}
    </template>

    <template #action>
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'status-list' }"> Cancelar </v-btn>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model.trim="form.name" label="Nome" hide-details />
        </v-col>
      </v-row>
    </v-form>
  </default-template>
</template>
