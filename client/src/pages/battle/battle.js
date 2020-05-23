import React from "react";

import "./battle.styles.scss";
import { Layout } from "../layout";
import BattleBox from "../../components/battle-box/battleBox.jsx";
import Logs from "../../components/logs/logs";
import { withRouter } from "react-router-dom";


class Battle extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loginCheck:true
    };
    
  }
  // const history = useHistory();
    check(){
      if(this.props.room==undefined || this.props.enemy==undefined ){
        this.props.history.push("/home");
        return false
      }
      else{
        this.setState({
          loginCheck:true
        })
      }
    }
  
    componentDidMount() {
      window.addEventListener("beforeunload", function (event) {
           console.log("adding are your sure you want to leave check")
           event.returnValue = "Hellooww"
       })
  
      //  if( this.props.enemy==undefined ){
      //   this.props.history.push("/home");
      //   this.setState({
      //     loginCheck:false
      //   })
      // }
      // else{
      //   this.setState({
      //     loginCheck:true
      //   })
      // }
   }

 componentWillUnmount() {
     window.removeEventListener("beforeunload", function (event) {
         console.log("removing are u sure u wanna leave check")
         event.returnValue = "Hellooww"
     })
 }

  render() {
    return (
      <Layout>
     {console.log(this.props)}
        <h2>Room #{this.props.room}</h2>
        <div className="container">
          <BattleBox />
          <Logs />
        </div>
      </Layout>
    );
  }
}

export default withRouter(Battle);
