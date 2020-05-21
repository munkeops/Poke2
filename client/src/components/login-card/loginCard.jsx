import React from "react";

class LoginCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
    };
  }
  inputHandler = (e) => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <div className="login-box">
        {this.props.loginStatus ? (
          <div style={{ marginTop: "1rem" }}>
            {this.props.registerStatus ? (
              <>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "80px" }}>Username: </div>
                  <input
                    type="text"
                    onChange={this.inputHandler}
                    value={this.state.username}
                    name="username"
                  ></input>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "80px" }}>Password: </div>
                  <input
                    type="password"
                    onChange={this.inputHandler}
                    value={this.state.password}
                    name="password"
                  ></input>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "80px" }}>E-mail: </div>
                  <input
                    type="text"
                    onChange={this.inputHandler}
                    value={this.state.email}
                    name="email"
                  ></input>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                  }}
                >
                  <button
                    onClick={() =>
                      this.props.loginHandler({
                        username: this.state.username,
                        password: this.state.password,
                        email: this.state.email,
                      })
                    }
                  >
                    Register
                  </button>
                  <button onClick={() => this.props.toggleRegister()}>
                    Login
                  </button>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "80px" }}>Username: </div>
                  <input
                    type="text"
                    onChange={this.inputHandler}
                    value={this.state.username}
                    name="username"
                  ></input>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ width: "80px" }}>Password: </div>
                  <input
                    type="password"
                    onChange={this.inputHandler}
                    value={this.state.password}
                    name="password"
                  ></input>
                </div>
                {this.props.errorMsg ? (
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "0.85rem",
                      marginTop: "0",
                      marginRight: "1.75rem",
                      color: "#b71c1c",
                    }}
                  >
                    {this.props.errorMsg}!
                  </div>
                ) : null}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                  }}
                >
                  <button
                    onClick={() =>
                      this.props.loginHandler({
                        username: this.state.username,
                        password: this.state.password,
                      })
                    }
                  >
                    Login
                  </button>
                  <button onClick={() => this.props.toggleRegister()}>
                    Register
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default LoginCard;
