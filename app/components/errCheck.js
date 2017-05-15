inputValidation(field_key) {
  var tFieldKey = typeof field_key;
  if (tFieldKey != type || tFieldKey === 'number' && isNaN(field_key) ) {
}

var validationErrors = {
  numMessage : 'Enter numbers only',
  numOverMaxMessage :'Please enter a number over zero but under ' + max,
  underMinMessage: 'Please enter more than ' + min + 'characters'
  }
}

//switch against types passed in....
//if type === number
// change str to num
//field_key = +[field];

switch (value) {
  case (type === 'number'):
  field_key = +[field];
  if(isNaN(field_key)){
    console.log('Enter numbers only please');
  }
}











/*
errCheckOccurences(){
  if (value) {
    this.state.message = '';
    let i = value['occurences'];
    console.log(i);
    let max = formInfo['fields'][1]['constraints']['maximum'];
    if(isNaN(i) || i.length > 1 || i > max){
      this.state.message = 'Ya done messed up A A RON';
    }
  }
  this.setState({ value });
  }
}


if (value) {
  this.state.message = '';
  let n = +value['occurences'];
  let max = formInfo['fields'][1]['constraints']['maximum'];
  if(isNaN(n) || n <= 0 || n > max){
    this.state.message = 'Ya done messed up A A RON';
  }
}
this.setState({ value });
}





//  05/2/17 3:56 pm
// 4:02 pm
// 4:16 pm
// 4:56 pm
// 5:44 pm

onChange(value) {
  this.errCheck(value);
}

errCheck(value) {
  const formInfo = this.props.navigation.state.params.form;
  let typeStr, typeNum, n, s;

    // Value from occurences, should be numbers
    nValue = typeof value['occurences'];
    // Value from description, should be text or numbers
    sValue = typeof value['description'];
    // Type sting or number?
    typeStr = formInfo['fields'][0]['type'];
    typeNum = formInfo['fields'][1]['type'];

   if (sValue) {
     this.setState({ message: ''});
     s = value['description'];
     let min = formInfo['fields'][0]['constraints']['minimum_length'];

     if (sValue != typeStr || s.length < min || s.length <= 0){
      this.setState({ message: 'Please enter 5 or more characters for the description'});
    }
  }
  if (nValue) {
    let n = +value['occurences'];
    let max = formInfo['fields'][1]['constraints']['maximum'];

    if (isNaN(n) || n <= 0){
      console.log(value['occurences']);
      this.setState({ message: 'Numbers only please'});
    } else if (n > max) {
      this.setState({message: 'Occurences must be less than ' + max});
    }
  }
  this.setState({ value });
}



// Redux action
let messageAction = {
  type: 'CHANGE_MESSAGE',
  message: ''
}
*/
