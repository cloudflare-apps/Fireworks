(function(){

  if (!window.addEventListener)
    return;

  var options = INSTALL_OPTIONS;

  function setOptions(opts) {
    options = opts;

    render();

    if (!shown)
      show();
  }

  var dialog = document.createElement('eager-dialog');
  document.body.appendChild(dialog);

  var content = document.createElement('eager-dialog-content');
  dialog.appendChild(content);

  var closeButton = document.createElement('eager-dialog-close');
  dialog.appendChild(closeButton);
  closeButton.addEventListener('click', hide);

  function render() {
    var text = '';
    if (options.heading){
      text += '<h2>' + options.heading + '</h2>';
    }

    if (options.image) {
      text += '<img src="' + options.image + '">';
    }

    text += options.message.html;

    content.innerHTML = text;
  }

  function handleClick(e) {
    if (!shown)
      return

    var currentNode = e.target;

    do {
      if (!currentNode || currentNode == document.documentElement) {
        e.preventDefault();
        hide();
        return;
      }

      if (currentNode.tagName == 'A') {
        return;
      }

      if (currentNode == content) {
        if (options.link) {
          e.preventDefault();
          document.location = options.link;
        }

        return;
      }
    } while (currentNode = currentNode.parentNode);
  }

  var shown = false;

  function show() {
    INSTALL_SCOPE.fireworks.start();

    render();
    dialog.className = 'eager-dialog-shown';
    dialog.style.top = (document.body.scrollTop + 10) + 'px';

    shown = true;
    localStorage.eagerFireworksShown = JSON.stringify(options);

    document.documentElement.addEventListener('click', handleClick);
  }

  function hide() {
    INSTALL_SCOPE.fireworks.stop();

    dialog.className = '';
    shown = false;

    document.documentElement.removeEventListener('click', handleClick);
  }

  var IS_PREVIEW = INSTALL_ID === 'preview';
  var ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

  var outsideDates = false;
  if (!IS_PREVIEW){
    if (options.hideBeforeToggle && options.hideBefore){
      if (new Date(options.hideBefore) > new Date())
        outsideDates = true;
    }
    if (options.hideAfterToggle && options.hideAfter){
      if ((+new Date(options.hideAfter) + ONE_DAY_IN_MS) < new Date())
        outsideDates = true;
    }
  }

  var alreadyShown = localStorage.eagerFireworksShown && localStorage.eagerFireworksShown === JSON.stringify(options);

  if ((!outsideDates && !alreadyShown) || IS_PREVIEW)
    show();

  INSTALL_SCOPE.setOptions = setOptions;

})();
