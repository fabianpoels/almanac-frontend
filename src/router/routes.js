const routes = [
  {
    path: '/',
    name: 'root',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'map' },
    children: [
      {
        path: '',
        name: 'map',
        component: () => import('pages/MapPage.vue'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: '/newsItems',
        name: 'adminNewsItems',
        component: () => import('pages/admin/NewsItemsPage.vue'),
      },
      {
        path: '/users',
        name: 'adminUsers',
        component: () => import('pages/admin/UsersPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },

  // handle unexisting pages
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
