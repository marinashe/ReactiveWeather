var Map = React.createClass ({
   render: function () {
       return (
           <div class="map">
               Map
           </div>
       )
   }
});

var Weather = React.createClass ({
   render: function () {
       return (
           <div class="weather">
               <span>Temp</span>
               <span>Temp</span>
               <span>Temp</span>
           </div>
       )
   }

});

var LocationBlock = React.createClass ({
    render: function () {
        return (
            <div class="locationBlock">
                <Map />
                <Weather />
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
            </div>
        )
    }

});


var List = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    
    render: function () {
        let rows = [];
        this.state.data.forEach( function (block) {
            rows.push(<LocationBlock key={block.address} />);
        });

        return (

            <ul class="list">
                {rows}
            </ul>
        )
    }

});


var AddressForm = React.createClass({
   render: function () {
       return (
           <form  class="addressForm">
               <input type="text" placeholder="Address"> </input>
               <button>+</button>
           </form>

       )
   }
    
});


var Page = React.createClass({

    render: function() {
       
        return (
            <div className="page">
                <AddressForm />
                <List />
            </div>
        );

    }
});

ReactDOM.render(
    <Page />,
    document.getElementById('content')
);