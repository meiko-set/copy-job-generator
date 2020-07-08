/* CopyJob */
function CopyJob() {
  // default options
  this.options={
    'author':'Anonymous',
    'language':'Batch',
    'userInfos':false
  };
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
CopyJob.prototype.getSubmitElement = function() {
  return $('#submit');
}
CopyJob.prototype.isBatch = function() {
  return this.options.language==this.getLanguageBatchElement().val();
}
CopyJob.prototype.isPowershell = function() {
  return this.options.language==this.getLanguagePowershellElement().val();
}

/* submit form handler */
CopyJob.prototype.submitForm = function() {
  this.getOutputElement().removeClass('hide');
  // get options from form
  var ths=this;
  $.each(this.getFormElement().serializeArray(), function(idx,el) {
    if(el.name && typeof(ths.options[el.name])!='undefined') {
        if(el.name===ths.getUserInfoElement().attr('name') && el.value==='on')
          el.value=true;
        if(el.name===ths.getAuthorElement().attr('name') && el.value==='')
          el.value=ths.options.author;
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

/* CopyJobGenerator */
function CopyJobGenerator(copyJob){
    this.copyJob=copyJob;
    this.htmlLinebreak='<br>';
}
CopyJobGenerator.prototype.generate = function() {
    if(this.copyJob.isBatch())
      return new CopyJobGeneratorBatch(this).generate();
    if(this.copyJob.isPowershell())
      return new CopyJobGeneratorPowershell(this).generate();
    return false;
    
}

/* CopyJobGeneratorBatch */
function CopyJobGeneratorBatch(copyJobGenerator){
    this.copyJobGenerator=copyJobGenerator;    
}
CopyJobGeneratorBatch.prototype.generate = function() {
	return 'Hello ' + this.copyJobGenerator.copyJob.options.author + ',<br>' + 'You choice is: Windows Batch' + '<br>' + 'with user infos: ' + this.copyJobGenerator.copyJob.options.userInfos;
}

/* CopyJobGeneratorPowershell */
function CopyJobGeneratorPowershell(copyJobGenerator){
    this.copyJobGenerator=copyJobGenerator;    
}
CopyJobGeneratorPowershell.prototype.generate = function() {
	return 'Hello ' + this.copyJobGenerator.copyJob.options.author + ',<br>' + 'You choise is: Windows Powershell' + '<br>' + 'with user infos: ' + this.copyJobGenerator.copyJob.options.userInfos;
}

/* initialization */
var copyJob=new CopyJob();
copyJob.init();

/* add listener */

