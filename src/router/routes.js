const routes = [
  {
    path: '/:lang',
    name: 'root',
    component: () => import('layouts/MainLayout.vue'),
  },
  {
    path: '/:lang/admin',
    name: 'admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      {
        path: 'newsItems',
        name: 'adminNewsItems',
        component: () => import('pages/admin/NewsItemsPage.vue'),
      },
      {
        path: 'users',
        name: 'adminUsers',
        component: () => import('pages/admin/UsersPage.vue'),
      },
    ],
  },
  // {
  //   path: 'login',
  //   name: 'login',
  //   component: () => import('pages/LoginPage.vue'),
  // },
]

export default routes
