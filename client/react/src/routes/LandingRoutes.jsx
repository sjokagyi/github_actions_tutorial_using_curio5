// src/routes/LandingRoutes.jsx
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import LandingPage from 'pages/landingpage/LandingPage';

const Login = Loadable(lazy(() => import('pages/authentication/login')));
const Register = Loadable(lazy(() => import('pages/authentication/register')));
const CreateSchool = Loadable(lazy(() => import('pages/landingpage/CreateSchool')));

const LandingRoutes = [
  {
    path: '/',
    element: <MinimalLayout />,
    children: [
      { path: '', element: <LandingPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'create-school', element: <CreateSchool /> }
    ]
  }
];

export default LandingRoutes;
