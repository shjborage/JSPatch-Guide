require('UIView, UIColor, UILabel')

defineClass('DataViewController', {
  viewWillAppear: function(animated) {
    self.super().viewWillAppear(animated);
    //self.dataLabel().setText(self.dataObject().description() + "Test");
    //var dataDesc = require('NSString').string().stringByAppendingString(self.dataObject().description());
    var dataDesc = self.dataObject().description();
    dataDesc = dataDesc.stringByAppendingString(' Test');
    //var dataDesc = require('NSString').string().stringByAppendingString(self.dataObject().description()).stringByAppendingString(' Test');
    self.dataLabel().setText(dataDesc);
  }
});

//var alertView = require('UIAlertView').alloc().init();
//alertView.setTitle('Alert');
//alertView.setMessage('AlertView from js');
//alertView.addButtonWithTitle('OK');
//alertView.show();
//console.log(alertView);
