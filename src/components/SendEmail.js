import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";

class SendEmail extends Component {
  state = {
    productOne: "",
    categoryOne: "",
    productTwo: "",
    categoryTwo: "",
    productThree: "",
    categoryThree: "",
    mail: { name: "", email: "" },
    sentEmail: false
  };

  updateMail = e => {
    const mail = { ...this.state.mail };
    mail[e.target.name] = e.target.value;
    this.setState({ mail });
  };

  sendEmail = e => {
    e.preventDefault();
    const name = this.state.mail.name;
    const email = this.state.mail.email;
    const url = `https://makeupagift.filipstepien.com/your-gift/${
      this.props.products.product1.id
    }/${this.props.products.product2.id}/${this.props.products.product3.id}`;
    console.log("sending your email, wait for staus message...");
    axios
      .post(`https://us-central1-make-up-a-gift.cloudfunctions.net/httpEmail`, {
        toName: name,
        toEmail: email,
        url: url
      })
      .then(res => {
        console.log(res);
      })
      .then(() => {
        let mail = { ...this.state.mail };
        mail = { name: "", email: "" };
        this.setState({ mail }, this.emailSent());
      })
      .catch(err => console.log(err));
  };

  emailSent = () => {
    this.setState({ sentEmail: true });
    setTimeout(() => this.props.toggle(), 1600);
  };

  render() {
    return (
      <div className="send-email">
        <h2>Send Gift Information by Email</h2>
        {this.state.sentEmail && (
          <SentMessage>Your Email Was Sent!</SentMessage>
        )}
        <Form className="send-email-form" onSubmit={this.sendEmail}>
          <Input
            name="name"
            value={this.state.mail.name}
            onChange={e => this.updateMail(e)}
            type="text"
            placeholder="Name"
            required
          />
          <Input
            name="email"
            value={this.state.mail.email}
            onChange={e => this.updateMail(e)}
            type="text"
            placeholder="Email"
            required
          />
          <Input type="submit" />
        </Form>
      </div>
    );
  }
}

export default SendEmail;

const Form = styled.form`
  text-align: center;
`;

const Input = styled.input`
  width: 90%;
  color: #333;
  background: #ffecda;
  border: solid 1px #ff86a0;
  border-radius: 2px;
  margin: 15px auto;
  font-size: 20px;
  padding: 0.3rem 1rem;
  &::placeholder {
    color: #ff86a0;
    font-style: italic;
  }
  &[type="submit"] {
    text-align: center;
    font-weight: bold;
    color: #ff86a0;
    background: #ffecda;
  }
  &[type="submit"]:hover {
    background: #ff86a0;
    color: #ffecda;
  }
`;

const SentMessage = styled.p`
  color: green;
`;
