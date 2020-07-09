//-----------------------------------------------------------------------------
/* CopyJob */
//-----------------------------------------------------------------------------
function CopyJob() {
  // default options
  this.defaultOptions={
    'author':'Anonymous',
    'language':'Batch',
    'userInfos':false,
    'batchOptions':'Xcopy'
  };
  this.options=Object.assign({}, this.defaultOptions);
}
CopyJob.prototype.init = function() {
  var ths=this;
  /* radio click listener */
  //this.getLanguageElements().on('change', {context:this}, this.setBatchOptionsVisibilityEventHandler);
  //this.getLanguageElements().change(this.setBatchOptionsVisibility)
  this.getLanguageElements().on('change', $.proxy(this.setBatchOptionsVisibility, this));

  /* form click listener */
  this.getSubmitElement().click(function() {
    ths.submitForm();
  });

  this.setBatchOptionsVisibility();
}
/* some element getters */
CopyJob.prototype.getFormElement = function() {
  return $('form');
}
CopyJob.prototype.getAuthorElement = function() {
  return $('#inputAuthor');
}
CopyJob.prototype.getOutputElement = function() {
  return $('#output');
}
CopyJob.prototype.getLanguageBatchElement = function() {
  return $('#inputLanguageBatch');
}
CopyJob.prototype.getUserInfoElement = function() {
  return $('#inputUserInfos');
}
CopyJob.prototype.getLanguagePowershellElement = function() {
  return $('#inputLanguagePowershell');
}
CopyJob.prototype.getLanguageElements = function() {
  return $('input[type="radio"].language');
}
CopyJob.prototype.getBatchOptionXcopyElement = function() {
  return $('#inputBatchOptionXcopy');
}
CopyJob.prototype.getBatchOptionRobocopyElement = function() {
  return $('#inputBatchOptionRobocopy');
}
CopyJob.prototype.getSubmitElement = function() {
  return $('#submit');
}
CopyJob.prototype.isBatch = function() {
  return this.options.language==this.getLanguageBatchElement().val();
}
CopyJob.prototype.isBatchXcopy = function() {
  return this.options.batchOptions==this.getBatchOptionXcopyElement().val();
}
CopyJob.prototype.isBatchRobocopy = function() {
  return this.options.batchOptions==this.getBatchOptionRobocopyElement().val();
}
CopyJob.prototype.isPowershell = function() {
  return this.options.language==this.getLanguagePowershellElement().val();
}

/* submit form handler */
CopyJob.prototype.submitForm = function() {
  this.getOutputElement().removeClass('hide');
  // reset options
  this.options=Object.assign({}, this.defaultOptions);
  var ths=this;
  // get options from form
  $.each(this.getFormElement().serializeArray(), function(idx,el) {
    if(el.name && typeof(ths.options[el.name])!='undefined') {
        if(el.name===ths.getUserInfoElement().attr('name') && el.value==='on')
          el.value=true;
        if(el.name===ths.getAuthorElement().attr('name') && el.value==='')
          el.value=ths.defaultOptions.author;
        ths.options[el.name]=el.value;
    } 
  });
  // start script generation
  var generator=new CopyJobGenerator(this);
  var script=generator.generate();
  this.getOutputElement().html(script);
}
/* set batch options visiblility */
CopyJob.prototype.setBatchOptionsVisibility = function(event) {
  var selectedEl=this.getLanguageElements().filter(':checked');
  if(selectedEl.val()==this.getLanguageBatchElement().val()) {
    $('.batch-option-group').removeClass('hide');
  } else {
    $('.batch-option-group').addClass('hide');
  }
}

//-----------------------------------------------------------------------------
/* CopyJobGenerator */
//-----------------------------------------------------------------------------
function CopyJobGenerator(copyJob){
    this.copyJob=copyJob;
    this.htmlLinebreak='<br>';
    this.hmtlIndention='&nbsp;';
}
CopyJobGenerator.prototype.getHtmlLineBreak = function(number) {
  var number=number||1;
  return this.htmlLinebreak.repeat(number);
}
CopyJobGenerator.prototype.getHtmlIndention = function(number) {
  var number=number||1;
  return this.hmtlIndention.repeat(number);
}
CopyJobGenerator.prototype.generate = function() {
    if(this.copyJob.isBatch())
      return new CopyJobGeneratorBatch(this).generate();
    if(this.copyJob.isPowershell())
      return new CopyJobGeneratorPowershell(this).generate();
    return false;
    
}

//-----------------------------------------------------------------------------
/* XcopyGenerator */
//-----------------------------------------------------------------------------
function XcopyGenerator(copyJobGeneratorBatch) {
  this.copyJobGeneratorBatch=copyJobGeneratorBatch;
};
XcopyGenerator.prototype.generate = function() {
  return "xcopy";
}; 

//-----------------------------------------------------------------------------
/* RobocopyGenerator */
//-----------------------------------------------------------------------------
function RobocopyGenerator(copyJobGeneratorBatch) {
  this.copyJobGeneratorBatch=copyJobGeneratorBatch;
};
RobocopyGenerator.prototype.generate = function() {
  return "robocopy";
};  

//-----------------------------------------------------------------------------
/* CopyJobGeneratorBatch */
//-----------------------------------------------------------------------------
function CopyJobGeneratorBatch(copyJobGenerator){
    this.copyJobGenerator=copyJobGenerator;
    if(this.copyJobGenerator.copyJob.isBatchXcopy()) {
      this.generator=new XcopyGenerator(this);
    }
    if(this.copyJobGenerator.copyJob.isBatchRobocopy()) {
      this.generator=new RobocopyGenerator(this);
    }
}
CopyJobGeneratorBatch.prototype.generate = function() 
{ 
  var content=':: Script generated by ' + this.copyJobGenerator.copyJob.options.author + this.copyJobGenerator.getHtmlLineBreak(2);
  content+='@ECHO OFF' + this.copyJobGenerator.getHtmlLineBreak(2);
  if(this.copyJobGenerator.copyJob.options.userInfos==true)
  {
    content+='FOR /f "tokens=3 delims=\" %%i IN ("%USERPROFILE%") DO (SET user=%%i) 2>&1' + this.copyJobGenerator.getHtmlLineBreak();
    content+=this.copyJobGenerator.getHtmlIndention(2) + 'ECHO User: %user%' + this.copyJobGenerator.getHtmlLineBreak();
  }
  content+=this.generator?this.generator.generate():null; 
  return content;
}

//-----------------------------------------------------------------------------
/* CopyJobGeneratorPowershell */
//-----------------------------------------------------------------------------
function CopyJobGeneratorPowershell(copyJobGenerator){
    this.copyJobGenerator=copyJobGenerator;    
}
CopyJobGeneratorPowershell.prototype.generate = function() {
	return 'Hello ' + this.copyJobGenerator.copyJob.options.author + ',<br>' + 'You choise is: Windows Powershell' + '<br>' + 'with user infos: ' + this.copyJobGenerator.copyJob.options.userInfos;
}

//-----------------------------------------------------------------------------
/* initialization */
//-----------------------------------------------------------------------------
var copyJob=new CopyJob();
copyJob.init();