(function(){

  if (!window.addEventListener || !window.localStorage || !window.requestAnimationFrame)
    return;

  var options = INSTALL_OPTIONS;

  function ensureProtocol(url) {
    if (!url || url === '') {
      return url;
    }
    if (!/^https?:\/\//i.test(url) && /^[^\/]+\.[^\/]+\//.test(url)) {
      return 'http://' + url;
    }
    return url;
  }

  function setOptions(opts) {
    options = opts;

    render();

    if (!shown)
      show();
  }

  var backdrop = document.createElement('eager-fireworks-backdrop');
  document.body.appendChild(backdrop);

  var dialog = document.createElement('eager-fireworks-dialog');
  document.body.appendChild(dialog);

  var content = document.createElement('eager-fireworks-dialog-content');
  dialog.appendChild(content);

  var closeButton = document.createElement('eager-fireworks-dialog-close');
  closeButton.addEventListener('click', hide);

  function render() {
    dialog.setAttribute('eager-fireworks-theme', options.theme);

    var html = '';
    if (options.image) {
      if (options.link) {
        html += '<a href="' + ensureProtocol(options.link) + '">';
      }
      html += '<img src="' + options.image + '">';
      if (options.link) {
        html += '</a>';
      }
    }

    if (options.heading || options.message.html !== '') {
      html += '<eager-fireworks-dialog-content-text>';

      if (options.heading) {
        html += '<h2>' + options.heading + '</h2>';
      }
      html += options.message.html;
      html += '</eager-fireworks-dialog-content-text>';
    }

    content.innerHTML = html;
    content.appendChild(closeButton);
  }

  dialog.addEventListener('click', function(e){
    if (e.target === dialog && shown){
      hide();
      e.preventDefault();
    }
  });

  var shown = false;

  function show() {
    INSTALL_SCOPE.fireworks.start();

    render();
    dialog.className = 'eager-is-fireworks-shown';
    backdrop.className = 'eager-is-fireworks-shown';
    shown = true;

    try {
      localStorage.eagerFireworksShown = JSON.stringify(options);
    } catch (e) {}

    document.body.scrollTop = 0;
  }

  function hide() {
    INSTALL_SCOPE.fireworks.stop();

    dialog.className = '';
    backdrop.className = '';
    shown = false;
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
