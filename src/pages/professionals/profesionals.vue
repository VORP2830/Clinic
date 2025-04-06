<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import professionalService from '@/services/professional.service'
import { PencilLine, Trash2, Plus, X } from 'lucide-vue-next'

const router = useRouter()

const professionals = ref([])
const isLoading = ref(false)
const totalItems = ref(0)

const page = ref(1)
const pageSize = ref(10)

const filterName = ref('')
const filterEmail = ref('')
const filterPhone = ref('')
const filterSpecialty = ref('')

const loadProfessionals = async () => {
  isLoading.value = true
  try {
    const res = await professionalService.get({
      pageNumber: page.value,
      pageSize: pageSize.value,
      name: filterName.value,
      email: filterEmail.value,
      phone: filterPhone.value,
      specialty: filterSpecialty.value
    })

    professionals.value = res.data.items
    totalItems.value = res.data.totalCount
  } catch (err) {
    console.error('Erro ao buscar profissionais:', err)
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  page.value = 1
  loadProfessionals()
}

const clearFilters = () => {
  filterName.value = ''
  filterEmail.value = ''
  filterPhone.value = ''
  filterSpecialty.value = ''
  page.value = 1
  loadProfessionals()
}

const deleteProfessional = async (id) => {
  if (confirm('Tem certeza que deseja excluir este profissional?')) {
    try {
      await professionalService.delete(id)
      await loadProfessionals()
    } catch (err) {
      console.error('Erro ao excluir profissional:', err)
    }
  }
}

const goToEdit = (id) => {
  router.push(`/professionals/${id}/details`)
}

const goToCreate = () => {
  router.push('/professionals/create')
}

onMounted(loadProfessionals)
watch(page, loadProfessionals)
</script>

<template>
  <VContainer>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-blue-900">Profissionais</h1>
      <VBtn color="blue-darken-3" class="text-white" @click="goToCreate">
        <Plus :size="18" class="mr-2" />
        Novo Profissional
      </VBtn>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <VTextField v-model="filterName" label="Nome" variant="solo" dense @keyup.enter="applyFilters" />
      <VTextField v-model="filterEmail" label="E-mail" variant="solo" dense @keyup.enter="applyFilters" />
      <VTextField v-model="filterPhone" label="Telefone" variant="solo" dense @keyup.enter="applyFilters" />
      <VTextField v-model="filterSpecialty" label="Especialidade" variant="solo" dense @keyup.enter="applyFilters" />
    </div>

    <div class="flex gap-4 mb-6">
      <VBtn color="primary" @click="applyFilters">Filtrar</VBtn>
      <VBtn color="grey-darken-1" class="text-white" @click="clearFilters">
        <X :size="18" class="mr-1" /> Limpar Filtros
      </VBtn>
    </div>

    <VProgressLinear v-if="isLoading" indeterminate color="blue-darken-2" class="mb-4" />

    <VTable class="rounded-md overflow-hidden shadow-sm border border-gray-200 mb-8">
      <thead class="bg-blue-100 text-blue-900 font-semibold">
        <tr>
          <th class="text-left px-4 py-3">Nome</th>
          <th class="text-left px-4 py-3">Especialidade</th>
          <th class="text-left px-4 py-3">Documento</th>
          <th class="text-left px-4 py-3">Telefone</th>
          <th class="text-left px-4 py-3">E-mail</th>
          <th class="text-left px-4 py-3 w-[160px]">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="professional in professionals"
          :key="professional.id"
          class="hover:bg-blue-50 transition border-t border-gray-200"
        >
          <td class="px-4 py-3">{{ professional.name }}</td>
          <td class="px-4 py-3">{{ professional.specialty }}</td>
          <td class="px-4 py-3">{{ professional.document }}</td>
          <td class="px-4 py-3">{{ professional.phone }}</td>
          <td class="px-4 py-3">{{ professional.email }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2 min-h-[56px]">
              <VBtn size="small" icon color="blue-darken-2" @click="goToEdit(professional.id)">
                <PencilLine :size="18" />
              </VBtn>
              <VBtn size="small" icon color="red-darken-2" @click="deleteProfessional(professional.id)">
                <Trash2 :size="18" />
              </VBtn>
            </div>
          </td>
        </tr>

        <tr v-if="!professionals.length && !isLoading">
          <td colspan="6" class="text-center text-gray-500 py-6">
            Nenhum profissional encontrado.
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
