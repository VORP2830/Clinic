<script setup>
import { Users, Briefcase, CalendarCheck } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
}
</script>

<template>
  <v-app-bar color="white" elevation="2" class="px-6">
    <v-toolbar-title class="text-blue-900 font-bold text-xl">
      Clínica
    </v-toolbar-title>

    <v-spacer />

    <div class="flex gap-4">
      <v-btn
        variant="text"
        class="text-blue-900 font-medium text-base d-flex align-center gap-2"
        @click="navigateTo('/clients')"
      >
        <Users :size="18" />
        Clientes
      </v-btn>

      <v-btn
        variant="text"
        class="text-blue-900 font-medium text-base d-flex align-center gap-2"
        @click="navigateTo('/professionals')"
      >
        <Briefcase :size="18" />
        Profissionais
      </v-btn>

      <v-btn
        variant="text"
        class="text-blue-900 font-medium text-base d-flex align-center gap-2"
        @click="navigateTo('/consultations')"
      >
        <CalendarCheck :size="18" />
        Consultas
      </v-btn>
    </div>
  </v-app-bar>
</template>
