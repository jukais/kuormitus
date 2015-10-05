var loadtest = require('loadtest');
var blessed = require('blessed');
var fs = require('fs');

var options = JSON.parse(fs.readFileSync(process.argv[2] || 'localhost.json', 'utf8'));

options.statusCallback = statusCallback;

var screen = blessed.screen();
var statusBox = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 10,
      tags: true,
      border: 'line',
      style: {
        fg: 'blue',
        bg: 'black',
        bold: true,
        border: {
          fg: 'blue',
          bg: 'black'
        }
      }
    });
var info = blessed.box({
          top: 13,
          left: 0,
          width: '100%',
          height: 10,
          tags: true
        });

var progressBar = blessed.progressbar({
  border: 'line',
  style: {
    fg: 'blue',
    bg: 'default',
    bar: {
      bg: 'default',
      fg: 'blue'
    },
    border: {
      fg: 'default',
      bg: 'default'
    }
  },
  ch: ':',
  width: '100%',
  height: 3,
  top: 10,
  left: 0,
  filled: 0
});

screen.append(statusBox);
screen.append(progressBar);
screen.append(info);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

log('{left}Tests started{/left}');

function status(text) {
  statusBox.setContent(text);
  screen.render();
}
function progress(amount) {
  progressBar.setProgress(amount);
  screen.render();
}
function log(text) {
  info.setContent(text);
  screen.render();
}

function statusCallback(result) {
      status(require('util').inspect(result, {colors: true}));
      progress(result.totalRequests / options.maxRequests * 100);
}


loadtest.loadTest(options, function(error) {
    if (error) {
        return log('Got an error: %s', error);
    }
    setTimeout(function(){
      log('{right}Tests run {blink}successfully{/blink}{/right}');
    },0);
});
