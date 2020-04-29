import React from 'react';
import ClickNHold from 'react-click-n-hold'; 

export default class Example extends React.Component {
	start(e){
		console.log('START'); 
	} 
    
	end(e, enough){
		console.log('END');
        console.log(enough ? 'Click released after enough time': 'Click released too soon');            
	} 
    
	clickNHold(e){
		console.log('CLICK AND HOLD');  
	} 

	render(){
		return ( 
			<ClickNHold 
				time={2} // Time to keep pressing. Default is 2
				onStart={this.start} // Start callback
				onClickNHold={this.clickNHold} //Timeout callback
				onEnd={this.end} > // Click release callback
					<button>Click and hold</button>
			</ClickNHold>
		); 
	}
}