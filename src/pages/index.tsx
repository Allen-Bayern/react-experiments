import { createHashRouter } from 'react-router-dom';
import HomePage from './HomePage';

/** 页面路由配置 */
export const pageRouter = createHashRouter([
    {
        path: '/',
        element: <HomePage />,
    },
]);
