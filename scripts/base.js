
//-----------------------------------------------------------
// Actions
//-----------------------------------------------------------

const ADD_ADDRESS = 'ADD_ADDRESS';
const DEL_ADDRESS = 'DEL_ADDRESS';
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


function requestInfo(id) {
    return {
        type: REQUEST_INFO,
        id
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
        dispatch(requestInfo(id));
        return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${text}&APPID=229b9d73ab68039d1c5ccaa04cf27e6e&units=metric`)
            .then(response => response.json())
            .then(json => dispatch(receiveInfo(id, json)))
    }
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
                info: {}
            };

        case RECEIVE_INFO:
            if (state.id === action.id) {
                return Object.assign({}, state, {
                    info: action.info,
                    loading: false
                })
            }
            return state;

        case REQUEST_INFO:
            if (state.id === action.id) {
                return Object.assign({}, state, {
                    loading: true
                })
            }
            return state;

        default:
            return state
    }
};


const addresses = (state = [], action) => {
    switch (action.type) {
        case ADD_ADDRESS:
            return [
                address(undefined, action),
                ...state
            ];

        case DEL_ADDRESS:
            return state.filter((s) =>(s.id !== action.id));

        case RECEIVE_INFO:
        case REQUEST_INFO:
            return state.map(s =>
                address(s, action)
            );

        default:
            return state
    }
};

let store = Redux.createStore(addresses, Redux.applyMiddleware(ReduxThunk.default));


//---------------------------------------------------------------------
//Components
//----------------------------------------------------------------------

const Location = ({text, info}) => {
    if (info.main) {
        return (
            <div className="location">
                <span><b>{info.name}, {info.sys.country}</b></span><br/>
                <img src={"http://openweathermap.org/img/w/" + info.weather[0].icon + ".png"}/>

            </div>
        )
    } else {
        if (info.cod === '404') {
            return (
                <div className="location">
                    <span><b>{text}</b></span>
                </div>
            )

        } else {
            return (
                <div className="location">
                    <span><b>{text}</b></span>
                </div>
            )

        }
    }
};


const Weather = ({info}) => {
    if (info.main) {
        return (
            <div className="weather">
                <span><b>{info.weather[0].description}</b></span><br/>
                <span><b>Temperature:</b> {info.main.temp} °C</span><br/>
                <span><b>Humidity:</b> {info.main.humidity} %</span><br/>
                <span><b>Pressure:</b> {info.main.pressure} hPa</span><br/>
                <span><b>Wind:</b> {info.wind.speed} m/s</span><br/>
            </div>
        )
    } else {
        if (info.cod === '404') {
            return(
                <div className="weather">
                    <span>City not found.</span>
                </div>
            )

        } else {
            return (
                <div className="weather">
                    <span>Loading...</span>
                </div>
            )
        }
    }
};


const LocationBlock = ({info, text, loading, onRefresh, onDelete}) => (

    <div className="locationBlock col-xs-12 col-md-6">
        <ReactBootstrap.Panel>

            <Location text={text} info={info}/>
            <Weather info={info}/>

            <a href="#" onClick={e => {
                 e.preventDefault();
                 onDelete()
               }}><i className="fa fa-trash-o fa-2x"/></a>
            <a href="#" onClick={e => {
                 e.preventDefault();
                 onRefresh()
               }}><i className={"fa fa-refresh fa-2x" + (loading ? " fa-spin" : "")}/></a>
        </ReactBootstrap.Panel>
    </div>
);


const List = ({ addresses, onRefreshClick, onDeleteClick }) => (
    <div className="list row">
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
        <div className="row">
            <div className="col-md-offset-3 col-md-6 col-xs-12">
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
                    <div className="input-group">
                        <input className="address form-control" type="text" placeholder="Enter city" ref={node => {
                            input = node
                        }}/>
                        <span className="input-group-btn">
                            <button className="btn btn-primary" type="submit">Add</button>
                        </span>
                    </div>
                </form>
            </div>
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