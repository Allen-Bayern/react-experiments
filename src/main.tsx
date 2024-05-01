import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import '@/assets/styles/_global.scss';
import App from '@/views/App';

// Provide global config as global root component
const GlobalRoot: React.FC = () => (
    <ConfigProvider locale={zhCN}>
        <App />
    </ConfigProvider>
);

ReactDOM.render(<GlobalRoot />, document.querySelector('#app'));
