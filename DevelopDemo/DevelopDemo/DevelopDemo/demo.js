require('UIView, UIColor, UILabel');
require('UIScreen');

include('SQNewClassTest.js');

defineClass('DataViewController', {
  // replace the -genView method
  genView: function () {
    var view = self.ORIGgenView();
    view.setFrame({x:0, y:100, width:UIScreen.mainScreen().bounds().width, height:300});
    view.setBackgroundColor(UIColor.greenColor())
    var label = UILabel.alloc().initWithFrame(view.frame());
    label.setText("JSPatch");
    label.setTextAlignment(1);
    view.addSubview(label);

    var imageView = require('UIImageView').alloc().init();
    imageView.setFrame({x:0, y:50, width:UIScreen.mainScreen().bounds().width, height:150});
    imageView.setBackgroundColor(UIColor.grayColor());
    view.addSubview(imageView);

//    imageView.setImage(require('UIImage').imageNamed('TestImage'));
    var imageFile = require('NSBundle').mainBundle().pathForResource_ofType("TestImage", 'png');
    console.log(imageFile);
    imageView.setImage(require('UIImage').imageWithContentsOfFile(require('NSBundle').mainBundle().pathForResource_ofType("TestImage", 'png')));

    return view;
  }
});


require('DataViewController').testBlock(block("NSString *, BOOL", function(ctn, succ) {
  if (succ) {
    console.log(ctn);  //output: I'm content
  } else {
    console.log(false);  //output: I'm content
  }
}))

var block = DataViewController.genBlock();
block({"asdf":2, 'v':'1.0'});

//var alertView = require('UIAlertView').alloc().init();
//alertView.setTitle('Alert');
//alertView.setMessage('AlertView from js');
//alertView.addButtonWithTitle('OK');
//alertView.show();
//console.log(alertView);
