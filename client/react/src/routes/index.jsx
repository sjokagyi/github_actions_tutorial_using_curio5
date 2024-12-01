// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import LandingRoutes from './LandingRoutes';
import MainRoutes from './MainRoutes';

const Router = () => (
  <Routes>
    {LandingRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children?.map((child, childIndex) => (
          <Route key={childIndex} path={child.path} element={child.element} />
        ))}
      </Route>
    ))}
    {MainRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children?.map((child, childIndex) => (
          <Route key={childIndex} path={child.path} element={child.element} />
        ))}
      </Route>
    ))}
  </Routes>
);

export default Router;
