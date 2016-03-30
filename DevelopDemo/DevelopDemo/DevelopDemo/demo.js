require('UIView, UIColor, UILabel')
defineClass('DataViewController', {
  // replace the -genView method
  genView: function () {
    var view = self.ORIGgenView();
    view.setBackgroundColor(UIColor.greenColor())
    var label = UILabel.alloc().initWithFrame(view.frame());
    label.setText("JSPatch");
    label.setTextAlignment(1);
    view.addSubview(label);
    return view;
  }
});

//var alertView = require('UIAlertView').alloc().init();
//alertView.setTitle('Alert');
//alertView.setMessage('AlertView from js');
//alertView.addButtonWithTitle('OK');
//alertView.show();
//console.log(alertView);
