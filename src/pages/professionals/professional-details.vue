<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import professionalService from '@/services/professional.service'

const required = (v) => !!v || 'Campo obrigatório'
const onlyNumbers = (v) => /^\d*$/.test(v) || 'Apenas números são permitidos'
const exact11Digits = (v) => v.length === 11 || 'Deve conter exatamente 11 dígitos'

const formRef = ref(null)
const route = useRoute()
const router = useRouter()

const isEdit = ref(false)

const professional = ref({
  name: '',
  email: '',
  phone: '',
  document: '',
  specialty: ''
})

onMounted(async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    try {
      const response = await professionalService.getById(id)
      professional.value = response.data
    } catch (error) {
      console.error('Erro ao buscar profissional:', error)
    }
  }
})

const saveProfessional = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return

  try {
    if (isEdit.value) {
      await professionalService.update(route.params.id, professional.value)
    } else {
      await professionalService.create(professional.value)
    }
    router.push('/professionals')
  } catch (error) {
    console.error('Erro ao salvar profissional:', error)
  }
}
</script>

<template>
  <VContainer class="flex justify-center items-center min-h-screen bg-gray-100">
    <VCard class="w-full max-w-xl p-6 rounded-2xl shadow-lg">
      <VCardTitle class="text-xl font-bold text-gray-800">
        {{ isEdit ? 'Editar Profissional' : 'Cadastrar Profissional' }}
      </VCardTitle>
      <VCardText>
        <VForm ref="formRef">
          <div class="flex gap-4">
            <VTextField
              v-model="professional.name"
              label="Nome"
              :rules="[required]"
              variant="solo"
              dense
              class="mb-2"
            />
            <VTextField
              v-model="professional.phone"
              label="Telefone"
              :rules="[required, onlyNumbers, exact11Digits]"
              variant="solo"
              dense
              class="mb-2"
            />
          </div>

          <VTextField
            v-model="professional.email"
            label="E-mail"
            type="email"
            :rules="[required]"
            variant="solo"
            dense
            class="mb-2"
          />

          <VTextField
            v-model="professional.document"
            label="Documento"
            :rules="[required, onlyNumbers, exact11Digits]"
            variant="solo"
            dense
            class="mb-2"
          />

          <VTextField
            v-model="professional.specialty"
            label="Especialidade"
            :rules="[required]"
            variant="solo"
            dense
            class="mb-2"
          />

          <div class="flex justify-end mt-4">
            <VBtn color="blue-darken-4" class="text-white font-medium py-2" @click="saveProfessional">
              {{ isEdit ? 'Salvar Alterações' : 'Cadastrar' }}
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<style scoped>
</style>
