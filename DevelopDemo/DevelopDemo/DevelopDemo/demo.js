require('UIView, UIColor, UILabel')
require('UIScreen')
defineClass('DataViewController', {
  // replace the -genView method
  genView: function () {
    var view = self.ORIGgenView();
    view.setBackgroundColor(UIColor.greenColor())
    var label = UILabel.alloc().initWithFrame(view.frame());
    label.setText("JSPatch");
    label.setTextAlignment(1);
    view.addSubview(label);

    var imageView = require('UIImageView').alloc().init();
    imageView.setFrame({x:0, y:0, width:UIScreen.mainScreen().bounds().width, height:150});
    imageView.setBackgroundColor(UIColor.grayColor());
    view.addSubview(imageView);

//    imageView.setImage(require('UIImage').imageNamed('TestImage'));
    var imageFile = require('NSBundle').mainBundle().pathForResource_ofType("TestImage", 'png');
    console.log(imageFile);
    imageView.setImage(require('UIImage').imageWithContentsOfFile(require('NSBundle').mainBundle().pathForResource_ofType("TestImage", 'png')));

    return view;
  }
});

//var alertView = require('UIAlertView').alloc().init();
//alertView.setTitle('Alert');
//alertView.setMessage('AlertView from js');
//alertView.addButtonWithTitle('OK');
//alertView.show();
//console.log(alertView);
