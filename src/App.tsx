import { PureComponent } from 'react';
import { RouterProvider } from 'react-router-dom';
import { pageRouter } from './pages';

// eslint-disable-next-line
class App extends PureComponent {
    render() {
        return <RouterProvider router={pageRouter} />;
    }
}

export default App;
