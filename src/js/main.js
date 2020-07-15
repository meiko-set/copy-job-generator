//-----------------------------------------------------------------------------
/* CopyJob */
//-----------------------------------------------------------------------------
function CopyJob() {
  // default options
  this.defaultOptions={
    'author':'Anonymous',
    'source':'',
    'destination':'',
    'language':'Batch',
    'userInfos':false,
    'batchOptions':'Xcopy'    
  };
  this.options=Object.assign({}, this.defaultOptions);
}
CopyJob.prototype.init = function() {
  var ths=this;
  /* radio click listener */
  this.getLanguageElements().on('change', $.proxy(this.setBatchOptionsVisibility, this));
  this.getBatchOptionsElements().on('change', $.proxy(this.setBatchOptionsGroupVisibility, this));

  /* form click listener */
  this.getSubmitElement().click(function() { ths.submitForm(); });
  this.getLanguageSelectorElements().click(function() {
    $.i18n({locale:$(this).data('lang')});
    $('*[data-i18n]').i18n();
  });

  /* xcopy add/remove buttons */
  this.getBatchXcopyOptionsExcludeAddElement().on('click', $.proxy(this.addBatchXcopyOptionsExcludeElement, this));
  this.getBatchXcopyOptionsExcludeRemoveElement().on('click', $.proxy(this.removeBatchXcopyOptionsExcludeElement, this));

  this.setBatchOptionsVisibility();
}
/* some element getters */
CopyJob.prototype.getAuthorElement = function() { return $('#inputAuthor'); }
CopyJob.prototype.getBatchOptionsElements = function() { return $('input[type="radio"].batch-options'); }
CopyJob.prototype.getBatchLanguageGroupElement = function() {return $('.batch-option-group'); }
CopyJob.prototype.getBatchOptionRobocopyElement = function() { return $('#inputBatchOptionRobocopy'); }
CopyJob.prototype.getBatchOptionXcopyElement = function() { return $('#inputBatchOptionXcopy'); }
CopyJob.prototype.getBatchXcopyOptionElements = function() { return $('input.batch-xcopy-options'); }
CopyJob.prototype.getBatchXcopyOptionDateElement = function() { return $('#batchXcopyOption-d-date'); }
CopyJob.prototype.getBatchXcopyOptionGroupElement = function() { return $('.batch-xcopy-option-group'); }
CopyJob.prototype.getDestinationElement = function() { return $('#inputDestination'); }
CopyJob.prototype.getFormElement = function() { return $('form'); }
CopyJob.prototype.getLanguageBatchElement = function() { return $('#inputLanguageBatch'); }
CopyJob.prototype.getLanguageElements = function() { return $('input[type="radio"].language'); }
CopyJob.prototype.getLanguagePowershellElement = function() { return $('#inputLanguagePowershell'); }
CopyJob.prototype.getLanguageSelectorElements = function() { return $('#language-selector a'); }
CopyJob.prototype.getOutputElement = function() { return $('#output'); }
CopyJob.prototype.getSourceElement = function() { return $('#inputSource'); }
CopyJob.prototype.getSubmitElement = function() { return $('#submit'); }
CopyJob.prototype.getUserInfoElement = function() { return $('#inputUserInfos'); }
CopyJob.prototype.getBatchXcopyOptionsExcludeAddElement = function() { return $('#batchXcopyOptions-exclude-add'); }
CopyJob.prototype.getBatchXcopyOptionsExcludeRemoveElement = function() { return $('#batchXcopyOptions-exclude-remove'); }
CopyJob.prototype.getBatchXcopyOptionsExcludeInputContainer = function() { return $('#batchXcopyOptions-exclude-input-container'); }

