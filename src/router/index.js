import { createRouter, createWebHistory } from 'vue-router'
import clientDetails from '@/pages/clients/client-details.vue'
import Clients from '@/pages/clients/clients.vue'
import profesionals from '@/pages/professionals/profesionals.vue'
import professionalDetails from '@/pages/professionals/professional-details.vue'
import consultations from '@/pages/consultations/consultations.vue'
import consultationDetails from '@/pages/consultations/consultation-details.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/clients/:id/details',
      component: clientDetails
    },
    {
      path: '/clients/create',
      component: clientDetails
    },
    {
      path: '/clients',
      component: Clients
    },
    {
      path: '/professionals/:id/details',
      component: professionalDetails
    },
    {
      path: '/professionals/create',
      component: professionalDetails
    },
    {
      path: '/professionals',
      component: profesionals
    },
    {
      path: '/consultations/:id/details',
      component: consultationDetails
    },
    {
      path: '/consultations/create',
      component: consultationDetails
    },
    {
      path: '/consultations',
      component: consultations
    },
  ],
})

export default router
