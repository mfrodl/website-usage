document.addEventListener('DOMContentLoaded', function(event) {
  // Draw chart
  drawChart();

  // Clear history when link clicked
  document.getElementById('clear').addEventListener('click', function() {
    // Clear site statistics
    chrome.storage.local.clear();

    // Update time since when statistics are collected
    var since = (new Date).toUTCString();
    chrome.storage.local.set({since: since});

    // Redraw chart
    drawChart();
  });
});

// Draw chart of browsing statistics
var drawChart = function() {
  chrome.storage.local.get(null, function(items) {
    var since = items.since;
    delete items.since;

    // Remove old chart if present
    var pieChart = document.getElementById('pieChart');
    while (pieChart.firstChild) {
      pieChart.removeChild(pieChart.firstChild);
    }

    // Chart parameters
    var chartParams = {
      'header': {
        'title': {
          'text': 'Browsing statistics',
          'fontSize': 24
        },
        'subtitle': {
          'text': 'Since ' + since,
          'color': '#999999',
          'fontSize': 12
        },
        'location': 'pie-center',
        'titleSubtitlePadding': 9
      },
      'size': {
        'canvasWidth': 780,
        'canvasHeight': 480,
        'pieInnerRadius': '85%',
        'pieOuterRadius': '90%'
      },
      'data': {
        'sortOrder': 'value-desc',
        'smallSegmentGrouping': {
          'enabled': true,
          'value': 2
        },
        'content': Object.keys(items).map(
          key => ({'label': key, 'value': items[key]})
        )
      },
      'labels': {
        'outer': {
          'format': 'label-percentage1',
          'pieDistance': 32
        },
        'inner': {
          'format': 'none'
        },
        'mainLabel': {
          'fontSize': 12
        },
        'percentage': {
          'color': '#999999',
          'fontSize': 12,
          'decimalPlaces': 0
        },
        'lines': {
          'enabled': true
        },
        'truncation': {
          'enabled': true
        }
      },
      'tooltips': {
        'enabled': true,
        'type': 'placeholder',
        'string': '{label}: {percentage}%',
        'styles': {
          'backgroundOpacity': 1
        }
      },
      'effects': {
        'pullOutSegmentOnClick': {
          'effect': 'linear',
          'speed': 400,
          'size': 8
        }
      },
      'misc': {
        'gradient': {
          'enabled': true,
          'percentage': 100
        }
      }
    }

    // Show placeholder if no browsing data available
    if (Object.keys(items).length == 0) {
      Object.assign(chartParams, {
        'labels': {
          'outer': {
            'format': 'none'
          },
          'inner': {
            'format': 'none'
          }
        },
        'data': {
          'content': [{
            'value': 1,
            'color': '#cccccc'
          }]
        },
        'tooltips': {
          'enabled': false
        }
      });
    }

    // Draw new chart
    var pie = new d3pie('pieChart', chartParams);
  });
};
