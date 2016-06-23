

//-----------------------------------------------------------
// Actions
//-----------------------------------------------------------

const ADD_ADDRESS = 'ADD_ADDRESS';
const DEL_ADDRESS = 'DEL_ADDRESS';
const REFRESH_ADDRESS= 'REFRESH_ADDRESS';
const REQUEST_INFO = 'REQUEST_INFO';
const RECEIVE_INFO = 'RECEIVE_INFO';



let nextId = 0;

function addAddress(text) {
    return {
        type: ADD_ADDRESS,
        id: nextId++,
        text
    }
}

function delAddress(id) {
    return { type: DEL_ADDRESS, id }
}



function requestInfo(text) {
  return {
    type: REQUEST_INFO,
    text
  }
}

function receiveInfo(id, json) {
  return {
    type: RECEIVE_INFO,
    id,
    info: json
  }
}

function fetchInfo(text, id) {
  return dispatch => {
    dispatch(requestInfo(text));
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&APPID=229b9d73ab68039d1c5ccaa04cf27e6e`)
      .then(response => response.json())
      .then(json => dispatch(receiveInfo(id, json)))
  }
}


//----------------------------------------------------------
//Reducers
//----------------------------------------------------------
var address = (state, action) => {
    switch (action.type) {
        case 'ADD_ADDRESS':
            var json = {"coord":{"lon":-122.09,"lat":37.39},
                        "sys":{"type":3,"id":168940,"message":0.0297,"country":"US","sunrise":1427723751,"sunset":1427768967},
                        "weather":[{"id":800,"main":"Clear","description":"Sky is Clear","icon":"01n"}],
                        "base":"stations",
                        "main":{"temp":285.68,"humidity":74,"pressure":1016.8,"temp_min":284.82,"temp_max":286.48},
                        "wind":{"speed":0.96,"deg":285.001},
                        "clouds":{"all":0},
                        "dt":1427700245,
                        "id":0,
                        "name":"Mountain View",
                        "cod":200};
            return {
                id: action.id,
                text: action.text,
                info: {}
            };
        
        case 'RECEIVE_INFO':
             if (state.id === action.id) {
                return Object.assign({}, state, {
                    info: action.info
                })
            }
            return state;

        default:
            return state
    }
};


const addresses = (state = [], action) => {
    switch (action.type) {
        case 'ADD_ADDRESS':
            return [
                ...state,
                address(undefined, action)
            ];
        case 'DEL_ADDRESS':
            return state.filter((s) =>(s.id !== action.id));
        case 'RECEIVE_INFO':
            return state.map(s =>
                address(s, action)
            );

        default:
            return state
    }
};

// const addressApp = (state = {}, action) => {
//     addresses: addresses(state.addresses, action)
// };
let store = Redux.createStore(addresses, Redux.applyMiddleware(ReduxThunk.default));


//---------------------------------------------------------------------
//Components
//----------------------------------------------------------------------

const Map = ({text}) => (

    <div className="map container">
        <span>{text}</span>

    </div>
);



const Weather = ({info}) => {
    if (info.main) {
        return (
            <div className="weather container">
                <span>Temp: {info.main.temp}</span><br/>
                <span>Wind: {info.wind.speed}</span><br/>
                <span>Main: {info.weather[0].main}</span>
            </div>
        )
    } else {
        return (
            <div className="weather container">
                <span>Loading...</span>
            </div>
        )
    }
};



const LocationBlock  = ({info, text, onRefresh, onDelete}) => (

        <div className="locationBlock container col-xs-12 col-md-6">
            <Map text={text}/>
            <Weather info={info}/>
            <a href="#" onClick={e => {
                 e.preventDefault();
                 console.log('ref');
                 onRefresh()
               }}><i className="fa fa-refresh fa-2x"></i></a>
            <a href="#" onClick={e => {
                 e.preventDefault();
                 console.log('del');
                 onDelete()
               }}><i className="fa fa-trash-o fa-2x"></i></a>
        </div>

);



const List = ({ addresses, onRefreshClick, onDeleteClick }) => (
    <div className="list">
        {addresses.map(address =>
            <LocationBlock
                key={address.id}
                {...address}
                onRefresh={() => onRefreshClick(address.text, address.id)}
                onDelete={() => onDeleteClick(address.id)}
            />
        )}
    </div>
);



//-----------------------------------------------------------------------
//Containers
//-----------------------------------------------------------------------

const mapStateToProps = (state) => {
    return {
        addresses: state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onRefreshClick: (text, id) => {
            dispatch(fetchInfo(text, id))
        },
        onDeleteClick: (id) => {
            dispatch(delAddress(id))
        }
    }
};

const VisibleList = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
)(List);


let AddAddress = ({ dispatch }) => {
    let input;

    return (
        <div className="container">
            <form onSubmit={e => {
                e.preventDefault();
                if (!input.value.trim()) {
                  return
                }
                var add_action = addAddress(input.value);
                dispatch(add_action);
                dispatch(fetchInfo(input.value, add_action.id));


                input.value = '';
              }}>
                <input placeholder='City' ref={node => {
                  input = node
                }} />
                <button type="submit">
                    Add
                </button>
            </form>
        </div>
    )
};
AddAddress = ReactRedux.connect()(AddAddress);

const Page  = () => (
    <div className="page">
        <AddAddress />
        <VisibleList />
    </div>

);


ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <Page />
    </ReactRedux.Provider>,
    document.getElementById('content')
);