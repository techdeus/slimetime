import React, { Component } from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Axios from 'axios';
import Loader from './index';

class CheckoutFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            phone: '',
            isLoading: false,
            complete: false,
            stripeErrorMessage: '',
            formError: '',
            formValid: false,
        };

        this.submit = this.submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCCChange = this.handleCCChange.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleCCChange({error}) {
        if (error) {
            this.setState({ stripeErrorMessage: error.message });
        }
    } 
    
    async submit(ev) {
        const { totalCost, event, values } = this.props;
        const { name, email, phone } = this.state;
        // User clicked Submit

        const data = {
            "name": name,
            "email": email,
            "phonenumber": phone,
            "event": event,
            "values": values,
        };
        
        try {
                let { token, error } = await this.props.stripe.createToken({ name: "Name" });
                if (error === undefined) {
                    let isSubmitted = await this.setState({ isLoading: true });
                    Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                    let response = await Axios({
                        method: 'post',
                        url: '/charge',
                        headers: {"Content-Type": "text/plain"},
                        data: {
                            totalCost: totalCost,
                            token: token.id,
                            data: data,
                        },
                    });

                    if (response.status === 200) {
                        this.setState({
                            isLoading: false,
                            complete: true,
                        });
                    }
                }
        } catch (err) {
            console.log(err);
        }
            // let response = await fetch("/charge", {
            //     method: "POST",
            //     headers: {"Content-Type": "text/plain"},
            //     body: token.id
            //   });
            // response status prop = 200 || 500
            // response.ok === true
    }

    validateForm() {
        const { name, email, phone } = this.state;
        if (name.length <= 2) {
            this.setState({
                formError: 'Enter a Valid Name',
                formValid: false,
            });
            return;
        } else if (email.length <= 2 || email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            this.setState({
                formError: 'Enter a Valid Email Address',
                formValid: false,
            });
            return;
        } else if (phone.length < 10 && phone.length > 12 || phone.indexOf('-') < 0 || phone.indexOf('-') < 0 ) {
            this.setState({
                formError: 'Enter a Valid Phone Number i.e. 415-222-1100',
                formValid: false,
            });
            return;
        } else {
            this.setState({
                formError: '',
                formValid: true,
            });
        }
    }

    render() {
        const { name, phone, email, complete, stripeErrorMessage, formError, isLoading, formValid } = this.state;
        const { prevStep, totalCost } = this.props;
        
        if (complete) return (
            <div className="confirmationComplete">
                <h1>You are Confirmed for the Slime Class!</h1>
                <h3>Check your email at {' '}<span className="highlight">{email}</span> and text messages at phone number {' '}<span className="highlight">{phone}</span> for confirmation and further updates!</h3>
            </div>
        )

        return (
            <div>
            { 
                isLoading ?
                    <div className="confirmationComplete">
                        <Loader />
                    </div> 
                : 
                <div className="checkout">
                <div>
                <h2>Parent Information</h2>
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" 
                        minlength="3" maxLength="15" size="17"
                        placeholder="Enter name here..." 
                        value={name} onChange={this.handleChange} required />
                    <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" 
                        pattern=".+@" size="30"
                        placeholder="Enter email here..." 
                        value={email} onChange={this.handleChange} required />
                    <label htmlFor="phone">Phone Number</label>
                        <input id="phone" name="phone" type="tel" 
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            maxLength="12"
                            placeholder="Enter phone number here... 123-456-7890" 
                            value={phone} onChange={this.handleChange} required />
                {
                    formError.length > 0 ? <div className="errorMessage">{formError}</div> : <div className="empty" />
                }
                
                
                </div>
                {
                    !formValid ? <button className="payNowButton" onClick={this.validateForm}>Pay Now</button> :
                        <div className="purchaseContainer">
                            <h2>Complete Purchase</h2>
                            <div className="ccContainer">
                                <label htmlFor="card-element">Credit or Debit Card</label>
                                <div id="card-element">
                                    <CardElement onChange={this.handleCCChange}/>
                                </div>

                                <div id="card-errors" role="alert">{stripeErrorMessage}</div>
                                <div className="bottomFlex">
                                    <button className="prevStep" onClick={prevStep}><i class="fa fa-chevron-circle-left fa-3x" aria-hidden="true"></i></button>
                                    <button className="purchaseButton" onClick={this.submit}>Submit Payment</button>
                                    <div className="finalCost">Total Cost: ${totalCost}.00</div>
                                </div>
                            </div>
                        </div>
                }
            </div> 
            }
            </div>
        );
    }
}

export default injectStripe(CheckoutFrom);