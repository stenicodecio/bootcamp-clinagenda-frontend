<script setup lang="ts">
import { ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import type {
  ISpecialty,
  GetSpecialtyListRequest,
  GetSpecialtyListResponse
} from '@/interfaces/specialty'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'

const toastStore = useToastStore()
const isLoadingList = ref<boolean>(false)
const filterName = ref<GetSpecialtyListRequest['name']>('')
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<ISpecialty[]>([])

const headers = [
  {
    title: 'ID',
    key: 'id',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'name', sortable: false },
  { title: 'Duração', key: 'scheduleDuration', sortable: false },
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
  const { isError, data } = await request<GetSpecialtyListRequest, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value,
      name: filterName.value
    }
  })

  isLoadingList.value = false

  if (isError) return

  items.value = data.items
  total.value = data.total
}

const deleteListItem = async (item: ISpecialty) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.name}?`)

  if (!shouldDelete) return

  const response = await request<null, null>({
    method: 'DELETE',
    endpoint: `specialty/delete/${item.id}`
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: 'Especialidade deletada com sucesso!'
  })

  loadDataTable()
}
</script>

<template>
  <default-template>
    <template #title> Lista de especialidades </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'specialty-insert' }">
        Adicionar especialidade
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field v-model.trim="filterName" label="Nome" hide-details />
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
        <template #[`item.scheduleDuration`]="{ item }">
          {{ item.scheduleDuration }} minutos
        </template>
        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar especialidade" location="left">
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
        </template>
      </v-data-table-server>
    </template>
  </default-template>
</template>
