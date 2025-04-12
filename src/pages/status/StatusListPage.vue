<script setup lang="ts">
import { ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import type { IStatus, GetStatusListRequest, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'

const toastStore = useToastStore()
const isLoadingList = ref<boolean>(false)
const itemsPerPage = ref<number>(50)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IStatus[]>([])

const headers = [
  {
    title: 'ID',
    key: 'id',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'name', sortable: false },
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
  const { isError, data } = await request<GetStatusListRequest, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value
    }
  })

  isLoadingList.value = false

  if (isError) return

  items.value = data.items
  total.value = data.total
}

const deleteListItem = async (item: IStatus) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.name}?`)

  if (!shouldDelete) return

  const response = await request<null, null>({
    method: 'DELETE',
    endpoint: `status/delete/${item.id}`
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: 'Status deletado com sucesso!'
  })

  loadDataTable()
}
</script>

<template>
  <default-template>
    <template #title> Lista de status </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'status-insert' }">
        Adicionar Status
      </v-btn>
    </template>

    <template #default>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="total"
        :items="items"
        :loading="isLoadingList"
        item-value="id"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar status" location="left">
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
