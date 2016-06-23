const ADD_ADDRESS = 'ADD_ADDRESS';
const DEL_ADDRESS = 'DEL_ADDRESS';
const REFRESH_ADDRESS= 'REFRESH_ADDRESS';

function addAddress(text) {
  return {
    type: ADD_ADDRESS,
    text
  }
}

function refreshAddress(index) {
  return { type: REFRESH_ADDRESS, index }
}

function address (state = [], action) {
    switch (action.type) {
        case ADD_ADDRESS:
            return [
                ...state,
                {
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
                }
            ];
        case REFRESH_ADDRESS:
            return state.map((state, index) => {
                if (index === action.index) {
                    return Object.assign({}, address, {
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
                return address
            });
        default:
            return state
    }
}

const addressApp = {address};















const Map = ({address}) => (
    <div className="map">
        {address}
    </div>
);



const Weather = ({address}) => (
    <div className="weather">
        <span>Temp</span><br/>
        <span>Temp</span><br/>
        <span>Temp</span>
    </div>
);



const LocationBlock  = ({address}) => (
    <div className="locationBlock">
                <Map address={address}/>
                <Weather address={address}/>
                <i className="fa fa-refresh">Refresh</i>
                <i className="fa fa-trash-o">Delete</i>
            </div>
);


const List  = ({address}) => (
    <ul className="list">
        <LocationBlock address={address} />

    </ul>

);



const AddressForm  = ({onClick}) => (
     <form  className="addressForm">
         <input type="text" placeholder="Address"></input>
         <button type="submit">+</button>
     </form>
    // <form className="addressForm">
    //     <FormGroup controlId="formControlsText">
    //         <ControlLabel>Text</ControlLabel>
    //         <FormControl type="text" placeholder="Enter address" />
    //     </FormGroup>
    //     <Button type="submit">
    //         Submit
    //     </Button>
    // </form>
);

var foo = function (){
    console.log('foo');
};


const Page  = ({data}) => (
    <div className="page">
        <AddressForm onClick={foo}/>
        <List address='Tel-aviv'/>
    </div>

);


ReactDOM.render(
    <Page />,
    document.getElementById('content')
);