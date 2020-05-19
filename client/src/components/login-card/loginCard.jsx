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
          <>
            {this.props.registerStatus ? (
              <>
                <div>
                  <input
                    type="text"
                    onChange={this.inputHandler}
                    value={this.state.username}
                    name="username"
                  ></input>
                </div>
                <div>
                  <input
                    type="password"
                    onChange={this.inputHandler}
                    value={this.state.password}
                    name="password"
                  ></input>
                  <div>
                    <input
                      type="text"
                      onChange={this.inputHandler}
                      value={this.state.email}
                      name="email"
                    ></input>
                  </div>
                </div>
                <div>
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
                <div>
                  <input
                    type="text"
                    onChange={this.inputHandler}
                    value={this.state.username}
                    name="username"
                  ></input>
                </div>
                <div>
                  <input
                    type="password"
                    onChange={this.inputHandler}
                    value={this.state.password}
                    name="password"
                  ></input>
                </div>
                <div>
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
                  {this.props.errorMsg ? (
                    <div>{this.props.errorMsg}</div>
                  ) : null}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    );
  }
}

export default LoginCard;
