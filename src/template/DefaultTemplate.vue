<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import ClinicToast from '@/components/ClinicToast.vue'
import {
  mdiAccountInjuryOutline,
  mdiAccountTag,
  mdiHome,
  mdiLogout,
  mdiShapeOutline,
  mdiDoctor,
  mdiCalendarMultiselect
} from '@mdi/js'

const drawer = ref(true)

const menus = ref([
  {
    title: 'Dashboard',
    icon: mdiHome,
    to: { name: 'dashboard' }
  },
  {
    title: 'Status',
    icon: mdiAccountTag,
    to: { name: 'status-list' }
  },
  {
    title: 'Especialidades',
    icon: mdiShapeOutline,
    to: { name: 'specialty-list' }
  },
  {
    title: 'Pacientes',
    icon: mdiAccountInjuryOutline,
    to: { name: 'patient-list' }
  },
  {
    title: 'Doctor',
    icon: mdiDoctor,
    to: { name: 'doctor-list' }
  },
  {
    title: 'Agendamento',
    icon: mdiCalendarMultiselect,
    to: { name: 'appointment-list' }
  }
])

const slots = useSlots()
const contentClass = computed(() => {
  return slots.action || slots.title ? 'pt-4' : ''
})

const isMock = import.meta.env.VITE_USE_MOCK === 'true'
</script>

<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />

    <v-toolbar-title>ClinAgenda</v-toolbar-title>

    <div>
      <v-alert v-if="isMock" color="warning" icon="$warning" density="compact">
        MOCK ATIVADO
      </v-alert>
    </div>
    <v-spacer />

    <v-btn :icon="mdiLogout" variant="text" />
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined">
    <v-list>
      <v-list-item
        v-for="menu in menus"
        :key="menu.title"
        :prepend-icon="menu.icon"
        :to="menu.to"
        color="primary"
        :title="menu.title"
      />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <div class="pa-6">
      <div class="header">
        <div class="header__title text-h4"><slot name="title" /></div>
        <div class="header__action">
          <slot name="action" />
        </div>
      </div>

      <div class="content" :class="contentClass">
        <slot />
      </div>
    </div>
    <clinic-toast />
  </v-main>
</template>

<style lang="css" scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header__title {
  width: 100%;
}

.header__action {
  display: flex;
  gap: 1rem;
}
</style>
