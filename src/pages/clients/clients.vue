<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import clientService from '@/services/client.service'
import { PencilLine, Trash2, Plus, X } from 'lucide-vue-next'

const router = useRouter()

const clients = ref([])
const isLoading = ref(false)
const totalItems = ref(0)

const page = ref(1)
const pageSize = ref(10)

const filterName = ref('')
const filterEmail = ref('')

const loadClients = async () => {
  isLoading.value = true
  try {
    const res = await clientService.get({
      pageNumber: page.value,
      pageSize: pageSize.value,
      name: filterName.value,
      email: filterEmail.value,
    })

    clients.value = res.data.items
    totalItems.value = res.data.totalCount
  } catch (err) {
    console.error('Erro ao buscar clientes:', err)
  } finally {
    isLoading.value = false
  }
}

const deleteClient = async (id) => {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    try {
      await clientService.delete(id)
      await loadClients()
    } catch (err) {
      console.error('Erro ao excluir cliente:', err)
    }
  }
}

const goToEdit = (id) => {
  router.push(`/clients/${id}/details`)
}

const goToCreate = () => {
  router.push('/clients/create')
}

const applyFilters = () => {
  page.value = 1
  loadClients()
}

const clearFilters = () => {
  filterName.value = ''
  filterEmail.value = ''
  page.value = 1
  loadClients()
}

onMounted(loadClients)
watch([page], loadClients)
</script>

<template>
  <VContainer>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-blue-900">Clientes</h1>
      <VBtn color="blue-darken-3" class="text-white" @click="goToCreate">
        <Plus :size="18" class="mr-2" />
        Novo Cliente
      </VBtn>
    </div>

    <div class="flex gap-4 mb-4 items-end">
      <VTextField
        v-model="filterName"
        label="Buscar por nome"
        variant="solo"
        dense
        class="w-1/3"
        @keyup.enter="applyFilters"
      />
      <VTextField
        v-model="filterEmail"
        label="Buscar por e-mail"
        variant="solo"
        dense
        class="w-1/3"
        @keyup.enter="applyFilters"
      />
      <VBtn color="primary" class="h-[40px]" @click="applyFilters">
        Filtrar
      </VBtn>
      <VBtn color="grey-darken-1" class="h-[40px] text-white" @click="clearFilters">
        <X :size="18" class="mr-1" />
        Limpar
      </VBtn>
    </div>

    <VProgressLinear v-if="isLoading" indeterminate color="blue-darken-2" class="mb-4" />

    <VTable class="rounded-md overflow-hidden shadow-sm border border-gray-200 mb-8">
      <thead class="bg-blue-100 text-blue-900 font-semibold">
        <tr>
          <th class="text-left px-4 py-3">Nome</th>
          <th class="text-left px-4 py-3">E-mail</th>
          <th class="text-left px-4 py-3 w-[160px]">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="client in clients"
          :key="client.id"
          class="hover:bg-blue-50 transition border-t border-gray-200"
        >
          <td class="px-4 py-3">{{ client.name }}</td>
          <td class="px-4 py-3">{{ client.email }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2 min-h-[56px]">
              <VBtn size="small" icon color="blue-darken-2" @click="goToEdit(client.id)">
                <PencilLine :size="18" />
              </VBtn>
              <VBtn size="small" icon color="red-darken-2" @click="deleteClient(client.id)">
                <Trash2 :size="18" />
              </VBtn>
            </div>
          </td>
        </tr>

        <tr v-if="!clients.length && !isLoading">
          <td colspan="3" class="text-center text-gray-500 py-6">
            Nenhum cliente encontrado.
          </td>
        </tr>
      </tbody>
    </VTable>

    <div class="flex justify-center mb-10">
      <VPagination
        v-model="page"
        :length="Math.ceil(totalItems / pageSize)"
        color="blue-darken-2"
        total-visible="7"
      />
    </div>
  </VContainer>
</template>
