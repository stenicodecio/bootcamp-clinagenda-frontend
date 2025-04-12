<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'
import type {
  IAppointment,
  GetAppointmentListRequest,
  GetAppointmentListResponse
} from '@/interfaces/appointment'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IPatient } from '@/interfaces/patient'
import type { IDoctor } from '@/interfaces/doctor'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import { maskDocumentNumber } from '@/utils'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)

const filterDoctorName = ref<IDoctor['name']>('')
const filterPatientName = ref<IPatient['name']>('')
const filterSpecialtyId = ref<ISpecialty['id'] | null>(null)

const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IAppointment[]>([])
const specialtyItems = ref<ISpecialty[]>([])

const headers = [
  {
    title: 'ID',
    key: 'id',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Paciente', key: 'patient.name', sortable: false },
  { title: 'CPF', key: 'patient.documentNumber', sortable: false },
  { title: 'Profissional', key: 'doctor.name', sortable: false },
  { title: 'Especialidade', key: 'specialty', sortable: false },
  { title: 'Horário da consulta', key: 'appointmentDate', sortable: false },
  {
    title: 'Ações',
    key: 'actions',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  }
]

const handleDataTableUpdate = async ({ page: tablePage, itemsPerPage: tableItemsPerPage }: any) => {
  page.value = tablePage
  itemsPerPage.value = tableItemsPerPage
  loadDataTable()
}

const loadDataTable = async () => {
  isLoadingList.value = true
  const { isError, data } = await request<GetAppointmentListRequest, GetAppointmentListResponse>({
    method: 'GET',
    endpoint: 'appointment/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value,
      doctorName: filterDoctorName.value,
      patientName: filterPatientName.value,
      specialtyId: filterSpecialtyId.value
    }
  })

  isLoadingList.value = false

  if (isError) return

  items.value = data.items
  total.value = data.total
}

const loadFilters = async () => {
  isLoadingFilter.value = true

  const specialtyResponse = await request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  isLoadingFilter.value = false

  if (specialtyResponse.isError) return

  specialtyItems.value = specialtyResponse.data.items
}

const deleteListItem = async (item: IAppointment) => {
  const shouldDelete = confirm(
    `Deseja mesmo deletar agendamento? \n\nHorário: ${item.appointmentDate} \nPaciente: ${item.patient.name}\nAgendamento: ${item.doctor.name}`
  )

  if (!shouldDelete) return

  const response = await request<null, null>({
    method: 'DELETE',
    endpoint: `appointment/delete/${item.id}`
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: 'Agendamento deletado com sucesso!'
  })

  loadDataTable()
}

onMounted(() => {
  loadFilters()
})
</script>

<template>
  <default-template>
    <template #title> Lista de agendamentos </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'appointment-insert' }">
        Adicionar agendamento
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field v-model.trim="filterDoctorName" label="Profissional" hide-details />
            </v-col>
            <v-col>
              <v-text-field v-model.trim="filterPatientName" label="Paciente" hide-details />
            </v-col>
            <v-col>
              <v-select
                v-model="filterSpecialtyId"
                label="Especialidade"
                :loading="isLoadingFilter"
                :items="specialtyItems"
                item-value="id"
                item-title="name"
                clearable
                hide-details
                @click:clear="loadDataTable"
              />
            </v-col>
            <v-col cols="auto" class="d-flex align-center">
              <v-btn color="primary" type="submit">Filtrar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="total"
        :items="items"
        :loading="isLoadingList"
        item-value="id"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.patient.documentNumber`]="{ item }">
          {{ maskDocumentNumber(item.patient.documentNumber) }}
        </template>
        <template #[`item.specialty`]="{ item }">
          <v-chip>
            {{ item.specialty.name }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar agendamento" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiTrashCan"
                size="small"
                color="error"
                class="mr-2"
                @click="deleteListItem(item)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Editar agendamento" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiSquareEditOutline"
                size="small"
                color="primary"
                :to="{ name: 'appointment-update', params: { id: item.id } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </default-template>
</template>
