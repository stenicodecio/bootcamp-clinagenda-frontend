<template>
  <v-app>
    <router-view :key="`${$route.fullPath}${$route.name?.toString()}`" />
  </v-app>
</template>