CopyJob.prototype.isBatch = function() { return this.options.language==this.getLanguageBatchElement().val(); }
CopyJob.prototype.isBatchXcopy = function() { return this.options.batchOptions==this.getBatchOptionXcopyElement().val(); }
CopyJob.prototype.isBatchRobocopy = function() { return this.options.batchOptions==this.getBatchOptionRobocopyElement().val(); }
CopyJob.prototype.isPowershell = function() { return this.options.language==this.getLanguagePowershellElement().val(); }

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
    this.getBatchLanguageGroupElement().removeClass('hide');
  } else {
    this.getBatchLanguageGroupElement().addClass('hide');
  }
  $.proxy(this.setBatchOptionsGroupVisibility, this, event)();
}
CopyJob.prototype.setBatchOptionsGroupVisibility = function(event) {
  var selectedEl=this.getBatchOptionsElements().filter(':checked');
  var isBatchActive=!this.getBatchLanguageGroupElement().hasClass('hide');
  if(isBatchActive && selectedEl.val()==this.getBatchOptionXcopyElement().val()) {
    this.getBatchXcopyOptionGroupElement().removeClass('hide');
  } else {
    this.getBatchXcopyOptionGroupElement().addClass('hide');
  }
}
CopyJob.prototype.addBatchXcopyOptionsExcludeElement = function(event) {
  var lastEl=this.getBatchXcopyOptionsExcludeInputContainer().find('.batchXcopyOptions-exclude-input:last');
  var clone=lastEl.clone();
  var cloneInputEl=$(clone).find('input');
  cloneInputEl.val(null);
  var idx=parseInt(cloneInputEl.attr('data-id'));
  cloneInputEl.removeClass('batchXcopyOptions-exclude-input-'+idx);
  idx++;
  cloneInputEl.addClass('batchXcopyOptions-exclude-input-'+idx);
  cloneInputEl.attr('data-id', idx);
  this.getBatchXcopyOptionsExcludeInputContainer().append(clone);
}
CopyJob.prototype.removeBatchXcopyOptionsExcludeElement = function(event) {
  var lastEl=this.getBatchXcopyOptionsExcludeInputContainer().find('.batchXcopyOptions-exclude-input:last');
  if(parseInt(lastEl.find('input').attr('data-id'))>1) {
    lastEl.remove();
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
  var options=this.copyJobGeneratorBatch.copyJobGenerator.copyJob.getBatchXcopyOptionElements().filter(':checked');
  var optStr='';
  var ths=this;
  $.each(options, function(idx, el) {
    var postfix=' ';
    if($(el).val()=='d' && ths.copyJobGeneratorBatch.copyJobGenerator.copyJob.getBatchXcopyOptionDateElement().val()) {
      postfix=':'+ths.copyJobGeneratorBatch.copyJobGenerator.copyJob.getBatchXcopyOptionDateElement().val()+' ';
    }    
    optStr+='/'+$(el).val()+postfix;
  });
  var batchXcopyOptionsExcludeInputs=this.copyJobGeneratorBatch.copyJobGenerator.copyJob.getBatchXcopyOptionsExcludeInputContainer().find('input');
  var addExclude=false;
  var addExcludeStr='/exclude:';
  $.each(batchXcopyOptionsExcludeInputs, function(idx, el) {
    el=$(el);
    if(el.val()) {
      addExclude=true;
      addExcludeStr+=el.val()+'+';
    }
  });
  if(addExclude) {
    optStr+=(addExcludeStr.substring(0, addExcludeStr.length - 1));
  }
  return "XCOPY " + this.copyJobGeneratorBatch.copyJobGenerator.copyJob.options.source + " " + this.copyJobGeneratorBatch.copyJobGenerator.copyJob.options.destination + ' ' + optStr;
}; 

//-----------------------------------------------------------------------------
/* RobocopyGenerator */
//-----------------------------------------------------------------------------
function RobocopyGenerator(copyJobGeneratorBatch) {
  this.copyJobGeneratorBatch=copyJobGeneratorBatch;
};
RobocopyGenerator.prototype.generate = function() {
  return "ROBOCOPY - NOT IMPLEMENT YET";
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
    content+=this.copyJobGenerator.getHtmlIndention(2) + 'ECHO User: %user%' + this.copyJobGenerator.getHtmlLineBreak(2);
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
	return 'POWERSHELL - NOT IMPLEMENT YET';
}

//-----------------------------------------------------------------------------
/* initialization */
//-----------------------------------------------------------------------------
$(function() {

  var userLang = navigator.language || navigator.userLanguage;  
  var lang='de';
  if(userLang.split('-')[0]=='de' || 
     userLang.split('-')[0]=='en') {
     lang=userLang.split('-')[0]; 
  }
  
  $.i18n({locale: lang}).load({
    'de':'/languages/de.json', 
    'en':'/languages/en.json'}).done(function() {
      $('*:not([data-i18n=""])').i18n();      

  });
  

 $('.datepicker').datepicker({format:'mm-dd-yyyy', 'todayBtn':true, 'todayHighlight':true});
  
  var copyJob=new CopyJob();
  copyJob.init();
});
