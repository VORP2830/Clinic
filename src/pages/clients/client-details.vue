<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import clientService from '@/services/client.service'
import viaCepService from '@/services/viacep.service'

const required = (v) => !!v || 'Campo obrigatório'

const route = useRoute()
const router = useRouter()

const formRef = ref(null)

const client = ref({
  name: '',
  email: '',
  phone: '',
  addresses: [
    {
      street: '',
      complement: '',
      number: '',
      city: '',
      state: '',
      postalCode: ''
    }
  ]
})

const isEdit = ref(false)

onMounted(async () => {
  const id = route.params.id
  if (id) {
    isEdit.value = true
    try {
      const response = await clientService.getById(id)
      client.value = response.data
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
    }
  }
})

watch(() => client.value.addresses[0].postalCode, async (cep) => {
  if (cep && cep.length >= 8) {
    try {
      const address = await viaCepService.getAddressByCep(cep)
      if (!address.erro) {
        client.value.addresses[0].street = address.logradouro
        client.value.addresses[0].city = address.localidade
        client.value.addresses[0].state = address.estado
      }
    } catch (e) {
      console.error('Erro ao buscar CEP:', e)
    }
  }
})

const saveClient = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) {
    return
  }

  try {
    if (isEdit.value) {
      await clientService.update(route.params.id, client.value)
    } else {
      await clientService.create(client.value)
    }
    router.push('/clients')
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
  }
}
</script>

<template>
  <VContainer class="flex justify-center items-center min-h-screen bg-gray-100">
    <VCard class="w-full max-w-xl p-6 rounded-2xl shadow-lg">
      <VCardTitle class="text-xl font-bold text-gray-800">
        {{ isEdit ? 'Editar Cliente' : 'Cadastrar Cliente' }}
      </VCardTitle>
      <VCardText>
        <VForm ref="formRef">
          <div class="flex gap-4">
            <VTextField
              v-model="client.name"
              label="Nome"
              :rules="[required]"
              variant="solo"
              dense
              class="mb-2"
            />
            <VTextField
              v-model="client.phone"
              label="Sobrenome"
              :rules="[required]"
              variant="solo"
              dense
              class="mb-2"
            />
          </div>

          <VTextField
            v-model="client.email"
            label="E-mail"
            type="email"
            :rules="[required]"
            variant="solo"
            dense
            class="mb-2"
          />

          <div class="mt-4">
            <VTextField
              v-model="client.addresses[0].street"
              label="Rua"
              :rules="[required]"
              variant="solo"
              dense
              class="mb-2"
            />
            <VTextField
              v-model="client.addresses[0].complement"
              label="Complemento"
              variant="solo"
              dense
              class="mb-2"
            />
            <div class="flex gap-4">
              <VTextField
                v-model="client.addresses[0].number"
                label="Número"
                variant="solo"
                dense
                class="mb-2"
              />
              <VTextField
                v-model="client.addresses[0].city"
                label="Cidade"
                :rules="[required]"
                variant="solo"
                dense
                class="mb-2"
              />
            </div>
            <div class="flex gap-4">
              <VTextField
                v-model="client.addresses[0].state"
                label="Estado"
                :rules="[required]"
                variant="solo"
                dense
                class="mb-2"
              />
              <VTextField
                v-model="client.addresses[0].postalCode"
                label="CEP"
                :rules="[required]"
                variant="solo"
                dense
                class="mb-2"
              />
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <VBtn color="blue-darken-4" class="text-white font-medium py-2" @click="saveClient">
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
