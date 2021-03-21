const global = {
  fillCanvas: function fillCanvas($canvas, logs) {
    var hourAvg = Array.from({ length: 24 }, () => { return [] });
    for (const log of logs) {
      const hour = moment(log.timestamp).format('H');
      hourAvg[hour].push(log.level);
    }
    hourAvg = hourAvg.map(function (value) {
      if (value.length) {
        let average = (array) => array.reduce((a, b) => a + b) / array.length;
        value = average(value);
      } else {
        value = null;
      }
      return value;
    });
    // Fill canvas
    new Chart($canvas[0].getContext('2d'), {
      type: 'line',
      data: {
        labels: Array.from({ length: 24 }, (value, index) => {
          return index;
        }),
        datasets: [{
          label: moment().format('YYYY-MM-DD'),
          data: hourAvg,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              suggestedMax: 10
            }
          }]
        }
      }
    });
  }
};

$(function() {
  // CUSTOM COMPLEMENTS
  // Update range value on changes 
  $('html, body').on('change', '.range-input input[type="range"]', function(e) {
    const value = $(e.currentTarget).val();
    $(e.currentTarget).closest('.range-input').find('.range-value').text(value);
  });

  // Init date time picker
  $('.date_time_picker').datetimepicker({
    uiLibrary: 'bootstrap4'
  });

  // Init date picker
  $('.date_picker').datepicker({
    uiLibrary: 'bootstrap4',
    format: 'yyyy-mm-dd'
  });

  // Initialize today chart
  if (typeof _todayLogs != 'undefined') {
    const $canvas = $('#myChart');
    global.fillCanvas($canvas, _todayLogs);
  }

  // Events
  $('form#animo').on('submit', function(e) {
    e.preventDefault();
    var formInputs = {};
    $(e.currentTarget).serializeArray().map(function(x) {
      formInputs[x.name] = x.value
    });
    $.ajax({
      url: '/log/add',
      type: 'POST',
      data: {
        time: moment().utc().toJSON(),
        ...formInputs
      }
    });
  });

  $('form#consultar').on('submit', function (e) {
    e.preventDefault();
    var formInputs = {};
    $(e.currentTarget).serializeArray().map(function(x) {
      formInputs[x.name] = x.value
    });
    $.ajax({
      url:  `/log/date`,
      type: 'POST',
      data: formInputs
    }).done(function(result) {
      if (result) {
        const $canvas = $('#myChart');
        global.fillCanvas($canvas, result);
      } else {
        $('#no_registros').modal('show');
      }
    });
  });
});