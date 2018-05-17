import React, {Component} from 'react';
import {merge} from "lodash";
import defaultStyle from "./defaultStyle";
import defaultMentionStyle from "./defaultMentionStyle";
import {Mention, MentionsInput} from "react-mentions";

class RecoveryPhraseTextArea extends Component {
  constructor(props) {
    super(props);
    this.style = merge({}, defaultStyle, {
      input: {
        overflow: 'auto',
        height: 70,
      },
    });
    this.state = {
      aValue: '',
    };
  }

  handleChange(event) {
    this.setState({
      aValue: event.target.value,
    });
    console.log(this.state.aValue)
  }

  render() {
    return (
      <MentionsInput
        value={this.state.aValue}
        onChange={this.handleChange.bind(this)}
        style={this.style}
      >
        <Mention
          trigger={/(([^\s]+))$/}
          data={search => this.props.dictionary.filter(w => w.startsWith(search)).slice(0, 10).map(w => {
            return {id: w, display: w}
          })}
          style={defaultMentionStyle}
        />
      </MentionsInput>
    );
  }
}

export default RecoveryPhraseTextArea;