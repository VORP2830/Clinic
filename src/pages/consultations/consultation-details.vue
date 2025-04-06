<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import clientService from '@/services/client.service'
import professionalService from '@/services/professional.service'
import consultationService from '@/services/consultation.service'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

const isEdit = ref(false)
const formRef = ref(null)

const clients = ref([])
const professionals = ref([])

const consultation = ref({
  clientId: '',
  professionalId: '',
  date: '',
  status: ''
})

const statusOptions = ['agendada', 'realizada', 'cancelada']

const loadClientsAndProfessionals = async () => {
  try {
    const clientRes = await clientService.get({ pageSize: 9999 })
    clients.value = clientRes.data.items

    const proRes = await professionalService.get({ pageSize: 9999 })
    professionals.value = proRes.data.items
  } catch (err) {
    console.error('Erro ao carregar profissionais ou clientes:', err)
  }
}

const loadConsultation = async () => {
  const id = route.params.id
  if (!id) return

  isEdit.value = true

  try {
    const res = await consultationService.getById(id)
    const data = res.data

    consultation.value = {
      ...data,
      date: dayjs(data.date).format('YYYY-MM-DDTHH:mm')
    }
  } catch (err) {
    console.error('Erro ao buscar consulta:', err)
  }
}

const saveConsultation = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const payload = {
    ...consultation.value,
    date: new Date(consultation.value.date).toISOString()
  }

  try {
    if (isEdit.value) {
      await consultationService.update(route.params.id, payload)
    } else {
      await consultationService.create(payload)
    }
    router.push('/consultations')
  } catch (err) {
    console.error('Erro ao salvar consulta:', err)
  }
}

onMounted(async () => {
  await loadClientsAndProfessionals()
  await loadConsultation()
})
</script>

<template>
  <VContainer class="flex justify-center items-center min-h-screen bg-gray-100">
    <VCard class="w-full max-w-xl p-6 rounded-2xl shadow-lg">
      <VCardTitle class="text-xl font-bold text-gray-800">
        {{ isEdit ? 'Editar Consulta' : 'Nova Consulta' }}
      </VCardTitle>
      <VCardText>
        <VForm ref="formRef">
          <VSelect
            v-model="consultation.clientId"
            :items="clients"
            item-value="id"
            item-title="name"
            label="Cliente"
            :rules="[v => !!v || 'Campo obrigatório']"
            variant="solo"
            dense
            class="mb-4"
          />

          <VSelect
            v-model="consultation.professionalId"
            :items="professionals"
            item-value="id"
            item-title="name"
            label="Profissional"
            :rules="[v => !!v || 'Campo obrigatório']"
            variant="solo"
            dense
            class="mb-4"
          />

          <VTextField
            v-model="consultation.date"
            label="Data e Hora"
            type="datetime-local"
            :rules="[v => !!v || 'Campo obrigatório']"
            variant="solo"
            dense
            class="mb-4"
          />

          <VSelect
            v-model="consultation.status"
            :items="statusOptions"
            label="Status"
            :rules="[v => !!v || 'Campo obrigatório']"
            variant="solo"
            dense
            class="mb-4"
          />

          <div class="flex justify-end mt-4">
            <VBtn color="blue-darken-4" class="text-white font-medium py-2" @click="saveConsultation">
              {{ isEdit ? 'Salvar Alterações' : 'Cadastrar' }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>
