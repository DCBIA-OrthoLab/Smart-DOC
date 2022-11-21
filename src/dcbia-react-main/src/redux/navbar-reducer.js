
const initialState = {
  uri: '/',
  queryParams: '',
  http: '',
  showCreateUser: false
};

const navbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'user-login':{
      return {
        ...state,
        showLogin: action.showLogin
      }
    }
  case 'user-create':{
      return {
        ...state,
        showCreateUser: action.showCreateUser
      }
    }
    default: {
      return state;
    }
  }
};

export default navbarReducer;