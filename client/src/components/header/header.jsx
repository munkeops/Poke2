import React from "react";
import { connect } from "react-redux";
import LoginCard from "../login-card/loginCard";
import "./header.styles.scss";
import { GiPokecog } from "react-icons/gi";
import { register, logout, login } from "../../actions/authActions";
import { clearErrors } from "../../actions/errorActions";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLogin: false,
      isLoggedin: false,
      msg: null,
      toggleRegister: false,
      showPopover: false,
    };
  }

  loginHandler = (credentials) => {
    const username = credentials.username;
    const password = credentials.password;
    const email = credentials.email;

    const newUser = {
      username,
      email,
      password,
    };
    if (email) {
      //Attempt to register
      this.props.register(newUser);
    } else {
      this.props.login(newUser);
    }
  };
  toggleLogin = () => {
    this.props.clearErrors();
    this.setState({ toggleLogin: !this.state.toggleLogin });
  };
  toggleRegister = () => {
    this.props.clearErrors();
    this.setState({ toggleRegister: !this.state.toggleRegister });
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      if (error.id === "REGISTER_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    if (this.state.toggleRegister) {
      if (isAuthenticated) {
        this.toggleRegister();
      }
    }

    if (isAuthenticated && this.state.toggleLogin) {
      this.setState({ toggleLogin: false });
    }
  }

  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.setState({ toggleLogin: false, toggleRegister: false });
    }
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "1rem",
          marginBottom: "2rem",
          position: "relative",
        }}
      >
        <div className="header">
          <div className="brand">
            <GiPokecog />
            <span style={{ color: "white" }}>
              Poke<span style={{ color: "#ff5252" }}>Two</span>
            </span>
          </div>
          <div className="right-half">
            <div>Profile</div>
            {this.props.isAuthenticated ? (
              <>
                <div>{this.props.user.username}</div>
                <div onClick={this.props.logout}>Logout</div>
              </>
            ) : (
              <div
                onClick={() =>
                  this.setState({ toggleLogin: !this.state.toggleLogin })
                }
              >
                Login
              </div>
            )}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {this.state.isLoggedin ? (
            <div></div>
          ) : (
            <LoginCard
              registerStatus={this.state.toggleRegister}
              toggleRegister={this.toggleRegister}
              submitLogin={this.loginHandler}
              toggleLogin={this.toggleLogin}
              loginStatus={this.state.toggleLogin}
              loginHandler={this.loginHandler}
              errorMsg={this.state.msg}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  user: state.auth.user,
});
export default connect(mapStateToProps, {
  register,
  clearErrors,
  logout,
  login,
})(Header);
