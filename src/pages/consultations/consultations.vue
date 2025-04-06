<script setup>
import { ref, onMounted, watch } from 'vue'
import consultationService from '@/services/consultation.service'
import clientService from '@/services/client.service'
import professionalService from '@/services/professional.service'
import { PencilLine, Plus, X } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const router = useRouter()

const consultations = ref([])
const isLoading = ref(false)
const totalItems = ref(0)
const page = ref(1)
const pageSize = ref(10)
const filterStatus = ref('')

const clientsMap = ref({})
const professionalsMap = ref({})

const loadClientsAndProfessionals = async () => {
  try {
    const clientsRes = await clientService.get({ pageSize: 9999 })
    const professionalsRes = await professionalService.get({ pageSize: 9999 })

    clientsMap.value = Object.fromEntries(
        clientsRes.data.items.map(client => [client.id, client.name])
    )

    professionalsMap.value = Object.fromEntries(
        professionalsRes.data.items.map(pro => [pro.id, { name: pro.name, specialty: pro.specialty }])
    )
  } catch (err) {
    console.error('Erro ao carregar clientes e profissionais:', err)
  }
}

const loadConsultations = async () => {
  isLoading.value = true
  try {
    const res = await consultationService.get({
      pageNumber: page.value,
      pageSize: pageSize.value,
      status: filterStatus.value,
    })

    consultations.value = res.data.items
    totalItems.value = res.data.totalCount
  } catch (err) {
    console.error('Erro ao buscar consultas:', err)
  } finally {
    isLoading.value = false
  }
}

const goToCreate = () => {
  router.push('/consultations/create')
}

const goToEdit = (id) => {
  router.push(`/consultations/${id}/details`)
}

const deleteConsultation = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta consulta?')) {
    try {
      await consultationService.delete(id)
      await loadConsultations()
    } catch (err) {
      console.error('Erro ao excluir consulta:', err)
    }
  }
}

const applyFilters = () => {
  page.value = 1
  loadConsultations()
}

const clearFilters = () => {
  filterStatus.value = ''
  page.value = 1
  loadConsultations()
}

onMounted(async () => {
  await loadClientsAndProfessionals()
  await loadConsultations()
})

watch(page, loadConsultations)
</script>

<template>
  <VContainer>
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-900">Consultas</h1>
        <VBtn color="blue-darken-3" class="text-white" @click="goToCreate">
            <Plus :size="18" class="mr-2" />
            Nova Consulta
        </VBtn>
    </div>

    <div class="flex gap-4 mb-4 items-end">
      <VTextField
        v-model="filterStatus"
        label="Status da consulta"
        variant="solo"
        dense
        class="w-full md:w-1/4"
        @keyup.enter="applyFilters"
      />
      <VBtn color="primary" class="h-[56px]" @click="applyFilters">
        Filtrar
      </VBtn>
      <VBtn color="grey-darken-1" class="h-[56px] text-white" @click="clearFilters">
        <X :size="18" class="mr-1" />
        Limpar
      </VBtn>
    </div>

    <VProgressLinear v-if="isLoading" indeterminate color="blue-darken-2" class="mb-4" />

    <VTable class="rounded-md overflow-hidden shadow-sm border border-gray-200 mb-8">
      <thead class="bg-blue-100 text-blue-900 font-semibold">
        <tr>
          <th class="text-left px-4 py-3">Cliente</th>
          <th class="text-left px-4 py-3">Profissional</th>
          <th class="text-left px-4 py-3">Especialidade</th>
          <th class="text-left px-4 py-3">Data</th>
          <th class="text-left px-4 py-3">Status</th>
          <th class="text-left px-4 py-3 w-[160px]">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
            v-for="consultation in consultations"
            :key="consultation.id"
            class="hover:bg-blue-50 transition border-t border-gray-200"
        >
            <td class="px-4 py-3">{{ clientsMap[consultation.clientId] || '—' }}</td>
            <td class="px-4 py-3">{{ professionalsMap[consultation.professionalId].name || '—' }}</td>
            <td class="px-4 py-3">{{ professionalsMap[consultation.professionalId].specialty || '—' }}</td>
            <td class="px-4 py-3">
            {{ dayjs(consultation.date).format('DD/MM/YYYY [às] HH:mm') }}
            </td>
            <td class="px-4 py-3 capitalize">{{ consultation.status }}</td>
            <td class="px-4 py-3">
            <div class="flex items-center gap-2 min-h-[56px]">
                <VBtn
                size="small"
                icon
                color="blue-darken-2"
                @click="goToEdit(consultation.id)"
                >
                <PencilLine :size="18" />
                </VBtn>
                <VBtn
                size="small"
                icon
                color="red-darken-2"
                @click="deleteConsultation(consultation.id)"
                >
                <X :size="18" />
                </VBtn>
            </div>
            </td>
        </tr>

        <tr v-if="!consultations.length && !isLoading">
            <td colspan="5" class="text-center text-gray-500 py-6">
            Nenhuma consulta encontrada.
            </td>
        </tr>
        </tbody>
    </VTable>

    <div class="flex justify-center mb-10">
      <VPagination
        v-model="page"
        :length="Math.max(1, Math.ceil(totalItems / pageSize))"
        color="blue-darken-2"
        total-visible="7"
      />
    </div>
  </VContainer>
</template>

<style scoped>
</style>
