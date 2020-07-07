$('#submit').click(function() {
  $('#output').removeClass('hide');
  // default options
  var options={
    'author':'Anonymous',
    'language':'Batch',
    'userInfos':false
  };
  //console.log($('form').serializeArray());
  // get options from form
  $.each($('form').serializeArray(), function(idx,el) {
    if(el.name && typeof(options[el.name])!='undefined') {
        if(el.name==='userInfos' && el.value==='on')
          el.value=true;
        if(el.name==='author' && el.value==='')
          el.value=options.author;
        options[el.name]=el.value;
    }
  });
  // start script generation
  //console.log(options);
  var generator=new CopyJobGenerator(options);
  var script=generator.generate();
  $('#output').html(script);
});

function CopyJobGenerator(options){
    this.options=options;
    this.htmlLinebreak='<br>';
}
CopyJobGenerator.prototype.generate = function() {
    if(this.options.language=='Batch')
      return new CopyJobGeneratorBatch(this.options).generate();
    if(this.options.language=='Powershell')
      return new CopyJobGeneratorPowershell(this.options).generate();
    return false;
    
}

function CopyJobGeneratorBatch(options){
    this.options=options;    
}
CopyJobGeneratorBatch.prototype.generate = function() {

    console.log(this.options);
	return 'Hello ' + this.options.author + ',<br>' + 'You choice is: Windows Batch' + '<br>' + 'with user infos: ' + this.options.userInfos;
}
function CopyJobGeneratorPowershell(options){
    this.options=options;    
}
CopyJobGeneratorPowershell.prototype.generate = function() {
	return 'Hello ' + this.options.author + ',<br>' + 'You choise is: Windows Powershell' + '<br>' + 'with user infos: ' + this.options.userInfos;
}