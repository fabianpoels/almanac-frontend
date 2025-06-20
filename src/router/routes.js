const routes = [
  {
    path: '/:lang',
    name: 'root',
    component: () => import('layouts/MainLayout.vue'),
  },
  {
    path: '/:lang/login',
    name: 'login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/:lang/about',
    name: 'about',
    component: () => import('pages/AboutPage.vue'),
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
        path: 'riskLevels',
        name: 'adminRiskLevels',
        component: () => import('pages/admin/RiskLevelsPage.vue'),
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
