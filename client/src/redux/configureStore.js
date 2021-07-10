import { createStore } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';

import shareMovies from './reducers/shareMovies';

export default createStore(shareMovies, composeWithDevTools());
