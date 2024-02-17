import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';

import { ConfigProvider } from 'antd';
import 'antd/dist/antd.less';
import zhCN from 'antd/es/locale/zh_CN';

import App from '@/views/App';

// Provide global config as global root component
const GlobalRoot: React.FC = () => (
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
);

ReactDOM.render(<GlobalRoot />, document.querySelector('#app'));
