<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { DoctorForm } from '@/interfaces/doctor'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
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

const form = ref<DoctorForm>({
  name: '',
  specialty: [],
  statusId: null
})
const specialtyItems = ref<ISpecialty[]>([])
const statusItems = ref<IStatus[]>([])

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar profissional' : 'Cadastrar novo profissional'
})

const submitForm = async () => {
  isLoadingForm.value = true
  const response = await request<DoctorForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'doctor/insert' : `doctor/update/${id}`,
    body: form.value
  })

  isLoadingForm.value = false

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Profissional ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
  })

  router.push({ name: 'doctor-list' })
}

const loadForm = async () => {
  isLoadingForm.value = true

  const specialtyRequest = request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  const statusRequest = request<undefined, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list'
  })

  const requests: Promise<any>[] = [specialtyRequest, statusRequest]

  if (pageMode === PageMode.PAGE_UPDATE) {
    const doctorFormRequest = request<undefined, DoctorForm>({
      method: 'GET',
      endpoint: `doctor/listById/${id}`
    })

    requests.push(doctorFormRequest)
  }

  const [specialtyResponse, statusResponse, doctorFormResponse] = await Promise.all(requests)

  isLoadingForm.value = false

  if (specialtyResponse.isError || statusResponse.isError || doctorFormResponse?.isError) return

  specialtyItems.value = specialtyResponse.data.items
  statusItems.value = statusResponse.data.items

  if (pageMode === PageMode.PAGE_UPDATE) {
    form.value = doctorFormResponse.data

    form.value.statusId = doctorFormResponse.data.status.id
    form.value.specialty = doctorFormResponse.data.specialty.map(
      (specialty: ISpecialty) => specialty.id
    )
  }
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
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'doctor-list' }"> Cancelar </v-btn>
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
          <v-select
            v-model="form.statusId"
            label="Status"
            :loading="isLoadingForm"
            :items="statusItems"
            item-value="id"
            item-title="name"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-label>Especialidades</v-label>
          <v-checkbox
            v-for="specialty in specialtyItems"
            :key="specialty.id"
            v-model="form.specialty"
            :label="specialty.name"
            :value="specialty.id"
          />
        </v-col>
      </v-row>
    </v-form>
  </default-template>
</template>
