<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { AppointmentForm } from '@/interfaces/appointment'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IPatient } from '@/interfaces/patient'
import type { GetDoctorListRequest, GetDoctorListResponse, IDoctor } from '@/interfaces/doctor'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'
import { dateFormat, DateFormatEnum, documentNumberMask, timeMask } from '@/utils'
import { vMaska } from 'maska/vue'
import ClinDatePicker from '@/components/ClinDatePicker.vue'

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const id = route.params.id
const pageMode = id ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<AppointmentForm>({
  patientId: null,
  doctorId: null,
  specialtyId: null,
  appointmentDate: '',
  observation: ''
})
const date = ref<Date>()
const time = ref<string>()

let debounceTimeout: number | null = null
const DEBOUNCE_TIME: number = 350

const patientAutocomplete = ref<string>('')
const patientLoading = ref<boolean>(false)
const patientItems = ref<IPatient[]>([])
const patientSelected = ref<IPatient | null>(null)

const requestAutocompletePatient = async (query: string) => {
  patientLoading.value = true

  const response = await request<{ name: string }, IPatient[]>({
    method: 'GET',
    endpoint: 'patient/autocomplete',
    body: { name: query }
  })

  patientItems.value = [...response.data]
  patientLoading.value = false
}

watch(patientAutocomplete, (newValue) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  if (!newValue || newValue.length < 3) {
    patientItems.value = []
    return
  }

  debounceTimeout = setTimeout(() => {
    requestAutocompletePatient(newValue)
  }, DEBOUNCE_TIME)
})

watch(patientSelected, (newPatientSelected) => {
  if (newPatientSelected) {
    form.value.patientId = newPatientSelected.id
  }
})

const doctorAutocomplete = ref<string>('')
const doctorLoading = ref<boolean>(false)
const doctorItems = ref<IDoctor[]>([])
const doctorSelected = ref<IDoctor | null>(null)

const requestAutocompleteDoctor = async (query: string) => {
  doctorLoading.value = true

  const response = await request<GetDoctorListRequest, GetDoctorListResponse>({
    method: 'GET',
    endpoint: 'doctor/list',
    body: { name: query, itemsPerPage: 10, page: 1 }
  })

  doctorItems.value = [...response.data.items]
  doctorLoading.value = false
}

watch(doctorAutocomplete, (newValue) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)

  if (!newValue || newValue.length < 3) {
    doctorItems.value = []
    return
  }

  debounceTimeout = setTimeout(() => {
    requestAutocompleteDoctor(newValue)
  }, DEBOUNCE_TIME)
})

watch(doctorSelected, (newDoctorSelected) => {
  if (newDoctorSelected) {
    form.value.doctorId = newDoctorSelected.id
  }
})

const specialtyItems = ref<ISpecialty[]>([])

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar agendamento' : 'Cadastrar novo agendamento'
})

const submitForm = async () => {
  isLoadingForm.value = true

  const body = {
    ...form.value,
    appointmentDate: `${dateFormat(
      form.value.appointmentDate,
      DateFormatEnum.FullDateAmerican.value
    )} ${time.value}:00`
  }

  const response = await request<AppointmentForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'appointment/insert' : `appointment/update/${id}`,
    body
  })

  isLoadingForm.value = false

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Agendamento ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
  })

  router.push({ name: 'appointment-list' })
}

const loadForm = async () => {
  isLoadingForm.value = true

  const specialtyRequest = request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  const requests: Promise<any>[] = [specialtyRequest]

  if (pageMode === PageMode.PAGE_UPDATE) {
    const appointmentFormRequest = request<undefined, AppointmentForm>({
      method: 'GET',
      endpoint: `appointment/listById/${id}`
    })

    requests.push(appointmentFormRequest)
  }

  const [specialtyResponse, appointmentFormResponse] = await Promise.all(requests)

  isLoadingForm.value = false

  if (specialtyResponse.isError || appointmentFormResponse?.isError) return

  specialtyItems.value = specialtyResponse.data

  if (pageMode === PageMode.PAGE_UPDATE) {
    form.value = {
      ...appointmentFormResponse.data,
      appointmentDate: dateFormat(
        appointmentFormResponse.data.appointmentDate,
        DateFormatEnum.FullDateAmericanAndTime.value,
        DateFormatEnum.FullDateAndTime.value
      )
    }

    const appointmentDateSplit = form.value.appointmentDate.split(' ')
    date.value = new Date(`${appointmentDateSplit[0]} 12:00:00`)
    time.value = appointmentDateSplit[1].substring(0, 5)

    loadAutocompleteData()
  }
}

const loadAutocompleteData = async () => {
  const patientRequest = request<undefined, IPatient>({
    method: 'GET',
    endpoint: `patient/listById/${form.value.patientId}`
  })

  const doctorRequest = request<undefined, IDoctor>({
    method: 'GET',
    endpoint: `doctor/listById/${form.value.doctorId}`
  })

  const [patientResponse, doctorResponse] = await Promise.all([patientRequest, doctorRequest])

  patientSelected.value = patientResponse.data
  doctorSelected.value = doctorResponse.data
}

watch([date, time], ([newDate, newTime]) => {
  const formattedDate = dateFormat(newDate, DateFormatEnum.FullDateAmerican.value)
  form.value.appointmentDate = `${formattedDate} ${newTime || ''}:00`
})

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
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'appointment-list' }"> Cancelar </v-btn>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <div class="text-h6 mb-2">Paciente</div>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            v-model:search="patientAutocomplete"
            v-model="patientSelected"
            :items="patientItems"
            :loading="patientLoading"
            item-title="name"
            label="Buscar paciente"
            placeholder="Digite um nome..."
            no-data-text="Nenhum paciente encontrado"
            clearable
            return-object
          />
        </v-col>
        <template v-if="patientSelected">
          <v-col cols="3">
            <v-text-field
              v-model.trim="patientSelected.documentNumber"
              v-maska="documentNumberMask"
              label="CPF"
              hide-details
              disabled
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model.trim="patientSelected.birthDate"
              label="Data Nascimento"
              hide-details
              disabled
            />
          </v-col>
          <v-col cols="2">
            <v-text-field
              v-model.trim="patientSelected.status.name"
              label="Status"
              hide-details
              disabled
            />
          </v-col>
        </template>
      </v-row>
      <div class="text-h6 mb-2 mt-12">Profissional</div>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            v-model:search="doctorAutocomplete"
            v-model="doctorSelected"
            :items="doctorItems"
            :loading="doctorLoading"
            item-title="name"
            item-value="id"
            label="Buscar profissional"
            placeholder="Digite um nome..."
            no-data-text="Nenhum profissional encontrado"
            clearable
            return-object
          />
        </v-col>
        <template v-if="doctorSelected">
          <v-col cols="3">
            <v-select
              v-model="form.specialtyId"
              :items="doctorSelected.specialty"
              label="Especialidade"
              item-value="id"
              item-title="name"
              clearable
              hide-details
            />
          </v-col>
        </template>
      </v-row>

      <div class="text-h6 mb-2 mt-12">Agendamento</div>
      <v-row>
        <v-col cols="2">
          <clin-date-picker v-model="date" label="Data" />
        </v-col>
        <v-col cols="2">
          <v-text-field v-model.trim="time" v-maska="timeMask" label="Horário" hide-details />
        </v-col>
        <v-col cols="12">
          <v-textarea v-model.trim="form.observation" label="Observações" hide-details />
        </v-col>
      </v-row>
    </v-form>
  </default-template>
</template>
