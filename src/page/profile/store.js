import { createStore, applyMiddleware, combineReducers } from 'redux';
import authReducer from './authReducer';  // Assurez-vous que vous importez correctement votre reducer

const rootReducer = combineReducers({
  auth: authReducer,
  // Ajoutez d'autres reducers ici
});

const store = createStore(
  rootReducer,
  applyMiddleware()  // Vous pouvez ajouter d'autres middlewares si nécessaire
);

export default store;
