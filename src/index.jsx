import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Moment from 'moment';
import { Elements, StripeProvider } from 'react-stripe-elements';
import CheckoutForm from './checkout';
import PropTypes from 'prop-types';

class App extends Component {
    state = {
        event: null,
    };

    componentDidMount() {
        axios.get(`/getEventData`)
        .then(data => {
            const eventData = data.data;
            this.setState({ event: eventData });
        })
        .catch(err => console.log(err));
    }

    render() {
        const { event } = this.state;
        return (
            <div className="container">
                <Banner event={event} />
                <Form event={event} />
                <Flyer />
                <Footer />
            </div>
        )

    }
}

function Banner({ event }) {
    if (event !== null) {
        return (
            <div className="banner">
                <div className="bannerName">{event.name}</div>
                <div className="bannerDate">{Moment(event.startdate).format('dddd MM-DD-YYYY')}</div>
                <div className="bannerTime">{Moment(event.startdate).format('hh:mm a')} - {Moment(event.enddate).format('h:mm a')}</div>
                <div className="bannerAddress">{event.address}</div>
                <div className="bannerCost"><span>Cost Per Child:</span><span className="price">$</span><span className="price">{event.totalcost}</span></div>
            </div>
        );
    }
    return <div>Loading...</div>
}

function Flyer() {
    return <a href="/"><div className="flyer"></div></a>
}

const loaderStyle = {
    color: '#f37ba9',
};

export default function Loader() {
   return  <div className="fa-3x" style={loaderStyle}><i className="fas fa-spinner fa-spin"></i></div>
}

Loader.propTypes = {
    isLoading: PropTypes.bool.isRequired,
};

function Footer() {
    return (
        <div className="footerWrapper">
        Powered By TechDeus
        </div>
    )
}

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            children: [{ name: '', age: '', error: '' }],
            cost: 15,
            totalCost: null,
        }
        
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
        this.addClick = this.addClick.bind(this);
        this.calculateTotalCost = this.calculateTotalCost.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }
    

    createUI = () => {
        const { children } = this.state;
        
        return children.map((el, i) => (
            <div className="formContainer" key={i}>
                <label htmlFor="name">Child's Name</label>
                <input id="name" name="name" type="text" placeholder="Enter name here..." value={el.name} onChange={this.handleChange.bind(this,i)} required />
                <label htmlFor="age">Child's Age</label>
                <input id="age" name="age" type="text" placeholder="Enter age here..." value={el.age} onChange={this.handleChange.bind(this,i)} required />
                { 
                    el.error.length > 0 ? <div className="errorMessage">{el.error}</div> : <div className="empty" />
                }
                <button className="removeChild" onClick={this.removeClick.bind(this,i)}><i class="fas fa-trash fa-2x"></i></button>
            </div>
        ));
    }
    
    nextStep = () => {
        const { step } = this.state;
        if (this.validateForm()) {
            this.setState({
                step: step + 1,
            });
            this.calculateTotalCost();
        } else {
            return false;
        }
    }

    calculateTotalCost = () => {
        const {cost, totalCost, children } = this.state;
        this.setState({
            totalCost: cost * children.length,
        });
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1,
        });
    }

    addClick() {
        this.setState(prevState => ({
            children: [...prevState.children, { name: '', age: '', error: '' }]
        }));
    }

    removeClick(i) {
        let children = [...this.state.children];
        children.splice(i, 1);
        this.setState({ children });
    }

    handleChange(i, e) {
        const { name, value } = e.target;
        let children = [...this.state.children];
        children[i] = {...children[i], [name]: value};
        this.setState({ children });
    }

    validateForm() {
        const { children } = this.state;
        let isValid = true;
        children.forEach((el, i) => {
            if (el.name.length <= 2) {
                let currChildren = [...this.state.children];
                currChildren[i] = {...currChildren[i], error: 'Error: Enter your child\'s name'};
                isValid = false;
                this.setState({ children: currChildren });
                return isValid;
            } else if (el.age === '' || typeof parseInt(el.age) !== 'number') {
                let currChildren = [...this.state.children];
                currChildren[i] = {...currChildren[i], error: 'Error: Enter your child\'s Age (Using 0-9)'};
                isValid = false;
                this.setState({ children: currChildren });
                return isValid;
            }
        });

        return isValid;
    }
    render() {
        const { step, children, cost, totalCost } = this.state;
        const { event } = this.props;
        switch(step) {
            case 1:
                return <Confirmation 
                        nextStep={this.nextStep}
                        prevStep={this.prevStep}
                        values={children}
                        event={event}
                    />
            case 2: 
                return <StripeProvider apiKey="pk_test_Kor4FI1PUw3cD2oBm3zPX9AQ00tD5dewJv">
                    <Elements>
                        <CheckoutForm 
                            totalCost={totalCost}
                            values={children}
                            event={event}
                            nextStep={this.nextStep}
                            prevStep={this.prevStep}
                        />
                    </Elements>
                </StripeProvider>
        }

        return (
            <div className="formWrapper">
                <h2>how many children are attending?</h2>
                <form className="formWrap">
                    {this.createUI()}
                   <button className="addChild" onClick={this.addClick}><i class="fa fa-plus fa-2x" aria-hidden="true"></i>Add Child</button>
                </form>
                <div className="formDetails">
                    <div className="childrenCount"># of Children: <span className="underline">{children.length}</span></div>
                    <div className="childrenCost">Total Cost: <span className="underline">${children.length * cost}</span></div>
                </div>
                <button className="nextStep" onClick={this.nextStep}><i class="fa fa-chevron-circle-right fa-5x" aria-hidden="true"></i></button>
            </div>
        );
    }
}

function Confirmation({ prevStep, nextStep, values }) {
    return (
        <div className="confWrapper">
            <h2>Is the Information Correct?</h2>
            <div className="confContainer">
            {
                values.map((el, i) => (
                <div className="childContainer" key={i}>
                    <div className="confTitle">Child #{i + 1}</div>
                    <div className="confName">{el.name}</div>
                    <div className="confAge">{el.age}</div>
                </div>
                ))
            }
            </div>
            <div className="steps">
                <button className="prevStep" onClick={prevStep}><i class="fa fa-chevron-circle-left fa-5x" aria-hidden="true"></i></button>
                <button className="nextStep" onClick={nextStep}><i class="fa fa-chevron-circle-right fa-5x" aria-hidden="true"></i></button>
            </div>
        </div>
    );
}

const root = document.querySelector('#root');
ReactDOM.render(<App />, root);