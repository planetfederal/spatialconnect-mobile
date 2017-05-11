import React, { PropTypes } from 'react';

const TextField = ({
  text,
  placeholder,
  showError,
  onFieldChanged,
  errorText
}) => {
  const shouldDisplayError = this.props.showError && this.props.errorText !== '';

  return (
    <div>
      <input
        type="text"
        value={this.props.text}
        onChange={this.props.onFieldChanged}
      />
      {shouldDisplayError &&
        <div className="validation-error">
          <span className="text">{this.props.errorText}</span>
        </div>}
    </div>
  );
};

TextField.propTypes = {
  text: PropTypes.string,
  //placeholder: PropTypes.string,
  showError: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  errorText: PropTypes.string,
};

export default TextField;
