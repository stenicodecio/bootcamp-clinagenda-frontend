<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'
import type { IDoctor, GetDoctorListRequest, GetDoctorListResponse } from '@/interfaces/doctor'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)

const filterName = ref<GetDoctorListRequest['name']>('')
const filterSpecialtyId = ref<ISpecialty['id'] | null>(null)
const filterStatusId = ref<IStatus['id'] | null>(null)

const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IDoctor[]>([])
const specialtyItems = ref<ISpecialty[]>([])
const statusItems = ref<IStatus[]>([])

const headers = [
  {
    title: 'ID',
    key: 'id',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'name', sortable: false },
  { title: 'Especialidades', key: 'specialty', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  {
    title: 'Ações',
    key: 'actions',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  }
]

const handleDataTableUpdate = async (tableOptions: any) => {
  page.value = tableOptions.page
  itemsPerPage.value = tableOptions.itemsPerPage
  loadDataTable()
}

const loadDataTable = async () => {
  isLoadingList.value = true
  const { isError, data } = await request<GetDoctorListRequest, GetDoctorListResponse>({
    method: 'GET',
    endpoint: 'doctor/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value,
      name: filterName.value,
      specialtyId: filterSpecialtyId.value,
      statusId: filterStatusId.value
    }
  })

  isLoadingList.value = false

  if (isError) return

  items.value = data.items
  total.value = data.total
}

const loadFilters = async () => {
  isLoadingFilter.value = true

  const specialtyRequest = request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  const statusRequest = request<undefined, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list'
  })

  const [specialtyResponse, statusResponse] = await Promise.all([specialtyRequest, statusRequest])

  isLoadingFilter.value = false

  if (specialtyResponse.isError || statusResponse.isError) return

  console.log('- specialtyResponse', specialtyResponse)
  specialtyItems.value = specialtyResponse.data.items
  statusItems.value = statusResponse.data.items
}

const deleteListItem = async (item: IDoctor) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.name}?`)

  if (!shouldDelete) return

  const response = await request<null, null>({
    method: 'DELETE',
    endpoint: `doctor/delete/${item.id}`
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: 'Profissional deletado com sucesso!'
  })

  loadDataTable()
}

onMounted(() => {
  loadFilters()
})
</script>

<template>
  <default-template>
    <template #title> Lista de profissionais </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'doctor-insert' }">
        Adicionar profissional
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field v-model.trim="filterName" label="Nome" hide-details />
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
              />
            </v-col>
            <v-col>
              <v-select
                v-model="filterStatusId"
                label="Status"
                :loading="isLoadingFilter"
                :items="statusItems"
                item-value="id"
                item-title="name"
                clearable
                hide-details
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
        <template #[`item.specialty`]="{ item }">
          <v-chip v-for="specialty of item.specialty" :key="specialty.id" class="mr-2">
            {{ specialty.name }}
          </v-chip>
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip>
            {{ item.status.name }}
          </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar profissional" location="left">
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
          <v-tooltip text="Editar profissional" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiSquareEditOutline"
                size="small"
                color="primary"
                :to="{ name: 'doctor-update', params: { id: item.id } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </default-template>
</template>
