//import { connect } from 'react-redux'
//-----------------------------------------------------------
// Actions
//-----------------------------------------------------------

const ADD_ADDRESS = 'ADD_ADDRESS';
const DEL_ADDRESS = 'DEL_ADDRESS';
const REFRESH_ADDRESS= 'REFRESH_ADDRESS';

let nextTodoId = 0;

function addAddress(text) {
    return {
        type: ADD_ADDRESS,
        id: nextTodoId++,
        text
    }
}

function refreshAddress(id) {
    return { type: REFRESH_ADDRESS, id }
}

//----------------------------------------------------------
//Reducers
//----------------------------------------------------------
var address = (state, action) => {
    switch (action.type) {
        case ADD_ADDRESS:
            return {
                id: action.id,
                text: action.text,
                info: {"coord":{"lon":-122.09,"lat":37.39},
                    "sys":{"type":3,"id":168940,"message":0.0297,"country":"US","sunrise":1427723751,"sunset":1427768967},
                    "weather":[{"id":800,"main":"Clear","description":"Sky is Clear","icon":"01n"}],
                    "base":"stations",
                    "main":{"temp":285.68,"humidity":74,"pressure":1016.8,"temp_min":284.82,"temp_max":286.48},
                    "wind":{"speed":0.96,"deg":285.001},
                    "clouds":{"all":0},
                    "dt":1427700245,
                    "id":0,
                    "name":"Mountain View",
                    "cod":200}
            };
        case REFRESH_ADDRESS:

            if (state.id === action.id) {
                return Object.assign({}, state, {
                    info: {"coord":{"lon":-122.09,"lat":37.39},
                        "sys":{"type":3,"id":168940,"message":0.0297,"country":"US","sunrise":1427723751,"sunset":1427768967},
                        "weather":[{"id":800,"main":"Clear","description":"Sky is Clear","icon":"01n"}],
                        "base":"stations",
                        "main":{"temp":285.68,"humidity":74,"pressure":1016.8,"temp_min":284.82,"temp_max":286.48},
                        "wind":{"speed":0.96,"deg":285.001},
                        "clouds":{"all":0},
                        "dt":1427700245,
                        "id":0,
                        "name":"Mountain View",
                        "cod":200}
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
        case 'REFRESH_ADDRESS':
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
let store = Redux.createStore(addresses);


//---------------------------------------------------------------------
//Components
//----------------------------------------------------------------------

const Map = ({info}) => (
    <div className="map">
        {info.coord.lon}<br/>
        {info.coord.lat}
    </div>
);



const Weather = ({info}) => (
    <div className="weather">
        <span>{info.main.temp}</span><br/>
        <span>{info.wind.speed}</span><br/>
        <span>{info.weather.main}</span>
    </div>
);



const LocationBlock  = ({address, onRefresh}) => (
    <li>
        <div className="locationBlock">
            <Map info={address.info}/>
            <Weather info={address.info}/>
            <i className="fa fa-refresh" onClich={onRefresh}>Refresh</i>
            <i className="fa fa-trash-o">Delete</i>
        </div>
    </li>
);



const List = ({ addresses, onRefreshClick }) => (
    <ul className="list">
        {addresses.map(address =>
            <LocationBlock
                key={address.id}
                {...address}
                onRefresh={() => onRefreshClick(address.id)}
            />
        )}
    </ul>
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
        onRefreshClick: (id) => {
            dispatch(refreshAddress(id))
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
        <div>
            <form onSubmit={e => {
        e.preventDefault();
        if (!input.value.trim()) {
          return
        }
        dispatch(addAddress(input.value));
        input.value = '';
      }}>
                <input ref={node => {
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