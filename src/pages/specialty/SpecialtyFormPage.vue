<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { SpecialtyForm } from '@/interfaces/specialty'
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

const form = ref<SpecialtyForm>({
  name: '',
  scheduleDuration: ''
})

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar especialidade' : 'Cadastrar nova especialidade'
})

const submitForm = async () => {
  isLoadingForm.value = true
  const response = await request<SpecialtyForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'specialty/insert' : `specialty/update/${id}`,
    body: form.value
  })

  isLoadingForm.value = false

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Especialidade ${pageMode == PageMode.PAGE_INSERT ? 'criada' : 'alterada'} com sucesso!`
  })

  router.push({ name: 'specialty-list' })
}

const loadForm = async () => {
  if (pageMode === PageMode.PAGE_INSERT) return

  isLoadingForm.value = true

  const specialtyFormResponse = await request<undefined, SpecialtyForm>({
    method: 'GET',
    endpoint: `specialty/update/${id}`
  })

  isLoadingForm.value = false

  if (specialtyFormResponse?.isError) return

  form.value = specialtyFormResponse.data
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
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'specialty-list' }"> Cancelar </v-btn>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model.trim="form.name" label="Nome" hide-details />
        </v-col>
        <v-col cols="2">
          <v-text-field v-model.trim="form.scheduleDuration" label="Duração" hide-details />
        </v-col>
      </v-row>
    </v-form>
  </default-template>
</template>
